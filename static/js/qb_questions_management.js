function clear_choices_ui(question_ui_id) {
  const selector = `#q${question_ui_id}-choice-container ul`;
  const choices_list_el = document.querySelector(selector);
  choices_list_el.innerHTML = "";

  const choice_container = document.getElementById(
    `q${question_ui_id}-choice-container`
  );
  choice_container.classList.add("no-display");
}

function collect_question_choices(q_ui_id) {
  const selector = `#q${q_ui_id}-choice-container ul`;
  const choices_list_el = document.querySelector(selector);

  const choice_el_arr = [].slice.call(choices_list_el.children);
  const choice_array = choice_el_arr.reduce((accum, curr_choice, curr_idx) => {
    // console_debug("qb_quiz_save:7 curr_choice::", curr_choice);
    // console_debug("qb_quiz_save:8 curr_idx::", curr_idx);
    // const choice_inp = document.getElementById(
    //   `q${q_ui_id}_c${curr_idx}-choice-text-inp`
    // );
    // console_debug("qb_quiz_save:12 choice_inp.value::", choice_inp.value);
    accum.push(choice_inp.value);
    return accum;
  }, []);

  return choice_array;
}

function add_choice_ui(question_ui_id, choice = null) {
  console_debug("qb_questions_management:32 add_choice_ui::");
  const choice_container = document.getElementById(
    `q${question_ui_id}-choice-container`
  );

  const existing_choices = collect_question_choices(question_ui_id);
  //   console_debug(
  //     "qb_questions_management:41 existing_choices::",
  //     existing_choices
  //   );
  const curr_no_choices = existing_choices.length;

  choice_container.classList.remove("no-display");

  const selector = `#q${question_ui_id}-choice-container ul`;
  const choices_list_el = document.querySelector(selector);

  const newLi = document.createElement("li");
  newLi.dataset[QUESTION_ID_ATTR_NAME] = question_ui_id;

  var remove_btn_needed = false;
  if (curr_no_choices > 0) {
    remove_btn_needed = true;
  }

  newLi.innerHTML = Mustache.render(CHOICE_ADD_TEMPLATE, {
    remove_btn_visible: remove_btn_needed,
  });

  choices_list_el.appendChild(newLi);

  const choice_no_span = replace_el_id(
    "c_new-choice-number-span",
    `q${question_ui_id}_c${curr_no_choices}-choice-number-span`
  );
  choice_no_span.innerHTML = curr_no_choices + 1;

  const choice_text_el = replace_el_id(
    "c_new-choice-text-inp",
    `q${question_ui_id}_c${curr_no_choices}-choice-text-inp`
  );

  if (!(choice === null)) {
    choice_text_el.value = choice.text;
  }
}

function question_type_changed() {
  console.log("question_type_changed :>> ", this);
  const selected_option = this.options[this.selectedIndex];
  console_debug(
    "questionnaire_builder:190 selected_option::",
    selected_option.value
  );
  const q_ui_id = this.dataset[QUESTION_ID_ATTR_NAME];
  console_debug("questionnaire_builder:195 q_ui_id::", q_ui_id);

  switch (Number(selected_option.value)) {
    case -1:
      console.log("No option selected :>> ");
      break;
    case 1:
      console.log("Text option selected :>> ");
      clear_choices_ui(q_ui_id);
      break;
    case 2:
      // Single choice
      console.log("Single choice selected :>> ");
      const q_choices = collect_question_choices(q_ui_id);
      if (q_choices.length == 0) add_choice_ui(q_ui_id);
      break;
    case 3:
      // Multiple choice
      console.log("Multiple choice selected :>> ");
      const q_choices2 = collect_question_choices(q_ui_id);
      if (q_choices2.length == 0) add_choice_ui(q_ui_id);
      break;
  }
}

function add_choice_to_question() {
  console_debug("qb_questions_management:71 add_choice_to_question::", this);
  const q_ui_id = this.dataset[QUESTION_ID_ATTR_NAME];
  console_debug("qb_questions_management:73 q_ui_id::", q_ui_id);
  add_choice_ui(q_ui_id);
}

function populate_question(q_ui_id, curr_question_ui_number, q_obj = null) {
  // Setting question number
  const number_span = replace_el_id(
    "q_new-question-number-span",
    `q${q_ui_id}-question-number-span`
  );
  number_span.innerHTML = curr_question_ui_number;

  // Setting question text field
  const q_text_input = replace_el_id(
    "q_new-question_text_inp",
    `q${q_ui_id}-question_text_inp`
  );

  // Setting remove button handler
  const btn_el = replace_el_id(
    "q_new-remove-question-btn",
    `q${q_ui_id}-remove-question-btn`
  );
  btn_el.addEventListener("click", remove_question);

  // Setting type change listener
  const type_select = replace_el_id(
    "q_new-question-type-select",
    `q${q_ui_id}-question-type-select`
  );
  type_select.dataset[QUESTION_ID_ATTR_NAME] = q_ui_id;
  type_select.addEventListener("change", question_type_changed);

  replace_el_id("q_new-choice-container", `q${q_ui_id}-choice-container`);

  const add_choice_btn = replace_el_id(
    "q_new-add-choice-btn",
    `q${q_ui_id}-add-choice-btn`
  );
  add_choice_btn.addEventListener("click", add_choice_to_question);

  add_choice_btn.dataset[QUESTION_ID_ATTR_NAME] = q_ui_id;

  if (!(q_obj === null)) {
    // console_debug("qb_questions_management:98 q_obj.type::", q_obj.type);
    q_text_input.value = q_obj.question;
    set_select_by_value(type_select, q_obj.type);

    // console_debug("qb_questions_management:166 q_obj.choices::", q_obj.choices);
    switch (q_obj.type) {
      case 2:
        // Single choice
        q_obj.choices.forEach((curr_choice) => {
          add_choice_ui(q_ui_id, curr_choice);
        });
        break;
      case 3:
        // Multiple choice
        q_obj.choices.forEach((curr_choice) => {
          add_choice_ui(q_ui_id, curr_choice);
        });
        break;
    }
  } //if (!(q_obj === null)) {
} //function populate_question(q_ui_id, q_obj = null) {

function add_question(q_obj = null) {
  // console.log("add_question :>> ", q_obj);
  if (q_obj instanceof PointerEvent) {
    q_obj = null;
  }
  const listEl = document.getElementById("question-holder-list");
  const newLi = document.createElement("li");
  newLi.classList.add("ui-state-default");
  newLi.dataset[QUESTION_ID_ATTR_NAME] = QUESTION_UI_ID;
  //   console_debug("questionnaire_builder:257 newLi::", newLi);

  newLi.innerHTML = Mustache.render(QUESTION_ADD_TEMPLATE, {});

  const curr_question_ui_number = get_questions().length + 1;
  listEl.appendChild(newLi);

  populate_question(QUESTION_UI_ID, curr_question_ui_number, q_obj);

  QUESTION_UI_ID++;
} //function add_question() {

function populate_questions(q_arr) {
  q_arr.forEach((curr_question) => {
    add_question(curr_question);
  });
}

function question_sorting_finished() {
  // Prototype:
  // (event, ui) => {
  //   console.log("Sortable resorted :>> ");
  //   console.log("ui :>> ", ui);
  //   console.log("event :>> ", event);
  // },
  console.log("question_sorting_finished:>> ");

  const list_el = document.getElementById("question-holder-list");
  console_debug("questionnaire_builder:303 list_el::", list_el);
  const q_el_arr = [].slice.call(list_el.children);
  q_el_arr.forEach((curr_question_el, idx) => {
    console_debug(
      "questionnaire_builder:305 curr_question_el::",
      curr_question_el
    );
    console_debug(
      "questionnaire_builder:308 q_el_arr.dataset::",
      curr_question_el.dataset
    );
    const ui_id = curr_question_el.dataset.question_ui_id;
    console_debug("questionnaire_builder:309 ui_id::", ui_id);
    document.getElementById(`q${ui_id}-question-number-span`).innerHTML =
      idx + 1;
  });
}
