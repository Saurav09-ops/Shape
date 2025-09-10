document.querySelector(".profile").addEventListener("click", (event) => {
  event.stopPropagation();
  document.querySelector(".nave-bar").classList.toggle("overflow");
});

document.addEventListener("click", () => {
  document.querySelector(".nave-bar").classList.remove("overflow");
});

document.querySelector(".MnavL-btn").addEventListener("click", () => {
  document.querySelector(".main-navL").classList.toggle("main-navL-width");
  document.querySelector(".MnavL-btn").classList.toggle("btnL");
  document.querySelector(".demo").classList.toggle("demoOP");
});
