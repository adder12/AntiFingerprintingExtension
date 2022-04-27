`{ 
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
  }`