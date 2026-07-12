/* ============================================================
   contact.js — Contact form validation
   Demonstrates: form validation, event handling, DOM
   manipulation, regular expressions.
   ============================================================ */

(function () {

  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name: { input: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { input: document.getElementById('email'), error: document.getElementById('emailError') },
    phone: { input: document.getElementById('phone'), error: document.getElementById('phoneError') },
    message: { input: document.getElementById('message'), error: document.getElementById('messageError') }
  };

  const status = document.getElementById('formStatus');

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_DIGITS_PATTERN = /^\d+$/;

  function setError(fieldKey, message) {
    const { input, error } = fields[fieldKey];
    error.textContent = message;
    input.classList.toggle('invalid', Boolean(message));
  }

  function validateName() {
    const value = fields.name.input.value.trim();
    if (!value) return setError('name', 'Please enter your name.') || false;
    setError('name', '');
    return true;
  }

  function validateEmail() {
    const value = fields.email.input.value.trim();
    if (!value) { setError('email', 'Please enter your email address.'); return false; }
    if (!EMAIL_PATTERN.test(value)) { setError('email', 'Enter a valid email address, e.g. name@example.com.'); return false; }
    setError('email', '');
    return true;
  }

  function validatePhone() {
    const value = fields.phone.input.value.trim();
    if (!value) { setError('phone', 'Please enter your phone number.'); return false; }
    if (!PHONE_DIGITS_PATTERN.test(value)) { setError('phone', 'Phone number must contain digits only, no spaces or symbols.'); return false; }
    setError('phone', '');
    return true;
  }

  function validateMessage() {
    const value = fields.message.input.value.trim();
    if (!value) { setError('message', 'Please write a short message.'); return false; }
    setError('message', '');
    return true;
  }

  // Validate as the user leaves each field
  fields.name.input.addEventListener('blur', validateName);
  fields.email.input.addEventListener('blur', validateEmail);
  fields.phone.input.addEventListener('blur', validatePhone);
  fields.message.input.addEventListener('blur', validateMessage);

  // Clear an error as soon as the field becomes valid again
  fields.name.input.addEventListener('input', () => { if (fields.name.input.classList.contains('invalid')) validateName(); });
  fields.email.input.addEventListener('input', () => { if (fields.email.input.classList.contains('invalid')) validateEmail(); });
  fields.phone.input.addEventListener('input', () => { if (fields.phone.input.classList.contains('invalid')) validatePhone(); });
  fields.message.input.addEventListener('input', () => { if (fields.message.input.classList.contains('invalid')) validateMessage(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isMessageValid = validateMessage();

    const allValid = isNameValid && isEmailValid && isPhoneValid && isMessageValid;

    status.classList.remove('show', 'success', 'fail');

    if (!allValid) {
      status.textContent = 'Please fix the highlighted fields before sending.';
      status.classList.add('show', 'fail');
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // No backend is wired up here — replace this block with a real
    // fetch() call to your form endpoint or email service.
    status.textContent = `Thanks, ${fields.name.input.value.trim()}! Your message has been received.`;
    status.classList.add('show', 'success');
    form.reset();
  });

})();