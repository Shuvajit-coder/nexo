import { createSlice } from "@reduxjs/toolkit";


const flickSlice=createSlice({
    name:"flick",
    initialState:{
        flickData:[],
    },
    reducers:{
        setFlickData:(state,action)=>{
            state.flickData = action.payload
        }
    }
})

export const {setFlickData} = flickSlice.actions

export default flickSlice.reducer