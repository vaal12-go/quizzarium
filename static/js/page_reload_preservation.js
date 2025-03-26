const PAGE_SESSION_KEY = "PAGE_SESSION_KEY";
const DATASET_SAVEVAL_KEY = "dataset_setval_key";
var root_el_id = "";
var additional_obj_to_save = null;

function restore_session_data(root_el) {
  const sess_data_str = sessionStorage.getItem(PAGE_SESSION_KEY);
  if (sess_data_str === null) return null;

  const session_obj = JSON.parse(sess_data_str);
  console_debug("page_reload_preservation:12 session_obj::", session_obj);

  const root_element = document.getElementById(root_el);
  root_element.innerHTML = session_obj.page_html;

  const inp_els = root_element.querySelectorAll("input");
  const inp_els_arr = [].slice.call(inp_els);
  inp_els_arr.forEach((curr_input) => {
    switch (curr_input.type) {
      case "text":
        curr_input.value = curr_input.dataset[DATASET_SAVEVAL_KEY];
        console_debug(
          "page_reload_preservation:22 curr_input.dataset[DATASET_SAVEVAL_KEY]::",
          curr_input.dataset[DATASET_SAVEVAL_KEY]
        );
        break;
      case "radio":
        curr_input.checked = curr_input.dataset[DATASET_SAVEVAL_KEY] == "true";
        break;
      case "checkbox":
        curr_input.checked = curr_input.dataset[DATASET_SAVEVAL_KEY] == "true";
        break;
    }
  });

  sessionStorage.clear(PAGE_SESSION_KEY);
  return session_obj.additional_data;
}

function save_to_session_actual() {
  const obj_2save = {
    additional_data: additional_obj_to_save,
    page_html: "",
  };
  const root_el = document.getElementById(root_el_id);
  obj_2save.page_html = new XMLSerializer().serializeToString(root_el);
  console_debug("page_reload_preservation:11 xml::", obj_2save.page_html);

  sessionStorage.setItem(PAGE_SESSION_KEY, JSON.stringify(obj_2save));
}

function session_save_data_available() {
  //   console_debug(
  //     "page_reload_preservation:19 sessionStorage.getItem(PAGE_SESSION_KEY)::",
  //     sessionStorage.getItem(PAGE_SESSION_KEY)
  //   );
  return !(sessionStorage.getItem(PAGE_SESSION_KEY) === null);
}

function on_change_handler(evt) {
  console_debug("qb_quiz_save:119 on_change_handler evt::", evt);
  console_debug("qb_quiz_save:119 on_change_handler evt::", evt.target);
  const curr_input = evt.target;
  switch (curr_input.type) {
    case "text":
      curr_input.dataset[DATASET_SAVEVAL_KEY] = curr_input.value;
      break;
    case "radio":
      curr_input.dataset[DATASET_SAVEVAL_KEY] = curr_input.checked;
      break;
    case "checkbox":
      curr_input.dataset[DATASET_SAVEVAL_KEY] = curr_input.checked;
      break;
  }

  console_debug("page_reload_preservation:32 curr_input::", curr_input);

  save_to_session_actual();
}

function save_page_to_sesssion(root_node, additional_object_to_save) {
  root_el_id = root_node;
  additional_obj_to_save = additional_object_to_save;

  const root_el = document.getElementById(root_el_id);
  const inp_els = root_el.querySelectorAll("input");
  console_debug("page_reload_preservation:18 inp_els::", inp_els);
  const inp_els_arr = [].slice.call(inp_els);
  console_debug("page_reload_preservation:19 inp_els_arr::", inp_els_arr);
  inp_els_arr.forEach((curr_input) => {
    curr_input.removeEventListener("change", on_change_handler);
    curr_input.addEventListener("change", on_change_handler);
    console_debug(
      "page_reload_preservation:23 curr_input.type::",
      curr_input.type
    );
    switch (curr_input.type) {
      case "text":
        curr_input.removeEventListener("keyup", on_change_handler);
        curr_input.addEventListener("keyup", on_change_handler);
        curr_input.dataset[DATASET_SAVEVAL_KEY] = curr_input.value;
        break;
      case "radio":
        curr_input.dataset[DATASET_SAVEVAL_KEY] = curr_input.checked;
        break;
      case "checkbox":
        curr_input.dataset[DATASET_SAVEVAL_KEY] = curr_input.checked;
        break;
    }
  });
}
