import { useEffect, useRef } from "react";

export function useVoiceCommands(onCommand) {
  const recogRef = useRef(null);

  useEffect(() => {
    // feature‐detect
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recog.continuous = true;

    recog.onresult = (evt) => {
      const transcript =
        evt.results[evt.results.length - 1][0].transcript.trim();
      onCommand(transcript.toLowerCase());
    };

    recog.onerror = (e) => {
      console.error("Speech recognition error", e);
    };

    recogRef.current = recog;
    return () => recog.stop();
  }, [onCommand]);

  const start = () => recogRef.current && recogRef.current.start();
  const stop = () => recogRef.current && recogRef.current.stop();

  return { start, stop };
}
