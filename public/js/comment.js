import { navState, topnavEvent, sidenavEvent } from "./utlis/nav.js";
import { fetchReactionData } from "./utlis/api.js";
import { delayVisibility } from "./utlis/domUtils.js";

const check = localStorage.getItem("navState");

const cmtBtn = document.querySelector(".cmt-submit");
let optBtn = [];
let optBtnB = [];
let userId;
let prevBtn;
const line = new EventSource(`/reaction/stream/`);
const source = new EventSource(`/comments/stream/${cmtBtn.dataset.id}`);

document.addEventListener("DOMContentLoaded", () => {
  navState(check);
  topnavEvent();
  sidenavEvent();
  releventCmt();
  intCmtBtn();
  initCmtSec();
  openComentSection();
  closeCommentSection();
  postEvent();
  updatePostReactions();
  liveCmtReload();
  closeLiveServer();
  handleDocumentClick();
  delayVisibility();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function updatePostReactions() {
  line.onmessage = async (event) => {
    const result = JSON.parse(event.data);

    const post = document.getElementById(`p${result.postId}`);
    if (!post) {
      return console.log("no post");
    }

    post.querySelector(".like-t").innerHTML = result.like;
    post.querySelector(".dislike-t").innerHTML = result.dislike;
  };
}

function liveCmtReload() {
  source.onmessage = async (event) => {
    const data = JSON.parse(event.data);

    await releventCmt();
  };
}

function closeLiveServer() {
  window.addEventListener("beforeunload", () => {
    line.close();
    source.close();
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
                      ><p style="font-size: small; font-weight: 450">
                        ${cmt.first_name} ${cmt.last_name}
                      </p></a
                    >
                    <div class="p-opt flex" style="margin-left: auto">
                      <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                      <div class="p-optD">
                            <button class="p-opt-btn" data-cmt="${cmt.cmt_id}">
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
                    <p style="font-size: small; font-weight: 450">
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
}

function intCmtBtn() {
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
}

function initCmtSec() {
  document.querySelector(".comment").addEventListener("click", () => {
    document.querySelector(".comment").classList.remove("cmt");
    document.querySelector(".temp").classList.add("displayOff");
    document
      .getElementById("commentInput")
      .setAttribute("style", "display:block");
    document.querySelector(".comment-func").classList.add("displayOn");
  });
}

function openComentSection() {
  document.querySelector(".discuss-btn").addEventListener("click", () => {
    document.querySelector(".comment").classList.remove("cmt");
    document.querySelector(".temp").classList.add("displayOff");
    document
      .getElementById("commentInput")
      .setAttribute("style", "display:block");
    document.querySelector(".comment-func").classList.add("displayOn");
  });
}

function closeCommentSection() {
  document.querySelector(".cancel").addEventListener("click", () => {
    document.querySelector(".comment-func").classList.remove("displayOn");
    document.getElementById("commentInput").removeAttribute("style");
    document.querySelector(".temp").classList.remove("displayOff");
    document.querySelector(".comment").classList.add("cmt");
    document.getElementById("commentInput").value = "";
  });
}

function postEvent() {
  const wrapper = document.querySelector(".post-wrapper");

  if (!wrapper) return;

  wrapper.addEventListener("click", async (e) => {
    e.stopPropagation();
    let reaction;
    const post = e.target.closest(".post");
    const optBtnt = e.target.closest(".p-opt");
    const like = e.target.closest(".like");
    const disLike = e.target.closest(".dislike");
    let eraseCmt = e.target.closest(".p-opt-btn");
    let userId = document.querySelector(".main").dataset.id;

    like && (reaction = "like");
    disLike && (reaction = "disLike");

    if (reaction) {
      let postId = post.dataset.id;
      let data = { userId };
      const opt = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      };
      let result = await fetchReactionData(reaction, postId, opt);
      if (result.error === true) {
        console.log(result.message);
      }

      return;
    }

    if (eraseCmt) {
      const id = eraseCmt.dataset.cmt;
      cmtDelete(id);
    }

    if (optBtnt) {
      if (prevBtn === optBtnt) {
        optBtnt.querySelector(".p-optD").classList.toggle("displayBlock");

        return;
      }

      document.querySelectorAll(".p-optD").forEach((btn) => {
        if (btn.classList[1] === "displayBlock")
          btn.classList.remove("displayBlock");
      });
      optBtnt.querySelector(".p-optD").classList.toggle("displayBlock");

      prevBtn = optBtnt;

      return;
    }
  });
}

function handleDocumentClick() {
  document.addEventListener("click", () => {
    optBtnB?.forEach((btn) => {
      if (btn.classList[1] === "displayBlock") {
        btn.classList.remove("displayBlock");
      }
    });
    document.querySelector(".nave-bar").classList.remove("overflow");
  });
}
