let start_moment = moment();
let quiz_to_complete = null;

function update_timer() {
  const curr_moment = moment();
  const diff_seconds = curr_moment.diff(start_moment, "seconds");
  //   console.log("diff :>> ", diff_seconds);
  document.getElementById("time-running-sec-span").innerHTML = diff_seconds;
}

const QUESTION_TEMPLATE = `
<!-- Questions row -->
    <div class="col-3 text-end">
        <h5 id="{{question.id}}-question-title">{{question.question}}</h5>
        {{q_type}}
    </div>
    <div class="col-8">
        {{{input_template}}}
    </div>
<!-- END Questions row -->
`;

const TEXT_INPUT_TEMPLATE = `
    <input
        type="text"
        class="form-control"
        id="{{question.id}}-choice-text-inp"
        placeholder="Enter answer here"
    />
`;

const RADIO_INPUT_TEMPLATE = `

    <div>
    <input class="form-check-input" 
                type="radio" 
                name="{{question_id}}-radio-group" 
                id="{{choice_id}}-choice-radio"
    >
    <label class="form-check-label" for="{{choice_id}}-choice-radio">
        {{choice_text}}
    </label>
    </div>
`;

const CHECKBOX_INPUT_TEMPLATE = `

    <div class="form-check">
        <input class="form-check-input" 
                type="checkbox" value="" 
                id="{{choice_id}}-checkbox-inp">
        <label 
            class="form-check-label" 
            for="{{choice_id}}-checkbox-inp"
            id="{{choice_id}}-checkbox-label"
        >{{choice_text}}</label>
    </div>
`;

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

function collect_single_choice(question_obj) {
  //   console_debug("quiz_run:146 question_obj::", question_obj);
  const ret = {
    validation_passed: true,
    value: "",
    value_id: "NO_ID_ERROR",
  };

  const selected_radio = document.querySelector(
    `input[name="${question_obj.id}-radio-group"]:checked`
  );
  //   console_debug("quiz_run:139 selected_radio::", selected_radio);
  if (selected_radio === null) {
    mark_question_red(question_obj.id);
    ret.validation_passed = false;
  } else {
    unmark_question_red(question_obj.id);

    const el_id = selected_radio.id;
    // console_debug("quiz_run:162 el_id::", el_id);
    const choice_id = el_id.substring(0, el_id.length - "-choice-radio".length);
    // console_debug("quiz_run:167 choice_id::", choice_id);
    const selected_choice = question_obj.choices.filter((curr_choice) => {
      return curr_choice.id == choice_id;
    });
    // console_debug("quiz_run:169 selected_choice::", selected_choice);
    ret.value = selected_choice[0].text;
    ret.value_id = selected_choice[0].id;
  }
  //   console_debug("quiz_run:172 ret::", ret);
  return ret;
} //function collect_single_choice(question_obj) {

function collect_multi_choice(queston_obj) {
  const ret = {
    validation_passed: true,
    values: [],
  };

  ret.values = queston_obj.choices.reduce((accum, curr_choice) => {
    const checkbox_el = document.getElementById(
      `${curr_choice.id}-checkbox-inp`
    );
    console_debug("quiz_run:193 checkbox_el::", checkbox_el);
    console_debug("quiz_run:193 checkbox_el.checked::", checkbox_el.checked);
    if (checkbox_el.checked) {
      accum.push({
        value: curr_choice.text,
        value_id: curr_choice.id,
      });
    }
    return accum;
  }, []);

  if (ret.values.length == 0) {
    mark_question_red(queston_obj.id);
    ret.validation_passed = false;
  } else {
    unmark_question_red(queston_obj.id);
  }
  console_debug("quiz_run:203 ret::", ret);

  return ret;
}

function collect_text_answer(question_id) {
  const ret = {
    validation_passed: true,
    value: "",
  };
  ret.value = document.getElementById(`${question_id}-choice-text-inp`).value;
  if (ret.value.trim() == "") {
    mark_question_red(question_id);
    ret.validation_passed = false;
  } else {
    unmark_question_red(question_id);
  }
  return ret;
} //function collect_text_answer(question_id) {

function collect_quiz_data() {
  //   console.log("collect_quiz_data :>> ");
  //   TODO: add completion date when saving quiz answered
  const answered_quiz = {
    quiz_id: quiz_to_complete.id,
    answered_questions: [],
    completion_seconds: -1,
    date_completed: -1,
  };

  var validation_passed = true;

  answered_quiz.answered_questions = quiz_to_complete.questions.reduce(
    (accum, curr_question) => {
      //   console.log("curr_question.text :>> ", curr_question.question);
      //   console.log("curr_question.type :>> ", curr_question.type);

      const answered_question = {
        question_id: curr_question.id,
        question_text: curr_question.question,
        question_type: curr_question.type,
        answers: [],
      };

      var collected_answer = null;
      //   TODO: refactor so validation and putting collected value happens after switch (returned object have to be unform)
      switch (curr_question.type) {
        case 1:
          // Text
          collected_answer = collect_text_answer(curr_question.id);
          answered_question.answers.push({
            value: collected_answer.value,
          });
          validation_passed =
            collected_answer.validation_passed == false
              ? collected_answer.validation_passed
              : validation_passed;
          break;

        case 2:
          //Single choice
          collected_answer = collect_single_choice(curr_question);
          answered_question.answers.push({
            value: collected_answer.value,
            value_id: collected_answer.value_id,
          });
          validation_passed =
            collected_answer.validation_passed == false
              ? collected_answer.validation_passed
              : validation_passed;

          break;

        case 3:
          // Multiple choice - checkboxes
          collected_answer = collect_multi_choice(curr_question);

          validation_passed =
            collected_answer.validation_passed == false
              ? collected_answer.validation_passed
              : validation_passed;

          answered_question.answers.push(...collected_answer.values);
          break;
      } //switch (curr_question.type) {

      //   console_debug("quiz_run:161 answered_question::", answered_question);
      accum.push(answered_question);
      return accum;
    }, //(accum, curr_question) => {
    []
  ); //answered_quiz.answered_questions = quiz_to_complete.questions.reduce(

  //   console_debug("quiz_run:301 answered_quiz::", answered_quiz);

  return {
    answered_quiz: answered_quiz,
    validation_passed: validation_passed,
  };
} //function collect_quiz_data() {

const CONFIRM_Q_TEMPLATE = `
  <div>
    <span style="font-weight: bold;">{{question_text}}</span>
    <div>
      Answer(s): {{{answers_html}}}
    </div
  </div>
`;

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

async function send_completed_quiz(quiz_collected) {
  clearInterval(timer_interval);

  const curr_moment = moment();
  quiz_collected.answered_quiz.completion_seconds = curr_moment.diff(
    start_moment,
    "seconds"
  );

  console_debug(
    "quiz_run:322 quiz_collected.completion_seconds::",
    quiz_collected.completion_seconds
  );

  // console_debug("quiz_run:322 quiz_collected::", quiz_collected);

  const send_url = `${BASE_URL}/api/answered-quizzes`;
  // console_debug("quiz_run:323 send_url::", send_url);

  const res_json = await (
    await fetch(send_url, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(quiz_collected.answered_quiz),
    })
  ).json();

  console_debug("quiz_run:337 res_json of POSTING answer::", res_json);

  if (res_json.status == "success") {
    console.log("All is good :>> ");
    show_message_next_page("Completed quiz was saved successfully");
    window.location = `${BASE_URL}/index.html`;
  }
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

var timer_interval = null;
window.onload = async () => {
  initCommonGlobalState();

  console_debug(
    "quiz_run:430 session_save_data_available()::",
    session_save_data_available()
  );

  timer_interval = setInterval(update_timer, 1000);

  if (session_save_data_available()) {
    const additional_data = restore_session_data("quiz_container");
    console_debug("quiz_run:439 additional_data::", additional_data);
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
};
