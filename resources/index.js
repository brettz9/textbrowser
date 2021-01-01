/* eslint-env browser */
import {getJSON} from 'simple-get-json';
import {IMF} from 'intl-dom';
import loadStylesheets from 'load-stylesheets';
import {serialize as formSerialize} from 'form-serialization';

import getIMFFallbackResults from './utils/getIMFFallbackResults.js';
import {dialogs} from './utils/dialogs.js';
import {getFieldNameAndValueAliases, getBrowseFieldData} from './utils/Metadata.js';
import {getWorkFiles, getWorkData} from './utils/WorkInfo.js';
import {
  respondToState, listenForWorkerUpdate, registerServiceWorker, setServiceWorkerDefaults
} from './utils/ServiceWorker.js';

import {escapeHTML} from './utils/sanitize.js';
import {Languages} from './utils/Languages.js';

import Templates from './templates/index.js';
import IntlURLSearchParams from './utils/IntlURLSearchParams.js';
import workSelect from './workSelect.js';
import workDisplay from './workDisplay.js';
import {resultsDisplayClient} from './resultsDisplay.js';

/* eslint-disable no-unused-vars */
/**
 *
 * @param {null|number|string|PlainObject|GenericArray} obj
 * @returns {void}
 */
function s (obj) { dialogs.alert(JSON.stringify(obj)); } // lgtm [js/unused-local-variable]
/* eslint-enable no-unused-vars */

/**
 *
 * @returns {Promise<void>}
 */
async function prepareForServiceWorker () {
  try {
    // Todo: No possible resolving after this point? (except
    //          to reload or if worker somehow active already)
    Templates.permissions.addLogEntry({
      text: 'Worker registration: Beginning...'
    });
    const persistent = await navigator.storage.persist();
    if (!persistent) {
      Templates.permissions.browserNotGrantingPersistence();
      return;
    }
    /*
        Templates.permissions.addLogEntry({
            text: 'Install: received work files'
        });
        */
    await registerServiceWorker({
      serviceWorkerPath: this.serviceWorkerPath,
      logger: Templates.permissions
    });
  } catch (err) {
    console.log('err', err);
    if (err && typeof err === 'object') {
      const {errorType} = err;
      if (errorType === 'versionChange') {
        Templates.permissions.versionChange();
        return;
      }
    }
    Templates.permissions.errorRegistering(
      escapeHTML(err && err.message)
    );
  }
}

/**
* @typedef {PlainObject} Langs
* @property {string} code
* @property {string} direction
* @property {PlainObject} locale
*/

/**
 *
 * @param {Langs} langs
 * @param {Logger} l
 * @returns {Promise<void>}
 */
async function requestPermissions (langs, l) {
  await new Promise((resolve, reject) => {
    // Todo: We could run the dialog code below for every page if
    //    `Notification.permission === 'default'` (i.e., not choice
    //    yet made by user), but user may avoid denying with intent
    //    of seeing how it goes. But for users who come directly to
    //    the work or results page, the slow performance will be
    //    unexplained so probably better to force a decision.
    const ok = async () => {
      // Notification request to be directly in response to user action for Chrome
      const permissionStatus = await Notification.requestPermission();
      requestPermissionsDialog.close(permissionStatus);
    };
    const refuse = () => {
      requestPermissionsDialog.close();
    };
    const closeBrowserNotGranting = (e) => {
      browserNotGrantingPersistenceAlert.close();
    };
    const close = async () => {
      /**
             *
             * @returns {void}
             */
      function rememberRefusal () {
        // Todo: We could go forward with worker, caching files, and
        //    indexedDB regardless of permissions, but this way
        //    we can continue to gauge performance differences for now
        localStorage.setItem(
          this.namespace + '-refused',
          'true'
        );
      }
      try {
        if (!requestPermissionsDialog.returnValue) {
          rememberRefusal();
          return;
        }
      } catch (err) {
        console.log('err', err);
        Templates.permissions.errorRegistering(
          escapeHTML(err && err.message)
        );
      }

      // denied|default|granted
      switch (requestPermissionsDialog.returnValue) {
      case 'denied':
        // User may not want notifications but may look into another way
        //   to persist (e.g., adding to bookmark), so we don't remember
        //   the refusal unless they refuse in *our* dialog
        // rememberRefusal();
        resolve();
        return;
        // eslint-disable-next-line sonarjs/no-duplicated-branches
      case 'default':
        resolve();
        return;
      case 'granted':
        if (navigator.serviceWorker.controller) {
          resolve();
          return;
        }
        // Has own error-handling
        await prepareForServiceWorker.call(this);
        break;
      default:
        console.error('Unexpected returnValue', requestPermissionsDialog.returnValue);
        break;
      }
    };
    const [, requestPermissionsDialog, browserNotGrantingPersistenceAlert] = // , errorRegisteringNotice
            Templates.permissions.main({
              l, ok, refuse, close, closeBrowserNotGranting
            });
    requestPermissionsDialog.showModal();
  });
}

class TextBrowser {
  constructor (options) {
    // Todo: Replace the `languages` default with `import.meta.url`
    //  (`new URL('../appdata/languages.json', import.meta.url).href`?)
    //  https://github.com/tc39/proposal-import-meta
    const moduleURL = new URL('node_modules/textbrowser/resources/index.js', location);
    this.site = options.site || 'site.json';
    const stylesheets = options.stylesheets || ['@builtin'];
    const builtinIndex = stylesheets.indexOf('@builtin');
    if (builtinIndex !== -1) {
      stylesheets.splice(
        builtinIndex,
        1,
        new URL('index.css', moduleURL).href,
        new URL('../../dialog-polyfill/dist/dialog-polyfill.css', moduleURL).href
      );
    }
    this.stylesheets = stylesheets;

    setServiceWorkerDefaults(this, options);

    this.allowPlugins = options.allowPlugins;
    this.dynamicBasePath = options.dynamicBasePath;
    this.trustFormatHTML = options.trustFormatHTML;
    this.requestPersistentStorage = options.requestPersistentStorage;
    this.localizeParamNames = options.localizeParamNames === undefined
      ? true
      : options.localizeParamNames;
    this.hideFormattingSection = Boolean(options.hideFormattingSection);
    this.interlinearSeparator = options.interlinearSeparator;
    // Todo: Make these user facing options
    this.showEmptyInterlinear = options.showEmptyInterlinear;
    this.showTitleOnSingleInterlinear = options.showTitleOnSingleInterlinear;
    this.noDynamic = options.noDynamic;
    this.skipIndexedDB = options.skipIndexedDB;
  }

  async init () {
    this._stylesheetElements = await loadStylesheets(this.stylesheets);
    return this.displayLanguages();
  }

  async displayLanguages () {
    // We use getJSON instead of JsonRefs as we do not need to resolve the locales here
    try {
      const [langData, siteData] = await getJSON([this.languages, this.site]);
      this.langData = langData;
      this.siteData = siteData;

      const p = this.paramChange();

      // INIT/ADD EVENTS
      // With `hashchange` more generic than `popstate`, we use it
      //  and just check `history.state`
      window.addEventListener('hashchange', () => this.paramChange());

      return p;
    } catch (err) {
      console.log('err', err);
      dialogs.alert(err);
    }
  }

  getWorkData (opts) {
    try {
      return getWorkData.call(this, {
        ...opts,
        files: this.files,
        allowPlugins: this.allowPlugins
      });
    } catch (err) {
      console.log('err', err);
      dialogs.alert('catch:' + err);
    }
  }

  // Need for directionality even if language specified (and we don't want
  //   to require it as a param)
  // Todo: Use rtl-detect (already included)
  getDirectionForLanguageCode (code) {
    const langs = this.langData.languages;
    const exactMatch = langs.find((lang) => {
      return lang.code === code;
    });
    return (exactMatch && exactMatch.direction) ||
            langs.find((lang) => {
              return lang.code.startsWith(code + '-');
            });
  }

  getFieldNameAndValueAliases (args) {
    return getFieldNameAndValueAliases({...args, lang: this.lang});
  }

  getBrowseFieldData (args) {
    return getBrowseFieldData({...args, lang: this.lang});
  }

  async paramChange () {
    Templates.defaultBody();

    // Todo: Could give option to i18nize 'lang' or omit
    const $p = this.$p = typeof history.state === 'string'
      ? new IntlURLSearchParams({params: history.state})
      : new IntlURLSearchParams(); // Uses URL hash for params

    const followParams = (formSelector, cb) => {
      const form = document.querySelector(formSelector);
      // Record current URL along with state
      const url = location.href.replace(/#.*$/, '') + '#' + $p.toString();
      history.replaceState(formSerialize(form, {hash: true, empty: true}), document.title, url);
      // Get and set new state within URL
      // eslint-disable-next-line node/callback-return
      cb();
      location.hash = '#' + $p.toString();
    };

    const languages = new Languages({
      langData: this.langData
    });

    const {
      lang, langs, languageParam, fallbackLanguages
    } = languages.getLanguageInfo({$p});
    this.lang = lang;

    const [preferredLocale] = lang;
    const direction = this.getDirectionForLanguageCode(preferredLocale);
    document.documentElement.lang = preferredLocale;
    document.dir = direction;

    const getSiteI18n = () => {
      const localeFromSiteData = (lan) => {
        return this.siteData['localization-strings'][lan];
      };
      const imfSite = IMF({
        locales: lang.map(localeFromSiteData),
        fallbackLocales: fallbackLanguages.map(localeFromSiteData)
      });
      return imfSite.getFormatter();
    };

    const siteI18n = getSiteI18n();
    // Even if individual pages may end up changing, we need a
    //   title now for accessibility
    document.title = siteI18n('browser-title');

    const refusedIndexedDB =
            // User may have persistence via bookmarks, etc. but just not
            //     want commital on notification
            // Notification.permission === 'default' ||
            // We always expect a controller, so is probably first visit
            localStorage.getItem(this.namespace + '-refused');

    // This check goes further than `Notification.permission === 'granted'`
    //   to see whether the browser actually considers the notification
    //   sufficient to grant persistence (as it is supposed to do).

    // Todo: For now, we won't give opportunity to store offline on
    //    results page. We could add a small button to open a dialog,
    //    but then it'd show up in each results window, making it less
    //    embed-friendly. Probably best to implement
    //    navigation bar/breadcrumbs, with option on work display page on
    //    whether to show or not; also ensure we have navigation
    //    bar/breadcrumbs on all non-results pages
    const persistent = await navigator.storage.persisted();

    const r = await navigator.serviceWorker.getRegistration(this.serviceWorkerPath);

    const result = $p.get('result');
    const register = async () => {
      /*
            console.log(
                'navigator.serviceWorker.controller',
                navigator.serviceWorker.controller
            );
            */
      if (result) {
        return;
      }

      const tryRegistrationOrPersistence = !refusedIndexedDB && // Not show if refused before
                (!navigator.serviceWorker.controller || // This is `null` on a force-refresh too
                    !persistent);

      if (tryRegistrationOrPersistence) {
        // Note: In Chrome on 127.0.0.1 (but not localhost!),
        //        this always appears to be `true`, despite having
        //        no notifications enabled or bookmarking 127.0.0.1,
        //        or being on the main page per
        //        https://developers.google.com/web/updates/2016/06/persistent-storage
        if (persistent) {
          // No need to ask permissions (e.g., if user bookmarked site instead),
          //   but we do need a worker
          Templates.permissions.main({l: siteI18n});
          await prepareForServiceWorker.call(this);
        } else { // Keep asking if not persistent (unless refused)
          await requestPermissions.call(this, langs, siteI18n);
        }
        Templates.permissions.exitDialogs();
      }
    };

    /*
        try {
            // Waits indefinitely without rejecting until active worker
            const {active} = await navigator.serviceWorker.ready;
        } catch (err) {
        }
        */
    /*
        // Present normally if activated, but will be `null` if force-reload
        const {controller} = navigator.serviceWorker;
        */

    if (!r) {
      await register();
    } else {
      const worker = r.installing || r.waiting || r.active;
      if (!worker) {
        // Todo: Why wouldn't there be a worker here?
        console.error('Unexpected error: worker registration received without a worker.');
        // If anything, would probably need to register though
        await register();
        return;
      }

      Templates.permissions.main({l: siteI18n});

      // "The browser checks for updates automatically after navigations and
      //  functional events, but you can also trigger them manually"
      //  -- https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#manual_updates
      const hourly = 60 * 60 * 1000;
      setInterval(() => {
        r.update();
      }, hourly);

      console.log('worker.state', worker.state);
      const respondToStateOfWorker = async () => {
        try {
          return respondToState({
            r, langs,
            languages: this.languages,
            logger: Templates.permissions
          });
        } catch (err) {
          console.log('err', err);
          // Todo: We could auto-reload if we tracked whether this
          //   error occurs immediately upon attempting registration or
          //   not, but probably would occur after some time
          return dialogs.alert(`
        There was an unexpected error activating the new version;
        please save any unfinished work, close this tab, and try
        opening this site again.

        Please contact a service administrator if the problem
        persists (Error type: worker activation).
        `);
        }
      };

      switch (worker.state) {
      case 'installing':
        // If it fails, will instead be `redundant`; but will try again:
        //     1. automatically (?) per https://developers.google.com/web/fundamentals/primers/service-workers/#the_service_worker_life_cycle
        //     2. upon reattempting registration (?) per https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
        // Supply file paths in case not completed and no
        //    other tabs open to do so (assuming this is possible)
        // Will use `r.installing`
        // We don't await the fulfillment of this promise
        respondToStateOfWorker();
        listenForWorkerUpdate({
          r,
          logger: {
            addLogEntry (s) {
              // We don't put the log in the page as user using
              console.log(s);
            }
          }
        });
        // Don't return as user may continue working until installed (though
        //    will get message to close tab)
        break;
      case 'installed':
        // Waiting ensures only one version of our service worker active
        // No dedicated "waiting" state so handle here
        // Will use `r.waiting`
        // Show dialog that currently waiting for old tabs (and
        //         this one) to close so install can proceed
        // Wait for activation to begin and then push as in activating
        await respondToStateOfWorker();
        break;
        // Now fetching will be beyond first service worker and not yet with first
      case 'activating': // May be called more than once in case fails?
        // May not be activated but only activating so pass in
        //   callback in case no other tabs open to do so (assuming
        //   this is possible)
        // Will use `r.active`
        await dialogs.alert(`
    Please wait for a short while as we work to update to a new version.
    `);
        respondToStateOfWorker();
        navigator.serviceWorker.onmessage({data: 'finishActivate'});
        // finishActivate({r, logger, namespace, files});
        return;
      case 'activated':
        // Will use `r.active`
        // We should be able to use the following to distinguish when
        //    active but force-reloaded (will be `null` unlike `r.active` apparently)
        // const {controller} = navigator.serviceWorker;
        // Todo: Prevent from getting here as we should handle this differently
        // May need to pass in arguments if new service worker appears and
        //    it needs arguments for update
        listenForWorkerUpdate({
          r,
          logger: {
            addLogEntry (s) {
              // We don't put the log in the page as user using
              console.log(s);
            }
          }
        });
        break;
      case 'redundant':
        // Either:
        // 1. A new service worker is replacing the current service worker (though
        //    presumably only if `skipWaiting`)
        // 2. The current service worker is being discarded due to an install failure
        // May have been `r.installing` (?)
        // Todo: Could try registering again later (this will reload after an alert)
        await respondToStateOfWorker();
        return;
      default:
        console.log('Unexpected worker.state', worker.state);
        break;
      }
    }

    Templates.permissions.exitDialogs();
    if (!languageParam) {
      // Also could use l('chooselanguage'), but assumes locale
      //   as with page title
      $p.l10n = siteI18n; // Is this in use?
      document.title = siteI18n('languages-title');
      Templates.languageSelect.main({
        langs, languages, followParams, $p
      });
      return;
    }

    const localeCallback = (l /* defineFormatter */) => {
      this.l10n = l;
      $p.l10n = l;

      const work = $p.get('work');
      if (!work) {
        workSelect({
          // l,
          files: this.files,
          lang, fallbackLanguages,
          $p, followParams
        });
        return true;
      }
      if (!result) {
        this.workDisplay({
          l,
          lang, preferredLocale,
          fallbackLanguages,
          languageParam,
          $p, languages
        });
        return true;
      }
      return false;
    };
    return getIMFFallbackResults({
      $p,
      lang, langs,
      langData: this.langData,
      fallbackLanguages,
      resultsDisplay: (opts) => {
        const noIndexedDB = refusedIndexedDB ||
                    !navigator.serviceWorker.controller; // No worker from which IndexedDB is available;
        return this.resultsDisplayClient({
          langData: this.langData,
          ...opts,
          noIndexedDB,
          dynamicBasePath: this.dynamicBasePath,
          files: this.files,
          allowPlugins: this.allowPlugins
        });
      },
      localeCallback
    });
  }
}

// Todo: Definable as public fields?
TextBrowser.prototype.workDisplay = workDisplay;
TextBrowser.prototype.resultsDisplayClient = resultsDisplayClient;
TextBrowser.prototype.getWorkFiles = getWorkFiles;

export default TextBrowser;
