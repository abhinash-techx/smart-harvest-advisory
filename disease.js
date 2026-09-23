const languageSelect = document.getElementById("languageSelect");

const imageInput = document.getElementById("imageInput");
const cameraBtn = document.getElementById("cameraBtn");
const uploadBtn = document.getElementById("uploadBtn");

const uploadArea = document.getElementById("uploadArea");
const previewContainer = document.getElementById("previewContainer");
const previewImage = document.getElementById("previewImage");

const removeImageBtn = document.getElementById("removeImageBtn");
const analyzeBtn = document.getElementById("analyzeBtn");

const loadingContainer = document.getElementById("loadingContainer");
const errorBox = document.getElementById("errorBox");

const resultContainer = document.getElementById("resultContainer");
const newAnalysisBtn = document.getElementById("newAnalysisBtn");

let selectedFile = null;


/* =========================
   MULTI LANGUAGE
========================= */

const translations = {

    en: {
        brandSubtitle: "AI Powered Agriculture",

        pageTitle: "Crop Disease Detection",

        pageDescription:
            "Take or upload a photo of your crop and let AI analyze possible diseases, symptoms and treatment.",

        uploadTitle: "Upload Crop Photo",

        uploadText:
            "Take a clear photo of the affected crop leaf or plant.",

        cameraText: "Take Photo",

        uploadTextBtn: "Upload Photo",

        previewTitle: "Selected Image",

        analyzeText: "Analyze Crop Disease",

        loadingTitle:
            "AI is analyzing your crop...",

        loadingText:
            "Please wait while we examine the image.",

        errorTitle: "Analysis Failed",

        defaultError:
            "Something went wrong. Please try again.",

        resultLabel: "AI ANALYSIS",

        resultTitle: "Crop Health Report",

        confidenceLabel: "Confidence",

        cropLabel: "Crop",

        diseaseLabel: "Disease",

        symptomsHeading: "Detected Symptoms",

        treatmentHeading: "Recommended Treatment",

        preventionHeading: "Prevention",

        adviceHeading: "Farmer Advisory",

        newAnalysisText: "Analyze Another Photo",

        noticeText:
            "For better results, take a clear photo of the affected leaf or plant in good lighting. AI results are advisory and should be verified with a local agriculture expert when needed."
    },


    hi: {
        brandSubtitle: "AI आधारित कृषि",

        pageTitle: "फसल रोग पहचान",

        pageDescription:
            "अपनी फसल की फोटो लें या अपलोड करें और AI से संभावित बीमारी, लक्षण और उपचार की जानकारी प्राप्त करें।",

        uploadTitle: "फसल की फोटो अपलोड करें",

        uploadText:
            "प्रभावित पत्ते या पौधे की साफ फोटो लें।",

        cameraText: "फोटो लें",

        uploadTextBtn: "फोटो अपलोड करें",

        previewTitle: "चयनित फोटो",

        analyzeText: "फसल की बीमारी जांचें",

        loadingTitle:
            "AI आपकी फसल की जांच कर रहा है...",

        loadingText:
            "कृपया कुछ समय प्रतीक्षा करें।",

        errorTitle: "जांच असफल",

        defaultError:
            "कुछ समस्या हुई। कृपया दोबारा प्रयास करें।",

        resultLabel: "AI ANALYSIS",

        resultTitle: "फसल स्वास्थ्य रिपोर्ट",

        confidenceLabel: "विश्वसनीयता",

        cropLabel: "फसल",

        diseaseLabel: "बीमारी",

        symptomsHeading: "पहचाने गए लक्षण",

        treatmentHeading: "अनुशंसित उपचार",

        preventionHeading: "बचाव",

        adviceHeading: "किसान सलाह",

        newAnalysisText: "दूसरी फोटो की जांच करें",

        noticeText:
            "बेहतर परिणाम के लिए प्रभावित पत्ते या पौधे की साफ फोटो अच्छी रोशनी में लें। AI की जानकारी सलाह के रूप में है और जरूरत पड़ने पर स्थानीय कृषि विशेषज्ञ से इसकी पुष्टि करें।"
    },


    bho: {
        brandSubtitle: "AI से खेती के मदद",

        pageTitle: "फसल के बीमारी के पहचान",

        pageDescription:
            "अपना फसल के फोटो खींचीं या अपलोड करीं आ AI से बीमारी, लच्छन आ इलाज के जानकारी पाईं।",

        uploadTitle: "फसल के फोटो अपलोड करीं",

        uploadText:
            "बीमार पत्ता या पौधा के साफ फोटो खींचीं।",

        cameraText: "फोटो खींचीं",

        uploadTextBtn: "फोटो अपलोड करीं",

        previewTitle: "चुनल फोटो",

        analyzeText: "फसल के बीमारी जांचीं",

        loadingTitle:
            "AI रउरा फसल के जांच करत बा...",

        loadingText:
            "कृपया कुछ देर रुकीं।",

        errorTitle: "जांच ना हो पावल",

        defaultError:
            "कुछ दिक्कत आ गइल। फेर से कोशिश करीं।",

        resultLabel: "AI ANALYSIS",

        resultTitle: "फसल स्वास्थ्य रिपोर्ट",

        confidenceLabel: "भरोसा",

        cropLabel: "फसल",

        diseaseLabel: "बीमारी",

        symptomsHeading: "देखल गइल लच्छन",

        treatmentHeading: "सुझावल गइल इलाज",

        preventionHeading: "बचाव",

        adviceHeading: "किसान सलाह",

        newAnalysisText: "दूसर फोटो जांचीं",

        noticeText:
            "बेहतर परिणाम खातिर बीमार पत्ता या पौधा के साफ फोटो बढ़िया रोशनी में लीं। AI के जानकारी सलाह खातिर बा। जरूरत पड़े त स्थानीय कृषि विशेषज्ञ से जरूर पूछीं।"
    }
};


/* =========================
   LANGUAGE FUNCTION
========================= */

function applyLanguage(language) {

    const t = translations[language] || translations.en;

    Object.keys(t).forEach(key => {

        const element = document.getElementById(key);

        if (element) {
            element.textContent = t[key];
        }

    });

    document.documentElement.lang =
        language === "hi"
            ? "hi"
            : language === "bho"
                ? "bho"
                : "en";
}


/* =========================
   LANGUAGE CHANGE
========================= */

languageSelect.addEventListener("change", () => {

    applyLanguage(languageSelect.value);

});


/* =========================
   CAMERA
========================= */

cameraBtn.addEventListener("click", () => {

    imageInput.setAttribute("capture", "environment");

    imageInput.click();

});


/* =========================
   UPLOAD
========================= */

uploadBtn.addEventListener("click", () => {

    imageInput.removeAttribute("capture");

    imageInput.click();

});


/* =========================
   IMAGE SELECT
========================= */

imageInput.addEventListener("change", event => {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {

        showError("Please select a valid image file.");

        return;
    }

    selectedFile = file;

    const imageURL = URL.createObjectURL(file);

    previewImage.src = imageURL;

    uploadArea.style.display = "none";

    previewContainer.classList.add("active");

    resultContainer.classList.remove("active");

    errorBox.classList.remove("active");

});


/* =========================
   REMOVE IMAGE
========================= */

removeImageBtn.addEventListener("click", resetPage);


/* =========================
   ANALYZE
========================= */

analyzeBtn.addEventListener("click", async () => {

    if (!selectedFile) {

        showError(
            "Please select a crop image first."
        );

        return;
    }

    await analyzeDisease();

});


/* =========================
   ANALYZE DISEASE
========================= */

async function analyzeDisease() {

    hideError();

    previewContainer.classList.remove("active");

    loadingContainer.classList.add("active");

    resultContainer.classList.remove("active");

    try {

        const base64Image = await convertToBase64(selectedFile);

        const language = languageSelect.value;

        const response = await fetch(
            "/.netlify/functions/disease-detection",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    image: base64Image,

                    language: language

                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                translations[language].defaultError
            );

        }


        if (!data.success || !data.result) {

            throw new Error(
                data.error ||
                translations[language].defaultError
            );

        }


        displayResult(data.result);

    }

    catch (error) {

        console.error("Disease analysis error:", error);

        showError(error.message);

        previewContainer.classList.add("active");

    }

    finally {

        loadingContainer.classList.remove("active");

    }

}


/* =========================
   BASE64 CONVERTER
========================= */

function convertToBase64(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => {

            resolve(reader.result);

        };

        reader.onerror = error => {

            reject(error);

        };

        reader.readAsDataURL(file);

    });

}


/* =========================
   DISPLAY RESULT
========================= */

function displayResult(result) {

    document.getElementById("cropName").textContent =
        result.crop || "Unknown";

    document.getElementById("diseaseName").textContent =
        result.disease || "Unknown";


    document.getElementById("symptomsText").textContent =
        result.symptoms || "No symptoms available.";


    document.getElementById("treatmentText").textContent =
        result.treatment || "No treatment information available.";


    document.getElementById("preventionText").textContent =
        result.prevention || "No prevention information available.";


    document.getElementById("adviceText").textContent =
        result.advisory || "Please consult a local agriculture expert.";


    let confidence = result.confidence;

    if (typeof confidence === "number") {

        confidence = Math.max(
            0,
            Math.min(100, confidence)
        );

        confidence += "%";

    }

    document.getElementById("confidenceValue").textContent =
        confidence || "--";


    resultContainer.classList.add("active");

    resultContainer.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================
   ERROR
========================= */

function showError(message) {

    document.getElementById("errorMessage").textContent =
        message || translations[languageSelect.value].defaultError;

    errorBox.classList.add("active");

}


function hideError() {

    errorBox.classList.remove("active");

}


/* =========================
   RESET
========================= */

newAnalysisBtn.addEventListener(
    "click",
    resetPage
);


function resetPage() {

    selectedFile = null;

    imageInput.value = "";

    previewImage.src = "";

    uploadArea.style.display = "block";

    previewContainer.classList.remove("active");

    resultContainer.classList.remove("active");

    loadingContainer.classList.remove("active");

    hideError();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================
   INITIAL LANGUAGE
========================= */

applyLanguage(
    languageSelect.value
);