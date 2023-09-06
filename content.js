var dataTranfered = false;
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  var url = message;
  var site = new URL(url).hostname;
  if (site === "www.avito.ru") {
    var elementsData = {
      url: url,
      title: document.querySelector(".title-info-title-text")
        ? document.querySelector(".title-info-title-text").textContent
        : null,
      price: document.querySelector("span[class^='style-price-value-main']")
        ? document
            .querySelector("span[class^='style-price-value-main']")
            .querySelector("span[class^='styles-module-size']")
            .getAttribute("content")
        : null,
      size: document.querySelector("li[class^='params-paramsList__item']")
        ? document
            .querySelector("li[class^='params-paramsList__item']")
            .textContent.match(/\S+\s+(\S+)/)[1]
        : null,
      adress: document.querySelector("span[class^='style-item-address']")
        ? document.querySelector("span[class^='style-item-address']")
            .textContent
        : null,
      description: document.querySelector(
        "div[class^='style-item-description']"
      )
        ? document.querySelector("div[class^='style-item-description']")
            .textContent
        : null,
      status: document
        .querySelector(".title-info-title-text")
        .textContent.match(/\((.*?)\)/)[1]
        ? document
            .querySelector(".title-info-title-text")
            .textContent.match(/\((.*?)\)/)[1]
        : null,
      kadastr: document
        .querySelector("div[class^='style-item-description']")
        .textContent.match(/\d{1,5}:\d{1,5}:\d{1,9}:\d{1,5}/)
        ? document
            .querySelector("div[class^='style-item-description']")
            .textContent.match(/\d{1,5}:\d{1,5}:\d{1,9}:\d{1,5}/)
        : null,
    };
  } else if (site === "www.cian.ru" || site === "kazan.cian.ru") {
    var elementsData = {
      title: document.querySelector("div[data-name^='OfferTitleNew']")
        ? document.querySelector("h1").textContent
        : null,
      price: document.querySelector("div[data-name^='PriceInfo']")
        ? document
            .querySelector("div[data-name^='PriceInfo']")
            .querySelector("div")
            .querySelector("span")
            .textContent.slice(0, -2)
            .replace(/\s/g, "")
        : null,
      size: document.querySelector("div[data-name^='ObjectFactoids']")
        ? sizeCian(
            document
              .querySelector("div[data-name^='ObjectFactoids']")
              .querySelector("div[data-name^='ObjectFactoidsItem']")
              .querySelectorAll("div")[2]
              .querySelectorAll("span")[1].textContent
          )
        : null,
      adress: document.querySelector("div[data-name^='AddressContainer']")
        ? document
            .querySelector("div[data-name^='AddressContainer']")
            .textContent.slice(0, -8)
        : null,
      description: document.querySelector("div[data-name^='Description']")
        ? document.querySelector("div[data-name^='Description']").textContent
        : null,
      status: document.querySelectorAll(
        "div[data-name^='ObjectFactoidsItem']"
      )[1]
        ? document
            .querySelectorAll("div[data-name^='ObjectFactoidsItem']")[1]
            .querySelectorAll("div")[2]
            .querySelectorAll("span")[1].textContent
        : null,
      kadastr: document
        .querySelector("div[data-name^='Description']")
        .textContent.match(/\d{1,5}:\d{1,5}:\d{1,9}:\d{1,5}/)
        ? document
            .querySelector("div[data-name^='Description']")
            .textContent.match(/\d{1,5}:\d{1,5}:\d{1,9}:\d{1,5}/)
        : null,
    };
  }

  if (dataTranfered === false) {
    console.log(JSON.stringify(elementsData, null, 2));
    dataTranfered = true;
  }
});

function sizeCian(size) {
  if (size.includes("сот")) {
    // Извлекаем число перед текстом "сот" и преобразуем его в число
    const sotokNumber = parseFloat(size);

    // Проверяем, удалось ли извлечь число
    if (!isNaN(sotokNumber)) {
      return sotokNumber; // Возвращаем число сот
    }
  } else if (size.includes("га")) {
    const gaExp = /(\d+([,.]\d+)?)\s*га/;
    const gaFound = size.match(gaExp);

    if (gaFound) {
      const gaNumber = parseFloat(gaFound[1].replace(",", "."));

      if (!isNaN(gaNumber)) {
        return gaNumber * 100;
      }
    }
  }

  return null;
}
