import React, { useEffect, useRef, useState } from "react";
import { FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";
import dp from "../assets/dp.png";
import { IoSendSharp } from "react-icons/io5";
import FollowButton from "./FollowButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { MdOutlineInsertComment } from "react-icons/md";
import axios from "axios";
import { serverUrl } from "../App";
import { setFlickData } from "../redux/flickSlice";

function FlickCard({ flick }) {
  const dispatch = useDispatch();
  const videoRef = useRef();
  const commentRef = useRef();
  const navigate = useNavigate()
  const [mute, setMute] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const {userData}= useSelector(state=>state.user)
  const {flickData}= useSelector(state=>state.flick)
  const[showHeart,setShowHeart]=useState(false)
  const [showComment, setShowComment] = useState(false);
   const [message, setMessage] = useState("");
   const lastTap = useRef(0);
const {socket}=useSelector(state=>state.socket)

 useEffect(()=>{
   socket?.on("likedFlick",(updatedData)=>{
    const updatedFlicks = flickData.map((p) =>
        p?._id == updatedData.flickId? {...p,likes:updatedData.likes} : p,
      );
      dispatch(setFlickData(updatedFlicks))
   })
   socket?.on("commentedFlick",(updatedData)=>{
    const updatedFlicks = flickData.map((p) =>
        p?._id == updatedData.flickId ? {...p,comments:updatedData.comments} : p,
      );
      dispatch(setFlickData(updatedFlicks))
   })

   return ()=>{socket?.off("likedFlick")
  socket?.off("commentedFlick")}
  },[socket,flickData,dispatch])


  const handleClick = () => {
    const video = videoRef.current;

    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

   const handleLike = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/flick/like/${flick?._id}`, {
        withCredentials: true,
      });
      const updatedFlick = result.data;

      const updatedFlicks = flickData.map((p) =>
        p?._id == flick?._id ? updatedFlick : p,
      );
      dispatch(setFlickData(updatedFlicks));
    } catch (error) {
        console.log(error)
    }
  };



  const handleComment = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/flick/comments/${flick?._id}`,
        { message },
        { withCredentials: true },
      );
      const updatedFlick = result.data;

      const updatedFlicks = flickData.map((p) =>
        p?._id == flick?._id ? updatedFlick : p,
      );
      dispatch(setFlickData(updatedFlicks));
      setMessage("");
    } catch (error) {
        console.log(error)
    }
  };


  useEffect(()=>{
   const handleClickOutside=(event)=>{
   if(commentRef.current && !commentRef.current.contains(event.target)){
    setShowComment(false)
   }
   }
   if(showComment){
    document.addEventListener("mousedown",handleClickOutside)
   }else{
    document.removeEventListener("mousedown",handleClickOutside)
   }
  },[showComment])


  const handleLikeOnDoubleClick=()=>{
   
    setShowHeart(true)
    setTimeout(()=>setShowHeart(false),900)
    {!flick.likes.includes(userData?._id) ? handleLike() :null}
  }

  const handleTap = () => {
  const now = Date.now();

  if (now - lastTap.current < 300) {
    handleLikeOnDoubleClick();
  }

  lastTap.current = now;
};

  const toggleMute = () => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = !video.muted;
    setMute(video.muted);
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e) => {
    const video = videoRef.current;

    if (!video || !video.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;

    video.currentTime = percentage * video.duration;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;

        if (!video) return;

        if (entry.isIntersecting) {
          video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 },
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    const updateProgress = () => {
      if (!video) return;

      setCurrentTime(video.currentTime);
      setDuration(video.duration || 0);

      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video?.addEventListener("timeupdate", updateProgress);
    video?.addEventListener("loadedmetadata", updateProgress);

    return () => {
      video?.removeEventListener("timeupdate", updateProgress);
      video?.removeEventListener("loadedmetadata", updateProgress);
    };
  }, []);

  return (
    <div className="w-full lg:w-[480px] h-screen flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative overflow-hidden">
      {showHeart && <div className="absolute top-1/2 left-1/2  heart-animation z-[999]">
      <FaHeart className="w-[140px] h-[140px] text-white drop-shadow-2xl"/>
      </div>}

      <div ref={commentRef} className={`absolute z-[200] bottom-0 w-full h-[450px] p-[10px] rounded-t-4xl bg-[#0e1718] transition-transform duration-500 ease-in-out left-0 shadow-2xl shadow-black ${showComment?'translate-y-0':'translate-y-[100%] '}`} >
        <h1 className="text-white text-[20px] text-center font-semibold">Comments</h1>
        
        <div className="w-full h-[350px] overflow-y-auto flex flex-col gap-[20px]">
          {flick.comments.length==0 && <div className="text-center text-white text-[20px] font-semibold mt-[50px]">No Comments Yet </div>}
          {flick.comments.map((com,index)=>(
            <div key={index} className="w-full  flex flex-col gap-[5px] border-b-[1px] border-gray-800 justify-center pb-[10px] mt-[10px]">
             <div className="flex justify-start items-center gap-[10px] md:gap-[20px] cursor-pointer "
                     onClick={ ()=>  
                        navigate(`/profile/${com?.author?.userName}`)} >
                       <div className="w-[20px] h-[20px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
                         <img
                           src={com?.author?.profileImage || dp}
                           alt=""
                           className="w-full object-cover"
                         />
                       </div>
                       <div className="w-[150px] font-semibold text-white truncate">
                         {com.author?.userName}
                       </div>
              </div>
              <div className="text-white pl-[60px]">
                {com.message}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full fixed bottom-0 h-[80px] flex items-center justify-between px-[10px] py-[10px] ">
                    <div className="w-[20px] h-[20px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden ">
                      <img
                        src={flick?.author?.profileImage || dp}
                        alt=""
                        className="w-full object-cover"
                      />
                    </div>
                    <input
                      type="text"
                      className="px-[10px] border-b-2 border-b-gray-500 w-[90%] outline-none h-[40px] placeholder:text-white text-white"
                      placeholder="Write comment..."
                      onChange={(e) => setMessage(e.target.value)}
                      value={message}
                    />
                    {message && <button
                      className="absolute right-[20px] cursor-pointer"
                      onClick={handleComment}
                    >
                      <IoSendSharp className="w-[25px]  h-[25px] text-white" />
                    </button>}
        </div>
      </div>
    
      <video
        ref={videoRef}
        autoPlay
        mute={mute}
        loop
        playsInline
        src={flick.media}
        className="w-full max-h-full"
        onClick={handleClick}
        onDoubleClick={handleLikeOnDoubleClick}
         onTouchStart={handleTap}
      />

      {/* Mute Button */}
      <div
        className="absolute top-5 right-5 z-50 cursor-pointer z-[100]"
        onClick={toggleMute}
      >
        {mute ? (
          <FaVolumeXmark className="w-5 h-5 text-white" />
        ) : (
          <FaVolumeHigh className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Time + Progress */}
      <div className="absolute bottom-1 left-0 w-full px-3">
        <div className="flex justify-between text-white text-xs mb-1 ">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div
          onClick={handleSeek}
          className="w-full h-1 bg-gray-600 rounded cursor-pointer"
        >
          <div
            className="h-full  bg-white rounded transition-all ease-linear duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="w-full h-[100px] absolute bottom-[5px] px-[10px] flex flex-col gap-[6px]">
        <div className="flex  items-center gap-[5px]">
          <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden" onClick={()=>navigate(`/profile/${flick.author?.userName}`)}>
            <img
              src={flick?.author?.profileImage || dp}
              alt=""
              className="w-full object-cover"
            />
          </div>
          <div className="w-[100px] font-semibold truncate text-white">
            {flick.author?.userName}
          </div>
          <FollowButton targetUserId={flick.author?._id} tailwind={"px-[10px] py-[5px] text-white border-2 border-white text-[14px] rounded-2xl z-[100]"}/>
        </div>
        <div className="text-white px-[10px]">
          {flick.caption }
        </div>

        <div className="absolute  right-0 flex flex-col gap-[20px] text-white bottom-[150px] justify-center
         px-[10px]">
           <div className="flex flex-col items-center cursor-pointer">
              <div onClick={handleLike}>
                {!flick.likes.includes(userData?._id) && (
                              <FaRegHeart className="w-[25px] h-[25px] cursor-pointer"  />
                            )}
                            {flick.likes.includes(userData?._id) && (
                              <FaHeart className="w-[25px] h-[25px] cursor-pointer text-[#ee0f59]" />
                            )}
              </div>
              <div>{flick.likes.length}</div>
           </div>
               
           <div className="flex flex-col items-center cursor-pointer">
            <div>
              <MdOutlineInsertComment className="w-[25px] h-[25px] cursor-pointer" onClick={()=>setShowComment(true)} />
            </div>
            <div>{flick.comments.length}  </div>
           </div>
        </div>
      </div>

    </div>
  );
}

export default FlickCard;
