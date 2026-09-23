exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({success:false,message:"Method not allowed"}) };
  }

  try {
    const input = JSON.parse(event.body || "{}");
    const state = String(input.state || "").trim();
    const district = String(input.district || "").trim();
    const latitude = Number.isFinite(Number(input.latitude)) ? Number(input.latitude) : null;
    const longitude = Number.isFinite(Number(input.longitude)) ? Number(input.longitude) : null;

    if (!state && (latitude === null || longitude === null)) {
      return { statusCode: 400, headers, body: JSON.stringify({success:false,message:"State/district or location is required"}) };
    }

    const query = `
      query GetTestCenters($state: String, $district: String) {
        getTestCenters(state: $state, district: $district) {
          id
          name
          phone
          email
          address
          region
          createdAt
          STLdetails {
            name
            email
            phone
            status
            details
          }
        }
      }`;

    const shcResponse = await fetch("https://soilhealth4.dac.gov.in/", {
      method: "POST",
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      body: JSON.stringify({query, variables:{state: state || null, district: district || null}})
    });

    if (!shcResponse.ok) throw new Error(`Soil Health Card API returned ${shcResponse.status}`);
    const shcData = await shcResponse.json();
    const centres = shcData?.data?.getTestCenters || [];

    let labs = centres.map(normalizeLab).filter(x => x.name || x.address);

    // If the open endpoint returns no exact-district results, do not invent labs.
    // A location-only request is handled with a broad query and geocoding below.
    if (!labs.length && latitude !== null && longitude !== null && !state) {
      const nearby = await searchNominatim(latitude, longitude);
      labs = nearby.map(item => ({
        id: item.place_id,
        name: item.display_name?.split(",")[0] || "Nearby soil-related centre",
        address: item.display_name || "",
        phone: "",
        state: "",
        district: "",
        typeKey: "government",
        source: "OpenStreetMap discovery — verify registration before visiting",
        lat: Number(item.lat),
        lon: Number(item.lon)
      }));
    }

    if (latitude !== null && longitude !== null) {
      labs = await attachDistances(labs, latitude, longitude);
      labs.sort((a,b)=>(a.distanceKm ?? 999999)-(b.distanceKm ?? 999999));
    }

    labs = labs.slice(0, 12);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        labs,
        source: "Government of India Soil Health Card open test-centre API",
        note: "Registration/category and operating details can change; verify before visiting."
      })
    };
  } catch (error) {
    console.error("find-labs error:", error);
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({success:false,message:"Unable to fetch registered soil testing centres"})
    };
  }
};

function normalizeLab(item) {
  const name = item.name || item.STLdetails?.name || "Soil Testing Centre";
  const address = item.address || "";
  const combined = `${name} ${address}`.toLowerCase();

  let typeKey = "registered";
  if (/\bkvk\b|icar|krishi vigyan/i.test(combined)) typeKey = "icar";
  else if (/department of agriculture|agriculture department|state agriculture|government|govt\.?/i.test(combined)) typeKey = "government";
  else if (/private|pvt\.?|ltd\.?|agro|diagnostic/i.test(combined)) typeKey = "private";

  return {
    id: item.id || name,
    name,
    address,
    phone: item.phone || item.STLdetails?.phone || "",
    state: item.region?.state || "",
    district: item.region?.district || "",
    typeKey,
    source: "Government of India Soil Health Card ecosystem"
  };
}

async function attachDistances(labs, lat, lon) {
  const output = [];
  for (const lab of labs.slice(0, 10)) {
    let coords = (Number.isFinite(lab.lat) && Number.isFinite(lab.lon))
      ? {lat: lab.lat, lon: lab.lon}
      : null;

    if (!coords && lab.address) {
      coords = await geocode(lab.address);
      await delay(1100); // polite use of public geocoder
    }

    if (coords) {
      lab.lat = coords.lat;
      lab.lon = coords.lon;
      lab.distanceKm = haversine(lat, lon, coords.lat, coords.lon);
    }
    output.push(lab);
  }
  return output;
}

async function geocode(address) {
  try {
    const url = "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&q=" + encodeURIComponent(address + ", India");
    const r = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Smart-Crop-Advisor-Soil-Lab-Finder/1.0 (hackathon project)"
      }
    });
    if (!r.ok) return null;
    const data = await r.json();
    if (!data?.length) return null;
    return {lat:Number(data[0].lat), lon:Number(data[0].lon)};
  } catch {
    return null;
  }
}

async function searchNominatim(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=8&countrycodes=in&q=soil%20testing%20laboratory%20near%20${lat},${lon}`;
    const r = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Smart-Crop-Advisor-Soil-Lab-Finder/1.0 (hackathon project)"
      }
    });
    if (!r.ok) return [];
    return await r.json();
  } catch {
    return [];
  }
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(dLat/2)**2 +
    Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
function delay(ms){return new Promise(r=>setTimeout(r,ms));}
