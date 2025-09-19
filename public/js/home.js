const check = localStorage.getItem("navState");

navState(check);

let optBtn = [];
let optBtnB = [];
optBtn = document.querySelectorAll(".p-opt");
optBtnB = document.querySelectorAll(".p-optD");

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
  console.log(localStorage.getItem("navState"));
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
