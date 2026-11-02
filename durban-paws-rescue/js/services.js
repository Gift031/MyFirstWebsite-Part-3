/*
  services.js
  Builds the "Find a service" directory on services.html from the list in
  data.js. Visitors can search by keyword, filter by category and sort by
  name or cost. The cards are created with createElement and textContent,
  so text from the data file can never be read as HTML.
*/
(function () {
  "use strict";

  var data = (window.PAWS_DATA && window.PAWS_DATA.services) || [];

  /* ---------- Pure helpers (also used by tests/logic-tests.html) ---------- */

  // Lower-case the text and strip accents so "Café" matches "cafe".
  function normalise(text) {
    return String(text)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function filterServices(list, options) {
    var query = normalise((options && options.query) || "").trim();
    var words = query ? query.split(/\s+/) : [];
    var category = (options && options.category) || "all";

    return list.filter(function (item) {
      if (category !== "all" && item.category !== category) return false;
      var haystack = normalise(
        [item.title, item.summary, item.category, item.location, (item.keywords || []).join(" ")].join(" ")
      );
      return words.every(function (word) {
        return haystack.indexOf(word) !== -1;
      });
    });
  }

  var availabilityRank = { Open: 0, Limited: 1, Waitlist: 2 };

  function sortServices(list, key) {
    var copy = list.slice();
    copy.sort(function (a, b) {
      switch (key) {
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "cost-asc":
          return a.cost - b.cost || a.title.localeCompare(b.title);
        case "cost-desc":
          return b.cost - a.cost || a.title.localeCompare(b.title);
        case "availability":
          return (
            availabilityRank[a.availability] - availabilityRank[b.availability] ||
            a.title.localeCompare(b.title)
          );
        default:
          return a.title.localeCompare(b.title);
      }
    });
    return copy;
  }

  window.PawsServices = { filterServices: filterServices, sortServices: sortServices };

  /* ---------- Page wiring ---------- */

  var resultsList = document.getElementById("service-results");
  if (!resultsList) return;

  var searchInput = document.getElementById("service-search");
  var categorySelect = document.getElementById("service-category");
  var sortSelect = document.getElementById("service-sort");
  var clearButton = document.getElementById("service-clear");
  var countOutput = document.getElementById("service-count");

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function buildCard(item) {
    var card = el("li", "service-card");

    var top = el("div", "service-card-top");
    top.appendChild(el("span", "badge badge-category", item.category));
    top.appendChild(
      el("span", "badge badge-" + item.availability.toLowerCase(), item.availability)
    );
    card.appendChild(top);

    card.appendChild(el("h3", "", item.title));
    card.appendChild(el("p", "", item.summary));

    var facts = el("dl", "service-facts");
    [["Cost", item.costLabel], ["Where", item.location]].forEach(function (pair) {
      var row = el("div");
      row.appendChild(el("dt", "", pair[0]));
      row.appendChild(el("dd", "", pair[1]));
      facts.appendChild(row);
    });
    card.appendChild(facts);

    var link = el("a", "card-link", "Enquire about this");
    link.href = "enquiry.html?type=" + encodeURIComponent(item.enquiryType);
    card.appendChild(link);

    return card;
  }

  function render() {
    var filtered = filterServices(data, {
      query: searchInput.value,
      category: categorySelect.value
    });
    var sorted = sortServices(filtered, sortSelect.value);

    while (resultsList.firstChild) resultsList.removeChild(resultsList.firstChild);
    sorted.forEach(function (item) {
      resultsList.appendChild(buildCard(item));
    });

    if (sorted.length === 0) {
      var empty = el("li", "service-empty", "No services match your search. Try a different word or choose All categories.");
      resultsList.appendChild(empty);
    }

    countOutput.textContent =
      sorted.length === 1 ? "1 service found" : sorted.length + " services found";

    var isFiltered = searchInput.value.trim() !== "" || categorySelect.value !== "all";
    clearButton.hidden = !isFiltered;
  }

  var timer = null;
  searchInput.addEventListener("input", function () {
    window.clearTimeout(timer);
    timer = window.setTimeout(render, 150);
  });
  categorySelect.addEventListener("change", render);
  sortSelect.addEventListener("change", render);
  clearButton.addEventListener("click", function () {
    searchInput.value = "";
    categorySelect.value = "all";
    render();
    searchInput.focus();
  });

  // Fill the category menu from the data so it never drifts out of date.
  var categories = [];
  data.forEach(function (item) {
    if (categories.indexOf(item.category) === -1) categories.push(item.category);
  });
  categories.sort().forEach(function (name) {
    var option = el("option", "", name);
    option.value = name;
    categorySelect.appendChild(option);
  });

  render();
})();
