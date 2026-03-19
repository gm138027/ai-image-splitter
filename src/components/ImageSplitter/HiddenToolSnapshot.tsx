import React from 'react'
import { useTranslation } from 'next-i18next'
import { OUTPUT_FORMATS } from '@/types'

/**
 * Hidden snapshot of the tool UI for SEO crawlers.
 * The markup is visually hidden but keeps the form structure
 * so that bots can clearly detect the site as an interactive tool.
 */
const HiddenToolSnapshot: React.FC = () => {
  const { t } = useTranslation('common')

  return (
    <section
      className="sr-only"
      aria-hidden="true"
    >
        <div className="space-y-4 border border-gray-200 rounded-lg p-4">
          <h2 className="font-semibold">{t('tool.splitModeTitle')}</h2>
          <p>{t('tool.controlPanelDescription')}</p>
          <div>
            <p className="text-sm font-medium">{t('tool.aspectRatio.title')}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 border rounded">{t('tool.aspectRatio.default')}</span>
              <span className="px-2 py-1 border rounded">{t('tool.aspectRatio.portrait45')}</span>
              <span className="px-2 py-1 border rounded">{t('tool.aspectRatio.portrait34')}</span>
              <span className="px-2 py-1 border rounded">{t('tool.aspectRatio.square')}</span>
            </div>
          </div>
          <label className="flex flex-col space-y-1">
            <span>{t('tool.uploadPrompt')}</span>
            <input type="file" aria-label={t('tool.uploadPrompt')} />
        </label>
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Tool quick select presets">
          <button type="button">{t('tool.splitModes.vertical')}</button>
          <button type="button">{t('tool.splitModes.horizontal')}</button>
          <button type="button">{t('tool.splitModes.grid')}</button>
          <button type="button">{t('tool.buttons.split')}</button>
        </div>
        <div className="space-y-2">
          <label className="flex flex-col">
            <span>{t('tool.gridSettings.rows')}</span>
            <input type="number" min={1} max={10} defaultValue={3} />
          </label>
          <label className="flex flex-col">
            <span>{t('tool.gridSettings.columns')}</span>
            <input type="number" min={1} max={10} defaultValue={3} />
          </label>
          <label className="flex flex-col">
            <span>{t('tool.gridLineWidthLabel')}</span>
            <input type="range" min={0} max={10} defaultValue={2} />
          </label>
          <label className="flex flex-col">
            <span>{t('tool.outputFormat')}</span>
            <select>
              {OUTPUT_FORMATS.map((format) => (
                <option key={format}>{t(`tool.formats.${format}`)}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button">{t('tool.buttons.split')}</button>
          <button type="button">{t('tool.buttons.downloadAll')}</button>
        </div>
        <div className="border border-dashed p-3 rounded">
          <h3 className="font-semibold">{t('tool.preview.title')}</h3>
          <p>{t('tool.preview.instruction')}</p>
        </div>
      </div>
    </section>
  )
}

export default HiddenToolSnapshot
