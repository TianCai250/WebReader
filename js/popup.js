window.onload = () => {
  const file = document.querySelector("#file");
  const page_size = document.querySelector("#page_size");
  const current_page = document.querySelector("#current_page");
  const clg_type = document.querySelector("#clg_type");
  const color = document.querySelector("#color");
  const color_btn = document.querySelector("#color_btn");
  const current_page_btn = document.querySelector("#current_page_btn");
  const page_size_btn = document.querySelector("#page_size_btn");
  const clg_type_btn = document.querySelector("#clg_type_btn");

  var Activity = {
    data: {},
    init: function () {
      Activity.eventMonitor();
    },
    eventMonitor: function () {
      // 选择文件
      file.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          var reader = new FileReader();
          reader.readAsText(file);
          reader.onload = function (oFREvent) {
            const txt = oFREvent.target.result;
            chrome.runtime.sendMessage({
              type: "content",
              data: {
                content: txt
                  .toString()
                  .replace(/\n/g, " ")
                  .replace(/\r/g, " ")
                  .replace(/　　/g, " ")
                  .replace(/ /g, " "),
              },
            });
          };
        }
      });
      color_btn.addEventListener("click", () => {
        chrome.runtime.sendMessage({
          type: "setting",
          data: {
            color: color.value,
          },
        });
      });
      current_page_btn.addEventListener("click", () => {
        chrome.runtime.sendMessage({
          type: "setting",
          data: {
            current_page: Number(current_page.value) || 1,
          },
        });
      });
      page_size_btn.addEventListener("click", () => {
        chrome.runtime.sendMessage({
          type: "setting",
          data: {
            page_size: Number(page_size.value) || 50,
          },
        });
      });
      clg_type_btn.addEventListener("click", () => {
        console.log(clg_type.value);
        chrome.runtime.sendMessage({
          type: "setting",
          data: {
            clg_type: clg_type.value,
          },
        });
      });
    },
    eventCenter: {},
  };

  Activity.init();
};
