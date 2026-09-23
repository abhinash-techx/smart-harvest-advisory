const btn=document.getElementById("buildBtn"),steps=document.getElementById("steps"),status=document.getElementById("status");
function build(){
 const eventType=document.getElementById("eventType").value, insured=document.getElementById("insured").value;
 const data=[
  ["1","Record the damage","Take clear photos/videos of the affected field, crop, date and visible damage. Keep the original files."],
  ["2","Inform the local channel","Contact the local agriculture/revenue authority, village-level official or notified state relief channel and ask whether the event has been officially notified."],
  ["3","Check insurance","If the crop may be insured, check your policy/application details and follow the insurer/PMFBY loss-reporting process. Do not assume every loss is automatically covered."],
  ["4","Keep documents ready","Keep identity, land/cultivation records, bank details, crop details and insurance information available as applicable."],
  ["5","Track the case","Save acknowledgement/reference numbers, dates and contact details. Follow up through the official portal or office."],
  ["6","Avoid duplicate claims","Give the same factual loss details consistently. Compensation, insurance and relief can have different eligibility rules."]
 ];
 steps.innerHTML=data.map(x=>`<article class="card"><div class="step"><div class="step-num">${x[0]}</div><div><h3>${x[1]}</h3><p class="muted">${x[2]}</p></div></div></article>`).join("");
 status.className="status show";
 status.textContent=`Checklist prepared for: ${eventType}. Insurance status selected: ${insured==="yes"?"insured / not sure":"not insured"}.`;
}
btn.addEventListener("click",build);build();