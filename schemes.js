const schemes=[
{name:"PM-KISAN Samman Nidhi",tag:"Income support",desc:"Official PM-KISAN portal for farmer registration, status, eKYC and scheme information.",url:"https://pmkisan.gov.in/"},
{name:"Pradhan Mantri Fasal Bima Yojana",tag:"Crop insurance",desc:"Official crop-insurance portal with farmer services, policy status, loss reporting and guidance.",url:"https://pmfby.gov.in/"},
{name:"Soil Health Card",tag:"Soil testing",desc:"Official Soil Health Card support and information, including guidance related to soil testing laboratories.",url:"https://soilhealth.dac.gov.in/"},
{name:"e-NAM",tag:"Market access",desc:"National Agriculture Market portal for price discovery, market access and farmer registration information.",url:"https://enam.gov.in/"},
{name:"Kisan Credit Card / agriculture finance",tag:"Credit",desc:"Start from the official PM-KISAN resource hub and your bank/CSC to verify current KCC process and eligibility.",url:"https://pmkisan.gov.in/"},
{name:"Agriculture services",tag:"State services",desc:"For state-specific subsidies, relief and agriculture services, use the official state agriculture department portal linked from government directories.",url:"https://www.india.gov.in/"}
];
const grid=document.getElementById("schemeGrid");
grid.innerHTML=schemes.map(s=>`<article class="card"><span class="badge">${s.tag}</span><h2>${s.name}</h2><p class="muted">${s.desc}</p><a class="btn" href="${s.url}" target="_blank" rel="noopener">Open official portal ↗</a></article>`).join("");
