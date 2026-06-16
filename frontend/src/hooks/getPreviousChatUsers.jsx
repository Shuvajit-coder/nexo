import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setUserData } from '../redux/userSlice'
import { setCurrentUserStory } from '../redux/storySlice'
import { setPreviousChatUsers } from '../redux/messageSlice'

function getPreviousChatUser() {
    
    const dispatch = useDispatch()
    const {storyData}=useSelector(state=>state.story)
    const{messages}=useSelector(state=>state.message)
  useEffect(()=>{
     
    const fetchUser = async()=>{
        try {
            const result = await axios.get(`${serverUrl}/api/message/prevChats`,{
                withCredentials:true
            })
            
            dispatch(setPreviousChatUsers(result.data))
             
           
        } catch (error) {
            console.log(error)
        }
    }
    fetchUser()
  },[messages])
}

export default getPreviousChatUser
