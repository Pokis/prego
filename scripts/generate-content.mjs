import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const outputDir = resolve("src/data/generated");
mkdirSync(outputDir, { recursive: true });

const review = (volatility = "annual") => ({
  status: "editorial-ready",
  reviewedAt: "2026-07-31",
  nextReviewAt: volatility === "rapid-review" ? "2026-10-29" : "2027-07-31",
  reviewer: "Clinical reviewer required before public release",
  volatility,
});

const sources = [
  [
    "who-antenatal",
    "World Health Organization",
    "WHO recommendations on antenatal care for a positive pregnancy experience",
    "https://www.who.int/publications/i/item/9789241549912",
    ["global", "eu", "lt"],
    "2016-11-07",
    "stable",
    "Global person-centred antenatal care foundation.",
  ],
  [
    "who-postnatal",
    "World Health Organization",
    "WHO recommendations on maternal and newborn care for a positive postnatal experience",
    "https://www.who.int/publications/i/item/9789240045989",
    ["global", "eu", "lt"],
    "2022-03-30",
    "stable",
    "Global routine postnatal care foundation.",
  ],
  [
    "who-newborn",
    "World Health Organization",
    "Newborn health",
    "https://www.who.int/europe/news-room/fact-sheets/item/newborn-health",
    ["global", "eu", "lt"],
    "2026-07-31",
    "annual",
    "Essential newborn care and postnatal contacts.",
  ],
  [
    "who-feeding",
    "World Health Organization",
    "Infant and young child feeding",
    "https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding",
    ["global", "eu", "lt"],
    "2023-12-20",
    "annual",
    "Feeding support and public-health recommendations.",
  ],
  [
    "cdc-warning",
    "US Centers for Disease Control and Prevention",
    "Urgent Maternal Warning Signs",
    "https://www.cdc.gov/hearher/maternal-warning-signs/index.html",
    ["global", "us"],
    "2026-02-20",
    "rapid-review",
    "Urgent maternal warning-sign framework.",
  ],
  [
    "cdc-medicine",
    "US Centers for Disease Control and Prevention",
    "Medicine and Pregnancy: An Overview",
    "https://www.cdc.gov/medicine-and-pregnancy/about/index.html",
    ["global", "us"],
    "2025-09-22",
    "rapid-review",
    "Do not start or stop medicines based on a generic online list.",
  ],
  [
    "cdc-food",
    "US Centers for Disease Control and Prevention",
    "Safer Food Choices for Pregnant Women",
    "https://www.cdc.gov/food-safety/foods/pregnant-women.html",
    ["global", "us"],
    "2025-01-31",
    "annual",
    "Foodborne-illness risk reduction.",
  ],
  [
    "cdc-alcohol",
    "US Centers for Disease Control and Prevention",
    "About Alcohol Use During Pregnancy",
    "https://www.cdc.gov/alcohol-pregnancy/about/index.html",
    ["general"],
    "2026-04-02",
    "rapid-review",
    "No known safe amount, time or type of alcohol during pregnancy.",
  ],
  [
    "acog-caffeine",
    "American College of Obstetricians and Gynecologists",
    "Moderate Caffeine Consumption During Pregnancy",
    "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2010/08/moderate-caffeine-consumption-during-pregnancy",
    ["general"],
    "2020-10-01",
    "annual",
    "Moderate caffeine guidance and the less-than-200-mg threshold.",
  ],
  [
    "coca-cola-caffeine",
    "The Coca-Cola Company",
    "What is caffeine?",
    "https://www.coca-cola.com/gb/en/about-us/faq/what-is-caffeine",
    ["general"],
    "2026-08-02",
    "rapid-review",
    "Manufacturer example for caffeine in a 330 ml Coca-Cola serving and identification of caffeine-free variants; product labels remain the source for the exact drink and market.",
    "2026-08-02",
  ],
  [
    "cdc-vaccines",
    "US Centers for Disease Control and Prevention",
    "Pregnancy and Vaccines",
    "https://www.cdc.gov/vaccine-safety/about/pregnancy.html",
    ["us"],
    "2025-01-31",
    "rapid-review",
    "US vaccination guidance; confirm current recommendations.",
  ],
  [
    "cdc-milestones",
    "US Centers for Disease Control and Prevention",
    "CDC's Developmental Milestones",
    "https://www.cdc.gov/act-early/milestones/index.html",
    ["global", "us"],
    "2026-02-16",
    "annual",
    "Developmental milestones at 2, 4 and 6 months.",
  ],
  [
    "acog-exercise",
    "American College of Obstetricians and Gynecologists",
    "Exercise During Pregnancy",
    "https://www.acog.org/womens-health/faqs/exercise-during-pregnancy",
    ["global", "us"],
    "2026-07-31",
    "annual",
    "Activity benefits, precautions and warning signs.",
  ],
  [
    "acog-heat",
    "American College of Obstetricians and Gynecologists",
    "Can I use a sauna or hot tub early in pregnancy?",
    "https://www.acog.org/womens-health/experts-and-stories/ask-acog/can-i-use-a-sauna-or-hot-tub-early-in-pregnancy",
    ["general"],
    "2021-09-01",
    "annual",
    "Avoiding sauna and hot-tub overheating, especially early in pregnancy.",
  ],
  [
    "cdc-toxoplasmosis",
    "US Centers for Disease Control and Prevention",
    "About Toxoplasmosis",
    "https://www.cdc.gov/toxoplasmosis/about/",
    ["general"],
    "2025-03-11",
    "annual",
    "Gloves for soil, daily cat-litter changes and careful handwashing.",
  ],
  [
    "nhtsa-seat-belts",
    "US National Highway Traffic Safety Administration",
    "Seat Belt Safety for Adults",
    "https://www.nhtsa.gov/vehicle-safety/seat-belts",
    ["general"],
    "2026-07-31",
    "annual",
    "Seat-belt positioning and air-bag use during pregnancy.",
  ],
  [
    "acog-postpartum",
    "American College of Obstetricians and Gynecologists",
    "Optimizing Postpartum Care",
    "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2018/05/optimizing-postpartum-care",
    ["global", "us"],
    "2018-05-01",
    "stable",
    "Postpartum care as an ongoing process.",
  ],
  [
    "acog-changes",
    "American College of Obstetricians and Gynecologists",
    "Changes During Pregnancy",
    "https://www.acog.org/womens-health/infographics/changes-during-pregnancy",
    ["global", "us"],
    "2026-07-31",
    "annual",
    "High-level fetal and maternal changes.",
  ],
  [
    "nhs-weeks",
    "National Health Service",
    "Week-by-week guide to pregnancy",
    "https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy/",
    ["uk"],
    "2026-07-31",
    "annual",
    "UK week-by-week pregnancy guidance.",
  ],
  [
    "nhs-appointments",
    "National Health Service",
    "Your antenatal care and appointments",
    "https://www.nhs.uk/pregnancy/your-pregnancy-care/your-antenatal-care-and-appointments/",
    ["uk"],
    "2026-04-01",
    "rapid-review",
    "UK appointment pathway and first-pregnancy variations.",
  ],
  [
    "nhs-mental",
    "National Health Service",
    "Mental health in pregnancy",
    "https://www.nhs.uk/pregnancy/mental-health-in-pregnancy-and-after-the-birth/mental-health/",
    ["global", "uk"],
    "2026-03-11",
    "annual",
    "Perinatal mental-health information and escalation.",
  ],
  [
    "nhs-food",
    "National Health Service",
    "Foods to avoid in pregnancy",
    "https://www.nhs.uk/pregnancy/keeping-well/foods-to-avoid/",
    ["uk"],
    "2026-07-31",
    "rapid-review",
    "UK food-safety guidance.",
  ],
  [
    "nice-antenatal",
    "National Institute for Health and Care Excellence",
    "Antenatal care",
    "https://www.nice.org.uk/guidance/ng201",
    ["uk"],
    "2021-08-19",
    "annual",
    "Evidence-based routine antenatal care.",
  ],
  [
    "nice-postnatal",
    "National Institute for Health and Care Excellence",
    "Postnatal care",
    "https://www.nice.org.uk/guidance/ng194",
    ["uk"],
    "2021-04-20",
    "annual",
    "Evidence-based postnatal care.",
  ],
  [
    "aap-safe-sleep",
    "American Academy of Pediatrics",
    "Safe Sleep",
    "https://www.aap.org/en/patient-care/safe-sleep/",
    ["global", "us"],
    "2026-07-31",
    "annual",
    "Infant sleep safety recommendations.",
  ],
  [
    "acog-morning-sickness",
    "American College of Obstetricians and Gynecologists",
    "Morning Sickness: Nausea and Vomiting of Pregnancy",
    "https://www.acog.org/womens-health/faqs/morning-sickness-nausea-and-vomiting-of-pregnancy",
    ["general"],
    "2024-11-01",
    "annual",
    "Common nausea patterns, practical support and escalation when fluids will not stay down.",
  ],
  [
    "acog-back-pain",
    "American College of Obstetricians and Gynecologists",
    "Back Pain During Pregnancy",
    "https://www.acog.org/womens-health/faqs/back-pain-during-pregnancy",
    ["general"],
    "2026-07-31",
    "annual",
    "Everyday back-care measures and reasons to contact care.",
  ],
  [
    "acog-digestive",
    "American College of Obstetricians and Gynecologists",
    "Problems of the Digestive System",
    "https://www.acog.org/womens-health/faqs/problems-of-the-digestive-system",
    ["general"],
    "2026-07-31",
    "annual",
    "Constipation and reflux foundations relevant during pregnancy.",
  ],
  [
    "acog-dental",
    "American College of Obstetricians and Gynecologists",
    "Oral Health Care During Pregnancy and Through the Lifespan",
    "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2013/08/oral-health-care-during-pregnancy-and-through-the-lifespan",
    ["general"],
    "2013-08-01",
    "stable",
    "Routine and necessary dental care during pregnancy.",
  ],
  [
    "acog-skin",
    "American College of Obstetricians and Gynecologists",
    "Skin Conditions During Pregnancy",
    "https://www.acog.org/womens-health/faqs/skin-conditions-during-pregnancy",
    ["general"],
    "2025-11-01",
    "annual",
    "Common skin changes and product ingredients that require pregnancy review.",
  ],
  [
    "cdc-infections",
    "US Centers for Disease Control and Prevention",
    "About Infectious Agents and Reproductive Health",
    "https://www.cdc.gov/niosh/reproductive-health/prevention/infectious.html",
    ["general"],
    "2024-05-10",
    "rapid-review",
    "Infection exposure, hygiene, work and vaccination discussion during pregnancy.",
  ],
  [
    "acog-mental-health",
    "American College of Obstetricians and Gynecologists",
    "Mental Health and Pregnancy",
    "https://www.acog.org/womens-health/videos/mental-health-and-pregnancy",
    ["general"],
    "2025-09-01",
    "annual",
    "Recognition and treatment support for mental-health changes during pregnancy.",
  ],
  [
    "acog-ipv",
    "American College of Obstetricians and Gynecologists",
    "Intimate Partner Violence",
    "https://www.acog.org/womens-health/faqs/intimate-partner-violence",
    ["general"],
    "2026-07-31",
    "annual",
    "Private, nonjudgmental support for control, coercion, threats and violence.",
  ],
  [
    "asrm-natural-fertility",
    "American Society for Reproductive Medicine",
    "Optimizing natural fertility: a committee opinion",
    "https://www.asrm.org/practice-guidance/practice-committee-documents/optimizing-natural-fertility-a-committee-opinion-2021/",
    ["general"],
    "2022-01-01",
    "annual",
    "Fertile-window timing, intercourse frequency, fertility-awareness methods and common conception myths.",
    "2026-08-02",
  ],
  [
    "acog-infertility",
    "American College of Obstetricians and Gynecologists",
    "Evaluating Infertility",
    "https://www.acog.org/womens-health/faqs/evaluating-infertility",
    ["general"],
    "2026-08-02",
    "annual",
    "Age, ovulation, sperm factors and when to seek a fertility evaluation.",
    "2026-08-02",
  ],
  [
    "acog-prepregnancy",
    "American College of Obstetricians and Gynecologists",
    "Prepregnancy Counseling",
    "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2019/01/prepregnancy-counseling",
    ["general"],
    "2019-01-01",
    "annual",
    "Prepregnancy medicine, condition, vaccine, infection, nutrition and substance-use review.",
    "2026-08-02",
  ],
  [
    "cdc-planning-pregnancy",
    "US Centers for Disease Control and Prevention",
    "Planning for Pregnancy",
    "https://www.cdc.gov/pregnancy/about/index.html",
    ["general"],
    "2025-05-08",
    "annual",
    "Folic acid, health history, medicines, vaccines, substances and environmental preparation before pregnancy.",
    "2026-08-02",
  ],
  [
    "cdc-infertility",
    "US Centers for Disease Control and Prevention",
    "Infertility: Frequently Asked Questions",
    "https://www.cdc.gov/reproductive-health/infertility-faq/index.html",
    ["general"],
    "2026-08-02",
    "annual",
    "Female and male fertility factors, including testosterone, anabolic steroids and earlier evaluation prompts.",
    "2026-08-02",
  ],
  [
    "who-preconception",
    "World Health Organization",
    "Preconception care to reduce maternal and childhood mortality and morbidity",
    "https://www.who.int/publications/i/item/9789241505000",
    ["global"],
    "2013-01-01",
    "stable",
    "Global preconception health and pregnancy-outcome foundation for women, men and couples.",
    "2026-08-02",
  ],
].map(
  ([
    id,
    authority,
    title,
    url,
    _scopeTags,
    publishedOrUpdated,
    cadence,
    note,
    retrievedAt = "2026-08-01",
  ]) => ({
    id,
    authority,
    title,
    url,
    publishedOrUpdated,
    retrievedAt,
    cadence,
    note,
  }),
);

const urgent = [
  {
    id: "contact-care-team",
    title: "Contact your doctor or maternity team promptly",
    intro:
      "Some concerns need advice before the next routine appointment even when they do not feel like an emergency. If a symptom becomes severe, sudden or frightening, use urgent care instead.",
    audience: "maternal",
    tier: "care-team",
    signs: [
      {
        title: "A symptom persists or keeps worsening",
        detail:
          "Contact care when pain, nausea, reflux, constipation, itching, swelling or another change is not settling or is disrupting eating, drinking, sleep, walking or daily life.",
      },
      {
        title: "You cannot manage food or fluids normally",
        detail:
          "Ask for help when vomiting continues, fluids are difficult to keep down, urination becomes much less frequent or you feel increasingly weak.",
      },
      {
        title: "You feel unwell or may have an infection",
        detail:
          "New feverishness, a concerning rash, painful urination, worsening cough or a significant infectious exposure deserves pregnancy-specific advice.",
      },
      {
        title: "Your mood or anxiety is affecting daily life",
        detail:
          "Tell a health professional when fear, low mood, panic, intrusive thoughts or poor sleep make it hard to function or care for yourself.",
      },
      {
        title: "You need to change a medicine or treatment",
        detail:
          "Review the exact prescription, painkiller, cold remedy, supplement, cream or treatment before starting, stopping or changing it.",
      },
      {
        title: "You feel unsafe, controlled or pressured",
        detail:
          "Ask to speak with a health professional privately. If there is immediate danger, use emergency help rather than waiting for an appointment.",
      },
    ],
    action:
      "Use the pregnancy or maternity contact route you were given and explain what changed, when it began and whether it is worsening. Escalate immediately if you feel in danger.",
    sourceIds: [
      "who-antenatal",
      "acog-morning-sickness",
      "nhs-mental",
      "acog-ipv",
      "cdc-medicine",
    ],
    review: review("rapid-review"),
  },
  {
    id: "maternal-warning-signs",
    title: "Urgent signs during pregnancy or within a year after birth",
    intro:
      "Get medical care immediately for these symptoms. The list is not exhaustive; if something feels seriously wrong, seek help.",
    audience: "maternal",
    tier: "urgent",
    signs: [
      {
        title: "A headache that will not go away",
        detail:
          "Especially if it worsens, feels unusually severe or comes with vision changes or marked swelling.",
      },
      {
        title: "Dizziness or fainting",
        detail:
          "New, repeated or severe dizziness, confusion, disorientation or loss of consciousness.",
      },
      {
        title: "Changes in vision",
        detail:
          "Flashes, blind spots, blurring, double vision or loss of vision.",
      },
      {
        title: "Fever",
        detail:
          "A temperature at or above the urgent threshold given by your local maternity service.",
      },
      {
        title: "Trouble breathing",
        detail:
          "Difficulty catching your breath, speaking and breathing, or breathing when lying down.",
      },
      {
        title: "Chest pain or a fast-beating heart",
        detail:
          "Pressure, pain, palpitations or an irregular heartbeat, especially with dizziness or breathlessness.",
      },
      {
        title: "Severe nausea and vomiting",
        detail:
          "You cannot keep fluids down, are urinating very little, feel confused, faint or dehydrated.",
      },
      {
        title: "Severe belly pain",
        detail:
          "Sudden, sharp, worsening or persistent abdominal pain, or pain reaching the shoulder, chest or back.",
      },
      {
        title: "Baby movement stops or slows",
        detail:
          "A clear change from your baby's usual movement pattern during pregnancy.",
      },
      {
        title: "Bleeding or fluid leaking during pregnancy",
        detail:
          "Bleeding heavier than spotting, a gush or trickle of fluid, or bad-smelling discharge.",
      },
      {
        title: "Heavy bleeding or abnormal discharge after birth",
        detail:
          "Rapidly soaking pads, large clots, tissue, bad-smelling discharge, weakness or faintness.",
      },
      {
        title: "Severe swelling, redness or pain in one limb",
        detail:
          "Especially a painful, warm or swollen calf, leg or arm on one side.",
      },
      {
        title: "Extreme swelling of hands or face",
        detail:
          "Sudden or marked swelling, especially with headache or vision changes.",
      },
      {
        title: "Overwhelming exhaustion",
        detail:
          "A sudden or extreme inability to function that is not relieved by rest.",
      },
      {
        title: "Thoughts of harming yourself or the baby",
        detail:
          "Or severe confusion, hallucinations, agitation or loss of contact with reality.",
      },
    ],
    action:
      "Call the emergency number for your region or go to an emergency department. Say that you are pregnant or were pregnant within the last year.",
    sourceIds: ["cdc-warning", "who-postnatal"],
    review: review("rapid-review"),
  },
  {
    id: "infant-warning-signs",
    title: "Urgent signs in a newborn or young baby",
    intro:
      "Young babies can become unwell quickly. Contact urgent medical care if you notice these signs or are seriously worried.",
    audience: "infant",
    tier: "urgent",
    signs: [
      {
        title: "Breathing difficulty",
        detail:
          "Grunting, chest pulling in, pauses, very fast breathing, struggling to feed because of breathing or blue/grey color.",
      },
      {
        title: "Hard to wake or unusually floppy",
        detail:
          "Very low activity, poor responsiveness, weak movement or a marked change in alertness.",
      },
      {
        title: "Stopped feeding well",
        detail:
          "Refusing feeds, repeatedly unable to feed, choking with feeds or a clear drop from the baby's pattern.",
      },
      {
        title: "Abnormal temperature",
        detail:
          "Fever or low temperature according to the urgent threshold and measurement method given by local care.",
      },
      {
        title: "Seizure or unusual repetitive movements",
        detail:
          "Jerking that does not stop when held, stiffening, unusual eye movements or loss of responsiveness.",
      },
      {
        title: "Jaundice that needs prompt review",
        detail:
          "Yellow color in the first day, deepening yellow, yellow palms or soles, or jaundice with sleepiness or poor feeding.",
      },
      {
        title: "Signs of dehydration",
        detail:
          "Markedly fewer wet nappies, very dry mouth, a sunken soft spot, unusual sleepiness or poor feeding.",
      },
      {
        title: "A serious change that worries you",
        detail:
          "A weak or unusual cry, persistent vomiting, a new rash that does not fade under pressure, or simply seeming very unwell.",
      },
    ],
    action:
      "Use your baby's urgent care route or local emergency service now. Do not wait for a routine appointment when a young baby seems seriously unwell.",
    sourceIds: ["who-newborn"],
    review: review("rapid-review"),
  },
];

const milestones = [
  [
    "contact-care",
    "Contact a maternity care professional",
    "Arrange prenatal care and ask how urgent concerns should be handled in your area.",
    "positive-test",
    0,
    7,
    "arrange",
    "essential",
    "global",
    ["global", "us", "uk", "eu", "lt"],
    ["who-antenatal"],
  ],
  [
    "review-medicines",
    "Review medicines and supplements",
    "Ask a clinician or pharmacist to review prescriptions, over-the-counter products and supplements; do not stop prescribed medicine on your own.",
    "positive-test",
    0,
    7,
    "discuss",
    "essential",
    "global",
    ["global", "us", "uk", "eu", "lt"],
    ["cdc-medicine"],
  ],
  [
    "early-assessment",
    "Early pregnancy assessment",
    "Confirm your history, care pathway and the early tests your doctor recommends.",
    "gestational-week",
    6,
    13,
    "appointment",
    "essential",
    "region-specific",
    ["global", "us", "uk", "eu", "lt"],
    ["who-antenatal", "nice-antenatal"],
  ],
  [
    "dating-ultrasound",
    "Dating and first-trimester assessment",
    "Your care team may offer ultrasound and screening within a defined pregnancy window.",
    "gestational-week",
    10,
    14,
    "appointment",
    "recommended",
    "region-specific",
    ["us", "uk", "lt"],
    ["who-antenatal", "nice-antenatal"],
  ],
  [
    "screening-decisions",
    "Understand screening choices",
    "Ask what each screening test can and cannot tell you before deciding.",
    "gestational-week",
    10,
    20,
    "discuss",
    "recommended",
    "individual",
    ["global", "us", "uk", "eu", "lt"],
    ["who-antenatal", "nice-antenatal"],
  ],
  [
    "anatomy-scan",
    "Mid-pregnancy anatomy assessment",
    "Confirm the offered window and how results will be explained.",
    "gestational-week",
    18,
    22,
    "appointment",
    "recommended",
    "region-specific",
    ["us", "uk", "lt"],
    ["who-antenatal", "nice-antenatal"],
  ],
  [
    "movement-pattern",
    "Learn your baby's movement pattern",
    "As movement becomes familiar, ask your care team what to do if it slows or changes.",
    "gestational-week",
    20,
    28,
    "discuss",
    "essential",
    "individual",
    ["global", "us", "uk", "eu", "lt"],
    ["cdc-warning"],
  ],
  [
    "diabetes-screen",
    "Ask about gestational diabetes testing",
    "Timing and testing method depend on your medical history and care plan.",
    "gestational-week",
    24,
    28,
    "appointment",
    "recommended",
    "region-specific",
    ["global", "us", "uk", "eu", "lt"],
    ["who-antenatal", "nice-antenatal"],
  ],
  [
    "pregnancy-vaccines",
    "Review pregnancy vaccinations",
    "Confirm current and seasonal recommendations with your clinician.",
    "gestational-week",
    16,
    36,
    "discuss",
    "essential",
    "region-specific",
    ["us", "uk", "lt"],
    ["cdc-vaccines", "nhs-appointments"],
  ],
  [
    "birth-learning",
    "Choose birth and newborn learning",
    "Look for evidence-based antenatal education that includes recovery and newborn care.",
    "gestational-week",
    24,
    34,
    "prepare",
    "recommended",
    "common-practice",
    ["global", "us", "uk", "eu", "lt"],
    ["who-antenatal"],
  ],
  [
    "birth-preferences",
    "Write flexible birth preferences",
    "Record what matters to you while allowing plans to change for safety or preference.",
    "gestational-week",
    28,
    36,
    "prepare",
    "recommended",
    "individual",
    ["global", "us", "uk", "eu", "lt"],
    ["who-antenatal"],
  ],
  [
    "route-and-contacts",
    "Save the route and urgent contacts",
    "Know where to go, how to get there and whom to call day or night.",
    "gestational-week",
    32,
    37,
    "prepare",
    "essential",
    "region-specific",
    ["global", "us", "uk", "eu", "lt"],
    ["who-antenatal", "nhs-appointments"],
  ],
  [
    "feeding-conversation",
    "Discuss feeding support",
    "Learn how feeding support is accessed and how to get help early, whichever feeding path you use.",
    "gestational-week",
    30,
    38,
    "discuss",
    "recommended",
    "individual",
    ["global", "us", "uk", "eu", "lt"],
    ["who-feeding"],
  ],
  [
    "term-plan",
    "Make a term and overdue plan",
    "Ask your doctor what happens if labour has not started by the planned review point.",
    "gestational-week",
    37,
    41,
    "discuss",
    "essential",
    "region-specific",
    ["global", "us", "uk", "eu", "lt"],
    ["who-antenatal", "nice-antenatal"],
  ],
  [
    "first-day-checks",
    "Parent and newborn first-day care",
    "Confirm recovery observations, newborn checks, feeding support and who to contact after discharge.",
    "birth-day",
    0,
    1,
    "parent-recovery",
    "essential",
    "global",
    ["global", "us", "uk", "eu", "lt"],
    ["who-postnatal", "who-newborn"],
  ],
  [
    "day-three-contact",
    "Early postnatal contact",
    "Arrange the early parent-and-baby follow-up in your discharge plan.",
    "birth-day",
    2,
    3,
    "appointment",
    "essential",
    "region-specific",
    ["global", "us", "uk", "eu", "lt"],
    ["who-postnatal", "nice-postnatal"],
  ],
  [
    "week-two-contact",
    "Parent and baby check-in",
    "Discuss feeding, recovery, mood, sleep, jaundice, weight and any concerns.",
    "birth-day",
    7,
    14,
    "appointment",
    "recommended",
    "region-specific",
    ["global", "us", "uk", "eu", "lt"],
    ["who-postnatal", "nice-postnatal"],
  ],
  [
    "postpartum-plan",
    "Comprehensive postpartum care plan",
    "Review physical recovery, mood, feeding, sleep, relationships, contraception and ongoing health.",
    "birth-day",
    21,
    84,
    "parent-recovery",
    "essential",
    "region-specific",
    ["global", "us", "uk", "eu", "lt"],
    ["acog-postpartum", "who-postnatal"],
  ],
  [
    "two-month-development",
    "Two-month development conversation",
    "Notice how your baby plays, communicates and moves; share concerns rather than using milestones as a diagnosis.",
    "birth-day",
    50,
    75,
    "baby-development",
    "recommended",
    "individual",
    ["global", "us", "uk", "eu", "lt"],
    ["cdc-milestones"],
  ],
  [
    "four-month-development",
    "Four-month development conversation",
    "Review emerging social, communication and movement skills with your baby's clinician.",
    "birth-day",
    105,
    135,
    "baby-development",
    "recommended",
    "individual",
    ["global", "us", "uk", "eu", "lt"],
    ["cdc-milestones"],
  ],
  [
    "six-month-development",
    "Six-month development conversation",
    "Discuss development, feeding changes, safety and the next stage of preventive care.",
    "birth-day",
    165,
    195,
    "baby-development",
    "recommended",
    "individual",
    ["global", "us", "uk", "eu", "lt"],
    ["cdc-milestones"],
  ],
].map(
  ([
    id,
    title,
    description,
    anchor,
    start,
    end,
    category,
    importance,
    _regionalStatus,
    _regionIds,
    sourceIds,
  ]) => ({
    id,
    title,
    description,
    anchor,
    start,
    end,
    category,
    importance,
    sourceIds,
    review: review(
      sourceIds.includes("cdc-vaccines") ? "rapid-review" : "annual",
    ),
  }),
);

const babyByWeek = {
  3: "Fertilization and implantation may occur around this stage, although pregnancy dating starts before conception.",
  4: "A tiny group of rapidly dividing cells is establishing the structures that will support pregnancy.",
  5: "Early foundations for the brain, spinal cord and other organs are forming.",
  6: "The embryo is developing quickly; early cardiac activity may be visible on some scans, depending on dating.",
  7: "The brain, face and limb buds continue developing at a remarkable pace.",
  8: "Major body systems are taking shape, though they remain very immature.",
  9: "The embryo is beginning to look more recognisably human, with developing fingers and toes.",
  10: "The fetal stage begins around this period as organs continue their early development.",
  11: "Bones, facial structures and tiny movements are developing, although movement is not usually felt yet.",
  12: "Many major structures are present and continue to mature throughout the rest of pregnancy.",
  13: "Growth becomes the main story as the first trimester draws to a close.",
  14: "The fetus is growing steadily, and the placenta is carrying more of the pregnancy-support work.",
  15: "Bones and muscles continue developing; movements are becoming more coordinated.",
  16: "Facial expressions and limb movements are developing, even if you cannot feel them yet.",
  17: "The skeleton continues to harden and body proportions gradually change.",
  18: "Hearing structures and movement patterns are developing.",
  19: "Protective skin coatings and fine hair begin helping protect delicate skin.",
  20: "This midpoint often coincides with detailed assessment of anatomy in many care systems.",
  21: "Movements may feel more distinct as muscles and the nervous system mature.",
  22: "The lungs are developing their branching structures but are not ready to work independently.",
  23: "Rapid brain, hearing and movement development continues.",
  24: "The pregnancy is entering a period when specialist neonatal care can sometimes support extremely early babies, though outcomes vary greatly.",
  25: "Reflexes and movement patterns are becoming more noticeable.",
  26: "The eyes and nervous system continue maturing; sleep and waking patterns may emerge.",
  27: "The second trimester is ending, with ongoing brain and lung development.",
  28: "The third trimester begins; growth, brain development and fat storage accelerate.",
  29: "Muscles and lungs continue maturing while the brain builds new connections.",
  30: "The fetus is adding body fat and practising breathing movements.",
  31: "The senses and nervous system continue refining; movements may feel strong and patterned.",
  32: "Bones are formed but still relatively soft, and the lungs continue maturing.",
  33: "Growth and fat storage help prepare for temperature regulation after birth.",
  34: "The lungs and nervous system continue their final weeks of preparation.",
  35: "Space is tighter, so movement may feel different, but a clear reduction still needs prompt advice.",
  36: "Many babies move toward a head-down position, although position and timing vary.",
  37: "This is early term in many clinical definitions; important brain and lung development continues.",
  38: "The baby continues gaining weight and practising the reflexes needed after birth.",
  39: "The baby is full term in common clinical definitions and continues preparing for birth.",
  40: "The estimated due date is a reference point, not an appointment the baby has promised to keep.",
  41: "Many healthy pregnancies continue beyond the estimated due date with closer review and an individual plan.",
  42: "Care teams usually recommend a clear monitoring and birth plan when pregnancy extends this far.",
};

const bodyByWeek = {
  3: "You may feel no different. If you are trying to conceive, continue pregnancy-safe habits without assuming a result.",
  4: "A missed period or positive test may be the first clue; mild cramps or spotting can occur, but pain or heavier bleeding needs advice.",
  5: "Fatigue, breast tenderness, frequent urination or nausea may begin—or you may have few symptoms.",
  6: "Nausea, smell sensitivity and tiredness are common. Not having these symptoms does not by itself mean something is wrong.",
  7: "Hormone changes can affect appetite, mood, digestion and energy from one day to the next.",
  8: "Bloating and fatigue may be more noticeable even though there may be little visible bump.",
  9: "Nausea can be intense around this time; ask for help if fluids or food will not stay down.",
  10: "Your blood volume and hormone levels are changing, which can influence headaches, dizziness and energy.",
  11: "Constipation, reflux or food aversions may join earlier symptoms.",
  12: "Some people begin to feel better soon; others do not, and both patterns can be normal.",
  13: "The uterus is rising and clothes may feel different, while emotions may still be unpredictable.",
  14: "Energy may improve, though headaches, nasal stuffiness or round-ligament discomfort can appear.",
  15: "A changing centre of gravity and looser joints make comfortable, steady movement important.",
  16: "You may notice stretching sensations as the uterus grows; sudden severe or persistent pain needs assessment.",
  17: "Back, hip or pelvic discomfort may start; pacing, posture and tailored movement can help.",
  18: "Some first-time parents begin feeling movement now, while others will not for several more weeks.",
  19: "Skin, sleep and appetite can change as the bump becomes more noticeable.",
  20: "You may feel stronger movement and need practical adjustments for sleep, work or exercise.",
  21: "Breathlessness with exertion, reflux and back discomfort can increase gradually.",
  22: "Stretching skin, leg cramps or swelling may appear; sudden or marked symptoms require advice.",
  23: "Sleep positions and supportive pillows may become more relevant as the abdomen grows.",
  24: "Your care team may ask about movement, blood pressure, symptoms and diabetes screening around this period.",
  25: "Pelvic pressure and tiredness may increase; plan rest without assuming you must stop normal activity.",
  26: "Braxton Hicks tightenings can occur, but regular painful contractions or fluid loss need prompt assessment.",
  27: "The second trimester may end with stronger movement and more physical effort in everyday tasks.",
  28: "Third-trimester visits often become more frequent, depending on individual need and the plan your doctor gives you.",
  29: "Sleep disruption, reflux, shortness of breath and back discomfort may become more noticeable.",
  30: "Your body is carrying more blood and weight; gradual swelling can occur, while sudden face or hand swelling needs urgent advice.",
  31: "Movement patterns should be becoming familiar. A clear slowdown or change should be checked promptly.",
  32: "Fatigue may return. Break preparation into small tasks and accept practical help.",
  33: "Pelvic pressure, frequent urination and irregular tightenings are common but should still be discussed if concerning.",
  34: "You may need more rest and more deliberate pacing without becoming completely inactive.",
  35: "Sleep can be fragmented; focus on rest opportunities rather than a perfect night's sleep.",
  36: "Appointments may include discussion of position, birth setting, labour signs and any late-pregnancy tests your doctor recommends.",
  37: "Early signs of labour can be ambiguous. Use the contact rules provided by your maternity service.",
  38: "Pressure, discharge and irregular contractions may change; leaking fluid, bleeding or reduced movement need prompt contact.",
  39: "Waiting can feel emotionally intense. Keep routines gentle and your urgent contacts close.",
  40: "Reaching the estimated due date is common and does not automatically mean something is wrong.",
  41: "Expect a specific conversation about monitoring and options if pregnancy continues.",
  42: "You should be following an individualized plan with your maternity team rather than relying on general web guidance.",
};

const trimesterActions = {
  first: [
    "Arrange prenatal care and learn the urgent contact route.",
    "Review medicines and supplements with a clinician or pharmacist.",
    "Choose food-safety and substance-free habits without chasing perfection.",
  ],
  second: [
    "Keep appointments and write down questions before each visit.",
    "Stay active in ways that feel stable and are appropriate for your pregnancy.",
    "Learn what movement changes should prompt a call later in pregnancy.",
  ],
  third: [
    "Save urgent maternity contacts and plan transport for any time of day.",
    "Discuss birth preferences, feeding support and early recovery.",
    "Notice your baby's usual movement pattern and act promptly on a clear change.",
  ],
};

const monthForWeek = (week) =>
  week <= 4
    ? 1
    : week <= 8
      ? 2
      : week <= 13
        ? 3
        : week <= 17
          ? 4
          : week <= 22
            ? 5
            : week <= 27
              ? 6
              : week <= 31
                ? 7
                : week <= 35
                  ? 8
                  : 9;

const topicsForWeek = (week) => {
  const topics = [];
  if (week <= 13) topics.push("early-pregnancy");
  if (week >= 5 && week <= 14) topics.push("nausea-food");
  if (week <= 14 || (week >= 18 && week <= 28) || week === 32 || week >= 36)
    topics.push("appointments-scans");
  if (
    (week >= 10 && week <= 14) ||
    (week >= 18 && week <= 22) ||
    (week >= 24 && week <= 28)
  )
    topics.push("screening");
  if (week >= 18) topics.push("movement");
  if (week >= 14 && week <= 35) topics.push("exercise-comfort");
  if (week >= 16 && week <= 34) topics.push("work-travel");
  if (week >= 28) topics.push("birth-preparation");
  if (week >= 26) topics.push("labour-signs");
  if (week >= 39) topics.push("due-date");
  return topics;
};

const weekDetails = {
  3: {
    title: "Implantation may be beginning",
    action:
      "If pregnancy is possible, use pregnancy-safe habits now: skip alcohol, check medicines and take the prenatal supplement recommended by your doctor.",
    clarification:
      "Example: week 3 is counted from the last period, so fertilization may only just have happened. It is normal not to feel pregnant.",
    caution:
      "Do not rely on a very early negative test as a final answer; repeat it after the missed period or follow the test instructions.",
    appointment:
      "There is usually no routine appointment this early. Seek care sooner for severe pain, fainting or heavy bleeding.",
    partner:
      "Share the mental load: buy a test or pregnancy supplement if asked, and keep plans low-pressure while the answer is uncertain.",
  },
  4: {
    title: "A missed period and the first test",
    action:
      "After a positive test, contact the maternity-care route for your area and save its urgent phone number.",
    clarification:
      "Mild period-like cramping can happen. Pain that is severe, one-sided, worsening, or paired with dizziness or shoulder-tip pain needs urgent assessment.",
    caution:
      "A home test confirms pregnancy hormone, not where the pregnancy is or whether it is developing normally.",
    appointment:
      "Ask when your first visit is usually booked and what information to prepare, such as the first day of your last period and current medicines.",
    partner:
      "Listen to the reaction before planning. Excitement, fear and uncertainty can appear together.",
  },
  5: {
    title: "Early foundations are forming",
    action:
      "Make one list of prescriptions, painkillers, allergy remedies, vitamins, herbal products and recreational substances to review with a clinician or pharmacist.",
    clarification:
      "Breast tenderness, tiredness, frequent urination and mild cramps are common examples; having none of them can also be normal.",
    caution:
      "Do not stop a prescribed medicine suddenly because its leaflet mentions pregnancy; ask the prescriber how benefits and risks apply to you.",
    appointment:
      "Tell the booking service about previous ectopic pregnancy, miscarriage, fertility treatment, long-term conditions or concerning symptoms because these may change early care.",
    partner:
      "Photograph or write down medicine labels and help make the first call if the pregnant person wants you involved.",
  },
  6: {
    title: "Nausea and fast early development",
    action:
      "Try small, frequent food and drink opportunities; note whether you can keep fluids down and how often you are urinating.",
    clarification:
      "Morning sickness can happen at any time of day. The useful question is not the time—it is whether eating, drinking and daily life remain possible.",
    caution:
      "Do not wait for a routine visit if you cannot keep fluids down, feel faint, have very dark urine or are becoming weaker.",
    appointment:
      "An ultrasound this early may not give a clear answer if dates are uncertain. A repeat scan or blood tests may be suggested rather than an immediate conclusion.",
    partner:
      "Keep plain foods and tolerated drinks within reach, reduce strong cooking smells, and do not police what food is manageable today.",
  },
  7: {
    title: "Food aversions, fatigue and changing moods",
    action:
      "Build a realistic food-safety routine: wash produce, keep raw and ready-to-eat foods separate, and cook animal foods thoroughly.",
    clarification:
      "Example: a balanced week may be more realistic than a perfect plate at every meal when nausea and aversions are strong.",
    caution:
      "Avoid unpasteurized dairy and raw or undercooked meat, eggs, fish and shellfish.",
    appointment:
      "If you have not arranged care, do it now. Ask whether your first contact is with a midwife, obstetric clinician or primary-care professional.",
    partner:
      "Take over shopping or cooking if smells trigger nausea, and ask what is tolerable instead of guessing.",
  },
  8: {
    title: "Your first booking steps",
    action:
      "Prepare a one-page history: last period, previous pregnancies, health conditions, operations, allergies, medicines and family health information you know.",
    clarification:
      "A booking visit is often longer than a normal appointment because it establishes your history, measurements, tests, contacts and next steps.",
    caution:
      "Do not treat an online appointment schedule as fixed; your doctor may change the order or timing for your pregnancy.",
    appointment:
      "Ask what will happen at the booking visit, whether blood or urine samples are expected, and how you will receive results.",
    partner:
      "Help gather history and practical questions, but let the pregnant person choose what is shared and whether you attend.",
  },
  9: {
    title: "When sickness needs more help",
    action:
      "Track drinking, urination and vomiting for one day if nausea is intense; this gives a clinician more useful information than saying it feels bad.",
    clarification:
      "Example: struggling with meals but keeping regular sips down is different from vomiting every drink and barely urinating.",
    caution:
      "Do not dismiss severe vomiting as something everyone must endure; pregnancy-safe treatments may be available through your care team.",
    appointment:
      "Contact care before the scheduled visit if vomiting limits fluids, work or basic activity, or if weight loss or dehydration worries you.",
    partner:
      "Handle phone calls, transport and food experiments; avoid comments about what the pregnant person 'should' be able to eat.",
  },
  10: {
    title: "The fetal stage begins",
    action:
      "Write down your questions about dating and screening before the next visit: what is offered, when, what it can show and what happens after a result.",
    clarification:
      "Screening estimates chance; it is not the same as diagnosis. A higher-chance result usually opens a conversation about further options.",
    caution:
      "Do not consent to a test only because it appears routine—ask what decision the result could help you make.",
    appointment:
      "Dating scans and first-trimester screening sit in defined windows, so confirm your dates with the doctor rather than waiting for a generic week online.",
    partner:
      "Make a shared question list and learn the difference between screening and diagnostic testing without pushing a preferred choice.",
  },
  11: {
    title: "Screening choices may be approaching",
    action:
      "For every offered test, ask four things: what it looks for, how accurate it is, possible next steps and whether it is optional.",
    clarification:
      "An ultrasound due date may replace a last-period estimate when the measurements and clinical context support that change.",
    caution:
      "Do not compare one scan measurement with an app illustration; clinicians interpret measurements together and in context.",
    appointment:
      "Check whether you need a full bladder, whether a support person can attend, and how unexpected findings are communicated.",
    partner:
      "Take notes during the appointment if invited, then repeat back the plan so neither of you has to remember everything under stress.",
  },
  12: {
    title: "Reaching the end of the earliest stretch",
    action:
      "Review the basics you can actually sustain: prenatal supplement, medicine plan, no alcohol or smoking, safer food handling and a care contact.",
    clarification:
      "Symptoms may ease, stay strong or fluctuate. A single better or worse day does not by itself explain how the pregnancy is progressing.",
    caution:
      "Do not use symptom strength, a home Doppler or repeated home tests to reassure yourself about a medical concern.",
    appointment:
      "If you have results pending, confirm who will contact you, by when, and what number to use if you hear nothing.",
    partner:
      "Mark result dates and the next appointment on a shared calendar, with permission, so follow-up does not rest on one person.",
  },
  13: {
    title: "The first trimester is closing",
    action:
      "Bring persistent symptoms into the next visit—constipation, reflux, headaches, anxiety and pelvic pain all count even when they seem 'minor.'",
    clarification:
      "The trimester boundary is a useful label, not a switch: nausea and fatigue do not have to disappear at week 13.",
    caution:
      "Do not start herbal remedies for lingering symptoms without a pregnancy-specific medicine check.",
    appointment:
      "Ask what the second-trimester plan includes and when your mid-pregnancy anatomy assessment will be arranged.",
    partner:
      "Ask which symptom is taking the most energy and remove one practical burden from the coming week.",
  },
  14: {
    title: "The second trimester begins",
    action:
      "If energy allows, settle into regular moderate movement you can maintain—such as walking, swimming or pregnancy-appropriate strength work.",
    clarification:
      "Moderate usually means you can still speak in sentences. Your clinician may give different advice for complications or prior conditions.",
    caution:
      "Stop activity and seek advice for bleeding, fluid leakage, chest pain, faintness, painful regular contractions or other symptoms your team flags.",
    appointment:
      "Confirm the next appointment and anatomy-scan window; there may be several weeks without a routine visit in an uncomplicated pregnancy.",
    partner:
      "Join a walk or make movement easier, without turning exercise into supervision or a performance target.",
  },
  15: {
    title: "Movement is becoming more coordinated",
    action:
      "Adjust one repeated strain: raise a screen, add back support, split lifting loads or change how long you stand at work.",
    clarification:
      "Pregnancy hormones and a changing centre of gravity can make familiar tasks feel different before the bump looks large.",
    caution:
      "Avoid breath-holding and unstable positions when lifting; ask for a workplace or physiotherapy assessment if pain is building.",
    appointment:
      "Use the next visit to ask what aches are expected, what self-care is reasonable and what would need assessment.",
    partner:
      "Take the awkward loads—heavy shopping, low laundry baskets or repeated carrying—before pain forces the conversation.",
  },
  16: {
    title: "A growing uterus and changing balance",
    action:
      "Learn the difference between a brief stretching twinge and pain that is severe, persistent, rhythmic or paired with bleeding or fever.",
    clarification:
      "Round-ligament discomfort is often brief and linked to movement; that label should not be used to explain away new severe pain.",
    caution:
      "Do not self-diagnose abdominal pain from its location alone—call when pain is strong, worsening or comes with other warning signs.",
    appointment:
      "Vaccination recommendations can depend on season and location; ask what is currently recommended rather than relying on an old list.",
    partner:
      "Slow down sudden changes of direction, offer a hand on stairs if wanted, and take pain reports seriously.",
  },
  17: {
    title: "Hips, back and pelvic support",
    action:
      "Notice the trigger for pelvic or back pain—turning in bed, stairs, standing, lifting—and ask early about tailored physiotherapy or movement advice.",
    clarification:
      "Pain deserves help even when it is common. Early adjustments can be easier than waiting until walking or sleep is badly affected.",
    caution:
      "Do not push through sharp pelvic pain in the hope that more exercise will automatically fix it.",
    appointment:
      "Ask how to access pelvic-health support in your system and whether a referral is needed.",
    partner:
      "Keep frequently used items between knee and shoulder height and share tasks that require twisting or repeated stairs.",
  },
  18: {
    title: "You may begin to feel movement",
    action:
      "Notice possible first movements without setting a quota; they may feel like taps, flutters, bubbles or a small muscle twitch.",
    clarification:
      "First-time parents often recognize movement later than people who have been pregnant before. Placenta position and dating can change what is felt.",
    caution:
      "Do not use someone else's movement timeline as a deadline. Ask your care team when they expect you to call if you have felt none.",
    appointment:
      "The anatomy assessment is commonly offered around weeks 18–22; confirm your appointment window and the purpose of the scan.",
    partner:
      "Keep expectations gentle—movement may be felt internally for weeks before it can be felt from the outside.",
  },
  19: {
    title: "Preparing for the anatomy scan",
    action:
      "Write down what you want explained at the anatomy scan, including what is being checked, when results are given and whether a repeat view might be needed.",
    clarification:
      "A repeat scan can simply mean the baby's position did not allow all views; it does not automatically mean a problem was found.",
    caution:
      "Do not treat the anatomy scan as only a sex-reveal appointment; its primary purpose is a structured health assessment.",
    appointment:
      "Check practical instructions: arrival time, bladder guidance, visitor rules, photos and how long the appointment may take.",
    partner:
      "Attend if invited, take notes, and leave space for the clinician to complete the medical examination before asking for extras.",
  },
  20: {
    title: "The halfway point",
    action:
      "Review the next eight weeks: scan follow-up, work adjustments, movement guidance, diabetes testing and any recommended vaccines.",
    clarification:
      "Halfway is approximate. A 40-week due date is an estimate, and birth can occur before or after it.",
    caution:
      "Do not assume a reassuring scan rules out every later complication; continue routine care and act on new warning signs.",
    appointment:
      "Ask for plain-language results: what was seen, what was not seen, whether follow-up is needed and who arranges it.",
    partner:
      "After the scan, compare what each of you heard and write down any unresolved question before details blur.",
  },
  21: {
    title: "Movement may feel more distinct",
    action:
      "Begin noticing when and how movement tends to appear, without forcing a formal counting routine unless your care team recommends one.",
    clarification:
      "Movement can be easier to notice when you pause. The important later signal is a change from this baby's own usual pattern, not comparison with an app.",
    caution:
      "Do not wait until the next day for advice if an established movement pattern becomes clearly slower or different.",
    appointment:
      "Ask your maternity service for its exact reduced-movement contact instructions and save the number now.",
    partner:
      "Learn the reduced-movement route too; never tell someone to wait because you can feel one movement from the outside.",
  },
  22: {
    title: "Sleep, stretching and steady growth",
    action:
      "Test small comfort changes: a pillow between the knees, support behind the back, shorter standing periods or a footrest at work.",
    clarification:
      "Leg cramps, skin stretching and interrupted sleep are common examples; sudden one-sided leg swelling or pain is different and needs urgent advice.",
    caution:
      "Do not massage a painful, hot or noticeably swollen calf while waiting to see if it passes.",
    appointment:
      "Raise sleep, reflux, cramps or swelling at the next visit and ask which changes should prompt an earlier call.",
    partner:
      "Make room in the bed, help arrange pillows and share nighttime tasks that do not require the pregnant person.",
  },
  23: {
    title: "Hearing and movement are strengthening",
    action:
      "Save three contacts in the phone: routine maternity care, urgent maternity assessment and emergency services.",
    clarification:
      "A contact plan is useful before the third trimester because urgent symptoms do not arrive according to an appointment schedule.",
    caution:
      "Do not use a consumer Doppler, smartwatch or home blood-pressure reading to overrule symptoms that need professional assessment.",
    appointment:
      "Ask where you should go outside office hours and whether the route changes before or after a particular gestational week.",
    partner:
      "Store the same numbers and know the route, parking or transport plan without relying on the pregnant person to direct you under stress.",
  },
  24: {
    title: "Movement patterns and common screening",
    action:
      "Ask whether gestational-diabetes testing is offered to everyone or based on risk, how it is done and when results arrive.",
    clarification:
      "Gestational diabetes often has no obvious symptoms. Testing approaches and timing differ by health system and individual history.",
    caution:
      "Do not change to a restrictive diet before testing unless a clinician who knows your pregnancy recommends it.",
    appointment:
      "Weeks 24–28 are a common diabetes-testing window, but your doctor may use a different plan based on your history.",
    partner:
      "Help protect appointment time and plan food, transport or childcare around a test that may take longer than a normal blood draw.",
  },
  25: {
    title: "Pressure, rest and practical adjustments",
    action:
      "Break demanding tasks into shorter blocks and note whether pelvic pressure settles with rest or is becoming rhythmic, painful or persistent.",
    clarification:
      "Pressure can increase as pregnancy grows; pressure with regular cramps, backache, bleeding or fluid leakage needs prompt assessment.",
    caution:
      "Do not assume contractions are harmless tightenings if they are regular, painful, getting closer or happen with fluid loss.",
    appointment:
      "Ask your care team what preterm-labour symptoms should trigger a call and where assessment happens in your area.",
    partner:
      "Take over one energy-heavy routine and know the preterm-assessment route, especially before travel.",
  },
  26: {
    title: "Tightenings: what is common and what is not",
    action:
      "If tightenings occur, pause, hydrate and note timing, pain, fluid loss, bleeding and movement so you can describe the pattern clearly.",
    clarification:
      "Irregular tightenings that settle can occur. Regular, painful or intensifying contractions—especially this early—need maternity advice.",
    caution:
      "Do not spend hours trying home remedies when symptoms are rhythmic, worsening or accompanied by pressure, bleeding or leaking fluid.",
    appointment:
      "Complete any diabetes testing or follow-up your team scheduled and ask what the result changes, if anything.",
    partner:
      "Time symptoms and call the service while the pregnant person rests; do not make them prove that the sensation is serious.",
  },
  27: {
    title: "The second trimester closes",
    action:
      "Make a third-trimester question list: visit frequency, blood results, vaccines, movement, birth setting, classes and work or leave paperwork.",
    clarification:
      "There is no requirement to feel energetic just because the second trimester is often described as easier.",
    caution:
      "Do not ignore breathlessness at rest, chest pain, fainting or a racing heart that feels severe or new.",
    appointment:
      "Confirm what changes after week 28 and whether any blood tests, injections or vaccines are due.",
    partner:
      "Turn the question list into shared tasks with names and dates instead of leaving every preparation item to one person.",
  },
  28: {
    title: "Third trimester: checks may become more frequent",
    action:
      "Learn your baby's usual movement pattern and the exact instruction your maternity team gives you for a noticeable reduction or change.",
    clarification:
      "There is no universal number that describes every baby's normal movement. A clear change from the usual pattern matters.",
    caution:
      "Do not wait for a home drink, snack or Doppler check to 'prove' reduced movement before calling your maternity service.",
    appointment:
      "Third-trimester visits often review blood pressure, growth, movement, symptoms and earlier test results; the frequency is individualized.",
    partner:
      "Know the movement concern route and support an immediate call instead of suggesting the pregnant person wait and see.",
  },
  29: {
    title: "Sleep, reflux and breathing room",
    action:
      "Choose one sleep or reflux adjustment to test for several nights, such as earlier smaller meals or upper-body support.",
    clarification:
      "Breathlessness with stairs can increase gradually; sudden breathlessness, chest pain, blue lips or difficulty speaking is not routine discomfort.",
    caution:
      "Do not take new indigestion or sleep products without checking pregnancy suitability and interactions.",
    appointment:
      "Bring symptoms that interrupt eating or sleep to the next visit; ask what treatments are available rather than assuming you must tolerate them.",
    partner:
      "Protect a rest window, handle late chores and avoid minimizing exhaustion because the birth is still weeks away.",
  },
  30: {
    title: "Swelling: what is common and what needs a call",
    action:
      "Notice whether swelling is gradual and in both feet or sudden, marked, one-sided, or affecting the face and hands.",
    clarification:
      "Gradual ankle swelling can be common. Sudden swelling with a severe headache, vision changes or upper abdominal pain needs urgent assessment.",
    caution:
      "Do not use someone else's normal blood pressure or swelling pattern to judge your own symptoms.",
    appointment:
      "Know where blood pressure and urine can be checked urgently outside routine appointment hours.",
    partner:
      "Notice sudden visible change without creating panic; help call the maternity service and arrange transport when warning signs appear.",
  },
  31: {
    title: "Learn your baby's usual movement pattern",
    action:
      "Identify the baby's familiar active periods and treat a clear reduction or unusual change as a same-day maternity contact.",
    clarification:
      "Space becomes tighter, so movements can feel different, but healthy babies should not simply stop moving because the due date is nearer.",
    caution:
      "Do not go to sleep hoping reduced movement will be normal by morning; call the route your team gave you.",
    appointment:
      "Ask what assessment for reduced movement may involve so uncertainty about the visit does not delay a call.",
    partner:
      "Keep the phone charged, know the route and take the concern seriously the first time it is mentioned.",
  },
  32: {
    title: "Fatigue returns; prepare in small steps",
    action:
      "Complete the two preparations that prevent last-minute stress: save the travel route and put essential documents and contacts together.",
    clarification:
      "A useful birth bag is small and practical: identification, medicines, comfortable clothes, basic toiletries, chargers and the baby basics your birth place requests.",
    caution:
      "Do not spend beyond your means on long newborn shopping lists; safe care needs far less equipment than marketing suggests.",
    appointment:
      "Confirm where you plan to give birth, when to call before travelling and what documents or supplies the facility asks you to bring.",
    partner:
      "Own the route, fuel or fare, backup transport, phone chargers and care arrangements for children, pets or dependants.",
  },
  33: {
    title: "Pressure, urination and irregular tightenings",
    action:
      "Separate common pressure from symptoms to report: burning urination, fever, constant pain, rhythmic cramps, bleeding or fluid leakage.",
    clarification:
      "Needing to urinate often is common; pain, fever or feeling unwell can point to infection and should be checked.",
    caution:
      "Do not reduce fluids drastically to avoid bathroom trips unless your clinician has given a specific fluid plan.",
    appointment:
      "Use the next check to discuss baby position, growth, blood pressure, movement and any new urinary or pelvic symptoms.",
    partner:
      "Plan more bathroom and stretch stops for travel, and take over errands that have become physically awkward.",
  },
  34: {
    title: "Practise the route to your birth place",
    action:
      "Do a real or virtual route check at the time of day you may travel, including the correct entrance outside normal hours.",
    clarification:
      "A plan can be simple: primary route, backup transport, who calls ahead, where to enter, who looks after dependants and where essentials are kept.",
    caution:
      "Do not make the pregnant person the only holder of addresses, phone numbers, documents or childcare instructions.",
    appointment:
      "Ask what symptoms mean 'call first,' 'come in now' or 'call emergency services' in your maternity plan.",
    partner:
      "Run the logistics rehearsal, share the notes and fix one weak point while there is still time.",
  },
  35: {
    title: "Less space does not mean less movement",
    action:
      "Keep responding to the baby's usual movement pattern; the type of movement may change, but a clear reduction still needs prompt contact.",
    clarification:
      "Rolls, stretches and pressure may replace dramatic kicks. The change in style is different from a clear drop in usual activity.",
    caution:
      "Do not accept 'the baby has run out of room' as a reason to ignore reduced movement.",
    appointment:
      "Ask whether group B streptococcus testing, position checks or other late-pregnancy steps apply to your care plan.",
    partner:
      "Keep late-pregnancy plans flexible and make it easy to leave an event or call care without debate.",
  },
  36: {
    title: "Position, preferences and final checks",
    action:
      "Turn birth wishes into a one-page preference note covering communication, pain relief, support, mobility, newborn contact and what matters if plans change.",
    clarification:
      "Birth preferences guide a conversation; they are not a pass/fail script. Consent and explanation still matter when the plan changes.",
    caution:
      "Do not let a template pressure you into choices you do not understand; ask what each option means in your actual birth setting.",
    appointment:
      "Late visits may cover baby position, birth setting, labour signs, tests and options if pregnancy continues past the due date.",
    partner:
      "Read the preference note, understand the priorities and practise asking for explanation without speaking over the pregnant person.",
  },
  37: {
    title: "Early term and signs of labour",
    action:
      "Learn the four observations your service may ask about: contraction pattern, fluid loss, bleeding and baby movement.",
    clarification:
      "A mucus plug or irregular tightenings may not mean active labour. Fresh bleeding, reduced movement or concerning fluid loss still need prompt contact.",
    caution:
      "Do not drive yourself if contractions, pain, dizziness or urgency make driving unsafe.",
    appointment:
      "Confirm when your service wants a phone call for contractions and what to do if waters break without contractions.",
    partner:
      "Keep the phone audible, avoid alcohol or being unreachable, and know which observations to record calmly.",
  },
  38: {
    title: "Contractions, discharge and when to call",
    action:
      "If labour may be starting, time several contractions and note whether they strengthen, lengthen and continue despite rest or a change of activity.",
    clarification:
      "Early labour can start and stop. The maternity service can use your pattern, pregnancy history and other symptoms to advise the next step.",
    caution:
      "Do not wait for perfectly regular contractions if there is reduced movement, fresh bleeding, severe constant pain or concerning fluid colour.",
    appointment:
      "Keep all scheduled checks even when you feel ready to give birth; due-date proximity does not replace blood-pressure, growth or movement review.",
    partner:
      "Offer food, drinks, quiet and reassurance in early labour while staying ready to call or travel when advised.",
  },
  39: {
    title: "Full term and ready-to-go logistics",
    action:
      "Do a final five-minute check: contacts, transport, identification, regular medicines and a safe way to bring the baby home.",
    clarification:
      "Being full term means birth could happen soon; it does not mean labour must start this week.",
    caution:
      "Do not use unproven labour-induction methods or supplements; ask what evidence, risks and timing apply to any suggested method.",
    appointment:
      "Ask when monitoring or a discussion about induction is planned if labour has not started.",
    partner:
      "Finish practical tasks without repeatedly asking for instructions, and protect the pregnant person's need for calm or company.",
  },
  40: {
    title: "Due date, not deadline",
    action:
      "Keep monitoring movement, attend appointments and ask for the exact plan for the next seven days rather than waiting without a framework.",
    clarification:
      "Only a minority of babies arrive on the estimated date. It is a planning point, not proof that pregnancy is overdue or unsafe today.",
    caution:
      "Do not skip checks because everything has felt normal so far, and do not ignore new headache, bleeding, fluid loss, pain or movement change.",
    appointment:
      "Request a clear explanation of monitoring, membrane sweep if offered, induction options, benefits, trade-offs and what happens if you wait.",
    partner:
      "Buffer repetitive messages from others and keep the schedule, transport and phone coverage dependable.",
  },
  41: {
    title: "Monitoring and options after the due date",
    action:
      "Write the agreed plan in plain language: next check, what is monitored, options offered, decision date and symptoms that override the plan.",
    clarification:
      "More monitoring can provide useful snapshots, but it cannot predict every problem; movement changes and warning signs still require action.",
    caution:
      "Do not let the phrase 'post-dates' replace informed consent—ask about the benefits and trade-offs of induction and continued waiting for you.",
    appointment:
      "Expect an individual conversation about ongoing monitoring and birth timing; the plan depends on your medical history and current pregnancy.",
    partner:
      "Take notes, check that questions were answered and support the pregnant person's decision-making without turning it into a family vote.",
  },
  42: {
    title: "Follow your individual birth plan",
    action:
      "Stay in direct contact with the maternity team and follow the individualized monitoring and birth plan you agreed together.",
    clarification:
      "At this point a generic week page cannot safely choose timing or method of birth; current clinical information and your preferences must guide the plan.",
    caution:
      "Do not substitute online reassurance for a scheduled assessment, or delay contact for reduced movement or any urgent warning sign.",
    appointment:
      "Confirm the next action before leaving every contact: when, where, who calls whom and what should make you return sooner.",
    partner:
      "Keep transport and communication ready, protect rest and help the pregnant person stay connected to the agreed care plan.",
  },
};

const trimesterOverviews = [
  {
    title: "First trimester: weeks 1–13",
    dek: "The first three months are about confirming care, protecting early development, managing symptoms and understanding your first tests.",
    bodyMind: [
      "Common examples include fatigue, nausea, breast tenderness, food aversions, frequent urination, constipation and rapidly changing emotions. Some people have very few symptoms.",
      "Symptoms that interrupt drinking, severe or one-sided pain, fainting, heavy bleeding or a feeling that something is seriously wrong should not wait for a routine visit.",
    ],
    baby: [
      "From implantation through the early fetal stage, the foundations of organs, limbs, brain and spinal cord form. Week labels are approximate because dating can change after assessment.",
    ],
    clarification:
      "What 'three months' means here: weeks 1–4 are month 1, weeks 5–8 month 2, and weeks 9–13 month 3. Care teams still use weeks for decisions.",
    caution:
      "Avoid alcohol, smoking and recreational drugs; check medicines, supplements and higher-risk foods instead of relying on a social-media safe/unsafe list.",
    appointments:
      "Typical early care may include booking history, blood and urine tests, dating assessment and optional screening. The exact order and timing depend on location and history.",
    partner:
      "Take on calls, food experiments and household work; treat exhaustion and nausea as real even before pregnancy is visible.",
  },
  {
    title: "Second trimester: weeks 14–27",
    dek: "The middle months bring a growing bump, possible first movements, the anatomy assessment and a shift toward noticing patterns.",
    bodyMind: [
      "Energy may improve, but reflux, headaches, pelvic or back pain, sleep changes and breathlessness with exertion can appear. Common does not mean you must cope without help.",
      "Movement may first feel like flutters or taps. Timing varies, especially in a first pregnancy and with placenta position.",
    ],
    baby: [
      "Growth, movement, hearing, brain connections and lung structures develop throughout these weeks. The mid-pregnancy scan assesses anatomy at one point in that continuous process.",
    ],
    clarification:
      "What 'months 4–6' means here: weeks 14–17 are month 4, weeks 18–22 month 5, and weeks 23–27 month 6.",
    caution:
      "Do not use an app, home Doppler or another pregnancy's movement pattern to overrule a concern; ask your service when and how to report a change.",
    appointments:
      "Common windows include the anatomy scan around weeks 18–22 and gestational-diabetes discussion or testing around weeks 24–28; your doctor confirms the actual dates.",
    partner:
      "Learn the urgent route, attend key conversations if invited, and make physical and workplace adjustments practical rather than theoretical.",
  },
  {
    title: "Third trimester: weeks 28–42",
    dek: "The final months focus on movement, more frequent checks, birth choices, warning signs and a simple plan for getting care day or night.",
    bodyMind: [
      "Sleep disruption, reflux, pressure, breathlessness, swelling, back pain and irregular tightenings can increase. Sudden or severe changes need a different response from gradual discomfort.",
      "The baby's movement style may change as space tightens, but a clear reduction or change from the usual pattern still needs prompt maternity contact.",
    ],
    baby: [
      "Brain, lungs and nervous system continue maturing while the baby gains fat and often moves toward a birth position. Position and timing vary.",
    ],
    clarification:
      "What 'months 7–9' means here: weeks 28–31 are month 7, weeks 32–35 month 8, and weeks 36–42 month 9.",
    caution:
      "Do not wait for perfect contraction timing when there is reduced movement, bleeding, concerning fluid loss, severe headache, vision change or severe constant pain.",
    appointments:
      "Visits may become more frequent and cover blood pressure, growth, movement, position, vaccines, birth plans and options if pregnancy continues past the due date.",
    partner:
      "Own transport, contacts, chargers, documents and dependant care; be reachable and support informed choices if plans change.",
  },
];

const timeline = [
  {
    id: "positive-test",
    slug: "positive-test",
    kind: "positive-test",
    phase: "pregnancy",
    ordinal: 0,
    windowLabel: "Right now",
    title: "A positive test: start here",
    dek: "You do not need to solve the whole pregnancy today. Begin with care, medicine safety and one small next step.",
    summary: [
      "Pause and notice how you feel; excitement, fear, uncertainty and mixed emotions can all coexist.",
      "Arrange prenatal care and save the urgent contact route for your area.",
      "Do not start or stop medicine because of a generic online list.",
    ],
    bodyMind: [
      "A home test detects a pregnancy hormone, but it cannot confirm pregnancy location, exact dating or how the pregnancy is progressing.",
      "Mild symptoms or no symptoms can both occur early. Severe one-sided pain, fainting, shoulder-tip pain or heavy bleeding need urgent assessment.",
    ],
    baby: [
      "Pregnancy is dated from the first day of the last menstrual period, so the numbered week may begin before conception actually occurred.",
    ],
    clarifications: [
      "Concrete example: if your last period began five weeks ago and the test is positive today, care will usually call this about five weeks pregnant even though conception happened later.",
      "If the pregnancy is wanted but the news feels frightening, that reaction does not make you a bad parent. Start with one care contact, not a nine-month plan.",
    ],
    doNow: [
      "Contact the maternity-care route for your area. Ask who provides pregnancy care, when the first appointment is, and which number handles urgent concerns.",
      "List prescriptions, painkillers, allergy remedies, vitamins, herbal products and anything used occasionally; review the list with a clinician or pharmacist.",
      "Save the urgent-care route and choose one trusted person for support if that feels safe.",
    ],
    avoidAsk: [
      "Avoid alcohol, smoking and recreational drugs; ask for nonjudgmental support if stopping is difficult.",
      "Ask before changing prescribed medicine.",
      "Use the pregnancy essentials and ask your doctor before an uncertain food, supplement or activity.",
    ],
    appointments: [
      "The timing of a first routine visit depends on symptoms, medical history and the care plan you are given.",
    ],
    partner: [
      "Listen before problem-solving, protect privacy and help make the first contact if invited.",
    ],
    topics: ["positive-test", "appointments", "medicines", "mental-health"],
    audiences: ["pregnant", "partner", "browsing"],
    helpTier: "care-team",
    sourceIds: ["who-antenatal", "cdc-medicine", "cdc-warning"],
    milestoneIds: ["contact-care", "review-medicines"],
    review: review(),
  },
  ...[1, 2, 3].map((trimester, index) => {
    const overview = trimesterOverviews[index];
    const actions =
      trimester === 1
        ? trimesterActions.first
        : trimester === 2
          ? trimesterActions.second
          : trimesterActions.third;
    return {
      id: `trimester-${trimester}`,
      slug: `trimester-${trimester}`,
      kind: "overview",
      phase: "pregnancy",
      ordinal: 1 + index,
      windowLabel: `Trimester ${trimester}`,
      title: overview.title,
      dek: overview.dek,
      summary: [overview.bodyMind[0], overview.baby[0], actions[0]],
      bodyMind: overview.bodyMind,
      baby: overview.baby,
      clarifications: [overview.clarification],
      doNow: actions,
      avoidAsk: [
        overview.caution,
        "Ask when a recommendation depends on your history, symptoms or pregnancy.",
      ],
      appointments: [overview.appointments],
      partner: [overview.partner],
      topics: ["appointments", "symptoms", "development"],
      audiences: ["pregnant", "partner", "browsing"],
      helpTier: "common",
      sourceIds: ["who-antenatal", "acog-changes", "nhs-weeks"],
      milestoneIds: [],
      review: review(),
    };
  }),
  ...Array.from({ length: 40 }, (_, index) => index + 3).map((week, index) => {
    const trimester = week < 14 ? "first" : week < 28 ? "second" : "third";
    const detail = weekDetails[week];
    const month = monthForWeek(week);
    const milestoneIds = milestones
      .filter(
        (item) =>
          item.anchor === "gestational-week" &&
          item.start <= week &&
          item.end >= week,
      )
      .slice(0, 4)
      .map((item) => item.id);
    return {
      id: `week-${week}`,
      slug: `week-${week}`,
      kind: "week",
      phase: "pregnancy",
      ordinal: 10 + index,
      windowLabel:
        week > 40
          ? `Beyond the due date · Week ${week}`
          : `Month ${month} · Week ${week}`,
      title: `Week ${week}: ${detail.title}`,
      dek: bodyByWeek[week],
      summary: [detail.action, detail.appointment, detail.caution],
      bodyMind: [bodyByWeek[week]],
      baby: [babyByWeek[week]],
      variationNote:
        "Symptoms, fetal development and the timing of what you notice can vary. A change that worries you still deserves attention even when it does not match a typical description.",
      clarifications: [detail.clarification],
      doNow: [detail.action, ...trimesterActions[trimester].slice(1)],
      avoidAsk: [detail.caution],
      appointments: [detail.appointment],
      partner: [detail.partner],
      topics: topicsForWeek(week),
      audiences: ["pregnant", "partner", "browsing"],
      helpTier: week >= 41 ? "care-team" : "common",
      sourceIds: ["who-antenatal", "acog-changes", "nhs-weeks"],
      milestoneIds,
      review: review(),
    };
  }),
];

const postpartumWindows = [
  [
    "birth-day",
    "Birth day",
    "The first hours",
    "Care for the recovering parent and newborn begins as an ongoing conversation, not a perfect performance.",
    0,
    ["first-day-checks"],
  ],
  [
    "first-24-hours",
    "First 24 hours",
    "Observe, recover, ask",
    "Rest, observations, newborn checks and feeding support matter more than mastering a routine.",
    1,
    ["first-day-checks"],
  ],
  [
    "days-2-3",
    "Days 2–3",
    "The early transition",
    "Feeding, sleep, emotions and physical recovery can change quickly; early questions are worth raising.",
    3,
    ["day-three-contact"],
  ],
  [
    "days-4-7",
    "Days 4–7",
    "One week at a time",
    "Small routines emerge while parent and baby still need close observation and support.",
    7,
    ["week-two-contact"],
  ],
  [
    "week-2",
    "Week 2",
    "Recovery is not linear",
    "Healing, feeding and emotions can improve unevenly. Bring concerns to the scheduled check-in.",
    14,
    ["week-two-contact"],
  ],
  [
    "week-3",
    "Week 3",
    "Support the whole parent",
    "This is a useful point to review mood, pain, bleeding, sleep, feeding and the help available at home.",
    21,
    ["postpartum-plan"],
  ],
  [
    "weeks-4-6",
    "Weeks 4–6",
    "A broader recovery review",
    "Postpartum care should include physical, emotional, social and reproductive health—not only one examination.",
    42,
    ["postpartum-plan"],
  ],
  [
    "weeks-7-8",
    "Weeks 7–8",
    "The new routine is still new",
    "Recovery and identity continue changing even when the outside world expects normality.",
    56,
    ["two-month-development"],
  ],
  [
    "weeks-9-12",
    "Weeks 9–12",
    "Keep care connected",
    "Make sure ongoing health needs have a clinician and that concerns have not been lost in baby care.",
    84,
    ["postpartum-plan"],
  ],
  [
    "month-3",
    "Month 3",
    "A family system in motion",
    "Sleep, feeding, work, relationships and recovery often need another practical reset.",
    90,
    ["two-month-development"],
  ],
  [
    "month-4",
    "Month 4",
    "Notice, play, respond",
    "Developmental milestones are conversation prompts, while safe sleep and responsive care remain foundations.",
    120,
    ["four-month-development"],
  ],
  [
    "month-5",
    "Month 5",
    "Prepare for the next stage",
    "Ask about feeding transitions, mobility, home safety and your own ongoing recovery before changes arrive.",
    150,
    [],
  ],
  [
    "month-6",
    "Month 6",
    "Six months, still becoming",
    "Review development, feeding, preventive care, parent health and what support the family needs next.",
    180,
    ["six-month-development"],
  ],
];

timeline.push(
  ...postpartumWindows.map(
    ([slug, windowLabel, title, dek, ordinal, milestoneIds]) => ({
      id: `postpartum-${slug}`,
      slug,
      kind: "postpartum",
      phase: "postpartum",
      ordinal: 100 + ordinal,
      windowLabel,
      title,
      dek,
      summary: [
        dek,
        "Both parent and baby deserve care; neither person's warning signs should be minimized.",
        "Ask for practical help before exhaustion becomes a crisis.",
      ],
      bodyMind: [
        "Bleeding, pain, incision or perineal healing, pelvic symptoms, sleep and mood all deserve space in follow-up care.",
        "Recovery varies with birth, health, support and feeding; it is not a race back to a previous version of yourself.",
      ],
      baby: [
        "Feeding, alertness, breathing, temperature, color and movement are useful observations to share with your baby's clinician.",
        "Milestones describe skills most children show by an age; they are not a pass/fail test or diagnosis.",
      ],
      doNow: [
        "Keep parent and baby care contacts easy to find.",
        "Accept or request specific practical support.",
        "Bring feeding, sleep, pain and mood questions to follow-up care.",
      ],
      avoidAsk: [
        "Do not ignore heavy bleeding, trouble breathing, chest pain, seizures, severe headache, thoughts of harm or a baby who is hard to wake or struggling to breathe.",
        "Ask before resuming activities if recovery, complications or surgery affect what is appropriate.",
      ],
      appointments: [
        "Postnatal contacts and infant visits depend on individual need. Follow the plan given at discharge and ask who to contact with concerns.",
      ],
      partner: [
        "Protect rest, manage visitors and logistics, notice warning signs, and take concerns seriously the first time.",
      ],
      topics: ["postpartum", "recovery", "newborn", "mental-health", "feeding"],
      audiences: ["parent", "partner", "browsing"],
      helpTier: ordinal <= 7 ? "care-team" : "common",
      sourceIds: [
        "who-postnatal",
        "who-newborn",
        "acog-postpartum",
        "cdc-milestones",
      ],
      milestoneIds,
      review: review(),
    }),
  ),
);

const essentials = [
  {
    id: "food-dishes",
    slug: "food-dishes",
    number: 1,
    title: "Food and everyday dishes",
    eyebrow: "Eat safely, not perfectly",
    intro:
      "Most ordinary meals can stay on the menu when ingredients are pasteurized, washed, stored safely and cooked thoroughly. The main goal is reducing infection and mercury risk—not building an impossible diet.",
    dos: [
      "Build meals from foods you tolerate: a carbohydrate, a protein food, and fruit or vegetables is a useful simple pattern.",
      "Wash produce, separate raw food from ready-to-eat food, cook thoroughly and refrigerate leftovers promptly.",
      "Choose pasteurized milk and dairy, fully cooked eggs, and meat or seafood that is hot all the way through.",
      "Include cooked lower-mercury fish if you eat fish, and vary the type rather than relying on one species every day.",
    ],
    donts: [
      "Do not eat raw or undercooked meat, poultry, eggs, shellfish or fish during pregnancy.",
      "Do not use unpasteurized milk or foods made from it unless they are cooked until steaming hot.",
      "Avoid refrigerated pâté, raw sprouts and chilled ready-to-eat foods that have been stored too long or handled poorly.",
      "Avoid large high-mercury predatory fish and fish from water with an active contamination warning.",
    ],
    askDoctor: [
      "Ask for dietary support if vomiting, food aversions or reflux make regular eating difficult.",
      "Ask about a tailored plan for diabetes, anaemia, food allergy, coeliac disease, vegan diets or an eating disorder.",
      "Ask before using liver or high-dose vitamin-A products, medicinal herbs, detox drinks or concentrated powders.",
    ],
    examples: [
      {
        name: "Well-cooked chicken, beef, pork or lamb",
        status: "generally-ok",
        guidance:
          "Cook through with no raw centre; keep raw juices away from salads and cooked foods.",
      },
      {
        name: "Cooked fish and seafood",
        status: "generally-ok",
        guidance:
          "Choose lower-mercury varieties and cook thoroughly. Vary species across the week.",
      },
      {
        name: "Sushi",
        status: "check-first",
        guidance:
          "Choose cooked or vegetarian fillings. Avoid raw fish and raw shellfish during pregnancy.",
      },
      {
        name: "Eggs and egg dishes",
        status: "generally-ok",
        guidance:
          "The universal cautious choice is fully cooked whites and yolks; avoid raw batter, mousse or sauce made with raw egg.",
      },
      {
        name: "Milk, yogurt and ordinary cheese",
        status: "generally-ok",
        guidance:
          "Check the label says pasteurized and keep the food refrigerated and within its use-by date.",
      },
      {
        name: "Soft or mould-ripened cheese",
        status: "check-first",
        guidance:
          "The simplest cautious choice is to avoid it cold; cooking until steaming hot reduces infection risk.",
      },
      {
        name: "Deli meat, cured meat and hot dogs",
        status: "check-first",
        guidance:
          "Heat until steaming hot rather than eating refrigerated slices cold.",
      },
      {
        name: "Salads and raw vegetables",
        status: "generally-ok",
        guidance:
          "Wash ingredients well. Eat freshly prepared salads promptly and keep chilled salads cold.",
      },
      {
        name: "Leftovers and takeaway meals",
        status: "generally-ok",
        guidance:
          "Refrigerate promptly, use within a short safe period, and reheat once until steaming throughout.",
      },
      {
        name: "Liver and liver products",
        status: "avoid",
        guidance:
          "Avoid because they can contain very high vitamin A. Ask before taking any supplement containing retinol.",
      },
      {
        name: "Raw sprouts",
        status: "avoid",
        guidance:
          "Cooking thoroughly is the safer option because washing alone may not remove bacteria inside the sprout.",
      },
      {
        name: "Tiramisu, mousse and homemade mayonnaise",
        status: "check-first",
        guidance:
          "Check for raw egg and alcohol. Choose versions made with pasteurized egg and no alcohol.",
      },
    ],
    sourceIds: ["cdc-food", "nhs-food", "who-antenatal"],
    review: review(),
  },
  {
    id: "drinks-caffeine",
    slug: "drinks-caffeine",
    number: 2,
    title: "Drinks, caffeine and alcohol",
    eyebrow: "What belongs in the cup",
    intro:
      "Water and ordinary pasteurized drinks are the easy baseline. Count caffeine across the whole day, avoid alcohol, and check unfamiliar herbal or concentrated products.",
    dos: [
      "Drink regularly and use urine colour, thirst and dizziness as practical clues that you may need more fluid.",
      "Keep total caffeine below 200 mg a day unless your doctor recommends a lower limit.",
      "Count coffee, tea, cola, energy products, chocolate and caffeine-containing medicines together.",
      "Choose pasteurized milk and juice, and wash reusable bottles daily.",
    ],
    donts: [
      "Do not drink alcohol during pregnancy; no amount or stage has been proven safe.",
      "Avoid energy drinks because caffeine can be high and other stimulant ingredients may be unclear.",
      "Do not assume decaffeinated means zero caffeine or that a large café drink equals one standard serving.",
      "Do not use detox teas, weight-loss drinks or concentrated herbal shots.",
    ],
    askDoctor: [
      "Ask for help if stopping alcohol or another substance is difficult; honest support is safer than hiding use.",
      "Ask before using electrolyte powders, sports supplements, herbal tea blends or products with many active ingredients.",
      "Ask for assessment if vomiting means drinks will not stay down or urination becomes very infrequent or dark.",
    ],
    examples: [
      {
        name: "Water and sparkling water",
        status: "generally-ok",
        guidance:
          "Use plain or lightly flavoured versions without stimulant additives.",
      },
      {
        name: "Coffee and tea",
        status: "generally-ok",
        guidance:
          "Keep the whole-day caffeine total below 200 mg; strength and serving size vary widely.",
      },
      {
        name: "Alcohol-free drinks",
        status: "check-first",
        guidance:
          "Check the label because some products contain a small amount of alcohol despite the branding.",
      },
      {
        name: "Energy drinks and energy shots",
        status: "avoid",
        guidance: "Avoid high caffeine and poorly defined stimulant blends.",
      },
      {
        name: "Herbal tea",
        status: "check-first",
        guidance:
          "Check every ingredient; ordinary food-level ginger or peppermint is different from a concentrated medicinal blend.",
      },
      {
        name: "Pasteurized juice and smoothies",
        status: "generally-ok",
        guidance:
          "Choose pasteurized products, wash produce, refrigerate promptly and remember they can be high in sugar.",
      },
    ],
    sourceIds: ["who-antenatal", "nhs-food", "cdc-alcohol", "acog-caffeine"],
    review: review(),
  },
  {
    id: "exercise-movement",
    slug: "exercise-movement",
    number: 3,
    title: "Exercise and movement",
    eyebrow: "Stay active with sensible changes",
    intro:
      "For most uncomplicated pregnancies, regular moderate movement is helpful. The right plan feels stable, allows conversation and changes when symptoms or medical conditions require it.",
    dos: [
      "If your doctor has not limited activity, work toward about 150 minutes of moderate movement each week, split into manageable sessions.",
      "Warm up, drink water, avoid overheating and reduce intensity when you cannot speak in sentences.",
      "Use walking, swimming, a stationary cycle, prenatal exercise or adapted strength work as steady options.",
      "Train balance and strength with controlled movement, lighter loads and normal breathing rather than straining.",
    ],
    donts: [
      "Avoid contact sports, scuba diving, activities with a high fall risk and exercise in extreme heat.",
      "Do not hold your breath through heavy lifts or chase personal records during pregnancy.",
      "Do not exercise through bleeding, fluid leakage, chest pain, faintness, severe breathlessness, painful regular contractions or reduced movement later in pregnancy.",
      "Do not copy another person's pregnancy workout when your experience, fitness or medical history is different.",
    ],
    askDoctor: [
      "Ask before starting a new vigorous program or continuing a sport with collision, altitude or fall risk.",
      "Ask for an individualized plan with bleeding, placenta or cervical problems, preterm-labour risk, severe anaemia, heart or lung disease, or multiple pregnancy.",
      "Ask for pelvic-health or physiotherapy help when pelvic, back or joint pain changes walking, sleep or daily activity.",
    ],
    examples: [
      {
        name: "Walking and hiking",
        status: "generally-ok",
        guidance:
          "Choose stable surfaces, supportive footwear, a manageable pace and a route with water and help available.",
      },
      {
        name: "Swimming and water exercise",
        status: "generally-ok",
        guidance:
          "Use a clean, safely maintained pool; avoid overheating and slippery entries.",
      },
      {
        name: "Strength training",
        status: "generally-ok",
        guidance:
          "Use controlled technique, comfortable loads and breathing; adapt positions as the bump and balance change.",
      },
      {
        name: "Running",
        status: "check-first",
        guidance:
          "Experienced runners may often continue with changes, but symptoms, balance and complications matter.",
      },
      {
        name: "Hot yoga, hot Pilates and extreme-heat workouts",
        status: "avoid",
        guidance: "Avoid deliberate overheating and dehydration.",
      },
      {
        name: "Scuba diving",
        status: "avoid",
        guidance: "Do not scuba dive during pregnancy.",
      },
    ],
    sourceIds: ["acog-exercise", "who-antenatal"],
    review: review(),
  },
  {
    id: "medicines-supplements",
    slug: "medicines-supplements",
    number: 4,
    title: "Medicines and supplements",
    eyebrow: "Check the exact product",
    intro:
      "Pregnancy medicine decisions depend on the exact product, dose, timing, reason and your health. Untreated illness can also be harmful, so never make a sudden change from a generic list.",
    dos: [
      "Keep one current list of prescriptions, occasional medicines, creams, inhalers, vitamins, herbs and supplements.",
      "Take prescribed medicine as directed until the prescriber tells you exactly how to continue, change or stop it.",
      "Use the prenatal supplement recommended by your doctor and check labels for duplicate ingredients.",
      "Ask a doctor or pharmacist who can see the exact product and understand why you need it.",
    ],
    donts: [
      "Do not stop medicine for epilepsy, mental health, blood pressure, asthma, diabetes or another long-term condition on your own.",
      "Do not assume over-the-counter, herbal, topical or natural products are automatically safe.",
      "Do not take high-dose vitamins or several prenatal products together unless prescribed.",
      "Avoid supplements containing retinol or high-dose vitamin A unless a specialist specifically prescribed them.",
    ],
    askDoctor: [
      "Ask what the medicine treats, what happens without it, what pregnancy evidence exists and whether dose or monitoring changes.",
      "Ask before painkillers, cold remedies, allergy products, sleep aids, acne treatment or herbal remedies.",
      "Get urgent help for trouble breathing, facial swelling, collapse or a severe reaction after any medicine.",
    ],
    examples: [
      {
        name: "A regular prescription",
        status: "check-first",
        guidance:
          "Continue as prescribed until prompt review; do not stop suddenly because the leaflet mentions pregnancy.",
      },
      {
        name: "Painkiller or cold medicine",
        status: "check-first",
        guidance:
          "Ask about the exact active ingredients, dose and pregnancy week before taking it.",
      },
      {
        name: "Prenatal vitamin",
        status: "generally-ok",
        guidance:
          "Use one appropriate product recommended for pregnancy and avoid stacking duplicates.",
      },
      {
        name: "Herbal or 'natural' remedy",
        status: "check-first",
        guidance:
          "Ingredients, concentration and contamination can be unclear; show the exact label to a pharmacist or doctor.",
      },
      {
        name: "High-dose vitamin A or retinol supplement",
        status: "avoid",
        guidance:
          "Avoid unless a specialist has prescribed it for a specific reason.",
      },
    ],
    sourceIds: ["cdc-medicine", "who-antenatal"],
    review: review("rapid-review"),
  },
  {
    id: "everyday-home",
    slug: "everyday-home",
    number: 5,
    title: "Home, heat, pets and daily tasks",
    eyebrow: "Ordinary life with a few safeguards",
    intro:
      "Pregnancy does not require a sterile home or stopping normal life. Prevent overheating, reduce infection and chemical exposure, and change tasks that are painful or unstable.",
    dos: [
      "Use gloves for soil, gardening and animal waste; wash hands well afterward.",
      "Ventilate when painting or cleaning, follow labels and choose the least irritating product that works.",
      "Use warm baths and showers, drink water and step out if you feel hot, dizzy or unwell.",
      "Wear the car seat belt with the lap belt low under the bump and the shoulder belt across the chest.",
    ],
    donts: [
      "Do not clean cat litter if someone else can do it; if unavoidable, wear gloves, clean it daily and wash hands carefully.",
      "Do not mix cleaning chemicals, use products in an unventilated room or ignore dizziness and breathing irritation.",
      "Avoid hot tubs and saunas; leave any bath or shower if you feel overheated or dizzy.",
      "Do not climb unstable ladders or carry loads that block your view or strain the pelvis and back.",
    ],
    askDoctor: [
      "Ask about occupational or home exposure to solvents, pesticides, lead, radiation, anaesthetic gases or infectious materials.",
      "Ask for help with persistent pelvic or back pain rather than repeatedly pushing through the task.",
      "Ask before using strong acne, skin-lightening or medicated cosmetic products.",
    ],
    examples: [
      {
        name: "Normal household cleaning",
        status: "generally-ok",
        guidance:
          "Ventilate, wear gloves, follow the label and never mix products.",
      },
      {
        name: "Gardening",
        status: "generally-ok",
        guidance:
          "Wear gloves, cover cuts, wash produce and hands, and avoid heavy awkward lifting.",
      },
      {
        name: "Cat litter",
        status: "check-first",
        guidance:
          "Let someone else handle it when possible; otherwise use gloves, clean daily and wash hands.",
      },
      {
        name: "Warm bath or shower",
        status: "generally-ok",
        guidance:
          "Keep it comfortable rather than very hot and leave if dizzy or overheated.",
      },
      {
        name: "Hot tub or sauna",
        status: "avoid",
        guidance: "Avoid overheating, especially early in pregnancy.",
      },
    ],
    sourceIds: [
      "who-antenatal",
      "acog-heat",
      "cdc-toxoplasmosis",
      "nhtsa-seat-belts",
    ],
    review: review(),
  },
  {
    id: "work-lifting",
    slug: "work-lifting",
    number: 6,
    title: "Work, lifting and long days",
    eyebrow: "Adjust the task, not your worth",
    intro:
      "Many people keep working or studying through pregnancy. The practical questions are exposure, strain, heat, standing, shifts, travel, food and toilet access—not whether pregnancy makes you fragile.",
    dos: [
      "List repeated lifting, long standing, heat, chemicals, infection exposure, night shifts and missed breaks.",
      "Ask early for specific adjustments such as a stool, task rotation, lighter loads, more short breaks or protected appointment time.",
      "Keep water, tolerated food and toilet access realistic during the workday.",
      "Lift close to the body with stable footing and normal breathing; split loads when possible.",
    ],
    donts: [
      "Do not hide a hazardous exposure from the clinician assessing work safety.",
      "Do not wait until pain or exhaustion makes the job impossible before changing the setup.",
      "Do not repeatedly lift from the floor, twist with a load or carry something that blocks your view.",
      "Do not accept faintness, contractions, bleeding or fluid leakage as an ordinary work inconvenience.",
    ],
    askDoctor: [
      "Ask for an individual lifting or activity limit if you have pain, bleeding, cervical or placenta concerns, preterm-labour risk or another complication.",
      "Ask about infection precautions if you work with young children, animals, patients, waste or laboratory materials.",
      "Ask for documentation if your employer or school requires medical details for reasonable adjustments.",
    ],
    examples: [
      {
        name: "Desk work",
        status: "generally-ok",
        guidance:
          "Change position often, support the back and take short movement breaks.",
      },
      {
        name: "Long standing",
        status: "check-first",
        guidance:
          "Add sitting breaks, supportive footwear, task rotation and symptom review.",
      },
      {
        name: "Heavy or repeated lifting",
        status: "check-first",
        guidance:
          "Get an individual assessment based on the load, frequency, technique, pregnancy stage and any symptoms.",
      },
      {
        name: "Chemical, radiation or infection exposure",
        status: "check-first",
        guidance:
          "Use occupational-health and pregnancy-care review rather than relying on smell, visibility or a colleague's experience.",
      },
    ],
    sourceIds: ["who-antenatal"],
    review: review(),
  },
  {
    id: "travel",
    slug: "travel",
    number: 7,
    title: "Travel and getting around",
    eyebrow: "Plan for care, comfort and circulation",
    intro:
      "Travel can be reasonable in an uncomplicated pregnancy, but timing, destination, journey length, infection risk, carrier rules and access to care all matter.",
    dos: [
      "Carry essential pregnancy information, medicines, emergency contacts and travel insurance details.",
      "On long journeys, move regularly, drink water and avoid tight clothing around the waist and legs.",
      "Use the seat belt correctly on every trip and keep airbags active unless a qualified technician gives different instructions.",
      "Know where pregnancy assessment is available at the destination before leaving.",
    ],
    donts: [
      "Do not book non-refundable travel before checking medical advice, carrier limits and insurance cover.",
      "Do not travel to an area with a pregnancy-specific infection warning without specialist advice.",
      "Do not sit still for a very long journey when safe movement breaks are possible.",
      "Do not travel when bleeding, regular painful contractions, fluid leakage, reduced movement or another urgent symptom needs assessment.",
    ],
    askDoctor: [
      "Ask before long-haul travel, high altitude, remote destinations or travel later in the third trimester.",
      "Ask about clot risk if you have a previous clot, thrombophilia, marked obesity, surgery, reduced mobility or another risk factor.",
      "Ask whether your pregnancy records, medicines or a fit-to-fly letter are needed.",
    ],
    examples: [
      {
        name: "Short car or train trip",
        status: "generally-ok",
        guidance:
          "Wear the seat belt correctly, stop when needed and keep care contacts available.",
      },
      {
        name: "Long flight",
        status: "check-first",
        guidance:
          "Review pregnancy stage, clot risk, airline rules, insurance and destination care before booking.",
      },
      {
        name: "Remote or high-altitude trip",
        status: "check-first",
        guidance:
          "Access to urgent care and altitude symptoms make individualized advice important.",
      },
      {
        name: "Travel with warning symptoms",
        status: "avoid",
        guidance:
          "Seek assessment first rather than travelling away from care.",
      },
    ],
    sourceIds: ["who-antenatal", "cdc-warning"],
    review: review(),
  },
  {
    id: "sex-relationships",
    slug: "sex-relationships",
    number: 8,
    title: "Sex, intimacy and relationships",
    eyebrow: "Comfort and consent come first",
    intro:
      "Sex is often fine in an uncomplicated pregnancy. Desire and comfort can change from week to week, and consent still needs to be active every time.",
    dos: [
      "Choose positions that avoid pressure, pain and breathlessness as the body changes.",
      "Use condoms when protection from sexually transmitted infection is needed.",
      "Talk plainly about comfort, desire, fear and alternatives to penetrative sex.",
      "Stop and check symptoms rather than continuing through pain or distress.",
    ],
    donts: [
      "Do not continue without consent or treat pregnancy as an obligation to have or avoid sex.",
      "Do not ignore persistent pain, heavy bleeding, fluid leakage or regular contractions after sex.",
      "Do not follow restrictions given to someone else; complications and advice differ.",
      "Do not use an unsafe relationship as a reason to delay confidential medical or support contact.",
    ],
    askDoctor: [
      "Ask before sex if you have unexplained bleeding, placenta or cervical concerns, ruptured membranes, preterm-labour risk or a specific restriction.",
      "Ask about infection testing when there is a new partner, exposure concern or symptoms.",
      "Ask privately for help with pressure, control, forced sex, monitoring, threats or violence.",
    ],
    examples: [
      {
        name: "Sex in an uncomplicated pregnancy",
        status: "generally-ok",
        guidance:
          "Continue if wanted and comfortable, with position changes as needed.",
      },
      {
        name: "Brief mild cramping after orgasm",
        status: "check-first",
        guidance:
          "It can occur, but contact care if pain persists, becomes regular or comes with bleeding or fluid loss.",
      },
      {
        name: "Sex with an active complication or restriction",
        status: "check-first",
        guidance:
          "Follow the individual plan from the clinician managing the pregnancy.",
      },
    ],
    sourceIds: ["who-antenatal", "cdc-warning"],
    review: review(),
  },
  {
    id: "sleep-comfort",
    slug: "sleep-comfort",
    number: 9,
    title: "Sleep, rest and body comfort",
    eyebrow: "Aim for workable, not perfect",
    intro:
      "Sleep often changes with nausea, urination, reflux, movement, pain and anxiety. Small physical adjustments and daytime pacing are more realistic than chasing a perfect eight hours.",
    dos: [
      "Use pillows between the knees, under the bump or behind the back to reduce strain.",
      "From the third trimester, settle to sleep on your side; if you wake on your back, roll to a side without panic.",
      "Use smaller evening meals and upper-body support when reflux is a problem.",
      "Break preparation and housework into shorter tasks and accept practical help.",
    ],
    donts: [
      "Do not take a sleep medicine, antihistamine or herbal sedative without checking the exact product.",
      "Do not stay flat on your back when it makes you dizzy, breathless or unwell.",
      "Do not dismiss severe snoring with pauses, waking unable to breathe or extreme daytime sleepiness.",
      "Do not use alcohol or cannabis as a sleep aid.",
    ],
    askDoctor: [
      "Ask about persistent insomnia, restless legs, severe reflux, pelvic pain or anxiety that is preventing sleep.",
      "Ask before using medicine or a supplement for sleep.",
      "Seek urgent care for sudden breathlessness, chest pain, fainting or a severe new headache rather than attributing it to tiredness.",
    ],
    examples: [
      {
        name: "Side sleeping",
        status: "generally-ok",
        guidance:
          "Either side is acceptable; use pillows to support hips, abdomen and back.",
      },
      {
        name: "Waking on the back",
        status: "generally-ok",
        guidance:
          "Roll onto a side and return to sleep; there is no need to panic.",
      },
      {
        name: "Over-the-counter sleep aid",
        status: "check-first",
        guidance:
          "Ask about the exact active ingredient, dose and pregnancy week.",
      },
    ],
    sourceIds: ["nhs-weeks", "cdc-medicine"],
    review: review(),
  },
  {
    id: "appointments-warning-signs",
    slug: "appointments-warning-signs",
    number: 10,
    title: "Appointments and when to call",
    eyebrow: "Know the next step before you need it",
    intro:
      "Routine care checks trends and creates time for questions. It does not replace contacting care sooner for symptoms that are severe, sudden, worsening or simply feel seriously wrong.",
    dos: [
      "Keep one note with medicines, symptoms, top questions, result dates and the next appointment.",
      "Save the routine pregnancy-care number, urgent maternity number and emergency number in the phone.",
      "At each visit, ask what happens next and what should make you contact care sooner.",
      "Later in pregnancy, learn the baby's usual movement pattern and call promptly for a clear reduction or change.",
    ],
    donts: [
      "Do not wait for the next routine visit with heavy bleeding, severe pain, fainting, chest pain, trouble breathing, seizures or another emergency sign.",
      "Do not use a home Doppler, app, watch or one normal reading to dismiss concerning symptoms.",
      "Do not wait until morning for a clear reduction in an established movement pattern.",
      "Do not assume every pregnancy follows the same appointment count or test schedule.",
    ],
    askDoctor: [
      "Ask what screening is offered, what it can and cannot show, and what each possible result could lead to.",
      "Ask who contacts you with results, by when, and what to do if you hear nothing.",
      "Ask for written individual instructions when a health condition, multiple pregnancy or complication changes routine care.",
    ],
    examples: [
      {
        name: "A routine question",
        status: "generally-ok",
        guidance:
          "Add it to the visit list unless symptoms are changing or worrying you now.",
      },
      {
        name: "A new symptom that is persistent or worsening",
        status: "check-first",
        guidance:
          "Contact the doctor or maternity team instead of waiting for the next visit.",
      },
      {
        name: "Severe, sudden or emergency symptoms",
        status: "avoid",
        guidance: "Do not wait—use urgent or emergency medical care now.",
      },
    ],
    sourceIds: ["who-antenatal", "cdc-warning"],
    review: review(),
  },
  {
    id: "common-symptoms",
    slug: "common-symptoms",
    number: 11,
    title: "Common symptoms and practical self-care",
    eyebrow: "Ease the day without ignoring change",
    intro:
      "Nausea, constipation, reflux, tiredness and back or pelvic discomfort are common reasons pregnancy feels difficult. Small adjustments may help, while persistent or worsening symptoms deserve care rather than endurance.",
    dos: [
      "Use small, regular meals and drinks when a full meal is difficult, and keep a simple note of what stays down.",
      "Add fibre-containing foods, fluids and comfortable movement gradually when constipation is the problem.",
      "Change position often, use supportive footwear and pillows, and split physical tasks when the back or pelvis hurts.",
      "Record when a symptom began, what makes it better or worse, and how it affects eating, sleep, walking or work.",
    ],
    donts: [
      "Do not take a painkiller, antacid, laxative, anti-nausea product or herbal remedy without checking the exact product.",
      "Do not keep pushing through pain that changes how you walk, sleep or complete ordinary tasks.",
      "Do not treat severe, sudden or rapidly worsening symptoms as an ordinary pregnancy discomfort.",
      "Do not use another person's symptoms or treatment as proof that yours needs the same response.",
    ],
    askDoctor: [
      "Ask promptly when vomiting prevents normal drinking, urination becomes much less frequent or weakness is increasing.",
      "Ask for treatment options when nausea, reflux, constipation, headache, back pain or pelvic pain is persistent or limiting daily life.",
      "Use urgent care for severe pain, fainting, trouble breathing, heavy bleeding, fluid leakage, seizures or another emergency warning sign.",
    ],
    examples: [
      {
        name: "Mild nausea with food and fluids staying down",
        status: "generally-ok",
        guidance:
          "Try smaller, more frequent food and drinks, avoid strong triggers and mention it if self-care is not enough.",
      },
      {
        name: "Constipation or heartburn",
        status: "generally-ok",
        guidance:
          "Start with gradual food, fluid, movement and meal-position changes; check before using a medicine.",
      },
      {
        name: "Back or pelvic pain that changes walking or sleep",
        status: "check-first",
        guidance:
          "Ask for assessment and tailored physical support instead of repeatedly pushing through it.",
      },
      {
        name: "Vomiting with very little urination or increasing weakness",
        status: "check-first",
        guidance:
          "Contact pregnancy care promptly because dehydration and treatment needs cannot be assessed from a generic page.",
      },
      {
        name: "A severe, sudden or rapidly worsening symptom",
        status: "avoid",
        guidance:
          "Do not wait on self-care—use the urgent route provided by your maternity service or local emergency care.",
      },
    ],
    sourceIds: [
      "acog-morning-sickness",
      "acog-back-pain",
      "acog-digestive",
      "cdc-warning",
      "cdc-medicine",
    ],
    review: review(),
  },
  {
    id: "dental-skin-personal-care",
    slug: "dental-skin-personal-care",
    number: 12,
    title: "Dental, skincare and personal care",
    eyebrow: "Keep normal care; check active ingredients",
    intro:
      "Pregnancy does not mean neglecting teeth, skin or ordinary grooming. Tell the professional you are pregnant, check medicated products by ingredient and get painful or infected problems assessed instead of delaying care automatically.",
    dos: [
      "Continue brushing, flossing and routine dental care, and tell the dentist that you are pregnant.",
      "Use simple cleansers, moisturizers and sun protection when skin becomes sensitive or pigmentation changes.",
      "Read the active-ingredient list on acne, anti-ageing, skin-lightening and medicated beauty products.",
      "Use gloves, ventilation and the product instructions for dyes, solvents, adhesives or strong salon products.",
    ],
    donts: [
      "Do not delay significant dental pain, swelling, injury or signs of infection just because you are pregnant.",
      "Avoid oral isotretinoin and products labelled as retinoids during pregnancy unless the specialist managing your pregnancy gives explicit instructions.",
      "Do not assume a topical, natural, salon or cosmetic product is harmless because it is not swallowed.",
      "Do not book an elective injection, peel, laser or other procedure without telling the practitioner about the pregnancy and checking first.",
    ],
    askDoctor: [
      "Ask the dentist and pregnancy clinician when imaging, anaesthetic, antibiotics or pain relief are proposed for dental treatment.",
      "Ask a pharmacist, dermatologist or doctor about the exact acne, eczema, psoriasis or skin-lightening product you use.",
      "Ask about a new widespread rash, blistering, severe itching or a skin change that comes with feeling unwell.",
    ],
    examples: [
      {
        name: "Dental check-up and cleaning",
        status: "generally-ok",
        guidance:
          "Tell the dental team about the pregnancy and keep routine preventive care rather than postponing it automatically.",
      },
      {
        name: "Dental pain, swelling or suspected infection",
        status: "check-first",
        guidance:
          "Arrange prompt dental assessment and make sure the dentist knows your pregnancy week and medicines.",
      },
      {
        name: "Simple cleanser, moisturizer and sunscreen",
        status: "generally-ok",
        guidance:
          "Choose products you tolerate and check medicated or high-strength active ingredients separately.",
      },
      {
        name: "Retinoid or isotretinoin acne treatment",
        status: "avoid",
        guidance:
          "Do not use it during pregnancy without direct specialist instructions; contact the prescriber promptly if it is already part of your routine.",
      },
      {
        name: "Hair dye, salon treatment or cosmetic procedure",
        status: "check-first",
        guidance:
          "Check the product and procedure, use good ventilation and ask before treatments with strong chemicals, medicines or limited pregnancy evidence.",
      },
    ],
    sourceIds: ["acog-dental", "acog-skin", "cdc-medicine"],
    review: review(),
  },
  {
    id: "infections-vaccinations",
    slug: "infections-vaccinations",
    number: 13,
    title: "Infections, exposure and vaccinations",
    eyebrow: "Ask early; recommendations change",
    intro:
      "Pregnancy can change the importance of some infections and vaccines. The useful baseline is good hygiene, a current vaccine record and prompt pregnancy-specific advice after a significant exposure or illness.",
    dos: [
      "Bring your vaccine record to pregnancy care and ask which current or seasonal vaccines are recommended where you live.",
      "Wash hands after contact with body fluids, animal waste, soil, raw food and shared items used by someone who is ill.",
      "Follow workplace infection controls carefully in health care, childcare, laboratories, veterinary work and similar settings.",
      "Contact pregnancy care after a significant exposure to a contagious illness or when a new feverish or rash illness develops.",
    ],
    donts: [
      "Do not assume every vaccine is either required or forbidden in pregnancy; the exact vaccine, timing and exposure matter.",
      "Do not receive a travel or catch-up vaccine without telling the vaccinating clinician that you are pregnant.",
      "Do not rely on a mask, supplement or home remedy alone after an exposure that needs professional advice.",
      "Do not ignore an infection-control concern at work because colleagues have handled the same task while pregnant.",
    ],
    askDoctor: [
      "Ask which vaccines are recommended during this pregnancy and when they should be given under current local guidance.",
      "Ask promptly after exposure to chickenpox, measles, rubella or another infection your care team has highlighted.",
      "Ask for an individual work plan when repeated infectious exposure is part of your job or training.",
    ],
    examples: [
      {
        name: "A routine or seasonal vaccine appointment",
        status: "check-first",
        guidance:
          "Confirm the exact vaccine and timing with a clinician using current pregnancy guidance for your location.",
      },
      {
        name: "Ordinary contact with someone who has a cold",
        status: "generally-ok",
        guidance:
          "Use hand hygiene, ventilation and sensible distance; ask for advice if you become significantly unwell.",
      },
      {
        name: "Exposure to chickenpox, measles or rubella",
        status: "check-first",
        guidance:
          "Contact pregnancy care promptly and explain the illness, timing, closeness of contact and what you know about immunity.",
      },
      {
        name: "Travel vaccine or live vaccine",
        status: "check-first",
        guidance:
          "Pregnancy recommendations differ by vaccine and exposure; do not make the decision from a generic list.",
      },
      {
        name: "Ignoring a significant exposure until the next routine visit",
        status: "avoid",
        guidance:
          "Do not wait when pregnancy care has advised prompt contact after that infection or exposure.",
      },
    ],
    sourceIds: ["cdc-vaccines", "cdc-infections", "who-antenatal"],
    review: review("rapid-review"),
  },
  {
    id: "mental-health-safety",
    slug: "mental-health-safety",
    number: 14,
    title: "Mental health, relationships and safety",
    eyebrow: "Your mind and safety are pregnancy health",
    intro:
      "Worry, mood and relationships can change during pregnancy. You do not have to wait for a crisis to mention anxiety, low mood, intrusive thoughts, pressure, control or feeling unsafe.",
    dos: [
      "Tell a pregnancy-care professional about current or past anxiety, depression, bipolar disorder, trauma, eating disorders or other mental-health care.",
      "Choose one person and one professional contact you can reach when thoughts or circumstances become difficult.",
      "Ask to speak with a clinician alone when privacy would make it easier to talk honestly.",
      "Make a simple safety plan for transport, medicines, documents, money and emergency contact if home does not feel safe.",
    ],
    donts: [
      "Do not stop prescribed mental-health medicine suddenly because of pregnancy; arrange prompt review with the prescriber.",
      "Do not dismiss persistent anxiety, low mood, panic or intrusive thoughts as a personal failure or something pregnancy requires you to tolerate.",
      "Do not accept monitoring, threats, forced sex, reproductive pressure or control of money, transport, food or medical care as support.",
      "Do not wait alone with thoughts of harming yourself or the baby, severe confusion, hallucinations or immediate danger.",
    ],
    askDoctor: [
      "Ask for help when mood, fear, panic, sleep or intrusive thoughts are interfering with daily life, relationships or self-care.",
      "Ask how existing therapy, prescriptions and crisis plans should continue through pregnancy and after birth.",
      "Ask privately for local confidential support when someone controls, threatens, coerces or hurts you.",
    ],
    examples: [
      {
        name: "Occasional worry that settles and does not disrupt daily life",
        status: "generally-ok",
        guidance:
          "Use support, rest and simple coping strategies, and mention changes at care visits without waiting for them to become severe.",
      },
      {
        name: "Persistent anxiety, low mood, panic or intrusive thoughts",
        status: "check-first",
        guidance:
          "Contact a health professional; effective support can include practical help, therapy, medicine review or a combination.",
      },
      {
        name: "A prescribed mental-health medicine",
        status: "check-first",
        guidance:
          "Continue as prescribed until prompt review with the clinician who understands the treatment and pregnancy.",
      },
      {
        name: "Control, threats, forced sex or physical harm",
        status: "check-first",
        guidance:
          "Seek confidential professional support; use emergency help immediately when you are in danger.",
      },
      {
        name: "Waiting with thoughts of harm or loss of contact with reality",
        status: "avoid",
        guidance:
          "Do not wait—use local emergency or crisis help and tell them that you are pregnant or recently pregnant.",
      },
    ],
    sourceIds: [
      "acog-mental-health",
      "nhs-mental",
      "acog-ipv",
      "cdc-warning",
      "cdc-medicine",
    ],
    review: review(),
  },
];

const substitutions = [
  {
    id: "cola",
    item: "Coca-Cola and other cola",
    group: "drinks",
    status: "keep-with-limit",
    searchTerms: [
      "coke",
      "coca cola",
      "pepsi",
      "soda",
      "soft drink",
      "fizzy drink",
    ],
    shortAnswer:
      "You usually do not need to give up cola completely. A manufacturer example lists 34 mg of caffeine in a 330 ml Coca-Cola; count the exact drink toward the usual pregnancy limit of less than 200 mg a day.",
    why: "Caffeine from cola, coffee, tea, chocolate and medicines adds together. Brand, recipe and serving size can change the amount, so the package in your hand matters more than a remembered number.",
    alternatives: [
      {
        label: "Closest taste",
        title: "Caffeine-free cola",
        note: "Keeps the familiar cola taste without using part of the daily caffeine allowance.",
      },
      {
        label: "Keep the original",
        title: "A smaller serving",
        note: "Choose a size you can count easily and include it with every other caffeine source that day.",
      },
      {
        label: "Fresh option",
        title: "Sparkling water with citrus",
        note: "Cold, fizzy and easy to vary with lemon, lime, orange or mint.",
      },
    ],
    labelCheck:
      "“Zero sugar” does not mean caffeine-free. Look specifically for “caffeine-free” and check the serving size.",
    sourceIds: ["acog-caffeine", "coca-cola-caffeine"],
    review: review("rapid-review"),
  },
  {
    id: "coffee",
    item: "Coffee and iced coffee",
    group: "coffee-tea",
    status: "keep-with-limit",
    searchTerms: ["latte", "espresso", "cappuccino", "cold brew", "iced latte"],
    shortAnswer:
      "Coffee can stay if all caffeine for the day remains below 200 mg. Café size, bean, brew method and extra espresso shots can make two similar-looking drinks very different.",
    why: "The limit applies to the whole day, not to coffee alone. Tea, cola, chocolate, energy drinks and some medicines can also contribute.",
    alternatives: [
      {
        label: "Closest ritual",
        title: "Decaf coffee",
        note: "Keeps the cup, aroma and café routine with much less caffeine, though decaf is not always completely caffeine-free.",
      },
      {
        label: "Gentle step down",
        title: "Half-caf",
        note: "Mix regular and decaf or ask the café for one regular shot and one decaf shot.",
      },
      {
        label: "Keep the original",
        title: "A smaller, single-shot drink",
        note: "Ask how many shots it contains and leave room in the daily total for tea, cola or chocolate.",
      },
    ],
    labelCheck:
      "Do not estimate from cup colour or drink name. Check the volume and number of espresso shots; bottled coffee should list caffeine on its label when available.",
    sourceIds: ["acog-caffeine"],
    review: review(),
  },
  {
    id: "energy-drinks",
    item: "Energy drinks and energy shots",
    group: "drinks",
    status: "choose-alternative",
    searchTerms: [
      "red bull",
      "monster",
      "energy shot",
      "pre workout",
      "stimulant drink",
    ],
    shortAnswer:
      "Choose a different drink during pregnancy unless your doctor has reviewed the exact product. Energy drinks can make caffeine easy to underestimate and may add other stimulant ingredients.",
    why: "A generic caffeine total cannot assess every stimulant blend, herbal extract or concentrated ingredient. “Natural energy” is not a pregnancy-safety statement.",
    alternatives: [
      {
        label: "Cold and fizzy",
        title: "Caffeine-free sparkling drink",
        note: "Choose one without an energy, stimulant or herbal blend and check the full ingredient list.",
      },
      {
        label: "With food",
        title: "Water plus a regular snack",
        note: "A drink and a snack containing carbohydrate and protein may help when the real need is hydration or food.",
      },
      {
        label: "When exhaustion persists",
        title: "Ask about the fatigue",
        note: "Severe or ongoing tiredness deserves care rather than repeatedly masking it with stimulants.",
      },
    ],
    labelCheck:
      "Check caffeine per container, not only per serving, and look for guarana, stimulant blends, concentrated extracts and pre-workout wording.",
    sourceIds: ["acog-caffeine", "cdc-medicine"],
    review: review("rapid-review"),
  },
  {
    id: "alcohol",
    item: "Wine, beer and cocktails",
    group: "drinks",
    status: "choose-alternative",
    searchTerms: [
      "champagne",
      "prosecco",
      "spirits",
      "mocktail",
      "non alcoholic wine",
    ],
    shortAnswer:
      "Choose an alcohol-free drink during pregnancy. There is no known safe amount, safe time or safe type of alcohol in pregnancy.",
    why: "Changing the type of alcohol does not remove the pregnancy risk. The useful swap is the same occasion and flavour style without alcohol.",
    alternatives: [
      {
        label: "Closest occasion",
        title: "A clearly labelled 0.0% drink",
        note: "Use the label rather than the front-of-pack style; “low alcohol” and “alcohol-free” definitions can differ.",
      },
      {
        label: "Restaurant order",
        title: "A made-to-order no-alcohol mocktail",
        note: "Ask for no bitters or alcoholic flavourings and choose pasteurized juices.",
      },
      {
        label: "Simple at home",
        title: "Sparkling water and pasteurized juice",
        note: "Serve cold in the same glass with citrus or herbs for the ritual without alcohol.",
      },
    ],
    labelCheck:
      "Look for 0.0% when you want the clearest substitute. Check kombucha and fermented drinks too; the name alone does not tell you the alcohol content.",
    sourceIds: ["cdc-alcohol"],
    review: review("rapid-review"),
  },
  {
    id: "sushi",
    item: "Sushi and poke bowls",
    group: "meals",
    status: "prepare-differently",
    searchTerms: [
      "raw fish",
      "sashimi",
      "salmon roll",
      "poke",
      "japanese takeaway",
    ],
    shortAnswer:
      "Keep the meal, change the filling: choose cooked seafood, cooked protein or vegetarian sushi instead of raw fish or raw shellfish.",
    why: "The practical pregnancy issue is the raw ingredient and food handling, not the rice, seaweed or shape of the dish.",
    alternatives: [
      {
        label: "Closest order",
        title: "Cooked salmon, shrimp or crab-style roll",
        note: "Confirm the seafood is fully cooked and the roll is made with clean utensils.",
      },
      {
        label: "No seafood",
        title: "Avocado, cucumber or cooked-vegetable roll",
        note: "Ask for fresh preparation and clean separation from raw fish if cross-contact worries you.",
      },
      {
        label: "Same bowl format",
        title: "Poke bowl with fully cooked protein",
        note: "Use fresh washed vegetables and a cooked topping rather than raw fish or raw egg.",
      },
    ],
    labelCheck:
      "“Smoked,” “seared” and “marinated” do not always mean cooked through. Ask how the filling was prepared.",
    sourceIds: ["cdc-food", "nhs-food"],
    review: review(),
  },
  {
    id: "deli-meat",
    item: "Deli meat, cured meat and hot dogs",
    group: "meals",
    status: "prepare-differently",
    searchTerms: [
      "ham",
      "salami",
      "prosciutto",
      "pepperoni",
      "sandwich",
      "frankfurter",
    ],
    shortAnswer:
      "The easy general swap is heat: have deli meat or a hot dog steaming hot instead of cold from the refrigerator.",
    why: "Heating changes a cold ready-to-eat product into a lower-risk option while keeping the sandwich, pizza or hot-dog meal familiar.",
    alternatives: [
      {
        label: "Keep the filling",
        title: "A hot toasted sandwich",
        note: "Heat the meat until steaming throughout, then assemble and eat promptly.",
      },
      {
        label: "Freshly cooked",
        title: "Chicken, turkey, beef or pork",
        note: "Use meat cooked through and served hot rather than chilled pre-sliced meat.",
      },
      {
        label: "Meat-free",
        title: "A hot bean or cooked-vegetable filling",
        note: "Choose a freshly prepared filling and keep cold ingredients properly chilled.",
      },
    ],
    labelCheck:
      "Microwaving briefly is not enough if the centre stays cool. The practical check is steaming hot throughout.",
    sourceIds: ["cdc-food", "nhs-food"],
    review: review(),
  },
  {
    id: "soft-cheese",
    item: "Soft and mould-ripened cheese",
    group: "dairy",
    status: "prepare-differently",
    searchTerms: [
      "brie",
      "camembert",
      "blue cheese",
      "goat cheese",
      "feta",
      "queso fresco",
    ],
    shortAnswer:
      "For the simplest general choice, use pasteurized hard or semi-hard cheese. If choosing a soft or mould-ripened cheese, check the exact product and use pregnancy guidance from your care team; cooking until steaming hot can make some dishes a better option.",
    why: "Cheese advice depends on milk treatment, moisture, rind, storage and whether the food is thoroughly cooked. “Soft” alone is not a complete safety label.",
    alternatives: [
      {
        label: "Simplest cold swap",
        title: "Pasteurized cheddar, gouda or another firm cheese",
        note: "Check that it is pasteurized and keep it refrigerated within its use-by date.",
      },
      {
        label: "For a hot dish",
        title: "Cheese cooked until steaming",
        note: "Use it in a dish that becomes steaming hot throughout, not only warmed at the edges.",
      },
      {
        label: "For creamy texture",
        title: "Pasteurized cream cheese or cottage cheese",
        note: "Check the label, refrigeration and use-by date before eating it cold.",
      },
    ],
    labelCheck:
      "Check “pasteurized,” the cheese type, storage instructions and use-by date. Pasteurization does not replace safe refrigeration and handling.",
    sourceIds: ["cdc-food", "nhs-food"],
    review: review("rapid-review"),
  },
  {
    id: "runny-eggs",
    item: "Runny eggs and raw-egg sauces",
    group: "meals",
    status: "prepare-differently",
    searchTerms: [
      "poached egg",
      "soft boiled",
      "hollandaise",
      "mayonnaise",
      "raw batter",
    ],
    shortAnswer:
      "The universal cautious swap is a fully cooked egg or a product made with pasteurized egg instead of a runny or raw egg.",
    why: "Cooking the white and yolk through, or using pasteurized egg, lowers foodborne-infection risk without removing eggs from the menu.",
    alternatives: [
      {
        label: "Same breakfast",
        title: "Egg cooked until white and yolk are firm",
        note: "Fry, boil, poach or scramble it until no raw or runny part remains.",
      },
      {
        label: "For sauces",
        title: "Commercial pasteurized-egg mayonnaise",
        note: "Check the ingredients and refrigeration instructions; do not assume a homemade sauce uses pasteurized egg.",
      },
      {
        label: "For baking",
        title: "A fully baked version",
        note: "Do not taste raw batter; bake until the centre is properly cooked.",
      },
    ],
    labelCheck:
      "Country-specific egg schemes can differ. If the package does not clearly support a local exception, use the fully cooked or pasteurized option.",
    sourceIds: ["cdc-food", "nhs-food"],
    review: review("rapid-review"),
  },
  {
    id: "raw-egg-desserts",
    item: "Tiramisu, mousse and homemade desserts",
    group: "treats",
    status: "prepare-differently",
    searchTerms: [
      "chocolate mousse",
      "homemade ice cream",
      "raw egg dessert",
      "rum cake",
      "alcohol dessert",
    ],
    shortAnswer:
      "Choose a version made without alcohol and with pasteurized egg—or a dessert that is fully baked instead.",
    why: "Two separate details can matter in the same dessert: raw egg and alcohol. Removing only one does not answer the other.",
    alternatives: [
      {
        label: "Closest version",
        title: "Pasteurized-egg, alcohol-free tiramisu or mousse",
        note: "Ask about both ingredients; “homemade” does not reveal whether the egg is pasteurized.",
      },
      {
        label: "Easy restaurant order",
        title: "A fully baked cake or pudding",
        note: "Check that it has no alcoholic soak, sauce or uncooked egg topping.",
      },
      {
        label: "Cold option",
        title: "Pasteurized yogurt with fruit",
        note: "Keeps a creamy, chilled dessert format with an ingredient list that is easier to verify.",
      },
    ],
    labelCheck:
      "Ask separately: “Does it contain alcohol?” and “Are the eggs pasteurized or fully cooked?” Coffee-flavoured desserts may also add caffeine.",
    sourceIds: ["cdc-food", "nhs-food", "cdc-alcohol", "acog-caffeine"],
    review: review("rapid-review"),
  },
  {
    id: "high-mercury-fish",
    item: "Large predatory fish",
    group: "protein-produce",
    status: "choose-alternative",
    searchTerms: [
      "shark",
      "swordfish",
      "marlin",
      "king mackerel",
      "tuna",
      "mercury",
      "fish",
    ],
    shortAnswer:
      "Choose cooked lower-mercury fish instead of large predatory fish. Exact species names and local contamination advisories vary, so check local guidance for the fish you buy or catch.",
    why: "The goal is not to avoid all fish. It is to keep the nutritional benefits while reducing mercury exposure and foodborne-infection risk.",
    alternatives: [
      {
        label: "Oily-fish option",
        title: "Cooked salmon or sardines",
        note: "Choose a lower-mercury variety, cook thoroughly and vary the fish you eat.",
      },
      {
        label: "Mild option",
        title: "Cooked shrimp or a lower-mercury white fish",
        note: "Confirm the species when possible and cook until fully done.",
      },
      {
        label: "Caught locally",
        title: "Check the water-specific advisory",
        note: "A local warning can override a general list because contamination differs by waterway.",
      },
    ],
    labelCheck:
      "Fish names can vary by market. Check the exact species, serving advice and any local catch warning—not only “tuna” or “white fish.”",
    sourceIds: ["cdc-food", "nhs-food"],
    review: review("rapid-review"),
  },
  {
    id: "herbal-tea",
    item: "Herbal tea and wellness drinks",
    group: "coffee-tea",
    status: "check-first",
    searchTerms: [
      "ginger tea",
      "peppermint tea",
      "detox tea",
      "sleep tea",
      "herbs",
      "adaptogen",
    ],
    shortAnswer:
      "Check the exact ingredient list before making an herbal or wellness blend a daily pregnancy drink. “Herbal,” “detox” and “natural” do not establish pregnancy safety.",
    why: "Blends may combine several herbs, concentrated extracts or supplement-like doses. A familiar food ingredient is different from a medicinal-dose product.",
    alternatives: [
      {
        label: "Warm and simple",
        title: "Hot water with lemon",
        note: "Uses a familiar food ingredient without a multi-herb or concentrated wellness blend.",
      },
      {
        label: "Tea ritual",
        title: "Decaf black tea",
        note: "It usually contains much less caffeine than regular tea, but still count any caffeine shown on the pack.",
      },
      {
        label: "Keep the blend",
        title: "Photograph the label for review",
        note: "Ask a doctor or pharmacist about the exact ingredients, dose and how often you drink it.",
      },
    ],
    labelCheck:
      "Read every ingredient and the serving directions. Avoid treating a tea as harmless because it is caffeine-free or sold as food.",
    sourceIds: ["cdc-medicine", "acog-caffeine"],
    review: review("rapid-review"),
  },
  {
    id: "raw-sprouts",
    item: "Raw sprouts",
    group: "protein-produce",
    status: "prepare-differently",
    searchTerms: [
      "bean sprouts",
      "alfalfa",
      "mung bean",
      "sprouted seeds",
      "salad sprouts",
    ],
    shortAnswer:
      "Choose sprouts cooked thoroughly rather than raw. Washing alone may not remove bacteria growing inside the sprout.",
    why: "This is one of the cases where rinsing is not the full fix. Heat is the useful change.",
    alternatives: [
      {
        label: "Keep the ingredient",
        title: "Sprouts cooked until steaming",
        note: "Add them early enough in a stir-fry, soup or noodle dish to cook thoroughly.",
      },
      {
        label: "Keep the crunch",
        title: "Freshly washed cabbage, carrot or cucumber",
        note: "Prepare with clean hands and utensils and eat the salad promptly.",
      },
      {
        label: "Takeaway check",
        title: "Ask for no raw garnish",
        note: "Bean sprouts may be added after cooking, so ask for them fully cooked or left out.",
      },
    ],
    labelCheck:
      "“Washed” and “ready to eat” do not mean raw sprouts are cooked. Check whether they were heated all the way through.",
    sourceIds: ["cdc-food"],
    review: review(),
  },
  {
    id: "unpasteurized",
    item: "Unpasteurized milk and juice",
    group: "dairy",
    status: "choose-alternative",
    searchTerms: [
      "raw milk",
      "farm milk",
      "fresh juice",
      "cold pressed juice",
      "cider",
      "unpasteurised",
    ],
    shortAnswer:
      "Choose the pasteurized version during pregnancy. “Fresh,” “raw,” “farm” or “cold-pressed” does not mean safer.",
    why: "Pasteurization reduces harmful germs without changing the basic type of drink, making this one of the easiest like-for-like swaps.",
    alternatives: [
      {
        label: "Closest match",
        title: "Pasteurized milk or juice",
        note: "Choose the same flavour or milk type with pasteurization clearly stated on the label.",
      },
      {
        label: "At a juice bar",
        title: "A sealed pasteurized drink",
        note: "If staff cannot confirm treatment and clean handling, choose a labelled packaged option.",
      },
      {
        label: "At home",
        title: "Whole washed fruit plus water",
        note: "This avoids uncertainty about an unlabelled fresh-pressed drink.",
      },
    ],
    labelCheck:
      "Find the word “pasteurized” on the container or ask the producer directly. Refrigeration alone does not pasteurize a drink.",
    sourceIds: ["cdc-food", "nhs-food"],
    review: review(),
  },
  {
    id: "liver-pate",
    item: "Liver and pâté",
    group: "protein-produce",
    status: "choose-alternative",
    searchTerms: [
      "liver pate",
      "liver sausage",
      "foie gras",
      "retinol",
      "vitamin a",
    ],
    shortAnswer:
      "Choose a different protein or spread during pregnancy. Liver and liver products can contain very high vitamin A, and refrigerated pâté also raises food-safety concerns.",
    why: "This is not a food that becomes a simple everyday choice just by heating it. A different filling avoids both the vitamin-A issue and uncertainty around chilled pâté.",
    alternatives: [
      {
        label: "For a main meal",
        title: "Freshly cooked meat, fish, egg or beans",
        note: "Choose a protein that is cooked thoroughly and fits the rest of your diet.",
      },
      {
        label: "For a spread",
        title: "Hummus or bean spread",
        note: "Use a fresh refrigerated product within its date and keep it cold.",
      },
      {
        label: "For iron concerns",
        title: "Ask for a tailored iron plan",
        note: "Do not use liver or a high-dose supplement to self-treat suspected anaemia.",
      },
    ],
    labelCheck:
      "Check multivitamins and supplements for retinol or high-dose vitamin A too; ask before using them in pregnancy.",
    sourceIds: ["nhs-food", "cdc-food", "cdc-medicine"],
    review: review("rapid-review"),
  },
];

const preconception = [
  {
    id: "getting-pregnant",
    slug: "getting-pregnant",
    title: "Getting pregnant, clearly",
    eyebrow: "Before the positive test",
    dek: "A practical plan for timing sex, preparing both partners, avoiding fertility myths and knowing when it is time to ask for help.",
    routeNote:
      "The timing advice below is for pregnancy through vaginal intercourse. Folic acid, medicine review and health preparation still matter when using donor sperm or fertility treatment, but the timing plan should come from your clinic.",
    orientation: [
      {
        label: "Helps pregnancy happen",
        title: "Timing and reproductive biology",
        detail:
          "Sex often enough around ovulation, regular ovulation, open fallopian tubes and sperm able to reach and fertilize an egg directly affect the chance of conception.",
      },
      {
        label: "Helps a pregnancy start healthier",
        title: "Preparation before conception",
        detail:
          "Folic acid, medicine and vaccine review, and good control of medical conditions mainly reduce avoidable pregnancy risks. They are important even though they do not guarantee faster conception.",
      },
      {
        label: "Can affect both",
        title: "Age, smoking and overall health",
        detail:
          "Age of the person providing the egg, tobacco, some drugs, untreated infections and certain health conditions can affect conception chances as well as pregnancy outcomes.",
      },
    ],
    plan: [
      {
        title: "Choose a sustainable sex schedule",
        detail:
          "A simple plan is vaginal sex every 2–3 days throughout the cycle without contraception. If you prefer to identify the fertile window, sex every 1–2 days during that window gives the highest chance without needing one perfect moment.",
      },
      {
        title: "Treat ovulation dates as a window, not a deadline",
        detail:
          "The fertile window is roughly the six days ending on ovulation, and its timing can change even in regular cycles. Cervical-mucus changes or a urine ovulation test can help; an app is an estimate, not proof of ovulation.",
      },
      {
        title: "Start folic acid before the test",
        detail:
          "The person who may become pregnant should usually take 400 micrograms of folic acid every day from at least one month before conception. It helps prevent neural-tube defects; it is not a fertility booster. Ask whether your history requires a different dose.",
      },
      {
        title: "Review health before changing treatment",
        detail:
          "Bring prescriptions, over-the-counter medicines, supplements and herbal products to a prepregnancy appointment. Review medical conditions, mental health, vaccines and infection screening; do not stop prescribed treatment on your own.",
      },
      {
        title: "Prepare both partners",
        detail:
          "Both partners can stop smoking and recreational drugs, avoid non-prescribed hormones or anabolic steroids, limit harmful alcohol use, eat normally, move regularly and ask for help when changing a habit is difficult.",
      },
      {
        title: "Know your point for asking for help",
        detail:
          "Trying can normally take months. The age of the person providing the egg and any known reproductive-health concern determine whether to seek an evaluation after 12 months, after 6 months or sooner.",
      },
    ],
    dos: [
      "Record the first day of each period so you can see whether cycles are broadly regular; do not expect the record to identify ovulation perfectly.",
      "Have sex every 2–3 days through the cycle, or every 1–2 days in the fertile window if tracking feels useful rather than stressful.",
      "Start daily folic acid before pregnancy and check the label rather than stacking several supplements with overlapping ingredients.",
      "Make one list of both partners’ medicines, hormones, supplements, medical conditions, previous operations and relevant family history.",
      "Keep intimacy consensual and sustainable. A schedule that causes pain, pressure or conflict is a reason to simplify the plan or ask for help.",
    ],
    donts: [
      "Do not save sperm by avoiding ejaculation for long stretches; regular sex during the fertile window does not reduce fertility in people with typical semen quality.",
      "Do not rely on sex position, orgasm, raised legs or lying still after sex. Sperm begin moving through the reproductive tract quickly, and these rituals do not improve conception rates.",
      "Do not buy fertility detoxes, hormone-balancing teas or high-dose antioxidant packs because testimonials promise a faster pregnancy.",
      "Do not start non-prescribed testosterone or anabolic steroids when trying for pregnancy; they can suppress sperm production. Review prescribed hormone treatment with the prescriber before making a change.",
      "Do not turn a negative test into blame. Fertility can involve eggs, ovulation, tubes, uterus, sperm, timing, several factors together or no identified cause.",
    ],
    askDoctor: [
      "Ask before trying if either partner has a long-term condition, takes regular medicine, had cancer treatment, or knows of a genetic condition in the family.",
      "Ask sooner for absent or very irregular periods, known endometriosis, previous pelvic infection or pelvic surgery, or repeated pregnancy loss.",
      "Ask sooner for known testicular injury, undescended testes, erection or ejaculation difficulty, previous low sperm count, or current testosterone or anabolic-steroid use.",
      "Ask about vaccine timing, infection screening and the right folic-acid dose for your history before pregnancy begins.",
      "Ask for support if sex is painful, impossible, unsafe, highly distressing or not the route you will use to conceive.",
    ],
    factors: [
      {
        name: "Timing and frequency of sex",
        category: "chance",
        chance:
          "Direct effect: sperm need to be present in the fertile window. Every 2–3 days through the cycle is a practical baseline.",
        babyHealth:
          "No meaningful evidence that a particular day or frequency makes a resulting baby healthier.",
        action:
          "Choose a repeatable schedule instead of chasing one exact hour.",
      },
      {
        name: "Age of the person providing the egg",
        category: "both",
        chance:
          "A strong biological factor: egg number and quality decline with age, more noticeably through the mid-to-late 30s.",
        babyHealth:
          "Miscarriage and chromosome-condition risks also rise with egg age; age is context for earlier care, not anyone’s fault.",
        action: "Use age when deciding how long to try before an evaluation.",
      },
      {
        name: "Ovulation, fallopian tubes and sperm",
        category: "chance",
        chance:
          "Direct effect: conception depends on releasing an egg, sperm function and a route for egg and sperm to meet.",
        babyHealth:
          "These factors mainly affect whether conception happens, not the everyday health preparation for pregnancy.",
        action:
          "Seek earlier advice when a known condition may affect any of these steps.",
      },
      {
        name: "Folic acid",
        category: "health",
        chance:
          "It has not been shown to make natural conception happen faster in people without a specific deficiency.",
        babyHealth:
          "Enough folic acid before and during early pregnancy reduces the risk of serious brain and spine defects.",
        action:
          "Usually take 400 micrograms daily; ask if you need a different dose.",
      },
      {
        name: "Medicines, vaccines and chronic conditions",
        category: "health",
        chance:
          "Some conditions and treatments can affect fertility, but many do not. The exact medicine and condition matter.",
        babyHealth:
          "Good condition control and an individual medicine and vaccine plan can reduce avoidable pregnancy risks.",
        action:
          "Review the exact plan before pregnancy; never stop prescribed treatment from a generic list.",
      },
      {
        name: "Smoking, recreational drugs and heavy alcohol use",
        category: "both",
        chance:
          "These exposures can disrupt reproductive health, ovulation or sperm production and may lengthen time to conception.",
        babyHealth:
          "They can also harm pregnancy. The person who may become pregnant should avoid alcohol once trying because pregnancy begins before a test turns positive.",
        action:
          "Make a nonjudgmental stopping plan and ask for support when needed.",
      },
      {
        name: "Food, movement and body weight",
        category: "both",
        chance:
          "Very low or high weight and excessive exercise can disrupt ovulation for some people, but no special fertility diet has been proven to boost natural fertility generally.",
        babyHealth:
          "Regular meals, ordinary varied food and manageable movement support general health before pregnancy.",
        action:
          "Aim for sustainable habits; ask for tailored help rather than crash dieting.",
      },
      {
        name: "Testosterone, anabolic steroids and repeated testicular heat",
        category: "chance",
        chance:
          "Testosterone and anabolic steroids can suppress sperm production. Frequent high heat around the testes may also affect sperm production.",
        babyHealth:
          "These are mainly sperm and conception concerns; prescribed treatment still requires individual medical review.",
        action:
          "Discuss hormones, fertility goals and safer options with the prescriber.",
      },
      {
        name: "Sex position and lying down afterward",
        category: "neither",
        chance:
          "No position or post-sex routine has been shown to improve natural fertility.",
        babyHealth: "They do not change the health of a future baby.",
        action:
          "Choose what is comfortable and consensual; normal fluid leakage is expected.",
      },
    ],
    myths: [
      {
        myth: "You must have sex on ovulation day.",
        truth:
          "The fertile window covers several days, and conception is often most likely when sperm are already present before ovulation.",
        takeaway: "Regular sex is more reliable than finding one perfect day.",
      },
      {
        myth: "Every cycle ovulates on day 14.",
        truth:
          "Ovulation timing varies between people and between cycles, including in people whose periods seem regular.",
        takeaway: "Use a window; treat calendar apps as estimates.",
      },
      {
        myth: "Daily sex uses up the good sperm.",
        truth:
          "Frequent sex does not lower pregnancy chances for couples with typical semen quality. Every other day is also highly effective and may feel easier.",
        takeaway: "Do not impose long abstinence to save sperm.",
      },
      {
        myth: "Legs up, lying still or a special position helps.",
        truth:
          "Sperm move into the reproductive tract quickly. Position, orgasm and post-sex routines have not been shown to improve fertility.",
        takeaway: "Comfort matters more than choreography.",
      },
      {
        myth: "Pineapple, seed cycling or one supplement can make pregnancy happen.",
        truth:
          "No particular food, diet pattern, antioxidant pack or herbal remedy reliably improves natural fertility for everyone.",
        takeaway: "Eat normally and be cautious with concentrated supplements.",
      },
      {
        myth: "Folic acid is a fertility treatment.",
        truth:
          "Folic acid prepares for early development and prevents some neural-tube defects; it does not replace timing or fertility evaluation.",
        takeaway:
          "Take it for future-baby health, not as a conception booster.",
      },
      {
        myth: "If it has not happened quickly, one partner must be the problem.",
        truth:
          "Many healthy couples need several cycles. When there is a fertility problem, factors may involve either partner, both partners or remain unexplained.",
        takeaway: "Evaluate the couple and avoid blame.",
      },
      {
        myth: "Everyone should wait a full year before asking for help.",
        truth:
          "The usual point is 12 months when the egg-providing partner is under 35, 6 months from age 35, and an earlier conversation over 40 or when a known concern exists.",
        takeaway: "Age and medical history change the timeline.",
      },
    ],
    help: [
      {
        title: "Egg-providing partner under 35",
        guidance:
          "Arrange an evaluation after 12 months of regular sex without contraception if pregnancy has not happened, or sooner when a known concern exists.",
      },
      {
        title: "Egg-providing partner age 35–40",
        guidance:
          "Arrange an evaluation after 6 months of trying because fertility changes more quickly with age.",
      },
      {
        title: "Egg-providing partner over 40",
        guidance:
          "Talk with a fertility or maternity clinician when you begin trying rather than waiting through a fixed number of cycles.",
      },
      {
        title: "At any age, ask sooner",
        guidance:
          "Seek earlier advice for absent or very irregular periods, endometriosis, pelvic disease or surgery, repeated loss, cancer treatment, a known sperm or testicular concern, sexual-function difficulty, or another reason to question fertility.",
      },
      {
        title: "Expect both partners to be considered",
        guidance:
          "A useful fertility evaluation looks at ovulation and reproductive anatomy as well as semen and sexual function. Testing only one partner can miss important information.",
      },
    ],
    partnerActions: [
      "Agree on a schedule together and protect the right to say no; conception sex should never become an obligation.",
      "Share the health preparation: medicine lists, appointments, smoking or alcohol changes, sleep, food and emotional support are not one person’s job.",
      "If you produce sperm, mention testosterone, anabolic steroids, testicular history, ejaculation difficulty and relevant medicines rather than waiting for your partner to be tested first.",
      "Use neutral language after a negative test. Try 'this cycle did not work' instead of assigning success or failure to either body.",
    ],
    sourceIds: [
      "asrm-natural-fertility",
      "acog-infertility",
      "acog-prepregnancy",
      "cdc-planning-pregnancy",
      "cdc-infertility",
      "who-preconception",
    ],
    review: {
      status: "editorial-ready",
      reviewedAt: "2026-08-02",
      nextReviewAt: "2027-08-02",
      reviewer: "Clinical reviewer required before public release",
      volatility: "annual",
    },
  },
];

const collections = {
  timeline,
  milestones,
  essentials,
  substitutions,
  preconception,
  sources,
  urgent,
};
for (const [name, records] of Object.entries(collections)) {
  writeFileSync(
    resolve(outputDir, `${name}.json`),
    `${JSON.stringify(records, null, 2)}\n`,
    "utf8",
  );
}

const searchIndex = [
  ...timeline.map((entry) => ({
    type: "timeline",
    title: entry.title,
    summary: entry.dek,
    href:
      entry.kind === "postpartum"
        ? `/timeline/postpartum/${entry.slug}/`
        : `/timeline/${entry.slug}/`,
    topics: entry.topics,
    text: [
      ...entry.summary,
      ...entry.bodyMind,
      ...entry.baby,
      ...(entry.clarifications ?? []),
      ...entry.doNow,
      ...entry.avoidAsk,
      ...entry.appointments,
      ...entry.partner,
    ].join(" "),
  })),
  ...essentials.map((entry) => ({
    type: "essential",
    title: entry.title,
    summary: entry.intro,
    href: `/essentials/#${entry.slug}`,
    topics: [entry.slug],
    text: [
      ...entry.dos,
      ...entry.donts,
      ...entry.askDoctor,
      ...entry.examples.flatMap((example) => [example.name, example.guidance]),
    ].join(" "),
  })),
  ...substitutions.map((entry) => ({
    type: "swap",
    title: entry.item,
    summary: entry.shortAnswer,
    href: `/essentials/#swap-${entry.id}`,
    topics: [entry.group, entry.status, ...entry.searchTerms],
    text: [
      entry.why,
      entry.labelCheck,
      ...entry.alternatives.flatMap((alternative) => [
        alternative.label,
        alternative.title,
        alternative.note,
      ]),
    ].join(" "),
  })),
  ...preconception.map((entry) => ({
    type: "preconception",
    title: entry.title,
    summary: entry.dek,
    href: "/getting-pregnant/",
    topics: ["trying to conceive", "fertility", "folic acid", "ovulation"],
    text: [
      entry.routeNote,
      ...entry.orientation.flatMap((item) => [
        item.label,
        item.title,
        item.detail,
      ]),
      ...entry.plan.flatMap((item) => [item.title, item.detail]),
      ...entry.dos,
      ...entry.donts,
      ...entry.askDoctor,
      ...entry.factors.flatMap((item) => [
        item.name,
        item.chance,
        item.babyHealth,
        item.action,
      ]),
      ...entry.myths.flatMap((item) => [item.myth, item.truth, item.takeaway]),
      ...entry.help.flatMap((item) => [item.title, item.guidance]),
      ...entry.partnerActions,
    ].join(" "),
  })),
  ...urgent.map((entry) => ({
    type: "urgent",
    title: entry.title,
    summary: entry.intro,
    href:
      entry.id === "contact-care-team"
        ? "/urgent-help/#care-team"
        : entry.audience === "infant"
          ? "/urgent-help/#infant"
          : "/urgent-help/#maternal",
    topics: [entry.tier, entry.audience],
    text: [
      entry.action,
      ...entry.signs.flatMap((sign) => [sign.title, sign.detail]),
    ].join(" "),
  })),
];
mkdirSync(resolve("public/data"), { recursive: true });
writeFileSync(
  resolve("public/data/search-index.json"),
  `${JSON.stringify(searchIndex)}\n`,
  "utf8",
);

console.log(
  `Generated ${timeline.length} timeline entries, ${essentials.length} pregnancy essentials, ${substitutions.length} practical swaps, ${preconception.length} preconception guide, ${milestones.length} milestones and ${sources.length} internal source records.`,
);
