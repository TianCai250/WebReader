window.onload = () => {
  const Activity = {
    init: function () {
      Activity.eventMonitor();
    },
    eventMonitor: function () {
      document.addEventListener("keydown", (e) => {
        switch (e.key) {
          case "[":
            chrome.runtime.sendMessage({
              type: "book_operation",
              data: {
                key: "[",
              },
            });
            break;
          case "]":
            chrome.runtime.sendMessage({
              type: "book_operation",
              data: {
                key: "]",
              },
            });
            break;
          case "=":
            console.clear();
            break;
        }
      });

      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log("content-script", message);
        if (message.type === "render_book") {
          console.clear();
          switch (message.data.clg_type) {
            case "info":
              console.log(
                `%c${message.data.renderTxt}`,
                `color: ${message.data.color}`
              );
              break;
            case "warn":
              console.warn(
                `%c${message.data.renderTxt}`,
                `color: ${message.data.color}`
              );
              break;
            case "error":
              console.error(
                `%c${message.data.renderTxt}`,
                `color: ${message.data.color}`
              );
              break;
            default:
              console.log(
                `%c${message.data.renderTxt}`,
                `color: ${message.data.color}`
              );
          }
        }
        sendResponse("ok");
      });
    },
  };

  Activity.init();
};
