var BASE_URL = "";
const CONSOLE_DEBUG_ENABLE = true;
const VERSION_STR = "v0.2_24Mar2025";

const NEXT_WINDOW_MESSAGE_KEY = "SHOW_MESSAGE_NEXT_WINDOW_KEY";

function check_show_message() {
  // This requires bs5dialog
  const msg = sessionStorage.getItem(NEXT_WINDOW_MESSAGE_KEY);
  if (msg) {
    const options = {
      position: "top-right",
      type: "success",
      closeBtn: true,
      background: "#28a745",
      textColor: "#fff",
      fontsize: "",
      icon: "bs5-circle-check",
      iconClass: "",
      iconStyle: "",
      timeout: 2000,
      onClosed: function () {},
    };
    bs5dialog.message(msg, options);
    sessionStorage.removeItem(NEXT_WINDOW_MESSAGE_KEY);
  }
}

function initCommonGlobalState() {
  calculateBaseURL();
  const ver_el = document.getElementById("navbar_version_string");
  // console.log("ver_el :>> ", ver_el);
  if (!(ver_el === null)) {
    ver_el.innerHTML = VERSION_STR;
  }
  check_show_message();
}

function show_message_next_page(msg) {
  // TODO: make this value a jsonified array, so multiple messages can be shown
  sessionStorage.setItem(NEXT_WINDOW_MESSAGE_KEY, msg);
}

function calculateBaseURL() {
  // console.log(" window.location :>> ", window.location);
  BASE_URL = window.location.origin;
}

function console_debug(title_str, debug_var, debugOverride = false) {
  if (CONSOLE_DEBUG_ENABLE) {
    console.log(title_str + ":>>>", debug_var);
  }
}

// initGlobalState();

function set_select_by_value(selec_el, selected_value) {
  const opt_arr = [].slice.call(selec_el.options);
  opt_arr.forEach((curr_option) => {
    curr_option.selected = false;
    if (curr_option.value == selected_value) {
      curr_option.selected = true;
    }
  });
}

function replace_el_id(old_id, new_id) {
  document.getElementById(old_id).setAttribute("id", new_id);
  return document.getElementById(new_id);
}
