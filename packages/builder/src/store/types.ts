export type Preview = 'mobile' | 'tablet' | 'desktop' | 'expanded'
export type SavingStatus = 'edited' | 'loading' | 'done'

export interface RootState {
  preview: Preview
  savingStatus: SavingStatus
}
