const status=document.getElementById("status"),body=document.getElementById("tableBody"),summary=document.getElementById("summary");
function msg(t,kind="show"){status.className=`status show ${kind==="error"?"danger":"info"}`;status.textContent=t}
document.getElementById("locate").onclick=()=>navigator.geolocation?.getCurrentPosition(p=>{lat.value=p.coords.latitude.toFixed(5);lon.value=p.coords.longitude.toFixed(5)},()=>msg("Location permission was not granted. Enter latitude and longitude manually.","error"));
document.getElementById("analyze").onclick=async()=>{
 const la=parseFloat(lat.value),lo=parseFloat(lon.value),years=parseInt(document.getElementById("years").value);
 if(!Number.isFinite(la)||!Number.isFinite(lo)||la<-90||la>90||lo<-180||lo>180)return msg("Enter valid latitude and longitude.","error");
 const end=new Date(),start=new Date(end);start.setFullYear(start.getFullYear()-years);
 const fmt=d=>d.toISOString().slice(0,10);
 msg("Loading historical weather data…");
 try{
  const url=`https://archive-api.open-meteo.com/v1/archive?latitude=${la}&longitude=${lo}&start_date=${fmt(start)}&end_date=${fmt(end)}&daily=temperature_2m_mean,precipitation_sum,rain_sum&timezone=auto`;
  const r=await fetch(url);if(!r.ok)throw new Error("Historical weather service failed");
  const d=await r.json();const rows={};
  d.daily.time.forEach((date,i)=>{const m=new Date(date+"T00:00:00").getMonth();if(!rows[m])rows[m]={temp:[],rain:0,rainDays:0};const t=d.daily.temperature_2m_mean[i],rain=d.daily.precipitation_sum[i]||0;if(Number.isFinite(t))rows[m].temp.push(t);rows[m].rain+=rain;if(rain>1)rows[m].rainDays++});
  body.innerHTML="";Object.keys(rows).sort((a,b)=>a-b).forEach(m=>{const x=rows[m],avg=x.temp.reduce((a,b)=>a+b,0)/x.temp.length;const tr=document.createElement("tr");tr.innerHTML=`<td>${new Date(2000,Number(m),1).toLocaleString("en",{month:"long"})}</td><td>${avg.toFixed(1)}</td><td>${x.rain.toFixed(0)}</td><td>${x.rainDays}</td>`;body.appendChild(tr)});
  const allT=d.daily.temperature_2m_mean.filter(Number.isFinite),totalRain=d.daily.precipitation_sum.reduce((a,b)=>a+(b||0),0);
  summary.innerHTML=`<article class="card"><span class="badge">Period</span><h2>${fmt(start)} → ${fmt(end)}</h2><p class="muted">${d.daily.time.length} daily observations loaded.</p></article><article class="card"><span class="badge">Average temperature</span><h2>${(allT.reduce((a,b)=>a+b,0)/allT.length).toFixed(1)} °C</h2><p class="muted">Average across the selected period.</p></article><article class="card"><span class="badge">Total rainfall</span><h2>${totalRain.toFixed(0)} mm</h2><p class="muted">Summed daily precipitation across the period.</p></article>`;
  msg("History loaded successfully.");
 }catch(e){console.error(e);msg("Could not load historical weather. Check your internet connection or try again.","error")}
};