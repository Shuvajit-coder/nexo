import React from "react";
import dp from "../assets/dp.png";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from 'axios'
import { serverUrl } from "../App";
import { useState } from "react";
import { useEffect } from "react";

function StoryDp({ profileImage, userName,story }) {
  const navigate = useNavigate()
  const {userData} = useSelector(state=>state.user)
  const {storyData, storyList} = useSelector(state=>state.story)
 //console.log("story prop =>", story)
  const [viewed, setViewed] = useState(false)
 const handleViewrs = async()=>{
  try {
    const result = await axios.get(`${serverUrl}/api/story/view/${story._id}`,{withCredentials:true})
    
  } catch (error) {
    console.log(error)
  }
 }



 
 useEffect(()=>{
  if(story?.viewers?.some((viewer)=>
  viewer?._id?.toString()===userData._id.toString() || viewer?.toString()==userData._id.toString()
)){
  setViewed(true)
}else{
  setViewed(false)
}
 
 },[story,userData,storyData, storyList])




  const handleClick=()=>{
    if(!story && userName=="Your Story"){
      navigate("/upload")
    }else if(story && userName=="Your Story"){
       handleViewrs()
      navigate(`/story/${userData.userName}`)
     
    }else{
       handleViewrs()
       navigate(`/story/${userName}`)
    }
  }

 
  return (
    <div className="flex flex-col w-[80px]" >
      <div className={`w-[80px] h-[80px] ${
  !story
    ? null
    : !viewed
    ? "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
    : "bg-gradient-to-tr from-gray-500 via-gray-700 to-gray-900"
} rounded-full flex justify-center items-center relative`} onClick={handleClick}>
      <div className="w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
        <img
          src={profileImage || dp}
          alt=""
          className="w-full h-full object-cover"
        />
        {!story && userName=="Your Story" && <div>
          <AiOutlinePlusCircle className="text-black absolute bottom-[8px] right-[10px] bg-white w-[22px] h-[22px] rounded-full " />
          </div>}
        
      </div>
      </div>
      <div className="text-[14px] text-center truncate w-full text-white">
        {userName}
      </div>
    </div>
  );
}

export default StoryDp;
