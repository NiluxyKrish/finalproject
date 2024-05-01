import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import "../App.css";
import alertSound from "../sounds/alarm.mp3";
import { doSignOut } from "../firebase/auth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const webcamRef = useRef(null);
  const [drowsinessStatus, setDrowsinessStatus] = useState("");
  const [blinking, setBlinking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      captureAndPredict();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (drowsinessStatus === "Closed") {
      const blinkInterval = setInterval(() => {
        setBlinking((prevBlinking) => !prevBlinking);
      }, 1000);
      setIsPlaying(true);
      return () => {
        clearInterval(blinkInterval);
        setIsPlaying(false);
      };
    } else {
      setBlinking(false);
      setIsPlaying(false);
    }
  }, [drowsinessStatus]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isPlaying]);

  const captureAndPredict = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        try {
          const formData = new FormData();
          formData.append("image", dataURLtoFile(imageSrc));
          const response = await axios.post(
            "http://127.0.0.1:5000/api/detect_drowsiness",
            formData
          );
          setDrowsinessStatus(response.data.status);
        } catch (error) {
          console.error("Error sending frame to backend:", error);
        }
      }
    }
  };

  const dataURLtoFile = (dataUrl) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], "webcam_frame.jpeg", { type: mime });
  };

  return (
    <div className="home-container">
      <div className="webcam-container">
        <Webcam
          width={window.innerHeight}
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        />
      </div>
      <div className="status-container">
        <span className="status-heading">Drowsiness Detection</span>
        <span className="status-text" style={{ color: drowsinessStatus === "Closed" ? "red" : "black" }}>
          Your Eyes are {drowsinessStatus}
        </span>
      </div>
      <audio ref={audioRef} src={alertSound} />
      <button
        onClick={() => {
          doSignOut().then(() => {
            navigate("/login");
          });
        }}
        className="sign-out-button"
      >
        Sign out
        <svg
          className="sign-out-icon"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </button>
    </div>
  );
};

export default Home;
