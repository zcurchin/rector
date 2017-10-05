/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'yo-grade',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',

    torii: {
      sessionServiceName: 'session'
    },

    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    // needed for ember-paper
    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-inline'",
      'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
      'font-src': "'self' fonts.gstatic.com",
      'connect-src': "'self'",
      'img-src': "'self' data:",
      'media-src': "'self'"
    }
  };

  if (environment === 'production') {
    ENV.firebase = {
      apiKey: 'AIzaSyDNVJ7XBK_tW2XJWu8opBn2uerHz-FxzQM',
      authDomain: 'yograde-production.firebaseapp.com',
      databaseURL: 'https://yograde-production.firebaseio.com',
      storageBucket: 'yograde-production.appspot.com'
    };
  }

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.firebase = {
      apiKey: "AIzaSyCptpo75UGAuIynLjMSp0LibCHQBooCNPI",
      authDomain: "yograde-staging.firebaseapp.com",
      databaseURL: "https://yograde-staging.firebaseio.com",
      storageBucket: "yograde-staging.appspot.com"
    };
  }

  if (environment === 'demo') {
    ENV.firebase = {
      apiKey: "AIzaSyDWumcTVgLopPlCw7K41AHXHtMgxP4z9dQ",
      authDomain: "yograde-demo.firebaseapp.com",
      databaseURL: "https://yograde-demo.firebaseio.com",
      storageBucket: "yograde-demo.appspot.com"
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  return ENV;
};
