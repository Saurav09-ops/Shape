import { navState, topnavEvent, sidenavEvent } from "./utlis/nav.js";
import { handleDocumentClick } from "./utlis/domUtils.js";
import { fetchReactionData } from "./utlis/api.js";
import { delayVisibility } from "./utlis/domUtils.js";

const check = localStorage.getItem("navState");

let prevBtn;
const line = new EventSource(`/reaction/stream/`);
// const saveBtn = document.querySelectorAll(".p-opt-btn");

document.addEventListener("DOMContentLoaded", () => {
  navState(check);
  sidenavEvent();
  topnavEvent();
  postEvents();
  updatePostReactions();
  handleDocumentClick();
  closeLine();
  delayVisibility();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function save(uId, pId) {
  let data = { userId: uId, postId: pId };
  try {
    let response = await fetch(`/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }
    let result = await response.json();
    console.log(result);
  } catch (err) {
    console.log("Error:", err);
    return { error: true, message: err.message || "Unknown error" };
  }
}

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

function closeLine() {
  window.addEventListener("beforeunload", () => {
    line.close();
  });
}

function postEvents() {
  const wrapper = document.querySelector(".post-wrapper");

  if (!wrapper) return;

  wrapper.addEventListener("click", async (e) => {
    e.stopPropagation();
    let reaction;
    const post = e.target.closest(".post");
    const optBtn = e.target.closest(".p-opt");
    const like = e.target.closest(".like");
    const disLike = e.target.closest(".dislike");
    let savePost = e.target.closest(".p-opt-btn");
    let postId = post.dataset.id;
    let userId = document.querySelector(".main").dataset.id;

    like && (reaction = "like");
    disLike && (reaction = "disLike");

    if (reaction) {
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

    if (savePost) {
      const userId = savePost.dataset.user;
      const postId = savePost.dataset.post;
      save(userId, postId);
      return;
    }

    if (optBtn) {
      if (prevBtn === optBtn) {
        return optBtn.querySelector(".p-optD").classList.toggle("displayBlock");
      }

      document.querySelectorAll(".p-optD").forEach((btn) => {
        if (btn.classList[1] === "displayBlock")
          btn.classList.remove("displayBlock");
      });
      optBtn.querySelector(".p-optD").classList.toggle("displayBlock");
      prevBtn = optBtn;

      return;
    }

    if (post) {
      window.location = `/comment/${postId}`;

      return;
    }
  });
}
