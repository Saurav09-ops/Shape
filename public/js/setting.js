const check = localStorage.getItem("navState");

navState(check);

let optBtn = [];
let optBtnB = [];
let saveBtn = [];
optBtn = document.querySelectorAll(".p-opt");
optBtnB = document.querySelectorAll(".p-optD");
saveBtn = document.querySelectorAll(".p-opt-btn");
document.querySelector(".profile").addEventListener("click", (event) => {
  event.stopPropagation();
  document.querySelector(".nave-bar").classList.toggle("overflow");
});

optBtn.forEach((btn, i) => {
  btn.addEventListener("click", (event) => {
    event.stopPropagation();
    optBtnB[i].classList.toggle("displayBlock");
  });
});

document.addEventListener("click", () => {
  optBtnB.forEach((btn) => {
    btn.classList.remove("displayBlock");
  });
  document.querySelector(".nave-bar").classList.remove("overflow");
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

async function save(uId, pId) {
  let data = { userId: uId, postId: pId };
  try {
    let response = await fetch(`/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    let result = await response.json();
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

document.querySelector(".avatar").addEventListener("click", (e) => {
  e.stopPropagation();
  document.querySelector(".backdrop").classList.remove("display-none");
});

document.querySelector(".modal-close").addEventListener("click", (e) => {
  e.stopPropagation();
  document.querySelector(".backdrop").classList.add("display-none");
});

document.querySelector(".display-name").addEventListener("click", (e) => {
  e.stopPropagation();
  document.querySelector(".backdrop2").classList.remove("display-none");
});

document.querySelector(".modal-close2").addEventListener("click", (e) => {
  e.stopPropagation();
  document.querySelector(".backdrop2").classList.add("display-none");
  document.getElementById("nick").value = "";
  document.querySelector("#d-count").innerHTML = 40;
});

document.addEventListener("keydown", (e) => {
  e.key === "Escape"
    ? document.querySelector(".backdrop").classList.add("display-none")
    : undefined;
});

avatar();

async function avatar() {
  let response = await fetch("/avatar");
  let result = await response.json();
  let a = "";
  let urls = result.rows;
  let user = result.user;
  console.log(urls, user);
  console.log(user.profile_pic_url);
  urls.forEach((url) => {
    if (url.profile_pic_url === user.profile_pic_url) {
      a += `<div class="avatar-pic" style="border: 4px solid 	#5cb85c ; opacity:1">
            <img
              id="current"
              class="p-pic"
              src="${url.profile_pic_url}"
              alt="avatar${url.id}"
              data-id=${url.id}
              data-user=${user.id}
            />
          </div>`;
    } else {
      a += `<div class="avatar-pic">
            <img
              class="p-pic"
              src="${url.profile_pic_url}"
              alt="avatar${url.id}"
              data-id=${url.id}
              
            />
          </div>`;
    }
  });

  document.querySelector(".avatar-col").innerHTML = a;
  document.querySelector(".p-pic-nav").src = user.profile_pic_url;
}

document.querySelector(".avatar-col").addEventListener("click", async (e) => {
  const div = e.target.closest(".avatar-pic");
  if (!div) {
    return;
  }
  const avatarId = div.querySelector(".p-pic").dataset.id;
  const userId = document.getElementById("current").dataset.user;

  const data = { userId };
  try {
    let response = await fetch(`/avatar/${avatarId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Faliure updating profile-pic");
    }
    avatar();
  } catch (err) {
    console.log(err);
  }
});

document.getElementById("nick").addEventListener("input", (e) => {
  let a = e.target.value.length;
  a = 40 - a;
  document.querySelector("#d-count").innerHTML = a;
});

document.querySelector(".change-gen").addEventListener("click", (e) => {
  e.stopPropagation();
  document.querySelector(".backdrop3").classList.remove("display-none");
});

document.querySelector(".modal-close3").addEventListener("click", (e) => {
  e.stopPropagation();
  document.querySelector(".backdrop3").classList.add("display-none");
});
