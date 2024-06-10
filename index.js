const viewTable = document.querySelector("table tbody");

const viewUrls = async (urls) => {
  if (urls.length == 0) {
    viewTable.innerHTML = `<tr><td colspan="4" class="text-center">No URLs found</td></tr>`;
    return;
  }
  let [index, holdTime, showTime] = [0];
  viewTable.innerHTML = null;

  for (const [key, value] of urls.entries()) {
    const url = Object.keys(value)[0];
    const object = urls[key][url];
    let timestamp = value.time_stamp;
    let date = new Date(timestamp * 1000);
    for (const key in object) {
      index += 1;
      const rowTable = document.createElement("tr");
      const enUrl = Object.keys(object[key])[0];
      const enObject = object[key][enUrl];
      if (holdTime != date) {
        showTime = date.toLocaleString();
        holdTime = date;
      } else {
        showTime = "Yes";
      }
      rowTable.innerHTML = `<td>${index}.</td><td><a href=https://${enUrl} target="_blank">${enUrl}</a></td><td>${showTime}</td><td>${enObject.toLocaleString()}</td>`;
      viewTable.appendChild(rowTable);
    }
  }
};

const loadUrls = async () => {
  try {
    const apiUrl =
      "https://API_KEY.mockapi.io/api/v1/stored_urls";
    const response = await fetch(apiUrl);
    const urls = await response.json();
    return urls;
  } catch (error) {
    console.error("Urls fetching error...", error);
    return [];
  }
};

(async () => {
  try {
    viewTable.innerHTML = `<tr><td colspan="4" class="text-center">Loading...</td></tr>`;
    const urls = await loadUrls();
    await viewUrls(urls);
  } catch (error) {
    console.error("Error loading URLs:", error);
  }
})();
