declare module 'hast-util-from-dom' {
  import type { Node } from 'unist'

  function fromDOM(node: HTMLElement): Node

  export default fromDOM
}
