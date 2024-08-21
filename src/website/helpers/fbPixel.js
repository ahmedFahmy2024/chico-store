import ReactPixel from 'react-facebook-pixel';

const options = {
    autoConfig: true,
    debug: false,
};

export const initFacebookPixel = () => {
    ReactPixel.init('1519882888911595', null, options);
};

export const logPageView = () => {
    ReactPixel.pageView();
};

export const logEvent = (event, data) => {
    ReactPixel.track(event, data);
};