var BASE_URL = "";
const CONSOLE_DEBUG_ENABLE = true;

function calculateBaseURL() {
  // console.log(" window.location :>> ", window.location);
  BASE_URL = window.location.origin;
}

function initGlobalState() {
  calculateBaseURL();
}

function console_debug(title_str, debug_var, debugOverride = false) {
  if (CONSOLE_DEBUG_ENABLE) {
    console.log(title_str + ":>>>", debug_var);
  }
}

initGlobalState();

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
