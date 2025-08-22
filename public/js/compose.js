const titleInput = document.querySelector("#titleInput");
const title = document.querySelector(".title");

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
