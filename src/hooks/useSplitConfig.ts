import { useCallback } from 'react'
import type { SplitConfig } from '@/types'

// eslint-disable-next-line no-unused-vars
type AspectRatioChangeHandler = (nextRatio: SplitConfig['aspectRatio']) => void

interface UseSplitConfigOptions {
  onAspectRatioChange?: AspectRatioChangeHandler
}

const clampValue = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value))
}

export const useSplitConfig = (
  setConfig: React.Dispatch<React.SetStateAction<SplitConfig>>,
  options: UseSplitConfigOptions = {}
) => {
  const updateConfig = useCallback(
    (newConfig: Partial<SplitConfig>) => {
      setConfig((prev) => {
        const merged = { ...prev, ...newConfig }
        if (newConfig.aspectRatio && newConfig.aspectRatio !== prev.aspectRatio) {
          options.onAspectRatioChange?.(newConfig.aspectRatio)
        }
        return merged
      })
    },
    [options, setConfig]
  )

  const updateRows = useCallback(
    (value: number) => {
      const clampedValue = clampValue(value, 1, 10)
      setConfig((prev) => ({
        ...prev,
        rows: clampedValue
      }))
    },
    [setConfig]
  )

  const updateCols = useCallback(
    (value: number) => {
      const clampedValue = clampValue(value, 1, 10)
      setConfig((prev) => ({
        ...prev,
        cols: clampedValue
      }))
    },
    [setConfig]
  )

  return {
    updateConfig,
    updateRows,
    updateCols
  }
}
