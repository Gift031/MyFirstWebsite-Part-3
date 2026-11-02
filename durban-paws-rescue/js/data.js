/*
  data.js
  The content the scripts load into the pages: the services directory,
  adoption fees, sponsor tiers and the current availability figures.
  Edit the numbers here and every page that uses them updates itself.
*/
window.PAWS_DATA = {
  fees: {
    dog: 1100,
    cat: 850
  },

  // Animals ready to go home and open foster places, as of the last update.
  availability: {
    dogsReady: 6,
    catsReady: 9,
    fosterPlaces: 3
  },

  sponsorTiers: {
    bronze: { name: "Bronze", monthly: 150, covers: "one month of food for one animal" },
    silver: { name: "Silver", monthly: 350, covers: "food plus routine vaccinations for one animal" },
    gold: { name: "Gold", monthly: 750, covers: "food, vaccinations and one sterilisation each month" }
  },

  // cost: 0 means free. costLabel is the text shown to visitors.
  services: [
    {
      id: "dog-adoption",
      title: "Dog adoption",
      category: "Adopt",
      summary: "Adult dogs and puppies, vaccinated, sterilised and health-checked before they go home.",
      cost: 1100,
      costLabel: "From R1,100",
      availability: "Open",
      location: "Pinetown shelter",
      keywords: ["puppy", "dog", "rehome", "pet"],
      enquiryType: "adoption"
    },
    {
      id: "cat-adoption",
      title: "Cat and kitten adoption",
      category: "Adopt",
      summary: "Cats and kittens ready for a quiet home, with sterilisation and vaccinations included.",
      cost: 850,
      costLabel: "From R850",
      availability: "Open",
      location: "Pinetown shelter",
      keywords: ["cat", "kitten", "rehome", "pet"],
      enquiryType: "adoption"
    },
    {
      id: "short-foster",
      title: "Short-term fostering",
      category: "Foster",
      summary: "Give an animal a home for 2 to 8 weeks while it recovers or waits for adoption. We supply food, bedding and vet cover.",
      cost: 0,
      costLabel: "Free",
      availability: "Limited",
      location: "Your home",
      keywords: ["foster", "carer", "temporary", "recover"],
      enquiryType: "fostering"
    },
    {
      id: "kitten-foster",
      title: "Kitten bottle-feeding foster",
      category: "Foster",
      summary: "Care for orphaned kittens through the night feeds. Training provided before your first placement.",
      cost: 0,
      costLabel: "Free",
      availability: "Waitlist",
      location: "Your home",
      keywords: ["kitten", "bottle", "orphan", "foster"],
      enquiryType: "fostering"
    },
    {
      id: "sterilisation-drive",
      title: "Community sterilisation drive",
      category: "Community",
      summary: "Free sterilisation for qualifying households on the first Saturday of each month. The location rotates by area.",
      cost: 0,
      costLabel: "Free if you qualify",
      availability: "Open",
      location: "Rotating areas",
      keywords: ["sterilise", "spay", "neuter", "free", "vet"],
      enquiryType: "other"
    },
    {
      id: "stray-callout",
      title: "Stray and injured animal call-outs",
      category: "Community",
      summary: "Report a stray or injured animal in eThekwini and a rescue volunteer will respond.",
      cost: 0,
      costLabel: "Free",
      availability: "Open",
      location: "Across Durban",
      keywords: ["stray", "injured", "rescue", "report", "emergency"],
      enquiryType: "other"
    },
    {
      id: "school-talks",
      title: "Humane education school talks",
      category: "Community",
      summary: "A 40-minute talk for schools and youth groups on caring for pets and why sterilisation matters.",
      cost: 0,
      costLabel: "Free",
      availability: "Open",
      location: "Your school",
      keywords: ["school", "education", "children", "talk"],
      enquiryType: "other"
    },
    {
      id: "volunteer-orientation",
      title: "Volunteer orientation",
      category: "Volunteer",
      summary: "A morning at the shelter covering safe handling, cleaning routines and how shifts work.",
      cost: 0,
      costLabel: "Free",
      availability: "Open",
      location: "Pinetown shelter",
      keywords: ["volunteer", "help", "training", "orientation"],
      enquiryType: "volunteering"
    },
    {
      id: "kennel-care",
      title: "Dog walking and kennel care",
      category: "Volunteer",
      summary: "Walk dogs, clean kennels and socialise animals. Weekday and weekend shifts run all year.",
      cost: 0,
      costLabel: "Free",
      availability: "Open",
      location: "Pinetown shelter",
      keywords: ["walk", "kennel", "volunteer", "dogs"],
      enquiryType: "volunteering"
    },
    {
      id: "sponsor-animal",
      title: "Sponsor an animal",
      category: "Sponsor",
      summary: "Cover the monthly cost of an animal in our care. Choose Bronze, Silver or Gold.",
      cost: 150,
      costLabel: "From R150 a month",
      availability: "Open",
      location: "Online",
      keywords: ["sponsor", "donate", "monthly", "support"],
      enquiryType: "sponsorship"
    }
  ]
};
