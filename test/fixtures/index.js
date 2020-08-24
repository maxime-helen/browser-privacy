/* eslint-disable  no-param-reassign, no-use-before-define */

/* Cookies */

const removeAllCookies = () => {
  document.cookie
    .split(';')
    .forEach((c) => {
      const newDate = `=;expires=${new Date().toUTCString()};path=/`;
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, newDate);
    });
};

const getCookieValue = function ({ detail, target }) {
  if (detail.checkChange() === 1) {
    detail.changed = true;
    // fire the event
    target.dispatchEvent(cookieEvent);
  } else {
    detail.changed = false;
  }
};

const cookieEvent = new CustomEvent('cookieChanged', {
  bubbles: true,
  detail: {
    cookieValue: '',
    checkChange: () => {
      if (cookieEvent.detail.cookieValue !== document.cookie) {
        cookieEvent.detail.cookieValue = document.cookie;
        return 1;
      }
      return 0;
    },
    listenCheckChange: () => {
      setInterval(() => getCookieValue(cookieEvent), 200);
    },
    changed: false,
  },
});

const setCookie = (value) => {
  document.getElementById('cookie_value').innerText = value;
};

window.addEventListener('DOMContentLoaded', (e) => {
  e.target.dispatchEvent(cookieEvent);
  document.getElementById('cookie_add')
    .addEventListener('click', () => {
      const newValue = document.getElementById('cookie_input_add_value').value;
      document.cookie = `${newValue}; `;
    });
  document
    .getElementById('cookie_clear')
    .addEventListener('click', () => {
      removeAllCookies();
    });
});

document.addEventListener('cookieChanged', (e) => {
  e.detail.listenCheckChange();
  if (e.detail.changed === true) {
    setCookie(e.detail.cookieValue);
  }
});

/* Local Storage */

const getLocalStorageValue = function ({ detail, target }) {
  if (detail.checkChange() === 1) {
    detail.changed = true;
    // fire the event
    target.dispatchEvent(localStorageEvent);
  } else {
    detail.changed = false;
  }
};

const formatLocalStorage = () => JSON.stringify({ length: localStorage.length, ...localStorage });

const localStorageEvent = new CustomEvent('localStorageChanged', {
  bubbles: true,
  detail: {
    localStorageValue: '',
    checkChange: () => {
      if (localStorageEvent.detail.localStorageValue !== formatLocalStorage(localStorage)) {
        localStorageEvent.detail.localStorageValue = formatLocalStorage(localStorage);
        return 1;
      }
      return 0;
    },
    listenCheckChange: () => {
      setInterval(() => getLocalStorageValue(localStorageEvent), 200);
    },
    changed: false,
  },
});

const setLocalStorage = (value) => {
  document.getElementById('local_storage_value').innerText = value;
};

window.addEventListener('DOMContentLoaded', (e) => {
  e.target.dispatchEvent(localStorageEvent);
  document.getElementById('local_storage_get_item')
    .addEventListener('click', () => {
      const key = document.getElementById('local_storage_get_item_key').value;
      document.getElementById('local_storage_get_item_value').innerText = localStorage.getItem(key);
    });
  document.getElementById('local_storage_add_item')
    .addEventListener('click', () => {
      const key = document.getElementById('local_storage_add_item_key').value;
      const { value } = document.getElementById('local_storage_add_item_value');
      localStorage.setItem(key, value);
    });
  document.getElementById('local_storage_set')
    .addEventListener('click', () => {
      const key = document.getElementById('local_storage_set_key').value;
      const { value } = document.getElementById('local_storage_set_value');
      localStorage[key] = value;
    });
  document.getElementById('local_storage_remove')
    .addEventListener('click', () => {
      const key = document.getElementById('local_storage_remove_key').value;
      localStorage.removeItem(key);
    });
  document.getElementById('local_storage_delete')
    .addEventListener('click', () => {
      const key = document.getElementById('local_storage_delete_key').value;
      delete localStorage[key];
    });
  document.getElementById('local_storage_get_key')
    .addEventListener('click', () => {
      const index = document.getElementById('local_storage_get_key_index_value').value;
      document.getElementById('local_storage_key_value').innerText = localStorage.key(index);
    });
  document.getElementById('local_storage_clear')
    .addEventListener('click', () => {
      localStorage.clear();
    });
});

document.addEventListener('localStorageChanged', (e) => {
  e.detail.listenCheckChange();
  if (e.detail.changed === true) {
    setLocalStorage(e.detail.localStorageValue);
  }
});

/* XHR */

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('xhr_request')
    .addEventListener('click', () => {
      const url = document.getElementById('xhr_url').value;
      const request = new XMLHttpRequest();
      request.open('GET', url);
      request.send();
    });
});

/* Fetch */

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('fetch_request')
    .addEventListener('click', () => {
      const url = document.getElementById('fetch_url').value;
      fetch(url);
    });
});

/* WebSockets */

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('websocket_connect')
    .addEventListener('click', () => {
      const url = document.getElementById('websocket_url').value;
      WebSocket(url);
    });
});

/* Browser Privacy */

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('browser_privacy_start')
    .addEventListener('click', () => {
      const cookieWhitelist = document.getElementById('browser_privacy_cookie_whitelist').value;
      const localStorageWhitelist = document.getElementById('browser_privacy_local_storage_whitelist').value;
      const trackerCategories = document.getElementById('browser_privacy_trackers_categories').value;
      const trackerCompanies = document.getElementById('browser_privacy_trackers_companies').value;
      const trackerHostnames = document.getElementById('browser_privacy_trackers_hostnames').value;
      const config = {};
      if (cookieWhitelist) {
        config.cookies = { whitelist: JSON.parse(cookieWhitelist) };
      }
      if (localStorageWhitelist) {
        config.localStorage = { whitelist: JSON.parse(localStorageWhitelist) };
      }
      if (trackerCategories) {
        config.trackers = {};
        config.trackers = { categories: JSON.parse(trackerCategories) };
      }
      if (trackerCompanies) {
        if (!config.trackers) config.trackers = {};
        config.trackers = { categories: JSON.parse(trackerCategories) };
      }
      if (trackerHostnames) {
        if (!config.trackers) config.trackers = {};
        config.trackers = { hostnames: JSON.parse(trackerHostnames) };
      }
      window.browserPrivacy.start(config.cookies, config.localStorage, config.trackers);
    });
  document.getElementById('browser_privacy_stop')
    .addEventListener('click', window.browserPrivacy.stop);
});
