import { configureStore } from "@reduxjs/toolkit";
import CategorySlice from '../category/index.js'
import  BookMark from '../Bookmark/index.js'
const store = configureStore({
    reducer:{
        Category:CategorySlice,
        Bookmark:BookMark.reducer
    }
})
export default store;