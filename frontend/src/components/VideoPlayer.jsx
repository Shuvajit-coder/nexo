import React, { useEffect, useRef, useState } from "react";
import { FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";

function VideoPlayer({ media, setIsPaused }) {
  const videoTag = useRef(null);

  const [mute, setMute] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = () => {
    if (!videoTag.current) return;

    if (isPlaying) {
      videoTag.current.pause();
      setIsPlaying(false);
      setIsPaused?.(true); // Pause progress bar
    } else {
      videoTag.current.play();
      setIsPlaying(true);
      setIsPaused?.(false); // Resume progress bar
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoTag.current;

        if (!video) return;

        // if (entry.isIntersecting) {
        //   video.play().catch(() => {});
        //   setIsPlaying(true);
        //   setIsPaused?.(false);
        // } else {
        //   video.pause();
        //   setIsPlaying(false);
        //   setIsPaused?.(true);
        // }

        if (entry.isIntersecting) {
  video.play().catch(() => {});
  setIsPlaying(true);
} else {
  video.pause();
  setIsPlaying(false);
  setIsPaused?.(true);
}
      },
      { threshold: 0.6 }
    );

    if (videoTag.current) {
      observer.observe(videoTag.current);
    }

    return () => observer.disconnect();
  }, [setIsPaused]);

  return (
    <div className="h-full relative cursor-pointer max-w-full rounded-2xl overflow-hidden">
      <video
        ref={videoTag}
        src={media}
        autoPlay
        loop
        muted={mute}
        className="h-full w-full object-cover"
        onClick={handleClick}
        onLoadedData={() => {
  setIsLoading(false);
  setIsPaused?.(false);
}}/>
{isLoading && (
  <div className="absolute inset-0 flex items-center justify-center bg-black">
    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
  </div>
)}
      <div
        className="absolute bottom-[10px] right-[10px]"
        onClick={() => setMute((prev) => !prev)}
      >
        {!mute ? (
          <FaVolumeHigh className="w-[20px] h-[20px] text-white" />
        ) : (
          <FaVolumeXmark className="w-[20px] h-[20px] text-white" />
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;