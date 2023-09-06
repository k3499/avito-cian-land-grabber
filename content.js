var dataTranfered = false; // Флаг, указывающий, были ли переданы данные

// Обработчик события приема сообщения от расширения
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message) {
    const url = message;
    const site = new URL(url).hostname; // Получаем хост текущей страницы
    const elementsData = {};

    // Проверяем хост и извлекаем необходимые данные
    if (site === "www.avito.ru") {
      elementsData.url = url;
      elementsData.title = getTextContent(".title-info-title-text");
      elementsData.price = getPrice(
        "span[class^='style-price-value-main'] span[class^='styles-module-size']"
      );
      elementsData.size = getSize("li[class^='params-paramsList__item']");
      elementsData.address = getAddress("span[class^='style-item-address");
      elementsData.description = getTextContent(
        "div[class^='style-item-description']"
      );
      elementsData.status = getStatus(".title-info-title-text");
      elementsData.kadastr = getKadastr("div[class^='style-item-description']");
    } else if (site === "www.cian.ru" || site === "kazan.cian.ru") {
      elementsData.url = url;
      elementsData.title = getTextContent("div[data-name^='OfferTitleNew'] h1");
      elementsData.price = getPrice("div[data-name^='PriceInfo'] div span");
      elementsData.size = getSizeCian("div[data-name^='ObjectFactoids']");
      elementsData.address = getAddress("div[data-name^='AddressContainer']");
      elementsData.description = getTextContent(
        "div[data-name^='Description']"
      );
      elementsData.status = getStatusCian(
        "div[data-name^='ObjectFactoidsItem']"
      );
      elementsData.kadastr = getKadastr("div[data-name^='Description']");
    }

    // Если данные еще не переданы, выводим их в консоль и устанавливаем флаг передачи в true
    if (!dataTranfered) {
      console.log(JSON.stringify(elementsData, null, 2));
      dataTransferred = true;
    }
  }
});

// Функция для названия объекта
function getTextContent(selector) {
  const element = document.querySelector(selector);
  return element ? element.textContent : null;
}

// Функция для извлечения цены
function getPrice(selector) {
  const element = document.querySelector(selector);
  if (element) {
    return parseFloat(element.textContent.replace(/\s/g, ""));
  }
  return null;
}

// Функция для извлечения размера
function getSize(selector) {
  const element = document.querySelector(selector);
  if (element) {
    const sizeMatch = element.textContent.match(/\S+\s+(\S+)/);
    return sizeMatch[1];
  }
  return null;
}

// Функция для извлечения адреса
function getAddress(selector) {
  const element = document.querySelector(selector);
  return element ? element.textContent.slice(0, -8) : null;
}
// Функция для извлечения статуса Avito
function getStatus(selector) {
  const element = document.querySelector(selector);
  if (element) {
    const statusMatch = element.textContent.match(/\((.*?)\)/)[1];
    return statusMatch;
  }
  return null;
}

// Функция для извлечения статуса на CIAN
function getStatusCian(selector) {
  const element = document
    .querySelectorAll(selector)[1]
    .querySelectorAll("div")[2]
    .querySelectorAll("span")[1];
  if (element) {
    const statusMatch = element.textContent;
    return statusMatch;
  }
  return null;
}
// Функция для извлечения кадастрового номера
function getKadastr(selector) {
  const element = document.querySelector(selector);

  if (element) {
    const kadastrMatch = element.textContent.match(
      /\d{1,5}:\d{1,5}:\d{1,9}:\d{1,5}/
    );
    return kadastrMatch ? kadastrMatch[0] : null;
  }
  return null;
}

// Функция для извлечения размера на CIAN с поддержкой разных единиц измерения
function getSizeCian(selector) {
  const element = document
    .querySelector(selector)
    .querySelector("div[data-name^='ObjectFactoidsItem']")
    .querySelectorAll("div")[2]
    .querySelectorAll("span")[1].textContent;

  if (element.includes("сот")) {
    // Извлекаем число перед текстом "сот" и преобразуем его в число
    const sotokNumber = parseFloat(element.replace(",", "."));

    // Проверяем, удалось ли извлечь число
    if (!isNaN(sotokNumber)) {
      return sotokNumber; // Возвращаем число сот
    }
  } else if (element.includes("га")) {
    const gaExp = /(\d+([,.]\d+)?)\s*га/;
    const gaFound = element.match(gaExp);

    if (gaFound) {
      const gaNumber = parseFloat(gaFound[1].replace(",", "."));

      if (!isNaN(gaNumber)) {
        return gaNumber * 100;
      }
    }
  }

  return null;
}
