import { useState, useEffect, useRef } from 'react';

// Using 'any' for window properties to avoid TypeScript errors with vendor prefixes.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useDictation = (onTranscript: (transcript: string) => void) => {
    const recognitionRef = useRef<any | null>(null);
    const [isListening, setIsListening] = useState(false);
    const isSupported = !!SpeechRecognition;

    useEffect(() => {
        if (!isSupported) {
            console.warn("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false; // We only care about the final result
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                onTranscript(finalTranscript);
            }
        };

        recognition.onend = () => {
            // Check if it was stopped intentionally before resetting state
            if (recognitionRef.current) {
                setIsListening(false);
            }
        };
        
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
                recognitionRef.current = null;
            }
        };
    }, [isSupported, onTranscript]);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (error) {
                console.error("Error starting speech recognition:", error);
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false); // Force state change immediately
        }
    };

    return { isListening, startListening, stopListening, isSupported };
};