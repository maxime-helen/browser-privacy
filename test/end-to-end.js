/* eslint-disable no-plusplus, no-restricted-syntax */

import expect from 'expect';
import playwright from 'playwright';
import express from 'express';
import { join } from 'path';

const IDS = {
  COOKIE: {
    VALUE: {
      CURRENT: '#cookie_value',
    },
    INPUT: {
      SET: '#cookie_input_add_value',
    },
    CTA: {
      SET: '#cookie_add',
      CLEAR: '#cookie_clear',
    },
  },
  LOCALSTORAGE: {
    VALUE: {
      CURRENT: '#local_storage_value',
      GET_ITEM: '#local_storage_get_item_value',
      GET_KEY: '#local_storage_key_value',
    },
    INPUT: {
      GET_ITEM: '#local_storage_get_item_key',
      ADD_ITEM_KEY: '#local_storage_add_item_key',
      ADD_ITEM_VALUE: '#local_storage_add_item_value',
      SET_ITEM_KEY: '#local_storage_set_key',
      SET_ITEM_VALUE: '#local_storage_set_value',
      REMOVE: '#local_storage_remove_key',
      DELETE: '#local_storage_delete_key',
      GET_KEY: '#local_storage_get_key_index_value',
    },
    CTA: {
      GET_ITEM: '#local_storage_get_item',
      ADD_ITEM: '#local_storage_add_item',
      SET: '#local_storage_set',
      REMOVE: '#local_storage_remove',
      DELETE: '#local_storage_delete',
      GET_KEY: '#local_storage_get_key',
      CLEAR: '#local_storage_clear',
    },
  },
  XHR: {
    INPUT: {
      GET: '#xhr_url',
    },
    CTA: {
      GET: '#xhr_request',
    },
  },
  FETCH: {
    INPUT: {
      GET: '#fetch_url',
    },
    CTA: {
      GET: '#fetch_request',
    },
  },
  WEBSOCKET: {
    INPUT: {
      CONNECT: '#websocket_url',
    },
    CTA: {
      CONNECT: '#websocket_connect',
    },
  },
  BROWSERPRIVACY: {
    INPUT: {
      COOKIE: '#browser_privacy_cookie_whitelist',
      LOCALSTORAGE: '#browser_privacy_local_storage_whitelist',
      CATEGORIES: '#browser_privacy_trackers_categories',
      COMPANIES: '#browser_privacy_trackers_companies',
      HOSTNAMES: '#browser_privacy_trackers_hostnames',
    },
    CTA: {
      START: '#browser_privacy_start',
      STOP: '#browser_privacy_stop',
    },
  },
};

const sleep = (time = 200) => new Promise((resolve) => setTimeout(resolve, time));

const clearInput = (page, selector) => page.evaluate((id) => {
  document.querySelector(id).value = '';
}, selector);

const addCookie = async (page, value, expectedValue) => {
  await page.type(IDS.COOKIE.INPUT.SET, value);
  await page.click(IDS.COOKIE.CTA.SET);
  await sleep(200);
  const currentCookie = await page.innerText(IDS.COOKIE.VALUE.CURRENT);
  expect(currentCookie).toEqual(expectedValue);
  await clearInput(page, IDS.COOKIE.INPUT.SET);
};

const clearCookie = async (page) => {
  await page.click(IDS.COOKIE.CTA.CLEAR);
  await sleep(200);
  const currentCookie = await page.innerText(IDS.COOKIE.VALUE.CURRENT);
  expect(currentCookie).toEqual('');
};

const addLSItem = async (page, key, value, expectedLocalStorage) => {
  await page.type(IDS.LOCALSTORAGE.INPUT.ADD_ITEM_KEY, key);
  await page.type(IDS.LOCALSTORAGE.INPUT.ADD_ITEM_VALUE, value);
  await page.click(IDS.LOCALSTORAGE.CTA.ADD_ITEM);
  await sleep(200);
  const currentLocalstorage = JSON.parse(await page.innerText(IDS.LOCALSTORAGE.VALUE.CURRENT));
  expect(currentLocalstorage).toEqual(expectedLocalStorage);
  await clearInput(page, IDS.LOCALSTORAGE.INPUT.ADD_ITEM_KEY);
  await clearInput(page, IDS.LOCALSTORAGE.INPUT.ADD_ITEM_VALUE);
};

const getLSItem = async (page, key, expectedValue) => {
  await page.type(IDS.LOCALSTORAGE.INPUT.GET_ITEM, key);
  await page.click(IDS.LOCALSTORAGE.CTA.GET_ITEM);
  const item = await page.innerText(IDS.LOCALSTORAGE.VALUE.GET_ITEM);
  expect(item).toEqual(expectedValue);
  await clearInput(page, IDS.LOCALSTORAGE.INPUT.GET_ITEM);
};

const setLSItem = async (page, key, value, expectedLocalStorage) => {
  await page.type(IDS.LOCALSTORAGE.INPUT.SET_ITEM_KEY, key);
  await page.type(IDS.LOCALSTORAGE.INPUT.SET_ITEM_VALUE, value);
  await page.click(IDS.LOCALSTORAGE.CTA.SET);
  await sleep(200);
  const currentLocalstorage = JSON.parse(await page.innerText(IDS.LOCALSTORAGE.VALUE.CURRENT));
  expect(currentLocalstorage).toEqual(expectedLocalStorage);
  await clearInput(page, IDS.LOCALSTORAGE.INPUT.SET_ITEM_KEY);
  await clearInput(page, IDS.LOCALSTORAGE.INPUT.SET_ITEM_VALUE);
};

const getLSKey = async (page, index, expectedKey) => {
  await page.type(IDS.LOCALSTORAGE.INPUT.GET_KEY, index.toString());
  await page.click(IDS.LOCALSTORAGE.CTA.GET_KEY);
  const key = await page.innerText(IDS.LOCALSTORAGE.VALUE.GET_KEY);
  expect(key).toEqual(expectedKey);
  await clearInput(page, IDS.LOCALSTORAGE.INPUT.GET_KEY);
};

const removeLS = async (page, key, expectedLocalStorage) => {
  await page.type(IDS.LOCALSTORAGE.INPUT.REMOVE, key);
  await page.click(IDS.LOCALSTORAGE.CTA.REMOVE);
  await sleep(200);
  const currentLocalstorage = JSON.parse(await page.innerText(IDS.LOCALSTORAGE.VALUE.CURRENT));
  expect(currentLocalstorage).toEqual(expectedLocalStorage);
  await clearInput(page, IDS.LOCALSTORAGE.INPUT.REMOVE);
};

const deleteLS = async (page, key, expectedLocalStorage) => {
  await page.type(IDS.LOCALSTORAGE.INPUT.DELETE, key);
  await page.click(IDS.LOCALSTORAGE.CTA.DELETE);
  await sleep(200);
  const currentLocalstorage = JSON.parse(await page.innerText(IDS.LOCALSTORAGE.VALUE.CURRENT));
  expect(currentLocalstorage).toEqual(expectedLocalStorage);
  await clearInput(page, IDS.LOCALSTORAGE.INPUT.DELETE);
};

const clearLocalStorage = async (page) => {
  await page.click(IDS.LOCALSTORAGE.CTA.CLEAR);
  await sleep(200);
  const currentLocalstorage = JSON.parse(await page.innerText(IDS.LOCALSTORAGE.VALUE.CURRENT));
  expect(currentLocalstorage).toEqual({ length: 0 });
};

const getXHR = async (page, url, shouldBeFullfilled) => {
  await page.type(IDS.XHR.INPUT.GET, url);
  try {
    await Promise.all([
      page.waitForRequest((request) => request.url() === url, { timeout: 10000 }),
      page.click(IDS.XHR.CTA.GET),
    ]);
    await clearInput(page, IDS.XHR.INPUT.GET);
  } catch (err) {
    await clearInput(page, IDS.XHR.INPUT.GET);
    if (!shouldBeFullfilled && err.name === 'TimeoutError') {
      return;
    }
    throw err;
  }
};

const getFetch = async (page, url, shouldBeFullfilled) => {
  await page.type(IDS.FETCH.INPUT.GET, url);
  try {
    await Promise.all([
      page.waitForRequest((request) => request.url() === url, { timeout: 5000 }),
      page.click(IDS.FETCH.CTA.GET),
    ]);
    await clearInput(page, IDS.FETCH.INPUT.GET);
  } catch (err) {
    await clearInput(page, IDS.FETCH.INPUT.GET);
    if (!shouldBeFullfilled && err.name === 'TimeoutError') {
      return;
    }
    throw err;
  }
};

const connectWebsocket = async (/* page, url, shouldBeFullfilled */) => {
  // Websockets is not supported by playright yet https://github.com/microsoft/playwright/issues/2572
};

const start = async (page) => {
  await page.click(IDS.BROWSERPRIVACY.CTA.START);
};

const setCookieConfig = async (page, config) => {
  await page.type(IDS.BROWSERPRIVACY.INPUT.COOKIE, config);
};

const setLSConfig = async (page, config) => {
  await page.type(IDS.BROWSERPRIVACY.INPUT.LOCALSTORAGE, config);
};

const setCategoriesConfig = async (page, config) => {
  await page.type(IDS.BROWSERPRIVACY.INPUT.CATEGORIES, config);
};

const setCompaniesConfig = async (page, config) => {
  await page.type(IDS.BROWSERPRIVACY.INPUT.COMPANIES, config);
};

const setHostnamesConfig = async (page, config) => {
  await page.type(IDS.BROWSERPRIVACY.INPUT.COMPANIES, config);
};

const stop = async (page) => {
  await page.click(IDS.BROWSERPRIVACY.CTA.STOP);
};

const sanityCheck = async (page) => {
  /* COOKIE */
  const newCookie = 'foo=1';
  await addCookie(page, newCookie, newCookie);
  await clearCookie(page);

  /* LOCAL STORAGE */
  const firstKey = 'foo';
  const firstValue = 'abc';
  let expectedLocalStorage = { length: 1, [firstKey]: firstValue };
  await addLSItem(page, firstKey, firstValue, expectedLocalStorage);
  await getLSItem(page, firstKey, firstValue);
  const secondKey = 'bar';
  const secondValue = '123';
  expectedLocalStorage = { ...expectedLocalStorage, length: 2, [secondKey]: secondValue };
  await setLSItem(page, secondKey, secondValue, expectedLocalStorage);
  const keyIndex = 1;
  await getLSKey(page, keyIndex, secondKey);
  delete expectedLocalStorage[firstKey];
  expectedLocalStorage.length--;
  await removeLS(page, firstKey, expectedLocalStorage);
  delete expectedLocalStorage[secondKey];
  expectedLocalStorage.length--;
  await deleteLS(page, secondKey, expectedLocalStorage);
  await clearLocalStorage(page);

  /* XHR */
  await getXHR(page, 'https://envoy.com/', true);

  /* FETCH */
  await getFetch(page, 'https://aave.com/', true);

  /* WEBSOCKET */
  await connectWebsocket(page, 'wss://echo.websocket.org', true);
};

const PORT = 3000;
let app;
describe('End-to-end test suit', function () {
  this.timeout(5 * 60 * 1000);
  before('Serve fixtures', (done) => {
    app = express();
    app.use(express.static(join(__dirname, 'fixtures')));
    app.get('/browser-privacy', (req, res) => res.sendFile(join(__dirname, '../dist/browser-privacy.min.js')));
    app.listen(PORT, done);
  });
  after('Stop server', () => app.stop);

  for (const browserType of ['chromium', 'firefox', 'webkit']) {
    let page;
    let browser;
    beforeEach(`${browserType} - init page`, async () => {
      browser = await playwright[browserType].launch({ headless: false });
      const context = await browser.newContext();
      page = await context.newPage();
      await page.goto(`http://localhost:${PORT}/index.html`);
    });
    afterEach(`${browserType} - close page`, async () => {
      await browser.close();
    });
    it(`${browserType} - check page sanity`, () => sanityCheck(page));

    it(`${browserType} - Start browser privacy`, async () => {
      await setCookieConfig(page, '[]');
      await setLSConfig(page, '[]');
      await setCategoriesConfig(page, '[]');
      const newCookie = 'foo=1';
      await addCookie(page, newCookie, newCookie);
      await start(page);

      /* COOKIE */
      await addCookie(page, 'foo=2', '');
      await addCookie(page, 'bar=4', '');

      /* STOP AND CHECK IF GO BACK TO NORMAL */
      await stop(page);
      await setCookieConfig(page, '');
      await setLSConfig(page, '');
      await setCategoriesConfig(page, '');
      await sanityCheck(page);
    });
  }
});
