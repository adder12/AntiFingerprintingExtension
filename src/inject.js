
(function () {
    "use strict";
  
    //const originalUserAgent = window.navigator.userAgent; //this part of the function replaces the original user string with a fake user string
    //const fakeUserAgent = originalUserAgent.replace(
      /\(.*?(?=(; rv:[^\)]+)?\))/,
      "(Windows NT 10.0; Win64; x64"
    //);
    const fakeUserAgent = "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0"
    //const fakeVersion = fakeUserAgent.substring(8);
  const fakeVersion = "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0"


  //The majority of the implemented functions are easy to obfuscate with each of them being properties of window.navigator. 
    window.navigator.__defineGetter__("appVersion", function () { //each section defines a getter method for each property, meaning that when the fingerprinter requests the associated property, the values spoofed by the extension are sent as opposed to the real version
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

    window.navigator.__defineGetter__("cookieEnabled", function () {
      return False;


    });

    window.navigator.__defineGetter__("deviceMemory", function () {
      return 12;

    });




    //Canvas fingerprint section
    
    const script = document.createElement('script');
    script.dataset.active = window.active === undefined ? true : window.active; // overwrites enabled or not
    script.dataset.mode = window.mode || 'random';
    script.dataset.once = true; // only manipulate once
    window.rnd = window.rnd || {
        r: Math.floor(Math.random() * 10) - 5,
        g: Math.floor(Math.random() * 10) - 5,
        b: Math.floor(Math.random() * 10) - 5
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
    script.addEventListener('called', e => {
        e.preventDefault();
        e.stopPropagation();
        chrome.runtime.sendMessage({
            method: 'possible-fingerprint'
        });
    }, false);
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
    document.documentElement.appendChild(script);
    script.remove();
    // make sure the script is injected
    if (script.dataset.injected !== 'true') {
        const polyscript = document.createElement('script');
        Object.assign(polyscript.dataset, script.dataset);
        window.frameElement.classList.add('workaround');
        polyscript.textContent = `
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
        window.parent.document.documentElement.appendChild(polyscript);
        polyscript.remove();
    }
    //Source code and support at https://github.com/Rob--W/crxviewe

   
  })();