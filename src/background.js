//background.js

var extraInfoSpec = ["blocking", "requestHeaders"]; //creates an array with the bracketed values contained in it, this is later used as part of creating the listener
if (
  chrome.webRequest.OnBeforeSendHeadersOptions.hasOwnProperty("EXTRA_HEADERS")
) {
  extraInfoSpec.push("extraHeaders"); //appends "extraHeaders" to the end of the extraInfoSpec array
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  //creates a listener for during a web request
  (details) => {
    for (let i = 0; i < details.requestHeaders.length; i++) {
      //parses the requestheaders until it finds the User-Agent field
      if (details.requestHeaders[i].name === "User-Agent") {
        const UserAgent = details.requestHeaders[i].value; //creates a constant and assigns it the value of the current request header field(which will be the user agent)
        const fakeUserAgent = UserAgent.replace(
          //creates a second constant that is based on a modified version of the original user agent
          /\(.*?(?=(; rv:[^\)]+)?\))/,
          "(Windows NT 6.1; Win64; x64" //!!THIS VALUE IS FOR TESTING PURPOSES ONLY, PLEASE REPLACE WITH THE COMMENTED LINE BELOW FOR DEPLOYMENT PURPOSES!!
          //        "(Windows NT 10.0; Win64; x64"
        );
        details.requestHeaders[i].value = fakeUserAgent; //replaces the useragent with the newly created fake user agent
      } else if (details.requestHeaders[i].name === "Accept-Language") {
        //while the request header is parsed, checks if the current header is the languages
        details.requestHeaders[i].value = "en-US,en;q=0.5"; //replaces the language header with the desired fake information, in this case spoofing to only have US english
      }
    }
    return { requestHeaders: details.requestHeaders }; //returns the now appended request headers
  },
  { urls: ["<all_urls>"] }, //filter
  extraInfoSpec
);
