import { createSlice } from "@reduxjs/toolkit";
const BookMark=createSlice({
    name:"BookMark",
    initialState:[],
    reducers:{
        AddBookmark:(state,action)=>{
            state.push(action.payload)
        },
        RemoveBookMark:(state,action)=>{
            return state.filter((item)=>item.url !== action.payload.url)
        }
    }
})
export const {AddBookmark,RemoveBookMark} = BookMark.actions;
export default BookMark;