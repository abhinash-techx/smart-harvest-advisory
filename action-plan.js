const plan=document.getElementById("plan");
const templates={
Rice:["Confirm field drainage and water availability before transplanting.","Use a soil-test-based nutrient plan instead of guessing fertilizer dose.","Monitor standing water and weeds regularly.","Watch weather forecasts before irrigation or spraying.","Record sowing/transplanting date and major input applications."],
Wheat:["Check soil moisture before irrigation.","Base fertilizer decisions on soil-test results and local recommendations.","Monitor weeds early in the crop cycle.","Watch for unusual yellowing, rust-like symptoms or pest pressure.","Plan irrigation around crop stage and forecast rainfall."],
Maize:["Ensure good drainage and uniform crop establishment.","Use soil-test-based nutrient management.","Monitor early weeds and moisture stress.","Avoid spraying during strong wind or imminent rain.","Inspect leaves regularly for pest or disease symptoms."],
Gram:["Avoid unnecessary irrigation and waterlogging.","Use soil-test results to guide nutrient management.","Scout for pod/leaf damage and disease symptoms.","Keep the field weed-free during critical stages.","Check weather before any spray operation."],
Cotton:["Maintain field drainage and monitor moisture.","Use balanced, soil-test-based nutrition.","Scout regularly for insect pressure and leaf symptoms.","Avoid unnecessary pesticide applications.","Record field observations for future crop planning."],
"Vegetable crop":["Check crop-specific spacing, seedling quality and drainage.","Use soil-test-based nutrition and organic matter where appropriate.","Scout leaves and stems at least weekly.","Harvest at the recommended maturity stage for your crop.","Use weather information to plan irrigation and crop protection."]
};
function generate(){
 const crop=document.getElementById("crop").value,soil=document.getElementById("soil").value,water=document.getElementById("water").value,season=document.getElementById("season").value;
 let items=[...templates[crop]];
 if(water==="Low")items.splice(1,0,"Water is limited: prioritize moisture conservation and avoid choosing a crop plan that exceeds your available water.");
 if(water==="Rainwater Dependent")items.splice(1,0,"Rain-fed condition: check rainfall outlook and keep a contingency plan for dry spells.");
 if(soil==="Clayey")items.push("Check drainage because heavy soils can retain water.");
 if(soil==="Sandy Loam")items.push("Monitor moisture more frequently because lighter soils can dry faster.");
 items.push(`Season selected: ${season}. Confirm the crop calendar for your district before sowing.`);
 plan.innerHTML=`<article class="card" style="grid-column:1/-1"><span class="badge">${crop} • ${soil} • ${water}</span><h2>Recommended next actions</h2><ol class="list">${items.map(x=>`<li>${x}</li>`).join("")}</ol></article>`;
}
document.getElementById("generate").addEventListener("click",generate);
document.getElementById("print").addEventListener("click",()=>window.print());generate();