pageState();
const check = localStorage.getItem("navState");
const check2 = localStorage.getItem("prState");
navState(check);

if (!check2) {
  profileNav();
}

const update = document.querySelector(".update");
const updateBtn = document.querySelectorAll(".update-btn");
let optBtn = [];
let optBtnB = [];
optBtn = document.querySelectorAll(".p-opt");
optBtnB = document.querySelectorAll(".p-optD");

const posts = window.serverData.posts;

document.querySelector(".profile").addEventListener("click", (event) => {
  event.stopPropagation();
  document.querySelector(".nave-bar").classList.toggle("overflow");
});

document.querySelector(".MnavL-btn").addEventListener("click", () => {
  document.querySelector(".main-navL").classList.toggle("main-navL-width");
  checking();
  console.log(localStorage.getItem("navState"));
  document.querySelector(".MnavL-btn").classList.toggle("btnL");
  document.querySelector(".demo").classList.toggle("demoOP");
});

optBtn.forEach((btn, i) => {
  btn.addEventListener("click", (event) => {
    event.stopPropagation();
    optBtnB[i].classList.toggle("displayBlock");
  });
});

document.addEventListener("click", () => {
  optBtnB.forEach((btn) => {
    btn.classList.remove("displayBlock");
  });

  document.querySelector(".nave-bar").classList.remove("overflow");
});

updateBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const index = btn.dataset.index;

    update.innerHTML = ` <button class="update-btn_close">
            <i class="fa fa-times" aria-hidden="true"></i>
          </button>
          <form action="/update/${id}" method="post">
            <h4 class="post-title ssm-x">${posts[index].title}</h4>
            <div class="detail" style="height: 80%">

                <textarea
                id="detail"
                name="detail"
                placeholder="Description...."
                style="line-height: 1.6; word-spacing: 2px; height: 100%">${posts[index].detail}</textarea>
                   
                

              <button class="btn" type="submit">Post</button>
            </div>
          </form>`;

    update.classList.add("update-after");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    document
      .querySelector(".update-btn_close")
      .addEventListener("click", () => {
        update.classList.remove("update-after");
      });
  });
});

function checking() {
  let a = document.querySelector(".main-navL").classList;

  if (a.length === 1) {
    return localStorage.setItem("navState", 0);
  }
  return localStorage.setItem("navState", 1);
}

function navState(a) {
  const state = Number(a);

  if (!state) {
    return;
  } else {
    document
      .querySelector(".main-navL")
      .setAttribute("style", "transition: none;");
    document
      .querySelector(".MnavL-btn")
      .setAttribute("style", "transition: none;");

    document.querySelector(".main-navL").classList.add("main-navL-width");
    document.querySelector(".MnavL-btn").classList.add("btnL");
    document.querySelector(".demo").classList.add("demoOP");
    setTimeout(() => {
      document.querySelector(".main-navL").removeAttribute("style");
      document.querySelector(".MnavL-btn").removeAttribute("style");
    }, 200);
  }
}

function profileNav() {
  document.getElementById("option1").checked = true;
  localStorage.setItem("prState", 1);
}
function pageState() {
  if (performance.getEntriesByType("navigation")[0].type === "reload") {
    return localStorage.setItem("prState", 1);
  }
  return localStorage.removeItem("prState");
}
