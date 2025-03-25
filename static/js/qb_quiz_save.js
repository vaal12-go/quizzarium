const QUIZ_SAVED_SUCCESS_SESSION_STRING = "quiz_saved_success";

async function save_quiz() {
  console.log("Save quiz clicked :>> ");
  let url = `${BASE_URL}/api/quizzes`;

  // console.log("url :>> ", url);
  const quiz_to_send = collect_quiz_data();
  console.log("collect_quiz_data() :>> ", quiz_to_send);

  res_json = {
    status: "error",
    description: "something happened with server request",
  };
  if (quiz_to_send.id == -1) {
    console.log("New quiz to send :>> ");
    res_json = await (
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(collect_quiz_data()),
      })
    ).json();
  } else {
    console.log("Quiz to patch :>> ");
    res_json = await (
      await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(quiz_to_send),
      })
    ).json();
    // console.log("responce :>> ", res_json);
  }
  console.log("Save quiz responce :>> ", res_json);
  // [x]:uncomment
  if (res_json.status == "success") {
    sessionStorage.setItem(
      QUIZ_SAVED_SUCCESS_SESSION_STRING,
      QUIZ_SAVED_SUCCESS_SESSION_STRING
    );
    console_debug("qb_quiz_save:46 window.location::", window.location);
    const redirect_url = `${window.location.origin}${window.location.pathname}?id=${res_json.quiz.id}`;
    console_debug("qb_quiz_save:48 redirect_url::", redirect_url);
    window.location = redirect_url;
  }
} //async function save_quiz() {

function collect_question_choices(q_ui_id) {
  const selector = `#q${q_ui_id}-choice-container ul`;
  const choices_list_el = document.querySelector(selector);

  const choice_el_arr = [].slice.call(choices_list_el.children);
  // console_debug("qb_quiz_save:59 choice_el_arr::", choice_el_arr);
  const choice_array = choice_el_arr.reduce((accum, curr_choice, curr_idx) => {
    // console_debug("qb_quiz_save:7 curr_choice::", curr_choice);

    const choice_inp = curr_choice.querySelector(
      "div.row div.col-9 div.input-group input"
    );
    console_debug("qb_quiz_save:63 inp_el::", choice_inp);

    // console_debug("qb_quiz_save:8 curr_idx::", curr_idx);
    // const choice_inp = document.getElementById(
    //   `q${q_ui_id}_c${curr_idx}-choice-text-inp`
    // );
    // console_debug("qb_quiz_save:12 choice_inp.value::", choice_inp.value);
    const choice_obj = {
      text: choice_inp.value,
    };
    accum.push(choice_obj);
    return accum;
  }, []);

  return choice_array;
}

function get_questions() {
  const list_el = document.getElementById("question-holder-list");

  const li_array = [].slice.call(list_el.children);
  const retArr = li_array.reduce((accum, curr_li_el) => {
    const q_ui_id = curr_li_el.dataset[QUESTION_ID_ATTR_NAME];
    const q_type_select = document.getElementById(
      `q${q_ui_id}-question-type-select`
    );

    let question_choices = [];
    switch (Number(q_type_select.value)) {
      case -1:
        break;
      case 1:
        break;
      case 2:
        question_choices = collect_question_choices(q_ui_id);
        break;
      case 3:
        question_choices = collect_question_choices(q_ui_id);
        break;
    }

    accum.push({
      question: document.getElementById(`q${q_ui_id}-question_text_inp`).value,
      type: Number(q_type_select.value),
      q_ui_id: Number(q_ui_id),
      choices: question_choices,
    });
    return accum;
  }, []); //list_el.children.reduce(

  return retArr;
} //function get_questions() {

function collect_quiz_data() {
  const q_name = document.getElementById("quiz_name_inp").value;
  const q_descr = document.getElementById("quiz_descr_inp").value;

  const quiz_questions = get_questions();
  console_debug("questionnaire_builder:57 quiz_questions::", quiz_questions);
  const ret = {
    id: EDIT_QUIZ_ID,
    name: q_name,
    description: q_descr,
    questions: quiz_questions,
  };
  console.log("ret :>> ", ret);
  return ret;
} //function collect_quiz_data() {
