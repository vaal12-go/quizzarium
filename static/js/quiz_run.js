let start_moment = moment();
let quiz_to_complete = null;
var timer_interval = null;

function update_timer() {
  const curr_moment = moment();
  const diff_seconds = curr_moment.diff(start_moment, "seconds");
  document.getElementById("time-running-sec-span").innerHTML = diff_seconds;
}

function render_questions(questions_arr) {
  console_debug("quiz_run:11 questions_arr::", questions_arr);
  const holder_el = document.getElementById("questions-holder");
  questions_arr.forEach((curr_question) => {
    const row_div = document.createElement("div");
    row_div.classList.add(..."row text-start border p-3 m-3".split(" "));
    holder_el.appendChild(row_div);
    var q_type_str = "text";

    var input_template = "NO INPUT";

    switch (curr_question.type) {
      case 1:
        input_template = Mustache.render(TEXT_INPUT_TEMPLATE, {
          question: curr_question,
        });
        break;
      case 2:
        q_type_str = "single choice";
        input_template = curr_question.choices.reduce((accum, curr_choice) => {
          accum += Mustache.render(RADIO_INPUT_TEMPLATE, {
            question_id: curr_question.id,
            choice_id: curr_choice.id,
            choice_text: curr_choice.text,
          });
          return accum;
        }, "");

        break;
      case 3:
        q_type_str = "multiple choice";
        input_template = curr_question.choices.reduce((accum, curr_choice) => {
          accum += Mustache.render(CHECKBOX_INPUT_TEMPLATE, {
            question_id: curr_question.id,
            choice_id: curr_choice.id,
            choice_text: curr_choice.text,
          });
          return accum;
        }, "");
        break;
    }

    row_div.innerHTML = Mustache.render(QUESTION_TEMPLATE, {
      question: curr_question,
      q_type: q_type_str,
      input_template: input_template,
    });
  }); //questions_arr.forEach((curr_question) => {
} //function render_questions(questions_arr) {

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

  document.getElementById("quiz_name_holder").innerHTML = res_json.name;

  document.getElementById("quiz_description_holder").innerHTML =
    res_json.description;

  res_json.questions = JSON.parse(res_json.questions_json);
  render_questions(res_json.questions);

  quiz_to_complete = res_json;

  start_moment = moment();
  document.getElementById("time-started-span").innerHTML = start_moment.format(
    "MMMM Do YYYY (ddd), HH:mm:ss (ZZ)"
  );
}

function mark_question_red(q_id) {
  document.getElementById(`${q_id}-question-title`).classList.add("red_text");
}

function unmark_question_red(q_id) {
  document
    .getElementById(`${q_id}-question-title`)
    .classList.remove("red_text");
}

function create_confirmation_html(questions_arr) {
  console_debug("quiz_run:311 questions_arr::", questions_arr);
  return questions_arr.reduce((accum, curr_question) => {
    const answers_arr = curr_question.answers.reduce(
      (answer_accum, curr_answer) => {
        answer_accum.push(curr_answer.value);
        return answer_accum;
      },
      []
    );
    const answers_html = answers_arr.join(", ");
    accum += Mustache.render(CONFIRM_Q_TEMPLATE, {
      question_text: curr_question.question_text,
      answers_html: answers_html,
    });
    return accum;
  }, "");
}

async function save_quiz() {
  const quiz_collected = collect_quiz_data();
  const confirm_html = create_confirmation_html(
    quiz_collected.answered_quiz.answered_questions
  );
  console_debug("quiz_run:314 quiz_collected::", quiz_collected);

  console_debug("quiz_run:345 confirm_html::", confirm_html);

  if (quiz_collected.validation_passed) {
    const options = {
      title: "Send completed quiz?",
      type: "primary",
      btnOkText: "Yes",
      btnCancelText: "No",
      onConfirm: () => {
        console.log("Confirmed!");
        send_completed_quiz(quiz_collected);
      },
      onCancel: () => {
        console.log("Cancelled!");
      },
    };
    const {
      el,
      content,
      options: confirmedOptions,
    } = await bs5dialog.confirm(
      `
      <h6>Please review your answers and confirm test completion</h6>
      ${confirm_html}
      `,
      options
    );
  } else {
    bs5dialog.alert(
      `Not all questions are answered. 
       <div>Cannot save quiz before every question is answered.</div>
       Unanswered questions are highlighted with red.
       `,
      {
        title: "Alert",
        type: "danger",
        size: "md",
        btnOkText: "OK",
        timeout: 0,
      }
    );
  }
}

window.onload = async () => {
  initCommonGlobalState();

  console_debug(
    "quiz_run:430 session_save_data_available()::",
    session_save_data_available()
  );

  if (session_save_data_available()) {
    const additional_data = restore_session_data("quiz_container");
    console_debug("quiz_run:439 additional_data::", additional_data);
    console_debug("quiz_run:440 start_moment::", start_moment);
    console_debug(
      "quiz_run:440 additional_data.start_moment::",
      additional_data.start_moment
    );
    start_moment = moment(additional_data.start_moment);
    console_debug("quiz_run:440 start_moment 2::", start_moment);
  } else {
    const urlParams = new URL(window.location.toLocaleString()).searchParams;
    const quiz_id = urlParams.get("id");
    //   console.log("quiz_id :>> ", quiz_id);

    await load_quiz(quiz_id);
  }
  save_page_to_sesssion("quiz_container", {
    quiz_to_complete: quiz_to_complete,
    start_moment: start_moment,
  });

  document
    .getElementById("save-quiz-button")
    .addEventListener("click", save_quiz);

  timer_interval = setInterval(update_timer, 1000);
};
