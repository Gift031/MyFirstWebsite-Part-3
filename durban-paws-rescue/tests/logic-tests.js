/*
  logic-tests.js
  Plain JavaScript tests for the pure logic in js/forms.js and js/services.js.
  No test library is needed. Each check records PASS or FAIL on the page.
*/
(function () {
  "use strict";

  var F = window.PawsForms;
  var S = window.PawsServices;
  var D = window.PAWS_DATA;
  var results = [];

  function check(name, condition) {
    results.push({ name: name, ok: Boolean(condition) });
  }

  function has(text, part) {
    return String(text).indexOf(part) !== -1;
  }

  function rowText(response) {
    return response.rows.map(function (row) { return row[0] + ": " + row[1]; }).join("\n");
  }

  // Fixed "today" so the date checks give the same answer on any day: Monday 19 October 2026.
  var today = new Date(2026, 9, 19);

  /* ---- Name ---- */
  check("name: empty is rejected", F.rules.name("") !== "");
  check("name: one letter is rejected", F.rules.name("A") !== "");
  check("name: full name is accepted", F.rules.name("Ntando Gift Nyakiso") === "");
  check("name: hyphen and apostrophe are accepted", F.rules.name("Mary O'Brien-Smith") === "");
  check("name: accented letters are accepted", F.rules.name("Zo\u00EB M\u00FCller") === "");
  check("name: digits are rejected", F.rules.name("John123") !== "");
  check("name: 61 characters are rejected", F.rules.name(new Array(62).join("a")) !== "");

  /* ---- Email ---- */
  check("email: empty is rejected", F.rules.email("") !== "");
  check("email: missing @ is rejected", F.rules.email("name.example.com") !== "");
  check("email: missing domain dot is rejected", F.rules.email("name@example") !== "");
  check("email: space inside is rejected", F.rules.email("na me@example.com") !== "");
  check("email: valid address is accepted", F.rules.email("name@example.com") === "");

  /* ---- Phone ---- */
  check("phone: empty is allowed", F.rules.phone("") === "");
  check("phone: 031 555 0182 is accepted", F.rules.phone("031 555 0182") === "");
  check("phone: +27 format is accepted", F.rules.phone("+27 31 555 0182") === "");
  check("phone: brackets and hyphen are accepted", F.rules.phone("(031) 555-0182") === "");
  check("phone: mobile 0715550182 is accepted", F.rules.phone("0715550182") === "");
  check("phone: too short is rejected", F.rules.phone("12345") !== "");
  check("phone: letters are rejected", F.rules.phone("031 555 CALL") !== "");
  check("phone: leading 00 is rejected", F.rules.phone("0015550182") !== "");

  /* ---- Select, subject, message ---- */
  var fakeSelect = { getAttribute: function () { return "Choose a dog or a cat."; } };
  check("select: empty uses the custom message", F.rules.select("", fakeSelect) === "Choose a dog or a cat.");
  check("select: a chosen value is accepted", F.rules.select("dog", fakeSelect) === "");
  check("subject: two characters are rejected", F.rules.subject("Hi") !== "");
  check("subject: normal subject is accepted", F.rules.subject("Question about adoption") === "");
  check("message: 9 characters are rejected", F.rules.message("123456789") !== "");
  check("message: 10 characters are accepted", F.rules.message("1234567890") === "");
  check("message: spaces alone are rejected", F.rules.message("            ") !== "");
  check("message: 1001 characters are rejected", F.rules.message(new Array(1003).join("a")) !== "");

  /* ---- Visit date (today is Monday 19 October 2026) ---- */
  check("date: empty is allowed", F.rules.date("", null, today) === "");
  check("date: yesterday is rejected", F.rules.date("2026-10-18", null, today) !== "");
  check("date: today is accepted", F.rules.date("2026-10-19", null, today) === "");
  check("date: Saturday is accepted", F.rules.date("2026-10-24", null, today) === "");
  check("date: Sunday is rejected", has(F.rules.date("2026-10-25", null, today), "Sunday"));
  check("date: 60 days ahead is accepted", F.rules.date("2026-12-18", null, today) === "");
  check("date: 61 days ahead is rejected", F.rules.date("2026-12-19", null, today) !== "");
  check("date: 30 February is rejected", F.rules.date("2026-02-30", null, today) !== "");
  check("date: text is rejected", F.rules.date("tomorrow", null, today) !== "");

  /* ---- Orientation date (second Saturday of the month) ---- */
  function iso(date) {
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  }
  check("orientation: from 19 Oct 2026 is 14 Nov 2026", iso(F.nextOrientationDate(new Date(2026, 9, 19))) === "2026-11-14");
  check("orientation: the day before is the same Saturday", iso(F.nextOrientationDate(new Date(2026, 9, 9))) === "2026-10-10");
  check("orientation: on the day itself counts", iso(F.nextOrientationDate(new Date(2026, 9, 10))) === "2026-10-10");
  check("orientation: rolls into the next year", iso(F.nextOrientationDate(new Date(2026, 11, 20))) === "2027-1-9");
  check("formatDate: reads as a full date", F.formatDate(new Date(2026, 10, 14)) === "Saturday 14 November 2026");
  check("parseISODate: rejects a rolled-over date", F.parseISODate("2026-04-31") === null);

  /* ---- Money ---- */
  check("money: R850", F.money(850) === "R850");
  check("money: R1,100", F.money(1100) === "R1,100");

  /* ---- Enquiry replies ---- */
  var base = { fullName: "Ntando Gift Nyakiso", email: "n@example.com", message: "Hello there, a question." };

  var dog = F.buildEnquiryResponse(Object.assign({}, base, { enquiryType: "adoption", animal: "dog", visitDate: "2026-10-24" }), today);
  check("reply: greets by first name", dog.heading === "Thank you, Ntando");
  check("reply: dog fee is R1,100", has(rowText(dog), "R1,100"));
  check("reply: dog availability uses the data file", has(rowText(dog), D.availability.dogsReady + " dogs are ready"));
  check("reply: visit date is echoed back", has(rowText(dog), "Saturday 24 October 2026"));

  var cat = F.buildEnquiryResponse(Object.assign({}, base, { enquiryType: "adoption", animal: "cat" }), today);
  check("reply: cat fee is R850", has(rowText(cat), "R850"));
  check("reply: no visit date gives opening hours", has(rowText(cat), "Monday to Saturday"));

  var foster = F.buildEnquiryResponse(Object.assign({}, base, { enquiryType: "fostering", fosterAnimal: "kittens", fosterLength: "long" }), today);
  check("reply: fostering is free", has(rowText(foster), "Free"));
  check("reply: fostering echoes the choices", has(rowText(foster), "kittens") && has(rowText(foster), "5 to 8 weeks"));
  check("reply: fostering gives the next orientation", has(rowText(foster), "Saturday 14 November 2026"));

  var volunteer = F.buildEnquiryResponse(Object.assign({}, base, { enquiryType: "volunteering", volunteerDays: "weekends" }), today);
  check("reply: volunteering echoes the days", has(rowText(volunteer), "weekends"));

  var sponsor = F.buildEnquiryResponse(Object.assign({}, base, { enquiryType: "sponsorship", sponsorTier: "silver" }), today);
  check("reply: Silver costs R350 a month", has(rowText(sponsor), "R350 a month"));

  var other = F.buildEnquiryResponse(Object.assign({}, base, { enquiryType: "other" }), today);
  check("reply: other enquiries get a 3 day promise", has(rowText(other), "3 working days"));

  var savedDogs = D.availability.dogsReady;
  var savedPlaces = D.availability.fosterPlaces;
  D.availability.dogsReady = 1;
  D.availability.fosterPlaces = 0;
  check("reply: singular wording for one dog", has(rowText(F.buildEnquiryResponse(Object.assign({}, base, { enquiryType: "adoption", animal: "dog" }), today)), "1 dog is ready"));
  check("reply: full foster places mention the waitlist", has(rowText(F.buildEnquiryResponse(Object.assign({}, base, { enquiryType: "fostering" }), today)), "waitlist"));
  D.availability.dogsReady = savedDogs;
  D.availability.fosterPlaces = savedPlaces;

  /* ---- Contact email ---- */
  var email = F.buildEmail(
    { fullName: "Ntando Nyakiso", email: "n@example.com", phone: "", topic: "stray", subject: "Injured dog in Pinetown", message: "There is an injured dog near the taxi rank." },
    "hello@durbanpawsrescue.example",
    "https://example.com/"
  );
  check("email: addressed to the recipient", email.to === "hello@durbanpawsrescue.example");
  check("email: subject names the topic", has(email.subject, "Report a stray or injured animal") && has(email.subject, "Injured dog in Pinetown"));
  check("email: body carries the message and contact details", has(email.body, "injured dog near the taxi rank") && has(email.body, "Email: n@example.com") && has(email.body, "Phone: not given"));
  check("email: mailto link starts correctly", email.mailto.indexOf("mailto:hello@durbanpawsrescue.example?subject=") === 0);
  var bodyPart = email.mailto.split("&body=")[1];
  check("email: mailto body decodes back to the text", decodeURIComponent(bodyPart) === email.body);

  /* ---- Services search, filter and sort ---- */
  var list = D.services;
  function ids(items) { return items.map(function (item) { return item.id; }).join(","); }

  check("search: empty query returns everything", S.filterServices(list, { query: "", category: "all" }).length === list.length);
  check("search: finds foster services", S.filterServices(list, { query: "foster" }).length === 2);
  check("search: ignores letter case", ids(S.filterServices(list, { query: "FOSTER" })) === ids(S.filterServices(list, { query: "foster" })));
  check("search: matches keywords, not just titles", has(ids(S.filterServices(list, { query: "puppy" })), "dog-adoption"));
  check("search: every word must match", ids(S.filterServices(list, { query: "kitten foster" })) === "kitten-foster");
  check("search: no match returns nothing", S.filterServices(list, { query: "zzzz" }).length === 0);
  check("filter: Volunteer category has 2 services", S.filterServices(list, { category: "Volunteer" }).length === 2);
  check("filter: category and query combine", ids(S.filterServices(list, { category: "Adopt", query: "cat" })).indexOf("cat-adoption") !== -1);

  check("sort: cost low to high starts with a free service", S.sortServices(list, "cost-asc")[0].cost === 0);
  check("sort: cost high to low starts with dog adoption", S.sortServices(list, "cost-desc")[0].id === "dog-adoption");
  var byName = S.sortServices(list, "name-asc").map(function (item) { return item.title; });
  check("sort: name A to Z is in order", byName.every(function (title, i) { return i === 0 || byName[i - 1].localeCompare(title) <= 0; }));
  check("sort: name Z to A reverses A to Z", S.sortServices(list, "name-desc")[0].title === byName[byName.length - 1]);
  var byAvailability = S.sortServices(list, "availability");
  check("sort: availability puts Open first and Waitlist last", byAvailability[0].availability === "Open" && byAvailability[byAvailability.length - 1].availability === "Waitlist");
  check("sort: the original list is not changed", list[0].id === "dog-adoption");

  /* ---- Report ---- */
  var passed = results.filter(function (r) { return r.ok; }).length;
  var failed = results.length - passed;
  var out = document.getElementById("results");
  results.forEach(function (r) {
    var li = document.createElement("li");
    li.className = r.ok ? "pass" : "fail";
    li.textContent = (r.ok ? "PASS  " : "FAIL  ") + r.name;
    out.appendChild(li);
  });
  var summary = document.getElementById("summary");
  summary.textContent = passed + " passed, " + failed + " failed";
  summary.className = failed ? "fail" : "pass";
  window.__testSummary = { passed: passed, failed: failed, failures: results.filter(function (r) { return !r.ok; }).map(function (r) { return r.name; }) };
})();
