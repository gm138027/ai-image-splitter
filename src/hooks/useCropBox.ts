import { useCallback, useMemo, useRef, useState } from 'react'
import type { AspectRatioOption, CropRegion } from '@/types'

const ratioMap: Record<Exclude<AspectRatioOption, 'default'>, number> = {
  '4:5': 4 / 5,
  '3:4': 3 / 4,
  '1:1': 1
}

type GridDimensions = {
  rows: number
  cols: number
}

const getRatioValue = (aspectRatio: AspectRatioOption): number | null => {
  if (aspectRatio === 'default') return null
  return ratioMap[aspectRatio]
}

const clampGridValue = (value: number | undefined) => {
  if (!value || value <= 0) return 1
  return value
}

const calculateCenteredRegion = (
  width: number,
  height: number,
  aspectRatio: AspectRatioOption,
  grid: GridDimensions
): CropRegion | null => {
  const ratio = getRatioValue(aspectRatio)
  if (!ratio) return null

  const safeRows = clampGridValue(grid.rows)
  const safeCols = clampGridValue(grid.cols)
  const overallRatio = ratio * (safeCols / safeRows)

  let regionWidth = width
  let regionHeight = regionWidth / overallRatio

  if (regionHeight > height) {
    regionHeight = height
    regionWidth = regionHeight * overallRatio
  }

  return {
    x: (width - regionWidth) / 2,
    y: (height - regionHeight) / 2,
    width: regionWidth,
    height: regionHeight
  }
}

export const useCropBox = (
  initialAspect: AspectRatioOption = 'default',
  initialGrid: GridDimensions = { rows: 1, cols: 1 }
) => {
  const imageDimensionsRef = useRef<{ width: number; height: number } | null>(null)
  const gridDimensionsRef = useRef<GridDimensions>({
    rows: clampGridValue(initialGrid.rows),
    cols: clampGridValue(initialGrid.cols)
  })
  const regionRef = useRef<CropRegion | null>(null)
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>(initialAspect)
  const [regionSnapshot, setRegionSnapshot] = useState<CropRegion | null>(null)

  const syncRegion = useCallback((region: CropRegion | null) => {
    regionRef.current = region
    setRegionSnapshot(region)
  }, [])

  const recalculateRegion = useCallback(
    (nextRatio: AspectRatioOption, dimensions?: { width: number; height: number } | null) => {
      const dims = dimensions || imageDimensionsRef.current
      if (!dims) {
        return
      }
      if (nextRatio === 'default') {
        syncRegion(null)
        return
      }
      const nextRegion = calculateCenteredRegion(
        dims.width,
        dims.height,
        nextRatio,
        gridDimensionsRef.current
      )
      syncRegion(nextRegion)
    },
    [syncRegion]
  )

  const initialiseForImage = useCallback(
    (image: HTMLImageElement, ratio: AspectRatioOption) => {
      imageDimensionsRef.current = { width: image.width, height: image.height }
      setAspectRatio(ratio)
      recalculateRegion(ratio, { width: image.width, height: image.height })
    },
    [recalculateRegion]
  )

  const updateAspectRatio = useCallback(
    (ratio: AspectRatioOption, image?: HTMLImageElement | null) => {
      if (image) {
        imageDimensionsRef.current = { width: image.width, height: image.height }
      }
      setAspectRatio(ratio)
      recalculateRegion(ratio, image ? { width: image.width, height: image.height } : null)
    },
    [recalculateRegion]
  )

  const commitRegion = useCallback(
    (region: CropRegion | null) => {
      syncRegion(region)
    },
    [syncRegion]
  )

  const getRegionForSplit = useCallback(() => {
    return regionRef.current
  }, [])

  const updateGridDimensions = useCallback(
    (rows: number, cols: number, image?: HTMLImageElement | null) => {
      gridDimensionsRef.current = {
        rows: clampGridValue(rows),
        cols: clampGridValue(cols)
      }
      if (aspectRatio === 'default') {
        return
      }
      recalculateRegion(
        aspectRatio,
        image
          ? { width: image.width, height: image.height }
          : imageDimensionsRef.current
      )
    },
    [aspectRatio, recalculateRegion]
  )

  const aspectRatioValue = useMemo(() => getRatioValue(aspectRatio), [aspectRatio])
  const shouldRender = aspectRatio !== 'default' && !!regionSnapshot

  return {
    aspectRatio,
    aspectRatioValue,
    region: regionSnapshot,
    shouldRender,
    initialiseForImage,
    updateAspectRatio,
    updateGridDimensions,
    commitRegion,
    getRegionForSplit,
    imageDimensions: imageDimensionsRef.current
  }
}
