pageState();
const check = localStorage.getItem("navState");
const check2 = localStorage.getItem("prState");
navState(check);

if (!check2) {
  profileNav();
}
const btn = document.getElementById("option3");
const btn2 = document.getElementById("option4");
const update = document.querySelector(".update");
const updateBtn = document.querySelectorAll(".update-btn");
let optBtn = [];
let optBtnB = [];
let saveBtn = [];
optBtn = document.querySelectorAll(".p-opt");
optBtnB = document.querySelectorAll(".p-optD");
saveBtn = document.querySelectorAll(".save-btn");
const posts = window.serverData.posts;

document.querySelector(".profile").addEventListener("click", (event) => {
  event.stopPropagation();
  document.querySelector(".nave-bar").classList.toggle("overflow");
});

document.querySelector(".MnavL-btn").addEventListener("click", () => {
  document.querySelector(".main-navL").classList.toggle("main-navL-width");
  checking();

  document.querySelector(".MnavL-btn").classList.toggle("btnL");
  document.querySelector(".demo").classList.toggle("demoOP");
});

optBtn.forEach((btn, i) => {
  btn.addEventListener("click", (event) => {
    event.stopPropagation();
    console.log("clicked");
    optBtnB[i].classList.toggle("displayBlock");
  });
});

document.addEventListener("click", () => {
  optBtnB.forEach((btn) => {
    btn.classList.remove("displayBlock");
  });

  document.querySelector(".nave-bar").classList.remove("overflow");
});

document.getElementById("option2").addEventListener("click", async () => {
  await profileCmt();
});

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
      behavior: "smooth",
    });

    document
      .querySelector(".update-btn_close")
      .addEventListener("click", () => {
        update.classList.remove("update-after");
      });
  });
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

function profileNav() {
  document.getElementById("option1").checked = true;
  localStorage.setItem("prState", 1);
}
function pageState() {
  if (performance.getEntriesByType("navigation")[0].type === "reload") {
    return localStorage.setItem("prState", 1);
  }
  return localStorage.removeItem("prState");
}

async function profileCmt() {
  let a = "";
  let profileId = document.querySelector(".post-wrapper").dataset.id;

  let result = await fetch(`/profilecmt/${profileId}`, {
    method: "GET",
    credentials: "include",
  });
  let value = await result.json();
  if (value.status) {
    a = `<div class="post-cover text-center" style="border: none; margin-top: 3rem; font-size: larger; font-weight: 400;">
  Not commented yet
</div>`;
    document.getElementById("content").innerHTML = a;
    return;
  }
  let post = value.data;

  post.forEach((post) => {
    a += `<div class="post-cover" >
          <div id="p${post.id}" class="post" data-id=${post.id} >
            <div class="personal-p flex">
              <a href="/profile/${post.user_id}"
                ><div class="profile-pic">
                 <img class="p-p" src="${post.profile_pic_url}" alt="" />
                </div></a
              >

              <a href="/profile/${post.user_id}"
                ><p style="font-size: small; font-weight: 450">
                  ${post.first_name} ${post.last_name}
                </p></a
              >

             
              <p style="font-size: 0.7rem; font-weight: 250" >• ${post.title}</p>

            </div>

            

            <p class="post-detail sm-x" font-weight: 500">${post.comment}</p>

            <div class="function flex">
                <button class="like">
                  <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                  <span class="like-t">${post.likes}</span>
                </button>
                <button class="dislike">
                  <i class="fa fa-thumbs-down" aria-hidden="true"></i>
                  <span class="dislike-t" >${post.dislikes}</span>
                </button>
                <button>
                  <i class="fa fa-comment" aria-hidden="true"></i> <span>${post.comment_count}</span>
                </button>
              </div>
          </div>
          </div>`;
  });

  document.getElementById("content").innerHTML = a;
}

// saveBtn.forEach((btn)=>{
//    btn.addEventListener("click")
// })

async function save() {
  let a = "";
  let profileId = document.querySelector(".post-wrapper").dataset.id;
  try {
    let response = await fetch(`/save/${profileId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      let errData = await response.json();
      throw new Error(errData.message);
    }
    let result = await response.json();

    result.forEach((post) => {
      a += `<div class="post-cover">
            <div id="p${post.id}" class="post" data-id=${post.id} >
              

              <div class="personal-p flex">
                <a href="/profile/${post.user_id}"
                  ><div class="profile-pic">
                    <img class="p-p" src="${post.profile_pic_url}" alt="" />
                  </div></a
                >

                <a href="/profile/${post.user_id}"
                  ><p style="font-size: medium">
                    ${post.first_name} ${post.last_name}
                  </p></a
                >
                <div class="p-opt flex" style="margin-left: auto" >
                  <imodulesTime    00    class="fa fa-ellipsis-h" aria-hidden="true"></i>
                  <div class="p-optD">
                    <button
                      class="p-opt-btn"
                      onclick="event.stopPropagation();save(<%=userId%>,<%=post.id%>)"
                    >
                      <i class="fa fa-bookmark" aria-hidden="true"></i> Save
                    </button>
                  </div>
                </div>
              </div>

              <h4 class="post-title sm-x">${post.title}</h4>

              
              <p class="post-detail sm-x">${post.detail}</p>
             
               <div class="function flex">
                <button class="like">
                  <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                  <span class="like-t">${post.likes}</span>
                </button>
                <button class="dislike">
                  <i class="fa fa-thumbs-down" aria-hidden="true"></i>
                  <span class="dislike-t" >${post.dislikes}</span>
                </button>
                <button>
                  <i class="fa fa-comment" aria-hidden="true"></i> <span>${post.comments}</span>
                </button>
              </div>
              

            </div>
          </div>`;
    });

    document.getElementById("content").innerHTML = a;
  } catch (err) {
    if (err.message === "No saved post") {
      a = `<div class="post-cover text-center" style="border: none; margin-top: 3rem; font-size: larger; font-weight: 400;">
  No saved post
</div>`;
      return (document.getElementById("content").innerHTML = a);
    }
    console.log("Error fetching data", err.message);
  }
}

if (btn) {
  document.getElementById("option3").addEventListener("click", save);
}

if (btn2) {
  document.getElementById("option4").addEventListener("click", async () => {
    await postsLiked();
  });
}

document.getElementById("content").addEventListener("click", (e) => {});
/////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".post-wrapper");

  if (!wrapper) return;

  wrapper.addEventListener("click", async (e) => {
    const post = e.target.closest(".post");
    const like = e.target.closest(".like");
    const disLike = e.target.closest(".dislike");

    let userId = document.querySelector(".main").dataset.id;
    if (like) {
      let postId = post.dataset.id;
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
      let postId = post.dataset.id;
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

    const dBtn = e.target.closest(".p-opt");

    if (dBtn) {
      dBtn.querySelector(".p-optD").classList.toggle("displayBlock");
      return;
    }

    if (post) {
      let postId = post.dataset.id;
      window.location = `/comment/${postId}`;

      return;
    }
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

async function postsLiked() {
  let a = "";

  try {
    let response = await fetch(`/userlike`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      let errData = await response.json();
      return console.log(errData);
    }
    let value = await response.json();

    if (value.status) {
      a = `<div class="post-cover text-center" style="border: none; margin-top: 3rem; font-size: larger; font-weight: 400;">
    Not commented yet
  </div>`;
      document.getElementById("content").innerHTML = a;
      return;
    }
    let post = value.rows;

    post.forEach((post) => {
      a += `<div class="post-cover">
              <div id="p${post.post_id}" class="post" data-id=${post.post_id} >

                <div class="personal-p flex">
                  <a href="/profile/${post.id}"
                    ><div class="profile-pic">
                      <img class="p-p" src="${post.profile_pic_url}" alt="" />
                    </div></a
                  >

                  <a href="/profile/${post.id}"
                    ><p style="font-size: medium">
                      ${post.first_name} ${post.last_name}
                    </p></a
                  >
                  <div class="p-opt flex" style="margin-left: auto" >
                    <imodulesTime    00    class="fa fa-ellipsis-h" aria-hidden="true"></i>
                    <div class="p-optD">
                      <button
                        class="p-opt-btn"
                        onclick="event.stopPropagation();save(<%=userId%>,<%=post.id%>)"
                      >
                        <i class="fa fa-bookmark" aria-hidden="true"></i> Save
                      </button>
                    </div>
                  </div>
                </div>

                <h4 class="post-title sm-x">${post.title}</h4>

                <p class="post-detail sm-x">${post.detail}</p>

                 <div class="function flex">
                  <button class="like">
                    <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                    <span class="like-t">${post.likes}</span>
                  </button>
                  <button class="dislike">
                    <i class="fa fa-thumbs-down" aria-hidden="true"></i>
                    <span class="dislike-t" >${post.dislikes}</span>
                  </button>
                  <button>
                    <i class="fa fa-comment" aria-hidden="true"></i> <span>${post.comments}</span>
                  </button>
                </div>

              </div>
            </div>`;
    });

    document.getElementById("content").innerHTML = a;
  } catch (err) {
    if (err.message === "No liked posts") {
      a = `<div class="post-cover text-center" style="border: none; margin-top: 3rem; font-size: larger; font-weight: 400;">
    No saved post
  </div>`;
      return (document.getElementById("content").innerHTML = a);
    }
    console.log("Error fetching data", err.message);
  }
}
