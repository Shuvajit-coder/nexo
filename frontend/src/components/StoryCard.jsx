import React, { useEffect, useState } from "react";
import dp from "../assets/dp.png";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import VideoPlayer from "./VideoPlayer";
import { useSelector } from "react-redux";
import { FaEye } from "react-icons/fa";

function StoryCard({ storyData }) {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [showViewers, setShowViewers] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);


  useEffect(() => {
  setProgress(0);

  if (showViewers) {
    setIsPaused(true);
  } else {
    setIsPaused(storyData?.mediaType === "video");
  }
}, [showViewers, storyData]);

  useEffect(() => {
    setProgress(0);

    if (storyData?.mediaType === "video") {
      setIsPaused(true);
    } else {
      setIsPaused(false);
    }
  }, [storyData]);

  useEffect(() => {
    if (isPaused) return;

    const duration = 15000;
    const interval = 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 100 / (duration / interval);

        if (next >= 100) {
          clearInterval(timer);
          navigate("/");
          return 100;
        }

        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, navigate]);

  return (
    <div className="w-full max-w-[500px] h-screen border-x-2 border-gray-800 bg-black relative">
      {/* Progress Bar */}
      <div className="absolute top-[10px] left-0 w-full px-[10px] z-50">
        <div className="w-full h-[4px] bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all ease-linear duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-[10px] absolute top-[25px] left-0 px-[20px] z-50">
        <IoMdArrowRoundBack
          className="w-[25px] h-[25px] text-white cursor-pointer"
          onClick={() => navigate("/")}
        />

        <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
          <img
            src={storyData?.author?.profileImage || dp}
            alt=""
            onError={(e) => {
              e.target.src = dp;
            }}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-white font-semibold">
          {storyData?.author?.userName}
        </div>
      </div>

      {!showViewers && (
  <>
    <div className="w-full h-[80%] flex justify-center items-center mt-[20%] cursor-pointer">
      {storyData?.mediaType === "image" && (
        <img
          src={storyData?.media}
          alt=""
          className="w-full h-full object-contain"
        />
      )}

      {storyData?.mediaType === "video" && (
        <VideoPlayer media={storyData?.media} setIsPaused={setIsPaused} />
      )}
    </div>

    {storyData?.author?.userName === userData?.userName && (
      <div className="w-full h-[70px] flex items-center gap-[10px] absolute bottom-0 p-2 left-0 cursor-pointer"onClick={() => setShowViewers(true)}>
        <div
          className="text-white flex items-center gap-[5px] cursor-pointer"
          
        >
          <FaEye />
          {storyData?.viewers?.length}
        </div>

        <div className="flex relative ">
          {(storyData?.viewers || [])
            .slice(0, 3)
            .map((viewer, index) => (
              <div
                key={viewer?._id}
                className={`w-[30px] h-[30px] border-2 border-black rounded-full overflow-hidden ${
                  index > 0 ? "absolute" : ""
                }`}
                style={index > 0 ? { left: `${index * 9}px` } : {}}
              >
                <img
                  src={viewer?.profileImage || dp}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            ))}
        </div>
      </div>
    )}
  </>
)}

      {showViewers && (
        <>
          <div className="w-full h-[30%] flex justify-center items-center cursor-pointe mt-[15%]"  onClick={()=>setShowViewers(false)}>
            {storyData?.mediaType === "image" && (
              <img
                src={storyData?.media}
                alt=""
                className="w-full h-[80%] object-contain"
              />
            )}

            {storyData?.mediaType === "video" && (
              <VideoPlayer media={storyData?.media} setIsPaused={setIsPaused} />
            )}
          </div>

          <div className="w-full h-[55%] border-t-2 border-t-gray-800 p-[20px]">
            <div className=" flex items-center text-white gap-[10px]">
              {" "}
              <FaEye />
              <span>{storyData?.viewers.length}</span> <span>Viewers</span>
            </div>
            <div className="w-full max-w-full flex flex-col gap-[10px] overflow-y-auto pt-[20px]">
              {storyData?.viewers.map((viewer, index) => (
                <div
                  key={index}
                  className="w-full flex items-center gap-[20px]"
                >
                  <div className="w-[30px] h-[30px]  md:w-[40px]  md:h-[40px]  border border-2 border-black cursor-pointer rounded-full overflow-hidden">
                    <img
                      src={viewer?.profileImage || dp}
                      alt=""
                      onError={(e) => {
                        e.target.src = dp;
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="text-white font-semibold">
                    {viewer?.userName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default StoryCard;
