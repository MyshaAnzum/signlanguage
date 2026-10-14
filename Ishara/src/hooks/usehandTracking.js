import { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { toFeatures } from "../utils";

const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
const INTERVAL = 300;

const ERROR_MESSAGES = {
  NotAllowedError: "Camera permission denied. Allow camera access and refresh.",
  NotFoundError: "No camera found on this device.",
  NotReadableError: "Camera is being used by another app.",
};

export default function useHandTracking(videoRef, onResult) {
  const callbackRef = useRef(onResult);
  const [error, setError] = useState("");
  callbackRef.current = onResult;

  useEffect(() => {
    let landmarker;
    let stream;
    let frameId;
    let lastRun = 0;
    let stopped = false;

    const detect = () => {
      if (stopped) return;

      const video = videoRef.current;
      const now = performance.now();

      if (video && video.readyState >= 2 && now - lastRun > INTERVAL) {
        lastRun = now;
        const { landmarks } = landmarker.detectForVideo(video, now);
        callbackRef.current(landmarks.length ? toFeatures(landmarks[0]) : null);
      }

      frameId = requestAnimationFrame(detect);
    };

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (stopped) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const vision = await FilesetResolver.forVisionTasks(WASM_URL);
        landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL },
          runningMode: "VIDEO",
          numHands: 1,
        });

        if (stopped) {
          landmarker.close();
          return;
        }

        detect();
      } catch (err) {
        if (stopped) return;
        setError(ERROR_MESSAGES[err.name] || "Could not load hand tracking. Check your internet connection.");
      }
    };

    start();

    return () => {
      stopped = true;
      cancelAnimationFrame(frameId);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [videoRef]);

  return error;
}