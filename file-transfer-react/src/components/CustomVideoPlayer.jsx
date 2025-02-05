// CustomVideoPlayer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack, Settings } from 'lucide-react';
import '../CustomVideoPlayer.css';

const CustomVideoPlayer = ({
                             src,
                             onNext,
                             onPrevious,
                             hasNext,
                             hasPrevious,
                             filename
                           }) => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isPlaying]);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleProgressChange = (e) => {
    const time = (e.nativeEvent.offsetX / progressRef.current.offsetWidth) * duration;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.parentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
      <div className="custom-video-container">
        <video
            ref={videoRef}
            src={src}
            className="custom-video"
            onClick={togglePlay}
        />

        <div className={`video-controls ${showControls ? 'visible' : ''}`}>
          <div className="top-controls">
            <div className="video-title">{filename}</div>
            <div className="settings-button">
              <Settings size={20} />
            </div>
          </div>

          <div className="progress-container" ref={progressRef} onClick={handleProgressChange}>
            <div
                className="progress-bar"
                style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          <div className="bottom-controls">
            <div className="left-controls">
              <button onClick={togglePlay}>
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              <button onClick={toggleMute}>
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

              <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
              />

              <span className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            </div>

            <div className="center-controls">
              <button
                  onClick={onPrevious}
                  disabled={!hasPrevious}
                  className={!hasPrevious ? 'disabled' : ''}
              >
                <SkipBack size={20} />
              </button>
              <button
                  onClick={onNext}
                  disabled={!hasNext}
                  className={!hasNext ? 'disabled' : ''}
              >
                <SkipForward size={20} />
              </button>
            </div>

            <div className="right-controls">
              <button onClick={toggleFullscreen}>
                <Maximize size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CustomVideoPlayer;