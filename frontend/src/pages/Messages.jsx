import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OnlineUsers from "../components/OnlineUsers";
import { setSelectedUser } from "../redux/messageSlice";
import dp from "../assets/dp.png";

function Messages() {
  const { userData } = useSelector((state) => state.user);
  const { onlineUsers } = useSelector((state) => state.socket);
  const { previousChatUsers, selectedUsers } = useSelector(
    (state) => state.message,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // userData?.following?.forEach((user) => {
  //   console.log(
  //     user.userName,
  //     user._id,
  //     onlineUsers.includes(user._id?.toString())
  //   );
  // });

  return (
    <div className="w-full  min-h-[100vh] flex flex-col bg-black gap-[20px] p-[10px]">
      <div className=" w-full h-[80px] flex items-center gap-[20px] px-[20px]  ">
        <IoMdArrowRoundBack
          className="w-[25px] h-[25px] text-white lg:hidden cursor-pointer"
          onClick={() => navigate(`/`)}
        />
        <h1 className="text-white font-semibold text-[20px]">Conversations</h1>
      </div>

      <div className="w-full h-[80px] flex gap-[20px] justify-start items-center overflow-x-auto p-[20px] border-b-2 border-gray-800">
        {userData.following.map((user) =>
          onlineUsers?.includes(user._id?.toString()) ? (
            <OnlineUsers key={user._id} user={user} />
          ) : null,
        )}
      </div>
      <div className="w-full h-full overflow-auto flex flex-col gap-[20px]">
        {previousChatUsers.map((user, index) => (
          <div
            key={index}
            className="text-white cursor-pointer w-full flex items-center gap-[10px]"
            onClick={() => {
              dispatch(setSelectedUser(user));
              navigate("/messageArea");
            }}
          >
            {onlineUsers?.includes(user._id) ? (
              <OnlineUsers user={user} />
            ) : (
              <div className="w-[50px] h-[50px] border-2 border-black rounded-full overflow-hidden">
                <img
                  src={user?.profileImage || dp}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-col">
              <div className="text-white text-[18px] font-semibold">
                {user.userName}
              </div>
              {onlineUsers?.includes(user._id?.toString()) && (
                <div className="text-blue-500 text-[15px]">Active Now</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;
