const { GoogleGenAI } = require("@google/genai");


exports.handler = async function (event) {

    /*
     * CORS
     */

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json"
    };


    /*
     * OPTIONS request
     */

    if (event.httpMethod === "OPTIONS") {

        return {
            statusCode: 200,
            headers,
            body: ""
        };

    }


    /*
     * Only POST allowed
     */

    if (event.httpMethod !== "POST") {

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({
                success: false,
                error: "Method not allowed"
            })
        };

    }


    try {

        /*
         * API KEY
         */

        const apiKey = process.env.GEMINI_API_KEY;


        if (!apiKey) {

            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error:
                        "GEMINI_API_KEY is not configured in Netlify."
                })
            };

        }


        /*
         * REQUEST BODY
         */

        const body = JSON.parse(
            event.body || "{}"
        );


        const image = body.image;

        const language =
            body.language || "en";


        if (!image) {

            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: "Crop image is required."
                })
            };

        }


        /*
         * Remove data URL prefix
         *
         * Example:
         * data:image/jpeg;base64,XXXXXXXX
         */

        const match =
            image.match(
                /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/
            );


        if (!match) {

            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error:
                        "Invalid image format."
                })
            };

        }


        const mimeType = match[1];

        const base64Data = match[2];


        /*
         * LANGUAGE
         */

        let languageName = "English";

        if (language === "hi") {
            languageName = "Hindi";
        }

        if (language === "bho") {
            languageName = "Bhojpuri";
        }


        /*
         * GEMINI
         */

        const ai = new GoogleGenAI({
            apiKey: apiKey
        });


        /*
         * AI PROMPT
         */

        const prompt = `
You are an agricultural crop disease analysis assistant.

Analyze the uploaded crop/plant image carefully.

Your job is to identify the crop and detect whether there are visible signs of a disease, pest damage, nutrient deficiency, or whether the image appears healthy.

IMPORTANT:
- Do not pretend to be 100% certain.
- If the image is unclear, say that the diagnosis is uncertain.
- If the plant/crop cannot be identified reliably, say "Unknown".
- Do not invent a disease.
- Give practical agricultural guidance.
- For chemical treatments, do NOT provide dangerous mixing instructions or excessive dosing.
- Mention that the farmer should follow the product label and local agricultural authority recommendations.
- Prefer integrated pest/disease management where appropriate.

The final answer MUST be written in ${languageName}.

Return ONLY valid JSON.

Use exactly this structure:

{
  "crop": "crop name",
  "disease": "disease name or Healthy / Unknown",
  "confidence": 0,
  "symptoms": "short explanation of visible symptoms",
  "treatment": "safe treatment recommendation",
  "prevention": "prevention steps",
  "advisory": "important farmer advisory"
}

Confidence must be a number from 0 to 100.

If the image does not show a recognizable crop or disease, clearly explain that in the JSON.

Do not use Markdown.
Do not use code fences.
Do not add any text outside the JSON.
`;


        /*
         * GEMINI IMAGE REQUEST
         */

        const response = await ai.models.generateContent({

            model: "gemini-3.6-flash",

            contents: [

                {
                    inlineData: {
                        mimeType: mimeType,
                        data: base64Data
                    }
                },

                {
                    text: prompt
                }

            ]

        });


        /*
         * GET TEXT
         */

        let text = response.text || "";


        /*
         * Remove accidental markdown
         */

        text = text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();


        /*
         * PARSE JSON
         */

        let result;

        try {

            result = JSON.parse(text);

        }

        catch (jsonError) {

            console.error(
                "Gemini returned invalid JSON:",
                text
            );

            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error:
                        "AI returned an invalid analysis. Please try again."
                })
            };

        }


        /*
         * SANITIZE RESULT
         */

        result = {

            crop:
                result.crop ||
                "Unknown",

            disease:
                result.disease ||
                "Unknown",

            confidence:
                typeof result.confidence === "number"
                    ? Math.max(
                        0,
                        Math.min(
                            100,
                            result.confidence
                        )
                    )
                    : 0,

            symptoms:
                result.symptoms ||
                "No clear symptoms could be identified.",

            treatment:
                result.treatment ||
                "Please consult a local agricultural expert.",

            prevention:
                result.prevention ||
                "Follow good crop management practices.",

            advisory:
                result.advisory ||
                "For confirmation, consult a local agricultural expert."
        };


        /*
         * SUCCESS
         */

        return {

            statusCode: 200,

            headers,

            body: JSON.stringify({

                success: true,

                result: result

            })

        };

    }


    catch (error) {

        console.error(
            "Disease Detection Function Error:",
            error
        );


        return {

            statusCode: 500,

            headers,

            body: JSON.stringify({

                success: false,

                error:
                    error.message ||
                    "Failed to analyze crop disease."

            })

        };

    }

};