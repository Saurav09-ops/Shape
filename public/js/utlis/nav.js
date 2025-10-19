import { addClass, toggleClass } from "./domUtils.js";

export function navState(a) {
  const state = Number(a);
  const leftNav = document.querySelector(".main-navL");
  const leftNavBtn = document.querySelector(".MnavL-btn");
  const lnavEl = document.querySelector(".demo");

  if (!state) {
    return;
  } else {
    leftNav.setAttribute("style", "transition: none;");
    leftNavBtn.setAttribute("style", "transition: none;");

    addClass(leftNav, "main-navL-width");

    addClass(leftNavBtn, "btnL");

    addClass(lnavEl, "demoOP");
    setTimeout(() => {
      leftNav.removeAttribute("style");
      leftNavBtn.removeAttribute("style");
    }, 200);
  }
}

export function topnavEvent() {
  const profile = document.querySelector(".profile");
  const topNav = document.querySelector(".nave-bar");

  profile.addEventListener("click", (event) => {
    event.stopPropagation();

    toggleClass(topNav, "overflow");
  });
}

export function sidenavEvent() {
  const leftNav = document.querySelector(".main-navL");
  const leftNavBtn = document.querySelector(".MnavL-btn");
  const lnavEl = document.querySelector(".demo");

  leftNavBtn.addEventListener("click", () => {
    toggleClass(leftNav, "main-navL-width");
    checking();

    toggleClass(leftNavBtn, "btnL");

    toggleClass(lnavEl, "demoOP");
  });
}

export function checking() {
  let a = document.querySelector(".main-navL").classList;

  if (a.length === 1) {
    return localStorage.setItem("navState", 0);
  }
  return localStorage.setItem("navState", 1);
}
