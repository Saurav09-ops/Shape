const titleInput = document.querySelector("#titleInput");
const title = document.querySelector(".title");

const check = localStorage.getItem("navState");

navState(check);

document.querySelector(".MnavL-btn").addEventListener("click", () => {
  document.querySelector(".main-navL").classList.toggle("main-navL-width");
  checking();
  console.log(localStorage.getItem("navState"));
  document.querySelector(".MnavL-btn").classList.toggle("btnL");
  document.querySelector(".demo").classList.toggle("demoOP");
});

document.querySelector(".profile").addEventListener("click", (event) => {
  event.stopPropagation();
  document.querySelector(".nave-bar").classList.toggle("overflow");
});

document.addEventListener("click", () => {
  document.querySelector(".nave-bar").classList.remove("overflow");
});

titleInput.addEventListener("input", () => {
  let count = titleInput.value.length;
  document.querySelector(".count").innerHTML = count;
});

titleInput.addEventListener("focus", () => {
  let a = document.querySelector(".title").classList;

  a.forEach((a) => {
    if (a === "error") {
      title.classList.remove("error");
    }
  });
  title.classList.add("focus");
});

titleInput.addEventListener("blur", () => {
  if (!titleInput.value) {
    title.classList.remove("focus");
    title.classList.add("error");
  } else {
    title.classList.remove("focus");
    document.querySelector(".post-b").classList.remove("disabled");
  }
});

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

function checking() {
  let a = document.querySelector(".main-navL").classList;

  if (a.length === 1) {
    return localStorage.setItem("navState", 0);
  }
  return localStorage.setItem("navState", 1);
}
