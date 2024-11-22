(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      let loading = thisForm.querySelector('.loading');
      let errorMessage = thisForm.querySelector('.error-message');
      let sentMessage = thisForm.querySelector('.sent-message');

      if (loading) loading.classList.add('d-block');
      if (errorMessage) errorMessage.classList.remove('d-block');
      if (sentMessage) sentMessage.classList.remove('d-block');

      let formData = new FormData(thisForm);

      if (recaptcha) {
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'}).then(token => {
                formData.set('recaptcha-response', token);
                php_email_form_submit(thisForm, action, formData);
              });
            } catch (error) {
              displayError(thisForm, 'reCAPTCHA error: ' + error.message);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!');
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
    .then(response => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    })
    .then(data => {
      let loading = thisForm.querySelector('.loading');
      let sentMessage = thisForm.querySelector('.sent-message');
      if (loading) loading.classList.remove('d-block');
      
      if (data.trim() === 'OK') {
        if (sentMessage) sentMessage.classList.add('d-block');
        thisForm.reset();
      } else {
        throw new Error(data || 'Form submission failed with no error message returned.');
      }
    })
    .catch((error) => {
      displayError(thisForm, error.message || error);
    });
  }

  function displayError(thisForm, error) {
    let loading = thisForm.querySelector('.loading');
    let errorMessage = thisForm.querySelector('.error-message');

    if (loading) loading.classList.remove('d-block');
    if (errorMessage) {
      errorMessage.innerHTML = sanitizeMessage(error);
      errorMessage.classList.add('d-block');
    } else {
      console.error("Error: ", error);
    }
  }

  function sanitizeMessage(message) {
    const div = document.createElement('div');
    div.textContent = message;
    return div.innerHTML;
  }

})();
