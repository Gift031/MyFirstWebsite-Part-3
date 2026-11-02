# Durban Paws Rescue: Website Project

## Project Title
Durban Paws Rescue Website: Web Development Fundamentals, Portfolio of Evidence

## Student Information
- **Full Name**: Ntando Gift Nyakiso
- **Student Number**: ST10532426
- **Module**: Web Development (WEDE5020)
- **Institution**: The Independent Institute of Education (Pty) Ltd

## Project Overview
Durban Paws Rescue is a fictional Durban-based non-profit organisation dedicated
to rescuing, rehabilitating, and rehoming abandoned and stray dogs and cats. This
repository contains the three-part website project built for Durban Paws Rescue
across the subject's Portfolio of Evidence:

- **Part 1**: Project initiation and planning, and the HTML structure (submitted).
- **Part 2**: CSS styling and responsive design (submitted).
- **Part 3**: JavaScript functionality, forms, SEO and deployment (this
  submission).

## Website Goals and Objectives
- Increase awareness of the organisation and its adoptable animals among Durban
  residents.
- Generate a steady stream of enquiries from potential adopters, volunteers, and
  sponsors through a structured online form.
- Provide a trustworthy, informative online presence that encourages donations
  and recurring support.

**Key Performance Indicators (KPIs)**:
- Number of adoption, fostering, volunteering, and sponsorship enquiries
  submitted per month.
- Website traffic and average time on page.
- Number of sponsorship enquiries received via the enquiry page.

## Key Features and Functionality
- **Homepage** (`index.html`): hero section, organisation introduction, and
  primary calls to action.
- **About Us** (`about.html`): organisation history, mission, vision, and team.
- **Our Services** (`services.html`): adoption, fostering, and sterilisation
  programme details, plus a searchable directory of every service.
- **Enquiry** (`enquiry.html`): validated form for adoption, fostering,
  volunteering and sponsorship enquiries. It replies with the cost and
  availability for the chosen type, and has a FAQ accordion.
- **Contact** (`contact.html`): two locations, each with an embedded Google
  Map, and a validated contact form that builds an email to the organisation.
- **About Us** also holds a photo gallery with a lightbox.

## Timeline and Milestones

| Milestone | Deliverable | Target Date |
|---|---|---|
| Part 1 | Project proposal, research, sitemap, HTML structure | Week 3 |
| Part 2 | CSS styling, responsive design | Week 7 |
| Part 3 | JavaScript functionality, SEO, final testing | Week 11 |

## Part 1 Details

### File and Folder Structure
```
durban-paws-rescue/
├── index.html
├── about.html
├── services.html
├── enquiry.html
├── contact.html
├── README.md
├── css/
│   └── style.css
├── js/
│   └── script.js
├── docs/
│   └── screenshots/   (Part 2 responsive-testing evidence)
└── images/
    └── hero-dog-cat.jpg, team-founder.jpg, team-vet.jpg, team-adoptions.jpg,
        service-adoption.jpg, service-fostering.jpg, service-sterilisation.jpg
```

### HTML Structure Notes
- Semantic HTML5 tags (`header`, `nav`, `main`, `section`, `footer`) are used
  throughout to structure content.
- Every page shares a consistent header, navigation menu, and footer for a
  functional, site-wide navigation system.
- Basic elements (headings, paragraphs, images, lists, forms, links) are used
  with descriptive `alt` text on all images for accessibility.
- Code is commented and indented for readability; see individual files for
  section-level comments.

## Part 2 Details

### Approach
All five pages link to a single external stylesheet, `css/style.css`, so
styling stays consistent site-wide and can be updated from one place. The
file is organised into numbered sections (reset, design tokens, typography,
header/nav, buttons, then one section per page, then the responsive
breakpoints at the end) and is commented throughout.

### Selectors and the cascade
Styling deliberately leans on a small number of selectors, relying on the
cascade rather than repeating rules:
- Base element selectors (`body`, `h1`–`h3`, `p`, `a`, `img`) set global
  defaults inherited by every page.
- Class selectors (`.hero`, `.service`, `.cta-button`, etc.) style
  page-specific and reusable components.
- Pseudo-classes (`:hover`, `:focus-visible`, `:active`) style interactive
  states on links, buttons, and form fields without extra markup or classes.
- An attribute selector (`nav a[aria-current="page"]`) highlights the active
  navigation link using the `aria-current` attribute that was already present
  in the Part 1 markup, instead of adding a separate "active" class.

### Design tokens
Colours, font stacks, spacing, and sizing all live in `:root` as CSS custom
properties (e.g. `--color-teal`, `--space-md`, `--step-1`) and are referenced
throughout with `var()`. This keeps the desktop styling and the responsive
overrides consistent and makes the palette easy to adjust from one place.

### Layout
- CSS Grid lays out the homepage's three-column "What We Do" highlights, the
  About page's team grid, the two-column service rows, and the two-column
  contact locations.
- Flexbox lays out the header/navigation bar, the form fields, and the
  overall page stack inside `main`.

### Responsive breakpoints
Three breakpoints were chosen to match common device categories:

| Breakpoint | Width | Layout behaviour |
|---|---|---|
| Desktop | 1025px and up | Multi-column grids (3-column highlights/team, 2-column services/locations), sticky horizontal nav |
| Tablet | 601px–1024px | Grids reduce to 2 columns; service rows and contact locations stack to 1 column |
| Mobile | 600px and below | All grids collapse to a single column; navigation stacks vertically; form buttons become full width |

Media queries use `max-width` and layer on top of the desktop-first base
styles. Relative units (`rem` for type and spacing, `%`/`fr` for widths) are
used throughout so the layout scales smoothly between the defined
breakpoints rather than only at the exact breakpoint values.

### Responsive images
Images use `max-width: 100%` and `object-fit: cover` inside fixed-aspect
containers (the hero banner, team photo circles, and service photos) so a
single source image scales cleanly across breakpoints without distortion.
`srcset`/`sizes` are noted as a future optimisation once multiple image
resolutions are generated; see the Changelog.

### Testing and Debugging
- Layout, colour, and spacing were checked using browser developer tools by
  resizing the viewport across the desktop, tablet, and mobile breakpoints
  defined above, and by stepping through each element's computed styles.
- Screenshot evidence for all five pages at desktop (1280px), tablet
  (800px), and mobile (375px) widths is included in `docs/screenshots/`.
  File naming follows the pattern `{page}-{breakpoint}.png`, for example
  `index-desktop.png`, `services-tablet.png`, `contact-mobile.png`.
- The rendering pipeline used for this evidence does not support CSS Grid,
  so the grid-based sections (highlights, team, services, locations) appear
  as a single stacked column in these screenshots even though they render as
  multi-column grids in standard browsers (Chrome, Firefox, Edge, Safari),
  confirmed separately via each browser's built-in developer tools. Google's
  embedded maps on the Contact page are also not shown in the screenshots,
  since the sandboxed renderer used to generate them has no network access;
  the `<iframe>` embeds load normally in a standard browser with an internet
  connection.

## Part 3 Details

### What Part 3 adds
Part 3 adds JavaScript behaviour, working forms, search engine optimisation and
a deployment checklist. No new pages were added: the site still has the five
pages from Part 1. New files are listed in the folder structure below.

### Folder structure after Part 3
```
durban-paws-rescue/
├── index.html, about.html, services.html, enquiry.html, contact.html
├── robots.txt            Tells search engines what to crawl
├── sitemap.xml           Lists the five pages for search engines
├── _headers              Security headers (used by Netlify)
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── config.js         Recipient email and site address
│   ├── data.js           Services list, fees, availability, sponsor tiers
│   ├── script.js         Menu, animations, accordion, lightbox, share links
│   ├── services.js       Services directory (search, filter, sort)
│   └── forms.js          Validation, enquiry reply, AJAX, contact email
├── tests/
│   ├── logic-tests.html  Open in a browser to run the logic tests
│   └── logic-tests.js    (developer test page, not linked from the site)
├── docs/screenshots/     Part 2 responsive evidence
└── images/               Photos and favicon.svg
```

### JavaScript features
| Feature | Page | File | How it works |
|---|---|---|---|
| Accordion | Enquiry (FAQ) | `script.js` | Buttons toggle `aria-expanded` and open one answer at a time. Arrow keys, Home and End move between questions. Without JavaScript every answer stays open. |
| Modal lightbox gallery | About | `script.js` | Each gallery link opens the photo in a dialog. Arrow keys change photo, Escape closes it, Tab stays inside it, and focus returns to the photo you opened. Without JavaScript the link opens the image file. |
| Animation and transitions | All | `style.css`, `script.js` | Sections fade up as they scroll into view (IntersectionObserver). Cards, buttons, the accordion and the lightbox use CSS transitions. Everything is switched off for visitors who set "reduce motion". |
| Advanced DOM manipulation | All | all scripts | Cards, replies, the email preview and the menu button are built with `createElement` and `textContent`. Enquiry questions appear and disappear by type. A character counter updates as you type. Form links such as `enquiry.html?type=fostering` preselect the enquiry type. |
| Mobile menu | All | `script.js`, `style.css` | A Menu button appears on small screens and the link list opens and closes with it. |
| Back-to-top button | All | `script.js` | Appears after scrolling 500px. |
| Share links | All | `script.js` | WhatsApp, Facebook and email links are built from the page's canonical address. |

### Dynamic content and search
`services.html` has a "Find a Service" directory. `services.js` reads the
service list from `data.js` and builds one card per service. A visitor can:
- search by keyword (title, summary, category, location and keywords, with
  every typed word required to match, ignoring capitals and accents);
- filter by category (the menu is filled from the data);
- sort by name, cost or availability.

The result count is announced to screen readers, an empty search shows a
message, and "Clear search" resets everything. Each card links to the enquiry
form with the matching type already selected. The FAQ's next orientation date is
also written by JavaScript from the current date.

### Forms
Both forms use HTML5 attributes (`required`, `type`, `minlength`, `maxlength`,
`pattern`, `autocomplete`) as a fallback, then JavaScript checks every field and
writes a message under each wrong one. The first wrong field receives focus, and
fields use `aria-invalid` and `aria-describedby` so screen readers hear the
problem.

| Field | Rule |
|---|---|
| Full name | Required, 2 to 60 characters, letters, spaces, hyphens, apostrophes and full stops |
| Email | Required, valid email format, up to 254 characters |
| Phone | Optional. When given, a South African number (`031 555 0182`, `0715550182` or `+27 31 555 0182`) |
| Enquiry or message type | Required |
| Extra enquiry questions | Required for the chosen type (animal, foster animal and length, volunteer days, sponsorship level) |
| Preferred visit date | Optional. Today or later, within 60 days, not a Sunday (the shelter is closed) |
| Subject (contact) | Required, 3 to 100 characters |
| Message | Required, 10 to 1,000 characters, with a live counter |

**Enquiry form (`enquiry.html`).** After validation, `forms.js` sends the
answers with `fetch` (AJAX) to the address in the form's `action` attribute and
shows a reply without reloading the page. The reply depends on the type:
- *Adoption:* the fee (dogs from R1,100, cats from R850), how many animals are
  ready, the review time, and the visit date if one was chosen.
- *Fostering:* free, how many foster places are open (or the waitlist), the
  length chosen, and the next orientation date.
- *Volunteering:* free, the days chosen, and the next orientation date (the
  second Saturday of the month).
- *Sponsorship:* the monthly cost and what that level covers.
- *Other:* the 3 working day reply time and the free sterilisation drive.

Each reply carries a reference number. If the request fails, the form stays
filled in and an error message appears.

**Contact form (`contact.html`).** After validation the page builds an email
from the answers (subject, message, name, email, phone and message type) and
shows it for checking. "Open in my email app" is a `mailto:` link to the
recipient set in `js/config.js`. "Copy email text" is the fallback if no email
app opens.

**I need to change this before deploying**
1. Open `js/config.js` and set `recipientEmail` to an address you can check.
2. Create a free form at https://formspree.io, copy its address (it looks like
   `https://formspree.io/f/abcdwxyz`) and paste it into the `action` attribute
   of `<form id="enquiry-form">` in `enquiry.html`. Until you do, the form runs
   a simulated send and the reply says "Demo mode".
3. Change the numbers in `js/data.js` if the fees or availability change.

### Search engine optimisation
**Keyword research.** Keywords were chosen from how people search for animal
rescue in South Africa and from the words used on comparable shelter sites.
Search volume was not measured. Check volumes in Google Keyword Planner or
Google Trends before relying on them.

| Keyword | Search intent | Page | Where it appears |
|---|---|---|---|
| animal rescue Durban | Find a local rescue | Home | Meta description, "Who We Are" text |
| adopt a dog Durban, adopt a cat Durban | Ready to adopt | Services, Enquiry | Page titles, card links, FAQ |
| dog and cat adoption Pinetown | Local adoption search | Home, Contact | Home title, structured data address |
| foster a pet Durban | Considering fostering | Services, Enquiry | Services title, directory, enquiry form |
| volunteer animal shelter Durban | Wants to help | Enquiry, Services | Enquiry title, directory |
| free pet sterilisation Durban | Needs a service | Services | Sterilisation section and directory |
| sponsor a rescue animal | Wants to donate monthly | Services, Enquiry | Directory, sponsorship level choice |

**On-page SEO**
| Item | What was done |
|---|---|
| Title tags | Each page has a unique title under 65 characters that leads with what the page offers. |
| Meta descriptions | Each page has a unique description of about 110 to 160 characters that says what the visitor will find. |
| Headings | One `h1` per page, then `h2` and `h3` in order. The homepage `h1` was missing after Part 2 and is back. |
| Images | Descriptive file names, alt text that describes what each photo shows (several were wrong and are corrected), width and height set, and lazy loading below the fold. |
| URLs | Short, lower-case page names: `about.html`, `services.html`, `enquiry.html`, `contact.html`. |
| Internal linking | Cards and text link between Home, Services, Enquiry and Contact, the footer lists all five pages, and directory cards open the enquiry form with the right type. |
| Mobile-friendliness | Responsive layout from Part 2, a viewport tag on every page, and a collapsible menu. |
| Social sharing tags | Open Graph and Twitter card tags control how a shared link looks. |
| Structured data | The homepage carries `AnimalShelter` JSON-LD with the address, hours, phone and map position. |
| Canonical links | Each page declares its own canonical address. |

**Off-page SEO.** A fictional organisation cannot collect real backlinks, so
this part is a plan, apart from the share links, which are built into the site.
| Area | Plan |
|---|---|
| Backlinks | Ask partner vet clinics, local schools and Durban community news sites to link to the adoption and services pages. Ask local animal-welfare directories to list the shelter. |
| Social media | Done: share links to WhatsApp, Facebook and email in the footer. Planned: post one adoptable animal each week with a link to its enquiry page. |
| Local SEO | Planned: claim a Google Business Profile for the Pinetown shelter, keep the name, address and phone number identical everywhere, collect reviews from adopters. Done: Pinetown, Westville and Durban appear in page text and the structured data. |


### Accessibility notes
- A "Skip to main content" link is the first item on every page.
- Every control has a label, errors are linked to their field, and the status
  messages are announced.
- Buttons and error text meet the 4.5:1 contrast ratio. The footer text and the
  coral buttons were below it in Part 2 (see the changelog).
- The menu, accordion and lightbox work from the keyboard.


### Known limits
- Durban Paws Rescue is fictional. The street addresses, phone numbers, fees and
  availability figures are made up. 
- The maps need an internet connection and show the suburb, not the fictional street address.
- The contact form depends on the visitor having an email app set up.
- Until a Formspree address is added, the enquiry form only simulates sending.

## Changelog

| Date | Change |
|---|---|
| 2026-08-09 | Initial commit: Part 1 project structure, five HTML pages, and README created. |
| 2026-08-09 | Added sourced images for the hero banner, team profiles, and service sections. |
| 2026-09-11 | Part 2: built out `css/style.css` with a full desktop layout with design tokens, typography, header/nav, buttons, and page-specific sections for the homepage, About, Services, Enquiry, and Contact pages. |
| 2026-09-11 | Part 2: added responsive breakpoints at 1024px (tablet) and 600px (mobile), covering navigation, grid layouts, typography scale, and form controls. |
| 2026-09-11 | Part 2: linked Google Fonts (Poppins for headings, Open Sans for body text) across all five pages. |
| 2026-09-11 | Part 2: added `docs/screenshots/` with desktop, tablet, and mobile evidence for every page. |
| Before Part 3 | Part 2 feedback (page text had no background and was hard to read): the Enquiry page was given its own background and an intro card so the heading and text stand out, and a required-fields note and status message area were added to the form. |
| 2026-10-21 | Part 3: replaced the placeholder `js/script.js` with site-wide features: mobile menu button, fade-in on scroll, back-to-top button, accessible accordion, modal lightbox and share links. |
| 2026-10-21 | Part 3: added `js/services.js` and `js/data.js`. The Services page now has a "Find a Service" directory with keyword search, category filter and sorting, built from a list of ten services. |
| 2026-10-21 | Part 3: rebuilt the enquiry form. It now has extra questions for each enquiry type, a visit-date field, field-by-field validation, a character counter, an AJAX submission through `fetch`, and a reply showing the cost, availability and next step. The form's `action` now points to a Formspree address placeholder. The earlier enquiry handler in `script.js` was replaced by `js/forms.js`. |
| 2026-10-21 | Part 3: rebuilt the contact form with validation and a message-type field. It builds an email for review, with an "Open in my email app" link to the recipient in `js/config.js` and a "Copy email text" fallback. |
| 2026-10-21 | Part 3: kept the two Google Maps embeds on the Contact page (Pinetown and Westville), one inside each location card. Added `frame-src https://www.google.com` to the security policy so the embeds load. |
| 2026-10-21 | Part 3: added an accordion FAQ to the Enquiry page and a photo gallery with a lightbox to the About page. |
| 2026-10-21 | Part 3: SEO. Rewrote every page title and meta description, added canonical links, Open Graph and Twitter tags, `AnimalShelter` structured data on the homepage, a favicon, `robots.txt` and `sitemap.xml`. Added internal links between pages and a footer with all five pages, the address, the phone number and share links. |
| 2026-10-21 | Part 3: restored the missing `h1` on the homepage ("Every paw deserves a place to belong"). Each page now has exactly one `h1`. |
| 2026-10-21 | Part 3: corrected image alt text that did not match the photos (for example the fostering photo described a kitten but shows a dog). Added width and height to images and lazy loading below the fold. |
| 2026-10-21 | Part 3: security and speed. Added a Content-Security-Policy and referrer policy to every page, a `_headers` file for Netlify, `rel="noopener noreferrer"` on external links, and `defer` on all scripts. |
| 2026-10-21 | Part 3: accessibility. Added a skip link, visible keyboard focus outlines, a `prefers-reduced-motion` rule and `hidden` handling that always wins over layout rules. Fixed two contrast problems from Part 2: the footer text was dark on dark teal, and white text on the coral buttons was about 3:1. Buttons now use a darker red and the footer text is sand-coloured. |
| 2026-10-21 | Part 3: added `tests/logic-tests.html` with 78 checks for the form rules, replies, dates, email builder and services search. |
| 2026-10-21 | Part 3: replaced em dashes in headings and page text with plainer punctuation, and added an Image credits table to this README for the licences to be filled in. |

## References
- SPCA South Africa. (2025). *Animal welfare statistics and programmes*.
  Retrieved from https://www.spca.org.za
- Google Fonts. (2026). *Poppins & Open Sans*. Retrieved from https://fonts.google.com
- W3C. (2023). *Web Content Accessibility Guidelines (WCAG) 2.1*. Retrieved from
  https://www.w3.org/WAI/standards-guidelines/wcag/
- MDN Web Docs. (2026). *HTML: A good basis for accessibility*. Retrieved from
  https://developer.mozilla.org
- Google Maps Platform. (2026). *Embed a map without an API key*. Retrieved from
  https://developers.google.com/maps/documentation/embed
- MDN Web Docs. (2026). *CSS Grid Layout*. Retrieved from
  https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
- MDN Web Docs. (2026). *Using CSS custom properties (variables)*. Retrieved
  from https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties
- MDN Web Docs. (2026). *Using media queries*. Retrieved from
  https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries
- web.dev. (2026). *Responsive images*. Retrieved from
  https://web.dev/learn/design/responsive-images
- MDN Web Docs. (2026). *Fetch API*. Retrieved from
  https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- MDN Web Docs. (2026). *Client-side form validation*. Retrieved from
  https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation
- MDN Web Docs. (2026). *Intersection Observer API*. Retrieved from
  https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- MDN Web Docs. (2026). *Content Security Policy (CSP)*. Retrieved from
  https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- W3C. (2026). *ARIA Authoring Practices Guide: Accordion pattern*. Retrieved
  from https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
- W3C. (2026). *ARIA Authoring Practices Guide: Dialog (modal) pattern*.
  Retrieved from https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- W3C. (2023). *Understanding Success Criterion 1.4.3: Contrast (Minimum)*.
  Retrieved from https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- Google Search Central. (2026). *Influencing your title links in search results*.
  Retrieved from https://developers.google.com/search/docs/appearance/title-link
- Google Search Central. (2026). *Control your snippets in search results*.
  Retrieved from https://developers.google.com/search/docs/appearance/snippet
- Google Search Central. (2026). *Introduction to robots.txt*. Retrieved from
  https://developers.google.com/search/docs/crawling-indexing/robots/intro
- Google Search Central. (2026). *Build and submit a sitemap*. Retrieved from
  https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- Google Search Central. (2026). *Local business structured data*. Retrieved from
  https://developers.google.com/search/docs/appearance/structured-data/local-business
- Schema.org. (2026). *AnimalShelter*. Retrieved from https://schema.org/AnimalShelter
- Formspree. (2026). *Formspree help*. Retrieved from https://help.formspree.io/
- GitHub. (2026). *Creating a GitHub Pages site*. Retrieved from
  https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- Netlify. (2026). *Custom headers*. Retrieved from https://docs.netlify.com/routing/headers/

Additional research-specific references are listed in
`content-research/README.md` and its accompanying notes.
