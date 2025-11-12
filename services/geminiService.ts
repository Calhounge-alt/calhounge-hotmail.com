import { GoogleGenAI, Modality, Type } from "@google/genai";
import { PromptAnalysis, ArtStyle, Vibe, VoiceName, MusicStyle, CustomMusicParams } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const explainPrompt = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Rephrase this user's prompt into a more detailed instruction for a story or image AI: "${prompt}"`,
      config: {
        systemInstruction: `You are an AI assistant that helps kids understand how their ideas are interpreted. Rephrase the user's prompt into a simple, positive, and detailed instruction (under 50 words) that another AI could understand. Focus on extracting the core concepts, mood, and subject. For example, if the user says "a brave girl in a storm", you could say "Generate an image of a young girl showing confidence while facing strong winds and rain. The focus should be on her courage and the motion of the storm." Do not use JSON.`,
        maxOutputTokens: 100,
        temperature: 0.5,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error explaining prompt:", error);
    return "Sorry, I couldn't explain that prompt right now. Try generating the story directly!";
  }
};

export const generateStory = async (prompt: string, vibe?: Vibe): Promise<string> => {
  try {
    const vibePrompts: Record<Vibe, string> = {
        joyful: 'Write in a joyful, lighthearted, and optimistic tone.',
        mysterious: 'Write in a mysterious and suspenseful tone with a sense of wonder.',
        courageous: 'Write in a courageous and adventurous tone, focusing on bravery and action.',
        reflective: 'Write in a thoughtful, calm, and reflective tone.'
    };
    const vibeInstruction = vibe ? vibePrompts[vibe] : '';


    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a creative and kid-friendly storyteller. ${vibeInstruction} Write a short, imaginative story (about 150 words) based on this idea: "${prompt}". Make it exciting and suitable for children in grades 3-8.`,
      config: {
        temperature: 0.8,
        topP: 0.95,
        maxOutputTokens: 250,
        thinkingConfig: { thinkingBudget: 100 },
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating story:", error);
    return "Oops! Our storyteller seems to be taking a nap. Please try again in a moment.";
  }
};

export const generateImage = async (
  prompt: string, 
  artStyle: ArtStyle, 
  uploadedImage?: {data: string, mimeType: string}
): Promise<string | null> => {
  try {
    const stylePrompts: Record<ArtStyle, string> = {
      cartoon: 'in a vibrant, colorful, and kid-friendly illustration in a modern cartoon style',
      watercolor: 'in a soft and dreamy watercolor painting style with gentle colors',
      pixel_art: 'in a colorful and charming 8-bit retro pixel art style',
      realistic: 'as a realistic, high-quality digital painting with vibrant colors',
      comic_book: 'in a dynamic comic book style with bold lines, vivid colors, and halftone dots',
      afrofuturism: 'in a vibrant Afrofuturism style, blending futuristic technology with African culture and aesthetics',
      collage: 'in a mixed-media digital collage style, combining different textures, photos, and drawings'
    };
    
    const styleDescription = stylePrompts[artStyle] || stylePrompts.cartoon;

    const textPart = { text: '' };
    const parts: any[] = [];

    if (uploadedImage) {
      parts.push({
        inlineData: {
          mimeType: uploadedImage.mimeType,
          data: uploadedImage.data,
        },
      });
      textPart.text = `Using the provided image as inspiration or a base, create a new kid-friendly illustration. Combine it with this theme: "${prompt}". The final image should be ${styleDescription}. Avoid adding any text or letters.`;
    } else {
      textPart.text = `Create a kid-friendly illustration ${styleDescription} for a story. The scene is: ${prompt}. Avoid text and letters.`;
    }
    parts.push(textPart);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:image/png;base64,${base64ImageBytes}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};


export const analyzePrompt = async (prompt: string): Promise<PromptAnalysis | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the following user-provided prompt: "${prompt}"`,
            config: {
                systemInstruction: `You are a friendly "Prompt Coach" for kids in grades 3-8. Your goal is to help them write better prompts for generating stories and art.
                Analyze the user's prompt based on these criteria:
                1.  **Specificity:** Does it include details like adjectives, settings, actions, or styles?
                2.  **Clarity:** Is it easy to understand what the user wants?
                3.  **Creativity:** Does it have an interesting or unique idea?

                Based on your analysis, provide a JSON response with three fields:
                - "score": An integer from 1 (very vague) to 10 (very detailed and creative).
                - "title": A short, encouraging title for the feedback (e.g., "Good Start!", "Getting Warmer!", "Excellent Detail!").
                - "tips": An array of 2-3 short, simple, actionable strings with tips for improvement. Frame the tips constructively. For example, instead of "Your prompt is bad," say "Try adding a feeling or emotion."`,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.INTEGER },
                        title: { type: Type.STRING },
                        tips: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["score", "title", "tips"],
                }
            }
        });

        let jsonStr = response.text.trim();
        const analysisResult = JSON.parse(jsonStr) as PromptAnalysis;
        return analysisResult;

    } catch (error) {
        console.error("Error analyzing prompt:", error);
        return {
            score: 0,
            title: "Analysis Error",
            tips: ["Sorry, the Prompt Coach is taking a break. Please try again in a moment!"]
        };
    }
};

export const generateSpeech = async (text: string, voiceName: VoiceName = 'Ruby'): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this story in a friendly and engaging voice for a child: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName },
            },
        },
      },
    });
    
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;

  } catch (error) {
    console.error("Error generating speech:", error);
    return null;
  }
};

const musicDatabase: Record<string, string> = {
    // Styles
    afrobeats: 'https://cdn.pixabay.com/download/audio/2023/02/01/audio_eb723b2e8b.mp3',
    gospel_soul: 'https://cdn.pixabay.com/download/audio/2023/06/02/audio_731333b2a5.mp3',
    rnb_pop: 'https://cdn.pixabay.com/download/audio/2023/05/29/audio_15a13340ce.mp3',
    cinematic: 'https://cdn.pixabay.com/download/audio/2022/10/20/audio_5634562425.mp3',
    trap: 'https://cdn.pixabay.com/download/audio/2023/04/18/audio_275713487f.mp3',
    acoustic: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_89281a0972.mp3',
    lofi: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_18b2a1e6f3.mp3',
    // Emotions for custom
    joyful: 'https://cdn.pixabay.com/download/audio/2022/02/16/audio_191c01519d.mp3',
    hopeful: 'https://cdn.pixabay.com/download/audio/2022/11/17/audio_8e2f23ab49.mp3',
    mysterious: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_24083a3734.mp3',
    brave: 'https://cdn.pixabay.com/download/audio/2022/10/20/audio_5634562425.mp3',
    default: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_89281a0972.mp3'
};

interface MusicGenerationConfig {
    style?: MusicStyle;
    custom?: CustomMusicParams;
}

export const generateMusic = async (story: string, config: MusicGenerationConfig): Promise<string | null> => {
    // This is a simulated function. In a real application, this would call a music generation API.
    return new Promise(resolve => {
        setTimeout(() => {
            let trackUrl = musicDatabase.default; // Fallback track
            if (config.style) {
                trackUrl = musicDatabase[config.style] || musicDatabase.default;
            } else if (config.custom) {
                // Prioritize emotion for track selection in this simulation
                trackUrl = musicDatabase[config.custom.emotion] || musicDatabase.default;
            }
            resolve(trackUrl);
        }, 3000); // Simulate a 3-second API call
    });
};