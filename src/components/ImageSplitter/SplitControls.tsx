import React from 'react'
import { useTranslation } from 'next-i18next'
import { Minus, Plus } from 'lucide-react'
import type { SplitControlsProps } from '@/types'

const SplitControls: React.FC<SplitControlsProps> = ({
  config,
  onConfigChange,
  onSplit,
  onDownloadAll,
  isProcessing,
  hasSplitImages
}) => {
  const { t } = useTranslation('common')

  const handleModeChange = (mode: 'vertical' | 'horizontal' | 'grid') => {
    onConfigChange({ ...config, mode })
  }

  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1
    const rows = Math.max(1, Math.min(10, value))
    onConfigChange({ ...config, rows })
  }

  const handleColsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1
    const cols = Math.max(1, Math.min(10, value))
    onConfigChange({ ...config, cols })
  }

  const handleRowsIncDecrement = (increment: number) => {
    const newRows = Math.max(1, Math.min(10, config.rows + increment))
    onConfigChange({ ...config, rows: newRows })
  }

  const handleColsIncDecrement = (increment: number) => {
    const newCols = Math.max(1, Math.min(10, config.cols + increment))
    onConfigChange({ ...config, cols: newCols })
  }

  const handleGridLineWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const gridLineWidth = parseInt(e.target.value)
    onConfigChange({ ...config, gridLineWidth })
  }

  const handleOutputFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const outputFormat = e.target.value as 'jpg' | 'png' | 'webp' | 'bmp'
    onConfigChange({ ...config, outputFormat })
  }

  return (
    <div className="w-full lg:w-1/3 p-6 border-r border-gray-200 bg-gray-50">
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          {t('tool.splitModeTitle')}：{t('tool.splitModeDescription')}。
        </p>
      </div>

      {/* Split Mode Selection */}
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          <button
            onClick={() => handleModeChange('vertical')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors text-center min-h-[2.5rem] flex items-center justify-center ${
              config.mode === 'vertical'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {t('tool.splitModes.vertical')}
          </button>
          <button
            onClick={() => handleModeChange('horizontal')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors text-center min-h-[2.5rem] flex items-center justify-center ${
              config.mode === 'horizontal'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {t('tool.splitModes.horizontal')}
          </button>
          <button
            onClick={() => handleModeChange('grid')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors text-center min-h-[2.5rem] flex items-center justify-center ${
              config.mode === 'grid'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {t('tool.splitModes.grid')}
          </button>
        </div>
      </div>

      {/* Grid Settings */}
      <div className="mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('tool.gridSettings.rows')}
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleRowsIncDecrement(-1)}
                disabled={config.mode === 'vertical'}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  config.mode === 'vertical' 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="1"
                max="10"
                value={config.mode === 'vertical' ? 0 : config.rows}
                onChange={handleRowsChange}
                disabled={config.mode === 'vertical'}
                className={`w-16 text-center font-medium border border-gray-300 rounded px-2 py-1 ${
                  config.mode === 'vertical' 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : ''
                }`}
              />
              <button
                onClick={() => handleRowsIncDecrement(1)}
                disabled={config.mode === 'vertical'}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  config.mode === 'vertical' 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('tool.gridSettings.columns')}
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleColsIncDecrement(-1)}
                disabled={config.mode === 'horizontal'}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  config.mode === 'horizontal' 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="1"
                max="10"
                value={config.mode === 'horizontal' ? 0 : config.cols}
                onChange={handleColsChange}
                disabled={config.mode === 'horizontal'}
                className={`w-16 text-center font-medium border border-gray-300 rounded px-2 py-1 ${
                  config.mode === 'horizontal' 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : ''
                }`}
              />
              <button
                onClick={() => handleColsIncDecrement(1)}
                disabled={config.mode === 'horizontal'}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  config.mode === 'horizontal' 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Line Width Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('tool.gridLineWidthLabel')}: {config.gridLineWidth}px
        </label>
        <input
          type="range"
          min="0"
          max="10"
          value={config.gridLineWidth}
          onChange={handleGridLineWidthChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <p className="text-xs text-gray-500 mt-1">{t('tool.gridLineWidthHint')}</p>
      </div>

      {/* Output Format */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('tool.outputFormat')}
        </label>
        <select
          value={config.outputFormat}
          onChange={handleOutputFormatChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="jpg">{t('tool.formats.jpg')}</option>
          <option value="png">{t('tool.formats.png')}</option>
          <option value="webp">{t('tool.formats.webp')}</option>
          <option value="bmp">{t('tool.formats.bmp')}</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onSplit}
          disabled={isProcessing}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? t('tool.buttons.splitting') : t('tool.buttons.split')}
        </button>
        
        <button
          onClick={onDownloadAll}
          disabled={!hasSplitImages}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {t('tool.buttons.downloadAll')}
        </button>
      </div>
    </div>
  )
}

export default SplitControls 