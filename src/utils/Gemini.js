import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const searchGemini = async (content) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: content,
        });

        // console.log(response);
        return response;
    } catch (error) {
        throw new Error(error);
    }
};

export { searchGemini };