export function addClass(el, className) {
  if (!el) return;
  el.classList.add(className);
}

export function removeClass(el, className) {
  if (!el) return;
  el.classList.remove(className);
}

export function toggleClass(el, className) {
  if (!el) return;
  el.classList.toggle(className);
}

export function handleDocumentClick() {
  const topNav = document.querySelector(".nave-bar");
  const postDropdown = document.querySelectorAll(".p-optD");

  document.addEventListener("click", () => {
    postDropdown?.forEach((btn) => {
      if (btn.classList[1] === "displayBlock") {
        removeClass(btn, "displayBlock");
      }
    });

    removeClass(topNav, "overflow");
  });
}

export function delayVisibility() {
  setTimeout(() => {
    document.querySelector("body").removeAttribute("style");
  }, 2);
}
