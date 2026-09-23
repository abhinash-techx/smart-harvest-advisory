const { GoogleGenAI } = require("@google/genai");
const { recommendCrops } = require("../../recommendation");

function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(body) };
}

function normalizeNumber(v, fallback=0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(204, {});
  if (event.httpMethod !== "POST") return json(405, { success:false, message:"Only POST method is allowed" });

  try {
    const farmerData = JSON.parse(event.body || "{}");
    const required = ["state","soilType","ph","waterAvailability","temperature","rainfall","sowingSeason","farmingType"];
    const missing = required.filter(k => farmerData[k] === undefined || farmerData[k] === "");
    if (missing.length) return json(400, {success:false,error:`Missing fields: ${missing.join(", ")}`});

    const clean = {...farmerData,
      ph: normalizeNumber(farmerData.ph),
      temperature: normalizeNumber(farmerData.temperature),
      rainfall: normalizeNumber(farmerData.rainfall)
    };
    const recommendations = recommendCrops(clean);
    const language = String(clean.language || "en").toLowerCase();
    const languageName = language==="hi" ? "Hindi" : language==="bho" ? "Bhojpuri" : "English";

    let aiAdvice = {
      summary: "Rule-based crop suitability calculated successfully.",
      keyPoints: recommendations[0]?.reasons || [],
      caution: "Confirm local agronomy, seed availability and current weather before sowing."
    };

    if (process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
      const prompt = `You are a careful agricultural advisory assistant for a small farmer in India.
Return ONLY valid JSON with keys: summary (string), keyPoints (array of 4-6 short strings), cropPlan (array of 3 short strings), caution (string).
Language: ${languageName}.
Farmer data: ${JSON.stringify(clean)}
Rule-based candidates: ${JSON.stringify(recommendations)}
Do not invent prices, guaranteed yield, pesticide doses, or government benefits. Keep practical and simple.`;
      try {
        const response = await ai.models.generateContent({model:"gemini-3.6-flash",contents:prompt});
        const raw=(response.text||"").replace(/^```json\s*/i,"").replace(/```$/,"").trim();
        const parsed=JSON.parse(raw);
        aiAdvice={summary:parsed.summary||aiAdvice.summary,keyPoints:Array.isArray(parsed.keyPoints)?parsed.keyPoints:aiAdvice.keyPoints,cropPlan:Array.isArray(parsed.cropPlan)?parsed.cropPlan:[],caution:parsed.caution||aiAdvice.caution};
      } catch (aiError) {
        console.error("Gemini recommendation fallback:", aiError.message);
      }
    }
    return json(200,{success:true,recommendations,aiAdvice,language});
  } catch (error) {
    console.error("Recommendation Error:",error);
    return json(500,{success:false,error:error.message||"Failed to generate recommendation"});
  }
};
