/* global alert, console */
import { drawCanvas } from "./core.js";
import {
    loadSettings,
    saveTopImageUrl,
    saveBottomImageUrl,
    saveFitMode,
    saveBottomScale
} from "./services.js";
import { bindDropZoneEvents, bindCanvasDragEvents } from "./ui.js";
import { getDownloadFilename, isImageFile, parseScale } from "./utils.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const topUrlInput = document.getElementById("topUrl");
const dropZone = document.getElementById("dropZone");
const dropZoneText = document.getElementById("dropZoneText");
const dropOverlay = document.getElementById("dropOverlay");
const bottomFileInput = document.getElementById("bottomFile");
const fitModeRadios = document.querySelectorAll('input[name="fitMode"]');
const bottomScaleInput = document.getElementById("bottomScale");
const bottomScaleValue = document.getElementById("bottomScaleValue");
const downloadButton = document.getElementById("downloadBtn");
const quickFrameButton = document.getElementById("quickFrameBtn");
const DEFAULT_FRAME_URL = "./assets/frame.png";

const app = {
    canvas,
    ctx,
    topUrlInput,
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
            console.log("Service Worker 註冊失敗:", error);
        });
    });
}

function updateScaleUI() {
    app.bottomScaleValue.textContent = `${Math.round(app.bottomScale * 100)}%`;
    app.bottomScaleInput.value = String(Math.round(app.bottomScale * 100));
}

function processFile(file) {
    if (!isImageFile(file)) {
        alert("請放入圖片檔案！");
        return;
    }

    app.dropZoneText.innerHTML = `已載入圖片：<br><span class="file-name">${file.name}</span>`;

    const reader = new FileReader();
    reader.onload = (event) => {
        const dataUrl = event.target.result;
        app.bottomImg.src = dataUrl;
        app.offsetX = 0;
        app.offsetY = 0;

        try {
            saveBottomImageUrl(dataUrl);
        } catch (error) {
            console.log("圖片體積較大，未成功儲存至瀏覽器紀錄，但仍可正常在畫面操作與下載。");
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

function downloadImage() {
    try {
        const dataUrl = app.canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = getDownloadFilename();
        link.href = dataUrl;
        link.click();
    } catch (error) {
        alert("無法下載圖片！可能是因為上層圖片網址不支援 CORS 跨域請求。");
    }
}

function applyStoredSettings() {
    const settings = loadSettings();

    if (settings.topImageUrl) {
        setTopFrameUrl(settings.topImageUrl);
    }

    if (settings.bottomImageUrl) {
        app.bottomImg.src = settings.bottomImageUrl;
        app.dropZoneText.innerHTML = "已從瀏覽器紀錄載入上一次的圖片<br><span class='file-name'>（可重新拖曳或點擊更換）</span>";
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

async function applyPhotoQueryParam(params) {
    const photoUrl = params.get("photo")?.trim();
    if (!photoUrl) {
        return;
    }

    let normalizedUrl;
    try {
        normalizedUrl = resolveImageParamToUrl(photoUrl);
    } catch (error) {
        console.log("網址參數 photo 格式不正確，已略過。");
        return;
    }

    const isImageUrl = await canLoadImageFromUrl(normalizedUrl);
    if (!isImageUrl) {
        console.log("網址參數 photo 不是可載入的圖片，已略過。");
        return;
    }

    app.bottomImg.src = normalizedUrl;
    app.offsetX = 0;
    app.offsetY = 0;
    app.dropZoneText.innerHTML = "已從網址參數載入下層圖片<br><span class='file-name'>（可重新拖曳或點擊更換）</span>";
    saveBottomImageUrl(normalizedUrl);
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
        console.log("網址參數 frame 格式不正確，已略過。");
        return;
    }

    const isImageUrl = await canLoadImageFromUrl(normalizedUrl);
    if (!isImageUrl) {
        console.log("網址參數 frame 不是可載入的圖片，已略過。");
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
}

async function init() {
    applyStoredSettings();
    bindControlEvents();
    await applyQueryImageParams();
    bindDropZoneEvents({ ...app, processFile });
    bindCanvasDragEvents(app);
    app.draw();
    registerServiceWorker();
}

init();
