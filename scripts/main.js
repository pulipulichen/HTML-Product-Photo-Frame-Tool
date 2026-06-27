/* global alert, console */
import { drawCanvas } from "./core.js";
import {
    loadSettings,
    saveTopImageUrl,
    saveBottomImageUrl,
    saveFitMode,
    saveBottomScale
} from "./services.js";
import { initI18n, onLanguageChange, t } from "./modules/i18n.js";
import { bindDropZoneEvents, bindCanvasDragEvents } from "./ui.js";
import { getDownloadFilename, isImageFile, parseScale } from "./utils.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const topUrlInput = document.getElementById("topUrl");
const bottomUrlInput = document.getElementById("bottomUrl");
const dropZone = document.getElementById("dropZone");
const dropZoneText = document.getElementById("dropZoneText");
const dropOverlay = document.getElementById("dropOverlay");
const loadingOverlay = document.getElementById("loadingOverlay");
const bottomFileInput = document.getElementById("bottomFile");
const fitModeRadios = document.querySelectorAll('input[name="fitMode"]');
const bottomScaleInput = document.getElementById("bottomScale");
const bottomScaleValue = document.getElementById("bottomScaleValue");
const downloadButton = document.getElementById("downloadBtn");
const quickFrameButton = document.getElementById("quickFrameBtn");
const languageSelect = document.getElementById("languageSelect");
const DEFAULT_FRAME_URL = "./assets/frame.png";
const FATED_FINDS_PHOTO_RESOLVER_URL = "https://script.google.com/macros/s/AKfycbwARlId6wP2jgHxMpV93KCEf2u2BjcTBa_UdXhqajv8GJNWO39mfgL2QkJ2VZKU1cmOxg/exec";

const app = {
    canvas,
    ctx,
    topUrlInput,
    bottomUrlInput,
    dropZone,
    dropZoneText,
    dropOverlay,
    bottomFileInput,
    fitModeRadios,
    bottomScaleInput,
    bottomScaleValue,
    fitMode: "autoShort",
    topImg: new Image(),
    bottomImg: new Image(),
    offsetX: 0,
    offsetY: 0,
    bottomScale: 1,
    isDragging: false,
    startX: 0,
    startY: 0,
    draw() {
        drawCanvas(app);
    }
};

app.topImg.crossOrigin = "Anonymous";
app.bottomImg.crossOrigin = "Anonymous";

const dropZoneState = {
    type: "default",
    fileName: ""
};

function escapeHtml(rawText) {
    return String(rawText)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\"", "&quot;")
        .replaceAll("'", "&#39;");
}

function renderDropZoneText() {
    if (dropZoneState.type === "file" && dropZoneState.fileName) {
        app.dropZoneText.innerHTML = `${t("messages.fileLoaded")}<br><span class="file-name">${escapeHtml(dropZoneState.fileName)}</span>`;
        return;
    }

    if (dropZoneState.type === "storage") {
        app.dropZoneText.innerHTML = `${t("messages.loadedFromStorage")}<br><span class="file-name">${t("messages.replaceHint")}</span>`;
        return;
    }

    if (dropZoneState.type === "query") {
        app.dropZoneText.innerHTML = `${t("messages.loadedFromQuery")}<br><span class="file-name">${t("messages.replaceHint")}</span>`;
        return;
    }

    if (dropZoneState.type === "url") {
        app.dropZoneText.innerHTML = `${t("messages.loadedFromUrlInput")}<br><span class="file-name">${t("messages.replaceHint")}</span>`;
        return;
    }

    app.dropZoneText.textContent = t("panels.bottomLayer.dropZoneDefault");
}

function canRegisterServiceWorker() {
    const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    const isSecureContext = window.location.protocol === "https:" || isLocalhost;
    return "serviceWorker" in navigator && isSecureContext;
}

function registerServiceWorker() {
    if (!canRegisterServiceWorker()) {
        return;
    }

    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js").catch((error) => {
            console.log(t("messages.swRegisterFailed"), error);
        });
    });
}

function setLoadingOverlayVisible(isVisible) {
    if (!loadingOverlay) {
        return;
    }
    loadingOverlay.classList.toggle("visible", isVisible);
    loadingOverlay.setAttribute("aria-hidden", isVisible ? "false" : "true");
}

function updateScaleUI() {
    app.bottomScaleValue.textContent = `${Math.round(app.bottomScale * 100)}%`;
    app.bottomScaleInput.value = String(Math.round(app.bottomScale * 100));
}

function processFile(file) {
    if (!isImageFile(file)) {
        alert(t("messages.invalidImageFile"));
        return;
    }

    dropZoneState.type = "file";
    dropZoneState.fileName = file.name;
    renderDropZoneText();

    const reader = new FileReader();
    reader.onload = (event) => {
        const dataUrl = event.target.result;
        setBottomPhotoUrl(dataUrl, { persist: false, dropZoneType: "file" });

        try {
            saveBottomImageUrl(dataUrl);
        } catch (error) {
            console.log(t("messages.saveBottomImageFailed"));
        }
    };
    reader.readAsDataURL(file);
}

function setTopFrameUrl(url) {
    const normalizedUrl = url.trim();
    app.topUrlInput.value = normalizedUrl;
    saveTopImageUrl(normalizedUrl);
    if (normalizedUrl) {
        app.topImg.src = normalizedUrl;
        return;
    }
    app.draw();
}

function setBottomPhotoUrl(url, options = {}) {
    const { persist = true, dropZoneType = "url" } = options;
    const normalizedUrl = url.trim();
    app.bottomUrlInput.value = normalizedUrl;

    if (!normalizedUrl) {
        if (persist) {
            saveBottomImageUrl("");
        }
        dropZoneState.type = "default";
        dropZoneState.fileName = "";
        renderDropZoneText();
        app.draw();
        return;
    }

    app.bottomImg.src = normalizedUrl;
    app.offsetX = 0;
    app.offsetY = 0;
    dropZoneState.type = dropZoneType;
    dropZoneState.fileName = "";
    renderDropZoneText();
    if (persist) {
        saveBottomImageUrl(normalizedUrl);
    }
}

function downloadImage() {
    try {
        const dataUrl = app.canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = getDownloadFilename();
        link.href = dataUrl;
        link.click();
    } catch (error) {
        alert(t("messages.downloadFailed"));
    }
}

function shouldHandleDownloadShortcut(target) {
    if (!(target instanceof HTMLElement)) {
        return true;
    }

    if (target.isContentEditable) {
        return false;
    }

    return !["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

function applyStoredSettings() {
    const settings = loadSettings();

    if (settings.topImageUrl) {
        setTopFrameUrl(settings.topImageUrl);
    }

    if (settings.bottomImageUrl) {
        setBottomPhotoUrl(settings.bottomImageUrl, { persist: false, dropZoneType: "storage" });
    } else {
        app.bottomUrlInput.value = "";
        dropZoneState.type = "default";
        dropZoneState.fileName = "";
    }

    if (settings.fitMode) {
        const targetRadio = document.querySelector(`input[name="fitMode"][value="${settings.fitMode}"]`);
        if (targetRadio) {
            targetRadio.checked = true;
            app.fitMode = settings.fitMode;
        }
    } else {
        const defaultRadio = document.querySelector('input[name="fitMode"]:checked');
        if (defaultRadio) {
            app.fitMode = defaultRadio.value;
        }
    }

    const storedScale = parseScale(settings.bottomScale);
    if (storedScale) {
        app.bottomScale = storedScale;
    }
    updateScaleUI();
    renderDropZoneText();
}

function canLoadImageFromUrl(url) {
    return new Promise((resolve) => {
        const testImage = new Image();
        testImage.crossOrigin = "Anonymous";
        testImage.onload = () => resolve(true);
        testImage.onerror = () => resolve(false);
        testImage.src = url;
    });
}

function resolveImageParamToUrl(rawValue) {
    return new URL(rawValue, window.location.href).toString();
}

function shouldUseFatedFinds(params) {
    return params.get("fated_finds")?.toLowerCase() === "true";
}

async function resolvePhotoUrlWithFatedFinds(rawPhotoParam) {
    const resolverUrl = new URL(FATED_FINDS_PHOTO_RESOLVER_URL);
    resolverUrl.searchParams.set("p", rawPhotoParam);

    let response;
    setLoadingOverlayVisible(true);
    try {
        response = await fetch(resolverUrl.toString());
    } catch (error) {
        console.log(t("messages.fatedFindsRequestFailed"));
        return "";
    } finally {
        setLoadingOverlayVisible(false);
    }

    if (!response.ok) {
        console.log(t("messages.fatedFindsRequestFailed"));
        return "";
    }

    let payload;
    try {
        payload = await response.json();
    } catch (error) {
        console.log(t("messages.fatedFindsInvalidResponse"));
        return "";
    }

    const photoBase64 = payload?.photo_base64;
    if (typeof photoBase64 !== "string" || !photoBase64.trim()) {
        console.log(t("messages.fatedFindsMissingPhotoBase64"));
        return "";
    }

    const trimmedPhotoBase64 = photoBase64.trim();
    if (trimmedPhotoBase64.startsWith("data:image/")) {
        return trimmedPhotoBase64;
    }

    return `data:image/png;base64,${trimmedPhotoBase64}`;
}

async function applyPhotoQueryParam(params) {
    const photoUrl = params.get("photo")?.trim();
    if (!photoUrl) {
        return;
    }

    let sourcePhotoValue = photoUrl;
    if (shouldUseFatedFinds(params)) {
        const resolvedPhotoUrl = await resolvePhotoUrlWithFatedFinds(photoUrl);
        if (!resolvedPhotoUrl) {
            return;
        }
        sourcePhotoValue = resolvedPhotoUrl;
    }

    let normalizedUrl;
    try {
        if (sourcePhotoValue.startsWith("data:image/")) {
            normalizedUrl = sourcePhotoValue;
        } else {
            normalizedUrl = resolveImageParamToUrl(sourcePhotoValue);
        }
    } catch (error) {
        console.log(t("messages.photoParamInvalid"));
        return;
    }

    const isImageUrl = await canLoadImageFromUrl(normalizedUrl);
    if (!isImageUrl) {
        console.log(t("messages.photoParamNotImage"));
        return;
    }

    setBottomPhotoUrl(normalizedUrl, { dropZoneType: "query" });
}

async function applyFrameQueryParam(params) {
    const frameUrl = params.get("frame")?.trim();
    if (!frameUrl) {
        return;
    }

    let normalizedUrl;
    try {
        normalizedUrl = resolveImageParamToUrl(frameUrl);
    } catch (error) {
        console.log(t("messages.frameParamInvalid"));
        return;
    }

    const isImageUrl = await canLoadImageFromUrl(normalizedUrl);
    if (!isImageUrl) {
        console.log(t("messages.frameParamNotImage"));
        return;
    }

    setTopFrameUrl(normalizedUrl);
}

async function applyQueryImageParams() {
    const params = new URLSearchParams(window.location.search);
    await applyFrameQueryParam(params);
    await applyPhotoQueryParam(params);
}

function bindControlEvents() {
    app.topUrlInput.addEventListener("input", (event) => {
        setTopFrameUrl(event.target.value);
    });
    app.bottomUrlInput.addEventListener("input", (event) => {
        setBottomPhotoUrl(event.target.value);
    });

    app.fitModeRadios.forEach((radio) => {
        radio.addEventListener("change", (event) => {
            app.fitMode = event.target.value;
            app.offsetX = 0;
            app.offsetY = 0;
            saveFitMode(app.fitMode);
            app.draw();
        });
    });

    app.bottomScaleInput.addEventListener("input", (event) => {
        const scalePercent = Number(event.target.value);
        app.bottomScale = scalePercent / 100;
        saveBottomScale(app.bottomScale);
        updateScaleUI();
        app.draw();
    });

    app.topImg.onload = () => app.draw();
    app.bottomImg.onload = () => app.draw();
    if (quickFrameButton) {
        quickFrameButton.addEventListener("click", () => {
            setTopFrameUrl(DEFAULT_FRAME_URL);
        });
    }
    downloadButton.addEventListener("click", downloadImage);
    document.addEventListener("keydown", (event) => {
        if (event.defaultPrevented || event.repeat) {
            return;
        }

        if (event.key.toLowerCase() !== "s") {
            return;
        }

        if (!shouldHandleDownloadShortcut(event.target)) {
            return;
        }

        event.preventDefault();
        downloadImage();
    });
}

async function init() {
    initI18n(languageSelect);
    onLanguageChange(() => {
        updateScaleUI();
        renderDropZoneText();
    });
    applyStoredSettings();
    bindControlEvents();
    await applyQueryImageParams();
    bindDropZoneEvents({ ...app, processFile });
    bindCanvasDragEvents(app);
    app.draw();
    registerServiceWorker();
}

init();
