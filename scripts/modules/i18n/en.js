window.I18N_TRANSLATIONS = window.I18N_TRANSLATIONS || {};

window.I18N_TRANSLATIONS.en = {
    meta: {
        title: "prod. frame Product Photo Framer"
    },
    app: {
        title: "Image Composition & Crop"
    },
    language: {
        label: "Language",
        selectorAriaLabel: "Language selector",
        options: {
            zhTW: "Traditional Chinese",
            en: "English"
        }
    },
    panels: {
        topLayer: {
            title: "Top Layer",
            urlLabel: "Top image URL (frame/watermark)",
            urlPlaceholder: "Enter the top image URL",
            quickFrame: "Apply \"Fated Finds\" frame quickly"
        },
        bottomLayer: {
            title: "Bottom Layer",
            urlLabel: "Bottom image URL (base photo)",
            urlPlaceholder: "Enter the bottom image URL",
            imageLabel: "Bottom image (base photo)",
            dropZoneDefault: "Drag an image here or click to choose a file"
        }
    },
    fitMode: {
        autoShort: "Auto fit shorter edge",
        width: "Fit width",
        height: "Fit height"
    },
    controls: {
        bottomScale: "Bottom image scale"
    },
    preview: {
        download: "Download composited image",
        header: "Preview",
        hint: "💡 Tip: Drag directly on the canvas to move the bottom image"
    },
    overlay: {
        dropToUpload: "Release to upload image"
    },
    messages: {
        invalidImageFile: "Please upload an image file.",
        downloadFailed: "Unable to download image. The top image URL may not support CORS.",
        fileLoaded: "Loaded image:",
        loadedFromStorage: "Loaded the previous image from browser storage",
        loadedFromQuery: "Loaded bottom image from URL parameter",
        loadedFromUrlInput: "Loaded bottom image from URL input",
        replaceHint: "(Drag or click to replace)",
        photoParamInvalid: "Skipped: invalid photo URL parameter.",
        photoParamNotImage: "Skipped: photo URL parameter is not a loadable image.",
        fatedFindsRequestFailed: "Skipped photo: fated_finds request failed.",
        fatedFindsInvalidResponse: "Skipped photo: fated_finds returned invalid JSON.",
        fatedFindsMissingPhotoUrl: "Skipped photo: fated_finds response has no photo_url.",
        frameParamInvalid: "Skipped: invalid frame URL parameter.",
        frameParamNotImage: "Skipped: frame URL parameter is not a loadable image.",
        saveBottomImageFailed: "Image is too large to save in browser storage, but editing and downloading still work.",
        swRegisterFailed: "Service Worker registration failed:"
    }
};
