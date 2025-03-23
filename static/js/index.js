var start_quiz_no = 0;
var limit = 9;

window.onload = async () => {
  console.log("Hello :>> ", BASE_URL);

  await reload_quizzes();
  document
    .getElementById("sort-selector")
    .addEventListener("change", async () => {
      await reload_quizzes();
    });
};

async function reload_quizzes() {
  let quizzesJSON = await fetch_quizzes();
  console.log("quizzesJSON :>> ", quizzesJSON);
  render_quizzes(quizzesJSON);
}

function get_sort_option() {
  const sort_selector = document.getElementById("sort-selector");
  var sort_by = "name";
  var sort_order = "asc";
  const sort_option_selected = Number(
    sort_selector.options[sort_selector.selectedIndex].value
  );
  console_debug("index:22 sort_option_selected::", sort_option_selected);
  switch (sort_option_selected) {
    case 2:
      sort_order = "desc";
      break;
    case 3:
      sort_by = "questions_no";
      break;
    case 4:
      sort_by = "questions_no";
      sort_order = "desc";
      break;
  }
  console_debug("index:27 sort_order::", sort_order);

  return {
    sort_by: sort_by,
    sort_order: sort_order,
  };
}

function url_query_from_fields(obj_to_encode) {
  var ret_str = "";
  for (fld in obj_to_encode) {
    console_debug("index:49 fld::", fld);
    ret_str += `&${fld}=${encodeURI(obj_to_encode[fld])}`;
  }
  return ret_str;
}

async function fetch_quizzes() {
  const sortOptions = get_sort_option();
  console_debug("index:15 sortOption::", sortOptions);
  const query_str = url_query_from_fields({
    orderby: sortOptions.sort_by,
    sortorder: sortOptions.sort_order,
    start: start_quiz_no,
    limit: limit,
  });
  console_debug("index:65 query_str::", query_str);
  let url = `${BASE_URL}/api/quizzes?${query_str}`;
  console.log("url :>> ", url);
  let responce = await fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  // console.log("responce :>> ", responce);
  return await responce.json();
}

async function delete_item_click(itm) {
  console.log("delete_item_click :>> ", itm);
  console.log("itm.dataset.id :>> ", itm.dataset.id);
  const url = `${BASE_URL}/api/quizzes/${itm.dataset.id}`;
  const responce = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const res_json = await responce.json();
  console.log("responce :>> ", res_json);
  if (res_json.status == "success") {
    window.location = BASE_URL;
  }
}

async function pagination_change(page_no) {
  console_debug("index:96 page_no::", page_no);
  // bs5dialog.alert("This is an alert message.", {
  //   title: "Alert",
  //   type: "warning",
  //   size: "md",
  //   btnOkText: "OK",
  //   onOk: () => {
  //     console.log("OK button clicked.");
  //   },
  //   timeout: 5000,
  // });
  start_quiz_no = Math.floor((page_no - 1) * limit);
  console_debug("index:100 new_start::", start_quiz_no);
  await reload_quizzes();
}

const PAGINATION_LINK_TEMPLATE = `<a href="#" onclick="pagination_change({{page_no}})">{{page_no}}</a> `;
const PAGINATION_CURRENT_PAGE_TEMPLATE = `<span>{{page_no}}</span> `;

function render_pagination(quizzes_json) {
  console.log("render_pagination :>> ");
  let total_pages = Math.floor(quizzes_json.total_count / limit);
  if (quizzes_json.total_count % limit > 0) total_pages++;
  console_debug("index:100 total_pages::", total_pages);

  const current_page = Math.floor(start_quiz_no / limit) + 1;
  console_debug("index:109 current_page::", current_page);
  let pagination_links = "";
  for (let i = 1; i <= total_pages; i++) {
    if (i == current_page) {
      pagination_links += Mustache.render(PAGINATION_CURRENT_PAGE_TEMPLATE, {
        page_no: i,
      });
    } else {
      pagination_links += Mustache.render(PAGINATION_LINK_TEMPLATE, {
        page_no: i,
      });
    }
  }
  document.getElementById("pagination-span").innerHTML = pagination_links;
}

function render_quizzes(quizzes_json) {
  const quiz_arr = quizzes_json.quizzes;
  let resHTML = quiz_arr.reduce((accum, currVal) => {
    accum += Mustache.render(QUIZ_TEMPLATE_FLOATING, {
      quiz: currVal,
    });
    return accum;
  }, "");
  if (resHTML.length == "") resHTML = "No quizzes yet";
  document.getElementById("quizzes-holder").innerHTML = resHTML;

  render_pagination(quizzes_json);
}

// const QUIZ_TEMPLATE = `
//   <div class="border text-start">
//     <h3>{{quiz.name}}</h3>
//     {{quiz.description}}
//     <a href="questionnaire_builder.html?id={{quiz.id}}">Edit</a>
//     <a href="#" data-id="{{quiz.id}}" onclick="delete_item_click(this)">Delete</a>
//     <a href="#">Run</a>
//   </div>
// `;
