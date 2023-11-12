import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './slices/searchSlice'
import sidebarReducer from './slices/sidebarSlice'

export default configureStore({
  reducer: {
    search: searchReducer,
    sidebar: sidebarReducer,
  },
})
