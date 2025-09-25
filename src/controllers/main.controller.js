import * as fs from "fs";
import { fileTypeFromBuffer } from "file-type";

//Utils
import { searchGemini } from "../utils/Gemini.js";
import ApiResponse from "../utils/ApiResponse.js";
import prompts from "../utils/Prompts.js";

const cleanText = (input) => {
    let rawText = input.trim();
    
    // Remove triple backticks if present
    rawText = rawText.replace(/^```(?:json)?\s*/, '').replace(/```$/, '');
    
    // Optional: remove leading/trailing whitespace or newlines
    rawText = rawText.trim();
    
    return rawText;
};

const validateImageType = async (imagePath) => {
    const buffer = await fs.promises.readFile(imagePath);
    const type = await fileTypeFromBuffer(buffer);
    
    if (!type) {
        throw new Error("Could not detect file type!");
    }

    const allowedMimes = ["image/png", "image/jpeg", "image/webp", "image/heic", "image/heif"];

    if (!allowedMimes.includes(type.mime)) {
        throw new Error(`Unsupported file type: ${type.mime}! Supported file types are: png, jpeg, webp, heic & heif.`);
    }

    // console.log("File is valid:", type.mime);
    return type.mime;
};

const parseImage = async (imagePath) => {
    try {
        //Fetch and validate Image Type
        const fetchImageType = await validateImageType(imagePath);
        
        const base64ImageFile = fs.readFileSync(imagePath, {
            encoding: "base64",
        });
    
        const contents = [
            {
                inlineData: {
                    mimeType: fetchImageType,
                    data: base64ImageFile,
                },
            },
            { 
                text: `You are an OCR assistant. Extract all visible text from this image exactly as written. 

                    Rules:
                    1. Do not summarize, describe, or interpret the image. 
                    2. Output only plain text in the same layout order.
                    3. Add a "confidence" key with a float value between 0 and 1, representing how confident you are in the extracted text.
                    4. Only include text if it contains at least one of the following keywords with valid values:
                    - "age": a number
                    - "smoker": true or false
                    - "exercise": a string
                    - "diet": a string
                    5. If none of these fields are present in the image, return: "no text found"
                    6. Compute confidence based on how clearly the required fields appear in the image.`
            },
        ];
    
        const response = await searchGemini(contents);
        // console.log(response.text);

        //Check no info found
        const output = response.text;
        if (!output || output.trim() === "" || output.toLowerCase().includes("no text") || output.toLowerCase().includes("no info")) {
            throw new Error("No information found in the uploaded image.");
        }

        fs.unlinkSync(imagePath);
        return output;
    } catch (error) {
        fs.unlinkSync(imagePath);
        throw error;
    }
};

const runPrompt = async (step, input) => {
    try {
        let content = prompts[step];
        content = content + input;
        // console.log(content);

        const response = await searchGemini(content);
        // console.log(response.text);

        //Cleanup
        const cleanedText = cleanText(response.text);
        return cleanedText;
    } catch (error) {
        throw error;
    }
};

const mainController = async (req, res) => {
    try {
        let input = "";

        //Either image or text input
        if(req.file){
            input = await parseImage(req.file?.path);
        }
        else{
            input = JSON.stringify(req.body);
            if(input == "") throw new Error("Missing input!");
        }

        //Step - 1 : OCR/Text Parsing 
        const parsedText = await runPrompt(1, input);
        console.log(JSON.parse(parsedText));

        //Step - 2 : Factor Extraction
        const factors = await runPrompt(2, parsedText);
        console.log(JSON.parse(factors));

        //If no risk factors found
        const data = JSON.parse(factors);

        if (!data.factors || data.factors.length === 0) {
            res.json(new ApiResponse(200, "Respose fetched successfully!", { output: "User is healthy!" }));
            return;
        }

        //Step - 3 : Risk Classification
        const risks = await runPrompt(3, factors);
        console.log(JSON.parse(risks));
        
        //Step - 4 : Recommendations
        const suggestions = await runPrompt(4, risks);
        console.log(JSON.parse(suggestions));

        const output = JSON.parse(suggestions);
        res.json(new ApiResponse(200, "Response fetched successfully!", output));
    } catch (error) {
        res.json(new ApiResponse(400, `Error: ${error.message}`));
    }
};

export { mainController };