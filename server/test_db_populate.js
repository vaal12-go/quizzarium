// import knex from "knex";
import { quiz, answered_quiz } from "./models.js";

// Three questions (all types) - new
//[{"question":"What is your name?","type":1,"q_ui_id":0,"choices":[],"id":"quiz2_q0"},{"question":"Do you have pets?","type":2,"q_ui_id":1,"choices":[{"text":"Yes","id":"quiz2_q1_c0"},{"text":"No","id":"quiz2_q1_c1"}],"id":"quiz2_q1"},{"question":"How many pets you have?","type":3,"q_ui_id":2,"choices":[{"text":"1","id":"quiz2_q2_c0"},{"text":"2..10","id":"quiz2_q2_c1"},{"text":">10","id":"quiz2_q2_c2"}],"id":"quiz2_q2"}]

const q_arr = [
  '[{"question":"Text test q 1","type":1,"db_id":"quiz1_q2"}]',
  '[{"question":"Text test q 1","type":1,"db_id":"quiz1_q3"},{"question":"Text test q 2","type":1,"db_id":"quiz1_q4"}]',
  '[{"question":"Text test q 2","type":1,"db_id":"quiz1_q4"},{"question":"Text test q 3","type":1,"db_id":"quiz1_q5"},{"question":"Text test q 1","type":1,"db_id":"quiz1_q6"}]',
  '[{"question":"1. Text test q 3 (now text)","type":1,"choices":[],"db_id":"quiz1_q4"},{"question":"2. Text test q 2","type":2,"choices":["Q1 choice 1","Q1 choice 2"],"db_id":"quiz1_q5"},{"question":"3. Text test q 1","type":1,"choices":[],"db_id":"quiz1_q6"}]',
];

const DATE_STRING = "22Mar2025_bis";
const NO_QUIZZES_2_ADD = 30;

for (let i = 0; i < NO_QUIZZES_2_ADD; i++) {
  const q_decision = Math.floor(Math.random() * (q_arr.length + 1));
  let no_of_questions = 0;
  let q_arr_str = "[]";
  if (!(q_decision == q_arr.length)) {
    q_arr_str = q_arr[q_decision];
    no_of_questions = q_decision + 1;
  }
  await quiz.query().insert({
    name: `Quiz automatic #${i}`,
    description: `Automatic quiz description for quiz #${i} Date:${DATE_STRING}`,
    questions_no: no_of_questions,
    completed_no: Math.floor(Math.random() * 5),
    questions_json: q_arr_str,
  });
}

process.exit();
