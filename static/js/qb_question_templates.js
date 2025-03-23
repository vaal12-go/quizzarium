const QUESTION_ADD_TEMPLATE = `
    <!-- question template -->
    <div class="container">
      <div class="row pb-2 align-items-end">
        <div class="col-7">
          <span id="q_new-question-number-span">2</span>.
          <!-- TODO: add ids and update label 'for' attribute to match questions -->
          <label for="q1-question_text_inp" class="form-label"
            >Question</label
          >
          <input
            type="text"
            class="form-control"
            id="q_new-question_text_inp"
            placeholder="question"
          />
        </div>
        <div class="col-3">
          <label for="q1-question-type" class="form-label"
            >Type</label
          >
          <select class="form-select" id="q_new-question-type-select">
            <option value="-1" selected>Not selected</option>
            <option value="1">Text</option>
            <option value="2">Single choice</option>
            <option value="3">Multiple choice</option>
            <!-- <option value="3">Image</option> -->
          </select>
        </div>
        <div class="col-1">
          <button
            id="q_new-remove-question-btn"
            type="button"
            class="btn btn-secondary"
          >
            Remove
          </button>
        </div>
      </div>
    </div>

    <!-- Choice answers -->
    <div id="q_new-choice-container" class="container no-display">
        <div class="row">
            <div class="col-6 ms-4 mb-2">
                Answers 
                <button id="q_new-add-choice-btn" type="button" class="btn btn-secondary">
                    Add choice
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col-9">
            <ul class="choices_list choice-holder-list">
            </ul>
            </div>
        </div>
        
    </div>
    <!-- END Choice answers -->
    <!-- END question template -->
`;

const CHOICE_ADD_TEMPLATE = `
<div class="row ms-4 mb-1 align-items-center">
    <div class="col-9">
        <div class="input-group mb-1">
            <span id="c_new-choice-number-span" class="input-group-text" id="basic-addon3">1</span>
            <input
            type="text"
            class="form-control"
            id="c_new-choice-text-inp"
            placeholder="choice"
            />
        </div>
    </div>
    {{#remove_btn_visible}}
        <div class="col-3">
            <button type="button" class="btn btn-secondary">
            Remove
            </button>
        </div>
    {{/remove_btn_visible}}
</div>
`;
