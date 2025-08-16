const signUp = document.getElementById("Signup-btn");
const closeBtn = document.querySelector(".close");

signUp.addEventListener("click", () => {
  document.querySelector(".sign-up").classList.add("signup-after");
});

closeBtn.addEventListener("click", () => {
  document.querySelector(".sign-up").classList.remove("signup-after");
});
