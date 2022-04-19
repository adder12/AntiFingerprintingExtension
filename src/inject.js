
(function () {
    "use strict";
  
    const originalUserAgent = window.navigator.userAgent;
    const fakeUserAgent = originalUserAgent.replace(
      /\(.*?(?=(; rv:[^\)]+)?\))/,
      "(Windows NT 10.0; Win64; x64"
    );
    const fakeVersion = fakeUserAgent.substring(8);
  
    window.navigator.__defineGetter__("appVersion", function () {
      return fakeVersion;
    });
    window.navigator.__defineGetter__("language", function () {
      return "en-US";
    });
    window.navigator.__defineGetter__("languages", function () {
      return ["en-US", "en"];
    });
    window.navigator.__defineGetter__("mimeTypes", function () {
      return {
        length: 0,
        item: () => null,
        namedItem: () => null,
        refresh: () => {},
      };
    });
    window.navigator.__defineGetter__("oscpu", function () {
      return undefined;
    });
    window.navigator.__defineGetter__("platform", function () {
      return "Win32";
    });
    window.navigator.__defineGetter__("plugins", function () {
      return {
        length: 0,
        item: () => null,
        namedItem: () => null,
        refresh: () => {},
      };
    });
    window.navigator.__defineGetter__("userAgent", function () {
      return fakeUserAgent;
    });
    
    scope.Object.defineProperty(window.screen, "width", {
      enumerable: true,
      configurable: true,
      get: function() {
          return 1366;
      }
  });
  scope.Object.defineProperty(window.screen, "height", {
      enumerable: true,
      configurable: true,
      get: function() {
          return 768;
      }
  });



  })();