import React, { useCallback, useEffect, useRef } from 'react'
import type { CropRegion } from '@/types'

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se'

interface CropOverlayProps {
  containerRef: React.RefObject<HTMLDivElement>
  cropRegion: CropRegion
  aspectRatioValue: number
  displayWidth: number
  displayHeight: number
  imageWidth: number
  imageHeight: number
  rows: number
  cols: number
  // eslint-disable-next-line no-unused-vars
  onCropRegionCommit: (region: CropRegion | null) => void
}

const MIN_HANDLE_SIZE = 60

type DisplayRegion = {
  x: number
  y: number
  width: number
  height: number
}

const CropOverlay: React.FC<CropOverlayProps> = ({
  containerRef,
  cropRegion,
  aspectRatioValue,
  displayWidth,
  displayHeight,
  imageWidth,
  imageHeight,
  rows,
  cols,
  onCropRegionCommit
}) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const displayRegionRef = useRef<DisplayRegion>({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  })
  const interactionRef = useRef<{
    type: 'move' | 'resize'
    handle?: ResizeHandle
    startPointer: { x: number; y: number }
    initialDisplayRegion: DisplayRegion
  } | null>(null)
  const rafRef = useRef<number | null>(null)

  const clampValue = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

  const scaleX = imageWidth > 0 ? displayWidth / imageWidth : 1
  const scaleY = imageHeight > 0 ? displayHeight / imageHeight : 1

  const applyDisplayRegion = useCallback((region: DisplayRegion) => {
    if (!overlayRef.current) return
    overlayRef.current.style.width = `${region.width}px`
    overlayRef.current.style.height = `${region.height}px`
    overlayRef.current.style.transform = `translate(${region.x}px, ${region.y}px)`
  }, [])

  useEffect(() => {
    const nextDisplayRegion: DisplayRegion = {
      x: cropRegion.x * scaleX,
      y: cropRegion.y * scaleY,
      width: cropRegion.width * scaleX,
      height: cropRegion.height * scaleY
    }
    displayRegionRef.current = nextDisplayRegion
    applyDisplayRegion(nextDisplayRegion)
  }, [applyDisplayRegion, cropRegion, scaleX, scaleY])

  const clampRegionToImage = useCallback(
    (region: CropRegion): CropRegion => {
      let { x, y, width, height } = region
      const ratio = aspectRatioValue || 1

      const expectedHeight = width / ratio
      const expectedWidth = height * ratio
      if (Math.abs(expectedHeight - height) <= Math.abs(expectedWidth - width)) {
        height = expectedHeight
      } else {
        width = expectedWidth
      }

      const minWidth = MIN_HANDLE_SIZE / scaleX
      const minHeight = minWidth / ratio
      if (width < minWidth) {
        width = minWidth
        height = width / ratio
      }
      if (height < minHeight) {
        height = minHeight
        width = height * ratio
      }

      if (width > imageWidth) {
        width = imageWidth
        height = width / ratio
      }
      if (height > imageHeight) {
        height = imageHeight
        width = height * ratio
      }

      x = clampValue(x, 0, imageWidth - width)
      y = clampValue(y, 0, imageHeight - height)

      return { x, y, width, height }
    },
    [aspectRatioValue, imageHeight, imageWidth, scaleX]
  )

  const pointerToDisplay = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current
      if (!container) return null
      const rect = container.getBoundingClientRect()
      if (!rect.width || !rect.height) return null
      return {
        x: clampValue(clientX - rect.left, 0, rect.width),
        y: clampValue(clientY - rect.top, 0, rect.height)
      }
    },
    [containerRef]
  )

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const interaction = interactionRef.current
      if (!interaction) return
      const pointer = pointerToDisplay(event.clientX, event.clientY)
      if (!pointer) return
      event.preventDefault()

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }

      rafRef.current = requestAnimationFrame(() => {
        if (!interactionRef.current) return
        if (interaction.type === 'move') {
          const deltaX = pointer.x - interaction.startPointer.x
          const deltaY = pointer.y - interaction.startPointer.y
          const next: DisplayRegion = {
            x: clampValue(
              interaction.initialDisplayRegion.x + deltaX,
              0,
              displayWidth - interaction.initialDisplayRegion.width
            ),
            y: clampValue(
              interaction.initialDisplayRegion.y + deltaY,
              0,
              displayHeight - interaction.initialDisplayRegion.height
            ),
            width: interaction.initialDisplayRegion.width,
            height: interaction.initialDisplayRegion.height
          }
          displayRegionRef.current = next
          applyDisplayRegion(next)
          return
        }

        if (interaction.type === 'resize' && interaction.handle) {
          const ratio = aspectRatioValue || 1
          const init = interaction.initialDisplayRegion
          const handle = interaction.handle
          const anchors: Record<ResizeHandle, { x: number; y: number }> = {
            nw: { x: init.x + init.width, y: init.y + init.height },
            ne: { x: init.x, y: init.y + init.height },
            sw: { x: init.x + init.width, y: init.y },
            se: { x: init.x, y: init.y }
          }
          const anchor = anchors[handle]
          let width = Math.abs(pointer.x - anchor.x)
          width = clampValue(width, MIN_HANDLE_SIZE, displayWidth)
          let height = width / ratio
          if (height > displayHeight) {
            height = displayHeight
            width = height * ratio
          }

          const next: DisplayRegion = {
            x: handle.includes('w') ? anchor.x - width : anchor.x,
            y: handle.includes('n') ? anchor.y - height : anchor.y,
            width,
            height
          }
          next.x = clampValue(next.x, 0, displayWidth - next.width)
          next.y = clampValue(next.y, 0, displayHeight - next.height)
          displayRegionRef.current = next
          applyDisplayRegion(next)
        }
      })
    },
    [applyDisplayRegion, aspectRatioValue, displayHeight, displayWidth, pointerToDisplay]
  )

  const finalizeInteraction = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    const displayRegion = displayRegionRef.current
    const candidate: CropRegion = {
      x: displayRegion.x / scaleX,
      y: displayRegion.y / scaleY,
      width: displayRegion.width / scaleX,
      height: displayRegion.height / scaleY
    }
    const committed = clampRegionToImage(candidate)
    onCropRegionCommit(committed)

    const aligned: DisplayRegion = {
      x: committed.x * scaleX,
      y: committed.y * scaleY,
      width: committed.width * scaleX,
      height: committed.height * scaleY
    }
    displayRegionRef.current = aligned
    applyDisplayRegion(aligned)
  }, [applyDisplayRegion, clampRegionToImage, onCropRegionCommit, scaleX, scaleY])

  const handlePointerUp = useCallback(() => {
    if (!interactionRef.current) return
    finalizeInteraction()
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
    interactionRef.current = null
  }, [finalizeInteraction, handlePointerMove])

  const startInteraction = useCallback(
    (event: React.PointerEvent, type: 'move' | 'resize', handle?: ResizeHandle) => {
      event.preventDefault()
      const pointer = pointerToDisplay(event.clientX, event.clientY)
      if (!pointer) return
      interactionRef.current = {
        type,
        handle,
        startPointer: pointer,
        initialDisplayRegion: displayRegionRef.current
      }
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
    },
    [handlePointerMove, handlePointerUp, pointerToDisplay]
  )

  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  const createGuides = (count: number) => {
    if (count <= 1) return []
    return Array.from({ length: count - 1 }, (_, index) => ((index + 1) / count) * 100)
  }

  const verticalGuides = createGuides(cols)
  const horizontalGuides = createGuides(rows)

  const handleCursors: Record<ResizeHandle, string> = {
    nw: 'nwse-resize',
    ne: 'nesw-resize',
    sw: 'nesw-resize',
    se: 'nwse-resize'
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div
        ref={overlayRef}
        className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] pointer-events-auto"
        style={{ touchAction: 'none', cursor: 'move' }}
        onPointerDown={(event) => {
          if (event.target === overlayRef.current) {
            startInteraction(event, 'move')
          }
        }}
      >
        {verticalGuides.map((percent) => (
          <React.Fragment key={`guide-v-${percent}`}>
            <div
              className="absolute top-0 bottom-0 border-l border-dashed border-white/60 pointer-events-none"
              style={{ left: `${percent}%` }}
            />
          </React.Fragment>
        ))}
        {horizontalGuides.map((percent) => (
          <React.Fragment key={`guide-h-${percent}`}>
            <div
              className="absolute left-0 right-0 border-t border-dashed border-white/60 pointer-events-none"
              style={{ top: `${percent}%` }}
            />
          </React.Fragment>
        ))}

        {(Object.keys(handleCursors) as ResizeHandle[]).map((handle) => {
          const positionStyle: React.CSSProperties = {}
          if (handle.includes('n')) positionStyle.top = '-8px'
          if (handle.includes('s')) positionStyle.bottom = '-8px'
          if (handle.includes('w')) positionStyle.left = '-8px'
          if (handle.includes('e')) positionStyle.right = '-8px'

          return (
            <div
              key={handle}
              className="absolute w-4 h-4 bg-white border border-gray-700 rounded-full"
              style={{ ...positionStyle, cursor: handleCursors[handle] }}
              onPointerDown={(event) => {
                event.stopPropagation()
                startInteraction(event, 'resize', handle)
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default CropOverlay
