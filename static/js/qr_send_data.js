console.log("Hello quiz run save data :>> ");

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
  const send_url = `${BASE_URL}/api/answered-quizzes`;
  const res_json = await (
    await fetch(send_url, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(quiz_collected.answered_quiz),
    })
  ).json();
  if (res_json.status == "success") {
    console.log("All is good :>> ");
    show_message_next_page("Completed quiz was saved successfully");
    window.location = `${BASE_URL}/index.html`;
  }
} //async function send_completed_quiz(quiz_collected) {

function collect_single_choice(question_obj) {
  const ret = {
    validation_passed: true,
    value: "",
    value_id: "NO_ID_ERROR",
  };

  const selected_radio = document.querySelector(
    `input[name="${question_obj.id}-radio-group"]:checked`
  );
  if (selected_radio === null) {
    mark_question_red(question_obj.id);
    ret.validation_passed = false;
  } else {
    unmark_question_red(question_obj.id);

    const el_id = selected_radio.id;
    const choice_id = el_id.substring(0, el_id.length - "-choice-radio".length);
    const selected_choice = question_obj.choices.filter((curr_choice) => {
      return curr_choice.id == choice_id;
    });
    ret.value = selected_choice[0].text;
    ret.value_id = selected_choice[0].id;
  }
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
    // console_debug("quiz_run:193 checkbox_el::", checkbox_el);
    // console_debug("quiz_run:193 checkbox_el.checked::", checkbox_el.checked);
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
  //   console_debug("quiz_run:203 ret::", ret);
  return ret;
} //function collect_multi_choice(queston_obj) {

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

  return {
    answered_quiz: answered_quiz,
    validation_passed: validation_passed,
  };
} //function collect_quiz_data() {
