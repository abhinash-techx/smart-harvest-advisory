# Updated Analyze My Soil

Updated for the Smart Crop Advisor external-hackathon build.

## Included
- `analyze-soil.html` — redesigned 4-service soil page.
- `analyze-soil.css` — responsive UI.
- `analyze-soil.js` — English/Hindi/Bhojpuri UI, soil kit guide, photo analysis, manual analysis, lab finder.
- `india-locations.js` — 28-state district selector with a built-in fallback and an optional refresh from a current open dataset sourced from India's IGOD district directory.
- `netlify/functions/analyze-soil.js` — existing Gemini soil analysis function.
- `netlify/functions/find-labs.js` — registered soil-test centre lookup through the Government of India's Soil Health Card open test-centre API; distance is calculated when the user's browser location is supplied.

## Important
1. Keep `GEMINI_API_KEY` in Netlify environment variables. Do not put the key in frontend files.
2. Browser location requires the user to allow location access.
3. Exact lab distance may be unavailable for a centre when its address cannot be geocoded; the map link still works.
4. Lab registration/category can change, so users should verify before visiting.
5. Kit prices shown in the UI are indicative and should be refreshed when prices change.
6. The photo feature is a visual AI assessment; it must not claim exact laboratory pH/NPK from a photograph.

## Netlify
The new function is:
`/.netlify/functions/find-labs`

If your main project already has a `/api/*` redirect, you can keep it; this updated module calls the Netlify function paths directly.
