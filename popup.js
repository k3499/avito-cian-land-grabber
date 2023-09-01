document.addEventListener("DOMContentLoaded", function () {
  console.log("Popup DOMContentLoaded");

  var collectButton = document.getElementById("collectButton");
  var textField = document.getElementById("textField");
  var urlWarning =
    "Перейдите на земельный участок на <strong>avito.ru</strong> или <strong>cian.ru</strong>";
  var areaWarning =
    "Перейдите на страницу земельного и нажмите получить параметры";
  var parceSuccess = "Параметры переданы<br>✅";

  if (collectButton) {
    console.log("Collect button found");

    collectButton.addEventListener("click", function () {
      console.log("Collect button clicked");

      chrome.tabs.executeScript({
        file: "content.js",
      });
    });
  } else {
    console.log("Collect button not found");
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    var url = new URL(activeTab.url).hostname;

    if (url === "www.avito.ru" || url === "www.cian.ru") {
      collectButton.setAttribute("enabled", "true");
      textField.innerHTML = areaWarning;
    } else {
      collectButton.setAttribute("disabled", "true");
      textField.innerHTML = urlWarning;
    }
  });

  //передача в content
  collectButton.addEventListener("click", function () {
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
