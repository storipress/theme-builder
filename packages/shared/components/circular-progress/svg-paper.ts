export class Paper {
  svg: SVGSVGElement

  constructor(svg: SVGSVGElement) {
    this.svg = svg
  }

  element(name: string, attrs: Record<string, string>, content?: string, parent?: Elem | Element) {
    const el = element(this, name, attrs, parent)

    if (content) el.el.innerHTML = content

    return el
  }

  /**
   * Create an element by name (shortcut)
   * @param  {string} name Element name
   * @param  {Array}  args Array (or array-like object) of arguments required by the shape
   * @return {object}      Element
   */
  _shortcutElement(name: string, args: string[]) {
    let attrNames: string[]
    const attrs: Record<string, string> = {}
    let content: string | undefined

    switch (name) {
      case 'rect':
        attrNames = ['x', 'y', 'width', 'height', 'r']
        break

      case 'circle':
        attrNames = ['cx', 'cy', 'r']
        break

      case 'path':
        attrNames = ['d']
        break

      case 'text':
        attrNames = ['x', 'y']
        content = args[3]
        break

      default:
        return
    }

    if (attrNames.length !== args.length) {
      throw new Error(
        `Unexpected number of arguments to ${name}. Expected ${attrNames.length} arguments, got ${args.length}`
      )
    }

    attrNames.forEach((key, i) => {
      attrs[key] = args[i]
    })

    return this.element(name, attrs, content)
  }

  /**
   * Create rectangle
   * @return {object} Element
   */
  rect(...args: string[]) {
    return this._shortcutElement('rect', args)
  }

  /**
   * Create circle
   * @return {object} Element
   */
  circle(...args: string[]) {
    return this._shortcutElement('circle', args)
  }

  /**
   * Create path element
   * @return {object} Element
   */
  path(...args: string[]) {
    return this._shortcutElement('path', args)
  }
}

/**
 * Create new paper holding a new SVG element
 * @param  {(HTMLElement|string)} containerOrSelector      Container element or selector string
 * @param  {(number|string)}      width          SVG width
 * @param  {(number|string)}      height         SVG height
 * @param  {Document}             [doc] HTML document. Defaults to current document
 * @return {object}                              The paper
 */
export function paper(
  containerOrSelector: HTMLElement | string,
  width?: number | string,
  height?: number | string,
  doc: Document = document
) {
  let container

  if (typeof containerOrSelector === 'string') {
    const $el = doc.querySelector(containerOrSelector)
    if (!$el) {
      return
    }
    container = $el
  } else {
    container = containerOrSelector
  }

  const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('version', '1.1')
  if (width) svg.setAttribute('width', width.toString())
  if (height) svg.setAttribute('height', height.toString())
  if (width && height) svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  container.append(svg)

  return new Paper(svg)
}

/**
 * General purpose element maker
 * @param  {object}     paper    SVG Paper
 * @param  {string}     name     Element tag name
 * @param  {object}     attrs    Attributes for the element
 * @param  {SVGElement} [parent] Another SVG Element to append the
 * @param  {Document}   [doc]    Document
 * @return {object}              Element
 */
function element(
  { svg }: Paper,
  name: string,
  attrs: Record<string, string>,
  parent?: Element | Elem,
  doc: Document = document
) {
  const me = new Elem(doc.createElementNS('http://www.w3.org/2000/svg', name))
  me.attr(attrs)

  let container
  if (parent instanceof Element) {
    container = parent
  } else if (parent) {
    container = parent.el
  } else {
    container = svg
  }
  container.append(me.el)

  return me
}

class Elem {
  el: Element

  constructor(el: Element) {
    this.el = el
  }
  /**
   * Set attributes
   * @param {object} attrs  Map of name - values
   * @return {object}       The element
   */

  /**
   * Set an attribute to a value
   * @param  {string} name  Attribute name
   * @param  {*}      value Attribute value
   * @return {any}       The element
   */
  attr(name: string | Record<string, string>, value?: string): any {
    if (name === undefined) return this
    if (typeof name === 'object') {
      for (const key in name) {
        this.attr(key, name[key])
      }
      return this
    }
    if (value === undefined) return this.el.getAttributeNS(null, name)
    this.el.setAttribute(name, value)
    return this
  }

  /**
   * Set content (innerHTML) for the element
   * @param  {string} content String of SVG
   * @return {this}         The element
   */
  content(content: string): this {
    this.el.innerHTML = content
    return this
  }
}
