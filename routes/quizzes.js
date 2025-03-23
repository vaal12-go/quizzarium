import router from "./router.js";
import { quiz, answered_quiz } from "../server/models.js";
import { console_debug } from "../server/utils.js";

router.get("/", async (req, res) => {
  res.send("I am test route");
});

router.get("/quizzes", async (req, res) => {
  console.log("api/quizzes :>> ", req.query);

  const start = Number(req.query.start);
  const limit = Number(req.query.limit);

  const quizzes = await quiz
    .query()
    .orderBy(req.query.orderby, req.query.sortorder)
    .range(start, start + limit - 1);

  const total_quizzes = quizzes.total;

  const res_obj = {
    total_count: total_quizzes,
    start: req.query.start,
    limit: req.query.limit,
    quizzes: quizzes.results,
  };
  res.json(res_obj);
});

router.get("/quizzes/:id", async (req, res) => {
  // console.log("api/quizzes :>> ");
  // console.log("req.params :>> ", req.params);
  let quizzes = await quiz.query().where("id", "=", req.params.id);

  // console_debug("quizzes:56 quizzes::", quizzes);
  if (quizzes.length == 0) {
    return res.status(404).json({
      status: "error",
      description: `Quiz with id ${req.params.id} not found`,
    });
  }

  if (quizzes[0].questions_json === null) {
    quizzes[0].questions_json = JSON.stringify([]);
  }
  // console_debug("quizzes:56 AFTER quizzes::", quizzes);

  res.send(quizzes[0]);
}); //router.get("/quizzes/:id", async (req, res) => {

function quiz_preflight_check(questions_arr) {
  const issues = questions_arr.reduce((accum, curr_question) => {
    if (curr_question.question.trim() == "") {
      accum.push(`Question #${curr_question.id} has empty question text`);
    }
    curr_question.choices.reduce((choices_accum, curr_choice) => {
      if (curr_choice.text.trim() == "")
        choices_accum.push(
          `Question #${curr_question.id} choice ${curr_choice.id} has empty text`
        );
      return choices_accum;
    }, accum);
    return accum;
  }, []);

  if (questions_arr.length == 0) {
    issues.push(`Quiz has no questions`);
  }

  return issues;
}

function prepare_quiz_for_saving(quiz) {
  const q_arr = prepare_question_array(quiz);
  const questions_no = q_arr.length;

  const quiz_issues = quiz_preflight_check(q_arr);
  var can_be_completed = 1;
  var check_result = "";
  if (quiz_issues.length > 0) {
    can_be_completed = 0;
    check_result = quiz_issues.join(" \n");
  }

  const ret = {
    name: quiz.name,
    description: quiz.description,
    questions_json: JSON.stringify(q_arr),
    questions_no: questions_no,
    completed_no: -1,
    can_be_completed: can_be_completed,
    preflight_check_result: check_result,
  };
  return ret;
}

router.post("/quizzes", async (req, res) => {
  console.log("Quizzes POST hit :>> ", req.body);
  let quiz_2_insert = req.body;

  // Because this is new quiz will need to insert without questions to get quizid
  let new_quiz = {
    name: quiz_2_insert.name,
    description: quiz_2_insert.description,
  };
  new_quiz = await quiz.query().insert(new_quiz);

  quiz_2_insert.id = new_quiz.id;
  const prepared_quiz_obj = prepare_quiz_for_saving(quiz_2_insert);

  const update_query = await quiz
    .query()
    .findById(quiz_2_insert.id)
    .patch(prepared_quiz_obj);

  // TODO: check for number of inserted entries and return error if not ===1
  res.status(200).json({
    status: "success",
    quiz: quiz_2_insert,
  });
});

function prepare_choices_array(choice_arr, q_id) {
  let c_no = 0;
  const ret = choice_arr.reduce((accum, curr_choice) => {
    console_debug("quizzes:61 curr_choice::", curr_choice);
    curr_choice.id = `${q_id}_c${c_no}`;
    c_no++;
    accum.push(curr_choice);
    return accum;
  }, []);
  return ret;
}

function prepare_question_array(quiz_obj) {
  let q_no = 0;
  const ret = quiz_obj.questions.reduce((accum, curr_q) => {
    console.log("curr_q :>> ", curr_q);
    curr_q.id = `quiz${quiz_obj.id}_q${q_no}`;
    q_no++;

    if (curr_q.type == 2 || curr_q.type == 3) {
      curr_q.choices = prepare_choices_array(curr_q.choices, curr_q.id);
    }
    accum.push(curr_q);
    return accum;
  }, []);
  console_debug("quizzes:49 ret::", ret);

  return ret;
}

router.patch("/quizzes", async (req, res) => {
  // console.log("patch Quizzes hit :>> ", req.body);
  let quiz_2_patch = req.body;

  // const q_arr = prepare_question_array(quiz_2_patch);
  // const questions_no = q_arr.length;

  const prepared_quiz_obj = prepare_quiz_for_saving(quiz_2_patch);
  // console_debug("quizzes:166 PATCH prepared_quiz_obj::", prepared_quiz_obj);

  const update_query = quiz
    .query()
    .findById(quiz_2_patch.id)
    .patch(prepared_quiz_obj);

  const num_updated = await update_query;

  if (num_updated == 1) {
    const quiz_updated = await quiz.query().findById(quiz_2_patch.id);

    // console_debug("quizzes:174 quiz_updated::", quiz_updated);
    return res.status(200).send({
      status: "success",
      quiz: quiz_updated,
    });
  } else {
    return res.status(500).send({
      status: "error",
      description: `No (or too many) [${num_updated}] quiz records updated with PATCH request.`,
      url: req.url,
    });
  }
}); //router.patch("/quizzes", async (req, res) => {

router.delete("/quizzes/:id", async (req, res) => {
  const quizID = Number(req.params.id, 10);
  console.log("quizID :>> ", quizID);
  if (isNaN(quizID)) {
    return res.status(400).send({
      status: "error",
      description: `id for quiz to be deleted is not correct:'${quizID}'. With URL called:${req.url}'`,
    });
  }
  // console.log("delete quiz hit ID:>> ", quizID);
  const quiz_to_delete = await quiz.query().findById(quizID);
  // console.log(" quiz_to_delete :>> ", quiz_to_delete);
  if (!(quiz_to_delete instanceof quiz)) {
    return res.status(404).send({
      status: "error",
      url: `${req.url}`,
      description: `id for quiz to be deleted cannot be found:'${quizID}''`,
    });
  }
  const numDeleted = await quiz.query().deleteById(quizID);
  return res.status(200).send({
    status: "success",
  });
});
