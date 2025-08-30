document.querySelector(".profile").addEventListener("click", () => {
  document.querySelector(".nave-bar").classList.toggle("overflow");
});

document.querySelector(".comment").addEventListener("click", () => {
  console.log("open");
  document.querySelector(".comment").classList.remove("cmt");
  document.querySelector(".temp").classList.add("displayOff");
  document
    .getElementById("commentInput")
    .setAttribute("style", "display:block");
  document.querySelector(".comment-func").classList.add("displayOn");
});

document.querySelector(".discuss-btn").addEventListener("click", () => {
  console.log("open");
  document.querySelector(".comment").classList.remove("cmt");
  document.querySelector(".temp").classList.add("displayOff");
  document
    .getElementById("commentInput")
    .setAttribute("style", "display:block");
  document.querySelector(".comment-func").classList.add("displayOn");
});

document.querySelector(".cancel").addEventListener("click", () => {
  console.log("close");
  document.querySelector(".comment-func").classList.remove("displayOn");
  document.getElementById("commentInput").removeAttribute("style");
  document.querySelector(".temp").classList.remove("displayOff");
  document.querySelector(".comment").classList.add("cmt");
  document.getElementById("commentInput").value = "";
});
