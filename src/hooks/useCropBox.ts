import { useCallback, useMemo, useRef, useState } from 'react'
import type { AspectRatioOption, CropRegion } from '@/types'

const ratioMap: Record<Exclude<AspectRatioOption, 'default'>, number> = {
  '4:5': 4 / 5,
  '3:4': 3 / 4,
  '1:1': 1
}

const getRatioValue = (aspectRatio: AspectRatioOption): number | null => {
  if (aspectRatio === 'default') return null
  return ratioMap[aspectRatio]
}

const calculateCenteredRegion = (
  width: number,
  height: number,
  aspectRatio: AspectRatioOption
): CropRegion | null => {
  const ratio = getRatioValue(aspectRatio)
  if (!ratio) return null

  let regionWidth = width
  let regionHeight = regionWidth / ratio

  if (regionHeight > height) {
    regionHeight = height
    regionWidth = regionHeight * ratio
  }

  return {
    x: (width - regionWidth) / 2,
    y: (height - regionHeight) / 2,
    width: regionWidth,
    height: regionHeight
  }
}

export const useCropBox = (initialAspect: AspectRatioOption = 'default') => {
  const imageDimensionsRef = useRef<{ width: number; height: number } | null>(null)
  const regionRef = useRef<CropRegion | null>(null)
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>(initialAspect)
  const [regionSnapshot, setRegionSnapshot] = useState<CropRegion | null>(null)

  const syncRegion = useCallback((region: CropRegion | null) => {
    regionRef.current = region
    setRegionSnapshot(region)
  }, [])

  const initialiseForImage = useCallback(
    (image: HTMLImageElement, ratio: AspectRatioOption) => {
      imageDimensionsRef.current = { width: image.width, height: image.height }
      setAspectRatio(ratio)
      if (ratio === 'default') {
        syncRegion(null)
        return
      }
      const nextRegion = calculateCenteredRegion(image.width, image.height, ratio)
      syncRegion(nextRegion)
    },
    [syncRegion]
  )

  const updateAspectRatio = useCallback(
    (ratio: AspectRatioOption, image?: HTMLImageElement | null) => {
      if (image) {
        imageDimensionsRef.current = { width: image.width, height: image.height }
      }
      setAspectRatio(ratio)
      const dims = imageDimensionsRef.current
      if (!dims || ratio === 'default') {
        syncRegion(null)
        return
      }
      const nextRegion = calculateCenteredRegion(dims.width, dims.height, ratio)
      syncRegion(nextRegion)
    },
    [syncRegion]
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

  const aspectRatioValue = useMemo(() => getRatioValue(aspectRatio), [aspectRatio])
  const shouldRender = aspectRatio !== 'default' && !!regionSnapshot

  return {
    aspectRatio,
    aspectRatioValue,
    region: regionSnapshot,
    shouldRender,
    initialiseForImage,
    updateAspectRatio,
    commitRegion,
    getRegionForSplit,
    imageDimensions: imageDimensionsRef.current
  }
}

