import React, { useRef, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaRegSquarePlus } from "react-icons/fa6";
import VideoPlayer from "../components/VideoPlayer";
import axios from 'axios';
import { serverUrl } from '../App'
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/postSlice";
import { setFlickData } from "../redux/flickSlice";
import { setCurrentUserStory, setStoryData } from "../redux/storySlice";
import { ClipLoader } from "react-spinners";
import { setUserData } from "../redux/userSlice";
function Upload() {
  const mediaInput = useRef()
  const navigate = useNavigate();
  const[uploadType, setUploadType] = useState("post")
  const[frontendMedia, setFrontendMedia]= useState(null)
  const[backendMedia,setBackendMedia]= useState(null)
  const[mediaType,setMediaType]= useState("")
  const [caption, setCaption]=useState("")
  const dispatch = useDispatch()
  const {postData} = useSelector(state=>state.post)
  const {storyData} = useSelector(state=>state.story)
  const {flickData} = useSelector(state=>state.flick)
  const[loading, setLoading] = useState(false)
  

  const handleMedia= (e)=>{
    const file = e.target.files[0]
    //console.log(file)
    if(file.type.includes("image")){
      setMediaType("image")
    }else{
      setMediaType("video")
    }
    setBackendMedia(file)
    setFrontendMedia(URL.createObjectURL(file))
  }

  const uploadPost = async()=>{
   
    try {
      const formData = new FormData()
      formData.append("caption",caption)
      formData.append("mediaType",mediaType)
      formData.append("media",backendMedia)

      const result = await axios.post(`${serverUrl}/api/post/upload`,formData,{withCredentials:true})
      dispatch(setPostData([...postData,result.data]))
      setLoading(false)
      navigate("/")
      //console.log(result)

    } catch (error) {
      console.log(error)
    }
  }

  const uploadFlick = async()=>{
   
    try {
      const formData = new FormData()
      formData.append("caption",caption)
      formData.append("media",backendMedia)

      const result = await axios.post(`${serverUrl}/api/flick/upload`,formData,{withCredentials:true})
      dispatch(setFlickData([...flickData,result.data]))
      setLoading(false)
      navigate("/")
      //console.log(result)

    } catch (error) {
      console.log(error)
    }
  }

  const uploadStory = async()=>{
    
    try {
      const formData = new FormData()
      formData.append("mediaType",mediaType)
      formData.append("media",backendMedia)

      const result = await axios.post(`${serverUrl}/api/story/upload`,formData,{withCredentials:true})
      //setUserData((prev)=>({...prev,story:result.data}))
      dispatch(setCurrentUserStory(result.data))
      //console.log(result.data)
      setLoading(false)
      navigate("/")

      //console.log(result)

    } catch (error) {
      console.log(error)
    }
  }

  const handleUpload = ()=>{
    setLoading(true)
    if(uploadType == "post"){
      uploadPost()
    }else if(uploadType=="story"){
      uploadStory()
    }else{
      uploadFlick()
    }
  }

  return (
    <div className="w-full h-[100vh] bg-black flex flex-col items-center">
      <div className=" w-full h-[80px] flex items-center gap-[20px] px-[20px]  ">
        <IoMdArrowRoundBack
          className="w-[25px] h-[25px] text-white cursor-pointer"
          onClick={() => navigate(`/`)}
        />
        <h1 className="text-white font-semibold text-[20px]">Upload Media</h1>
      </div>

     <div className="w-[80%] max-w-[600px] h-[80px] bg-white rounded-full flex justify-around items-center gap-[10px]"  >
        
        <div className={`${uploadType=="post"? "bg-black shadow-2xl shadow-black text-white":""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black `} onClick={()=>setUploadType("post")}>Post</div>

        <div className={`${uploadType=="story"? "bg-black shadow-2xl shadow-black text-white":""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black `}   onClick={()=>setUploadType("story")}>Story</div>

        <div className={`${uploadType=="flick"? "bg-black shadow-2xl shadow-black text-white":""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black `}  onClick={()=>setUploadType("flick")}>Flick</div>

      </div>


      {!frontendMedia &&   <div className="w-[80%] max-w-[500px] h-[250px] bg-[#0e1316] border-gray-800 border-2 flex flex-col items-center justify-center gap-[8px] mt-[15vh] rounded-2xl cursor-pointer hover:bg-[#353a3d]" onClick={()=>mediaInput.current.click()}>
        <input type="file" accept={uploadType=="flick"?"video/*":""} hidden ref={mediaInput} onChange={handleMedia} />
         <FaRegSquarePlus  className='text-white w-[22px] h-[22px] cursor-pointer'/>
         <div className="text-white text-[19px] font-semibold">Upload {uploadType}</div>
      </div>} 

      {frontendMedia && 
      <div className="w-[80%] max-w-[500px] h-[250px]  flex flex-col items-center justify-center mt-[15vh]  ">
         {mediaType=="image" &&
          <div className="w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center  mt-[15vh] ">
          <img src={frontendMedia} alt="" className=" h-[80%] rounded-2xl" />
          {uploadType!="story" && <input type="text" className="w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[25px]" placeholder="Write something here" onChange={(e)=>setCaption(e.target.value)} value={caption} />}
          
          </div>}

          {mediaType=="video" &&
          <div className="w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center  mt-[15vh] ">
          <VideoPlayer media={frontendMedia}/>
          {uploadType!="story" && <input type="text" className="w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[25px]" placeholder="Write something here" onChange={(e)=>setCaption(e.target.value)} value={caption} />}
          
          </div>}
      </div>
      }
     
       {frontendMedia && <button className="px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-white mt-[90px] cursor-pointer rounded-2xl" onClick={handleUpload}>{loading?<ClipLoader size={30} color="black"/>:`Upload ${uploadType}`}</button>}
    


    </div>
  );
}

export default Upload;
