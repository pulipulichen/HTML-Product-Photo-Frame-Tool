const TRANSLATIONS = window.I18N_TRANSLATIONS || {};
const SUPPORTED_LANGUAGES = Object.keys(TRANSLATIONS);
const LANGUAGE_STORAGE_KEY = "photoFrame_language";
const fallbackLanguage = SUPPORTED_LANGUAGES.includes("en") ? "en" : SUPPORTED_LANGUAGES[0];
const languageChangeListeners = new Set();

let currentLanguage = fallbackLanguage;

function getNestedValue(source, key) {
    return key.split(".").reduce((acc, part) => acc?.[part], source);
}

function resolveSupportedLanguage(rawLanguage) {
    if (!rawLanguage) {
        return "";
    }

    if (SUPPORTED_LANGUAGES.includes(rawLanguage)) {
        return rawLanguage;
    }

    const baseLanguage = rawLanguage.split("-")[0];
    return SUPPORTED_LANGUAGES.find((lang) => lang === baseLanguage || lang.startsWith(`${baseLanguage}-`)) || "";
}

function getBrowserLanguage() {
    const browserLanguages = [navigator.language, ...(navigator.languages || [])].filter(Boolean);
    for (const language of browserLanguages) {
        const resolvedLanguage = resolveSupportedLanguage(language);
        if (resolvedLanguage) {
            return resolvedLanguage;
        }
    }
    return "";
}

function resolveInitialLanguage() {
    const storedLanguage = resolveSupportedLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY));
    if (storedLanguage) {
        return storedLanguage;
    }

    const browserLanguage = getBrowserLanguage();
    if (browserLanguage) {
        return browserLanguage;
    }

    return fallbackLanguage;
}

function interpolateMessage(message, params) {
    if (!params) {
        return message;
    }

    return message.replace(/\{(\w+)\}/g, (_, token) => {
        const value = params[token];
        return value === undefined ? `{${token}}` : String(value);
    });
}

export function t(key, params) {
    const activeTranslations = TRANSLATIONS[currentLanguage] || {};
    const fallbackTranslations = TRANSLATIONS[fallbackLanguage] || {};
    const message = getNestedValue(activeTranslations, key) || getNestedValue(fallbackTranslations, key);
    if (typeof message !== "string") {
        return key;
    }
    return interpolateMessage(message, params);
}

export function applyTranslations(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((element) => {
        element.textContent = t(element.dataset.i18n);
    });

    root.querySelectorAll("[data-i18n-html]").forEach((element) => {
        element.innerHTML = t(element.dataset.i18nHtml);
    });

    root.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
        element.placeholder = t(element.dataset.i18nPlaceholder);
    });

    root.querySelectorAll("[data-i18n-title]").forEach((element) => {
        element.title = t(element.dataset.i18nTitle);
    });

    root.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
        element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
    });

    document.title = t("meta.title");
}

export function getCurrentLanguage() {
    return currentLanguage;
}

export function setLanguage(language, options = {}) {
    const { save = true, notify = true } = options;
    const resolvedLanguage = resolveSupportedLanguage(language) || fallbackLanguage;

    currentLanguage = resolvedLanguage;
    document.documentElement.lang = resolvedLanguage;

    if (save) {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, resolvedLanguage);
    }

    applyTranslations();

    if (notify) {
        languageChangeListeners.forEach((listener) => listener(resolvedLanguage));
    }
}

export function onLanguageChange(listener) {
    languageChangeListeners.add(listener);
    return () => {
        languageChangeListeners.delete(listener);
    };
}

export function initI18n(languageSelectElement) {
    if (SUPPORTED_LANGUAGES.length === 0) {
        return;
    }

    const initialLanguage = resolveInitialLanguage();
    setLanguage(initialLanguage, { save: false, notify: false });

    if (languageSelectElement) {
        languageSelectElement.value = currentLanguage;
        languageSelectElement.addEventListener("change", (event) => {
            setLanguage(event.target.value);
        });
    }
}
