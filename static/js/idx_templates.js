const QUIZ_TEMPLATE_FLOATING = `
<!-- Quiz card template -->
  <div class="border text-start quiz-floating-card">
    <div style="background-color: bisque;  height:30px;">
      <div style="float: left; width: 180px; padding: 3px;">
        <h6>{{quiz.name}}</h6>
      </div>

      <div style="float: right; font-size: x-small; padding: 3px;">
        <a href="questionnaire_builder.html?id={{quiz.id}}">Edit</a>
        <a href="#" data-id="{{quiz.id}}" onclick="delete_item_click(this)">
            Delete
        </a>
        <a href="quiz_run.html?id={{quiz.id}}">Run</a>
      </div>

      <div style="float: right; font-size: x-small; padding: 3px;">
        Questions: {{quiz.questions_no}} | Completions: 3'
      </div>
      &nbsp;
    </div>

    <div style="clear: both; font-size: small; text-align: center;">
      {{quiz.description}}
    </div>
  </div>
<!-- END Quiz card template -->
`;
