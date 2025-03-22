// src/BrowserWarning.js
import React, { useEffect, useState } from "react";

const BrowserWarning = () => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isChrome =
      userAgent.includes("chrome") &&
      !userAgent.includes("edg") &&
      !userAgent.includes("opr");

    // Check if Web Speech API is supported
    const isSpeechRecognitionSupported =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    // Show warning if browser is not Chrome or Speech API is unsupported
    if (!isChrome || !isSpeechRecognitionSupported) {
      setShowWarning(true);
    }
  }, []);

  return (
    <>
      {showWarning && (
        <div style={styles.warning}>
          ⚠ Voice recognition may not work properly in browsers other than
          Google Chrome. Please use Chrome for the best experience.
        </div>
      )}
    </>
  );
};

const styles = {
  warning: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "10px",
    border: "1px solid #f5c6cb",
    margin: "10px 0",
    textAlign: "center",
    fontSize: "14px",
  },
};

export default BrowserWarning;