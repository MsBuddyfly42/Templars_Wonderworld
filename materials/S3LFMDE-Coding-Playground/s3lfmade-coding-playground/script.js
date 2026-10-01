// S3LFM@DE Coding Playground
// Change one thing at a time, save, refresh, and see what happens.

const themeToggle = document.querySelector('#themeToggle');
const surpriseBtn = document.querySelector('#surpriseBtn');
const surpriseMessage = document.querySelector('#surpriseMessage');
const serviceSelect = document.querySelector('#serviceSelect');
const quantity = document.querySelector('#quantity');
const rush = document.querySelector('#rush');
const estimateTotal = document.querySelector('#estimateTotal');
const practiceNotes = document.querySelector('#practiceNotes');
const saveNotes = document.querySelector('#saveNotes');
const clearNotes = document.querySelector('#clearNotes');
const noteStatus = document.querySelector('#noteStatus');
const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');

// 1) THEME TOGGLE ----------------------------------------------------------
const savedTheme = localStorage.getItem('playground-theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = 'Light mode';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
  localStorage.setItem('playground-theme', isDark ? 'dark' : 'light');
});

// 2) RANDOM PRACTICE PROMPT ------------------------------------------------
const prompts = [
  'Change the gold accent to your favorite color.',
  'Add a fourth service card.',
  'Make the hero heading smaller on mobile.',
  'Add a new navigation link and matching section.',
  'Change the quote estimator rush fee from 25% to 40%.',
  'Make the service cards square instead of rounded.',
  'Add a phone-number field to the contact form.'
];

surpriseBtn.addEventListener('click', () => {
  const randomIndex = Math.floor(Math.random() * prompts.length);
  surpriseMessage.textContent = prompts[randomIndex];
});

// 3) QUOTE ESTIMATOR -------------------------------------------------------
function updateEstimate() {
  const basePrice = Number(serviceSelect.value);
  const qty = Math.max(1, Number(quantity.value) || 1);
  let total = basePrice * qty;

  if (rush.checked) {
    total *= 1.25;
  }

  estimateTotal.textContent = `$${total.toFixed(2)}`;
}

serviceSelect.addEventListener('change', updateEstimate);
quantity.addEventListener('input', updateEstimate);
rush.addEventListener('change', updateEstimate);
updateEstimate();

// 4) PRACTICE NOTES USING LOCALSTORAGE ------------------------------------
practiceNotes.value = localStorage.getItem('coding-practice-notes') || '';

saveNotes.addEventListener('click', () => {
  localStorage.setItem('coding-practice-notes', practiceNotes.value);
  noteStatus.textContent = 'Saved in this browser.';
});

clearNotes.addEventListener('click', () => {
  practiceNotes.value = '';
  localStorage.removeItem('coding-practice-notes');
  noteStatus.textContent = 'Notes cleared.';
});

// 5) DEMO CONTACT FORM VALIDATION -----------------------------------------
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    formStatus.textContent = 'Please complete all fields correctly.';
    contactForm.reportValidity();
    return;
  }

  const name = document.querySelector('#name').value.trim();
  formStatus.textContent = `Thanks, ${name}! Demo message accepted. No real email was sent.`;
  contactForm.reset();
});

// 6) FOOTER YEAR -----------------------------------------------------------
document.querySelector('#year').textContent = new Date().getFullYear();
