document.addEventListener("DOMContentLoaded", function () {
  console.log("Popup DOMContentLoaded");

  var collectButton = document.getElementById("collectButton");
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

  //передача в content
  collectButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      var url = activeTab.url;
      chrome.tabs.sendMessage(tabs[0].id, url);
    });
  });
});
