(async () => {
  chrome.runtime.onInstalled.addListener(({ reason }) => {
    console.log(`reason: ${reason}`);
    chrome.tabs.create({
      url: chrome.runtime.getURL("index.html"),
    });
  });
})();
