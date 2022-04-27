var script = document.createElement("script"); //creates a new script object
script.src = chrome.extension.getURL("inject.js"); //sets the src code of the script object to be the injection script

script.onload = function () {
  this.remove();
};

(document.head || document.documentElement).appendChild(script); //appends the script to the bottom of the document
