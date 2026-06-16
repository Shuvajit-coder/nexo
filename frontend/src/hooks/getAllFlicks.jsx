import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setPostData } from '../redux/postSlice'
import { setFlickData } from '../redux/flickSlice'

function getAllFlicks() {
    
    const dispatch = useDispatch()
    const {userData} = useSelector(state=>state.user)

  useEffect(()=>{
     
    const fetchFlicks = async()=>{
        try {
            const result = await axios.get(`${serverUrl}/api/flick/getAll`,{
                withCredentials:true
            })
            
            dispatch(setFlickData(result.data))
        } catch (error) {
            console.log(error)
        }
    }
    fetchFlicks()
  },[dispatch,userData])
}

export default getAllFlicks
