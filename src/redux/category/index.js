import { createSlice } from "@reduxjs/toolkit";
const CategorySlice = createSlice({
    name: "Categories",
    initialState: {
        news: [],
        NewsSearched: [],
        SearchNews: "",
        singleNews: null,
        dateFilteredNews: []
    },
    reducers: {
        setSearched: (state, action) => {
            state.NewsSearched = action.payload;

        },
        SetNews: (state, action) => {
            state.news = action.payload
        },
        SetSearchNews: (state, action) => {
            state.SearchNews = action.payload;
        },
        setSingleNews: (state, action) => {
            state.singleNews = action.payload;
        },
        SetDateFilter: (state, action) => {
            state.dateFilteredNews = action.payload;
        },
    }
})
export const { SetNews, setSingleNews, SetSearchNews, setSearched,SetDateFilter } = CategorySlice.actions;
export default CategorySlice.reducer;