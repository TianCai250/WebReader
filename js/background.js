const sendData = (data) => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, data, (res) => {});
    }
  );
};

const Activity = {
  data: {
    content: "",
    book: {
      size: 0,
      page: 0,
      file_name: "",
      current_page: 1,
      page_size: 50,
      color: "#000000",
      clg_type: "info",
    },
  },
  init() {
    chrome.storage.local.get("book", (res) => {
      if (res && res.book) {
        Activity.data.book = res.book;
      } else {
        Activity.eventCenter.syncStorage();
      }
    });
    chrome.storage.local.get("content", (res) => {
      if (res && res.content) {
        Activity.data.content = res.content;
      } else {
        chrome.storage.local.set({ content: Activity.data.content });
      }
    });
    Activity.eventMonitor();
  },
  eventMonitor() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "book_operation") {
        switch (message.data.key) {
          case "[":
            Activity.eventCenter.getPrePage();
            break;
          case "]":
            Activity.eventCenter.getNextPage();
            break;
        }
      } else if (message.type === "content") {
        Activity.data.content = message.data.content;
        chrome.storage.local.set({ content: Activity.data.content });
        Activity.data.book.size = Activity.data.content.length;
        Activity.data.book.page = Math.ceil(
          Activity.data.book.size / Activity.data.book.page_size
        );
        Activity.eventCenter.syncStorage();
      } else if (message.type === "setting") {
        if (message.data.color) {
          Activity.data.book.color = message.data.color;
        }
        if (message.data.current_page) {
          Activity.data.book.current_page = message.data.current_page;
        }
        if (message.data.page_size) {
          Activity.data.book.page_size = message.data.page_size;
          Activity.data.book.page = Math.ceil(
            Activity.data.book.size / Activity.data.book.page_size
          );
          Activity.data.book.current_page = 1;
        }
        if (message.data.clg_type) {
          Activity.data.book.clg_type = message.data.clg_type;
        }
        Activity.eventCenter.syncStorage();
        Activity.eventCenter.renderBook();
      } else if (message.type === "key_position") {
        // 查询关键词位置
        const index = Activity.data.content.indexOf(message.data.keywords);
        let line = -1;
        if (~index) {
          line = Math.floor(index / Activity.data.book.page_size) + 1;
        }
        sendResponse(line);
        return;
      }
      sendResponse("ok");
    });
    chrome.storage.onChanged.addListener(function (changes, namespace) {
      if (changes.book) {
        Activity.data.book = changes.book.newValue;
      }
    });
  },
  eventCenter: {
    sendData(data) {
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, data, (res) => {});
        }
      );
    },
    // 同步设置
    syncStorage() {
      chrome.storage.local.set({ book: Activity.data.book });
    },
    getPrePage() {
      if (Activity.data.book.current_page <= 1) {
        Activity.data.book.current_page = 1;
      } else {
        Activity.data.book.current_page -= 1;
      }
      Activity.eventCenter.syncStorage();
      Activity.eventCenter.renderBook();
    },
    getNextPage() {
      if (Activity.data.book.current_page >= Activity.data.book.page) {
        Activity.data.book.current_page = Activity.data.book.page;
        return;
      }
      Activity.data.book.current_page += 1;
      Activity.eventCenter.syncStorage();
      Activity.eventCenter.renderBook();
    },
    renderBook() {
      setTimeout(() => {
        let start =
          (Activity.data.book.current_page - 1) * Activity.data.book.page_size;
        let end =
          Activity.data.book.current_page * Activity.data.book.page_size;
        let page_info =
          Activity.data.book.current_page.toString() +
          "/" +
          Activity.data.book.page.toString();
        Activity.eventCenter.sendData({
          type: "render_book",
          data: {
            color: Activity.data.book.color,
            clg_type: Activity.data.book.clg_type,
            renderTxt:
              Activity.data.content.substring(start, end) + "    " + page_info,
          },
        });
      });
    },
  },
};

Activity.init();
