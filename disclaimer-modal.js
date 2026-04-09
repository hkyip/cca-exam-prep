(function () {
  var STORAGE_KEY = 'ccaDisclaimerAck_v1';

  function buildModal() {
    var overlay = document.createElement('div');
    overlay.id = 'cca-disclaimer-modal';
    overlay.className = 'disclaimer-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'cca-disclaimer-title');

    overlay.innerHTML =
      '<div class="disclaimer-modal-panel">' +
      '<div class="disclaimer-modal-scroll" tabindex="-1">' +
      '<span class="disclaimer-modal-kicker">Important — read carefully</span>' +
      '<h2 class="disclaimer-modal-title" id="cca-disclaimer-title">Disclaimer</h2>' +
      '<div class="disclaimer-modal-body">' +
      '<p>This website is an <strong>independent, unofficial</strong> exam preparation resource. It is <strong>not</strong> affiliated with, endorsed by, sponsored by, or approved by Anthropic PBC, Claude, or any official certification authority. Product names, certification titles, and trademarks mentioned here belong to their respective owners and are used for identification only.</p>' +
      '<p>Practice questions, explanations, study guide text, timers, and scores on this site are for <strong>learning and self-assessment only</strong>. They are not copies of the live examination, may not reflect current official content or policies, and <strong>do not guarantee</strong> that you will pass or fail the real certification. A passing score in practice or proctored simulation here does not imply any outcome on the official exam.</p>' +
      '<p>Official exam rules, eligibility, registration, fees, scheduling, and security requirements can change. <strong>You are solely responsible</strong> for confirming the latest information with Anthropic and the official certification program before you register or sit the exam.</p>' +
      '<p>This site and all materials are provided <strong>“as is”</strong>, without warranty of any kind. To the fullest extent permitted by law, the operators of this site disclaim liability for any loss, damage, or decision arising from use of this site, reliance on its content, or any exam result.</p>' +
      '<p>Optional external links in the study guide are for convenience; we do not control third-party sites, availability of URLs, or their terms and privacy practices.</p>' +
      '</div>' +
      '</div>' +
      '<div class="disclaimer-modal-actions">' +
      '<button type="button" class="disclaimer-modal-btn" id="cca-disclaimer-ack">I understand</button>' +
      '</div>' +
      '</div>';

    return overlay;
  }

  function openModal(overlay) {
    overlay.classList.add('is-open');
    document.body.classList.add('disclaimer-modal-open');
    var btn = overlay.querySelector('#cca-disclaimer-ack');
    if (btn) btn.focus();
  }

  function closeModal(overlay) {
    overlay.classList.remove('is-open');
    document.body.classList.remove('disclaimer-modal-open');
  }

  function init() {
    var overlay = buildModal();
    document.body.appendChild(overlay);
    var pendingExamCallback = null;

    var ack = overlay.querySelector('#cca-disclaimer-ack');
    if (ack) {
      ack.addEventListener('click', function () {
        try {
          sessionStorage.setItem(STORAGE_KEY, '1');
        } catch (e) {}
        closeModal(overlay);
        if (pendingExamCallback) {
          var cb = pendingExamCallback;
          pendingExamCallback = null;
          try {
            cb();
          } catch (err) {}
        }
      });
    }

    document.querySelectorAll('.js-open-disclaimer').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(overlay);
      });
    });

    window.ccaEnsureDisclaimerAcknowledged = function (callback) {
      if (typeof callback !== 'function') callback = function () {};
      try {
        if (sessionStorage.getItem(STORAGE_KEY)) {
          callback();
          return;
        }
      } catch (e) {}
      pendingExamCallback = callback;
      openModal(overlay);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
