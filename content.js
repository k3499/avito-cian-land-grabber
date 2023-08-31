console.log("Content script started");

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message) {
    var url = message;
    var elementsData = {
      url: url,
      title: document.querySelector(".title-info-title-text").textContent,
      price: document
        .querySelector("span[class^='style-price-value-main']")
        .querySelector("span[class^='styles-module-size']")
        .getAttribute("content"),
      size: document
        .querySelector("li[class^='params-paramsList__item']")
        .textContent.match(/\S+\s+(\S+)/)[1],
      adress: document.querySelector("span[class^='style-item-address']")
        .textContent,
      description: document.querySelector(
        "div[class^='style-item-description-text']"
      ).textContent,
    };

    console.log(JSON.stringify(elementsData, null, 2));
    // Дальнейшая обработка информации из popup.js
  }
});
