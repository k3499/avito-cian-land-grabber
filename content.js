var dataTranfered = false; // Флаг, указывающий, были ли переданы данные

// Обработчик события приема сообщения от расширения
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message) {
    const url = message;
    const site = new URL(url).hostname; // Получаем хост текущей страницы
    const elementsData = { title: "" };

    // Проверяем хост и извлекаем необходимые данные
    if (site === "www.avito.ru") {
      elementsData.url = url;
      elementsData.title = getTextContent("h1[itemprop^='name']");
      elementsData.price = getPrice(
        "span[class^='style-price-value-main'] span[class^='styles-module-size']"
      );
      elementsData.size = getSize("li[class^='params-paramsList__item']");
      elementsData.address = getAddress("span[class^='style-item-address");
      elementsData.description = getTextContent(
        "div[class^='style-item-description']"
      );
      elementsData.status = getStatus("h1[itemprop^='name']");
      elementsData.kadastr = getKadastr("div[class^='style-item-description']");
      elementsData.lat = getLat("div[class^='style-item-map-wrapper']");
      elementsData.lon = getLon("div[class^='style-item-map-wrapper']");
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
      elementsData.lat = getLatCian("script[type='text/javascript']");
      elementsData.lon = getLonCian("script[type='text/javascript']");
    }

    // Если данные переданы, выводим их в консоль и устанавливаем флаг передачи в true
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
  console.log(selector);
  const element = document.querySelector(selector);
  if (element) {
    const statusMatch = element.textContent.match(/\((.*?)\)/)[1];
    return statusMatch;
  }
  return null;
}

// Функция для извлечения статуса на CIAN
function getStatusCian(selector) {
  let element = "";
  if (document.querySelectorAll(selector).length > 1) {
    element = document
      .querySelectorAll(selector)[1]
      .querySelectorAll("div")[2]
      .querySelectorAll("span")[1];
  }

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

// Функция для извлечения координаты lat на avito
function getLat(selector) {
  const element = document.querySelector(selector);
  if (element) {
    return element.getAttribute("data-map-lat");
  }
  return null;
}

// Функция для извлечения координаты lon на avito
function getLon(selector) {
  const element = document.querySelector(selector);
  if (element) {
    return element.getAttribute("data-map-lon");
  }
  return null;
}

// Функция для извлечения координаты lat на CIAN
function getLatCian(selector) {
  let targetScriptTag = "";
  // Получаем все теги <script> на странице
  const scriptTags = document.querySelectorAll(selector);
  // Ищем тег <script>, содержащий нужную строку
  if (
    Array.from(scriptTags).find((scriptTag) =>
      scriptTag.textContent.includes('"coordinates":{')
    )
  ) {
    targetScriptTag = Array.from(scriptTags).find((scriptTag) =>
      scriptTag.textContent.includes('"coordinates":{')
    );
    // Получаем текст внутри найденного тега <script>
    const scriptText = targetScriptTag ? targetScriptTag.textContent : null;
    // Теперь у вас есть текст внутри тега <script>, содержащего нужную строку
    // Вы можете использовать его как вам нужно

    // Извлекаем значения lat и lng с помощью регулярного выражения
    const coordinatesRegex =
      /"coordinates":{"lat":(\d+\.\d+),"lng":(\d+\.\d+)}/;
    const matches = scriptText.match(coordinatesRegex);
    const lat = matches ? parseFloat(matches[1]) : null;
    return lat;
  }
  return null;
}

// Функция для извлечения координаты lon на CIAN
function getLonCian(selector) {
  let targetScriptTag = "";
  // Получаем все теги <script> на странице
  const scriptTags = document.querySelectorAll(selector);
  // Ищем тег <script>, содержащий нужную строку
  if (
    Array.from(scriptTags).find((scriptTag) =>
      scriptTag.textContent.includes('"coordinates":{')
    )
  ) {
    targetScriptTag = Array.from(scriptTags).find((scriptTag) =>
      scriptTag.textContent.includes('"coordinates":{')
    );
    // Получаем текст внутри найденного тега <script>
    const scriptText = targetScriptTag ? targetScriptTag.textContent : null;
    // Теперь у вас есть текст внутри тега <script>, содержащего нужную строку
    // Вы можете использовать его как вам нужно

    // Извлекаем значения lat и lng с помощью регулярного выражения
    const coordinatesRegex =
      /"coordinates":{"lat":(\d+\.\d+),"lng":(\d+\.\d+)}/;
    const matches = scriptText.match(coordinatesRegex);
    const lon = matches ? parseFloat(matches[2]) : null;
    return lon;
  }
  return null;
}

// Функция для извлечения размера на CIAN с поддержкой разных единиц измерения
function getSizeCian(selector) {
  const element = document
    .querySelector(selector)
    .querySelector("div[data-name^='ObjectFactoidsItem']")
    .querySelectorAll("div")[2]
    .querySelectorAll("span");

  // Ищем тег <span>, у которого контент начинается с цифры
  const targetSpanTag = Array.from(element).find((spanTag) =>
    /^\d/.test(spanTag.textContent)
  );

  // Получаем текст внутри найденного тега <span>
  const spanText = targetSpanTag ? targetSpanTag.textContent : null;
  if (spanText.includes("сот")) {
    // Извлекаем число перед текстом "сот" и преобразуем его в число
    const sotokNumber = parseFloat(spanText.replace(",", "."));

    // Проверяем, удалось ли извлечь число
    if (!isNaN(sotokNumber)) {
      return sotokNumber; // Возвращаем число сот
    }
  } else if (spanText.includes("га")) {
    const gaExp = /(\d+([,.]\d+)?)\s*га/;
    const gaFound = spanText.match(gaExp);

    if (gaFound) {
      const gaNumber = parseFloat(gaFound[1].replace(",", "."));

      if (!isNaN(gaNumber)) {
        return gaNumber * 100;
      }
    }
  }

  return null;
}
