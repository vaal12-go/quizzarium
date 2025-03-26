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

const CONFIRM_Q_TEMPLATE = `
  <div>
    <span style="font-weight: bold;">{{question_text}}</span>
    <div>
      Answer(s): {{{answers_html}}}
    </div
  </div>
`;
