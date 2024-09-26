import { createNamespacedHelpers } from 'vuex'

export { REDO_HISTORY, UNDO_HISTORY } from '../../history'

export const articleHelpers = createNamespacedHelpers('article')

export const SET_LAYOUTS = 'SET_LAYOUTS'
export const SET_HEIGHT = 'SET_HEIGHT'
export const LOAD_LAYOUT = 'LOAD_LAYOUT'
export const SET_SECTION_SELECT = 'SET_SECTION_SELECT'
export const SET_SECTION_HOVER = 'SET_SECTION_HOVER'
export const SET_TEMPLATE = 'SET_TEMPLATE'
export const SET_TEMPLATE_STYLE = 'SET_TEMPLATE_STYLE'
export const SET_ELEMENT_VARIANT = 'SET_ELEMENT_VARIANT'
export const SET_ELEMENT_STYLE = 'SET_ELEMENT_STYLE'
export const ADD_COLOR = 'ADD_COLOR'
export const CLEAR_COLOR = 'CLEAR_COLOR'
