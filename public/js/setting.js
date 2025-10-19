import { navState, topnavEvent, sidenavEvent } from "./utlis/nav.js";
import { handleDocumentClick } from "./utlis/domUtils.js";
import { delayVisibility } from "./utlis/domUtils.js";

const check = localStorage.getItem("navState");

document.addEventListener("DOMContentLoaded", () => {
  navState(check);
  sidenavEvent();
  topnavEvent();
  modalEvents();
  avatar();
  avatarSelectionHandler();
  nameCount();
  handleDocumentClick();
  keyboardShortcuts();
  delayVisibility();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

function avatarSelectionHandler() {
  const avatarCont = document.querySelector(".avatar-col");
  avatarCont.addEventListener("click", async (e) => {
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
}

function modalEvents() {
  const avatar = document.querySelector(".avatar");
  const modalClose = document.querySelector(".modal-close");
  const backdrop = document.querySelector(".backdrop");
  const displayName = document.querySelector(".display-name");
  const modalClose2 = document.querySelector(".modal-close2");
  const backdrop2 = document.querySelector(".backdrop2");
  const genderSelection = document.querySelector(".change-gen");
  const modalClose3 = document.querySelector(".modal-close3");
  const backDrop3 = document.querySelector(".backdrop3");

  avatar.addEventListener("click", (e) => {
    e.stopPropagation();
    backdrop.classList.remove("display-none");
  });

  modalClose.addEventListener("click", (e) => {
    e.stopPropagation();
    backdrop.classList.add("display-none");
  });

  displayName.addEventListener("click", (e) => {
    e.stopPropagation();
    backdrop2.classList.remove("display-none");
  });

  modalClose2.addEventListener("click", (e) => {
    e.stopPropagation();
    backdrop2.classList.add("display-none");
    document.getElementById("nick").value = "";
    document.querySelector("#d-count").innerHTML = 40;
  });

  genderSelection.addEventListener("click", (e) => {
    e.stopPropagation();
    backDrop3.classList.remove("display-none");
  });

  modalClose3.addEventListener("click", (e) => {
    e.stopPropagation();
    backDrop3.classList.add("display-none");
  });
}

function nameCount() {
  document.getElementById("nick").addEventListener("input", (e) => {
    let a = e.target.value.length;
    a = 40 - a;
    document.querySelector("#d-count").innerHTML = a;
  });
}

function keyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelector(".backdrop")?.classList.add("display-none");
      document.querySelector(".backdrop2")?.classList.add("display-none");
      document.querySelector(".backdrop3")?.classList.add("display-none");
    }
  });
}
