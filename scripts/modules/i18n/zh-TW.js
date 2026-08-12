window.I18N_TRANSLATIONS = window.I18N_TRANSLATIONS || {};

window.I18N_TRANSLATIONS["zh-TW"] = {
    meta: {
        title: "prod. frame 商品加框器"
    },
    app: {
        title: "圖片合成與裁切"
    },
    language: {
        label: "語言",
        selectorAriaLabel: "語系切換選單",
        options: {
            zhTW: "繁體中文",
            en: "English"
        }
    },
    panels: {
        topLayer: {
            title: "上層圖層",
            urlLabel: "上層圖片網址 (方框/浮水印)",
            urlPlaceholder: "請輸入上層圖片的 URL",
            quickFrame: "快速套用「有緣物所」邊框"
        },
        bottomLayer: {
            title: "下層圖層",
            urlLabel: "下層圖片網址 (底圖)",
            urlPlaceholder: "請輸入下層圖片的 URL",
            imageLabel: "下層圖片 (底圖)",
            dropZoneDefault: "將圖片拖曳至此，或點擊選取檔案"
        }
    },
    fitMode: {
        autoShort: "自動對齊短邊",
        width: "對齊寬度",
        height: "對齊高度"
    },
    controls: {
        bottomScale: "下層圖片縮放",
        resetScaleAndCenter: "重設縮放並置中"
    },
    preview: {
        download: "下載合成圖片",
        header: "預覽",
        hint: "💡 提示：可以直接在畫布上拖曳移動下層底圖的位置"
    },
    overlay: {
        dropToUpload: "放開即可上傳圖片",
        loading: "讀取中..."
    },
    messages: {
        invalidImageFile: "請放入圖片檔案！",
        downloadFailed: "無法下載圖片！可能是因為上層圖片網址不支援 CORS 跨域請求。",
        fileLoaded: "已載入圖片：",
        loadedFromStorage: "已從瀏覽器紀錄載入上一次的圖片",
        loadedFromQuery: "已從網址參數載入下層圖片",
        loadedFromUrlInput: "已從下層圖片網址載入底圖",
        replaceHint: "（可重新拖曳或點擊更換）",
        photoParamInvalid: "網址參數 photo 格式不正確，已略過。",
        photoParamNotImage: "網址參數 photo 不是可載入的圖片，已略過。",
        fatedFindsRequestFailed: "fated_finds 查詢失敗，已略過 photo 參數。",
        fatedFindsInvalidResponse: "fated_finds 回傳格式錯誤，已略過 photo 參數。",
        fatedFindsMissingPhotoBase64: "fated_finds 回傳未包含 photo_base64，已略過 photo 參數。",
        frameParamInvalid: "網址參數 frame 格式不正確，已略過。",
        frameParamNotImage: "網址參數 frame 不是可載入的圖片，已略過。",
        saveBottomImageFailed: "圖片體積較大，未成功儲存至瀏覽器紀錄，但仍可正常在畫面操作與下載。",
        swRegisterFailed: "Service Worker 註冊失敗:"
    }
};
