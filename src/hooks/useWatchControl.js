import { useState, useEffect } from "react";

export default function useWatchControl() {
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoSkipIntro, setAutoSkipIntro] = useState(false);
  const [autoNext, setAutoNext] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAutoPlay(JSON.parse(localStorage.getItem("autoPlay")) || false);
      setAutoSkipIntro(JSON.parse(localStorage.getItem("autoSkipIntro")) || false);
      setAutoNext(JSON.parse(localStorage.getItem("autoNext")) || false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("autoPlay", JSON.stringify(autoPlay));
    }
  }, [autoPlay]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("autoSkipIntro", JSON.stringify(autoSkipIntro));
    }
  }, [autoSkipIntro]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("autoNext", JSON.stringify(autoNext));
    }
  }, [autoNext]);

  return {
    autoPlay,
    setAutoPlay,
    autoSkipIntro,
    setAutoSkipIntro,
    autoNext,
    setAutoNext,
  };
}
