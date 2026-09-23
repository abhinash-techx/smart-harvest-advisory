const API_URL = "/api/market-insight";

const stateSelect = document.getElementById("state");
const districtSelect = document.getElementById("district");
const marketSelect = document.getElementById("market");
const commoditySelect = document.getElementById("commodity");

const searchBtn = document.getElementById("searchBtn");

const loading = document.getElementById("loading");
const errorBox = document.getElementById("errorBox");
const errorMessage = document.getElementById("errorMessage");
const results = document.getElementById("results");


/* ---------------------------------------------------
   API HELPER
--------------------------------------------------- */

async function callMarketAPI(action, filters = {}) {

    const response = await fetch(API_URL, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            action,
            ...filters
        })
    });

    const text = await response.text();

    let data;

    try {
        data = JSON.parse(text);
    } catch (error) {

        console.error("Invalid server response:", text);

        throw new Error(
            "Server returned an invalid response. Check Netlify function."
        );
    }

    if (!response.ok || data.error) {
        throw new Error(
            data.error || "Unable to fetch market data"
        );
    }

    return data;
}


/* ---------------------------------------------------
   DROPDOWN HELPERS
--------------------------------------------------- */

function resetSelect(select, placeholder) {

    select.innerHTML = "";

    const option = document.createElement("option");

    option.value = "";
    option.textContent = placeholder;

    select.appendChild(option);

    select.disabled = true;
}


function fillSelect(select, items, placeholder) {

    select.innerHTML = "";

    const firstOption = document.createElement("option");

    firstOption.value = "";
    firstOption.textContent = placeholder;

    select.appendChild(firstOption);

    items.forEach(item => {

        const option = document.createElement("option");

        option.value = item;
        option.textContent = item;

        select.appendChild(option);
    });

    select.disabled = items.length === 0;
}


/* ---------------------------------------------------
   LOAD STATES
--------------------------------------------------- */

async function loadStates() {

    try {

        stateSelect.disabled = true;

        stateSelect.innerHTML =
            `<option value="">Loading states...</option>`;

        const data = await callMarketAPI("states");

        const states = data.items || [];

        fillSelect(
            stateSelect,
            states,
            "Select State"
        );

        if (states.length === 0) {

            stateSelect.innerHTML =
                `<option value="">No states found</option>`;
        }

    } catch (error) {

        console.error(error);

        stateSelect.innerHTML =
            `<option value="">Failed to load states</option>`;

        showError(error.message);
    }
}


/* ---------------------------------------------------
   STATE CHANGE
--------------------------------------------------- */

stateSelect.addEventListener("change", async () => {

    const state = stateSelect.value;

    resetSelect(
        districtSelect,
        "Loading districts..."
    );

    resetSelect(
        marketSelect,
        "Select district first"
    );

    resetSelect(
        commoditySelect,
        "Select market first"
    );

    hideResults();

    if (!state) {

        resetSelect(
            districtSelect,
            "Select state first"
        );

        return;
    }

    try {

        const data = await callMarketAPI(
            "districts",
            {
                state
            }
        );

        const districts = data.items || [];

        fillSelect(
            districtSelect,
            districts,
            "Select District"
        );

        if (districts.length === 0) {

            districtSelect.innerHTML =
                `<option value="">No districts found</option>`;
        }

    } catch (error) {

        console.error(error);

        resetSelect(
            districtSelect,
            "Unable to load districts"
        );

        showError(error.message);
    }
});


/* ---------------------------------------------------
   DISTRICT CHANGE
--------------------------------------------------- */

districtSelect.addEventListener("change", async () => {

    const state = stateSelect.value;
    const district = districtSelect.value;

    resetSelect(
        marketSelect,
        "Loading markets..."
    );

    resetSelect(
        commoditySelect,
        "Select market first"
    );

    hideResults();

    if (!district) {

        resetSelect(
            marketSelect,
            "Select district first"
        );

        return;
    }

    try {

        const data = await callMarketAPI(
            "markets",
            {
                state,
                district
            }
        );

        const markets = data.items || [];

        fillSelect(
            marketSelect,
            markets,
            "Select Market / Mandi"
        );

        if (markets.length === 0) {

            marketSelect.innerHTML =
                `<option value="">No markets found</option>`;
        }

    } catch (error) {

        console.error(error);

        resetSelect(
            marketSelect,
            "Unable to load markets"
        );

        showError(error.message);
    }
});


/* ---------------------------------------------------
   MARKET CHANGE
--------------------------------------------------- */

marketSelect.addEventListener("change", async () => {

    const state = stateSelect.value;
    const district = districtSelect.value;
    const market = marketSelect.value;

    resetSelect(
        commoditySelect,
        "Loading commodities..."
    );

    hideResults();

    if (!market) {

        resetSelect(
            commoditySelect,
            "Select market first"
        );

        return;
    }

    try {

        const data = await callMarketAPI(
            "commodities",
            {
                state,
                district,
                market
            }
        );

        const commodities = data.items || [];

        fillSelect(
            commoditySelect,
            commodities,
            "Select Crop / Commodity"
        );

        if (commodities.length === 0) {

            commoditySelect.innerHTML =
                `<option value="">No commodities found</option>`;
        }

    } catch (error) {

        console.error(error);

        resetSelect(
            commoditySelect,
            "Unable to load crops"
        );

        showError(error.message);
    }
});


/* ---------------------------------------------------
   SEARCH MARKET
--------------------------------------------------- */

searchBtn.addEventListener("click", searchMarket);


async function searchMarket() {

    const state = stateSelect.value;
    const district = districtSelect.value;
    const market = marketSelect.value;
    const commodity = commoditySelect.value;

    hideError();

    if (!state || !district || !market || !commodity) {

        showError(
            "Please select State, District, Market and Crop."
        );

        return;
    }

    setLoading(true);

    hideResults();

    try {

        const data = await callMarketAPI(
            "prices",
            {
                state,
                district,
                market,
                commodity
            }
        );

        const records = data.records || [];

        if (records.length === 0) {

            throw new Error(
                "No market data found for this selection. Try another crop."
            );
        }

        displayResults(records);

    } catch (error) {

        console.error(error);

        showError(error.message);

    } finally {

        setLoading(false);
    }
}


/* ---------------------------------------------------
   DISPLAY RESULTS
--------------------------------------------------- */

function displayResults(records) {

    /*
       If multiple records exist for same commodity,
       choose the first record for the selected market.
    */

    const record = records[0];

    document.getElementById("resultCommodity").textContent =
        record.commodity || "--";

    document.getElementById("resultLocation").textContent =
        `${record.market || "--"} • ${record.district || "--"} • ${record.state || "--"}`;

    document.getElementById("resultDate").textContent =
        record.arrival_date || "--";


    document.getElementById("minPrice").textContent =
        formatPrice(record.min_price);

    document.getElementById("modalPrice").textContent =
        formatPrice(record.modal_price);

    document.getElementById("maxPrice").textContent =
        formatPrice(record.max_price);


    document.getElementById("detailState").textContent =
        record.state || "--";

    document.getElementById("detailDistrict").textContent =
        record.district || "--";

    document.getElementById("detailMarket").textContent =
        record.market || "--";

    document.getElementById("detailCommodity").textContent =
        record.commodity || "--";

    document.getElementById("detailVariety").textContent =
        record.variety || "--";

    document.getElementById("detailGrade").textContent =
        record.grade || "--";


    results.classList.remove("hidden");

    results.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* ---------------------------------------------------
   PRICE FORMAT
--------------------------------------------------- */

function formatPrice(price) {

    if (
        price === null ||
        price === undefined ||
        price === ""
    ) {
        return "₹--";
    }

    const number = Number(price);

    if (Number.isNaN(number)) {
        return "₹--";
    }

    return "₹" + number.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
}


/* ---------------------------------------------------
   LOADING
--------------------------------------------------- */

function setLoading(status) {

    if (status) {

        loading.classList.remove("hidden");

        searchBtn.disabled = true;

        searchBtn.innerHTML =
            `<span>⏳</span> Fetching Market Data...`;

    } else {

        loading.classList.add("hidden");

        searchBtn.disabled = false;

        searchBtn.innerHTML =
            `<span>🔎</span> Check Market Price`;
    }
}


/* ---------------------------------------------------
   ERROR
--------------------------------------------------- */

function showError(message) {

    errorMessage.textContent = message;

    errorBox.classList.remove("hidden");
}


function hideError() {

    errorBox.classList.add("hidden");

    errorMessage.textContent = "";
}


function hideResults() {

    results.classList.add("hidden");
}


/* ---------------------------------------------------
   INITIALIZE
--------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

    loadStates();

});