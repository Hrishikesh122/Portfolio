/* =========================================================
   CONTACT FORM

   SETUP: put your Formspree form ID below. Create a form at
   https://formspree.io, it gives you an endpoint that looks like
   https://formspree.io/f/mabcdefg  -  the ID is the last part.

   Until FORM_ID is set, the form does NOT pretend to send. It opens
   a prefilled email in the visitor's mail client and tells them so.
   ========================================================= */
(function () {
  'use strict';

  var FORM_ID = '';                                   // <- put your Formspree ID here
  var FALLBACK_EMAIL = 'harnoorhrishikesh@gmail.com';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var submit = document.getElementById('cf-submit');
  var status = document.getElementById('cf-status');
  var fields = ['name', 'email', 'message'];

  function fieldEls(key) {
    return {
      input: document.getElementById('cf-' + key),
      error: document.getElementById('cf-' + key + '-error')
    };
  }

  function setError(key, show) {
    var el = fieldEls(key);
    if (!el.input || !el.error) return;
    el.error.hidden = !show;
    if (show) {
      el.input.setAttribute('aria-invalid', 'true');
      el.input.setAttribute('aria-describedby', 'cf-' + key + '-error');
    } else {
      el.input.removeAttribute('aria-invalid');
      el.input.removeAttribute('aria-describedby');
    }
  }

  function validate() {
    var firstBad = null;

    fields.forEach(function (key) {
      var input = fieldEls(key).input;
      if (!input) return;

      var value = input.value.trim();
      var bad = value === '';

      if (!bad && key === 'email') {
        bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      }

      setError(key, bad);
      if (bad && !firstBad) firstBad = input;
    });

    if (firstBad) firstBad.focus();
    return firstBad === null;
  }

  // clear an error as soon as the visitor starts fixing it
  fields.forEach(function (key) {
    var input = fieldEls(key).input;
    if (input) input.addEventListener('input', function () { setError(key, false); });
  });

  function say(message, state) {
    status.textContent = message;
    if (state) status.setAttribute('data-state', state);
    else status.removeAttribute('data-state');
  }

  function values() {
    return {
      name: document.getElementById('cf-name').value.trim(),
      email: document.getElementById('cf-email').value.trim(),
      message: document.getElementById('cf-message').value.trim()
    };
  }

  function mailtoFallback() {
    var v = values();
    var subject = encodeURIComponent('Portfolio enquiry from ' + v.name);
    var body = encodeURIComponent(v.message + '\n\n' + v.name + '\n' + v.email);
    say('Opening your email app. If nothing happens, write to ' + FALLBACK_EMAIL + ' directly.', 'ok');
    window.location.href = 'mailto:' + FALLBACK_EMAIL + '?subject=' + subject + '&body=' + body;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    say('');

    if (!validate()) {
      say('Please fix the fields marked above.', 'err');
      return;
    }

    if (!FORM_ID) {
      mailtoFallback();
      return;
    }

    var original = submit.textContent;
    submit.disabled = true;
    submit.textContent = 'Sending';
    say('');

    fetch('https://formspree.io/f/' + FORM_ID, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Request failed with ' + res.status);
        form.reset();
        say('Message sent. I will get back to you soon.', 'ok');
      })
      .catch(function () {
        say('That did not send. Please email ' + FALLBACK_EMAIL + ' instead.', 'err');
      })
      .then(function () {
        submit.disabled = false;
        submit.textContent = original;
      });
  });
})();
