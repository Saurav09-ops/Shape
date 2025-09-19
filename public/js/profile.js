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

document.getElementById("option2").addEventListener("click", async () => {
  await profileCmt();
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

async function profileCmt() {
  let a = "";
  let profileId = document.querySelector(".post-wrapper").dataset.id;

  let result = await fetch(`/profilecmt/${profileId}`, {
    method: "GET",
    credentials: "include",
  });
  let value = await result.json();
  if (value.status) {
    a = `<div class="post-cover text-center" style="border: none; margin-top: 3rem; font-size: larger; font-weight: 400;">
  Not commented yet
</div>`;
    document.getElementById("content").innerHTML = a;
    return;
  }
  let post = value.data;

  post.forEach((post) => {
    a += `<div class="post-cover" >
          <div class="post" >
            <div class="personal-p flex">
              <a href="/profile/${post.user_id}"
                ><div class="profile-pic">
                  <!-- <img class="" src="/assets/google.png" alt="" /> -->
                </div></a
              >

              <a href="/profile/${post.user_id}"
                ><p style="font-size: small; font-weight: 450">
                  ${post.first_name} ${post.last_name}
                </p></a
              >

             
              <p style="font-size: 0.7rem; font-weight: 250" >• ${post.title}</p>

            </div>

            

            <p class="post-detail sm-x" font-weight: 500">${post.comment}</p>

            <div class="function flex">
                <button>
                  <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                  <span>1</span>
                </button>
                <button>
                  <i class="fa fa-thumbs-down" aria-hidden="true"></i>
                  <span>1</span>
                </button>
                <button>
                  <i class="fa fa-comment" aria-hidden="true"></i> <span>1</span>
                </button>
              </div>
          </div>
          </div>`;
  });

  document.getElementById("content").innerHTML = a;
}
