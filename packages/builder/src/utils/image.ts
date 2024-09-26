export function getImageSize(domNode?: HTMLElement) {
  if (!domNode) return { width: 0, height: 0 }

  const width = getNodeWidth(domNode)
  const height = getNodeHeight(domNode)

  return { width, height }
}

function px(node: HTMLElement, styleProperty: string) {
  const val = window.getComputedStyle(node).getPropertyValue(styleProperty)
  return Number.parseFloat(val.replace('px', ''))
}

function getNodeWidth(node?: HTMLElement) {
  if (!node) return 0

  const leftBorder = px(node, 'border-left-width')
  const rightBorder = px(node, 'border-right-width')
  return node.clientWidth + leftBorder + rightBorder
}

function getNodeHeight(node?: HTMLElement) {
  if (!node) return 0

  const topBorder = px(node, 'border-top-width')
  const bottomBorder = px(node, 'border-bottom-width')
  return node.clientHeight + topBorder + bottomBorder
}
