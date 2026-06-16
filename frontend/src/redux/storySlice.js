import { createSlice } from "@reduxjs/toolkit";


const storySlice=createSlice({
    name:"story",
    initialState:{
        storyData:null,
        storyList:[],
        currentUserStory:null
    },
   

    reducers:{
    setStoryData:(state,action)=>{
        state.storyData = action.payload
    },

    setStoryList:(state,action)=>{
        state.storyList = action.payload
    },

    setCurrentUserStory:(state,action)=>{
        state.currentUserStory = action.payload
    },

    addStory:(state,action)=>{
        const exists = state.storyList.some(
            story => story?._id === action.payload?._id
        )

        if(!exists){
            state.storyList.unshift(action.payload)
        }
    }
}

})

export const {addStory,setStoryData,setStoryList,setCurrentUserStory} = storySlice.actions

export default storySlice.reducer