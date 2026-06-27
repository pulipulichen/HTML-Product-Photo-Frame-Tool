export function getDownloadFilename() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mi = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    return `merged-image-${yyyy}${mm}${dd}-${hh}${mi}${ss}.png`;
}

export function parseScale(rawScale) {
    const numericScale = Number(rawScale);
    if (Number.isNaN(numericScale)) {
        return null;
    }
    if (numericScale < 0.1 || numericScale > 3) {
        return null;
    }
    return numericScale;
}

export function isImageFile(file) {
    return Boolean(file && file.type && file.type.startsWith("image/"));
}
