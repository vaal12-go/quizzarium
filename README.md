# Quizzarium

Express.js application to manage quizzes.


## Test deployment:
[Deployment link](http://23.95.225.112:3000/)

## Followind requirements were implemented

### Base level:

* Questionnaire catalog page: page where users can observe the paginated list of
available questionnaires. Card should consist of:
    - questionnaire name;
    - description;
    - amount of questions;
    - amount of completions;
    - actions: edit/run/delete (“edit” action should page similar to creation page);

* Questionnaire builder page: page where users can create a questionnaire by adding
multiple questions.
    Possible question types:
    - text - free-form user input;
    - single choice - user can select only one of the possible answers (radio buttons);
    - multiple choices - user can select several answers (checkbox buttons);
    Once the questionnaire is submitted, it should be stored in a database.

* Interactive questionnaire page: page where users can complete the questionnaire
created earlier. At the end of the questionnaire the user should see all his answers and
the time it took to complete the questionnaire. Once the questionnaire is completed,
responses should be stored in the database. This page should be available by clicking
on the “Run” action.


### Middle level

* Everything from the base level
* Questionnaire catalog page: add ability to sort questionnaires by: name, amount of
questions, amount of completions.
* Questionnaire builder page: add “drag and drop” functionality to allow user to
re-order questions/answers by dragging them;
* NOT DONE: Interactive questionnaire page: save intermediate completion state so that when the
user refreshes the page he can continue from where he left.

### Advanced level
    
NOT DONE
