import { navState, topnavEvent, sidenavEvent } from "./utlis/nav.js";
import { handleDocumentClick } from "./utlis/domUtils.js";
import { delayVisibility } from "./utlis/domUtils.js";

const check = localStorage.getItem("navState");
const titleInput = document.querySelector("#titleInput");
const title = document.querySelector(".title");

document.addEventListener("DOMContentLoaded", () => {
  navState(check);
  topnavEvent();
  sidenavEvent();
  setupTitleValidation();
  handleDocumentClick();
  delayVisibility();
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function setupTitleValidation() {
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
      document.querySelector(".post-b").classList.add("disabled");
    } else {
      title.classList.remove("focus");
      document.querySelector(".post-b").classList.remove("disabled");
    }
  });
}
