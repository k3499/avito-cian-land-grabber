document.addEventListener("DOMContentLoaded", function () {
  var collectButton = document.getElementById("collectButton");
  var textField = document.getElementById("textField");
  var urlWarning =
    "Перейдите на земельный участок на <strong>avito.ru</strong> или <strong>cian.ru</strong>";
  var areaWarning =
    "Перейдите на страницу земельного и нажмите получить параметры";
  var parceSuccess = "Параметры переданы<br>✅";

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    var url = new URL(activeTab.url).hostname;

    if (
      url === "www.avito.ru" ||
      url === "www.cian.ru" ||
      url === "kazan.cian.ru"
    ) {
      collectButton.setAttribute("enabled", "true");
      textField.innerHTML = areaWarning;
    } else {
      collectButton.setAttribute("disabled", "true");
      textField.innerHTML = urlWarning;
    }
  });

  //передача в content
  collectButton.addEventListener("click", function () {
    // Выполнить executeScript один раз
    chrome.tabs.executeScript({
      file: "content.js",
    });

    // Выполнить sendMessage один раз
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      var url = activeTab.url;
      chrome.tabs.sendMessage(tabs[0].id, url);
      textField.innerHTML = parceSuccess;
      setTimeout(function () {
        textField.innerHTML = areaWarning;
      }, 1000);
    });
  });
});
