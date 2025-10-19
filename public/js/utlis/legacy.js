// just for reference

function postEvents() {
  const wrapper = document.querySelector(".post-wrapper");

  if (!wrapper) return;

  wrapper.addEventListener("click", async (e) => {
    e.stopPropagation();
    const post = e.target.closest(".post");
    const optBtn = e.target.closest(".p-opt");
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
