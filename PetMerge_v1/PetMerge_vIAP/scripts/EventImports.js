import { levelMissionDataArr } from './levelMissionData.js';
import { translations } from './languages.js';
import { limitedOffer, getNextAvailableSubitems, itemPriority } from './IAP.js';
import {
    is_have_ad,
    tracking_ad_status,
    none_tracking_ad_status,
    set_tracking_ad_status,
    is_bottom_banner,
    bottom_height,
    is_top_margin,
    load_ad,
    show_ad,
    get_lang,
    is_done_ad,
    no_ad_show,
    tracking_is_done_ad,
    game_loading_completed,
    gameplay,
    is_label_showed,
    progression_event,
    design_event,
    resource_event,
    dimension_event_GA,
    ad_event_GA,
    set_ad_placement,
    platform_ad,
    game_analytics,
    is_game_analytics,
    timeout_GA,
    parent,
    is_fullscreen,
    god_mode,
    init_success,
    storagePlatform,
    remaining_ad,
    is_loaded_banner_ad
} from './AdsConfig.js';

// Constants
const MS_24_HOURS = 86400000;
const BUILD_VERSION = "v3.0.0";
const STORAGE_TYPE_LOCAL = "local_storage";
const DEFAULT_GAME_ID = "petmerge_test";

// Vibration constants
const VIBRATION_DURATION = 300;

// Game ID configuration
let gameId = DEFAULT_GAME_ID;

if (platform_ad !== "Azerion") {
    gameId = `petmerge_${platform_ad.toLowerCase()}`;
} else {
    gameId = "petmerge_build";
}

const storageType = STORAGE_TYPE_LOCAL;

// Level goals mission adventure mode
const tempLevelGoalsArr = [];
const starLevelCollectedArr = [];
const atemptEachLevel = [];

const tutorialCompletedArr = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const unlockedBoosterArr = [
    { "classic_level_min": [2, 5, 9] },
    { "adventure_level_min": [5, 12, 23, 32, 43] }
];
const boosterDataArr = { "hammer": 0, "shake": 0, "brush": 0, "rainbow": 0 };

const default_weekly_arr = [
    { "status": 0, "bonus_face": 0, "count": 1 },
    { "status": 0, "bonus_face": 1, "count": 1 },
    { "status": 0, "bonus_face": 2, "count": 1 },
    { "status": 0, "bonus_face": 3, "count": 1 },
    { "status": 0, "bonus_face": 1, "count": 1 },
    { "status": 0, "bonus_face": 2, "count": 1 },
    { "status": 0, "bonus_face": 3, "count": 1 }
];
const weekly_arr = [];

let exp_time = 0;

let hasFocus = true;
let isWatchingAd = false;

if (!isWatchingAd) {
    window.onblur = () => {};
    window.onfocus = () => {};
}

// Banner ads
if (platform_ad === "Xiaomi") {
    const html = document.getElementsByTagName("html")[0];
    const head = document.getElementsByTagName("head")[0];
    const body = document.getElementsByTagName("body")[0];

    body.style.display = "flex";
    body.style.position = "relative";

    createAdBanner();
}

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

function createAdBanner() {
    const body = document.body;
    if (!body) {
        return;
    }

    const banner_anchor = document.createElement("div");
    banner_anchor.className = "ad-banner";
    banner_anchor.style.position = "fixed";
    banner_anchor.style.bottom = "0";
    banner_anchor.style.display = "flex";
    banner_anchor.style.justifyContent = "center";
    banner_anchor.style.alignItems = "center";
    banner_anchor.style.width = "100%";
    banner_anchor.style.height = "60px";

    const banner_container = document.createElement("div");
    banner_container.id = "banner-container";
    banner_anchor.appendChild(banner_container);

    document.body.appendChild(banner_anchor);

    const loadBannerAd = async () => {
        if (window.CrazyGames !== undefined && window.CrazyGames.SDK !== undefined) {
            try {
                await window.CrazyGames.SDK.banner.requestBanner({
                    id: "banner-container",
                    width: 320,
                    height: 50,
                });
            } catch (e) {}
        }
        if (window.MiGames !== undefined && window.MiGames.SDK !== undefined) {
            try {
                await window.MiGames.SDK.ad.requestBanner({
                    id: "banner-container",
                    width: 320,
                    height: 50,
                });
            } catch (e) {}
        }
        if (platform_ad === "Azerion") {
            if (typeof gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined') {
                if (!is_loaded_banner_ad) {
                    try {
                        await delay(1000);
                        await window.gdsdk.showAd("display", { containerId: "bannerDiv" })
                            .then(() => {})
                            .catch(() => {});
                    } catch (err) {}
                }
            }
        }
    };

    loadBannerAd();
}

function showAdBanner() {
    if (platform_ad === "Xiaomi" || platform_ad === "Azerion") {
        const banner_anchor = document.querySelector(".ad-banner");
        if (banner_anchor) {
            banner_anchor.style.display = "flex";
        } else {
            createAdBanner();
        }
    } else if (platform_ad === "CrazyGames") {
        if (window.CrazyGames !== undefined && window.CrazyGames.SDK !== undefined) {
            createAdBanner();
        }
    }
}

function hideAdBanner() {
    if (platform_ad === "Xiaomi" || platform_ad === "Azerion") {
        const banner_anchor = document.querySelector(".ad-banner");
        if (banner_anchor) {
            banner_anchor.style.display = "none";
        }
    } else if (platform_ad === "CrazyGames") {
        try {
            if (window.CrazyGames && window.CrazyGames.SDK && window.CrazyGames.SDK.banner) {
                window.CrazyGames.SDK.banner.clearAllBanners();
            }
        } catch (err) {}
    }
}

function removeAdAnchor() {
    if (platform_ad === "Xiaomi") {
        const anchors = document.querySelectorAll('ins[data-anchor-shown="true"]');
        anchors.forEach(anchor => {
            anchor.remove();
        });
    }
}

const formatRupiah = (num) => {
    return `Rp. ${Number(num).toLocaleString("id-ID")},-`;
};

const tempDataLimitedOffer = {};

const checkVibrationSupport = () => {
    return "vibrate" in navigator;
};

const simpleVibration = () => {
    if (checkVibrationSupport()) {
        navigator.vibrate(VIBRATION_DURATION);
    }
};

const triggerHaptics = async () => {
    if ("hapticFeedback" in navigator) {
        try {
            await navigator.hapticFeedback("light");
        } catch (error) {
            console.error("Haptic feedback failed:", error);
            simpleVibration();
        }
    } else {
        simpleVibration();
    }
};
