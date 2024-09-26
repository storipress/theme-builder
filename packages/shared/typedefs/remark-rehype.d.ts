declare module 'remark-rehype' {
  import type { Node } from 'unist'

  function remark2rehype(): (node: Node) => Node

  export default remark2rehype
}
