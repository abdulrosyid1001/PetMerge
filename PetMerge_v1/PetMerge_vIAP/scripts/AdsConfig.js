// Platform ad constants
const PLATFORM_AZERION_GAME_ID = "35799317c8454449b2ecb58536664069";
const PLATFORM_AZERION_PREFIX = "petmerge_sample";
const TIMEOUT_GA = 5000;
const MS_24_HOURS = 86400000;
const RETRY_DELAY = 100;
const MAX_RETRIES = 20;

// Analytics keys configuration
const ANALYTICS_KEYS = {
    Glance: { game_key: "8ad2240137c6836d8352e4ced5020990", secret_key: "9543332977347ba142231b8e349fc9ec048a64c4" },
    Lagged: { game_key: "0a85c98b9a4e162221699115b6761210", secret_key: "b80cf876404c869678d4665ec7cf3f0cb07a0148" },
    Xiaomi_Deploy: { game_key: "49a4f0e87b93b5b6c35676a2ee5a1090", secret_key: "1505e964159429e596e440b7298a735e87d3ce37" },
    Xiaomi: { game_key: "0d76c889ecc5d264114c0560d6d1c5ee", secret_key: "b624637ee346ddda537d7def9a54bcb6e50d87a8" },
    Test: { game_key: "0d76c889ecc5d264114c0560d6d1c5ee", secret_key: "b624637ee346ddda537d7def9a54bcb6e50d87a8" },
    Gopay: { game_key: "0d76c889ecc5d264114c0560d6d1c5ee", secret_key: "b624637ee346ddda537d7def9a54bcb6e50d87a8" }
};

// Facebook ad placement IDs
const FB_AD_PLACEMENT_ID = "1036071814995688_403800600388584";

// Configuration and state variables
export let platform_ad = "Stagging";
export let parent = window.parent.window;
export let get_lang = new URLSearchParams(window.location.search).get('lang') || "en";
export let god_mode = new URLSearchParams(window.location.search).get('gm') || "on";
export let tracking_ad_status = "none";
export let is_done_ad = false;
export let is_have_ad = false;
export let is_game_analytics = false;
export let is_bottom_banner = false;
export let is_label_showed = false;
export let is_top_margin = false;
export let bottom_height = 120;
export let is_fullscreen = false;
export let init_success = false;
export let userName = "";
export let storagePlatform = "";
export let remaining_ad = 10;
export const timeout_GA = TIMEOUT_GA;
export let is_loaded_banner_ad = false;

let is_start_init = false;
let initialization_ad = false;
let count_ad_reward = 0;
let count_ad_interstitial = 0;
let count_ad_reset = false;
let ad_format;
let ad_reward_state;
let is_grant_reward = false;
let once_preload = false;
let ad_placement = "null";
let is_loaded_interstitial_ad = false;
let is_loaded_rewarded_ad = false;
let interst_ad = null;
let reward_ad = null;
let gameplay_status_global = "none";

/**
 * Initializes ad configuration based on the current platform
 * Sets platform-specific flags like fullscreen, bottom banner, etc.
 */
const init_config_ad = () => {
    switch (platform_ad) {
        case "Azerion":
            is_have_ad = true;
            break;
        case "Gameloft":
            is_fullscreen = true;
            break;
        case "Glance":
            is_have_ad = true;
            is_bottom_banner = true;
            is_top_margin = true;
            break;
        case "Lagged":
            is_have_ad = true;
            is_fullscreen = true;
            break;
        case "LudiGames":
            is_have_ad = true;
            is_fullscreen = true;
            break;
        case "PlayDeck":
            is_have_ad = true;
            break;
        case "Poki":
            is_have_ad = true;
            is_fullscreen = true;
            break;
        case "Transsion":
            is_have_ad = true;
            is_bottom_banner = true;
            is_fullscreen = true;
            break;
        case "Xiaomi":
            is_have_ad = true;
            is_bottom_banner = true;
            is_label_showed = true;
            is_fullscreen = true;
            break;
        case "Gopay":
            is_have_ad = true;
            is_fullscreen = true;
            break;
        case "Yandex":
            is_have_ad = true;
            break;
        case "Facebook":
            is_have_ad = true;
            break;
        case "Huawei":
            is_have_ad = true;
            break;
        case "CrazyGames":
            is_have_ad = true;
            break;
        case "Stagging":
            is_fullscreen = true;
            break;
        case "Test":
            is_fullscreen = true;
            break;
    }
};

/**
 * Initializes the ad SDK for the current platform
 * Loads platform-specific SDKs and sets up event listeners
 */
export const init_ad = () => {
    switch (platform_ad) {
        case "Glance":
        case "Lagged":
        case "Test":
        case "Xiaomi":
        case "Gopay":
            is_game_analytics = true;
            const { game_key, secret_key } = ANALYTICS_KEYS[platform_ad] || {};
            game_analytics("initialize", game_key, secret_key);
            if (platform_ad === "Lagged") {
                preventDefaultNavigation();
                setTimeout(() => LaggedAPI.init('lagdev_14489', 'ca-pub-2609959643441983'), 100);
            }
            break;
        case "Azerion":
            window["GD_OPTIONS"] = {
                "gameId": PLATFORM_AZERION_GAME_ID,
                "prefix": PLATFORM_AZERION_PREFIX,
                "onEvent": (event) => {
                    switch (event.name) {
                        case "SDK_GAME_START":
                            break;
                        case "SDK_GAME_PAUSE":
                            if (is_done_ad) {
                                tracking_ad_status = "started";
                            } else {
                                window.c3_callFunction("start_ad");
                            }
                            break;
                        case "SDK_GDPR_TRACKING":
                            break;
                        case "SDK_GDPR_TARGETING":
                            break;
                        case "SDK_REWARDED_WATCH_COMPLETE":
                            break;
                        case "SDK_ERROR":
                        case "AD_ERROR":
                        case "ALL_ADS_COMPLETED":
                            if (is_done_ad) {
                                is_done_ad = false;
                                if (ad_format === "interstitial") {
                                    is_loaded_interstitial_ad = false;
                                    tracking_ad_status = "skipped";
                                } else if (ad_format === "rewarded") {
                                    is_loaded_rewarded_ad = false;
                                    tracking_ad_status = "completed";
                                }
                            } else {
                                window.c3_callFunction("end_ad");
                            }
                            break;
                        case "DISPLAYAD_IMPRESSION":
                            is_loaded_banner_ad = true;
                            break;
                    }
                },
            };
            ((d, s, id) => {
                const fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                const js = d.createElement(s);
                js.id = id;
                js.src = 'https://html5.api.gamedistribution.com/main.min.js';
                fjs.parentNode.insertBefore(js, fjs);
            })(document, 'script', 'gamedistribution-jssdk');
            break;
        case "PlayDeck":
            parent.postMessage({ playdeck: { method: 'getUserProfile' } }, '*');
            window.addEventListener('message', handlePlayDeckMessages);
            break;
        case "Poki":
            preventDefaultNavigation();
            setTimeout(() => {
                if (window.PokiSDK) {
                    PokiSDK.init()
                        .then(() => {
                            PokiSDK.setDebug(false);
                        })
                        .catch(() => {});
                }
            }, 150);
            break;
        case "Yandex":
            YaGames
            .init()
            .then(ysdk => {
                window.ysdk = ysdk;
            });
            YaGames.init()
            .then(ysdk => ysdk.getFlags())
            .then(flags => {
                if (flags.difficulty === 'hard') {}
            });
            break;
        case "Facebook":
            setTimeout(() => {
                 FBInstant.initializeAsync()
                .then(() => FBInstant.startGameAsync())
                .then(() => {
                    const playerName = FBInstant.player.getName();
                    const playerId = FBInstant.player.getID();
                });
            }, 300);
            break;
        case "Huawei":
            break;
        case "CrazyGames":
            const waitForUserName = (retries = MAX_RETRIES, delay = RETRY_DELAY) => {
                if (typeof window.CrazyGames !== undefined && typeof window.CrazyGames.SDK !== undefined) {
                    if (window.userName !== undefined && window.userName !== "Guest") {
                        userName = window.userName;
                        storagePlatform = "crazygames_storage";
                    } else if (retries > 0) {
                        setTimeout(() => waitForUserName(retries - 1, delay), delay);
                    } else {
                        storagePlatform = "local";
                    }
                } else if (retries > 0) {
                    setTimeout(() => waitForUserName(retries - 1, delay), delay);
                } else {
                    storagePlatform = "local";
                }
            };
            const script_tag = document.createElement('script');
            script_tag.src = 'https://sdk.crazygames.com/crazygames-sdk-v3.js';
            document.head.appendChild(script_tag);

            setTimeout(() => {
                if (window.CrazyGames) {
                    window.CrazyGames.SDK.init()
                        .then(() => {
                            waitForUserName();
                        })
                        .catch(() => {});
                }
            }, 500);
            break;
    }
};

/**
 * Prevents default navigation behavior for certain platforms
 * Currently disabled but can be used to prevent scrolling/key events
 */
const preventDefaultNavigation = () => {};

/**
 * Handles messages from PlayDeck platform
 * @param {Object} data - Message data from PlayDeck
 */
const handlePlayDeckMessages = ({ data }) => {
    const playdeck = data?.playdeck;
    if (!playdeck) return;

    switch (playdeck.method) {
        case 'getUserProfile':
            if (playdeck.value) get_lang = playdeck.value.locale;
            break;
        case 'getPlaydeckState':
            window.isPlayDeckOpened = playdeck.value;
            window.c3_callFunction("audio_set", playdeck.value ? "mute" : "unmute");
            break;
        case 'rewardedAd':
            tracking_ad_status = "completed";
            break;
        case 'errAd':
        case 'skipAd':
        case 'notFoundAd':
            tracking_ad_status = "skipped";
            break;
        case 'startAd':
            tracking_ad_status = "started";
            break;
    }
};

if (!initialization_ad) {
    initialization_ad = true;
    init_config_ad();
    init_ad();
}

/**
 * Sets the ad tracking status
 * @param {string} status - Status to set (e.g., "started", "completed", "skipped", "error")
 */
export const set_tracking_ad_status = (status) => {
    tracking_ad_status = status;
};

/**
 * Resets ad tracking status to "none"
 */
export const none_tracking_ad_status = () => {
    tracking_ad_status = "none";
};

/**
 * Sets the ad placement identifier for analytics
 * @param {string} ap - Ad placement identifier
 */
export const set_ad_placement = (ap = "") => {
    ad_placement = ap;
};

/**
 * Resets the ad done flag
 */
export const no_ad_show = () => {
    is_done_ad = false;
};

/**
 * Called when game loading is completed
 * Notifies the platform SDK that the game is ready to play
 * @param {number} loading_pg - Loading progress percentage (0-100)
 */
export const game_loading_completed = (loading_pg) => {
    switch (platform_ad) {
        case "Glance":
            window.progressBar(loading_pg);
            window.sendCustomAnalyticsEvent("game_load", {});
            window.init_sticky_banner();
            break;
        case "PlayDeck":
            setTimeout(() => {
                parent.postMessage({ playdeck: { method: 'loading', value: 100 } }, '*');
                parent.postMessage({ playdeck: { method: 'sendAnalyticNewSession' } }, '*');
            }, 1000);
            break;
        case "Poki":
            if (window.PokiSDK) {
                PokiSDK.gameLoadingFinished();
                show_ad("start_session");
            }
            break;
        case "Transsion":
            athena_send("loading_end");
            window.h5sdk.gameLoadingCompleted();
            break;
        case "Xiaomi":
            try {
                if (window.funmax && window.funmax.loadReady) {
                    window.funmax.loadReady();
                }
            } catch (e) {
                console.error(e);
            }
            break;
        case "Yandex":
            ysdk.features.LoadingAPI.ready();
            break;
        case "Facebook":
            FBInstant.setLoadingProgress(100);
            break;
        case "CrazyGames":
            break;
        case "Azerion":
            break;
    }
};

/**
 * Tracks gameplay events for analytics
 * @param {string} gameplay_status - Status: "start", "stop", "replay", "days", "homepage", "game_life_end", "completed_transactions"
 * @param {number} days - Number of days (used for return tracking)
 */
export const gameplay = (gameplay_status, days = 0) => {
    gameplay_status_global = gameplay_status;
    switch (platform_ad) {
        case "Glance":
            const glanceEvents = {
                start: () => {
                    if (!is_start_init) {
                        is_start_init = true;
                        window.sendCustomAnalyticsEvent("game_start", {});
                    } else {
                        window.sendCustomAnalyticsEvent("game_replay", {});
                    }
                },
                replay: () => {
                    window.sendCustomAnalyticsEvent("game_replay", {});
                },
                stop: () => {
                    window.sendCustomAnalyticsEvent("game_end", {});
                },
                game_life_end: () => {
                    window.sendCustomAnalyticsEvent("game_life_end", {});
                },
                completed_transactions: () => {
                    window.sendCustomAnalyticsEvent("ingame_transactions", {});
                }
            };
            glanceEvents[gameplay_status]?.();
            break;
        case "LudiGames":
            if (window.dataLayer) {
                const label = gameplay_status === "days" ? `D${days < 10 ? '0' + days : days} - Thor's Merge` : "Thor's Merge";
                const action = {
                    days: "Return",
                    homepage: "Main Menu",
                    start: "Start",
                    stop: "Completion"
                }[gameplay_status];
                if (action) {
                    window.dataLayer.push({
                        event: "ga_event",
                        ga_category: "Gamepage",
                        ga_action: action,
                        ga_label: label,
                        ga_noninteraction: true
                    });
                }
            }
            break;
        case "Poki":
            if (window.PokiSDK) {
                if (gameplay_status === "start") PokiSDK.gameplayStart();
                else if (gameplay_status === "stop") PokiSDK.gameplayStop();
            }
            break;
        case "Yandex":
            if (gameplay_status === "start") {
                ysdk.features.GameplayAPI.start();
            } else if (gameplay_status === "stop") {
                ysdk.features.GameplayAPI.stop();
            }
            break;
        case "CrazyGames":
            if (window.CrazyGames) {
                if (gameplay_status === "start") window.CrazyGames.SDK.game.gameplayStart();
                else if (gameplay_status === "stop") window.CrazyGames.SDK.game.gameplayStop();
            }
            break;
    }
};

/**
 * Sets whether an ad is currently being processed
 * @param {boolean} _is_done_ad - True if ad is done/being processed
 */
export const tracking_is_done_ad = (_is_done_ad) => {
    is_done_ad = _is_done_ad;
};

/**
 * Manages game analytics initialization and session tracking
 * @param {string} ga - Analytics action: "initialize", "start_session", "end_session"
 * @param {string} game_key - Game analytics key
 * @param {string} secret_key - Game analytics secret key
 */
export const game_analytics = (ga, game_key, secret_key) => {
    if (!is_game_analytics) return;

    switch (ga) {
        case "initialize":
            gameanalytics.GameAnalytics.configureAvailableResourceCurrencies(["coins", "hammer", "shake", "brush", "rainbow"]);
            gameanalytics.GameAnalytics.configureAvailableResourceItemTypes(["shop", "star_jar", "daily_login", "weekly_login", "add_booster_pop", "buy_booster_pop", "use_booster", "tutorial", "insufficient_pop_up", "initial", "buy_moves"]);
            gameanalytics.GameAnalytics.configureAvailableCustomDimensions01(["new_user", "returning_user", "old_user"]);
            gameanalytics.GameAnalytics.initialize(game_key, secret_key);
            gameanalytics.GameAnalytics.setEnabledInfoLog(true);
            setTimeout(() => progression_event("start", "loading"), TIMEOUT_GA);
            break;
        case "start_session":
            gameanalytics.GameAnalytics.startSession();
            break;
        case "end_session":
            gameanalytics.GameAnalytics.endSession();
            break;
    }
};

/**
 * Tracks game progression events for analytics
 * @param {string} pe - Event type: "start", "completed", "failed"
 * @param {string} prog_1 - Primary progression identifier (e.g., "level_1", "loading")
 * @param {string} prog_2 - Secondary progression identifier
 * @param {string} prog_3 - Tertiary progression identifier
 * @param {number} game_score - Score achieved in this progression
 */
export const progression_event = (pe = "null", prog_1 = "null", prog_2 = "null", prog_3 = "null", game_score = 0) => {
    if (is_game_analytics) {
        const progression = gameanalytics.EGAProgressionStatus;
        if (pe === "start") {
            gameanalytics.GameAnalytics.addProgressionEvent(progression.Start, prog_1, prog_2);
        } else if (pe === "completed") {
            gameanalytics.GameAnalytics.addProgressionEvent(progression.Complete, prog_1, prog_2, prog_3, game_score || undefined);
        } else if (pe === "failed") {
            gameanalytics.GameAnalytics.addProgressionEvent(progression.Fail, prog_1, prog_2, prog_3, game_score || undefined);
        }
    }

    if (platform_ad === "PlayDeck") {
        const eventBase = { name: ev_name, points: game_score };
        const event_achievement = { ...eventBase, description: { event_status: pe, game_duration } };
        const event_progress = { ...eventBase, description: { event_count: ev_count, event_status: pe, game_duration } };
        if (pe === "start") {
            parent.postMessage({ playdeck: { method: 'sendAnalytics', value: event_progress } }, '*');
        } else if (pe === "completed") {
            parent.postMessage({ playdeck: { method: 'sendAnalytics', value: event_achievement } }, '*');
            parent.postMessage({ playdeck: { method: 'sendAnalytics', value: event_progress } }, '*');
        }
    }
};

/**
 * Tracks custom design events for analytics
 * @param {string} de_parent - Parent event category
 * @param {string} de_child - Child event name
 * @param {number} de_value - Event value
 */
export const design_event = (de_parent = "null", de_child = "null", de_value = 0) => {
    if (is_game_analytics) {
        gameanalytics.GameAnalytics.addDesignEvent(`${de_parent}:${de_child}`, de_value);
    }
};

export const resource_event = (re = "null", item_type = "null", item_id = "null", currency_re = "null", amount_re = 0) => {
    if (is_game_analytics) {
        const resource = gameanalytics.EGAResourceFlowType;
        if (re === "source") {
            gameanalytics.GameAnalytics.addResourceEvent(resource.Source, currency_re, amount_re, item_type, item_id, "");
        } else if (re === "sink") {
            gameanalytics.GameAnalytics.addResourceEvent(resource.Sink, currency_re, amount_re, item_type, item_id, "");
        }
    }
};

export const dimension_event_GA = (de_value = "") => {
    if (is_game_analytics) {
        if (de_value === "new_user") {
            gameanalytics.GameAnalytics.setCustomDimension01("new_user");
        } else if (de_value === "returning_user") {
            gameanalytics.GameAnalytics.setCustomDimension01("returning_user");
        } else if (de_value === "old_user") {
            gameanalytics.GameAnalytics.setCustomDimension01("old_user");
        }
    }
};

export const ad_event_GA = (ad_action = "Clicked", ad_type = "RewardedVideo", ad_sdk_name = "xiaomi", ad_placement = "ad_for_coins", custom_field = "", merge_field = "") => {
    if (is_game_analytics) {
        gameanalytics.GameAnalytics.addAdEvent(gameanalytics.EGAAdAction[ad_action], gameanalytics.EGAAdType[ad_type], ad_sdk_name, ad_placement);
    }
};

if (is_game_analytics) {
    gameanalytics.GameAnalytics.addOnBeforeUnloadListener({
        onBeforeUnload: () => {
            const page_name = window.c3_callFunction("page_name");
            gameanalytics.GameAnalytics.addDesignEvent(`closed_game:${page_name}`);
        }
    });
}

export const load_ad = (_ad_format, _ad_reward_state = -1) => {
    ad_format = _ad_format;
    ad_reward_state = _ad_reward_state;
    if (ad_format === "interstitial") {
        if (!is_loaded_interstitial_ad) {
            switch (platform_ad) {
                case "Facebook":
                    FBInstant.getInterstitialAdAsync(FB_AD_PLACEMENT_ID)
                    .then((interstitial) => {
                        interst_ad = interstitial;
                        return interst_ad.loadAsync();
                    }).then(() => {
                        is_loaded_interstitial_ad = true;
                    }).catch(() => {
                        is_loaded_interstitial_ad = false;
                    });
                    break;
                case "Huawei":
                    interst_ad = ppsads.createInterstitialAd({
                        slotId: "testb4znbuh3n2"
                    });
                    interst_ad.load();
                    interst_ad.onLoad(() => {
                        is_loaded_interstitial_ad = true;
                    });
                    interst_ad.onError(() => {
                        is_loaded_interstitial_ad = false;
                    });
                    break;
                case "Azerion":
                    if (typeof gdsdk !== 'undefined' && typeof gdsdk.preloadAd !== 'undefined') {
                        gdsdk
                        .preloadAd('interstitial')
                        .then(() => {
                            is_loaded_interstitial_ad = true;
                        })
                        .catch(() => {
                            is_loaded_interstitial_ad = false;
                        });
                    }
                    break;
            }
        }
    } else {
        if (!is_loaded_rewarded_ad) {
            switch (platform_ad) {
                case "Facebook":
                    FBInstant.getRewardedVideoAsync(FB_AD_PLACEMENT_ID)
                    .then((rewardedVideo) => {
                        reward_ad = rewardedVideo;
                        return reward_ad.loadAsync();
                    }).then(() => {
                        is_loaded_rewarded_ad = true;
                    }).catch(() => {
                        is_loaded_rewarded_ad = false;
                    });
                    break;
                case "Huawei":
                    reward_ad = ppsads.createRewardAd({
                        slotId: "testx9dtjw8hp"
                    });
                    reward_ad.load(() => {});
                    reward_ad.onLoad(() => {
                        is_loaded_rewarded_ad = true;
                    });
                    reward_ad.onError(() => {
                        is_loaded_rewarded_ad = false;
                    });
                    break;
                case "Azerion":
                    if (typeof gdsdk !== 'undefined' && typeof gdsdk.preloadAd !== 'undefined') {
                        gdsdk
                        .preloadAd('rewarded')
                        .then(() => {
                            is_loaded_rewarded_ad = true;
                        })
                        .catch(() => {
                            is_loaded_rewarded_ad = false;
                        });
                    }
                    break;
            }
        }
    }
};

export const show_ad = (_ad_format, _ad_reward_state = -1) => {
    ad_format = _ad_format;
    ad_reward_state = _ad_reward_state;
    if (ad_format === "interstitial") ad_event_GA("Clicked", "Interstitial", platform_ad.toLowerCase(), ad_placement);
    else if (ad_format === "rewarded") ad_event_GA("Clicked", "RewardedVideo", platform_ad.toLowerCase(), ad_placement);

    switch (platform_ad) {
        case "Azerion":
            if (_ad_format === "start_session") ad_format = "interstitial";
            if (typeof gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined') {
                is_done_ad = true;
                gdsdk.showAd(ad_format);
            } else {
                tracking_ad_status = "skipped";
            }
            break;
        case "Glance":
            if (_ad_format === "start_session") ad_format = "interstitial";
            if (ad_format === "interstitial") {
                tracking_ad_status = "skipped";
            } else if (ad_format === "rewarded") {
                window.rewardEvent();
            }
            break;
        case "Lagged":
            if (_ad_format === "start_session") ad_format = "interstitial";
            if (ad_format === "interstitial") {
                tracking_ad_status = "started";
                LaggedAPI.APIAds.show(() => {
                    tracking_ad_status = "skipped";
                    ad_event_GA("Show", "Interstitial", platform_ad.toLowerCase(), ad_placement);
                },
                (error) => {
                    tracking_ad_status = "skipped";
                    ad_event_GA("FailedShow", "Interstitial", platform_ad.toLowerCase(), ad_placement);
                });
            } else if (ad_format === "rewarded") {
                LaggedAPI.GEvents.reward(
                    (success, showAdFn) => {
                        if (success) {
                            tracking_ad_status = "started";
                            ad_event_GA("Show", "RewardedVideo", platform_ad.toLowerCase(), ad_placement);
                            showAdFn();
                        } else {
                            ad_event_GA("FailedShow", "RewardedVideo", platform_ad.toLowerCase(), ad_placement);
                            tracking_ad_status = "error";
                        }
                    },
                    success => {
                        tracking_ad_status = success ? "completed" : "skipped";
                    }
                );
            }
            break;
        case "LudiGames":
            window.playAds();
            window.addEventListener("gl_ads_state_change", ({ detail }) => {
                if (detail.newState === window.AdsState.STARTED) {
                    tracking_ad_status = "started";
                } else if (detail.newState === window.AdsState.COMPLETE) {
                    tracking_ad_status = "completed";
                }
            });
            break;
        case "PlayDeck":
            parent.postMessage({ playdeck: { method: "showAd" } }, '*');
            break;
        case "Poki":
            if (window.PokiSDK) {
                if (_ad_format === "start_session") ad_format = "interstitial";
                if (ad_format === "interstitial") {
                    PokiSDK.commercialBreak(() => {
                        tracking_ad_status = "started";
                    }).then(() => tracking_ad_status = "skipped");
                } else if (ad_format === "rewarded") {
                    if (gameplay_status_global === "start") PokiSDK.gameplayStop();
                    PokiSDK.rewardedBreak(() => {
                        tracking_ad_status = "started";
                    }).then(withReward => {
                        tracking_ad_status = withReward ? "completed" : "skipped";
                    });
                }
            }
            break;
        case "Gopay":
            switch (ad_format) {
                case "start_session":
                    ad_format = "interstitial";
                    tracking_ad_status = "skipped";
                    break;
                case "interstitial":
                    window.adBreak({
                        type: "start",
                        name: "my_interstitial",
                        beforeAd: (result_ad) => {
                            is_done_ad = false;
                            tracking_ad_status = "started";
                            ad_event_GA("Show", "Interstitial", platform_ad.toLowerCase(), ad_placement);
                        },
                        afterAd: () => {
                            tracking_ad_status = "skipped";
                        },
                        adBreakDone: (placementInfo) => {
                            if (placementInfo.breakStatus === "dismissed") {
                                tracking_ad_status = "skipped";
                            } else if (placementInfo.breakStatus !== "viewed") {
                                tracking_ad_status = "skipped";
                                ad_event_GA("FailedShow", "Interstitial", platform_ad.toLowerCase(), ad_placement);
                            } else {
                                tracking_ad_status = "skipped";
                            }
                        },
                    });
                    break;
                case "rewarded":
                    window.adBreak({
                        type: "reward",
                        name: "my_reward",
                        beforeAd: () => {
                            is_done_ad = false;
                            tracking_ad_status = "started";
                        },
                        afterAd: () => {
                            tracking_ad_status = "completed";
                        },
                        adDismissed: () => {},
                        adViewed: () => {
                            ad_event_GA("Show", "RewardedVideo", platform_ad.toLowerCase(), ad_placement);
                            tracking_ad_status = "started";
                        },
                        beforeReward: (showAdFn) => {
                            showAdFn();
                        },
                        adBreakDone: (placementInfo) => {
                            if (placementInfo.breakStatus === "dismissed") {
                                tracking_ad_status = "skipped";
                            } else if (placementInfo.breakStatus !== "viewed") {
                                tracking_ad_status = "error";
                                ad_event_GA("FailedShow", "RewardedVideo", platform_ad.toLowerCase(), ad_placement);
                                return;
                            } else {
                                tracking_ad_status = "completed";
                            }
                        },
                    });
                    break;
            }
            break;
        case "OldXiaomi":
            switch (ad_format) {
                case "start_session":
                    ad_format = "interstitial";
                    window.adBreak({
                        type: "preroll",
                        name: "my_interstitial",
                        beforeAd: () => {
                            is_done_ad = false;
                            tracking_ad_status = "started";
                            ad_event_GA("Show", "Interstitial", platform_ad.toLowerCase(), ad_placement);
                        },
                        adBreakDone: (placementInfo) => {
                            if (placementInfo.breakStatus === "dismissed") {
                                tracking_ad_status = "skipped";
                            } else if (placementInfo.breakStatus !== "viewed") {
                                tracking_ad_status = "skipped";
                                ad_event_GA("FailedShow", "Interstitial", platform_ad.toLowerCase(), ad_placement);
                            } else {
                                tracking_ad_status = "skipped";
                            }
                        },
                    });
                    break;
                case "interstitial":
                    window.adBreak({
                        type: "start",
                        name: "my_interstitial",
                        beforeAd: (result_ad) => {
                            is_done_ad = false;
                            tracking_ad_status = "started";
                            ad_event_GA("Show", "Interstitial", platform_ad.toLowerCase(), ad_placement);
                        },
                        afterAd: () => {
                            tracking_ad_status = "skipped";
                        },
                        adBreakDone: (placementInfo) => {
                            if (placementInfo.breakStatus === "dismissed") {
                                tracking_ad_status = "skipped";
                            } else if (placementInfo.breakStatus !== "viewed") {
                                tracking_ad_status = "skipped";
                                ad_event_GA("FailedShow", "Interstitial", platform_ad.toLowerCase(), ad_placement);
                            } else {
                                tracking_ad_status = "skipped";
                            }
                        },
                    });
                    break;
                case "rewarded":
                    window.adBreak({
                        type: "reward",
                        name: "my_reward",
                        beforeAd: () => {
                            is_done_ad = false;
                            tracking_ad_status = "started";
                        },
                        afterAd: () => {
                            tracking_ad_status = "completed";
                        },
                        adDismissed: () => {},
                        adViewed: () => {
                            ad_event_GA("Show", "RewardedVideo", platform_ad.toLowerCase(), ad_placement);
                            tracking_ad_status = "started";
                        },
                        beforeReward: (showAdFn) => {
                            showAdFn();
                        },
                        adBreakDone: (placementInfo) => {
                            if (placementInfo.breakStatus === "dismissed") {
                                tracking_ad_status = "skipped";
                            } else if (placementInfo.breakStatus !== "viewed") {
                                tracking_ad_status = "error";
                                ad_event_GA("FailedShow", "RewardedVideo", platform_ad.toLowerCase(), ad_placement);
                                return;
                            } else {
                                tracking_ad_status = "completed";
                            }
                        },
                    });
                    break;
            }
            break;
        case "Xiaomi":
            switch (ad_format) {
                case "interstitial":
                    if (window.MiGames !== undefined && window.MiGames.SDK !== undefined) {
                        window.MiGames.SDK.ad.requestAd(
                        'start',
                        {
                            beforeAd: () => {
                                is_done_ad = false;
                                tracking_ad_status = "started";
                                ad_event_GA("Show", "Interstitial", platform_ad.toLowerCase(), ad_placement);
                            },
                            afterAd: () => {},
                            adBreakDone: ({ breakStatus }) => {
                                tracking_ad_status = "skipped";
                                if (breakStatus !== "viewed") {
                                    ad_event_GA("FailedShow", "Interstitial", platform_ad.toLowerCase(), ad_placement);
                                }
                            },
                        }
                        );
                    } else {
                        tracking_ad_status = "skipped";
                    }
                    break;
                case "rewarded":
                    if (window.MiGames !== undefined && window.MiGames.SDK !== undefined) {
                        window.MiGames.SDK.ad.requestAd(
                        'reward',
                        {
                            beforeAd: () => {
                                is_done_ad = false;
                                tracking_ad_status = "started";
                            },
                            afterAd: () => {},
                            adBreakDone: ({ breakStatus }) => {
                                if (breakStatus === 'viewed') {
                                    tracking_ad_status = "completed";
                                    ad_event_GA("Show", "RewardedVideo", platform_ad.toLowerCase(), ad_placement);
                                } else if (breakStatus === 'dismissed') {
                                    tracking_ad_status = "error";
                                    ad_event_GA("FailedShow", "RewardedVideo", platform_ad.toLowerCase(), ad_placement);
                                } else {
                                    tracking_ad_status = "error";
                                    ad_event_GA("FailedShow", "RewardedVideo", platform_ad.toLowerCase(), ad_placement);
                                }
                            }
                        }
                        );
                    } else {
                        tracking_ad_status = "error";
                    }
                    break;
            }
            break;
        case "Yandex":
            switch (ad_format) {
                case "interstitial":
                    ysdk.adv.showFullscreenAdv({
                        callbacks: {
                            onOpen: () => {
                                tracking_ad_status = "started";
                            },
                            onClose: (wasShown) => {
                                tracking_ad_status = "skipped";
                            },
                            onError: (error) => {
                                tracking_ad_status = "skipped";
                            }
                        }
                    });
                    break;
                case "rewarded":
                    ysdk.adv.showRewardedVideo({
                        callbacks: {
                            onOpen: () => {
                                tracking_ad_status = "started";
                            },
                            onRewarded: () => {
                                is_grant_reward = true;
                            },
                            onClose: () => {
                                if (is_grant_reward === true) {
                                    tracking_ad_status = "completed";
                                    is_grant_reward = false;
                                } else {
                                    tracking_ad_status = "skipped";
                                }
                            },
                            onError: (e) => {
                                tracking_ad_status = "error";
                            }
                        }
                    });
                    break;
            }
            break;
        case "Facebook":
            switch (ad_format) {
                case "interstitial":
                    tracking_ad_status = "started";
                    interst_ad.showAsync()
                    .then(() => {
                        tracking_ad_status = "skipped";
                        is_loaded_interstitial_ad = false;
                        load_ad("interstitial");
                    })
                    .catch((error) => {
                        console.error('Ad error:', error);
                        tracking_ad_status = "skipped";
                        is_loaded_interstitial_ad = false;
                        load_ad("interstitial");
                    });
                    break;
                case "rewarded":
                    tracking_ad_status = "started";
                    reward_ad.showAsync()
                    .then(() => {
                        tracking_ad_status = "completed";
                        is_loaded_rewarded_ad = false;
                        load_ad("rewarded");
                    })
                    .catch((error) => {
                        console.error('Ad error:', error);
                        tracking_ad_status = "error";
                        is_loaded_rewarded_ad = false;
                        load_ad("rewarded");
                    });
                    break;
            }
            break;
        case "Huawei":
            switch (ad_format) {
                case "interstitial":
                    interst_ad.show(() => {});
                    interst_ad.onShow((e_ads) => {});
                    interst_ad.onClose(() => {
                        interst_ad.destroy();
                        tracking_ad_status = "skipped";
                        is_loaded_interstitial_ad = false;
                        load_ad("interstitial");
                    });
                    break;
                case "rewarded":
                    reward_ad.show({
                        callbacks: {
                            onShow: () => {
                                tracking_ad_status = "started";
                            },
                            onReward: (rewardData) => {
                                is_grant_reward = true;
                            },
                            onComplete: () => {},
                            onClose: () => {
                                if (is_grant_reward) {
                                    tracking_ad_status = "completed";
                                    is_grant_reward = false;
                                } else {
                                    tracking_ad_status = "skipped";
                                }
                                reward_ad.destroy();
                            },
                            onError: (err) => {
                                tracking_ad_status = "error";
                                console.error("Error saat tampilkan iklan:", err);
                            }
                        }
                    });
                    break;
            }
            break;
        case "CrazyGames":
            switch (ad_format) {
                case "interstitial":
                    const cg_interstitial_callbacks = {
                        adFinished: () => {
                            tracking_ad_status = "skipped";
                        },
                        adError: (error) => {
                            tracking_ad_status = "skipped";
                        },
                        adStarted: () => {
                            tracking_ad_status = "started";
                        },
                    };
                    window.CrazyGames.SDK.ad.requestAd("midgame", cg_interstitial_callbacks);
                    break;
                case "rewarded":
                    const cg_rewarded_callbacks = {
                        adFinished: () => {
                            tracking_ad_status = "completed";
                        },
                        adError: (error) => {
                            tracking_ad_status = "error";
                        },
                        adStarted: () => {
                            tracking_ad_status = "started";
                        },
                    };
                    window.CrazyGames.SDK.ad.requestAd("rewarded", cg_rewarded_callbacks);
                    break;
            }
            break;
    }
};
