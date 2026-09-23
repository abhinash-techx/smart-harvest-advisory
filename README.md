# Smart Crop Advisor — External Hackathon Build

## What this build contains
- Smart crop recommendation: rule-based suitability + optional Gemini structured advisory
- Soil analysis: image/manual modes using Gemini
- Crop disease detection: image analysis using Gemini
- Current weather: Open-Meteo
- Market Insight: data.gov.in / AGMARKNET
- Government schemes/resource hub with official links
- Crop-loss and compensation guidance
- 3+ year weather history using Open-Meteo archive
- Farmer Action Plan
- English / Hindi / Bhojpuri support in the crop recommendation flow

## Project architecture
- Frontend: HTML + CSS + vanilla JavaScript
- Backend: Netlify Functions
- AI: Google Gemini via `@google/genai`
- Weather: Open-Meteo
- Market: data.gov.in AGMARKNET

## Run locally
1. Install Node.js.
2. Open this project folder in VS Code terminal.
3. Run:
   `npm install`
4. Create `.env` in the project root:
   `GEMINI_API_KEY=YOUR_KEY`
   `DATA_GOV_API_KEY=YOUR_KEY`
5. Run:
   `npx netlify dev`
6. Open the local URL shown by Netlify CLI.

## Netlify
- Build publish directory: `.`
- Functions directory: `netlify/functions`
- Add `GEMINI_API_KEY` and `DATA_GOV_API_KEY` in Netlify environment variables.
- Redeploy after changing environment variables.

## Important
- The crop recommendation score is a suitability heuristic, not a guarantee of yield.
- Soil image analysis must not be treated as a laboratory NPK/pH measurement.
- Government scheme eligibility and compensation procedures can change; the app links to official portals for verification.
- Weather history is context for farm planning and is not a yield prediction by itself.
