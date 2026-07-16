// =============================================================================
// hyperflip/VariationAxes.js
// =============================================================================

export class VariationAxes {
  constructor(options) {
    this.container = options.container
    this.onChange = options.onChange
    this.currentSettings = {}
  }

  createAxesControls(axes) {
    if (!this.container) {
      return
    }

    this.container.innerHTML = ''
    this.currentSettings = {}

    axes.forEach(axis => {
      const sliderGroup = document.createElement('div')
      sliderGroup.className = 'font-viewer-slider-group'

      const label = document.createElement('label')
      const sliderId = `font-axis-${axis.tag}`
      label.htmlFor = sliderId
      label.textContent = `${axis.name} (${axis.tag})`

      const slider = document.createElement('input')
      slider.type = 'range'
      slider.id = sliderId
      slider.dataset.tag = axis.tag
      slider.min = axis.min
      slider.max = axis.max
      slider.value = axis.default
      slider.step = 0.1

      const valueSpan = document.createElement('span')
      valueSpan.textContent = parseFloat(axis.default).toFixed(1)

      slider.addEventListener('input', (e) => {
        this.updateAxisValue(axis.tag, e.target.value)
        valueSpan.textContent = parseFloat(e.target.value).toFixed(1)
      })

      sliderGroup.appendChild(label)
      sliderGroup.appendChild(slider)
      sliderGroup.appendChild(valueSpan)

      this.container.appendChild(sliderGroup)
    })
  }

  updateAxisValue(tag, value) {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      delete this.currentSettings[tag]
    } else {
      this.currentSettings[tag] = numValue
    }
    this.updateVariationSettings()
  }

  updateVariationSettings() {
    const settings = Object.entries(this.currentSettings)
      .filter(([_, val]) => !isNaN(val))
      .map(([tag, val]) => `"${tag}" ${val.toFixed(1)}`)
      .join(', ')
    this.onChange?.(settings || 'normal')
  }
}
