import React, { useState } from "react";
import logo from "../assets/logo.png";
import { FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.png";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import OtherUser from "./OtherUser";
import { useNavigate } from "react-router-dom";
import Notifications from "../pages/Notifications";

function LeftHome() {
  const { userData, suggestedUser} = useSelector((state) => state.user);
  const[showNotifiaction,setShowNotification]= useState(false)
  //console.log("lefthome",userData);
  const dispatch = useDispatch()
  const {notificationData}= useSelector(state=>state.user)
  const navigate = useNavigate()
  const handleLogOut = async ()=>{
    try {
        const result = await axios.get(`${serverUrl}/api/auth/signout`,{
            withCredentials:true
        })
        dispatch(setUserData(null))
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div className={`w-[25%] hidden lg:block  h-[100vh] bg-[black] border-r-2 border-gray-900 ${showNotifiaction?"overflow-hidden":"overflow-auto"}`}>
      <div className="w-full h-[100px] flex items-center justify-between p-[20px]">
        <img src={logo} alt="" className="w-[80px]" />
        <div className="relative cursor-pointer " onClick={()=>setShowNotification(prev=>!prev)}>
          <FaRegHeart className="text-white w-[25px] h-[25px]" />
          {(notificationData.length>0 && notificationData.some((noti)=>noti.isRead===false)) &&  (<div className="absolute -top-1 -right-1 w-3 h-3 bg-[#ff0579] rounded-full z-50 border border-black"></div>)}
         
        </div> 
      </div>

      {!showNotifiaction && <><div className="flex items-center w-full justify-between gap-[10px] px-[10px] border-b-2 border-gray-900 py-[10px]">
        <div className="flex items-center gap-[10px] ">
          <div className="w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
            <img
              src={userData?.profileImage || dp}
              alt=""
              className="w-full object-cover"
            />
          </div>
          <div>
            <div className="text-[18px] font-semibold text-white">
              {userData?.userName}
            </div>
            <div className="text-[15px] font-semibold text-gray-400">
              {userData?.name}
            </div>
          </div>
        </div>
        <div className="text-blue-500 font-semibold cursor-pointer" onClick={handleLogOut}>
          Log Out
        </div>
      </div>
      
      <div className="w-full flex flex-col gap-[20px] p-[20px]">
        <h1 className="text-white text-[19px]">Suggested Users</h1>
        {suggestedUser && suggestedUser.slice(0,3).map((user,index)=>(
            <OtherUser key={index} user={user} />
        ))}
      </div>
</>}

{showNotifiaction && <Notifications/>}


      
    </div>
  );
}

export default LeftHome;
