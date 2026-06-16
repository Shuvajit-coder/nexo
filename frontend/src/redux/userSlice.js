import { createSlice } from "@reduxjs/toolkit";


const userSlice=createSlice({
    name:"user",
    initialState:{
        userData:null,
        suggestedUser:null,
        profileData:null,
        following:[],
        searchData:[],
        notificationData:[]
    },
    reducers:{
        setUserData:(state,action)=>{
            state.userData = action.payload
            state.following = action.payload?.following || []
        },
        setSuggestedUser:(state,action)=>{
            state.suggestedUser = action.payload
        },
        setProfileData:(state,action)=>{
            state.profileData = action.payload
        },
        setFollowing:(state, action)=>{
            state.following = action.payload
        },
        setNotificationData:(state, action)=>{
            state.notificationData = action.payload
        },
        setSearchData:(state,action)=>{
            state.searchData=action.payload
        },
        toggleFollow:(state,action)=>{
    const targetUserId = action.payload

    if(state.following.includes(targetUserId)){
        state.following = state.following.filter(
            id => id !== targetUserId
        )
    }else{
        state.following.push(targetUserId)
    }
}
        
    }
})

export const {setUserData,setSearchData,setNotificationData, setSuggestedUser,setProfileData,setFollowing,toggleFollow} = userSlice.actions

export default userSlice.reducer