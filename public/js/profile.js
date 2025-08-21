const update = document.querySelector(".update");
const updateBtn = document.querySelectorAll(".update-btn");
const posts = window.serverData.posts;

updateBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const index = btn.dataset.index;

    update.innerHTML = ` <button class="update-btn_close">
            <i class="fa fa-times" aria-hidden="true"></i>
          </button>
          <form action="/update/${id}" method="post">
            <h4 class="post-title ssm-x">${posts[index].title}</h4>
            <div class="detail" style="height: 80%">

                <textarea
                id="detail"
                name="detail"
                placeholder="Description...."
                style="line-height: 1.6; word-spacing: 2px; height: 100%">${posts[index].detail}</textarea>
                   
                

              <button class="btn" type="submit">Post</button>
            </div>
          </form>`;

    update.classList.add("update-after");

    window.scrollTo({
      top: 0,
      behavior: "smooth", // removes this if you want instant scroll
    });

    document
      .querySelector(".update-btn_close")
      .addEventListener("click", () => {
        update.classList.remove("update-after");
      });
  });
});
