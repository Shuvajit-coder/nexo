import React from 'react'
import { GoHomeFill } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { RxVideo } from "react-icons/rx";
import { FaRegSquarePlus } from "react-icons/fa6";
import dp from "../assets/dp.png"
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Nav() {
  const navigate = useNavigate()
  const {userData}= useSelector(state=>state.user)
  //console.log(userData);
  return (
    <div className='w-[90%] lg:w-[40%] h-[60px] bg-black flex justify-around items-center fixed bottom-[20px] rounded-full shadow-2xl shadow-[#000000] z-[100]'>
      <div onClick={()=>navigate("/")}><GoHomeFill className='text-white w-[22px] h-[22px] cursor-pointer'/></div>
      <div onClick={()=>navigate('/search')}><IoSearch className='text-white w-[22px] h-[22px] cursor-pointer '/></div>
      <div onClick={()=>navigate("/upload")}><FaRegSquarePlus  className='text-white w-[22px] h-[22px] cursor-pointer'/></div>
      <div onClick={()=>navigate('/flicks')} ><RxVideo  className='text-white w-[25px] h-[25px] cursor-pointer '/></div>
      <div className="w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden" onClick={()=>navigate(`/profile/${userData?.userName}`)}>
                  <img
                    src={userData?.profileImage || dp}
                    alt=""
                    className="w-full h-full  object-cover"
                  />
                </div>
    </div>
  )
}

export default Nav
