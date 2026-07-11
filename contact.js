const contactForm = document.getElementById("contactForm");
const successPopup = document.getElementById("successPopup");
const popupText = document.getElementById("popupText");
const closePopup = document.getElementById("closePopup");
const popupOkBtn = document.getElementById("popupOkBtn");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contactName").value.trim();

    popupText.textContent = name
      ? `Thanks, ${name} — we'll get back to you within two business days.`
      : "Thanks — we'll get back to you within two business days.";

    successPopup.classList.remove("hidden");
    contactForm.reset();
  });
}

function hidePopup() {
  successPopup.classList.add("hidden");
}

if (closePopup) closePopup.addEventListener("click", hidePopup);
if (popupOkBtn) popupOkBtn.addEventListener("click", hidePopup);
if (successPopup) {
  successPopup.addEventListener("click", (e) => {
    if (e.target === successPopup) hidePopup();
  });
}