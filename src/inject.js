(function () {
  "use strict";

  const originalUserAgent = window.navigator.userAgent; //defines a constant that has the value of the users "userAgent"
  const fakeUserAgent = originalUserAgent.replace(
    //creates a second constant that will act as the fake user agent and replaces the original user agent with it
    /\(.*?(?=(; rv:[^\)]+)?\))/,
    "(Windows NT 6.1; Win64; x64" //!!THIS VALUE IS FOR TESTING PURPOSES ONLY, PLEASE REPLACE WITH THE COMMENTED LINE BELOW FOR DEPLOYMENT PURPOSES!!
    //        "(Windows NT 10.0; Win64; x64"
  );
  const fakeVersion = fakeUserAgent.substring(8); //creates a fake version constant from the fake user agent data

  window.navigator.__defineGetter__("appVersion", function () {
    //These lines define new getters for parts of the window.navigator property
    return fakeVersion;
  });
  window.navigator.__defineGetter__("language", function () {
    //the purpose of each is to redefine what happens when a web server requests each of these properties
    return "en-US";
  });
  window.navigator.__defineGetter__("languages", function () {
    //instead of retrieving the information as would normally happen, instead the extension will cause the spoofed information to be sent
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

  window.navigator.__defineGetter__("hardwareConcurrency", function () {
    const fakeProcessors = 7;
    return fakeProcessors;
  });

  window.navigator.__defineGetter__("deviceMemory", function () {
    const fakeMem = 13;

    return fakeMem; //!!THIS VALUE IS FOR TESTING PURPOSES ONLY, PLEASE REPLACE WITH THE COMMENTED LINE BELOW FOR DEPLOYMENT!!
    //  return 8;
  });

  //Canvas fingerprint section

  const script = document.createElement("script");
  script.dataset.active = window.active === undefined ? true : window.active; // overwrites enabled or not
  script.dataset.mode = window.mode || "random";
  script.dataset.once = true; // only manipulate once
  window.rnd = window.rnd || {
    r: Math.floor(Math.random() * 10) - 5,
    g: Math.floor(Math.random() * 10) - 5,
    b: Math.floor(Math.random() * 10) - 5,
  };
  script.dataset.red = window.rnd.r;
  script.dataset.green = window.rnd.g;
  script.dataset.blue = window.rnd.b;
  if (window.top === window) {
    window.script = script;
  } else {
    // try to get preferences from the top frame when possible
    try {
      Object.assign(script.dataset, window.top.script.dataset);
      delete script.dataset.injected;
    } catch (e) {}
  }
  script.addEventListener(
    "called",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      // chrome.runtime.sendMessage({
      //method: 'possible-fingerprint'
      // });
    },
    false
  ); //the below contains the text of the script to obfuscate the canvas fingerprint
  script.textContent = `{ 
    const script = document.currentScript;
    script.dataset.injected = true;
    const toBlob = HTMLCanvasElement.prototype.toBlob;
    const toDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.manipulate = function() {
      const {width, height} = this;
      const context = this.getContext('2d');
      const shift = {
        'r': script.dataset.mode === 'random' ? Math.floor(Math.random() * 10) - 5 : Number(script.dataset.red),
        'g': script.dataset.mode === 'random' ? Math.floor(Math.random() * 10) - 5 : Number(script.dataset.green),
        'b': script.dataset.mode === 'random' ? Math.floor(Math.random() * 10) - 5 : Number(script.dataset.blue)
      };
      const matt = context.getImageData(0, 0, width, height);
      for (let i = 0; i < height; i += Math.max(1, parseInt(height / 10))) {
        for (let j = 0; j < width; j += Math.max(1, parseInt(width / 10))) {
          const n = ((i * (width * 4)) + (j * 4));
          matt.data[n + 0] = matt.data[n + 0] + shift.r;
          matt.data[n + 1] = matt.data[n + 1] + shift.g;
          matt.data[n + 2] = matt.data[n + 2] + shift.b;
        }
      }
      context.putImageData(matt, 0, 0);
      if (script.dataset.once === 'true') {
        this.manipulate = () => {
          script.dispatchEvent(new Event('called'));
        };
      }
      script.dispatchEvent(new Event('called'));
    };
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value: function() {
        if (script.dataset.active === 'true') {
          try {
            this.manipulate();
          }
          catch(e) {
            console.warn('manipulation failed', e);
          }
        }
        return toBlob.apply(this, arguments);
      }
    });
    Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
      value: function() {
        if (script.dataset.active === 'true') {
          try {
            this.manipulate();
          }
          catch(e) {
            console.warn('manipulation failed', e);
          }
        }
        return toDataURL.apply(this, arguments);
      }
    });
  }`;
  document.documentElement.appendChild(script); //appends the created script to the bottom of the document
  script.remove();
  // make sure the script is injected
  if (script.dataset.injected !== "true") {
    const injectscript = document.createElement("script");
    Object.assign(injectcript.dataset, script.dataset);
    window.frameElement.classList.add("workaround");
    injectscript.textContent = `
      for (const iframe of [...document.querySelectorAll('iframe.workaround')]) {
        try {
          Object.assign(iframe.contentWindow.HTMLCanvasElement.prototype, {
            toBlob: HTMLCanvasElement.prototype.toBlob,
            toDataURL: HTMLCanvasElement.prototype.toDataURL,
            manipulate: HTMLCanvasElement.prototype.manipulate
          });
        }
        catch (e) {}
        iframe.classList.remove('workaround');
      }
    `;
    window.parent.document.documentElement.appendChild(injectscript);
    injectscript.remove();
  }
})();
