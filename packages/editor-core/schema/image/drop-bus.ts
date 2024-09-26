interface FileUpload {
  kind: 'file'
  file: File
}

interface UrlUpload {
  kind: 'url'
  promise: Promise<string>
}

export type Upload = FileUpload | UrlUpload

export const droppedItems = new Map<string, Upload>()
