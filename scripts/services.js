const STORAGE_KEYS = {
    topImageUrl: "topImageUrl",
    bottomImageUrl: "bottomImageUrl",
    fitMode: "fitMode",
    bottomScale: "bottomScale"
};

export function loadSettings() {
    return {
        topImageUrl: localStorage.getItem(STORAGE_KEYS.topImageUrl) || "",
        bottomImageUrl: localStorage.getItem(STORAGE_KEYS.bottomImageUrl) || "",
        fitMode: localStorage.getItem(STORAGE_KEYS.fitMode) || "",
        bottomScale: localStorage.getItem(STORAGE_KEYS.bottomScale) || ""
    };
}

export function saveTopImageUrl(url) {
    localStorage.setItem(STORAGE_KEYS.topImageUrl, url);
}

export function saveBottomImageUrl(dataUrl) {
    localStorage.setItem(STORAGE_KEYS.bottomImageUrl, dataUrl);
}

export function saveFitMode(mode) {
    localStorage.setItem(STORAGE_KEYS.fitMode, mode);
}

export function saveBottomScale(scale) {
    localStorage.setItem(STORAGE_KEYS.bottomScale, String(scale));
}
