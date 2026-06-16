import React from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import FlickCard from '../components/FlickCard';
import { useSelector } from 'react-redux';


function Flicks() {
        const navigate = useNavigate();
        const {flickData}= useSelector(state=>state.flick)
  return (
    <div className='w-screen h-screen bg-black overflow-hidden flex justify-center items-center'>
      <div className=" w-full h-[80px] flex items-center gap-[20px] px-[20px] fixed top-0 left-[10px] z-[100] ">
              <IoMdArrowRoundBack
                className="w-[25px] h-[25px] text-white cursor-pointer"
                onClick={() => navigate('/')}
              />
              <h1 className="text-white font-semibold text-[20px]">Explore Flicks</h1>
            </div>
            <div className='h-[100vh] overflow-y-scroll snap-y snap-mandatory scrollbar-hide'>
                {flickData.map((flick,index)=>(
                    <div key={flick._id || index} className='h-screen snap-start '>
                        <FlickCard flick={flick} />
                    </div>
                    
                ))}
            </div>
            
    </div>
  )
}

export default Flicks
