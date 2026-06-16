

import React from "react";
import dp from "../assets/dp.png";

function NotificationCard({ noti }) {
  return (
    <div className="w-full flex justify-between items-center p-[5px] min-h-[50px] bg-gray-800 rounded-full">
      
      {/* Sender Info */}
      <div className="flex gap-[10px] items-center">
        <div className="w-[40px] h-[40px] border-2 border-black rounded-full overflow-hidden">
          <img
            src={noti?.sender?.profileImage || dp}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-white text-[16px] font-semibold">
            {noti?.sender?.userName}
          </h1>

          <div className="text-[15px] text-gray-200">
            {noti?.message}
          </div>
        </div>
      </div>

      {/* Notification Preview */}
      <div className="w-[40px] h-[40px] rounded-full overflow-hidden border-2 border-white">

        {/* Flick Like/Comment */}
        {noti?.flick ? (
          <video
            src={noti.flick.media}
            muted
            className="w-full h-full object-cover"
          />
        ) : 

        /* Post Like/Comment */
        noti?.post ? (
          noti.post.mediaType === "image" ? (
            <img
              src={noti.post.media}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={noti.post.media}
              muted
              className="w-full h-full object-cover"
            />
          )
        ) : 

        /* Follow Notification */
        noti?.type === "follow" ? (
          <img
            src={noti?.sender?.profileImage || dp}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : null}

      </div>
    </div>
  );
}

export default NotificationCard;