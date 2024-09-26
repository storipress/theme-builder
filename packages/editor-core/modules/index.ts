import { editorState } from './editor-state'
import { remoteDialog } from './remote-dialog'
import { virtualViewport } from './virtual-viewport'
import { wordCount } from './word-count'

export type { State as EditorState } from './editor-state'
export { connectEditorState } from './plugin'
export * from './remote-dialog'
export type { State as VirtualViewportState } from './virtual-viewport'
export type { State as WordCountState } from './word-count'

export const editorModules = { wordCount, editorState, virtualViewport, remoteDialog }
export { editorState, remoteDialog, virtualViewport, wordCount }
