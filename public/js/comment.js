const check = localStorage.getItem("navState");
navState(check);

const cmtBtn = document.querySelector(".cmt-submit");
let optBtn = [];
let optBtnB = [];
let userId;
releventCmt();

document.querySelector(".profile").addEventListener("click", (event) => {
  event.stopPropagation();
  document.querySelector(".nave-bar").classList.toggle("overflow");
});

document.addEventListener("click", () => {
  optBtnB.forEach((btn) => {
    btn.classList.remove("displayBlock");
  });
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
  let result = await fetch("/comment", {
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
  await releventCmt();
});

async function releventCmt() {
  let a = "";
  const id = cmtBtn.dataset.id;
  let result = await fetch(`/action/${id}`, {
    method: "GET",
    credentials: "include",
  });
  let value = await result.json();

  let data = value.data;
  userId = value.user_id;
  if (!data) {
    a = `<div class="discuss-box">
                <div class="discuss-post">
                  <p class="discuss-content sm-x text-center">
                    Start the Discussion!!
                  </p>
                </div>
              </div>`;
    return (document.querySelector(".cmt-fill").innerHTML = a);
  }
  data.forEach((cmt) => {
    if (cmt.user_id === userId) {
      a += `<div class="discuss-box">
                <div class="discuss-post">
                  <div class="personal-p flex">
                    <a href="/profile/${cmt.user_id}"
                      ><div class="profile-pic">
                       <img class="p-pic" src="${cmt.profile_pic_url}" alt="" />
                      </div></a
                    >

                    <a href="/profile/${cmt.user_id}"
                      ><p style="font-size: medium">
                        ${cmt.first_name} ${cmt.last_name}
                      </p></a
                    >
                    <div class="p-opt flex" style="margin-left: auto">
                      <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                      <div class="p-optD">
                            <button class="p-opt-btn" onclick="event.stopPropagation();cmtDelete(${cmt.cmt_id});" >
                            <i class="fa fa-trash" aria-hidden="true"></i>
                            Delete
                          </button>
                        
                      </div>
                    </div>
                  </div>

                  <p class="discuss-content sm-x">${cmt.comment}</p>
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
    } else {
      a += `<div class="discuss-box">
                <div class="discuss-post">
    <a href="/profile/${cmt.user_id}" class="personal-p flex">
                    <div class="profile-pic">
                      <img class="p-pic" src="${cmt.profile_pic_url}" alt="" />
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
    }
  });
  document.querySelector(".cmt-fill").innerHTML = a;

  optBtn = document.querySelectorAll(".p-opt");

  optBtnB = document.querySelectorAll(".p-optD");

  optBtn.forEach((btn, i) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      optBtnB[i].classList.toggle("displayBlock");
    });
  });
}

async function cmtDelete(a) {
  let data = { id: a };
  await fetch(`/cmtdelete/${cmtBtn.dataset.id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  await releventCmt();
}

const source = new EventSource(`/comments/stream/${cmtBtn.dataset.id}`);

source.onmessage = async (event) => {
  const data = JSON.parse(event.data);

  await releventCmt();
};

window.addEventListener("beforeunload", () => {
  source.close();
});

///////////////////////////////////////////////////////////

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

    // if (post) {
    //   window.location = `/comment/${postId}`;

    //   return;
    // }
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
