const API_BASE =
    "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

exports.handler = async function (event) {

    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    // CORS preflight
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 204,
            headers,
            body: ""
        };
    }

    // Only POST
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

        const API_KEY = process.env.DATA_GOV_API_KEY;

        if (!API_KEY) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: "DATA_GOV_API_KEY is missing."
                })
            };
        }

        // Read request body
        let body;

        try {
            body = JSON.parse(event.body || "{}");
        } catch {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: "Invalid JSON request."
                })
            };
        }

        const action = body.action;

        // -----------------------------------------
        // Fetch Mandi Data
        // -----------------------------------------

        async function fetchMandiData(filters = {}) {

            const params = new URLSearchParams();

            params.set("api-key", API_KEY);
            params.set("format", "json");

            // Keep response reasonably small
            params.set("limit", "5000");
            params.set("offset", "0");

            if (filters.state) {
                params.set(
                    "filters[state.keyword]",
                    filters.state
                );
            }

            if (filters.district) {
                params.set(
                    "filters[district]",
                    filters.district
                );
            }

            if (filters.market) {
                params.set(
                    "filters[market]",
                    filters.market
                );
            }

            if (filters.commodity) {
                params.set(
                    "filters[commodity]",
                    filters.commodity
                );
            }

            const url = `${API_BASE}?${params.toString()}`;

            console.log("Calling data.gov.in:", url.replace(API_KEY, "***"));

            let response;

            try {
                response = await fetch(url);
            } catch (error) {

                console.error(
                    "Unable to connect to data.gov.in:",
                    error
                );

                throw new Error(
                    "Unable to connect to data.gov.in. Please try again."
                );
            }

            const text = await response.text();

            if (!response.ok) {

                console.error(
                    "data.gov.in HTTP error:",
                    response.status,
                    text
                );

                throw new Error(
                    `data.gov.in returned HTTP ${response.status}`
                );
            }

            let data;

            try {
                data = JSON.parse(text);
            } catch {

                console.error(
                    "Invalid JSON from data.gov.in:",
                    text.substring(0, 500)
                );

                throw new Error(
                    "data.gov.in returned invalid JSON."
                );
            }

            return data;
        }

        // -----------------------------------------
        // Remove duplicates + sort
        // -----------------------------------------

        function uniqueSorted(values) {

            return [
                ...new Set(
                    values
                        .filter(Boolean)
                        .map(value =>
                            String(value).trim()
                        )
                )
            ].sort((a, b) =>
                a.localeCompare(
                    b,
                    "en",
                    {
                        sensitivity: "base"
                    }
                )
            );
        }

        // =========================================
        // STATES
        // =========================================

        if (action === "states") {

            const data = await fetchMandiData();

            const states = uniqueSorted(
                (data.records || []).map(
                    record => record.state
                )
            );

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    items: states
                })
            };
        }

        // =========================================
        // DISTRICTS
        // =========================================

        if (action === "districts") {

            if (!body.state) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error: "State is required."
                    })
                };
            }

            const data = await fetchMandiData({
                state: body.state
            });

            const districts = uniqueSorted(
                (data.records || []).map(
                    record => record.district
                )
            );

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    items: districts
                })
            };
        }

        // =========================================
        // MARKETS / MANDIS
        // =========================================

        if (action === "markets") {

            if (!body.state || !body.district) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error: "State and district are required."
                    })
                };
            }

            const data = await fetchMandiData({
                state: body.state,
                district: body.district
            });

            const markets = uniqueSorted(
                (data.records || []).map(
                    record => record.market
                )
            );

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    items: markets
                })
            };
        }

        // =========================================
        // COMMODITIES
        // =========================================

        if (action === "commodities") {

            if (
                !body.state ||
                !body.district ||
                !body.market
            ) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error:
                            "State, district and market are required."
                    })
                };
            }

            const data = await fetchMandiData({
                state: body.state,
                district: body.district,
                market: body.market
            });

            const commodities = uniqueSorted(
                (data.records || []).map(
                    record => record.commodity
                )
            );

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    items: commodities
                })
            };
        }

        // =========================================
        // PRICES
        // =========================================

        if (action === "prices") {

            if (
                !body.state ||
                !body.district ||
                !body.market ||
                !body.commodity
            ) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error:
                            "State, district, market and commodity are required."
                    })
                };
            }

            const data = await fetchMandiData({
                state: body.state,
                district: body.district,
                market: body.market,
                commodity: body.commodity
            });

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    total: data.total || 0,
                    records: data.records || []
                })
            };
        }

        // =========================================
        // INVALID ACTION
        // =========================================

        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
                success: false,
                error: "Invalid action."
            })
        };

    } catch (error) {

        console.error(
            "Market Insight Function Error:",
            error
        );

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error:
                    error.message ||
                    "Unable to fetch market data."
            })
        };
    }
};