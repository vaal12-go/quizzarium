let EDIT_QUIZ_ID = -1;

const QUESTION_ID_ATTR_NAME = "question_ui_id";
let QUESTION_UI_ID = 0;

async function load_quiz(quiz_id) {
  const url = `${BASE_URL}/api/quizzes/${quiz_id}`;
  const res_json = await (
    await fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
  ).json();
  console.log("res_json :>> ", res_json);
  document.getElementById("quiz_name_inp").value = res_json.name;
  document.getElementById("quiz_descr_inp").value = res_json.description;
  const q_arr = JSON.parse(res_json.questions_json);
  // console_debug("questionnaire_builder:257 q_arr::", q_arr);
  populate_questions(q_arr);
}

window.onload = async () => {
  initCommonGlobalState();

  // TODO: replace this with show_message_next_page function in common.js
  const save_success = sessionStorage.getItem(
    QUIZ_SAVED_SUCCESS_SESSION_STRING
  );
  console_debug("questionnaire_builder:34 save_success::", save_success);
  if (save_success) {
    // alert("Quiz is saved");
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

    const msg = bs5dialog.message("Quiz saved successfully", options);
    sessionStorage.removeItem(QUIZ_SAVED_SUCCESS_SESSION_STRING);
  }

  const urlParams = new URL(window.location.toLocaleString()).searchParams;
  const edit_quiz_id = urlParams.get("id");
  console.log(" edit_quiz_id :>> ", edit_quiz_id);

  if (edit_quiz_id === null) {
    // console.log("Will create new item :>> ");
  } else {
    EDIT_QUIZ_ID = Number(edit_quiz_id);
    // console.log("EDIT_QUIZ_ID :>> ", EDIT_QUIZ_ID);
    await load_quiz(EDIT_QUIZ_ID);
  }

  document
    .getElementById("save-quiz-button")
    .addEventListener("click", save_quiz);
  document
    .getElementById("add-question-btn")
    .addEventListener("click", add_question);

  document.getElementById("cancel-btn").addEventListener("click", () => {
    console.log("Cancel clicked :>> ");
    window.location = BASE_URL;
  });

  $("#question-holder-list").sortable({
    stop: question_sorting_finished,
  });
  $("#sortable").disableSelection();
};
