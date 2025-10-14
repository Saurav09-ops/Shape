const check = localStorage.getItem("navState");

navState(check);

let optBtn = [];
let optBtnB = [];
let saveBtn = [];
optBtn = document.querySelectorAll(".p-opt");
optBtnB = document.querySelectorAll(".p-optD");
saveBtn = document.querySelectorAll(".p-opt-btn");
document.querySelector(".profile").addEventListener("click", (event) => {
  event.stopPropagation();
  document.querySelector(".nave-bar").classList.toggle("overflow");
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

document.querySelector(".MnavL-btn").addEventListener("click", () => {
  document.querySelector(".main-navL").classList.toggle("main-navL-width");
  checking();

  document.querySelector(".MnavL-btn").classList.toggle("btnL");
  document.querySelector(".demo").classList.toggle("demoOP");
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

async function save(uId, pId) {
  let data = { userId: uId, postId: pId };
  try {
    let response = await fetch(`/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    let result = await response.json();
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".post-wrapper");

  if (!wrapper) return;

  wrapper.addEventListener("click", async (e) => {
    const post = e.target.closest(".post");
    const like = e.target.closest(".like");
    const disLike = e.target.closest(".dislike");
    let postId = post.dataset.id;
    let userId = document.querySelector(".main").dataset.id;
    if (like) {
      let data = { userId };
      let response = await fetch(`/like/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        return console.log("error");
      }
      result = await response.json();

      return;
    }

    if (disLike) {
      let data = { userId };
      let response = await fetch(`/dislike/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        return console.log("error");
      }
      result = await response.json();

      return;
    }

    if (post) {
      window.location = `/comment/${postId}`;

      return;
    }
  });
});

const line = new EventSource(`/reaction/stream/`);

line.onmessage = async (event) => {
  const result = JSON.parse(event.data);

  const post = document.getElementById(`p${result.postId}`);
  if (!post) {
    return console.log("no post");
  }

  post.querySelector(".like-t").innerHTML = result.like;
  post.querySelector(".dislike-t").innerHTML = result.dislike;
};

window.addEventListener("beforeunload", () => {
  line.close();
});
