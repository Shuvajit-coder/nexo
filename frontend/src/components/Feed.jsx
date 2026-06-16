import React from "react";
import logo from "../assets/logo.png";
import { FaRegHeart } from "react-icons/fa";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import Post from "./Post";
import StoryDp from "./StoryDp";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { useNavigate } from "react-router-dom";


function Feed() {
  const { postData } = useSelector((state) => state.post);
  const { userData } = useSelector((state) => state.user);
  const { storyList,currentUserStory } = useSelector((state) => state.story);
  const navigate = useNavigate()
  const {notificationData}= useSelector(state=>state.user)
    
  //console.log("userData =>", userData);
  //console.log("currentUserStory =>", currentUserStory)
  return (
    <div className="lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto">
      <div className="w-full h-[100px] flex items-center justify-between p-[20px] lg:hidden">
        <img src={logo} alt="" className="w-[80px]" />
        <div className="flex items-center gap-[10px]">
          <div className="relative cursor-pointer" onClick={()=>navigate('/notifications')}>
            <FaRegHeart className="text-white w-[25px] h-[25px]" />
        {(notificationData.length>0 && notificationData.some((noti)=>noti.isRead===false)) &&  (<div className="absolute -top-1 -right-1 w-3 h-3 bg-[#ff0579] rounded-full z-50 border border-black"></div>)}
          </div>
        
        <BiMessageRoundedDetail className="text-white w-[28px] h-[28px] cursor-pointer" onClick={()=>navigate('/messages')}/>
        </div>
      </div>

      {/* Stories */}
      <div className="flex w-full overflow-x-auto gap-[10px] items-center p-[20px]">

        {/* Your Story */}
        <StoryDp
          userName="Your Story"
          profileImage={userData?.profileImage}
          story={currentUserStory}
        />

        {/* Following Users Stories */}
        {storyList &&
          storyList?.map((story) => (
            <StoryDp
              key={story._id}
              userName={story?.author?.userName}
              profileImage={story?.author?.profileImage}
              story={story}
            />
          ))}
      </div>

      <div className="w-full min-h-screen flex flex-col items-center gap-[20px] p-[10px] pt-[40px] bg-white rounded-t-[60px] relative pb-[120px]">
        <Nav />

        {postData &&
          postData.map((post) => (
            <Post post={post} key={post._id} />
          ))}
      </div>
    </div>
  );
}

export default Feed;