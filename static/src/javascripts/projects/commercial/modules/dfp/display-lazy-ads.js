// @flow
import dfpEnv from 'commercial/modules/dfp/dfp-env';
import loadAdvert from 'commercial/modules/dfp/load-advert';
import enableLazyLoad from 'commercial/modules/dfp/enable-lazy-load';
import performanceLogging from 'commercial/modules/dfp/performance-logging';

const advertsToInstantlyLoad = ['dfp-ad--merchandising-high', 'dfp-ad--im'];

const instantLoad = (): void => {
    const instantLoadAdverts = dfpEnv.advertsToLoad.filter(
        (advert: Object): boolean => {
            if (advertsToInstantlyLoad.includes(advert.id)) {
                performanceLogging.updateAdvertMetric(
                    advert,
                    'loadingMethod',
                    'instant'
                );
                performanceLogging.updateAdvertMetric(
                    advert,
                    'lazyWaitComplete',
                    0
                );
                return true;
            }
            performanceLogging.updateAdvertMetric(
                advert,
                'loadingMethod',
                'lazy-load'
            );
            return false;
        }
    );

    dfpEnv.advertsToLoad = dfpEnv.advertsToLoad.filter(
        (advert: Object): boolean => !advertsToInstantlyLoad.includes(advert.id)
    );

    instantLoadAdverts.forEach(loadAdvert);
};

const displayLazyAds = (): void => {
    window.googletag.pubads().collapseEmptyDivs();
    window.googletag.enableServices();
    instantLoad();
    enableLazyLoad();
};

export { displayLazyAds };