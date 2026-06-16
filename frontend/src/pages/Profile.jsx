import axios from "axios";
import React, { useEffect, useState } from "react";
import { serverUrl } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData, setUserData } from "../redux/userSlice";
import { IoMdArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.png";
import Nav from "../components/Nav";
import FollowButton from "../components/FollowButton";
import Post from "../components/Post";
import { setSelectedUser } from "../redux/messageSlice";

function Profile() {
  const navigate = useNavigate();
  const { userName } = useParams();
  const dispatch = useDispatch();

  const { profileData, userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);

  const [postType, setPostType] = useState("posts");

  // FIXED: safer profile fetch
  const handleProfile = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/getProfile/${userName}`,
        { withCredentials: true },
      );

      dispatch(setProfileData(result.data));
    } catch (error) {
      console.log("error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (userName) handleProfile();
  }, [userName]);

  // FIXED logout
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });

      dispatch(setUserData(null));
      dispatch(setProfileData(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const isOwnProfile =
    profileData?._id && userData?._id && profileData?._id === userData?._id;

  return (
    <div className="w-full min-h-screen bg-black">
      {/* HEADER */}
      <div className="w-full h-[80px] flex justify-between items-center px-[30px] text-white">
        <div onClick={() => navigate("/")}>
          <IoMdArrowRoundBack className="w-[25px] h-[25px] cursor-pointer" />
        </div>

        <div className="font-semibold text-[20px]">{profileData?.userName}</div>

        <div
          className="font-semibold cursor-pointer text-[20px] text-blue-500"
          onClick={handleLogOut}
        >
          Log Out
        </div>
      </div>

      {/* PROFILE INFO */}
      <div className="w-full h-[150px] flex items-start gap-[20px] justify-center pt-[20px] px-[10px]">
        <div className="w-[80px] h-[80px] md:w-[140px] md:h-[140px] border-2 rounded-full overflow-hidden">
          <img
            src={profileData?.profileImage || dp}
            className="w-full h-full object-cover"
            alt=""
          />
        </div>

        <div>
          <div className="font-semibold text-[22px] text-white">
            {profileData?.name}
          </div>

          <div className="text-[17px] text-white/80">
            {profileData?.profession || "New User"}
          </div>

          <div className="text-[17px] text-white/80">{profileData?.bio}</div>
        </div>
      </div>

      {/* STATS */}
      <div className="w-full flex justify-center gap-[40px] md:gap-[60px] pt-[20px] text-white">
        <div className="text-center">
          <div className="text-[24px] font-semibold">
            {profileData?.posts?.length || 0}
          </div>
          <div>Posts</div>
        </div>

        {/* FOLLOWERS */}
        <div className="text-center">
          <div className="flex items-center gap-[10px] justify-center">
            <div className="flex relative">
              {(profileData?.followers || []).slice(0, 3).map((user, index) => (
                <div
                  key={user?._id || index}
                  className={`w-[40px] h-[40px] border-2 border-black rounded-full overflow-hidden ${
                    index > 0 ? "absolute" : ""
                  }`}
                  style={index > 0 ? { left: `${index * 9}px` } : {}}
                >
                  <img
                    src={user?.profileImage || dp}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
              ))}
            </div>

            <div className="text-[24px] font-semibold">
              {profileData?.followers?.length || 0}
            </div>
          </div>
          <div>Followers</div>
        </div>

        {/* FOLLOWING */}
        <div className="text-center">
          <div className="flex items-center gap-[10px] justify-center">
            <div className="flex relative">
              {(profileData?.following || []).slice(0, 3).map((user, index) => (
                <div
                  key={user?._id || index}
                  className={`w-[40px] h-[40px] border-2 border-black rounded-full overflow-hidden ${
                    index > 0 ? "absolute" : ""
                  }`}
                  style={index > 0 ? { left: `${index * 9}px` } : {}}
                >
                  <img
                    src={user?.profileImage || dp}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
              ))}
            </div>

            <div className="text-[24px] font-semibold">
              {profileData?.following?.length || 0}
            </div>
          </div>
          <div>Following</div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="w-full flex justify-center gap-[20px] mt-[20px]">
        {isOwnProfile ? (
          <button
            className="px-[10px] min-w-[150px] h-[40px] bg-white rounded-2xl"
            onClick={() => navigate("/editprofile")}
          >
            Edit Profile
          </button>
        ) : (
          <>
            <FollowButton
              tailwind="px-[10px] min-w-[150px] h-[40px] bg-white rounded-2xl"
              targetUserId={profileData?._id}
              onFollowChange={handleProfile}
            />

            <button className="px-[10px] min-w-[150px] h-[40px] bg-white rounded-2xl" onClick={()=>{
              dispatch(setSelectedUser(profileData))
              navigate('/messageArea')}
              }>
              Message
            </button>
          </>
        )}
      </div>

      {/* POSTS SECTION */}
      <div className="w-full flex justify-center mt-[30px]">
        <div className="w-full max-w-[900px] bg-white rounded-t-[30px] flex flex-col items-center pt-[30px] pb-[100px]">
          {/* TABS */}
          {profileData?._id == userData?._id && (
            <div className="w-[90%] max-w-[500px] h-[80px] flex justify-center items-center gap-[10px]">
              <div
                className={`w-[28%] h-[80%] flex justify-center items-center rounded-full cursor-pointer ${
                  postType === "posts"
                    ? "bg-black text-white"
                    : "hover:bg-black hover:text-white"
                }`}
                onClick={() => setPostType("posts")}
              >
                Posts
              </div>

              <div
                className={`w-[28%] h-[80%] flex justify-center items-center rounded-full cursor-pointer ${
                  postType === "saved"
                    ? "bg-black text-white"
                    : "hover:bg-black hover:text-white"
                }`}
                onClick={() => setPostType("saved")}
              >
                Saved
              </div>
            </div>
          )}

          <Nav />

          {profileData?._id == userData?._id && (
            <>
              {" "}
              {/* USER POSTS */}
              {postType === "posts" &&
                postData
                  .filter((post) => post.author?._id === profileData?._id)
                  .map((post) => <Post key={post?._id} post={post} />)}
              {/* SAVED POSTS */}
              {postType === "saved" &&
                postData
                  .filter((p) =>
                    userData?.saved?.some((saved) => saved?._id === p?._id),
                  )
                  .reverse()
                  .map((post) => <Post key={post?._id} post={post} />)}
            </>
          )}

          {profileData?._id != userData?._id && (
            <>
              {" "}
              {/* USER POSTS */}
              {postData
                .filter((post) => post.author?._id === profileData?._id)
                .map((post) => (
                  <Post key={post?._id} post={post} />
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
