import router from "./router.js";
import { quiz, answered_quiz } from "../server/models.js";
import { console_debug } from "../server/utils.js";

async function get_number_of_completed_quizzes(quiz_id) {
  const res = await answered_quiz
    .query()
    .where({
      quiz_id: quiz_id,
    })
    .count("*", { as: "completed_count" });

  console_debug("answered_quizes:12 res::", res);
  console_debug(
    "answered_quizes:27 res.completed_count::",
    res[0].completed_count
  );

  return res[0].completed_count;
} //async function get_number_of_completed_quizzes(quiz_id) {

router.post("/answered-quizzes", async (req, res) => {
  console.log("Answered quizzes hit :>> ");
  const received_quiz = req.body;
  // console_debug("answered_quiz:8 answered_quiz::", received_quiz);

  const inserted_quiz = await answered_quiz.query().insert({
    quiz_id: received_quiz.quiz_id,
    answers_json: JSON.stringify(received_quiz),
    completion_time_sec: received_quiz.completion_seconds,
  });

  // console_debug("answered_quizes:16 inserted_quiz::", inserted_quiz);

  const no_of_completed = await get_number_of_completed_quizzes(
    inserted_quiz.quiz_id
  );
  // console_debug("answered_quizes:41 no_of_completed::", no_of_completed);

  const update_query = await quiz
    .query()
    .findById(inserted_quiz.quiz_id)
    .patch({
      completed_no: no_of_completed,
    });

  // console_debug("answered_quizes:44 update_query::", update_query);
  // TODO: check for number of returned updated rows. If different from 1 - return error

  res.json({
    status: "success",
    answered_quiz: inserted_quiz,
  });
}); //router.post("/answered-quizzes", async (req, res)=>{
