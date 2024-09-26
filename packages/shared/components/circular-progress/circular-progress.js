// https://github.com/tigrr/circle-progress

/**
 * @author Tigran Sargsyan [tigran.sn@gmail.com]
 */

import { animator } from './animator'
import { paper as svgpaper } from './svg-paper'

/**
 * Utility functions
 * @type {object}
 */
const util = {
  /**
   * Mathematical functions
   * @type {object}
   */
  math: {
    /**
     * Convert polar coordinates (radius, angle) to cartesian ones (x, y)
     * @param  {float} r      Radius
     * @param  {float} angle  Angle
     * @return {object}       Cartesian coordinates as object: {x, y}
     */
    polarToCartesian: (r, angle) => ({
      x: r * Math.cos((angle * Math.PI) / 180),
      y: r * Math.sin((angle * Math.PI) / 180),
    }),
  },
}

/**
 * Create a new Circle Progress bar
 * @global
 * @class Circle Progress class
 */
export class CircleProgress {
  get value() {
    return this._attrs.value
  }

  set value(val) {
    this.attr('value', val)
  }

  get min() {
    return this._attrs.min
  }

  set min(val) {
    this.attr('min', val)
  }

  get max() {
    return this._attrs.max
  }

  set max(val) {
    this.attr('max', val)
  }

  get startAngle() {
    return this._attrs.startAngle
  }

  set startAngle(val) {
    this.attr('startAngle', val)
  }

  get clockwise() {
    return this._attrs.clockwise
  }

  set clockwise(val) {
    this.attr('clockwise', val)
  }

  get constrain() {
    return this._attrs.constrain
  }

  set constrain(val) {
    this.attr('constrain', val)
  }

  get indeterminateText() {
    return this._attrs.indeterminateText
  }

  set indeterminateText(val) {
    this.attr('indeterminateText', val)
  }

  get textFormat() {
    return this._attrs.textFormat
  }

  set textFormat(val) {
    this.attr('textFormat', val)
  }

  get animation() {
    return this._attrs.animation
  }

  set animation(val) {
    this.attr('animation', val)
  }

  get animationDuration() {
    return this._attrs.animationDuration
  }

  set animationDuration(val) {
    this.attr('animationDuration', val)
  }

  /**
   * Construct the new CircleProgress instance
   * @constructs
   * @param {(Element|string)}  el    Either HTML element or a selector string
   * @param {object}                opts  Options
   * @param {Document}              [doc] Document
   */
  constructor(el, opts = {}, doc = document) {
    let $el

    if (typeof el === 'string') {
      const e = doc.querySelector(el)
      if (!e) {
        throw new Error('CircleProgress: you must pass the container element as the first argument')
      }
      $el = e
    } else {
      $el = el
    }

    // If element is already circleProgress, return the circleProgress object.
    if ($el.circleProgress) return $el.circleProgress

    $el.circleProgress = this

    this.doc = doc

    $el.setAttribute('role', 'progressbar')

    this.el = $el
    opts = { ...CircleProgress.defaults, ...opts }
    Object.defineProperty(this, '_attrs', { value: {}, enumerable: false })

    const circleThickness = opts.textFormat === 'valueOnCircle' ? 16 : 8

    this.graph = {
      paper: svgpaper(el, 100, 100),
      angle: 0,
    }
    this.graph.paper.svg.setAttribute('class', 'circle-progress')
    this.graph.circle = this.graph.paper.element('circle').attr({
      class: 'circle-progress-circle',
      cx: 50,
      cy: 50,
      r: 50 - circleThickness / 2,
      fill: 'none',
      stroke: '#ddd',
      'stroke-width': circleThickness,
    })
    this.graph.sector = this.graph.paper
      .path(CircleProgress._makeSectorPath(50, 50, 50 - circleThickness / 2, 0, 0))
      .attr({
        class: 'circle-progress-value',
        fill: 'none',
        stroke: '#00E699',
        'stroke-width': circleThickness,
      })
    this.graph.text = this.graph.paper.element('text', {
      class: 'circle-progress-text',
      x: 50,
      y: 50,
      font: '16px Arial, sans-serif',
      'text-anchor': 'middle',
      fill: '#999',
    })
    this._initText()
    this.attr(
      [
        'indeterminateText',
        'textFormat',
        'startAngle',
        'clockwise',
        'animation',
        'animationDuration',
        'constrain',
        'min',
        'max',
        'value',
      ]
        .filter((key) => key in opts)
        .map((key) => [key, opts[key]])
    )
  }

  /**
   * Set attributes
   * @param  {(Array | object)} attrs Attributes as an array [[key,value],...] or map {key: value,...}
   * @return {CircleProgress}       The CircleProgress instance
   */
  attr(attrs) {
    if (typeof attrs === 'string') {
      if (arguments.length === 1) return this._attrs[attrs]
      this._set(arguments[0], arguments[1])
      this._updateGraph()
      return this
    } else if (typeof attrs !== 'object') {
      throw new TypeError(`Wrong argument passed to attr. Expected object, got "${typeof attrs}"`)
    }
    if (!Array.isArray(attrs)) {
      attrs = Object.keys(attrs).map((key) => [key, attrs[key]])
    }
    attrs.forEach((attr) => this._set(attr[0], attr[1]))
    this._updateGraph()
    return this
  }

  /**
   * Set an attribute to a value
   * @private
   * @param {string} key Attribute name
   * @param {*}      val Attribute value
   */
  _set(key, val) {
    const ariaAttrs = {
      value: 'aria-valuenow',
      min: 'aria-valuemin',
      max: 'aria-valuemax',
    }
    let circleThickness

    val = this._formatValue(key, val)

    if (val === undefined)
      throw new TypeError(`Failed to set the ${key} property on CircleProgress: The provided value is non-finite.`)
    if (this._attrs[key] === val) {
      return
    }
    if (key === 'min' && val >= this.max) {
      return
    }
    if (key === 'max' && val <= this.min) {
      return
    }
    if (key === 'value' && this.constrain) {
      if (this.min != null && val < this.min) {
        val = this.min
      }
      if (this.max != null && val > this.max) {
        val = this.max
      }
    }

    this._attrs[key] = val

    if (key in ariaAttrs) {
      if (val !== undefined) this.el.setAttribute(ariaAttrs[key], val)
      else this.el.removeAttribute(ariaAttrs[key])
    }
    if (['min', 'max', 'constrain'].includes(key) && (this.value > this.max || this.value < this.min)) {
      this.value = Math.min(this.max, Math.max(this.min, this.value))
    }
    if (key === 'textFormat') {
      this._initText()
      circleThickness = val === 'valueOnCircle' ? 16 : 8
      this.graph.sector.attr('stroke-width', circleThickness)
      this.graph.circle.attr('stroke-width', circleThickness)
    }
  }

  /**
   * Format attribute value according to its type
   * @private
   * @param  {string} key Attribute name
   * @param  {*}      val Attribute value
   * @return {*}          Formatted attribute value
   */
  _formatValue(key, val) {
    switch (key) {
      case 'value':
      case 'min':
      case 'max':
        val = Number.parseFloat(val)
        if (!isFinite(val)) val = undefined
        break

      case 'startAngle':
        val = Number.parseFloat(val)
        val = !isFinite(val) ? undefined : Math.max(0, Math.min(360, val))
        break

      case 'clockwise':
      case 'constrain':
        val = !!val
        break

      case 'indeterminateText':
        val = `${val}`
        break

      case 'textFormat':
        if (
          typeof val !== 'function' &&
          !['valueOnCircle', 'horizontal', 'vertical', 'percent', 'value', 'none'].includes(val)
        ) {
          throw new Error(
            `Failed to set the "textFormat" property on CircleProgress: the provided value "${val}" is not a legal textFormat identifier.`
          )
        }
        break

      case 'animation':
        if (typeof val !== 'string' && typeof val !== 'function') {
          throw new TypeError(
            `Failed to set "animation" property on CircleProgress: the value must be either string or function, ${typeof val} passed.`
          )
        }
        if (typeof val === 'string' && val !== 'none' && !animator.easings[val]) {
          throw new Error(
            `Failed to set "animation" on CircleProgress: the provided value ${val} is not a legal easing function name.`
          )
        }
        break
    }
    return val
  }

  /**
   * Convert current value to angle
   * @private
   * @return {float} Angle in degrees
   */
  _valToAngle() {
    let angle
    if (this._isIndeterminate()) return 0
    if (this.max === 0) return this.value ? 360 : 0
    angle = ((this.value - this.min) / this.max) * 360
    angle = Math.min(360, Math.max(0, angle))
    return angle
  }

  /**
   * Check wether the progressbar is in indeterminate state
   * @private
   * @return {bool} True if the state is indeterminate, false if it is determinate
   */
  _isIndeterminate() {
    return !(typeof this.value === 'number' && typeof this.max === 'number' && typeof this.min === 'number')
  }

  /**
   * Make sector path for use in the "d" path attribute
   * @private
   * @param  {float} cx         Center x
   * @param  {float} cy         Center y
   * @param  {float} r          Radius
   * @param  {float} startAngle Start angle relative to straight upright axis
   * @param  {float} angle      Angle to rotate relative to straight upright axis
   * @param  {bool}  clockwise  Direction of rotation. Clockwise if truethy, anticlockwise if falsy
   * @return {string}           Path string
   */
  static _makeSectorPath(cx, cy, r, startAngle, angle, clockwise) {
    clockwise = !!clockwise
    if (angle > 0 && angle < 0.3) {
      // Tiny angles smaller than ~0.3° can produce weird-looking paths
      angle = 0
    } else if (angle > 359.999) {
      // If progress is full, notch it back a little, so the path doesn't become 0-length
      angle = 359.999
    }
    const endAngle = startAngle + angle * (clockwise * 2 - 1)
    const startCoords = util.math.polarToCartesian(r, startAngle)
    const endCoords = util.math.polarToCartesian(r, endAngle)
    const x1 = cx + startCoords.x
    const x2 = cx + endCoords.x
    const y1 = cy + startCoords.y
    const y2 = cy + endCoords.y

    return ['M', x1, y1, 'A', r, r, 0, +(angle > 180), +clockwise, x2, y2].join(' ')
  }

  /**
   * Position the value text on the circle
   * @private
   * @param  {float} angle Angle at which to position the text
   */
  _positionValueText(angle) {
    const coords = util.math.polarToCartesian(this._getRadius(), angle)
    this.graph.textVal.attr({ x: 50 + coords.x, y: 50 + coords.y })
  }

  /**
   * Generate text representation of the values based on {@link CircleProgress#textFormat}
   * @private
   */
  _initText() {
    this.graph.text.content('')
    switch (this.textFormat) {
      case 'valueOnCircle':
        this.graph.textVal = this.graph.paper.element(
          'tspan',
          {
            x: 0,
            y: 0,
            class: 'circle-progress-text-value',
            'font-size': '12',
            fill: this.textFormat === 'valueOnCircle' ? '#fff' : '#888',
          },
          '',
          this.graph.text
        )
        this.graph.textMax = this.graph.paper.element(
          'tspan',
          {
            x: 50,
            y: 50,
            class: 'circle-progress-text-max',
            'font-size': '22',
            'font-weight': 'bold',
            fill: '#ddd',
          },
          '',
          this.graph.text
        )
        // IE
        if (!this.graph.text.el.hasAttribute('dominant-baseline')) this.graph.textMax.attr('dy', '0.4em')
        break

      case 'horizontal':
        this.graph.textVal = this.graph.paper.element(
          'tspan',
          { class: 'circle-progress-text-value' },
          '',
          this.graph.text
        )
        this.graph.textSeparator = this.graph.paper.element(
          'tspan',
          { class: 'circle-progress-text-separator' },
          '/',
          this.graph.text
        )
        this.graph.textMax = this.graph.paper.element(
          'tspan',
          { class: 'circle-progress-text-max' },
          '',
          this.graph.text
        )
        break

      case 'vertical':
        if (this.graph.text.el.hasAttribute('dominant-baseline'))
          this.graph.text.attr('dominant-baseline', 'text-after-edge')
        this.graph.textVal = this.graph.paper.element(
          'tspan',
          { class: 'circle-progress-text-value', x: 50, dy: '-0.2em' },
          '',
          this.graph.text
        )
        this.graph.textSeparator = this.graph.paper.element(
          'tspan',
          {
            class: 'circle-progress-text-separator',
            x: 50,
            dy: '0.1em',
            'font-family': 'Arial, sans-serif',
          },
          '___',
          this.graph.text
        )
        this.graph.textMax = this.graph.paper.element(
          'tspan',
          { class: 'circle-progress-text-max', x: 50, dy: '1.2em' },
          '',
          this.graph.text
        )
        break
    }
    if (this.textFormat !== 'vertical') {
      if (this.graph.text.el.hasAttribute('dominant-baseline')) this.graph.text.attr('dominant-baseline', 'central')
      // IE
      else this.graph.text.attr('dy', '0.4em')
    }
  }

  /**
   * Update graphics
   * @private
   */
  _updateGraph() {
    const startAngle = this.startAngle - 90

    if (!this._isIndeterminate()) {
      const angle = this._valToAngle(this.value)
      const r = this._getRadius()
      const clockwise = this.clockwise
      this.graph.circle.attr('r', r)
      if (this.animation !== 'none' && angle !== this.graph.angle) {
        animator(this.animation, this.graph.angle, angle - this.graph.angle, this.animationDuration, (angle) => {
          this.graph.sector.attr('d', CircleProgress._makeSectorPath(50, 50, r, startAngle, angle, clockwise))
        })
      } else {
        this.graph.sector.attr('d', CircleProgress._makeSectorPath(50, 50, r, startAngle, angle, clockwise))
      }
      this.graph.angle = angle
      if (this.textFormat === 'valueOnCircle') {
        this._positionValueText((2 * startAngle + angle) / 2)
      }
    } else {
      if (this.textFormat === 'valueOnCircle') {
        this._positionValueText(startAngle)
      }
    }
    // Update texts
    if (typeof this.textFormat === 'function') {
      this.graph.text.content(this.textFormat(this.value, this.max))
    } else if (this.textFormat === 'value') {
      this.graph.text.el.textContent = this.value !== undefined ? this.value : this.indeterminateText
    } else if (this.textFormat === 'percent') {
      this.graph.text.el.textContent = `${
        this.value !== undefined && this.max != null
          ? Math.round((this.value / this.max) * 100)
          : this.indeterminateText
      }%`
    } else if (this.textFormat === 'none') {
      this.graph.text.el.textContent = ''
    } else {
      this.graph.textVal.el.textContent = this.value !== undefined ? this.value : this.indeterminateText
      this.graph.textMax.el.textContent = this.max !== undefined ? this.max : this.indeterminateText
    }
  }

  /**
   * Get circles' radius based on the calculated stroke widths of the value path and circle
   * @private
   * @return {float} The radius
   */
  _getRadius() {
    return (
      50 -
      Math.max(
        Number.parseFloat(this.doc.defaultView.getComputedStyle(this.graph.circle.el, null)['stroke-width']),
        Number.parseFloat(this.doc.defaultView.getComputedStyle(this.graph.sector.el, null)['stroke-width'])
      ) /
        2
    )
  }

  static defaults = {
    startAngle: 0,
    min: 0,
    max: 1,
    constrain: true,
    indeterminateText: '?',
    clockwise: true,
    textFormat: 'horizontal',
    animation: 'easeInOutCubic',
    animationDuration: 600,
  }
}
