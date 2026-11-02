/*
  forms.js
  Handles the two forms on the site.

  enquiry.html
    - Shows extra questions that match the enquiry type.
    - Validates every field and shows an error under each wrong one.
    - Sends the enquiry with fetch (AJAX) and then shows a reply with the
      cost, availability and next step for that type of enquiry.

  contact.html
    - Validates the form, then builds an email from the answers.
    - Shows the email for review. The visitor sends it from their own email
      app to the recipient set in config.js.
*/
(function () {
  "use strict";

  var config = window.PAWS_CONFIG || {};
  var info = window.PAWS_DATA || { fees: {}, availability: {}, sponsorTiers: {} };

  /* ---------- Formatting and date helpers ---------- */

  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function money(amount) {
    return "R" + String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function plural(count, singular, pluralForm) {
    return count + " " + (count === 1 ? singular : pluralForm);
  }

  function formatDate(date) {
    return DAYS[date.getDay()] + " " + date.getDate() + " " + MONTHS[date.getMonth()] + " " + date.getFullYear();
  }

  function toISODate(date) {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  // Parse "YYYY-MM-DD" as a local date. Returns null for anything that is not a real date.
  function parseISODate(text) {
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    if (!match) return null;
    var year = Number(match[1]);
    var month = Number(match[2]) - 1;
    var day = Number(match[3]);
    var date = new Date(year, month, day);
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null;
    return date;
  }

  function secondSaturday(year, month) {
    var first = new Date(year, month, 1);
    var offset = (6 - first.getDay() + 7) % 7;
    return new Date(year, month, 1 + offset + 7);
  }

  // Volunteer orientation runs on the second Saturday of every month.
  function nextOrientationDate(from) {
    var today = startOfDay(from || new Date());
    var candidate = secondSaturday(today.getFullYear(), today.getMonth());
    if (candidate < today) {
      candidate = secondSaturday(today.getFullYear(), today.getMonth() + 1);
    }
    return candidate;
  }

  /* ---------- Validation rules ---------- */
  /* Each rule takes the field value and returns an error message, or "" when the value is fine. */

  var NAME_PATTERN = /^[\p{L}][\p{L}\s'.\-]*$/u;
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var rules = {
    name: function (value) {
      var text = value.trim();
      if (!text) return "Enter your full name.";
      if (text.length < 2) return "Your name needs at least 2 characters.";
      if (text.length > 60) return "Keep your name under 60 characters.";
      if (!NAME_PATTERN.test(text)) return "Use letters, spaces, hyphens and apostrophes only.";
      return "";
    },

    email: function (value) {
      var text = value.trim();
      if (!text) return "Enter your email address.";
      if (text.length > 254 || !EMAIL_PATTERN.test(text)) {
        return "Enter a valid email address, for example name@example.com.";
      }
      return "";
    },

    // Optional. When filled in, it must be a South African number.
    phone: function (value) {
      var text = value.trim();
      if (!text) return "";
      var digits = text.replace(/[\s\-()]/g, "");
      if (!/^(?:\+27|0)[1-9]\d{8}$/.test(digits)) {
        return "Enter a South African number, for example 031 555 0182 or +27 31 555 0182.";
      }
      return "";
    },

    select: function (value, control) {
      return value ? "" : (control && control.getAttribute("data-error")) || "Choose an option.";
    },

    subject: function (value) {
      var text = value.trim();
      if (!text) return "Enter a subject.";
      if (text.length < 3) return "The subject needs at least 3 characters.";
      if (text.length > 100) return "Keep the subject under 100 characters.";
      return "";
    },

    message: function (value) {
      var text = value.trim();
      if (!text) return "Write a message.";
      if (text.length < 10) return "Write at least 10 characters so we can help.";
      if (text.length > 1000) return "Keep your message under 1,000 characters.";
      return "";
    },

    // Optional visit date: today or later, within 60 days, not a Sunday.
    date: function (value, control, now) {
      if (!value) return "";
      var date = parseISODate(value);
      if (!date) return "Enter a valid date.";
      var today = startOfDay(now || new Date());
      var latest = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 60);
      if (date < today) return "Pick a date from today onwards.";
      if (date > latest) return "Pick a date within the next 60 days.";
      if (date.getDay() === 0) return "We are closed on Sundays. Pick another day.";
      return "";
    }
  };

  /* ---------- Shared form helpers ---------- */

  function setError(control, message) {
    var errorBox = document.getElementById(control.id + "-error");
    if (errorBox) errorBox.textContent = message;
    control.setAttribute("aria-invalid", message ? "true" : "false");
    var field = control.closest(".form-field");
    if (field) field.classList.toggle("has-error", Boolean(message));
  }

  function validateControl(control) {
    var rule = rules[control.getAttribute("data-rule")];
    if (!rule || control.disabled) return "";
    var message = rule(control.value, control);
    setError(control, message);
    return message;
  }

  // Validates every enabled control and returns the ones that failed, in page order.
  function validateForm(form) {
    var failed = [];
    form.querySelectorAll("[data-rule]").forEach(function (control) {
      if (validateControl(control)) failed.push(control);
    });
    return failed;
  }

  function watchForm(form) {
    // The browser's own bubbles are replaced by the messages written above.
    // Without JavaScript the HTML5 attributes still validate natively.
    form.noValidate = true;

    form.querySelectorAll("[data-rule]").forEach(function (control) {
      control.addEventListener("blur", function () {
        if (control.value !== "" || control.getAttribute("aria-invalid") === "true") {
          validateControl(control);
        }
      });
      var recheck = function () {
        if (control.getAttribute("aria-invalid") === "true") validateControl(control);
      };
      control.addEventListener("input", recheck);
      control.addEventListener("change", recheck);
    });
  }

  function watchCounter(textarea, output, max) {
    function update() {
      var length = textarea.value.length;
      output.textContent = length + " / " + max;
      output.classList.toggle("is-over", length > max);
    }
    textarea.addEventListener("input", update);
    update();
    return update;
  }

  function collect(form) {
    var values = {};
    form.querySelectorAll("[name]").forEach(function (control) {
      if (control.disabled) return;
      values[control.name] = control.value.trim();
    });
    return values;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function setStatus(box, message, kind) {
    box.textContent = message;
    box.className = "form-status" + (kind ? " is-" + kind : "");
  }

  function failureCount(count) {
    return count === 1 ? "Fix the highlighted field and send again." : "Fix the " + count + " highlighted fields and send again.";
  }

  /* ---------- Enquiry: the reply shown after a valid submission ---------- */

  function buildEnquiryResponse(data, now) {
    var firstName = data.fullName.trim().split(/\s+/)[0];
    var rows = [];
    var intro = "";
    var type = data.enquiryType;

    if (type === "adoption") {
      var isDog = data.animal === "dog";
      var ready = isDog ? info.availability.dogsReady : info.availability.catsReady;
      var fee = isDog ? info.fees.dog : info.fees.cat;
      intro = "Here is what to expect when you adopt a " + (isDog ? "dog" : "cat") + ".";
      rows.push(["Adoption fee", money(fee) + ". It covers sterilisation, vaccinations and deworming."]);
      rows.push([
        "Availability",
        plural(ready, isDog ? "dog is" : "cat is", isDog ? "dogs are" : "cats are") + " ready to go home now."
      ]);
      rows.push(["What happens next", "We review your application within 3 working days, then arrange a short home-suitability chat."]);
      var visit = data.visitDate ? parseISODate(data.visitDate) : null;
      if (visit) {
        rows.push([
          "Your visit",
          "You asked to visit on " + formatDate(visit) + ". We will confirm the time by email. The shelter is open Monday to Saturday, 09:00 to 16:00."
        ]);
      } else {
        rows.push(["Visiting", "The Pinetown shelter is open Monday to Saturday, 09:00 to 16:00."]);
      }
    } else if (type === "fostering") {
      var places = info.availability.fosterPlaces;
      var animalChoices = { dogs: "dogs", cats: "cats", kittens: "kittens", any: "any animal" };
      var lengthChoices = { short: "2 to 4 weeks", long: "5 to 8 weeks" };
      intro = "Thank you for offering a home to an animal in need.";
      rows.push(["Cost", "Free. We supply food, bedding and veterinary cover for the whole foster period."]);
      rows.push([
        "Availability",
        places > 0
          ? plural(places, "foster place is", "foster places are") + " open now. You asked about " +
            (animalChoices[data.fosterAnimal] || "any animal") + " for " +
            (lengthChoices[data.fosterLength] || "a short stay") + "."
          : "All foster places are full. We will add you to the waitlist and email you when one opens."
      ]);
      rows.push([
        "What happens next",
        "Come to the next volunteer orientation on " + formatDate(nextOrientationDate(now)) +
        " at 09:00 at the Pinetown shelter. We will email you the details."
      ]);
    } else if (type === "volunteering") {
      var daysChoices = {
        weekdays: "weekdays",
        weekends: "weekends",
        either: "weekdays or weekends"
      };
      intro = "We are glad you want to help at the shelter.";
      rows.push(["Cost", "Free. We give you a volunteer shirt and training on your first day."]);
      rows.push(["Availability", "Shifts are open on " + (daysChoices[data.volunteerDays] || "weekdays or weekends") + "."]);
      rows.push([
        "What happens next",
        "Join the next orientation on " + formatDate(nextOrientationDate(now)) +
        " at 09:00 at the Pinetown shelter. It covers safe handling, cleaning routines and how shifts work."
      ]);
    } else if (type === "sponsorship") {
      var tier = info.sponsorTiers[data.sponsorTier] || info.sponsorTiers.bronze;
      intro = "Thank you for choosing to sponsor an animal.";
      rows.push(["Cost", tier.name + " sponsorship is " + money(tier.monthly) + " a month. It covers " + tier.covers + "."]);
      rows.push(["Availability", "Sponsorships are open now. We match you with an animal in our care and send you its story."]);
      rows.push(["What happens next", "We email payment details within 3 working days. You can change or stop your sponsorship at any time."]);
    } else {
      intro = "Thank you for getting in touch.";
      rows.push(["Cost", "Most of our community services are free. Free sterilisation runs on the first Saturday of each month for qualifying households."]);
      rows.push(["What happens next", "A member of our team replies within 3 working days."]);
    }

    return { heading: "Thank you, " + firstName, intro: intro, rows: rows };
  }

  function makeReference(now) {
    var letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var suffix = "";
    for (var i = 0; i < 4; i += 1) {
      suffix += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return "PAWS-" + now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate()) + "-" + suffix;
  }

  // Sends the enquiry with fetch to the address in the form's action attribute.
  // When the action is still the placeholder, it runs a simulated send instead.
  function submitEnquiry(payload, endpoint) {
    if (!endpoint) {
      return new Promise(function (resolve) {
        window.setTimeout(function () {
          resolve({ ok: true, simulated: true });
        }, 700);
      });
    }

    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller ? window.setTimeout(function () { controller.abort(); }, 10000) : null;

    return fetch(endpoint, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    }).then(function (response) {
      if (timer) window.clearTimeout(timer);
      if (!response.ok) throw new Error("The server answered with status " + response.status);
      return { ok: true, simulated: false };
    }, function (error) {
      if (timer) window.clearTimeout(timer);
      throw error;
    });
  }

  /* ---------- Contact: compile the email ---------- */

  var TOPICS = {
    general: "General question",
    feedback: "Feedback",
    stray: "Report a stray or injured animal",
    media: "Media request",
    donation: "Donation question"
  };

  function buildEmail(data, recipient, siteUrl) {
    var topic = TOPICS[data.topic] || "General question";
    var subject = "[Website message] " + topic + ": " + data.subject;
    var body = [
      "Hello Durban Paws Rescue team,",
      "",
      data.message,
      "",
      "Message type: " + topic,
      "Name: " + data.fullName,
      "Email: " + data.email,
      "Phone: " + (data.phone || "not given"),
      "",
      "Sent from the contact form at " + siteUrl
    ].join("\r\n");

    return {
      to: recipient,
      subject: subject,
      body: body,
      mailto:
        "mailto:" + recipient +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body)
    };
  }

  window.PawsForms = {
    rules: rules,
    money: money,
    formatDate: formatDate,
    parseISODate: parseISODate,
    nextOrientationDate: nextOrientationDate,
    buildEnquiryResponse: buildEnquiryResponse,
    buildEmail: buildEmail,
    submitEnquiry: submitEnquiry
  };

  /* ---------- Enquiry page wiring ---------- */

  function initEnquiry() {
    var form = document.getElementById("enquiry-form");
    if (!form) return;

    var status = document.getElementById("form-status");
    var panel = document.getElementById("enquiry-response");
    var typeSelect = document.getElementById("enquiry-type");
    var submitButton = form.querySelector('button[type="submit"]');
    var dateInput = document.getElementById("visit-date");

    // The form's action attribute is the address the data is sent to.
    var action = form.getAttribute("action") || "";
    var endpoint = /^https:\/\//.test(action) && action.indexOf("REPLACE_WITH") === -1 ? action : "";

    // Fill the next orientation date into the FAQ answer.
    document.querySelectorAll("[data-next-orientation]").forEach(function (node) {
      node.textContent = formatDate(nextOrientationDate(new Date()));
    });

    watchForm(form);
    watchCounter(document.getElementById("message"), document.getElementById("message-count"), 1000);

    // Limit the date picker to the next 60 days.
    var today = startOfDay(new Date());
    dateInput.min = toISODate(today);
    dateInput.max = toISODate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 60));

    // Show only the questions that belong to the chosen enquiry type.
    function updateConditionalFields() {
      var type = typeSelect.value;
      form.querySelectorAll("[data-show-for]").forEach(function (group) {
        var visible = group.getAttribute("data-show-for") === type;
        group.hidden = !visible;
        group.querySelectorAll("input, select, textarea").forEach(function (control) {
          control.disabled = !visible;
          if (control.hasAttribute("data-required")) control.required = visible;
          if (!visible) {
            control.value = "";
            setError(control, "");
          }
        });
      });
    }
    typeSelect.addEventListener("change", updateConditionalFields);

    // A link such as enquiry.html?type=fostering preselects the enquiry type.
    var wanted = new URLSearchParams(window.location.search).get("type");
    if (wanted && Array.prototype.some.call(typeSelect.options, function (o) { return o.value === wanted; })) {
      typeSelect.value = wanted;
    }
    updateConditionalFields();

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var failed = validateForm(form);
      if (failed.length) {
        setStatus(status, failureCount(failed.length), "error");
        failed[0].focus();
        return;
      }

      var values = collect(form);
      var data = {
        fullName: values["full-name"],
        email: values.email,
        phone: values.phone || "",
        enquiryType: values["enquiry-type"],
        animal: values.animal,
        visitDate: values["visit-date"],
        fosterAnimal: values["foster-animal"],
        fosterLength: values["foster-length"],
        volunteerDays: values["volunteer-days"],
        sponsorTier: values["sponsor-tier"],
        message: values.message
      };

      var now = new Date();
      var reference = makeReference(now);
      var payload = {};
      Object.keys(data).forEach(function (key) {
        if (data[key] !== undefined && data[key] !== "") payload[key] = data[key];
      });
      payload.reference = reference;
      payload.submittedAt = now.toISOString();
      payload._subject = "New website enquiry (" + data.enquiryType + "): " + reference;

      submitButton.disabled = true;
      form.setAttribute("aria-busy", "true");
      setStatus(status, "Sending your enquiry...", "");

      submitEnquiry(payload, endpoint)
        .then(function (result) {
          showResponse(buildEnquiryResponse(data, now), reference, result.simulated);
          setStatus(status, "", "");
        })
        .catch(function () {
          setStatus(
            status,
            "We could not send your enquiry. Check your connection and try again. Your answers are still in the form.",
            "error"
          );
        })
        .then(function () {
          submitButton.disabled = false;
          form.removeAttribute("aria-busy");
        });
    });

    function showResponse(response, reference, simulated) {
      while (panel.firstChild) panel.removeChild(panel.firstChild);

      var heading = el("h2", "", response.heading);
      heading.tabIndex = -1;
      panel.appendChild(heading);
      panel.appendChild(el("p", "response-intro", response.intro));

      var list = el("dl", "response-list");
      response.rows.forEach(function (row) {
        var group = el("div");
        group.appendChild(el("dt", "", row[0]));
        group.appendChild(el("dd", "", row[1]));
        list.appendChild(group);
      });
      panel.appendChild(list);

      panel.appendChild(el("p", "response-reference", "Your reference number is " + reference + "."));
      if (simulated) {
        panel.appendChild(
          el("p", "response-demo", "Demo mode: this enquiry was not sent anywhere. Add your Formspree address to the form action in enquiry.html to send it for real.")
        );
      }

      var actions = el("div", "response-actions");
      var again = el("button", "button-secondary", "Make another enquiry");
      again.type = "button";
      again.addEventListener("click", function () {
        form.reset();
        updateConditionalFields();
        form.querySelectorAll("[data-rule]").forEach(function (control) { setError(control, ""); });
        watchCounterUpdate();
        panel.hidden = true;
        form.hidden = false;
        document.getElementById("full-name").focus();
      });
      actions.appendChild(again);
      var more = el("a", "button-link", "See all our services");
      more.href = "services.html";
      actions.appendChild(more);
      panel.appendChild(actions);

      form.hidden = true;
      panel.hidden = false;
      heading.focus();
    }

    function watchCounterUpdate() {
      document.getElementById("message").dispatchEvent(new Event("input"));
    }
  }

  /* ---------- Contact page wiring ---------- */

  function initContact() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var status = document.getElementById("contact-status");
    var preview = document.getElementById("email-preview");
    var recipient = config.recipientEmail || "";
    var siteUrl = config.siteUrl || window.location.href;

    watchForm(form);
    watchCounter(document.getElementById("c-message"), document.getElementById("c-message-count"), 1000);

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var failed = validateForm(form);
      if (failed.length) {
        setStatus(status, failureCount(failed.length), "error");
        failed[0].focus();
        return;
      }

      var values = collect(form);
      var email = buildEmail(
        {
          fullName: values["full-name"],
          email: values.email,
          phone: values.phone || "",
          topic: values.topic,
          subject: values.subject,
          message: values.message
        },
        recipient,
        siteUrl
      );

      document.getElementById("preview-to").textContent = email.to;
      document.getElementById("preview-subject").textContent = email.subject;
      document.getElementById("preview-body").textContent = email.body;
      document.getElementById("send-email").href = email.mailto;

      setStatus(status, "", "");
      form.hidden = true;
      preview.hidden = false;
      preview.querySelector("h3").focus();
    });

    document.getElementById("edit-message").addEventListener("click", function () {
      preview.hidden = true;
      form.hidden = false;
      document.getElementById("c-full-name").focus();
    });

    document.getElementById("copy-email").addEventListener("click", function () {
      var copyStatus = document.getElementById("copy-status");
      var text =
        "To: " + document.getElementById("preview-to").textContent + "\n" +
        "Subject: " + document.getElementById("preview-subject").textContent + "\n\n" +
        document.getElementById("preview-body").textContent;

      function done(message) {
        copyStatus.textContent = message;
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { done("Email text copied."); },
          function () { done("Copy failed. Select the text above and copy it by hand."); }
        );
      } else {
        var range = document.createRange();
        range.selectNodeContents(document.getElementById("preview-body"));
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        done("Text selected. Press Ctrl+C to copy it.");
      }
    });
  }

  function start() {
    initEnquiry();
    initContact();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
