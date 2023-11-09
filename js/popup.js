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
  const key_check = document.querySelector("#key_check");
  const key_check_btn = document.querySelector("#key_check_btn");
  const key_position = document.querySelector("#key_position");
  const key_position_jump_btn = document.querySelector(
    "#key_position_jump_btn"
  );

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
        chrome.runtime.sendMessage({
          type: "setting",
          data: {
            clg_type: clg_type.value,
          },
        });
      });
      key_check_btn.addEventListener("click", () => {
        const value = key_check.value;
        if (value.length === 0) {
          return;
        }
        chrome.runtime.sendMessage(
          {
            type: "key_position",
            data: {
              keywords: value,
            },
          },
          (res) => {
            if (~res) {
              key_position.innerHTML = res;
              key_position_jump_btn.style.display = "block";
            } else {
              key_position.innerHTML = "未查询到该关键词";
              key_position_jump_btn.style.display = "none";
            }
          }
        );
      });
      key_position_jump_btn.addEventListener("click", () => {
        const line = key_position.innerHTML;
        chrome.runtime.sendMessage({
          type: "setting",
          data: {
            current_page: Number(line) || 1,
          },
        });
      });
    },
    eventCenter: {},
  };

  Activity.init();
};
