// src/hooks/useVoiceCommands.js
import { useEffect, useRef } from "react";

export function useVoiceCommands(onCommand) {
  const recogRef = useRef(null);
  const listeningRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported");
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recog.continuous = true;

    recog.onstart = () => console.log("🎤 Speech recognition started");
    recog.onresult = (evt) => {
      const transcript =
        evt.results[evt.results.length - 1][0].transcript.trim();
      console.log("🎤 Heard:", transcript);
      onCommand(transcript.toLowerCase());
    };
    recog.onerror = (e) => console.error("🎤 Speech recognition error", e);

    recog.onend = () => {
      console.log("🎤 Speech recognition ended");
      // if we’re still “listening”, restart automatically
      if (listeningRef.current) {
        console.log("🎤 Auto-restarting recognition");
        recog.start();
      }
    };

    recogRef.current = recog;
    return () => {
      listeningRef.current = false;
      recog.stop();
      recogRef.current = null;
    };
  }, [onCommand]);

  const start = () => {
    if (recogRef.current && !listeningRef.current) {
      listeningRef.current = true;
      console.log("🎤 Calling start()");
      recogRef.current.start();
    }
  };

  const stop = () => {
    if (recogRef.current && listeningRef.current) {
      listeningRef.current = false;
      console.log("🎤 Calling stop()");
      recogRef.current.stop();
    }
  };

  return { start, stop };
}
