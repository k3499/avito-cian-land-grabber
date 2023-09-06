// Ожидание события "DOMContentLoaded", чтобы убедиться, что страница полностью загружена

document.addEventListener("DOMContentLoaded", function () {
  // Получение элементов DOM
  const collectButtonElement = document.getElementById("collectButton");
  const textFieldElement = document.getElementById("textField");

  // Сообщения и предупреждения для пользователя
  const urlWarning =
    "Перейдите на земельный участок на <strong>avito.ru</strong> или <strong>cian.ru</strong>";
  const areaWarning =
    "Перейдите на страницу земельного и нажмите получить параметры";
  const parseSuccess = "Параметры переданы\n✅";

  // Список разрешенных доменов
  const allowedDomains = ["www.avito.ru", "www.cian.ru", "kazan.cian.ru"];

  // Запрос активной вкладки в текущем окне браузера
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    const url = new URL(activeTab.url).hostname;

    if (allowedDomains.includes(url)) {
      collectButtonElement.removeAttribute("disabled");
      textFieldElement.textContent = areaWarning;
    } else {
      collectButtonElement.setAttribute("disabled", "true");
      textFieldElement.innerHTML = urlWarning;
    }
  });

  collectButtonElement.addEventListener("click", function () {
    // Выполнение скрипта content.js в активной вкладке
    chrome.tabs.executeScript({
      file: "content.js",
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const url = activeTab.url;
      // Отправка сообщения с URL внутреннему скрипту во вкладке
      chrome.tabs.sendMessage(tabs[0].id, url);
      // Установка сообщения об успешной передаче данных
      textFieldElement.textContent = parseSuccess;
      // Установка таймера для очистки сообщения через 1 секунду
      setTimeout(function () {
        textFieldElement.textContent = areaWarning;
      }, 1000);
    });
  });
});
