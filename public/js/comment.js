const check = localStorage.getItem("navState");
navState(check);

const cmtBtn = document.querySelector(".cmt-submit");

releventcmt();

document.querySelector(".profile").addEventListener("click", (event) => {
  event.stopPropagation();
  document.querySelector(".nave-bar").classList.toggle("overflow");
});

document.addEventListener("click", () => {
  document.querySelector(".nave-bar").classList.remove("overflow");
});

document.querySelector(".comment").addEventListener("click", () => {
  document.querySelector(".comment").classList.remove("cmt");
  document.querySelector(".temp").classList.add("displayOff");
  document
    .getElementById("commentInput")
    .setAttribute("style", "display:block");
  document.querySelector(".comment-func").classList.add("displayOn");
});

document.querySelector(".discuss-btn").addEventListener("click", () => {
  document.querySelector(".comment").classList.remove("cmt");
  document.querySelector(".temp").classList.add("displayOff");
  document
    .getElementById("commentInput")
    .setAttribute("style", "display:block");
  document.querySelector(".comment-func").classList.add("displayOn");
});

document.querySelector(".cancel").addEventListener("click", () => {
  document.querySelector(".comment-func").classList.remove("displayOn");
  document.getElementById("commentInput").removeAttribute("style");
  document.querySelector(".temp").classList.remove("displayOff");
  document.querySelector(".comment").classList.add("cmt");
  document.getElementById("commentInput").value = "";
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

cmtBtn.addEventListener("click", async () => {
  const Text = document.getElementById("commentInput").value;
  if (Text === "") {
    document.getElementById("commentInput").placeholder =
      "Your thought is needed!";
    document
      .querySelector(".cmt-submit")
      .setAttribute("style", " background-color:rgba(158, 15, 15, 1);");
    return setTimeout(() => {
      document.querySelector(".cmt-submit").removeAttribute("style");
      document.getElementById("commentInput").placeholder = "Discuss..";
    }, 800);
  }
  const id = cmtBtn.dataset.id;
  let cmtData = {
    comment: Text,
    postId: id,
  };
  let result = await fetch("http://localhost:5000/comment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cmtData),
    credentials: "include",
  });
  let data = await result.json();
  if (data.status === "success") {
    document.getElementById("commentInput").value = "";
    document.getElementById("commentInput").placeholder = "Submitted";
    document
      .querySelector(".cmt-submit")
      .setAttribute("style", " background-color:rgb(15, 158, 15);");
    setTimeout(() => {
      document.querySelector(".cmt-submit").removeAttribute("style");
      document.getElementById("commentInput").placeholder = "Discuss..";
    }, 800);
  }
  releventcmt();
});

async function releventcmt() {
  let a = "";
  const id = cmtBtn.dataset.id;
  let result = await fetch(`http://localhost:5000/action/${id}`);
  let data = await result.json();
  console.log(data);
  data.forEach((cmt) => {
    a += `<div class="discuss-box">
                <div class="discuss-post">
    <a href="/profile/${cmt.id}" class="personal-p flex">
                    <div class="profile-pic">
                      <!-- <img class="" src="/assets/google.png" alt="" /> -->
                    </div>
                    <p style="font-size: medium">
                      ${cmt.first_name} ${cmt.last_name}
                    </p>
                  </a>

                  <p class="discuss-content sm-x">
                    ${cmt.comment}
                  </p>
                  <div class="discuss-reaction flex">
                    <button onclick="stopPropagation()">
                      <i class="fa fa-thumbs-up fa-sm" aria-hidden="true"></i>
                      <span>1</span>
                    </button>
                    <button>
                      <i class="fa fa-thumbs-down fa-sm" aria-hidden="true"></i>
                      <span>1</span>
                    </button>
                  </div>
                </div>
              </div>
    `;
  });
  document.querySelector(".cmt-fill").innerHTML = a;
}
