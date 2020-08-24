import noCookies from 'no-cookies';
import noLocalStorage from 'no-local-storage';
import noTrackers from 'no-trackers';

const browserPrivacy = {
  start: (cookies, localStorage, trackers) => {
    if (cookies) {
      noCookies.disable(cookies.whitelist);
    }
    if (localStorage) {
      noLocalStorage.disable(localStorage.whitelist);
    }
    if (trackers) {
      noTrackers.disable(trackers);
    }
  },
  stop: () => {
    noCookies.enable();
    noLocalStorage.enable();
    noTrackers.enable();
  },
};

export default browserPrivacy;
