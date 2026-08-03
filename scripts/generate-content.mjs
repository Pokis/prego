import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const outputDir = resolve("src/data/generated");
mkdirSync(outputDir, { recursive: true });

const review = (volatility = "annual") => ({
  status: "editorial-ready",
  reviewedAt: "2026-07-31",
  nextReviewAt: volatility === "rapid-review" ? "2026-10-29" : "2027-07-31",
  reviewer: "Internal editorial record",
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
  [
    "acog-substances",
    "American College of Obstetricians and Gynecologists",
    "Tobacco, Alcohol, Drugs, and Pregnancy",
    "https://www.acog.org/womens-health/faqs/tobacco-alcohol-drugs-and-pregnancy",
    ["general"],
    "Current page; date not stated",
    "rapid-review",
    "Tobacco, nicotine, vaping, alcohol, cannabis, opioids and nonmedical drug-use guidance in pregnancy.",
    "2026-08-03",
  ],
  [
    "acog-cannabis",
    "American College of Obstetricians and Gynecologists",
    "Marijuana (Cannabis) and Pregnancy",
    "https://www.acog.org/womens-health/faqs/marijuana-and-pregnancy",
    ["general"],
    "Current page; date not stated",
    "rapid-review",
    "Cannabis, marijuana and CBD guidance across smoked, vaped and edible products.",
    "2026-08-03",
  ],
  [
    "acog-prenatal-testing",
    "American College of Obstetricians and Gynecologists",
    "ACOG Explains: Prenatal Genetic Testing",
    "https://www.acog.org/womens-health/videos/prenatal-genetic-testing",
    ["general"],
    "2025-02-01",
    "rapid-review",
    "Distinguishes screening from diagnostic tests and names cell-free DNA/NIPT, CVS and amniocentesis.",
    "2026-08-03",
  ],
  [
    "acog-preeclampsia",
    "American College of Obstetricians and Gynecologists",
    "Preeclampsia and High Blood Pressure During Pregnancy",
    "https://www.acog.org/womens-health/faqs/preeclampsia-and-high-blood-pressure-during-pregnancy",
    ["general"],
    "Current page; date not stated",
    "rapid-review",
    "High blood pressure, pre-eclampsia terminology, monitoring and warning signs during pregnancy and after birth.",
    "2026-08-03",
  ],
  [
    "acog-gbs",
    "American College of Obstetricians and Gynecologists",
    "Group B Strep and Pregnancy",
    "https://www.acog.org/womens-health/faqs/group-b-strep-and-pregnancy",
    ["general"],
    "Current page; date not stated",
    "rapid-review",
    "Group B streptococcus terminology, screening discussion and birth-plan implications.",
    "2026-08-03",
  ],
  [
    "acog-labour-birth",
    "American College of Obstetricians and Gynecologists",
    "Labor & Delivery",
    "https://www.acog.org/womens-health/pregnancy/labor-and-delivery",
    ["general"],
    "Current page; date not stated",
    "rapid-review",
    "Birth preparation, labour signs, induction, breech presentation, caesarean birth, VBAC and preterm birth topic foundation.",
    "2026-08-03",
  ],
  [
    "acog-labour-pain",
    "American College of Obstetricians and Gynecologists",
    "Medications for Pain Relief During Labor and Delivery",
    "https://www.acog.org/womens-health/faqs/medications-for-pain-relief-during-labor-and-delivery",
    ["general"],
    "Current page; date not stated",
    "rapid-review",
    "Questions and choices around nonmedical support, systemic medicine, nitrous oxide, epidural and spinal pain relief.",
    "2026-08-03",
  ],
  [
    "acog-travel",
    "American College of Obstetricians and Gynecologists",
    "Travel During Pregnancy",
    "https://www.acog.org/womens-health/faqs/travel-during-pregnancy",
    ["general"],
    "Current page; date not stated",
    "rapid-review",
    "Travel planning, long journeys, destination infection risks, flights, cruises and urgent symptoms away from home.",
    "2026-08-03",
  ],
  [
    "nhs-pregnancy-symptoms",
    "National Health Service",
    "Pregnancy symptoms",
    "https://www.nhs.uk/pregnancy/common-symptoms/",
    ["global", "uk"],
    "Current page; date not stated",
    "rapid-review",
    "Common symptom index covering pain, headaches, reflux, piles, swelling, sleep, thrush, bleeding, discharge and vomiting.",
    "2026-08-03",
  ],
  [
    "nhs-symptoms-help",
    "National Health Service",
    "Pregnancy symptoms you need to get help for",
    "https://www.nhs.uk/pregnancy/common-symptoms/pregnancy-symptoms-you-need-to-get-help-for/",
    ["global", "uk"],
    "2026-07-01",
    "rapid-review",
    "Escalation for movement changes, fluid loss, fever, itching, pain, breathlessness, severe headache, swelling and vision changes.",
    "2026-08-03",
  ],
  [
    "cdc-workplace",
    "US Centers for Disease Control and Prevention, NIOSH",
    "Examples of Jobs and Reproductive Health",
    "https://www.cdc.gov/niosh/reproductive-health/risk-factors/index.html",
    ["general"],
    "2024-04-03",
    "annual",
    "Work-specific exposure prompts for healthcare, childcare, laboratories, salons, farming, veterinary work, heat, shifts and physical demands.",
    "2026-08-03",
  ],
  [
    "cdc-parvovirus",
    "US Centers for Disease Control and Prevention",
    "Parvovirus B19 in Pregnancy",
    "https://www.cdc.gov/parvovirus-b19/about/parvovirus-b19-in-pregnancy.html",
    ["general"],
    "2025-12-17",
    "rapid-review",
    "Exposure, symptoms, testing and monitoring conversations for parvovirus B19 or fifth disease in pregnancy.",
    "2026-08-03",
  ],
  [
    "acog-during-pregnancy",
    "American College of Obstetricians and Gynecologists",
    "During Pregnancy",
    "https://www.acog.org/womens-health/pregnancy/during-pregnancy",
    ["general"],
    "Current page; date not stated",
    "rapid-review",
    "Professional topic map for pregnancy health, infections, medical problems, multiple pregnancy and pregnancy loss.",
    "2026-08-03",
  ],
  [
    "acog-nutrition",
    "American College of Obstetricians and Gynecologists",
    "Healthy Eating During Pregnancy",
    "https://www.acog.org/womens-health/faqs/healthy-eating-during-pregnancy",
    ["general"],
    "Current page; date not stated",
    "annual",
    "Pregnancy nutrition, food variety and key nutrient context without rigid meal prescriptions.",
    "2026-08-03",
  ],
  [
    "acog-gestational-diabetes",
    "American College of Obstetricians and Gynecologists",
    "Gestational Diabetes",
    "https://www.acog.org/womens-health/faqs/gestational-diabetes",
    ["general"],
    "Current page; date not stated",
    "rapid-review",
    "Gestational-diabetes screening, monitoring, individual treatment and post-pregnancy follow-up.",
    "2026-08-03",
  ],
  [
    "acog-bleeding",
    "American College of Obstetricians and Gynecologists",
    "Bleeding During Pregnancy",
    "https://www.acog.org/womens-health/faqs/bleeding-during-pregnancy",
    ["general"],
    "Current page; date not stated",
    "rapid-review",
    "Bleeding and spotting context across pregnancy, including urgent associated symptoms and placental causes.",
    "2026-08-03",
  ],
  [
    "acog-cesarean",
    "American College of Obstetricians and Gynecologists",
    "Cesarean Birth",
    "https://www.acog.org/womens-health/faqs/cesarean-birth",
    ["general"],
    "Current page; date not stated",
    "rapid-review",
    "Reasons, preparation, anaesthesia, recovery and future-pregnancy considerations for caesarean birth.",
    "2026-08-03",
  ],
  [
    "acog-multiple-pregnancy",
    "American College of Obstetricians and Gynecologists",
    "Multiple Pregnancy",
    "https://www.acog.org/womens-health/faqs/multiple-pregnancy",
    ["general"],
    "Current page; date not stated",
    "rapid-review",
    "Chorionicity, monitoring, screening, growth, preterm birth and birth planning in multiple pregnancy.",
    "2026-08-03",
  ],
  [
    "acog-prenatal-care",
    "American College of Obstetricians and Gynecologists",
    "Prenatal Care",
    "https://www.acog.org/womens-health/faqs/prenatal-care",
    ["general"],
    "2025-04-01",
    "rapid-review",
    "What prenatal care includes and why visit, examination, blood, urine and ultrasound plans vary.",
    "2026-08-03",
  ],
  [
    "acog-genetic-screening",
    "American College of Obstetricians and Gynecologists",
    "Prenatal Genetic Screening Tests",
    "https://www.acog.org/womens-health/faqs/prenatal-genetic-screening-tests",
    ["general"],
    "Current page; date not stated",
    "rapid-review",
    "Blood and ultrasound screening choices, limitations and follow-up diagnostic testing.",
    "2026-08-03",
  ],
  [
    "acog-sleep",
    "American College of Obstetricians and Gynecologists",
    "Sleep Health and Disorders",
    "https://www.acog.org/womens-health/faqs/sleep-health-and-disorders",
    ["general"],
    "Current page; date not stated",
    "annual",
    "Insomnia, obstructive sleep apnoea, restless legs and reasons to discuss persistent sleep problems.",
    "2026-08-03",
  ],
  [
    "nhs-medicines",
    "National Health Service",
    "Medicines in pregnancy",
    "https://www.nhs.uk/pregnancy/keeping-well/medicines/",
    ["global", "uk"],
    "2025-09-23",
    "rapid-review",
    "Exact-product medicine review and the instruction not to stop prescribed treatment without clinical advice.",
    "2026-08-03",
  ],
  [
    "cdc-work-solvents",
    "US Centers for Disease Control and Prevention, NIOSH",
    "About Solvents and Reproductive Health",
    "https://www.cdc.gov/niosh/reproductive-health/prevention/solvents.html",
    ["general"],
    "2024-02-12",
    "annual",
    "Solvent identification, ventilation, skin and inhalation exposure, PPE and work-specific review.",
    "2026-08-03",
  ],
  [
    "cdc-work-hazardous-drugs",
    "US Centers for Disease Control and Prevention, NIOSH",
    "Hazardous Drugs Exposures in Healthcare",
    "https://www.cdc.gov/niosh/healthcare/hazardous-drugs/",
    ["general"],
    "2026-03-03",
    "rapid-review",
    "Healthcare exposure to chemotherapy and other hazardous drugs across preparation, administration, cleaning, laundry and waste tasks.",
    "2026-08-03",
  ],
  [
    "cdc-work-ppe",
    "US Centers for Disease Control and Prevention, NIOSH",
    "About Personal Protective Equipment",
    "https://www.cdc.gov/niosh/reproductive-health/about/ppe.html",
    ["general"],
    "2024-04-03",
    "annual",
    "Correct glove, respirator and protective-equipment selection and refitting during pregnancy.",
    "2026-08-03",
  ],
  [
    "cdc-pregnant-healthcare-workers",
    "US Centers for Disease Control and Prevention",
    "Special Populations: Pregnant Healthcare Personnel",
    "https://www.cdc.gov/infection-control/hcp/healthcare-personnel-epidemiology-control/pregnant-hcp.html",
    ["general"],
    "2025-01-08",
    "rapid-review",
    "Infection-control and occupational-health planning for pregnant healthcare personnel.",
    "2026-08-03",
  ],
  [
    "cdc-ionizing-radiation",
    "US Centers for Disease Control and Prevention",
    "About Ionizing Radiation",
    "https://www.cdc.gov/radiation-health/about/ionizing-radiation.html",
    ["general"],
    "2024-02-19",
    "annual",
    "Ionizing-radiation sources and the need to distinguish diagnostic, occupational and high-dose exposure.",
    "2026-08-03",
  ],
  [
    "who-maternal-2025",
    "World Health Organization",
    "WHO recommendations on maternal health, second edition",
    "https://www.who.int/publications/b/59332",
    ["global"],
    "2025",
    "rapid-review",
    "Current consolidated WHO recommendations for prevention, identification and management of maternal complications across pregnancy, birth and after birth.",
    "2026-08-03",
  ],
  [
    "who-disability-reproductive-health",
    "World Health Organization and United Nations Population Fund",
    "Promoting sexual and reproductive health for persons with disabilities",
    "https://www.who.int/publications/i/item/9789241598682",
    ["global"],
    "2009-01-01",
    "stable",
    "Equal reproductive-health needs, accessible information, supported decision-making and removal of service barriers for disabled people.",
    "2026-08-03",
  ],
  [
    "nhs-existing-conditions",
    "National Health Service",
    "Existing conditions and pregnancy",
    "https://www.nhs.uk/pregnancy/existing-health-conditions/",
    ["global", "uk"],
    "Current page; date not stated",
    "rapid-review",
    "Pregnancy planning and coordinated care for asthma, diabetes, epilepsy, heart disease, hypertension and other existing conditions.",
    "2026-08-03",
  ],
  [
    "acog-type1-type2-diabetes",
    "American College of Obstetricians and Gynecologists",
    "Pregnancy With Type 1 or Type 2 Diabetes",
    "https://www.acog.org/womens-health/faqs/pregnancy-with-type-1-or-type-2-diabetes",
    ["general"],
    "Current page; date not stated",
    "rapid-review",
    "Pregestational diabetes planning, monitoring, medicine coordination and pregnancy-specific care.",
    "2026-08-03",
  ],
  [
    "acog-preterm-labor",
    "American College of Obstetricians and Gynecologists",
    "Preterm Labor and Birth",
    "https://www.acog.org/womens-health/faqs/preterm-labor-and-birth",
    ["general"],
    "Current page; date not stated",
    "rapid-review",
    "Signs of preterm labour, immediate assessment, uncertainty about progression and individualized treatment planning.",
    "2026-08-03",
  ],
  [
    "acog-placenta-accreta",
    "American College of Obstetricians and Gynecologists",
    "Placenta Accreta Spectrum",
    "https://www.acog.org/clinical/clinical-guidance/obstetric-care-consensus/articles/2018/12/placenta-accreta-spectrum",
    ["general"],
    "2018-12-01",
    "rapid-review",
    "Specialist diagnosis, multidisciplinary planning and delivery-location needs when placenta accreta spectrum is suspected.",
    "2026-08-03",
  ],
  [
    "nhs-placenta-complications",
    "National Health Service",
    "Placenta complications",
    "https://www.nhs.uk/pregnancy/labour-and-birth/placenta-complications/",
    ["global", "uk"],
    "2026-06-01",
    "rapid-review",
    "Plain-language orientation to low-lying placenta, placenta praevia, placental abruption and retained placenta.",
    "2026-08-03",
  ],
  [
    "nhs-cholestasis",
    "National Health Service",
    "Itching and intrahepatic cholestasis of pregnancy",
    "https://www.nhs.uk/pregnancy/complications/itching-and-intrahepatic-cholestasis/",
    ["global", "uk"],
    "2026-03-01",
    "rapid-review",
    "Pregnancy itching that needs assessment, bile-acid testing and individualized monitoring and birth planning.",
    "2026-08-03",
  ],
  [
    "acog-pregnancy-loss-support",
    "American College of Obstetricians and Gynecologists",
    "Finding Emotional Support After Pregnancy Loss",
    "https://www.acog.org/womens-health/experts-and-stories/the-latest/finding-emotional-support-after-pregnancy-loss",
    ["general"],
    "2025-02-01",
    "annual",
    "Individual grief responses, partner differences and professional or peer support after miscarriage or stillbirth.",
    "2026-08-03",
  ],
  [
    "acog-stillbirth",
    "American College of Obstetricians and Gynecologists",
    "Stillbirth",
    "https://www.acog.org/womens-health/faqs/stillbirth",
    ["general"],
    "Current page; date not stated",
    "rapid-review",
    "Evaluation, communication, individualized bereavement care and planning after stillbirth.",
    "2026-08-03",
  ],
  [
    "acog-postpartum-birth-control",
    "American College of Obstetricians and Gynecologists",
    "Postpartum Birth Control",
    "https://www.acog.org/womens-health/faqs/postpartum-birth-control",
    ["general"],
    "Current page; date not stated",
    "rapid-review",
    "Contraception choices after birth, timing, feeding considerations and individual medical eligibility.",
    "2026-08-03",
  ],
  [
    "acog-breastfeeding-challenges",
    "American College of Obstetricians and Gynecologists",
    "Breastfeeding Challenges",
    "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2021/02/breastfeeding-challenges",
    ["general"],
    "2021-02-01",
    "rapid-review",
    "Assessment and support for pain, latch, engorgement, milk transfer and other feeding challenges.",
    "2026-08-03",
  ],
  [
    "cdc-safe-sleep",
    "US Centers for Disease Control and Prevention",
    "Providing Care for Babies to Sleep Safely",
    "https://www.cdc.gov/sudden-infant-death/sleep-safely/",
    ["general"],
    "2024-09-17",
    "annual",
    "Back sleeping, a firm flat surface, a clear sleep space and avoiding overheating and smoke exposure.",
    "2026-08-03",
  ],
  [
    "nhs-body-after-birth",
    "National Health Service",
    "Your body after the birth",
    "https://www.nhs.uk/pregnancy/labour-and-birth/your-body/",
    ["global", "uk"],
    "Current page; date not stated",
    "rapid-review",
    "Bleeding, perineal recovery, bladder and bowel changes, pelvic-floor recovery and reasons to contact postnatal care.",
    "2026-08-03",
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

const postpartumTopics = [
  {
    id: "recovery-vaginal-perineal",
    title: "Recovery after vaginal birth, tears or episiotomy",
    eyebrow: "Perineum, bleeding and comfort",
    summary:
      "Soreness, swelling, cramping and vaginal bleeding can change across the first weeks. Recovery should gradually become more manageable rather than demand silent endurance.",
    practicalSteps: [
      "Follow the wound-cleaning, pain-relief and activity plan given at discharge and check every medicine against your health and feeding plan.",
      "Use pads rather than internal products until postnatal care says healing is sufficient, and notice whether bleeding, smell, pain and swelling are improving.",
      "Ask for examination when pain prevents sitting, walking, sleeping or using the toilet; severe pain is not a test of resilience.",
    ],
    contactCare: [
      "Contact postnatal care for worsening pain, wound opening, bad-smelling discharge, feverishness, difficulty passing urine or stool, or bleeding that becomes heavier again.",
    ],
    urgent: [
      "Use urgent care for rapidly soaking pads, very large clots with weakness, fainting, severe pain, chest symptoms or feeling seriously unwell.",
    ],
    sourceIds: ["who-postnatal", "nhs-body-after-birth", "cdc-warning"],
    review: review("rapid-review"),
  },
  {
    id: "recovery-caesarean",
    title: "Recovery after caesarean birth",
    eyebrow: "Abdominal surgery and newborn care together",
    summary:
      "Caesarean recovery includes abdominal wound healing, vaginal bleeding, pain control, circulation, bowel and bladder recovery and caring for a baby at the same time.",
    practicalSteps: [
      "Use the individualized pain and wound plan, accept help for lifting and transport, and increase movement gradually without forcing a timetable.",
      "Ask how to get out of bed, cough, feed and hold the baby with less strain and when driving, lifting, exercise and sex can be reconsidered.",
      "Keep chronic-condition and clot-prevention instructions visible; do not skip prescribed treatment because attention has moved to the baby.",
    ],
    contactCare: [
      "Contact care for increasing wound redness, heat, swelling, discharge or opening; worsening abdominal pain; feverishness; difficult urination; or pain that is not controlled by the plan.",
    ],
    urgent: [
      "Use urgent care for heavy bleeding, fainting, chest pain, trouble breathing, one-sided leg swelling, collapse or a rapidly worsening condition.",
    ],
    sourceIds: ["acog-cesarean", "acog-postpartum", "cdc-warning"],
    review: review("rapid-review"),
  },
  {
    id: "pelvic-bladder-bowel",
    title: "Pelvic floor, bladder and bowel recovery",
    eyebrow: "Function deserves follow-up",
    summary:
      "Leaking, pelvic heaviness, painful bowel movements, numbness and difficulty controlling urine or stool are health concerns worth discussing, not an unavoidable price of birth.",
    practicalSteps: [
      "Ask for a pelvic-health assessment when symptoms affect walking, exercise, sex, sleep, work or confidence.",
      "Use gentle movement and the individualized pelvic-floor plan provided by care; more squeezing is not always the answer when muscles are painful or overactive.",
      "Keep fluids, fibre and prescribed bowel care realistic while wounds and medicines change comfort.",
    ],
    contactCare: [
      "Contact care for inability to pass urine, new loss of bladder or bowel control, severe pelvic pressure, worsening wound pain or constipation that is not responding to the plan.",
    ],
    urgent: [
      "Use urgent care for sudden leg weakness or numbness, loss of bladder or bowel control with severe back pain, collapse or other rapid neurological change.",
    ],
    sourceIds: ["nhs-body-after-birth", "acog-postpartum", "cdc-warning"],
    review: review(),
  },
  {
    id: "feeding-support",
    title: "Breast, chest, bottle and combination feeding support",
    eyebrow: "Feed the baby and support the parent",
    summary:
      "Feeding needs an observable plan for the baby’s intake and growth plus support for pain, milk transfer, preparation, parent health and informed choice.",
    practicalSteps: [
      "Ask someone skilled to observe a feed when latch, pain, swallowing, bottle pacing or milk transfer is uncertain.",
      "Know the baby’s follow-up weight and output plan and who to contact when feeds are too infrequent, exhausting or ineffective.",
      "Check medicines using the exact product and feeding context; do not stop necessary treatment or leave a baby unfed while seeking an idealized feeding plan.",
    ],
    contactCare: [
      "Contact feeding or newborn care promptly for persistent nipple or breast pain, feverishness, a hot red area, poor latch, reduced wet nappies, marked sleepiness or concern about intake.",
    ],
    urgent: [
      "Use urgent newborn care when the baby is difficult to wake, cannot feed, has breathing difficulty, appears dehydrated or seems seriously unwell.",
    ],
    sourceIds: [
      "who-feeding",
      "acog-breastfeeding-challenges",
      "who-newborn",
      "cdc-warning",
    ],
    review: review("rapid-review"),
  },
  {
    id: "mood-trauma-sleep",
    title: "Mood, birth trauma and severe sleep disruption",
    eyebrow: "Mental health is postnatal health",
    summary:
      "Mood can include joy, numbness, grief, anxiety, anger or disconnection. Persistent distress, traumatic memories, intrusive thoughts or inability to sleep even when there is an opportunity need support.",
    practicalSteps: [
      "Tell a health professional about past mental-health conditions, birth trauma, current medicines and the early signs that usually mean you are becoming unwell.",
      "Protect at least one practical route for rest and one person who can notice change without taking over your choices.",
      "Ask for debriefing, therapy, peer support or medicine review when the birth or postnatal period is difficult to process.",
    ],
    contactCare: [
      "Contact care for persistent low mood, panic, intrusive thoughts, frightening memories, severe irritability, inability to function or sleep that is not explained only by the baby waking.",
    ],
    urgent: [
      "Use emergency help for thoughts of harm, severe confusion, hallucinations, paranoia, extreme agitation or loss of contact with reality; do not stay alone.",
    ],
    sourceIds: ["who-postnatal", "acog-mental-health", "cdc-warning"],
    review: review("rapid-review"),
  },
  {
    id: "sex-contraception",
    title: "Sex, comfort and contraception after birth",
    eyebrow: "Consent and timing are personal; fertility can return",
    summary:
      "There is no required date for resuming sex. Comfort, desire, healing, contraception, infection risk, feeding, medicines and the birth experience all affect the plan.",
    practicalSteps: [
      "Choose postpartum contraception before it becomes urgent and review the exact method against health conditions, medicines, feeding and preferences.",
      "Resume sexual activity only with consent and comfort; use lubrication and slower pacing if dryness or tenderness is present.",
      "Ask for pelvic-health or trauma-informed support when pain, fear, leaking or pressure makes intimacy difficult.",
    ],
    contactCare: [
      "Contact care for persistent painful sex, bleeding that is more than light spotting, wound pain, bad-smelling discharge, coercion or concern that contraception failed.",
    ],
    urgent: [
      "Use emergency or confidential safety help for forced sex, immediate danger, severe bleeding, collapse or severe abdominal pain.",
    ],
    sourceIds: [
      "acog-postpartum-birth-control",
      "acog-postpartum",
      "nhs-body-after-birth",
      "acog-ipv",
    ],
    review: review("rapid-review"),
  },
  {
    id: "newborn-feeding-jaundice-temperature",
    title: "Newborn feeding, jaundice, temperature and alertness",
    eyebrow: "Notice the whole pattern",
    summary:
      "A newborn’s feeding, wet nappies, colour, temperature, breathing and alertness belong together. Young babies can deteriorate quickly, so a clear change deserves prompt assessment.",
    practicalSteps: [
      "Keep the newborn follow-up plan and know who checks weight, jaundice, feeding and screening results after discharge.",
      "Learn the measurement method and temperature thresholds given by local newborn care rather than relying on touch alone.",
      "Record feeds and wet nappies temporarily when care asks for it, but use the baby’s overall condition rather than one number in isolation.",
    ],
    contactCare: [
      "Contact newborn care promptly for deepening yellow colour, poor feeding, fewer wet nappies, repeated vomiting, unusual sleepiness or a baby who is becoming harder to settle or wake.",
    ],
    urgent: [
      "Use urgent care for breathing difficulty, blue or grey colour, abnormal temperature, seizure, limpness, inability to feed or a baby who seems seriously unwell.",
    ],
    sourceIds: ["who-newborn", "who-postnatal", "cdc-warning"],
    review: review("rapid-review"),
  },
  {
    id: "newborn-safe-sleep-home",
    title: "Safe sleep and the first weeks at home",
    eyebrow: "A simple sleep space and realistic support",
    summary:
      "Use a firm, flat infant sleep surface with a fitted sheet, place the baby on their back and keep pillows, loose bedding, toys, nests and positioners out of the sleep space.",
    practicalSteps: [
      "Keep the sleep space in the same room as the caregiver, avoid smoke exposure and prevent overheating.",
      "Plan how an exhausted caregiver can put the baby down safely before feeding begins, especially during night feeds.",
      "Ask for practical help with meals, chores and protected rest rather than using unsafe sleep products to solve exhaustion.",
    ],
    contactCare: [
      "Ask newborn care about reflux, noisy breathing, repeated choking or another concern before changing the sleep angle or adding a positioning product.",
    ],
    urgent: [
      "Use emergency care for breathing pauses, blue or grey colour, limpness, choking with inability to recover or a baby who cannot be woken normally.",
    ],
    sourceIds: ["cdc-safe-sleep", "aap-safe-sleep", "who-postnatal"],
    review: review(),
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

const postpartumDetails = {
  "birth-day": {
    summary: [
      "The first hours focus on stabilising the recovering parent, checking the newborn and supporting warmth, contact and feeding without pressure.",
      "Pain relief, bleeding, wounds, urination and any unexpected events should be explained before the care team steps away.",
      "Feeding support should respect the family's choice and include a practical plan for the next feed.",
    ],
    bodyMind: [
      "Observations after birth commonly include bleeding, pulse, blood pressure, temperature, uterine firmness, pain and any caesarean or perineal wound.",
      "A complicated, frightening or very different birth can take time to process. Ask for a plain-language explanation now and a later debrief if you want one.",
    ],
    baby: [
      "The newborn is checked for breathing, temperature, colour, tone and transition after birth; extra observation may be needed after prematurity, infection risk or medicines.",
      "Skin-to-skin contact can support warmth and connection when medically appropriate, but separation for care or not wanting it immediately is not a failure.",
    ],
    doNow: [
      "Ask what observations are being done, what is normal now and what would change the plan.",
      "Tell staff when pain, dizziness, nausea or bleeding changes rather than waiting for the next scheduled check.",
      "Confirm how to call for help before trying to stand, shower or lift the baby after anaesthesia, surgery or significant blood loss.",
    ],
    avoidAsk: [
      "Do not stand alone if your legs feel weak, numb or unsteady, and do not minimise soaking bleeding, faintness, chest pain or trouble breathing.",
      "Ask before giving the newborn anything not in the agreed feeding plan, including water, herbal products or another person's milk.",
    ],
    appointments: [
      "Before transfer or discharge, ask which parent and newborn checks remain, when results will return and who will explain them.",
    ],
    partner: [
      "Keep notes, protect consent and rest, bring water and food when allowed, and call staff promptly when either parent or baby changes.",
    ],
    topics: [
      "postpartum",
      "birth-recovery",
      "newborn-transition",
      "feeding-start",
      "consent",
    ],
    sourceIds: ["who-postnatal", "who-newborn", "acog-postpartum"],
  },
  "first-24-hours": {
    summary: [
      "Recovery during the first day includes safe movement, bladder function, bleeding, pain control, wound checks and rest.",
      "Newborn feeding, temperature, breathing, alertness and expected screening should be reviewed together.",
      "Discharge is a handoff: leave with warning signs, contacts and a concrete follow-up plan for both people.",
    ],
    bodyMind: [
      "Ask for help with the first walk or shower if you had an epidural, anaesthetic, surgery, tearing, heavy blood loss or ongoing dizziness.",
      "Difficulty passing urine, rapidly increasing pain, a severe headache, heavy bleeding or feeling suddenly unwell needs attention before discharge.",
    ],
    baby: [
      "Early feeds can be frequent and variable; support should look at positioning, transfer or intake, comfort and the baby's alertness rather than a single clock target.",
      "Ask which newborn examinations, screening tests, preventive medicines or vaccines are offered, and when results will be available.",
    ],
    doNow: [
      "Practise the feeding and soothing plan with someone watching so questions surface while help is present.",
      "Write down the parent and baby warning signs and the correct daytime, after-hours and emergency contacts.",
      "Arrange transport, medicines, food, sleep space and practical help before leaving care.",
    ],
    avoidAsk: [
      "Do not leave uncertainty about how much bleeding is too much, how wounds should be cared for or when the baby should next feed.",
      "Ask a clinician to review the exact pain medicines, doses and feeding context; do not combine products with overlapping ingredients.",
    ],
    appointments: [
      "Confirm the first parent contact, newborn assessment, feeding or weight follow-up, and any earlier review required by complications.",
    ],
    partner: [
      "Learn the discharge plan too, including safe sleep setup, medicine timing, feeding cues and who to call when the recovering parent is asleep.",
    ],
    topics: [
      "postpartum",
      "discharge",
      "mobility",
      "newborn-screening",
      "safe-sleep",
    ],
    sourceIds: [
      "who-postnatal",
      "who-newborn",
      "aap-safe-sleep",
      "acog-postpartum",
    ],
  },
  "days-2-3": {
    summary: [
      "Bleeding, breast or chest changes, after-pains, bowel and bladder function, sleep loss and emotion can all shift quickly on days two and three.",
      "The baby may feed very frequently; a feeding assessment should consider comfort, intake signs, output, weight context and alertness.",
      "Jaundice, poor feeding, unusual sleepiness, breathing difficulty or temperature concerns need newborn advice promptly.",
    ],
    bodyMind: [
      "Tearfulness and emotional sensitivity can appear during this transition, but panic, hopelessness, inability to sleep when given the chance or thoughts of harm need prompt help.",
      "Increasing wound pain, spreading redness, fever, foul-smelling discharge, worsening headache or heavy bleeding is not a normal price of recovery.",
    ],
    baby: [
      "Jaundice often appears as yellowing of the skin or eyes; its timing and severity need clinical assessment rather than comparison with photographs.",
      "Record feeds and wet or dirty nappies only as a practical memory aid, not a score of parenting success.",
    ],
    doNow: [
      "Use the scheduled early contact to discuss bleeding, pain, wounds, urination, bowel movements, mood and feeding.",
      "Ask someone to prepare food, refill water and manage messages while the parent feeds or rests.",
      "Place the baby on a separate, firm, flat sleep surface on their back for every sleep.",
    ],
    avoidAsk: [
      "Do not wait for a routine appointment if the baby is hard to wake, refuses feeds, struggles to breathe, has blue lips or feels unusually hot or cold.",
      "Ask before using nipple creams, herbal lactation products, laxatives or additional pain medicines because the exact product matters.",
    ],
    appointments: [
      "The early postnatal contact should include parent recovery and newborn feeding, weight and jaundice assessment, with a clear next review date.",
    ],
    partner: [
      "Take over household work and observe the whole situation: worsening pain, confusion, withdrawal or a baby becoming less alert all deserve action.",
    ],
    topics: [
      "postpartum",
      "day-three",
      "jaundice",
      "feeding-assessment",
      "baby-blues",
    ],
    sourceIds: [
      "who-postnatal",
      "who-newborn",
      "who-feeding",
      "aap-safe-sleep",
    ],
  },
  "days-4-7": {
    summary: [
      "The first week is for protecting recovery, checking feeding and weight in context, and noticing infection or mental-health warning signs.",
      "Bleeding should be discussed if it becomes heavier again, smells unpleasant, contains very large clots or comes with faintness or fever.",
      "A safe sleep space and a realistic night-care plan matter more than trying to establish a rigid newborn routine.",
    ],
    bodyMind: [
      "Perineal or caesarean wounds should be getting no worse; opening, discharge, spreading redness, fever or escalating pain needs review.",
      "Breast or chest redness, a painful hard area, fever or flu-like symptoms may need feeding support and clinical assessment without delay.",
    ],
    baby: [
      "Feeding effectiveness is judged with the baby's examination, weight pattern, output and behaviour—not by feed length alone.",
      "Keep the baby's face and head uncovered during sleep and avoid sofas or armchairs when an adult may fall asleep holding them.",
    ],
    doNow: [
      "Prepare one-handed food, drinks, medicines and care supplies where the parent usually rests.",
      "Ask for hands-on feeding help when there is pain, clicking, repeated slipping off, very long feeds or concern about intake.",
      "Choose one protected rest period and assign another adult to non-feeding care and household decisions.",
    ],
    avoidAsk: [
      "Do not dismiss intense sadness, panic, agitation, confusion or frightening thoughts as something every new parent must tolerate.",
      "Ask before restarting driving, strenuous exercise, tampons, penetrative sex or wound-submerging baths after complications or surgery.",
    ],
    appointments: [
      "At the one-week contact, bring unresolved discharge questions and ask what parent and newborn follow-up happens next.",
    ],
    partner: [
      "Create uninterrupted opportunities for sleep and food, screen visitors, clean feeding equipment as directed and make the call when help is needed.",
    ],
    topics: [
      "postpartum",
      "first-week",
      "wound-care",
      "mastitis",
      "newborn-weight",
    ],
    sourceIds: [
      "who-postnatal",
      "who-newborn",
      "who-feeding",
      "nice-postnatal",
    ],
  },
  "week-2": {
    summary: [
      "At two weeks, improvement may be uneven, but pain, mobility, wounds, bladder or bowel problems and feeding concerns should have an active plan.",
      "Mood symptoms that are intense, worsening or lasting beyond the brief early transition deserve assessment now.",
      "The baby's weight, feeding and alertness should be reviewed with a clinician rather than managed by repeated unsupervised changes.",
    ],
    bodyMind: [
      "Persistent urine leakage, difficulty emptying bladder or bowel, pelvic heaviness, severe constipation or pain that limits walking is worth raising early.",
      "Tell the care team if sleep is impossible even when the baby is settled, anxiety feels relentless or you feel detached, hopeless or unsafe.",
    ],
    baby: [
      "Ask how the baby's individual growth pattern will be followed and what feeding signs should trigger an earlier review.",
      "Short periods of awake, supervised tummy time can begin when the baby is ready; sleep remains flat on the back in a separate clear space.",
    ],
    doNow: [
      "List what has improved, what is unchanged and what is worse before the check-in.",
      "Ask for pelvic-health, wound, feeding or mental-health referral when a concern needs more than reassurance.",
      "Keep recovery tasks small: food, fluids, prescribed care, gentle movement and protected sleep.",
    ],
    avoidAsk: [
      "Do not use comparison with another parent's recovery to decide that a symptom is normal.",
      "Ask before changing prescribed treatment or starting supplements marketed for milk supply, mood, weight loss or healing.",
    ],
    appointments: [
      "Use the two-week contact to close loops on results, referrals, blood pressure or anaemia follow-up, wounds, feeding and mood.",
    ],
    partner: [
      "Ask specific questions—about pain, fear, sleep and feeling safe—then remove a concrete burden instead of waiting to be directed.",
    ],
    topics: [
      "postpartum",
      "week-two",
      "pelvic-health",
      "mood-check",
      "feeding-follow-up",
    ],
    sourceIds: [
      "who-postnatal",
      "who-newborn",
      "acog-postpartum",
      "nhs-mental",
    ],
  },
  "week-3": {
    summary: [
      "Week three is a deliberate mental-health checkpoint as support often decreases while sleep debt accumulates.",
      "Physical recovery still counts: ongoing bleeding, wound problems, headaches, pain, incontinence or bowel symptoms should not disappear behind baby care.",
      "A sustainable care rota should include protected rest and a route to urgent help at night.",
    ],
    bodyMind: [
      "Depression or anxiety can appear as dread, anger, numbness, guilt, panic, intrusive thoughts or feeling unable to cope—not only visible sadness.",
      "Confusion, hallucinations, extreme agitation, rapidly changing mood or unusual beliefs can be an emergency after birth and need immediate help.",
    ],
    baby: [
      "Periods of crying commonly increase over the early weeks; ask about feeding, illness and soothing when the pattern worries you.",
      "Put the baby somewhere safe and step away briefly if overwhelmed; never shake a baby, and call another adult when you are at your limit.",
    ],
    doNow: [
      "Name one person who can come now, one clinician to call, and one emergency route before a crisis happens.",
      "Review whether each caregiver is getting any uninterrupted sleep and change the rota if nobody is functioning safely.",
      "Share intrusive or frightening thoughts with a clinician; their presence does not by itself define intent, but they deserve assessment.",
    ],
    avoidAsk: [
      "Do not leave a parent alone with escalating confusion, suicidal thoughts, thoughts of harm or loss of contact with reality.",
      "Ask for same-day help when mental or physical symptoms are worsening, even if the standard appointment is weeks away.",
    ],
    appointments: [
      "Request an earlier postnatal or mental-health review if mood, anxiety, sleep or safety concerns cannot wait for the comprehensive visit.",
    ],
    partner: [
      "Treat a disclosure as health information: listen without judgement, stay present, contact care and reduce immediate demands.",
    ],
    topics: [
      "postpartum",
      "week-three",
      "postnatal-depression",
      "postpartum-psychosis",
      "crying",
    ],
    sourceIds: ["who-postnatal", "nhs-mental", "cdc-warning", "who-newborn"],
  },
  "weeks-4-6": {
    summary: [
      "The comprehensive postnatal review should cover physical recovery, mood, sleep, feeding, chronic conditions, relationships, contraception and future care.",
      "It is a planning visit, not a pass/fail inspection or automatic clearance for every activity.",
      "Bring the concerns most likely to be missed when the conversation focuses only on the baby.",
    ],
    bodyMind: [
      "Discuss bleeding, pain, wounds, pelvic floor, bladder and bowel function, headaches, blood pressure, anaemia risk, sleep and mental health.",
      "Sex may feel physically or emotionally different; contraception, comfort, consent, dryness, pain and trauma history can be discussed separately.",
    ],
    baby: [
      "Review feeding, growth, safe sleep, development, immunisation plans and who provides ongoing infant care.",
      "Ask what normal variation looks like and what specific change should prompt an earlier baby assessment.",
    ],
    doNow: [
      "Write a short agenda and put the most important concern first.",
      "Reconcile every prescription, over-the-counter medicine and supplement with the clinician and pharmacist.",
      "Make referrals and follow-up dates concrete before the visit ends.",
    ],
    avoidAsk: [
      "Do not assume the calendar alone makes heavy exercise, driving, penetration or lifting appropriate after pain, surgery, prolapse or other complications.",
      "Ask about pregnancy spacing and contraception before relying on periods or feeding as proof that pregnancy cannot occur.",
    ],
    appointments: [
      "The postnatal review should connect unresolved pregnancy complications with primary, specialist, pelvic-health or mental-health care.",
    ],
    partner: [
      "Help prepare the agenda, cover baby care during the visit and make sure the recovering parent's questions are answered in their own right.",
    ],
    topics: [
      "postpartum",
      "six-week-review",
      "contraception",
      "pelvic-floor",
      "chronic-care",
    ],
    sourceIds: [
      "acog-postpartum",
      "who-postnatal",
      "nice-postnatal",
      "cdc-medicine",
    ],
  },
  "weeks-7-8": {
    summary: [
      "At seven to eight weeks, ongoing pain, leakage, low mood or feeding difficulty still deserves treatment even if daily routines look more established.",
      "Return-to-work or caregiving plans should include feeding, transport, sleep, medicines, appointments and what happens when the baby is unwell.",
      "The two-month infant visit is a chance to review development, growth, feeding, safe sleep and preventive care.",
    ],
    bodyMind: [
      "Gradual movement can build confidence, but heaviness, bulging, leakage, bleeding or pain during activity is a reason for pelvic-health assessment.",
      "Identity, relationship and body changes can be difficult without meaning that gratitude or attachment is absent.",
    ],
    baby: [
      "At around two months, clinicians look at a range of social, movement, communication and learning skills in context.",
      "Vaccines and preventive care depend on the local clinical schedule; ask for the exact plan and expected after-care.",
    ],
    doNow: [
      "Test the practical work or care-day routine once before it becomes mandatory.",
      "Arrange a clinical review for symptoms that have plateaued rather than waiting indefinitely for spontaneous recovery.",
      "Keep safe sleep consistent across every caregiver and location.",
    ],
    avoidAsk: [
      "Do not return to high-impact exercise only because a generic programme labels this week as safe.",
      "Ask what to do after infant vaccination and which temperature or behaviour changes require care.",
    ],
    appointments: [
      "Bring parent concerns to your own clinician and infant concerns to the baby's visit; one appointment may not be designed to assess both fully.",
    ],
    partner: [
      "Own parts of the routine end to end—appointments, supplies, washing or night settling—so responsibility is shared, not merely tasks.",
    ],
    topics: [
      "postpartum",
      "two-months",
      "return-to-work",
      "exercise-return",
      "infant-vaccines",
    ],
    sourceIds: [
      "acog-postpartum",
      "cdc-milestones",
      "aap-safe-sleep",
      "who-postnatal",
    ],
  },
  "weeks-9-12": {
    summary: [
      "By three months, unresolved birth-related symptoms need an owner and follow-up rather than being normalised as permanent.",
      "Postnatal depression and anxiety can start any time in the first year; a later onset is still real and treatable.",
      "Feeding, sleep and contraception plans can be revised as needs change without framing the change as failure.",
    ],
    bodyMind: [
      "Seek review for persistent pelvic or back pain, incontinence, painful sex, prolapse symptoms, wound sensitivity or weakness that limits ordinary life.",
      "Ask about thyroid, anaemia, blood pressure or other medical causes when fatigue, racing heart, dizziness or low mood is marked or worsening.",
    ],
    baby: [
      "A baby's sleep and feeding pattern can change during growth and illness; use safe foundations rather than promises of a fixed schedule.",
      "Responsive talking, holding, floor play and noticing cues support development without turning every interaction into a lesson.",
    ],
    doNow: [
      "Check that every abnormal pregnancy or birth result has a documented follow-up plan.",
      "Revisit contraception if the initial method is unacceptable or no longer fits feeding, bleeding or health needs.",
      "Book care for symptoms that affect work, movement, sleep, sex or confidence.",
    ],
    avoidAsk: [
      "Do not stop prescribed mental-health, blood-pressure, thyroid or other treatment because pregnancy has ended without a clinician's plan.",
      "Ask for help with relationship conflict, isolation or unequal care work before resentment or exhaustion becomes a safety problem.",
    ],
    appointments: [
      "Use primary or specialist care to continue parent follow-up after routine maternity contacts end, and keep infant preventive visits separate.",
    ],
    partner: [
      "Notice the invisible planning load and take responsibility for recurring tasks, while continuing to check mood and safety directly.",
    ],
    topics: [
      "postpartum",
      "three-months",
      "late-onset-mood",
      "persistent-symptoms",
      "contraception-review",
    ],
    sourceIds: [
      "acog-postpartum",
      "who-postnatal",
      "nhs-mental",
      "cdc-milestones",
    ],
  },
  "month-3": {
    summary: [
      "Month three often brings another transition in work, care arrangements, feeding and sleep rather than a settled finish line.",
      "Parent recovery remains health care when pain, mood, continence, bleeding or chronic conditions interfere with life.",
      "The family plan should work on difficult days, not only when everyone is rested and the baby is well.",
    ],
    bodyMind: [
      "Build activity by function and symptoms, with pelvic-health or medical guidance when pain, pressure, leakage or unusual bleeding appears.",
      "Loneliness, loss of identity, anxiety about separation or returning to work can coexist with attachment to the baby and deserve support.",
    ],
    baby: [
      "Conversation, songs, face-to-face response and supervised floor time are simple ways to support connection and emerging skills.",
      "Avoid propping bottles or leaving a feeding baby unattended; positioning and feeding plans should match the baby's needs.",
    ],
    doNow: [
      "Map handoffs for medicines, feeds, safe sleep, emergency contacts and transport across caregivers.",
      "Protect recurring time for the parent's appointments, rehabilitation, sleep and non-care identity.",
      "Review whether equipment still fits and whether the baby's increasing movement changes home risks.",
    ],
    avoidAsk: [
      "Do not compare sleep, feeding, weight or development with social-media snapshots as a substitute for clinical context.",
      "Ask the baby's clinician before adding food, cereal or supplements solely to change sleep.",
    ],
    appointments: [
      "Keep the next infant preventive visit and any parent follow-up visible to every caregiver, including the questions each person wants answered.",
    ],
    partner: [
      "Make the return-to-work or care transition a shared operational plan, including nights, sick days, appointments and the recovering parent's care.",
    ],
    topics: [
      "postpartum",
      "month-three",
      "care-handoffs",
      "responsive-play",
      "parent-identity",
    ],
    sourceIds: [
      "who-postnatal",
      "who-newborn",
      "cdc-milestones",
      "acog-postpartum",
    ],
  },
  "month-4": {
    summary: [
      "At four months, development is observed across movement, communication, learning and social connection rather than one isolated trick.",
      "Safe sleep remains a firm, flat, separate space on the back even when sleep patterns change.",
      "Parent mental and physical health still belongs on the care agenda, including symptoms that first appear now.",
    ],
    bodyMind: [
      "A new increase in anxiety, low mood, rage, intrusive thoughts or sleep difficulty needs assessment even months after birth.",
      "Progressive strengthening should remain symptom-led; pain, pelvic pressure, leakage or bleeding is information to bring to a clinician.",
    ],
    baby: [
      "Offer supervised floor and tummy time while awake, talk back to sounds and make space for safe reaching and movement.",
      "If a skill is lost or you are concerned about hearing, vision, movement, feeding or interaction, raise it promptly rather than waiting for the next milestone list.",
    ],
    doNow: [
      "Move medicines, cords, hot drinks and small objects out of reach before rolling and grabbing become predictable.",
      "Review sleep spaces used by relatives or childcare, not only the main cot at home.",
      "Write down developmental observations and questions for the four-month visit.",
    ],
    avoidAsk: [
      "Do not use weighted sleep products, positioners or improvised padding to try to extend sleep.",
      "Ask about feeding readiness and individual growth rather than treating four months as a universal date to start solids.",
    ],
    appointments: [
      "The four-month development and preventive-care visit should include caregiver concerns, growth, feeding, sleep and the next-stage safety plan.",
    ],
    partner: [
      "Check every care setting for safe sleep and emerging mobility risks, and keep protecting the parent's time for recovery and health care.",
    ],
    topics: [
      "postpartum",
      "month-four",
      "safe-sleep",
      "rolling",
      "development-review",
    ],
    sourceIds: [
      "cdc-milestones",
      "aap-safe-sleep",
      "who-newborn",
      "acog-postpartum",
    ],
  },
  "month-5": {
    summary: [
      "Month five is a useful time to prepare for greater mobility and feeding changes without rushing either milestone.",
      "Readiness for complementary food is assessed in context; age alone is not the only signal.",
      "Persistent parent symptoms at five months are still worth diagnosis and treatment rather than acceptance.",
    ],
    bodyMind: [
      "Follow up ongoing pain, numbness, incontinence, prolapse symptoms, painful sex, low mood or exhaustion that is out of proportion to available sleep.",
      "Contraception needs can change with bleeding, feeding, side effects and future pregnancy plans; request a review if the method does not fit.",
    ],
    baby: [
      "Prepare a safe seated feeding setup and learn the difference between gagging and choking before complementary foods begin.",
      "Expect reaching, rolling or floor movement to make cords, falls, hot liquids, pets and small objects newly important hazards.",
    ],
    doNow: [
      "Ask the baby's clinician about readiness, allergens, textures, iron-rich foods and choking prevention before starting solids.",
      "Get onto the floor and inspect each regular care space from the baby's reach level.",
      "Book overdue parent dental, primary, pelvic-health or mental-health care rather than waiting for the infant schedule to become quieter.",
    ],
    avoidAsk: [
      "Do not put cereal or food in a bottle unless a clinician has given a specific medical plan.",
      "Ask before using herbal teething products, numbing gels, supplements or non-prescribed medicines for the baby.",
    ],
    appointments: [
      "Prepare feeding, mobility and development questions for the six-month review and confirm the continuing parent-care route.",
    ],
    partner: [
      "Lead the home-safety sweep and learn the feeding plan and choking response rather than leaving the transition to one caregiver.",
    ],
    topics: [
      "postpartum",
      "month-five",
      "solids-readiness",
      "home-safety",
      "persistent-recovery",
    ],
    sourceIds: [
      "who-feeding",
      "cdc-milestones",
      "who-newborn",
      "acog-postpartum",
    ],
  },
  "month-6": {
    summary: [
      "At six months, review development, growth, feeding, safe mobility and preventive care while continuing to treat parent health as its own priority.",
      "Complementary foods add to milk feeding and should progress with safe textures, variety and responsive cues.",
      "The end of this guide's timeline is a handoff to ongoing parent and child care, not the end of recovery or questions.",
    ],
    bodyMind: [
      "Review chronic conditions and pregnancy complications with primary or specialist care because some affect long-term cardiovascular, metabolic or mental health.",
      "Pelvic floor, abdominal wall, scar, pain, sexual-health and mood concerns can still improve with appropriate assessment and treatment.",
    ],
    baby: [
      "The six-month review looks at skills across domains and should include any loss of skills or caregiver concern, even if a checklist appears reassuring.",
      "Offer developmentally suitable textures and iron-rich foods with close upright supervision; continue the milk-feeding plan recommended for the baby.",
    ],
    doNow: [
      "Bring a concise list of development, feeding, sleep, hearing, vision and movement observations to the infant visit.",
      "Confirm vaccines, dental guidance, medicines, emergency contacts and the next preventive appointment.",
      "Create a written parent follow-up plan for unresolved birth recovery, chronic disease, mental health, contraception and future pregnancy preparation.",
    ],
    avoidAsk: [
      "Do not use milestone attainment to dismiss a specific concern or loss of a previously used skill.",
      "Ask for individual guidance on choking hazards, allergens, drink choices and food texture rather than copying a rigid menu from social media.",
    ],
    appointments: [
      "Leave the six-month transition with named clinicians and dates for both ongoing infant preventive care and any parent health follow-up.",
    ],
    partner: [
      "Share feeding, safety, appointments and night care while actively supporting the parent's long-term health plan beyond maternity services.",
    ],
    topics: [
      "postpartum",
      "month-six",
      "complementary-feeding",
      "long-term-parent-health",
      "care-handoff",
    ],
    sourceIds: [
      "who-feeding",
      "cdc-milestones",
      "acog-postpartum",
      "who-postnatal",
    ],
  },
};

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
      summary: postpartumDetails[slug].summary,
      bodyMind: postpartumDetails[slug].bodyMind,
      baby: postpartumDetails[slug].baby,
      doNow: postpartumDetails[slug].doNow,
      avoidAsk: postpartumDetails[slug].avoidAsk,
      appointments: postpartumDetails[slug].appointments,
      partner: postpartumDetails[slug].partner,
      topics: postpartumDetails[slug].topics,
      audiences: ["parent", "partner", "browsing"],
      helpTier: ordinal <= 7 ? "care-team" : "common",
      sourceIds: postpartumDetails[slug].sourceIds,
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
  {
    id: "health-conditions-accessibility",
    slug: "health-conditions-accessibility",
    number: 15,
    title: "Health conditions, disability and access needs",
    eyebrow: "Coordinate care around the whole person",
    intro:
      "A long-term condition or disability does not reduce your right to clear, respectful pregnancy care. The useful plan connects maternity care with the clinicians, medicines, equipment, communication support and everyday access you already rely on.",
    dos: [
      "Bring a current condition, medicine, allergy, specialist and equipment list to pregnancy care and agree who coordinates changes.",
      "Ask for information in the format you use, enough appointment time, physical access, an interpreter or communication support when needed.",
      "Keep treatment monitoring and ordinary specialist follow-up unless the responsible clinicians make a pregnancy-specific plan.",
      "Write down what a flare, seizure, breathing change, glucose problem or other deterioration looks like for you and which service to contact.",
    ],
    donts: [
      "Do not stop prescribed treatment, mobility aids, respiratory support or mental-health care because pregnancy began.",
      "Do not let every new symptom be dismissed as either pregnancy or your existing condition without appropriate assessment.",
      "Do not accept inaccessible examinations or communication when a reasonable adjustment can make care usable.",
      "Do not assume a diagnosis determines the birth method; the current condition, pregnancy and available support all matter.",
    ],
    askDoctor: [
      "Ask who will coordinate maternity and specialist care, how results are shared and which changes require same-day or urgent contact.",
      "Ask for an exact medicine, monitoring and equipment plan rather than general reassurance that a condition is controlled.",
      "Ask for an access plan covering transfers, positioning, sensory needs, communication, support people and recovery after birth.",
    ],
    examples: [
      {
        name: "Type 1 or type 2 diabetes before pregnancy",
        status: "check-first",
        guidance:
          "Arrange coordinated diabetes and maternity care promptly; pregnancy can change glucose targets, medicine needs, eye or kidney monitoring and scan plans.",
      },
      {
        name: "Epilepsy or a seizure disorder",
        status: "check-first",
        guidance:
          "Continue prescribed treatment until specialist review and ask for a written plan for medicines, folic acid, seizures, sleep and urgent help.",
      },
      {
        name: "Heart, kidney or autoimmune disease",
        status: "check-first",
        guidance:
          "Ask for early specialist coordination because the condition, organ function, antibodies, medicines and pregnancy monitoring all affect the plan.",
      },
      {
        name: "Physical, sensory, learning or communication disability",
        status: "generally-ok",
        guidance:
          "Pregnancy care should be accessible and support your own consent; request the adjustments, equipment and communication format that make care usable.",
      },
      {
        name: "Eating disorder or highly restricted intake",
        status: "check-first",
        guidance:
          "Ask for nonjudgmental maternity, nutrition and mental-health support before symptoms or food rules make eating, monitoring or appointments harder.",
      },
    ],
    sourceIds: [
      "who-maternal-2025",
      "who-disability-reproductive-health",
      "nhs-existing-conditions",
      "acog-type1-type2-diabetes",
      "cdc-medicine",
    ],
    review: review("rapid-review"),
  },
  {
    id: "pregnancy-complications",
    slug: "pregnancy-complications",
    number: 16,
    title: "Complications and specialist care",
    eyebrow: "Understand the finding and the next decision",
    intro:
      "A complication label is the start of an individualized plan, not a complete prognosis. Ask what was found, how certain it is, what is being monitored, which symptoms change the urgency and where the right level of care is available.",
    dos: [
      "Ask for the exact finding in writing, including the pregnancy week, measurements, uncertainty and planned follow-up.",
      "Keep a short record of appointments, results, medicines, symptoms and the service to contact between visits.",
      "Ask what the plan is trying to prevent or detect and what would change monitoring, treatment, transfer or birth timing.",
      "Request an interpreter, extra decision time or a second specialist discussion when information is difficult to absorb.",
    ],
    donts: [
      "Do not treat one scan phrase, laboratory value or risk percentage as a diagnosis or fixed outcome by itself.",
      "Do not start bed rest, aspirin, supplements or another treatment unless the responsible clinician recommends it for your case.",
      "Do not miss urgent symptoms because a complication is already being monitored routinely.",
      "Do not assume a planned birth date is fixed when new maternal or fetal information may change the balance.",
    ],
    askDoctor: [
      "Ask what is known, what remains uncertain, which alternative explanations were considered and when the next result should arrive.",
      "Ask whether a maternal–fetal medicine, anaesthesia, neonatal or other specialist discussion would help before a decision is urgent.",
      "Ask which bleeding, pain, contractions, fluid loss, movement change, headache, vision change or breathing symptom needs immediate assessment.",
    ],
    examples: [
      {
        name: "Low-lying placenta or placenta praevia",
        status: "check-first",
        guidance:
          "Ask how close the placenta is to the cervix, when it will be rechecked, what bleeding requires urgent care and how the location may affect birth planning.",
      },
      {
        name: "Suspected placenta accreta spectrum",
        status: "check-first",
        guidance:
          "Early specialist referral and multidisciplinary birth planning matter; ask about diagnostic uncertainty, delivery location, blood support and who coordinates the team.",
      },
      {
        name: "Baby measuring small or fetal growth restriction",
        status: "check-first",
        guidance:
          "Ask which measurements are concerning, whether blood-flow or fluid monitoring is needed and what findings would change surveillance or birth timing.",
      },
      {
        name: "Contractions, pressure or fluid loss before 37 weeks",
        status: "avoid",
        guidance:
          "Do not wait for a routine visit; contact maternity assessment immediately because preterm labour cannot be confirmed or excluded from symptoms alone.",
      },
      {
        name: "Persistent itching or possible cholestasis",
        status: "check-first",
        guidance:
          "Contact pregnancy care for assessment, especially for itching of the palms or soles; diagnosis and planning depend on symptoms, blood tests and pregnancy week.",
      },
    ],
    sourceIds: [
      "who-maternal-2025",
      "acog-bleeding",
      "acog-placenta-accreta",
      "nhs-placenta-complications",
      "acog-preterm-labor",
      "nhs-cholestasis",
    ],
    review: review("rapid-review"),
  },
  {
    id: "loss-uncertainty-support",
    slug: "loss-uncertainty-support",
    number: 17,
    title: "Loss, uncertainty and bereavement",
    eyebrow: "Clear information without blame",
    intro:
      "Uncertain scans, pregnancy loss and bereavement need direct clinical explanations and care that respects different emotional, cultural and practical needs. Grief can include sadness, anger, numbness, relief or changing feelings; there is no required way to respond.",
    dos: [
      "Ask what is confirmed, what remains uncertain, which test or time interval could clarify it and when you will receive results.",
      "Ask for written physical-recovery instructions, expected bleeding or pain, an urgent contact route and follow-up of any tests.",
      "Choose whether you want a support person, private time, memory-making, spiritual care, peer support or counselling.",
      "Tell care promptly when grief, anxiety, sleep or intrusive thoughts make daily life or safety difficult.",
    ],
    donts: [
      "Do not blame exercise, ordinary stress, sex or one everyday action for a loss without clinical evidence.",
      "Do not let pressure from relatives or staff decide how you name, remember, disclose or grieve the pregnancy.",
      "Do not leave without knowing who will explain pathology, genetic or placental results and what unanswered results mean.",
      "Do not wait alone with thoughts of self-harm, severe confusion or loss of contact with reality.",
    ],
    askDoctor: [
      "Ask which physical symptoms after the loss need same-day or emergency care and how pain and bleeding should be managed.",
      "Ask when follow-up is planned, what results may inform future pregnancy and whether specialist or genetic counselling is relevant.",
      "Ask for support that includes the pregnant person, partner or family without assuming everyone grieves in the same way.",
    ],
    examples: [
      {
        name: "Early scan that is not yet conclusive",
        status: "check-first",
        guidance:
          "Ask what was visible, whether dates could explain uncertainty, when repeat testing is appropriate and which pain, bleeding or faintness needs urgent care.",
      },
      {
        name: "Miscarriage diagnosis and management choices",
        status: "check-first",
        guidance:
          "Ask for the available options, expected course, pain and bleeding plan, follow-up and urgent thresholds; the right choice depends on clinical findings and your preferences.",
      },
      {
        name: "Pregnancy after a previous loss",
        status: "check-first",
        guidance:
          "Ask what monitoring is medically useful and what emotional support would help; reassurance needs can be real even when extra testing is not indicated.",
      },
      {
        name: "Stillbirth or later pregnancy loss",
        status: "check-first",
        guidance:
          "Request clear communication, individualized birth and bereavement choices, physical follow-up and a planned conversation about test results and future care.",
      },
      {
        name: "Partners grieving differently",
        status: "generally-ok",
        guidance:
          "Different timing and expression of grief are common; make room for each person while seeking help when distress, conflict or isolation is becoming unmanageable.",
      },
    ],
    sourceIds: [
      "acog-pregnancy-loss-support",
      "acog-stillbirth",
      "acog-postpartum",
      "acog-mental-health",
      "cdc-warning",
    ],
    review: review("rapid-review"),
  },
  {
    id: "birth-newborn-preparation",
    slug: "birth-newborn-preparation",
    number: 18,
    title: "Birth and newborn preparation",
    eyebrow: "Prepare for decisions, not a perfect script",
    intro:
      "Useful preparation covers communication, consent, pain options, possible changes, parent recovery and the baby’s first care. A flexible plan helps you ask better questions without promising that birth will follow one route.",
    dos: [
      "Write short preferences for communication, consent, support people, pain relief, feeding support and newborn care.",
      "Ask what the planned birth setting can provide and how transfer, urgent theatre, blood or neonatal care would work if needed.",
      "Learn the first recovery and newborn checks before labour so unexpected monitoring or support is easier to understand.",
      "Prepare practical help for meals, transport, sleep, wound or perineal care, feeding and follow-up after discharge.",
    ],
    donts: [
      "Do not treat a birth preference as consent for every later procedure; each material change still needs explanation and agreement when possible.",
      "Do not assume feeding success or difficulty reflects effort, attachment or worth; ask early for skilled assessment.",
      "Do not use positioners, pillows, nests or inclined products as a newborn sleep surface.",
      "Do not let the baby’s appointments replace follow-up for the recovering parent.",
    ],
    askDoctor: [
      "Ask how induction, assisted birth, caesarean birth, pain relief and urgent changes are discussed in your planned setting.",
      "Ask which newborn medicines, screening, feeding checks and follow-up are offered and how choices are documented.",
      "Ask for separate urgent routes for the recovering parent and the newborn before leaving the birth setting.",
    ],
    examples: [
      {
        name: "A one-page birth preference note",
        status: "generally-ok",
        guidance:
          "Keep it short and flexible: communication, consent, support, pain relief, feeding and newborn priorities are more useful than a fixed sequence.",
      },
      {
        name: "Possible caesarean or assisted birth",
        status: "check-first",
        guidance:
          "Ask what might make it advisable, how consent and anaesthesia work, what recovery differs and how support or feeding can continue afterward.",
      },
      {
        name: "Feeding plan and early support",
        status: "generally-ok",
        guidance:
          "State your preference and ask who assesses positioning, milk transfer, bottle feeding, pain or supplementation when the first plan needs help.",
      },
      {
        name: "Newborn sleep space",
        status: "generally-ok",
        guidance:
          "Prepare a firm, flat sleep surface with a fitted sheet and no pillows, loose bedding, bumpers, toys or positioners.",
      },
      {
        name: "Possible preterm birth or neonatal admission",
        status: "check-first",
        guidance:
          "Ask which neonatal services are available, when transfer may be recommended and how parents can receive updates, participate in care and get feeding support.",
      },
    ],
    sourceIds: [
      "who-postnatal",
      "acog-labour-birth",
      "acog-cesarean",
      "acog-breastfeeding-challenges",
      "cdc-safe-sleep",
      "who-newborn",
    ],
    review: review("rapid-review"),
  },
];

const findingSectionMetadata = {
  "food-dishes": {
    recordType: "food",
    decisionFactors: [
      "Whether every ingredient is pasteurised or cooked through",
      "How the food was chilled, stored, handled and reheated",
      "The exact species, product label, recall or contamination warning",
    ],
  },
  "drinks-caffeine": {
    recordType: "drink",
    decisionFactors: [
      "The exact ingredients and caffeine or alcohol shown on the label",
      "Serving size and what else you have had across the whole day",
      "Whether vomiting, diabetes, dehydration or another condition changes the plan",
    ],
  },
  "exercise-movement": {
    recordType: "activity",
    decisionFactors: [
      "Your previous experience, current pregnancy and any clinical restriction",
      "Fall, collision, overheating, altitude and breath-holding risk",
      "Pain, bleeding, dizziness, contractions, fluid loss or breathlessness during activity",
    ],
  },
  "medicines-supplements": {
    recordType: "medicine",
    decisionFactors: [
      "The exact active ingredient, strength, dose, route and formulation",
      "Why you use it, how often, and the pregnancy week or exposure date",
      "Other prescriptions, non-prescription products, supplements and health conditions",
    ],
  },
  "everyday-home": {
    recordType: "home-exposure",
    decisionFactors: [
      "The exact product, task, temperature, duration and ventilation",
      "Whether exposure is through breathing, swallowing, skin contact or injury",
      "Any label warning, spill, symptoms or repeated occupational-level exposure",
    ],
  },
  "work-lifting": {
    recordType: "work-exposure",
    decisionFactors: [
      "The named chemical, biological, radiation, physical or scheduling hazard",
      "How often and how much exposure occurs, including spills and take-home residue",
      "Engineering controls, task changes and correctly fitted PPE available at work",
    ],
  },
  travel: {
    recordType: "travel",
    decisionFactors: [
      "Destination, pregnancy week, journey length and distance from maternity care",
      "Infection, altitude, heat, food, water and blood-clot risks for that trip",
      "Current symptoms, pregnancy complications, insurance and transport restrictions",
    ],
  },
  "sex-relationships": {
    recordType: "sexual-health",
    decisionFactors: [
      "Consent, comfort, infection exposure and the activity involved",
      "Bleeding, pain, fluid loss, placenta or preterm-birth concerns",
      "Any individual restriction or treatment plan from maternity care",
    ],
  },
  "sleep-comfort": {
    recordType: "sleep",
    decisionFactors: [
      "Pregnancy week, sleep position and what wakes or limits you",
      "Snoring, breathing pauses, restless legs, pain, reflux or severe daytime sleepiness",
      "The exact pillow, device, medicine, supplement or remedy being considered",
    ],
  },
  "appointments-warning-signs": {
    recordType: "test-or-decision",
    decisionFactors: [
      "Whether this is screening, diagnosis, monitoring, treatment or birth planning",
      "Pregnancy week, previous results and what the result could change",
      "Benefits, limits, alternatives, follow-up and the time available to decide",
    ],
  },
  "common-symptoms": {
    recordType: "symptom",
    decisionFactors: [
      "When it began, whether it is worsening, and how it affects eating, sleep or activity",
      "Severity, pattern, one-sided symptoms and accompanying bleeding, fever or fluid loss",
      "Pregnancy week, baby movement and relevant conditions or medicines",
    ],
  },
  "dental-skin-personal-care": {
    recordType: "personal-care",
    decisionFactors: [
      "The exact ingredient, procedure, body area, amount and frequency",
      "Whether treatment is medically needed or can reasonably be postponed",
      "Skin damage, infection, fumes, heat, radiation and medicines used with the procedure",
    ],
  },
  "infections-vaccinations": {
    recordType: "infection",
    decisionFactors: [
      "The named infection or vaccine and the date and closeness of exposure",
      "Symptoms, vaccination or immunity history, pregnancy week and test results",
      "Work, household, travel or outbreak context and the time-sensitive options available",
    ],
  },
  "mental-health-safety": {
    recordType: "mental-health",
    decisionFactors: [
      "How long the change has lasted and how it affects sleep, eating, self-care and safety",
      "Past diagnoses, trauma, treatment response, medicines and relapse warning signs",
      "Privacy, practical support, coercion, immediate danger and who can stay with you",
    ],
  },
  "health-conditions-accessibility": {
    recordType: "health-condition",
    decisionFactors: [
      "The exact diagnosis, current control, organ function and usual signs of deterioration",
      "Every medicine, device, specialist and monitoring plan already in use",
      "Communication, mobility, sensory, examination and support adjustments needed for usable care",
    ],
  },
  "pregnancy-complications": {
    recordType: "complication",
    decisionFactors: [
      "The exact finding, pregnancy week, measurements, symptoms and diagnostic certainty",
      "Maternal health, fetal growth or wellbeing and how each is changing over time",
      "Available specialist care, monitoring, treatment, transfer and birth-timing options",
    ],
  },
  "loss-uncertainty-support": {
    recordType: "loss-support",
    decisionFactors: [
      "What has been confirmed, what remains uncertain and when follow-up can clarify it",
      "Bleeding, pain, infection, faintness and other physical recovery or urgent-care needs",
      "Personal, cultural, spiritual, partner, family and mental-health support preferences",
    ],
  },
  "birth-newborn-preparation": {
    recordType: "birth-preparation",
    decisionFactors: [
      "Pregnancy history, current findings and the capabilities of the planned birth setting",
      "Consent, communication, pain relief, support, feeding and newborn-care preferences",
      "How an urgent change, caesarean birth, preterm birth or neonatal admission would be handled",
    ],
  },
};

const findingCareNotes = {
  "generally-ok":
    "This is a general pregnancy baseline, not personal clearance. Change course and ask for advice if symptoms, complications or an individual care plan make the situation different.",
  avoid:
    "Choose a lower-risk alternative when possible. If the exposure already happened, record the product, amount, timing and symptoms and ask for advice instead of assuming harm.",
  "check-first":
    "Check the exact item or situation with a doctor, midwife, pharmacist or relevant clinician; the name of a broad category is not enough for a personal decision.",
  "contact-care":
    "Contact your doctor or maternity service promptly and describe the timing, severity, associated symptoms and pregnancy week so they can choose the right assessment.",
  urgent:
    "Use urgent maternity or emergency care now. This guide cannot determine the cause or confirm that it is safe to wait.",
};

const findingIntentsByRecordType = {
  food: ["eat-drink"],
  drink: ["eat-drink"],
  activity: ["do-use"],
  medicine: ["do-use", "test-care"],
  "home-exposure": ["do-use", "work-home"],
  "work-exposure": ["work-home"],
  travel: ["do-use"],
  "sexual-health": ["do-use", "symptom-support"],
  sleep: ["do-use", "symptom-support"],
  "test-or-decision": ["test-care"],
  symptom: ["symptom-support"],
  "personal-care": ["do-use"],
  infection: ["symptom-support", "test-care"],
  "mental-health": ["symptom-support"],
  "health-condition": ["test-care", "symptom-support"],
  complication: ["test-care", "symptom-support"],
  "loss-support": ["symptom-support", "test-care"],
  "birth-preparation": ["plan-birth"],
};

const careTierByStatus = {
  "generally-ok": "common",
  avoid: "common",
  "check-first": "care-team",
  "contact-care": "care-team",
  urgent: "urgent",
};

const finding = (
  id,
  sectionId,
  title,
  aliases,
  status,
  priority,
  summary,
  details,
  sourceIds,
  volatility = "annual",
) => {
  const normalizedSectionId =
    {
      "dental-skin": "dental-skin-personal-care",
      "infections-vaccines": "infections-vaccinations",
      "mental-health": "mental-health-safety",
    }[sectionId] ?? sectionId;
  const metadata = findingSectionMetadata[normalizedSectionId];
  if (!metadata) throw new Error(`Missing finding metadata for ${sectionId}`);
  return {
    id,
    sectionId: normalizedSectionId,
    recordType: metadata.recordType,
    stage: "pregnancy",
    intents: findingIntentsByRecordType[metadata.recordType],
    title,
    aliases,
    status,
    priority,
    summary,
    details,
    decisionFactors: metadata.decisionFactors,
    careNote: findingCareNotes[status],
    careTier: careTierByStatus[status],
    relatedIds: [],
    sourceIds,
    review: review(volatility),
  };
};

const findingSlug = (value) =>
  value
    .normalize("NFKD")
    .replace(/[’']/g, "")
    .replace(/&/g, " and ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "note";

const findingOverrides = {
  "health-conditions-accessibility-type-1-or-type-2-diabetes-before-pregnancy":
    {
      aliases: [
        "type 1 diabetes",
        "type 2 diabetes",
        "diabetes before pregnancy",
        "pre-existing diabetes pregnancy",
      ],
    },
  "health-conditions-accessibility-wheelchair-mobility-transfers": {
    aliases: [
      "wheelchair",
      "wheelchair pregnancy",
      "mobility aid pregnancy",
      "accessible maternity care",
    ],
  },
  "pregnancy-complications-low-lying-placenta-or-placenta-praevia": {
    aliases: [
      "placenta previa",
      "placenta praevia",
      "low lying placenta",
      "placenta near cervix",
    ],
  },
  "pregnancy-complications-persistent-itching-or-possible-cholestasis": {
    aliases: [
      "itchy palms",
      "itchy feet pregnancy",
      "cholestasis pregnancy",
      "ICP pregnancy",
    ],
  },
  "loss-uncertainty-support-early-scan-that-is-not-yet-conclusive": {
    aliases: [
      "inconclusive scan",
      "pregnancy of uncertain viability",
      "too early to see heartbeat",
      "repeat early scan",
    ],
  },
  "birth-newborn-preparation-a-one-page-birth-preference-note": {
    aliases: [
      "birth preferences",
      "birth plan",
      "labour preferences",
      "one page birth plan",
    ],
  },
  "birth-newborn-preparation-newborn-sleep-space": {
    aliases: [
      "safe sleep space",
      "baby sleep space",
      "newborn cot setup",
      "newborn bassinet setup",
    ],
  },
  "everyday-home-hot-tub-or-sauna": {
    aliases: [
      "hot tub",
      "hot tubs",
      "jacuzzi",
      "sauna",
      "steam room",
      "thermal spa",
      "thermal bath",
    ],
    priority: "P0",
    summary:
      "Avoid hot tubs, Jacuzzis, saunas and steam rooms during pregnancy because they can raise core temperature and make fainting or dehydration more likely.",
    details: [
      "A comfortably warm bath is different from sitting in a high-heat environment. Leave any heat exposure immediately if you feel hot, dizzy, faint, sick or unwell.",
      "If an exposure already happened, it does not show by itself that harm occurred. Note when and for how long it happened and discuss the concern with your doctor or midwife.",
    ],
    sourceIds: ["acog-heat"],
  },
  "exercise-movement-hot-yoga-hot-pilates-and-extreme-heat-workouts": {
    aliases: ["hot yoga", "hot pilates", "heated workout", "exercise in heat"],
    priority: "P0",
  },
  "travel-long-flight": {
    aliases: ["long flight", "flying pregnant", "air travel", "plane journey"],
    priority: "P0",
  },
  "common-symptoms-vomiting-with-very-little-urination-or-increasing-weakness":
    {
      aliases: [
        "hyperemesis",
        "severe morning sickness",
        "cannot keep fluids down",
        "dehydration",
      ],
      priority: "P0",
    },
};

const baselineFindings = essentials.flatMap((section) =>
  section.examples.map((example, exampleIndex) => {
    const id = `${findingSlug(section.slug)}-${findingSlug(example.name)}`;
    const override = findingOverrides[id] ?? {};
    return finding(
      id,
      section.id,
      example.name,
      override.aliases ?? [example.name, `${example.name} in pregnancy`],
      example.status,
      override.priority ?? "baseline",
      override.summary ?? example.guidance,
      override.details ?? [
        example.status === "generally-ok"
          ? `Treat “${example.name}” as generally okay only when it matches the preparation, amount and health context described here. ${section.dos[exampleIndex % section.dos.length]}`
          : example.status === "avoid"
            ? `For “${example.name},” use the lower-exposure choice instead of trying to cancel the exposure afterward. ${section.donts[exampleIndex % section.donts.length]}`
            : `Bring the exact label, ingredients, preparation method or situation for “${example.name}” when asking for advice. ${section.askDoctor[exampleIndex % section.askDoctor.length]}`,
      ],
      override.sourceIds ?? section.sourceIds,
      section.review.volatility,
    );
  }),
);

const expandedFindings = [
  finding(
    "food-dishes-smoked-seafood",
    "food-dishes",
    "Smoked salmon and refrigerated smoked seafood",
    ["smoked salmon", "smoked trout", "lox", "refrigerated smoked fish"],
    "check-first",
    "P1",
    "Cold-smoked or refrigerated ready-to-eat seafood needs a more careful check than fish cooked until hot.",
    [
      "Check how the fish was processed, stored and whether local guidance recommends cooking it. A cooked dish that is hot throughout is easier to assess than a chilled ready-to-eat product.",
    ],
    ["cdc-food", "nhs-food"],
    "rapid-review",
  ),
  finding(
    "food-dishes-raw-shellfish-ceviche",
    "food-dishes",
    "Raw shellfish, oysters and ceviche",
    ["raw shellfish", "oysters", "ceviche", "raw mussels", "raw clams"],
    "avoid",
    "P0",
    "Avoid raw shellfish and seafood cured only with citrus or marinade; choose seafood cooked thoroughly.",
    [
      "Lemon, lime, salt, smoking or marinating does not reliably replace cooking. Ask how the seafood was prepared rather than relying on the dish name.",
    ],
    ["cdc-food", "nhs-food"],
    "rapid-review",
  ),
  finding(
    "food-dishes-tuna-species",
    "food-dishes",
    "Tuna, canned tuna and exact fish species",
    ["canned tuna", "tinned tuna", "albacore", "yellowfin", "tuna steak"],
    "check-first",
    "P1",
    "Fish guidance depends on the exact species, serving pattern and any local contamination advice—not only the word tuna.",
    [
      "Check the species on the label and use the fish advice for where you live. Vary lower-mercury fish rather than relying on one type every day.",
    ],
    ["cdc-food", "nhs-food"],
    "rapid-review",
  ),
  finding(
    "food-dishes-restaurant-buffet",
    "food-dishes",
    "Restaurants, buffets and catered food",
    [
      "restaurant food",
      "buffet",
      "catering",
      "all you can eat",
      "hotel breakfast",
    ],
    "check-first",
    "P1",
    "Choose food that is freshly cooked, served hot or kept properly chilled; skip dishes with uncertain time, temperature or raw ingredients.",
    [
      "At a buffet, prefer food from a busy, well-maintained station and avoid lukewarm trays, raw garnishes of uncertain handling and dishes left out for long periods.",
    ],
    ["cdc-food"],
  ),
  finding(
    "food-dishes-takeaway-delivery",
    "food-dishes",
    "Takeaway and delivered meals",
    ["takeaway", "food delivery", "takeout", "leftover takeaway"],
    "check-first",
    "P1",
    "A delivered meal should arrive hot or cold as intended and be eaten, chilled or reheated promptly.",
    [
      "Reheat cooked leftovers until hot throughout and do not rely on smell alone to judge whether food was stored safely.",
    ],
    ["cdc-food"],
  ),
  finding(
    "food-dishes-honey",
    "food-dishes",
    "Honey during pregnancy",
    ["honey", "raw honey", "manuka honey", "honey in tea"],
    "generally-ok",
    "P1",
    "Honey is not a routine pregnancy prohibition for the pregnant person, although honey should not be given to a baby under one year.",
    [
      "Use it as an ordinary sweet food. If diabetes or blood-sugar management affects your pregnancy, ask how sweet foods fit your individual plan.",
    ],
    ["who-antenatal", "who-newborn"],
  ),
  finding(
    "food-dishes-spicy-food",
    "food-dishes",
    "Spicy food",
    ["spicy food", "chilli", "hot sauce", "curry"],
    "generally-ok",
    "P1",
    "Spicy food does not need to be removed simply because of pregnancy, but it may worsen reflux, nausea or digestive discomfort.",
    [
      "Choose the amount you tolerate and use smaller portions if symptoms flare. Persistent reflux or vomiting deserves treatment advice.",
    ],
    ["acog-digestive", "who-antenatal"],
  ),
  finding(
    "food-dishes-ice-cream-frozen-desserts",
    "food-dishes",
    "Ice cream and frozen desserts",
    ["ice cream", "soft serve", "gelato", "frozen yogurt"],
    "check-first",
    "P1",
    "Packaged pasteurized products stored correctly are easier to assess than homemade raw-egg mixtures or poorly maintained soft-serve equipment.",
    [
      "Check pasteurization, eggs, alcohol-containing flavours, storage and the use-by date. Do not use the frozen temperature as proof that every ingredient is safe.",
    ],
    ["cdc-food", "nhs-food"],
  ),
  finding(
    "food-dishes-vegan-vegetarian",
    "food-dishes",
    "Vegetarian or vegan pregnancy",
    [
      "vegan pregnancy",
      "vegetarian pregnancy",
      "plant based diet",
      "no meat diet",
    ],
    "check-first",
    "P1",
    "A vegetarian or vegan diet needs deliberate planning for protein and key nutrients rather than a generic supplement stack.",
    [
      "Ask a qualified clinician or dietitian to review what you eat and the exact prenatal supplement, especially when intake is limited by nausea, allergy or another condition.",
    ],
    ["who-antenatal", "who-feeding"],
  ),
  finding(
    "food-dishes-food-allergy-celiac",
    "food-dishes",
    "Food allergy, coeliac disease and restricted diets",
    ["food allergy", "celiac disease", "coeliac disease", "restricted diet"],
    "check-first",
    "P1",
    "Pregnancy is not a reason to reintroduce a medically necessary excluded food or begin a broad elimination diet without support.",
    [
      "Ask for a tailored nutrition plan when allergies, coeliac disease, an eating disorder or severe food aversion narrows what you can eat.",
    ],
    ["who-antenatal"],
  ),
  finding(
    "drinks-caffeine-kombucha",
    "drinks-caffeine",
    "Kombucha and fermented drinks",
    ["kombucha", "fermented tea", "fermented drink", "home brewed kombucha"],
    "check-first",
    "P0",
    "Kombucha can vary in alcohol, caffeine, ingredients and production hygiene, so the name alone cannot establish pregnancy suitability.",
    [
      "Check the alcohol statement, caffeine, pasteurization and storage. Avoid homemade or unlabelled products when those details cannot be verified.",
    ],
    ["cdc-alcohol", "acog-caffeine", "cdc-food"],
    "rapid-review",
  ),
  finding(
    "drinks-caffeine-artificial-sweeteners",
    "drinks-caffeine",
    "Artificial sweeteners and diet drinks",
    ["artificial sweetener", "diet soda", "diet drinks", "sugar free drinks"],
    "check-first",
    "P1",
    "Check the exact sweetener and the rest of the drink rather than treating every sugar-free product as one category.",
    [
      "A sugar-free label does not mean caffeine-free, stimulant-free or suitable for an individual blood-sugar plan. Use ordinary amounts and ask about concentrated or unfamiliar ingredients.",
    ],
    ["cdc-medicine", "acog-caffeine"],
  ),
  finding(
    "drinks-caffeine-protein-collagen-powders",
    "drinks-caffeine",
    "Protein, collagen and meal-replacement powders",
    [
      "protein powder",
      "collagen powder",
      "meal replacement shake",
      "protein shake",
    ],
    "check-first",
    "P0",
    "Powders can combine vitamins, herbs, stimulants and high amounts of individual nutrients; review the complete label before using them.",
    [
      "Do not treat a fitness, beauty or natural label as a pregnancy assessment. Ask about the exact product when it is replacing meals or used every day.",
    ],
    ["cdc-medicine", "who-antenatal"],
    "rapid-review",
  ),
  finding(
    "drinks-caffeine-creatine-preworkout",
    "drinks-caffeine",
    "Creatine, pre-workout and performance supplements",
    ["creatine", "pre workout", "gym supplement", "performance supplement"],
    "check-first",
    "P0",
    "Do not use a generic sports-supplement rule: the exact ingredients, amount, reason and contamination controls matter.",
    [
      "Bring the full label to a doctor or pharmacist. Products with stimulant blends or undisclosed proprietary mixtures are especially difficult to assess.",
    ],
    ["cdc-medicine", "acog-exercise"],
    "rapid-review",
  ),
  finding(
    "drinks-caffeine-electrolytes-sports-drinks",
    "drinks-caffeine",
    "Electrolyte powders and sports drinks",
    [
      "electrolyte powder",
      "sports drink",
      "hydration tablet",
      "rehydration drink",
    ],
    "check-first",
    "P1",
    "An ordinary drink and a concentrated medical or performance product are not the same; check the exact ingredients and purpose.",
    [
      "If vomiting prevents fluids staying down or urination becomes very infrequent, seek medical assessment rather than repeatedly adding supplements to drinks.",
    ],
    ["cdc-medicine", "acog-morning-sickness"],
    "rapid-review",
  ),
  finding(
    "drinks-caffeine-decaf",
    "drinks-caffeine",
    "Decaf coffee and tea",
    ["decaf coffee", "decaffeinated tea", "half caf", "caffeine free coffee"],
    "generally-ok",
    "P1",
    "Decaffeinated drinks usually contain much less caffeine, but decaf does not always mean zero caffeine.",
    [
      "Count any caffeine shown on the label as part of the daily total and check café size, extra shots and blended ingredients.",
    ],
    ["acog-caffeine"],
  ),
  finding(
    "drinks-caffeine-dehydration",
    "drinks-caffeine",
    "Hydration and signs drinks are not staying down",
    ["dehydration", "dark urine", "not peeing", "cannot drink"],
    "contact-care",
    "P0",
    "Contact care when vomiting means fluids will not stay down, urination becomes much less frequent or weakness is increasing.",
    [
      "Small regular sips may be easier than a large drink, but worsening dehydration needs assessment and may need treatment.",
    ],
    ["acog-morning-sickness", "nhs-symptoms-help"],
    "rapid-review",
  ),
  finding(
    "exercise-movement-horse-riding-winter-sports",
    "exercise-movement",
    "Horse riding, skiing, skating and fall-risk sports",
    ["horse riding", "skiing", "snowboarding", "ice skating", "gymnastics"],
    "check-first",
    "P0",
    "Activities with a meaningful fall risk need an individual decision as balance, conditions and pregnancy change.",
    [
      "Do not use previous skill alone as proof that the risk is unchanged. Discuss the specific activity and choose a lower-fall-risk alternative when needed.",
    ],
    ["acog-exercise"],
  ),
  finding(
    "exercise-movement-cycling",
    "exercise-movement",
    "Outdoor cycling and stationary bikes",
    ["cycling", "bike riding", "stationary bike", "spinning class"],
    "check-first",
    "P1",
    "A stationary bike removes traffic and fall risk; outdoor cycling needs reassessment as balance, route and weather change.",
    [
      "Adjust the bike and intensity for comfort, avoid overheating and stop for bleeding, fluid leakage, faintness, chest pain or painful regular contractions.",
    ],
    ["acog-exercise"],
  ),
  finding(
    "exercise-movement-amusement-rides",
    "exercise-movement",
    "Roller coasters and amusement rides",
    ["roller coaster", "amusement park", "theme park ride", "fairground ride"],
    "avoid",
    "P0",
    "Avoid rides with sudden acceleration, forceful stops, impact, restraints across the abdomen or a posted pregnancy warning.",
    [
      "Choose gentle attractions without abrupt motion or fall risk and follow the operator's pregnancy restrictions.",
    ],
    ["acog-during-pregnancy"],
  ),
  finding(
    "exercise-movement-swimming-pools",
    "exercise-movement",
    "Swimming pools, chlorine and water exercise",
    ["swimming pool", "chlorine", "aqua aerobics", "water exercise"],
    "generally-ok",
    "P1",
    "Swimming and water exercise are common moderate-activity options when the pool is maintained and your care plan does not restrict them.",
    [
      "Use safe entry and exit, avoid overheating, do not swim alone when faintness is a concern and ask before water activity after bleeding or possible membrane rupture.",
    ],
    ["acog-exercise"],
  ),
  finding(
    "exercise-movement-snorkeling",
    "exercise-movement",
    "Snorkeling versus scuba diving",
    ["snorkeling", "snorkelling", "scuba diving", "diving"],
    "check-first",
    "P0",
    "Scuba diving should be avoided in pregnancy; surface snorkeling still needs calm conditions, a companion and an honest assessment of swimming ability.",
    [
      "Do not breath-hold dive or continue when breathless, dizzy, chilled, overheated or unwell.",
    ],
    ["acog-exercise"],
  ),
  finding(
    "exercise-movement-high-altitude",
    "exercise-movement",
    "Exercise at high altitude",
    [
      "high altitude exercise",
      "mountain hiking",
      "altitude training",
      "mountain trip",
    ],
    "check-first",
    "P0",
    "Altitude, rapid ascent, exertion and access to care all affect the plan, so discuss the exact destination and activity first.",
    [
      "Stop and seek help for severe breathlessness, chest pain, faintness, confusion or another serious symptom rather than assuming altitude is the only cause.",
    ],
    ["acog-exercise", "acog-travel"],
    "rapid-review",
  ),
  finding(
    "exercise-movement-pelvic-floor",
    "exercise-movement",
    "Pelvic-floor exercise and pelvic-health support",
    [
      "pelvic floor",
      "kegels",
      "pelvic health physiotherapy",
      "pelvic floor exercises",
    ],
    "generally-ok",
    "P1",
    "Pelvic-floor work should be comfortable and coordinated with normal breathing; more squeezing is not always the answer to pain or tension.",
    [
      "Ask a pelvic-health professional when there is pain, heaviness, leakage or uncertainty about relaxing as well as contracting the muscles.",
    ],
    ["acog-exercise", "acog-back-pain"],
  ),
  finding(
    "exercise-movement-core-abdominal",
    "exercise-movement",
    "Core and abdominal exercise",
    ["ab workout", "core exercise", "sit ups", "plank pregnancy"],
    "check-first",
    "P1",
    "Core exercise can usually be adapted, but comfort, breathing, balance and any individual restriction matter more than a universal move list.",
    [
      "Reduce or change movements that cause pain, dizziness, breathlessness, pelvic pressure or loss of control, and ask a qualified prenatal professional for technique help.",
    ],
    ["acog-exercise"],
  ),
  finding(
    "exercise-movement-contact-sports",
    "exercise-movement",
    "Contact, collision and combat sports",
    ["contact sports", "boxing", "martial arts", "football", "hockey"],
    "avoid",
    "P0",
    "Avoid activities where abdominal impact or uncontrolled collision is likely.",
    [
      "Use non-contact conditioning or technique work only when a qualified instructor and your clinician agree it is appropriate for your pregnancy.",
    ],
    ["acog-exercise"],
  ),
  finding(
    "medicines-supplements-paracetamol-acetaminophen",
    "medicines-supplements",
    "Paracetamol or acetaminophen",
    ["paracetamol", "acetaminophen", "tylenol", "painkiller"],
    "check-first",
    "P0",
    "Check the exact product, reason, amount and how long you expect to use it with a doctor or pharmacist.",
    [
      "Combination cold and pain products may contain the same ingredient more than once. Do not stack brands without comparing every active ingredient.",
    ],
    ["cdc-medicine"],
    "rapid-review",
  ),
  finding(
    "medicines-supplements-ibuprofen-nsaids",
    "medicines-supplements",
    "Ibuprofen, naproxen and NSAIDs",
    ["ibuprofen", "advil", "naproxen", "NSAID", "anti inflammatory painkiller"],
    "check-first",
    "P0",
    "Do not use a non-steroidal anti-inflammatory medicine from a generic list; pregnancy timing, reason and the exact product matter.",
    [
      "If it is prescribed, continue only as directed and ask the prescriber before changing it. If it was taken unexpectedly, tell a clinician what, how much and when rather than guessing about risk.",
    ],
    ["cdc-medicine"],
    "rapid-review",
  ),
  finding(
    "medicines-supplements-cold-decongestants",
    "medicines-supplements",
    "Cold, cough and decongestant products",
    ["cold medicine", "cough syrup", "decongestant", "blocked nose medicine"],
    "check-first",
    "P0",
    "Cold remedies often combine several active ingredients, so the brand name alone is not enough for a pregnancy decision.",
    [
      "Show the active-ingredient panel to a pharmacist or doctor and describe the symptom you are treating. Seek assessment for breathing difficulty, chest pain, persistent fever or worsening illness.",
    ],
    ["cdc-medicine", "nhs-symptoms-help"],
    "rapid-review",
  ),
  finding(
    "medicines-supplements-antihistamines",
    "medicines-supplements",
    "Allergy medicines and antihistamines",
    [
      "antihistamine",
      "allergy medicine",
      "hay fever medicine",
      "allergy tablet",
    ],
    "check-first",
    "P0",
    "Review the exact antihistamine, formulation and reason with a pharmacist or doctor before using it in pregnancy.",
    [
      "Some products add a decongestant or sedating ingredient. Check sprays, tablets and combination brands separately.",
    ],
    ["cdc-medicine"],
    "rapid-review",
  ),
  finding(
    "medicines-supplements-antacids-reflux",
    "medicines-supplements",
    "Antacids and reflux medicine",
    ["antacid", "heartburn medicine", "reflux medicine", "acid reducer"],
    "check-first",
    "P0",
    "Ask about the exact antacid or reflux medicine because ingredients, other medicines and medical conditions can change the choice.",
    [
      "Persistent pain, vomiting, difficulty swallowing, black stools or severe upper-abdominal pain needs medical assessment rather than repeated self-treatment.",
    ],
    ["cdc-medicine", "acog-digestive"],
    "rapid-review",
  ),
  finding(
    "medicines-supplements-laxatives",
    "medicines-supplements",
    "Laxatives and constipation products",
    ["laxative", "stool softener", "constipation medicine", "fiber supplement"],
    "check-first",
    "P0",
    "Start with food, fluid and movement changes you tolerate, then ask a pharmacist or doctor about the exact product if more help is needed.",
    [
      "Do not assume herbal, stimulant or detox laxatives are suitable. Severe pain, vomiting, bleeding or inability to pass stool or gas needs assessment.",
    ],
    ["cdc-medicine", "acog-digestive"],
    "rapid-review",
  ),
  finding(
    "medicines-supplements-anti-nausea",
    "medicines-supplements",
    "Anti-nausea and vomiting treatment",
    [
      "anti nausea medicine",
      "morning sickness medicine",
      "antiemetic",
      "vomiting treatment",
    ],
    "check-first",
    "P0",
    "Pregnancy nausea can be treated, but the choice should reflect severity, other medicines and whether food and fluids stay down.",
    [
      "Ask early when symptoms limit drinking or daily life. Do not wait with very little urination, faintness, confusion or increasing weakness.",
    ],
    ["acog-morning-sickness", "cdc-medicine"],
    "rapid-review",
  ),
  finding(
    "medicines-supplements-antibiotics",
    "medicines-supplements",
    "Antibiotics and infection treatment",
    [
      "antibiotic",
      "infection medicine",
      "prescribed antibiotics",
      "antimicrobial",
    ],
    "check-first",
    "P0",
    "The infection, exact medicine, pregnancy timing, allergy history and culture results all matter; do not start, share or stop antibiotics on your own.",
    [
      "Tell the prescriber you are pregnant and take a prescribed course exactly as directed unless the prescriber changes it.",
    ],
    ["cdc-medicine", "cdc-infections"],
    "rapid-review",
  ),
  finding(
    "medicines-supplements-melatonin-sleep-aids",
    "medicines-supplements",
    "Melatonin, sleeping tablets and sedating remedies",
    ["melatonin", "sleeping pill", "sleep aid", "sedating antihistamine"],
    "check-first",
    "P0",
    "Do not begin a sleep medicine, melatonin product or herbal sedative without review of the exact product and the cause of poor sleep.",
    [
      "Persistent insomnia, severe snoring with pauses, panic or restless legs may need assessment rather than a sedating product.",
    ],
    ["cdc-medicine", "nhs-pregnancy-symptoms"],
    "rapid-review",
  ),
  finding(
    "medicines-supplements-acne-retinoids",
    "medicines-supplements",
    "Acne medicines, retinoids and medicated creams",
    ["retinol cream", "retinoid", "isotretinoin", "acne medicine", "tretinoin"],
    "check-first",
    "P0",
    "Review every prescription, over-the-counter and cosmetic acne product; oral isotretinoin and retinoid-labelled products require specialist pregnancy instructions.",
    [
      "Do not stop a prescribed treatment without contacting the prescriber. Photograph the active-ingredient list so the exact product can be reviewed.",
    ],
    ["acog-skin", "cdc-medicine"],
    "rapid-review",
  ),
  finding(
    "everyday-home-heating-pads-electric-blankets",
    "everyday-home",
    "Heating pads, hot-water bottles and electric blankets",
    ["heating pad", "electric blanket", "hot water bottle", "heated seat"],
    "check-first",
    "P1",
    "Avoid anything hot enough or prolonged enough to overheat or burn you; use the lowest comfortable setting for brief local comfort and check first if uncertain.",
    [
      "Do not sleep on an active heating pad or use heat over numb skin. Persistent or severe pain needs assessment rather than repeated heat.",
    ],
    ["acog-heat", "acog-back-pain"],
  ),
  finding(
    "everyday-home-paint-fumes",
    "everyday-home",
    "Painting, varnish and solvent fumes",
    ["paint fumes", "painting room", "varnish", "solvent smell"],
    "check-first",
    "P0",
    "Reduce unnecessary solvent exposure, ventilate well and let someone else handle stripping old paint or high-fume products when possible.",
    [
      "Check the product label and workplace safety sheet. Leave immediately for dizziness, breathing irritation or feeling unwell and seek advice after a significant exposure.",
    ],
    ["cdc-workplace"],
    "rapid-review",
  ),
  finding(
    "everyday-home-bleach-cleaners",
    "everyday-home",
    "Bleach, disinfectants and strong cleaners",
    ["bleach", "disinfectant", "oven cleaner", "strong cleaning chemicals"],
    "check-first",
    "P1",
    "Use the least irritating product that works, follow the label, wear appropriate gloves and ventilate the space.",
    [
      "Never mix cleaning products. Leave the area and seek urgent poison or medical advice after a concerning inhalation, splash or reaction.",
    ],
    ["cdc-workplace"],
  ),
  finding(
    "everyday-home-mould-damp",
    "everyday-home",
    "Mould, mold and damp cleanup",
    ["mould", "mold", "damp room", "mold removal"],
    "check-first",
    "P1",
    "Small routine cleaning and a major contaminated cleanup are different jobs; avoid heavy exposure, harsh mixtures and work that triggers breathing symptoms.",
    [
      "Address the moisture source and ask someone else or a qualified service to handle widespread growth, damaged materials or work requiring respiratory protection.",
    ],
    ["cdc-workplace"],
  ),
  finding(
    "everyday-home-carbon-monoxide",
    "everyday-home",
    "Carbon monoxide and fuel-burning appliances",
    ["carbon monoxide", "CO detector", "gas heater", "fuel burning appliance"],
    "urgent",
    "P0",
    "Use a working carbon-monoxide alarm and leave the building immediately if it sounds or several people develop headache, dizziness, nausea or confusion near a fuel-burning appliance.",
    [
      "Call emergency or poison services from fresh air. Do not re-enter until the source has been assessed by qualified responders.",
    ],
    ["cdc-workplace", "cdc-warning"],
    "rapid-review",
  ),
  finding(
    "everyday-home-pesticides-lead",
    "everyday-home",
    "Pesticides, lead and renovation dust",
    ["pesticide", "lead paint", "renovation dust", "insecticide", "old paint"],
    "check-first",
    "P0",
    "Avoid unnecessary pesticide and lead exposure and do not sand, strip or disturb suspect old paint yourself.",
    [
      "Discuss a known home or work exposure with your clinician and the relevant safety professional; provide the product or material name rather than only saying chemicals.",
    ],
    ["cdc-workplace", "cdc-planning-pregnancy"],
    "rapid-review",
  ),
  finding(
    "everyday-home-medical-imaging",
    "everyday-home",
    "X-rays, CT scans and MRI",
    ["x ray", "radiology", "CT scan", "MRI", "medical imaging"],
    "check-first",
    "P0",
    "Tell the imaging team that you are pregnant or may be pregnant so they can assess the exact test, body area, urgency and alternatives.",
    [
      "Do not cancel necessary imaging from a generic rule. Ask the ordering clinician and radiology team to explain the benefit, exposure and any shielding or contrast decision.",
    ],
    ["cdc-medicine", "nice-antenatal"],
    "rapid-review",
  ),
  finding(
    "everyday-home-hot-weather",
    "everyday-home",
    "Hot weather and heat waves",
    ["heat wave", "hot weather", "extreme heat", "overheating outside"],
    "check-first",
    "P0",
    "Reduce exertion in extreme heat, drink regularly, use shade or cooling and move indoors when you cannot stay comfortable.",
    [
      "Stop for dizziness, faintness, headache, confusion, racing heartbeat or very little urination. Severe symptoms need urgent assessment.",
    ],
    ["acog-exercise", "acog-heat"],
    "rapid-review",
  ),
  finding(
    "work-lifting-healthcare",
    "work-lifting",
    "Healthcare work and patient care",
    ["healthcare worker", "nurse pregnant", "hospital work", "patient care"],
    "check-first",
    "P0",
    "Review infectious exposure, heavy patient handling, long shifts, hazardous medicines, disinfectants, anaesthetic gases and radiation with occupational health.",
    [
      "Pregnancy alone does not mean every patient contact is prohibited. Use the infection-control and exposure plan for the exact task and ask for adjustments where controls are not adequate.",
    ],
    ["cdc-workplace", "cdc-infections"],
    "rapid-review",
  ),
  finding(
    "work-lifting-childcare",
    "work-lifting",
    "Childcare, school and nursery work",
    ["childcare worker", "teacher pregnant", "nursery work", "daycare germs"],
    "check-first",
    "P0",
    "Childcare work combines lifting, long days and exposure to common infections such as parvovirus and CMV.",
    [
      "Use routine hygiene and workplace controls, avoid sharing food or utensils with children, and contact occupational health or maternity care after a highlighted exposure.",
    ],
    ["cdc-workplace", "cdc-parvovirus", "cdc-infections"],
    "rapid-review",
  ),
  finding(
    "work-lifting-laboratory",
    "work-lifting",
    "Laboratory, research and chemical work",
    ["laboratory work", "lab chemicals", "research lab", "formaldehyde"],
    "check-first",
    "P0",
    "A lab-specific assessment should identify infectious agents, solvents, formaldehyde, radiation and whether the available controls and gloves match the task.",
    [
      "Use the safety data sheet and occupational-health route. Do not rely on odour or one generic pair of gloves to judge exposure.",
    ],
    ["cdc-workplace", "cdc-infections"],
    "rapid-review",
  ),
  finding(
    "work-lifting-salon",
    "work-lifting",
    "Hair, nail and beauty-salon work",
    [
      "nail technician",
      "hairdresser pregnant",
      "beauty salon work",
      "acrylic nails work",
    ],
    "check-first",
    "P1",
    "Salon work can involve solvents, acrylates, formaldehyde-releasing products, disinfectants, fumes, standing and repetitive tasks.",
    [
      "Use effective ventilation and task-specific protective equipment, keep products closed and ask occupational health about repeated or high-level exposure.",
    ],
    ["cdc-workplace"],
  ),
  finding(
    "work-lifting-veterinary-animal",
    "work-lifting",
    "Veterinary, farm and animal-care work",
    ["veterinary work", "farm work", "animal care job", "livestock pregnancy"],
    "check-first",
    "P0",
    "Animal work can combine heavy handling, infection, pesticides, medicines, anaesthetic gases, radiation and injury risk.",
    [
      "Review the exact species, procedures and controls with occupational health. Use task-appropriate hygiene and protective equipment rather than a blanket rule about all animals.",
    ],
    ["cdc-workplace", "cdc-infections"],
    "rapid-review",
  ),
  finding(
    "work-lifting-night-shifts",
    "work-lifting",
    "Night shifts, long hours and missed breaks",
    [
      "night shift",
      "shift work",
      "long working hours",
      "working nights pregnant",
    ],
    "check-first",
    "P1",
    "Review fatigue, sleep, food, hydration, travel home, symptoms and workload—not only the clock time of the shift.",
    [
      "Ask early for protected breaks, predictable access to food, water and toilets, and a change when exhaustion or symptoms make the setup unsafe.",
    ],
    ["cdc-workplace"],
  ),
  finding(
    "work-lifting-ppe-fit",
    "work-lifting",
    "Protective equipment and changing fit",
    [
      "PPE pregnancy",
      "respirator fit",
      "protective clothing",
      "safety harness pregnancy",
    ],
    "check-first",
    "P0",
    "Body changes can alter the fit and function of respirators, protective clothing, harnesses and other safety equipment.",
    [
      "Ask the workplace safety team to reassess fit and the task. Do not improvise a modification that weakens protection.",
    ],
    ["cdc-workplace"],
  ),
  finding(
    "work-lifting-adjustments",
    "work-lifting",
    "Work adjustments and accommodations",
    [
      "work accommodation",
      "pregnancy work adjustment",
      "lighter duties",
      "work restrictions",
    ],
    "check-first",
    "P0",
    "Ask for a task-specific change such as seating, rotation, lighter loads, safer exposure controls, extra short breaks or appointment time.",
    [
      "Describe the actual barrier and what would make the work safer. A clinician can document medical restrictions, while the employer must assess the workplace setup under local rules.",
    ],
    ["cdc-workplace"],
  ),
  finding(
    "travel-flying",
    "travel",
    "Flying during pregnancy",
    ["flying", "air travel", "plane flight", "flight while pregnant"],
    "check-first",
    "P0",
    "Most travel decisions depend on pregnancy stage, complications, flight length, airline rules and access to care at the destination.",
    [
      "Check carrier limits and insurance, carry records and medicines, use the seat belt low under the bump, drink regularly and move when it is safe on a long flight.",
    ],
    ["acog-travel"],
    "rapid-review",
  ),
  finding(
    "travel-cruise-sea",
    "travel",
    "Cruises, ferries and sea travel",
    ["cruise", "ferry", "sea travel", "boat trip pregnancy"],
    "check-first",
    "P1",
    "Check the operator's pregnancy cutoff, medical facilities, port access, infection outbreaks, food and water safety, and travel insurance before booking.",
    [
      "Ask about an exact motion-sickness medicine rather than packing a generic remedy. Do not travel when warning symptoms need assessment first.",
    ],
    ["acog-travel", "cdc-medicine"],
    "rapid-review",
  ),
  finding(
    "travel-malaria-zika",
    "travel",
    "Malaria, Zika and destination-specific pregnancy risks",
    ["malaria", "zika", "travel infection", "mosquito disease pregnancy"],
    "check-first",
    "P0",
    "Check current destination guidance before booking because pregnancy-specific infection notices can change quickly.",
    [
      "Discuss whether to postpone, what mosquito protection to use, vaccines or medicines, and what care is available. Generic global advice cannot replace a current destination assessment.",
    ],
    ["acog-travel", "cdc-infections"],
    "rapid-review",
  ),
  finding(
    "travel-mosquito-repellent",
    "travel",
    "Mosquito repellent and DEET",
    ["mosquito repellent", "DEET", "insect repellent", "bug spray"],
    "check-first",
    "P0",
    "Use a registered repellent according to its label and check the exact active ingredient when pregnancy or destination guidance raises a question.",
    [
      "Combine repellent with clothing, screens and nets where appropriate. Do not replace effective bite prevention with an unproven essential-oil mixture.",
    ],
    ["acog-travel", "cdc-infections"],
    "rapid-review",
  ),
  finding(
    "travel-food-water-abroad",
    "travel",
    "Food, water and ice while travelling",
    [
      "tap water abroad",
      "travel food safety",
      "ice cubes travel",
      "traveler diarrhea",
    ],
    "check-first",
    "P0",
    "Where tap water is not reliably safe, use a trusted treated source for drinking, ice and tooth-brushing and choose food cooked and served hot.",
    [
      "Severe vomiting or diarrhoea, fever, blood, faintness or inability to keep fluids down needs medical care rather than self-treatment from a travel kit.",
    ],
    ["acog-travel", "cdc-food"],
    "rapid-review",
  ),
  finding(
    "travel-motion-sickness",
    "travel",
    "Travel or motion sickness",
    [
      "motion sickness",
      "car sickness",
      "sea sickness",
      "travel sickness medicine",
    ],
    "check-first",
    "P1",
    "Plan fresh air, a stable seat, small drinks and food you tolerate, and review the exact medicine before travel.",
    [
      "Do not assume motion sickness explains severe or persistent vomiting, dehydration, headache or abdominal pain during pregnancy.",
    ],
    ["acog-travel", "cdc-medicine"],
  ),
  finding(
    "travel-compression-stockings",
    "travel",
    "Compression stockings and clot prevention",
    [
      "compression stockings",
      "flight socks",
      "DVT prevention",
      "blood clot travel",
    ],
    "check-first",
    "P0",
    "Long travel and individual clot risk should be reviewed before choosing compression stockings or another preventive measure.",
    [
      "Move regularly when safe and drink fluids. One-sided limb swelling or pain, chest pain, fainting or sudden breathlessness needs urgent care.",
    ],
    ["acog-travel", "cdc-warning"],
    "rapid-review",
  ),
  finding(
    "travel-remote-destinations",
    "travel",
    "Remote destinations and limited maternity care",
    ["remote travel", "rural trip", "wilderness travel", "far from hospital"],
    "check-first",
    "P0",
    "Distance from assessment matters more as pregnancy advances or when symptoms, multiple pregnancy or another complication changes the chance of needing care.",
    [
      "Know the nearest appropriate service, transport time, communication limits and what your insurance covers before leaving.",
    ],
    ["acog-travel"],
    "rapid-review",
  ),
  finding(
    "travel-records-insurance",
    "travel",
    "Pregnancy records, insurance and carrier rules",
    [
      "fit to fly letter",
      "travel insurance pregnancy",
      "pregnancy records travel",
      "airline pregnancy rules",
    ],
    "check-first",
    "P1",
    "Carry key pregnancy information, prescriptions, contacts and insurance details, and check carrier rules before paying for non-refundable travel.",
    [
      "Confirm whether pregnancy and newborn complications are covered; ordinary travel cover may exclude them.",
    ],
    ["acog-travel"],
  ),
  finding(
    "sex-relationships-masturbation-orgasm",
    "sex-relationships",
    "Masturbation, orgasm and sex toys",
    ["masturbation", "orgasm", "sex toys", "vibrator pregnancy"],
    "check-first",
    "P1",
    "In an uncomplicated pregnancy these activities are often approached like other consensual sex, but bleeding, pain, ruptured membranes or a specific restriction changes the answer.",
    [
      "Use clean products intended for the body, stop for pain or concerning symptoms and ask your clinician when your care plan limits penetration or orgasm.",
    ],
    ["acog-during-pregnancy", "nice-antenatal"],
  ),
  finding(
    "sex-relationships-lubricants",
    "sex-relationships",
    "Lubricants and intimate products",
    ["lubricant", "lube", "intimate wash", "vaginal product"],
    "check-first",
    "P1",
    "Choose a simple product intended for the use and stop if it causes burning, swelling or irritation.",
    [
      "Do not douche or use a fragranced product to hide changed discharge or odour; those symptoms need assessment.",
    ],
    ["acog-during-pregnancy", "nhs-pregnancy-symptoms"],
  ),
  finding(
    "sex-relationships-spotting-after-sex",
    "sex-relationships",
    "Spotting or cramping after sex",
    [
      "bleeding after sex",
      "spotting after sex",
      "cramps after orgasm",
      "postcoital bleeding",
    ],
    "contact-care",
    "P0",
    "Brief mild cramping or light spotting can have several causes, but new bleeding should be discussed with pregnancy care—especially when pain persists or bleeding increases.",
    [
      "Use urgent assessment for heavy bleeding, severe or one-sided pain, fainting, shoulder-tip pain, fluid leakage or feeling seriously unwell.",
    ],
    ["nhs-symptoms-help", "cdc-warning"],
    "rapid-review",
  ),
  finding(
    "sex-relationships-sti-condoms",
    "sex-relationships",
    "STI protection, condoms and a new partner",
    ["STI pregnancy", "STD pregnancy", "condoms", "new sexual partner"],
    "check-first",
    "P0",
    "Use barrier protection when STI protection is needed and arrange testing after a new exposure, symptoms or a new partner.",
    [
      "Tell the testing clinician you are pregnant so any tests and treatment can be planned appropriately. Do not delay because symptoms are mild or absent.",
    ],
    ["cdc-infections", "nice-antenatal"],
    "rapid-review",
  ),
  finding(
    "sleep-comfort-insomnia",
    "sleep-comfort",
    "Persistent insomnia",
    ["insomnia", "cannot sleep", "pregnancy sleep problems", "awake all night"],
    "contact-care",
    "P1",
    "Ask for help when poor sleep is persistent, affects safety or daily function, or is driven by pain, reflux, anxiety or breathing symptoms.",
    [
      "Review the cause before trying a sleep aid. Severe mood change, thoughts of harm or loss of contact with reality needs urgent help.",
    ],
    ["nhs-pregnancy-symptoms", "nhs-mental"],
  ),
  finding(
    "sleep-comfort-restless-legs",
    "sleep-comfort",
    "Restless legs and uncomfortable leg sensations",
    [
      "restless legs",
      "legs crawling at night",
      "urge to move legs",
      "leg discomfort sleep",
    ],
    "contact-care",
    "P1",
    "Persistent restless-leg symptoms deserve review, especially when they disrupt sleep or occur with other health concerns.",
    [
      "Do not begin iron or another supplement solely from a symptom. Ask whether blood tests, medicines or another cause need review.",
    ],
    ["nhs-pregnancy-symptoms", "cdc-medicine"],
  ),
  finding(
    "sleep-comfort-snoring-apnea",
    "sleep-comfort",
    "Severe snoring, gasping or breathing pauses",
    [
      "sleep apnea",
      "snoring pregnancy",
      "gasping in sleep",
      "breathing pauses sleep",
    ],
    "contact-care",
    "P0",
    "Loud snoring with witnessed pauses, waking unable to breathe or extreme daytime sleepiness needs clinical assessment.",
    [
      "Do not treat breathing pauses with a sedating remedy. Sudden breathlessness, chest pain or fainting needs urgent care.",
    ],
    ["nhs-pregnancy-symptoms", "cdc-warning"],
    "rapid-review",
  ),
  finding(
    "sleep-comfort-sleep-position-after-28-weeks",
    "sleep-comfort",
    "Side sleeping and waking on your back",
    [
      "sleep on back",
      "side sleeping",
      "left side sleep",
      "pregnancy sleep position",
    ],
    "generally-ok",
    "P1",
    "From the third trimester, settle to sleep on your side; if you wake on your back, roll to a side without panic.",
    [
      "Use whichever side is comfortable and pillows for support. Tell care if lying down causes breathlessness, faintness or chest discomfort.",
    ],
    ["nice-antenatal", "nhs-pregnancy-symptoms"],
  ),
  finding(
    "appointments-warning-signs-screening-vs-diagnostic",
    "appointments-warning-signs",
    "Screening tests versus diagnostic tests",
    [
      "prenatal screening",
      "diagnostic test",
      "screening result",
      "genetic testing",
    ],
    "check-first",
    "P0",
    "A screening test estimates the chance of a condition; it does not diagnose it. A diagnostic test answers a narrower question but may involve a procedure.",
    [
      "Before testing, ask what it can and cannot show, whether a result may be uncertain, what follow-up is available and how the result could affect your choices.",
    ],
    ["acog-prenatal-testing", "nice-antenatal"],
    "rapid-review",
  ),
  finding(
    "appointments-warning-signs-nipt",
    "appointments-warning-signs",
    "NIPT or cell-free DNA screening",
    ["NIPT", "noninvasive prenatal testing", "cell free DNA", "cfDNA"],
    "check-first",
    "P0",
    "NIPT is a screening test, not a diagnosis, and the conditions covered and follow-up pathway depend on the exact test and local programme.",
    [
      "Ask what a high-chance, low-chance or no-result outcome means and whether diagnostic testing would be offered before making a decision from the result.",
    ],
    ["acog-prenatal-testing"],
    "rapid-review",
  ),
  finding(
    "appointments-warning-signs-nuchal-translucency",
    "appointments-warning-signs",
    "Nuchal translucency and first-trimester screening",
    [
      "nuchal translucency",
      "NT scan",
      "first trimester screening",
      "combined screening",
    ],
    "check-first",
    "P0",
    "This ultrasound measurement may be one part of a screening pathway; timing, accompanying blood tests and interpretation vary.",
    [
      "Ask what is being measured, the valid timing window, when results arrive and what follow-up would be offered for an unexpected result.",
    ],
    ["acog-prenatal-testing", "nice-antenatal"],
    "rapid-review",
  ),
  finding(
    "appointments-warning-signs-cvs",
    "appointments-warning-signs",
    "Chorionic villus sampling (CVS)",
    [
      "CVS",
      "chorionic villus sampling",
      "placenta sample test",
      "prenatal diagnostic test",
    ],
    "check-first",
    "P0",
    "CVS is a diagnostic procedure that samples placental tissue; the exact question, timing, benefits, limitations and procedure risks need specialist discussion.",
    [
      "Ask how the result differs from screening, what it will and will not test, and what symptoms after the procedure require urgent contact.",
    ],
    ["acog-prenatal-testing"],
    "rapid-review",
  ),
  finding(
    "appointments-warning-signs-amniocentesis",
    "appointments-warning-signs",
    "Amniocentesis",
    [
      "amniocentesis",
      "amnio",
      "amniotic fluid test",
      "diagnostic pregnancy test",
    ],
    "check-first",
    "P0",
    "Amniocentesis is a diagnostic procedure using amniotic fluid; it should follow an individual discussion of the test question, timing, limits and procedure risks.",
    [
      "Ask when results are expected and what bleeding, fluid leakage, pain, fever or other symptoms after the procedure should trigger contact.",
    ],
    ["acog-prenatal-testing"],
    "rapid-review",
  ),
  finding(
    "appointments-warning-signs-blood-urine-tests",
    "appointments-warning-signs",
    "Routine blood and urine tests",
    [
      "pregnancy blood test",
      "urine test",
      "booking bloods",
      "prenatal lab tests",
    ],
    "check-first",
    "P0",
    "Early and later tests may check blood group, anaemia, infections, urine, blood sugar or other concerns, but the exact panel and schedule vary.",
    [
      "Ask what each sample is for, how results will reach you, when to follow up and whether an abnormal result requires a repeat or a different test.",
    ],
    ["nice-antenatal", "nhs-appointments"],
    "rapid-review",
  ),
  finding(
    "appointments-warning-signs-rh-anti-d",
    "appointments-warning-signs",
    "Rh-negative blood type and anti-D",
    ["Rh negative", "rhesus negative", "anti D", "anti-D injection"],
    "check-first",
    "P0",
    "If your blood group is Rh-negative, ask how your care pathway handles sensitising events, routine prophylaxis and the baby's blood group.",
    [
      "Contact maternity care after bleeding, abdominal injury or another event your service has identified rather than waiting for the next routine visit.",
    ],
    ["nice-antenatal", "nhs-appointments"],
    "rapid-review",
  ),
  finding(
    "appointments-warning-signs-gbs",
    "appointments-warning-signs",
    "Group B strep (GBS)",
    ["GBS", "group B strep", "group B streptococcus", "GBS swab"],
    "check-first",
    "P0",
    "Group B streptococcus is a common bacterium, not an STI; whether and how it is tested for differs by care system and history.",
    [
      "Ask whether screening or risk-based planning applies, how a positive result changes the labour plan and when to contact care if labour starts or waters break.",
    ],
    ["acog-gbs", "nice-antenatal"],
    "rapid-review",
  ),
  finding(
    "appointments-warning-signs-vaccines",
    "appointments-warning-signs",
    "Flu, COVID-19, whooping-cough and RSV vaccines",
    [
      "flu vaccine",
      "COVID vaccine",
      "whooping cough vaccine",
      "pertussis vaccine",
      "RSV vaccine",
    ],
    "check-first",
    "P0",
    "Pregnancy vaccine recommendations and timing depend on the vaccine, season, country, previous doses and individual health.",
    [
      "Bring your vaccine record and ask which current vaccines are recommended during this pregnancy and why. Do not use an old schedule from another country as your plan.",
    ],
    ["cdc-vaccines", "acog-during-pregnancy"],
    "rapid-review",
  ),
  finding(
    "appointments-warning-signs-twins-multiples",
    "appointments-warning-signs",
    "Twins and multiple pregnancy",
    ["twins", "multiple pregnancy", "triplets", "pregnant with twins"],
    "check-first",
    "P0",
    "A multiple pregnancy usually needs an individualized scan, monitoring and birth plan based partly on how the babies and placenta are arranged.",
    [
      "Ask who leads care, how often monitoring is planned, which symptoms need earlier contact and how birth timing and location will be discussed.",
    ],
    ["acog-during-pregnancy", "nice-antenatal"],
    "rapid-review",
  ),
  finding(
    "appointments-warning-signs-breech",
    "appointments-warning-signs",
    "Breech or non-head-down position",
    ["breech", "baby not head down", "transverse baby", "baby position"],
    "check-first",
    "P0",
    "Position earlier in pregnancy often changes; a breech or transverse position later leads to a discussion of monitoring and birth options.",
    [
      "Ask when position will be rechecked, which options are suitable for your pregnancy and what should prompt contact if labour or waters breaking begins.",
    ],
    ["acog-labour-birth", "nice-antenatal"],
    "rapid-review",
  ),
  finding(
    "appointments-warning-signs-induction",
    "appointments-warning-signs",
    "Induction of labour",
    ["induction", "inducing labor", "inducing labour", "cervical ripening"],
    "check-first",
    "P0",
    "Induction uses medicines or procedures to start labour; the reason, timing, methods, alternatives and what happens if it does not work should be discussed together.",
    [
      "Ask how long the process may take, what monitoring is planned, what pain relief is available and which choices remain open at each stage.",
    ],
    ["acog-labour-birth", "nice-antenatal"],
    "rapid-review",
  ),
  finding(
    "appointments-warning-signs-caesarean",
    "appointments-warning-signs",
    "Caesarean or c-section birth",
    ["caesarean", "cesarean", "c section", "abdominal birth", "cesarean birth"],
    "check-first",
    "P0",
    "A planned or unplanned caesarean is major surgery as well as a birth; preparation should include the reason, anaesthesia, support, recovery and newborn contact.",
    [
      "Ask what happens before, during and after surgery, how pain and clot prevention are managed, and what wound or recovery symptoms need contact.",
    ],
    ["acog-labour-birth", "acog-postpartum"],
    "rapid-review",
  ),
  finding(
    "appointments-warning-signs-vbac",
    "appointments-warning-signs",
    "VBAC and birth after a previous caesarean",
    [
      "VBAC",
      "vaginal birth after cesarean",
      "birth after c section",
      "repeat cesarean",
    ],
    "check-first",
    "P0",
    "Options after a previous caesarean depend on the previous surgery, current pregnancy, available monitoring and individual preferences.",
    [
      "Ask early whether VBAC is offered, what benefits and risks apply to you, what records are needed and what would change the plan during labour.",
    ],
    ["acog-labour-birth", "nice-antenatal"],
    "rapid-review",
  ),
  finding(
    "appointments-warning-signs-epidural-pain-relief",
    "appointments-warning-signs",
    "Epidural and other labour pain relief",
    [
      "epidural",
      "pain relief in labour",
      "labor pain medicine",
      "nitrous oxide",
      "gas and air",
    ],
    "check-first",
    "P0",
    "Pain-relief choices can include nonmedical support, inhaled gas, systemic medicine, epidural or spinal techniques, depending on the setting and your health.",
    [
      "Ask what is available, how quickly it can be given, likely effects and side effects, and whether any condition or medicine changes your options.",
    ],
    ["acog-labour-pain"],
    "rapid-review",
  ),
  finding(
    "appointments-warning-signs-preterm-birth",
    "appointments-warning-signs",
    "Preterm labour and premature birth",
    ["preterm labor", "preterm labour", "premature birth", "early labor"],
    "urgent",
    "P0",
    "Regular painful contractions, pelvic pressure, bleeding or possible fluid leakage before term needs prompt maternity assessment.",
    [
      "Do not wait for contractions to fit a perfect timing rule. Say how many weeks pregnant you are and describe movement, bleeding, pain and fluid clearly.",
    ],
    ["acog-labour-birth", "cdc-warning"],
    "rapid-review",
  ),
  finding(
    "appointments-warning-signs-placenta",
    "appointments-warning-signs",
    "Placenta previa, low placenta and placenta accreta",
    [
      "placenta previa",
      "low lying placenta",
      "placenta accreta",
      "placenta covering cervix",
    ],
    "check-first",
    "P0",
    "Placental findings need an individualized scan and birth plan; the exact location, previous surgery and whether bleeding occurs all matter.",
    [
      "Follow the restrictions and emergency instructions given by your maternity team. Bleeding during pregnancy needs prompt assessment and heavy bleeding is an emergency.",
    ],
    ["acog-during-pregnancy", "nice-antenatal", "cdc-warning"],
    "rapid-review",
  ),
  finding(
    "appointments-warning-signs-cervix",
    "appointments-warning-signs",
    "Short cervix or cervical insufficiency",
    [
      "short cervix",
      "cervical insufficiency",
      "incompetent cervix",
      "cervical length",
    ],
    "check-first",
    "P0",
    "A cervical finding cannot be managed from a generic page; history, scan measurements, symptoms and gestational age guide specialist advice.",
    [
      "Ask what monitoring or treatment discussion applies and what pressure, bleeding, contractions or fluid loss should trigger urgent contact.",
    ],
    ["acog-during-pregnancy", "nice-antenatal"],
    "rapid-review",
  ),
  finding(
    "appointments-warning-signs-pregnancy-loss",
    "appointments-warning-signs",
    "Miscarriage, ectopic pregnancy and pregnancy loss",
    [
      "miscarriage",
      "ectopic pregnancy",
      "pregnancy loss",
      "early pregnancy loss",
      "stillbirth",
    ],
    "urgent",
    "P0",
    "Bleeding or pain does not diagnose a loss, but heavy bleeding, severe or one-sided pain, fainting or shoulder-tip pain needs urgent assessment.",
    [
      "A home test cannot show pregnancy location or progression. Seek compassionate follow-up after any confirmed loss, including physical recovery, emotional support and questions about future care.",
    ],
    ["acog-during-pregnancy", "cdc-warning"],
    "rapid-review",
  ),
  finding(
    "common-symptoms-preeclampsia",
    "common-symptoms",
    "Pre-eclampsia or preeclampsia",
    [
      "preeclampsia",
      "pre eclampsia",
      "pregnancy hypertension",
      "high blood pressure pregnancy",
    ],
    "urgent",
    "P0",
    "Pre-eclampsia is a serious blood-pressure disorder that can occur during pregnancy or after birth and cannot be ruled out by how well you feel.",
    [
      "A severe or persistent headache, vision changes, marked face or hand swelling, upper abdominal pain, trouble breathing or feeling seriously unwell needs prompt or emergency assessment.",
    ],
    ["acog-preeclampsia", "cdc-warning"],
    "rapid-review",
  ),
  finding(
    "common-symptoms-itching-cholestasis",
    "common-symptoms",
    "Severe itching and cholestasis",
    [
      "cholestasis",
      "ICP",
      "itchy palms",
      "itchy soles",
      "severe itching pregnancy",
    ],
    "contact-care",
    "P0",
    "Itching can have ordinary skin causes, but severe or persistent itching—especially on palms or soles—needs maternity assessment for pregnancy-specific liver disease.",
    [
      "Do not rely on the absence of a rash or treat it only with a cosmetic product. Ask how quickly testing and follow-up should happen.",
    ],
    ["nhs-symptoms-help", "nice-antenatal"],
    "rapid-review",
  ),
  finding(
    "common-symptoms-uti",
    "common-symptoms",
    "Painful urination and urinary infection",
    [
      "UTI",
      "urinary tract infection",
      "painful urination",
      "burning when peeing",
      "blood in urine",
    ],
    "contact-care",
    "P0",
    "Burning, pain, blood in urine, fever or new urinary symptoms need pregnancy-specific assessment rather than waiting for a routine visit.",
    [
      "Frequent urination alone can be common, but pain, fever, back or side pain, vomiting or feeling unwell changes the response.",
    ],
    ["nhs-pregnancy-symptoms", "cdc-infections"],
    "rapid-review",
  ),
  finding(
    "common-symptoms-discharge-thrush",
    "common-symptoms",
    "Vaginal discharge, thrush and changed odour",
    [
      "vaginal discharge",
      "thrush",
      "yeast infection",
      "changed discharge",
      "vaginal odor",
    ],
    "contact-care",
    "P0",
    "More discharge can be common, but a new smell, colour, irritation, pain, bleeding or possible watery leakage should be checked.",
    [
      "Ask before using a thrush or vaginal treatment because the exact diagnosis and product matter. Possible fluid leakage needs maternity assessment.",
    ],
    ["nhs-pregnancy-symptoms", "cdc-medicine"],
    "rapid-review",
  ),
  finding(
    "common-symptoms-piles-hemorrhoids",
    "common-symptoms",
    "Piles or haemorrhoids",
    [
      "piles",
      "haemorrhoids",
      "hemorrhoids",
      "rectal bleeding",
      "painful bowel movement",
    ],
    "contact-care",
    "P1",
    "Piles are swollen blood vessels around the anus and can cause itching, pain or bright-red bleeding, often alongside constipation.",
    [
      "Use fibre, fluids, comfortable movement and avoid straining. Check any cream or medicine first and ask about bleeding rather than assuming its source.",
    ],
    ["nhs-pregnancy-symptoms", "acog-digestive"],
  ),
  finding(
    "common-symptoms-round-ligament",
    "common-symptoms",
    "Round-ligament or stretching pain",
    [
      "round ligament pain",
      "stretching pain",
      "sharp groin pain",
      "side pain movement",
    ],
    "contact-care",
    "P1",
    "Brief pain linked to movement can have a musculoskeletal explanation, but new abdominal or groin pain should not be self-diagnosed from its location.",
    [
      "Change position slowly and note triggers. Seek prompt help for severe, persistent or one-sided pain, bleeding, fever, faintness or feeling unwell.",
    ],
    ["nhs-pregnancy-symptoms", "cdc-warning"],
  ),
  finding(
    "common-symptoms-pelvic-girdle",
    "common-symptoms",
    "Pelvic girdle pain and SPD",
    [
      "pelvic girdle pain",
      "SPD",
      "symphysis pubis dysfunction",
      "pubic bone pain",
    ],
    "contact-care",
    "P1",
    "Pelvic girdle pain can affect walking, stairs, turning in bed and getting in or out of a car; treatment and task changes can help.",
    [
      "Ask early for pelvic-health or physiotherapy support instead of repeatedly pushing through pain that changes movement or sleep.",
    ],
    ["nhs-pregnancy-symptoms", "acog-back-pain"],
  ),
  finding(
    "common-symptoms-sciatica",
    "common-symptoms",
    "Sciatica and pain travelling down a leg",
    ["sciatica", "shooting leg pain", "nerve pain leg", "back pain down leg"],
    "contact-care",
    "P1",
    "Pain travelling from the back or buttock into a leg deserves assessment when persistent, severe or limiting movement.",
    [
      "Seek urgent help for new weakness, loss of bladder or bowel control, numbness around the groin, fever or serious injury.",
    ],
    ["acog-back-pain", "nhs-pregnancy-symptoms"],
  ),
  finding(
    "common-symptoms-leg-cramps-varicose-veins",
    "common-symptoms",
    "Leg cramps and varicose veins",
    [
      "leg cramps",
      "calf cramp",
      "varicose veins",
      "aching legs",
      "veins in pregnancy",
    ],
    "contact-care",
    "P1",
    "Cramps and visible veins can be common, but one-sided pain, warmth, redness or swelling needs urgent assessment for a possible blood clot.",
    [
      "Gentle movement and avoiding long periods still may help ordinary discomfort; do not massage a newly painful or swollen calf.",
    ],
    ["nhs-pregnancy-symptoms", "cdc-warning"],
  ),
  finding(
    "common-symptoms-palpitations-fainting",
    "common-symptoms",
    "Palpitations, dizziness and fainting",
    [
      "heart racing",
      "palpitations",
      "dizzy",
      "dizziness",
      "fainting",
      "lightheaded",
    ],
    "contact-care",
    "P0",
    "A brief awareness of a faster heartbeat can occur, but persistent racing, fainting or symptoms with chest pain or breathlessness need prompt assessment.",
    [
      "Sit or lie somewhere safe if faint, rise gradually and tell your care team about repeated episodes even if they pass.",
    ],
    ["nhs-pregnancy-symptoms", "cdc-warning"],
    "rapid-review",
  ),
  finding(
    "common-symptoms-nosebleeds-gums",
    "common-symptoms",
    "Nosebleeds and bleeding gums",
    [
      "nosebleed",
      "bleeding nose",
      "bleeding gums",
      "gum swelling",
      "gingivitis",
    ],
    "contact-care",
    "P1",
    "Nasal and gum tissues may bleed more easily in pregnancy, but frequent, heavy or hard-to-stop bleeding deserves review.",
    [
      "Use a soft toothbrush and arrange dental care for sore or swollen gums. For a nosebleed, sit forward and pinch the soft nose; seek help if it will not stop.",
    ],
    ["nhs-pregnancy-symptoms", "acog-dental"],
  ),
  finding(
    "common-symptoms-carpal-tunnel",
    "common-symptoms",
    "Carpal tunnel, numb hands and wrist pain",
    [
      "carpal tunnel",
      "numb hands",
      "tingling fingers",
      "wrist pain",
      "pins and needles hands",
    ],
    "contact-care",
    "P1",
    "Fluid-related pressure at the wrist can cause night-time tingling, numbness or weakness, and task or splint advice may help.",
    [
      "Ask for assessment if weakness, persistent numbness, severe pain or symptoms in only one limb make daily tasks difficult.",
    ],
    ["nhs-pregnancy-symptoms", "acog-back-pain"],
  ),
  finding(
    "common-symptoms-braxton-hicks-labour",
    "common-symptoms",
    "Braxton Hicks, contractions and possible labour",
    [
      "Braxton Hicks",
      "practice contractions",
      "contractions",
      "am I in labor",
      "am I in labour",
      "tightenings",
    ],
    "contact-care",
    "P0",
    "Irregular tightenings can occur, but regular, painful or intensifying contractions—or any concern about labour before 37 weeks—need maternity guidance.",
    [
      "Time the pattern without delaying contact. Follow the labour plan your maternity service gave you rather than relying on a universal interval rule.",
    ],
    ["acog-labour-birth", "cdc-warning"],
    "rapid-review",
  ),
  finding(
    "common-symptoms-mucus-plug-waters",
    "common-symptoms",
    "Mucus plug, show and waters breaking",
    [
      "mucus plug",
      "bloody show",
      "waters broke",
      "water breaking",
      "leaking amniotic fluid",
      "fluid leak",
    ],
    "contact-care",
    "P0",
    "A show can happen before labour, while a gush or ongoing watery leak may mean the membranes have ruptured and needs maternity advice.",
    [
      "Note the time, colour, smell and amount, use a pad rather than a tampon, and contact maternity care—urgently for green or brown fluid, bleeding, fever or reduced movements.",
    ],
    ["acog-labour-birth", "cdc-warning"],
    "rapid-review",
  ),
  finding(
    "common-symptoms-reduced-movement",
    "common-symptoms",
    "Reduced or changed baby movement",
    [
      "reduced fetal movement",
      "reduced foetal movement",
      "baby not moving",
      "less movement",
      "kick count",
      "changed movements",
    ],
    "urgent",
    "P0",
    "A clear reduction or change in your baby's usual movement pattern needs immediate maternity assessment; do not wait until tomorrow.",
    [
      "Do not rely on a home Doppler, cold drink or an app to decide that the baby is well. Contact the maternity unit now.",
    ],
    ["cdc-warning", "acog-during-pregnancy"],
    "rapid-review",
  ),
  finding(
    "common-symptoms-headache-vision",
    "common-symptoms",
    "Severe headache or vision changes",
    [
      "severe headache",
      "blurred vision",
      "flashing lights",
      "vision changes",
      "spots in vision",
      "headache won't go away",
    ],
    "urgent",
    "P0",
    "A severe or persistent headache, blurred vision, flashing lights or spots can be a pregnancy warning sign and needs urgent assessment.",
    [
      "Seek urgent maternity advice, especially with swelling, upper abdominal pain, vomiting, breathlessness or high blood pressure.",
    ],
    ["acog-preeclampsia", "cdc-warning"],
    "rapid-review",
  ),
  finding(
    "common-symptoms-swelling-blood-clot",
    "common-symptoms",
    "Sudden swelling or possible blood clot",
    [
      "sudden swelling",
      "swollen face",
      "one swollen leg",
      "blood clot",
      "DVT",
      "deep vein thrombosis",
    ],
    "urgent",
    "P0",
    "Sudden face or hand swelling can accompany pre-eclampsia; one-sided leg pain, redness, warmth or swelling can suggest a clot.",
    [
      "Contact maternity care urgently. Call emergency services for chest pain, sudden breathlessness, coughing blood, collapse or a very fast heartbeat.",
    ],
    ["acog-preeclampsia", "cdc-warning"],
    "rapid-review",
  ),
  finding(
    "common-symptoms-breathlessness-chest-pain",
    "common-symptoms",
    "Breathlessness and chest pain",
    [
      "shortness of breath",
      "breathlessness",
      "chest pain",
      "difficulty breathing",
      "can't catch breath",
    ],
    "urgent",
    "P0",
    "New or severe breathing difficulty, chest pain, fainting or a racing heart is not a routine discomfort to monitor alone.",
    [
      "Call emergency services for severe or sudden symptoms. Contact your care team promptly for breathlessness that is new, worsening or limiting normal activity.",
    ],
    ["cdc-warning", "nhs-symptoms-help"],
    "rapid-review",
  ),
  finding(
    "common-symptoms-fever-rash",
    "common-symptoms",
    "Fever, rash or infectious exposure",
    [
      "fever",
      "high temperature",
      "rash",
      "infectious exposure",
      "fever in pregnancy",
      "unwell with rash",
    ],
    "contact-care",
    "P0",
    "Fever, a new widespread rash, or close contact with certain infections deserves same-day pregnancy-specific advice.",
    [
      "Tell the clinician the temperature, symptoms, timing, travel, workplace or childcare exposure, and vaccination history; ask before taking a medicine.",
    ],
    ["cdc-infections", "cdc-warning", "cdc-medicine"],
    "rapid-review",
  ),
  finding(
    "dental-skin-dental-treatment-xray",
    "dental-skin",
    "Dental treatment, local anaesthetic and dental X-rays",
    [
      "dentist",
      "dental x ray",
      "dental radiograph",
      "tooth filling",
      "root canal",
      "local anesthetic",
      "local anaesthetic",
    ],
    "check-first",
    "P0",
    "Do not delay urgent dental care because of pregnancy; tell the dental team so imaging, anaesthetic and medicines can be planned appropriately.",
    [
      "Routine prevention and treatment are part of health care. Review the exact pain relief, antibiotic and procedure with the dentist and maternity clinician when needed.",
    ],
    ["acog-dental", "cdc-medicine"],
    "rapid-review",
  ),
  finding(
    "dental-skin-hair-dye",
    "dental-skin",
    "Hair dye, bleach and salon treatments",
    [
      "hair dye",
      "hair bleach",
      "highlights",
      "colouring hair",
      "salon treatment",
    ],
    "check-first",
    "P1",
    "Hair products vary; reduce skin contact and fumes, follow label timing and ventilation instructions, and avoid use on irritated skin.",
    [
      "A patch test matters because skin reactions can change. Salon workers need a workplace exposure review, not only customer advice.",
    ],
    ["acog-skin", "cdc-workplace"],
  ),
  finding(
    "dental-skin-tanning-fake-tan",
    "dental-skin",
    "Fake tan, spray tan and tanning beds",
    [
      "fake tan",
      "self tanner",
      "spray tan",
      "tanning bed",
      "sunbed",
      "UV tanning",
    ],
    "avoid",
    "P1",
    "Avoid tanning beds and sunbeds because UV exposure and overheating are unnecessary risks; check spray or self-tan ingredients and inhalation exposure first.",
    [
      "Protect skin from sun and heat with shade, clothing and a suitable sunscreen instead of seeking a tan.",
    ],
    ["acog-skin", "acog-heat"],
  ),
  finding(
    "dental-skin-tattoo-piercing",
    "dental-skin",
    "New tattoos and piercings",
    ["tattoo", "piercing", "microblading", "permanent makeup", "body art"],
    "avoid",
    "P1",
    "It is reasonable to postpone elective tattoos, piercings, microblading and permanent makeup until after pregnancy because infection and product risks are avoidable.",
    [
      "Seek care for spreading redness, pus, fever, severe pain or an allergic reaction around an existing tattoo or piercing.",
    ],
    ["cdc-infections", "acog-skin"],
  ),
  finding(
    "dental-skin-manicure-pedicure",
    "dental-skin",
    "Manicure, pedicure and nail products",
    [
      "manicure",
      "pedicure",
      "gel nails",
      "acrylic nails",
      "nail polish",
      "nail salon",
    ],
    "check-first",
    "P1",
    "Choose a clean, well-ventilated salon, avoid cutting injured skin and leave if fumes make you unwell.",
    [
      "Nail technicians should ask for an occupational exposure and ventilation review because repeated work exposure differs from an occasional appointment.",
    ],
    ["acog-skin", "cdc-workplace"],
  ),
  finding(
    "dental-skin-massage-spa",
    "dental-skin",
    "Pregnancy massage and spa treatments",
    [
      "pregnancy massage",
      "prenatal massage",
      "spa day",
      "massage table",
      "deep tissue massage",
    ],
    "check-first",
    "P1",
    "Use a practitioner trained for pregnancy, comfortable positioning and a plan that avoids overheating; disclose complications before treatment.",
    [
      "Do not massage a painful or swollen calf. Ask first after bleeding, threatened preterm labour, blood-clot concerns, surgery or other complications.",
    ],
    ["acog-back-pain", "acog-heat", "cdc-warning"],
  ),
  finding(
    "dental-skin-essential-oils-aromatherapy",
    "dental-skin",
    "Essential oils and aromatherapy",
    [
      "essential oils",
      "aromatherapy",
      "diffuser oils",
      "tea tree oil",
      "lavender oil",
      "peppermint oil",
    ],
    "check-first",
    "P1",
    "Essential oils are active concentrated products, and safety depends on the oil, amount, route, exposure and health context.",
    [
      "Do not swallow oils or apply concentrated oils to skin. Review the exact product and intended use with a pharmacist or clinician.",
    ],
    ["cdc-medicine", "acog-skin"],
  ),
  finding(
    "dental-skin-cosmetic-procedures",
    "dental-skin",
    "Botox, fillers, peels and cosmetic laser",
    [
      "Botox",
      "botulinum toxin",
      "dermal fillers",
      "chemical peel",
      "laser hair removal",
      "cosmetic injections",
    ],
    "avoid",
    "P1",
    "Postpone non-essential cosmetic injections, strong peels and elective laser procedures because products and procedures vary and there is no health need to accept uncertainty now.",
    [
      "If a treatment happened before you knew you were pregnant, record the exact product, dose, date and clinic, then ask your care team rather than assuming harm.",
    ],
    ["cdc-medicine", "acog-skin"],
  ),
  finding(
    "infections-cmv",
    "infections-vaccines",
    "CMV exposure and hygiene",
    [
      "CMV",
      "cytomegalovirus",
      "toddler saliva",
      "childcare infection",
      "CMV pregnancy",
    ],
    "check-first",
    "P0",
    "People working with or caring for young children can reduce CMV exposure by careful handwashing and not sharing food, cups, cutlery or toothbrushes.",
    [
      "Ask your care team about a known exposure or symptoms; routine testing and interpretation depend on the clinical situation.",
    ],
    ["cdc-infections", "cdc-workplace"],
    "rapid-review",
  ),
  finding(
    "infections-parvovirus-slapped-cheek",
    "infections-vaccines",
    "Parvovirus B19 or slapped-cheek exposure",
    [
      "parvovirus",
      "parvovirus B19",
      "slapped cheek",
      "fifth disease",
      "erythema infectiosum",
    ],
    "contact-care",
    "P0",
    "Contact your maternity clinician after close parvovirus B19 exposure or a compatible rash or illness; testing and follow-up may be considered.",
    [
      "Give the exposure date and whether you work with children. Do not wait for a child-care outbreak to end before asking.",
    ],
    ["cdc-parvovirus", "cdc-workplace"],
    "rapid-review",
  ),
  finding(
    "infections-chickenpox-shingles",
    "infections-vaccines",
    "Chickenpox or shingles exposure",
    [
      "chickenpox",
      "varicella",
      "shingles exposure",
      "chicken pox",
      "vesicular rash",
    ],
    "contact-care",
    "P0",
    "If you develop a blistering rash or have significant chickenpox or shingles exposure and do not know you are immune, seek same-day maternity advice.",
    [
      "Call ahead before entering a clinic so they can prevent exposing others. Do not self-start leftover antiviral medicine.",
    ],
    ["cdc-infections", "cdc-medicine"],
    "rapid-review",
  ),
  finding(
    "infections-rubella-measles",
    "infections-vaccines",
    "Rubella or measles exposure",
    [
      "rubella",
      "German measles",
      "measles",
      "MMR exposure",
      "rash illness exposure",
    ],
    "contact-care",
    "P0",
    "Known exposure to measles or rubella, or a fever-and-rash illness, needs prompt advice with your vaccination and immunity history.",
    [
      "Call before attending in person. Live MMR vaccine is not given during pregnancy, so the clinician will advise on assessment and follow-up.",
    ],
    ["cdc-infections", "cdc-vaccines"],
    "rapid-review",
  ),
  finding(
    "infections-listeria-exposure",
    "infections-vaccines",
    "Listeria concern after recalled food",
    [
      "listeria",
      "listeriosis",
      "food recall",
      "ate recalled food",
      "fever after deli meat",
    ],
    "contact-care",
    "P0",
    "Eating a recalled food does not by itself diagnose infection, but fever or flu-like illness after a relevant exposure needs prompt pregnancy-specific advice.",
    [
      "Keep the product or recall details and describe symptoms and timing. Do not take antibiotics left over from another illness.",
    ],
    ["cdc-food", "cdc-infections", "cdc-medicine"],
    "rapid-review",
  ),
  finding(
    "infections-toxoplasmosis",
    "infections-vaccines",
    "Toxoplasmosis, cat litter and soil",
    [
      "toxoplasmosis",
      "cat litter",
      "cat poop",
      "gardening soil",
      "undercooked meat infection",
    ],
    "check-first",
    "P0",
    "Reduce toxoplasmosis exposure by avoiding undercooked meat, washing produce and hands, wearing gardening gloves and having someone else handle cat litter when possible.",
    [
      "If you must change litter, use gloves, change it daily and wash hands. Ask about a significant exposure rather than giving away a healthy cat.",
    ],
    ["cdc-infections", "cdc-food"],
    "rapid-review",
  ),
  finding(
    "infections-genital-herpes",
    "infections-vaccines",
    "Genital herpes or a new genital sore",
    [
      "genital herpes",
      "HSV",
      "herpes outbreak",
      "genital sore",
      "cold sore genital contact",
    ],
    "contact-care",
    "P0",
    "Tell your maternity team promptly about a first genital herpes episode, a new sore, or a partner with an active outbreak because timing affects care planning.",
    [
      "Avoid sexual contact involving an active sore and do not start or stop antiviral treatment without reviewing the exact plan with your clinician.",
    ],
    ["cdc-infections", "cdc-medicine"],
    "rapid-review",
  ),
  finding(
    "infections-hiv-hepatitis-b",
    "infections-vaccines",
    "HIV, hepatitis B and blood-borne infection testing",
    [
      "HIV test",
      "hepatitis B",
      "HBV",
      "blood borne infection",
      "antenatal infection screen",
    ],
    "check-first",
    "P0",
    "Early testing allows treatment and birth or newborn plans that can greatly reduce transmission; a result is private health information, not a moral judgement.",
    [
      "Ask how and when results are shared and what follow-up a positive or uncertain test would trigger. Do not stop existing treatment.",
    ],
    ["cdc-infections", "who-antenatal", "cdc-medicine"],
    "rapid-review",
  ),
  finding(
    "infections-flu-covid-vaccines",
    "infections-vaccines",
    "Flu, COVID-19 and respiratory illness",
    [
      "flu",
      "influenza",
      "COVID",
      "covid-19",
      "coronavirus",
      "respiratory infection",
    ],
    "contact-care",
    "P0",
    "Pregnancy changes the response to respiratory illness; ask promptly about testing, treatment timing and vaccines recommended for you.",
    [
      "Seek urgent help for difficulty breathing, chest pain, confusion, fainting, dehydration or reduced baby movement.",
    ],
    ["cdc-vaccines", "cdc-infections", "cdc-warning"],
    "rapid-review",
  ),
  finding(
    "mental-health-depression-anxiety",
    "mental-health",
    "Depression, anxiety and panic",
    [
      "depression",
      "anxiety",
      "panic attacks",
      "antenatal depression",
      "prenatal anxiety",
      "mental health pregnancy",
    ],
    "contact-care",
    "P0",
    "Persistent low mood, loss of interest, dread, panic or anxiety that affects sleep or daily life deserves care during pregnancy, not endurance in silence.",
    [
      "Tell a clinician how long it has lasted and what functioning has changed. Do not start or stop prescribed mental-health treatment without a review.",
    ],
    ["nhs-mental", "cdc-medicine"],
    "rapid-review",
  ),
  finding(
    "mental-health-intrusive-thoughts-harm",
    "mental-health",
    "Intrusive thoughts or thoughts of harm",
    [
      "intrusive thoughts",
      "suicidal thoughts",
      "self harm",
      "thoughts of harming baby",
      "can't keep safe",
      "mental health crisis",
    ],
    "urgent",
    "P0",
    "Thoughts of suicide, self-harm, harming someone else, or being unable to stay safe need immediate help and should not be managed alone.",
    [
      "Call emergency services or an urgent crisis service now, and ask a trusted person to stay with you. Intrusive thoughts can be treatable; disclosing them is a route to care.",
    ],
    ["nhs-mental", "cdc-warning"],
    "rapid-review",
  ),
  finding(
    "mental-health-bipolar-medication",
    "mental-health",
    "Bipolar disorder and psychiatric medicines",
    [
      "bipolar disorder",
      "mood stabilizer",
      "mood stabiliser",
      "lithium pregnancy",
      "antipsychotic pregnancy",
      "psychiatric medication",
    ],
    "contact-care",
    "P0",
    "Pregnancy and the postnatal period need a coordinated mental-health and maternity plan when you have bipolar disorder or take psychiatric medicines.",
    [
      "Do not stop or change prescribed treatment suddenly. Arrange review of the exact medicine, relapse history, sleep plan and early warning signs.",
    ],
    ["nhs-mental", "cdc-medicine"],
    "rapid-review",
  ),
  finding(
    "mental-health-eating-disorder",
    "mental-health",
    "Eating disorder, body image and food restriction",
    [
      "eating disorder",
      "anorexia",
      "bulimia",
      "binge eating",
      "food restriction",
      "body image",
    ],
    "contact-care",
    "P0",
    "An eating disorder or renewed restriction, bingeing, purging or distress about body change deserves confidential specialist support.",
    [
      "Tell the team what eating, fluids, supplements and medicines are actually manageable; care can focus on health without shame or weight-centred assumptions.",
    ],
    ["nhs-mental", "who-antenatal"],
    "rapid-review",
  ),
  finding(
    "mental-health-birth-trauma-fear",
    "mental-health",
    "Previous birth trauma or intense fear of birth",
    [
      "birth trauma",
      "tokophobia",
      "fear of childbirth",
      "scared of giving birth",
      "traumatic birth",
      "birth anxiety",
    ],
    "contact-care",
    "P1",
    "Severe fear or trauma symptoms deserve early discussion so appointments, consent, continuity and birth planning can reduce avoidable distress.",
    [
      "Ask for a named plan covering triggers, communication preferences, pain options, support people and how choices will be revisited if circumstances change.",
    ],
    ["nhs-mental", "acog-labour-birth"],
  ),
  finding(
    "mental-health-domestic-abuse-safety",
    "mental-health",
    "Domestic abuse, coercion or feeling unsafe",
    [
      "domestic abuse",
      "domestic violence",
      "coercive control",
      "unsafe at home",
      "partner hurts me",
      "reproductive coercion",
    ],
    "urgent",
    "P0",
    "Abuse can be physical, sexual, emotional, financial or controlling; it is not your fault and confidential support is available.",
    [
      "If danger is immediate, contact emergency services when safe. A maternity clinician can help you make a private safety plan without requiring you to confront the person.",
    ],
    ["nhs-mental", "cdc-warning"],
    "rapid-review",
  ),
  finding(
    "mental-health-substance-support",
    "mental-health",
    "Help with alcohol, nicotine or drug use",
    [
      "stop smoking",
      "quit vaping",
      "alcohol dependence",
      "drug dependence",
      "withdrawal",
      "substance use help",
    ],
    "contact-care",
    "P0",
    "Ask for confidential support with alcohol, nicotine, cannabis, prescribed dependence-forming medicines or other drugs; safer change depends on the substance and pattern of use.",
    [
      "Do not manage possible alcohol, sedative or opioid withdrawal alone. Tell the clinician the exact substance, amount, frequency and last use so they can plan safely.",
    ],
    ["acog-substances", "cdc-medicine", "nhs-mental"],
    "rapid-review",
  ),
];

const catalogFinding = ({
  id,
  sectionId,
  title,
  aliases,
  status = "check-first",
  priority = "P1",
  summary,
  detail,
  sourceIds,
  volatility = "annual",
}) =>
  finding(
    id,
    sectionId,
    title,
    aliases,
    status,
    priority,
    summary,
    [detail],
    sourceIds,
    volatility,
  );

const depthFindings = [
  catalogFinding({
    id: "food-dishes-raw-flour-cookie-dough",
    sectionId: "food-dishes",
    title: "Raw flour, cake batter and cookie dough",
    aliases: [
      "raw flour",
      "cookie dough",
      "cake batter",
      "raw dough",
      "licking the spoon",
    ],
    status: "avoid",
    summary:
      "Avoid uncooked flour and raw batter because flour can carry germs and recipes may also contain raw egg.",
    detail:
      "Cook or bake the mixture fully and wash bowls, utensils, hands and worktops after raw flour. Edible dough needs heat-treated flour and pasteurised egg or an egg-free recipe.",
    sourceIds: ["cdc-food", "nhs-food"],
  }),
  catalogFinding({
    id: "food-dishes-bagged-salad-precut-fruit",
    sectionId: "food-dishes",
    title: "Bagged salad and pre-cut fruit",
    aliases: [
      "bagged salad",
      "precut fruit",
      "pre cut fruit",
      "ready washed salad",
      "fruit cup",
    ],
    status: "check-first",
    summary:
      "Choose products kept properly cold, within date and without damaged packaging; freshly washed and prepared produce is easier to assess.",
    detail:
      "Follow the package washing instruction, keep the food refrigerated and eat it promptly after opening. Discard it after a recall or if storage temperature or handling is uncertain.",
    sourceIds: ["cdc-food", "nhs-food"],
  }),
  catalogFinding({
    id: "food-dishes-leftover-rice-pasta",
    sectionId: "food-dishes",
    title: "Leftover rice, pasta and grains",
    aliases: [
      "leftover rice",
      "reheated rice",
      "leftover pasta",
      "fried rice leftovers",
      "meal prep rice",
    ],
    status: "check-first",
    summary:
      "The important issue is time and temperature: cool leftovers promptly, refrigerate them and reheat until steaming throughout.",
    detail:
      "Do not eat cooked rice, pasta or grains that sat warm for a long time or have an uncertain storage history. Reheat only the portion you need and follow local food-storage guidance.",
    sourceIds: ["cdc-food", "nhs-food"],
  }),
  catalogFinding({
    id: "food-dishes-pate-meat-spreads",
    sectionId: "food-dishes",
    title: "Pâté and refrigerated meat spreads",
    aliases: [
      "pate",
      "meat spread",
      "liver pate",
      "refrigerated pate",
      "refrigerated meat spread",
    ],
    status: "avoid",
    summary:
      "Avoid refrigerated pâté and meat spreads during pregnancy; liver versions can also contain high vitamin A.",
    detail:
      "Do not assume a vegetarian refrigerated pâté has the same risk profile as a shelf-stable product. Check storage, ingredients and the exact product, and avoid liver-based versions.",
    sourceIds: ["cdc-food", "nhs-food"],
  }),
  catalogFinding({
    id: "food-dishes-refrigerated-dips-hummus",
    sectionId: "food-dishes",
    title: "Refrigerated dips, hummus and deli tubs",
    aliases: [
      "hummus",
      "refrigerated dip",
      "deli dip",
      "tahini dip",
      "opened hummus",
    ],
    status: "check-first",
    summary:
      "Choose a sealed in-date product kept cold, use clean utensils and follow the short after-opening storage instruction.",
    detail:
      "Avoid communal bowls that have sat out, damaged tubs and recalled products. Homemade dips need clean preparation, properly stored ingredients and prompt refrigeration.",
    sourceIds: ["cdc-food", "nhs-food"],
  }),
  catalogFinding({
    id: "food-dishes-game-meat-lead-shot",
    sectionId: "food-dishes",
    title: "Game meat and meat shot with lead ammunition",
    aliases: [
      "game meat",
      "venison",
      "pheasant",
      "lead shot meat",
      "wild game",
    ],
    status: "check-first",
    summary:
      "Game meat must be cooked thoroughly, and meat killed with lead ammunition raises a separate contamination question.",
    detail:
      "Ask how the animal was sourced and processed and whether non-lead ammunition was used. Avoid liver, raw or undercooked game and meat with an uncertain inspection or cold-chain history.",
    sourceIds: ["nhs-food", "cdc-food"],
  }),
  catalogFinding({
    id: "food-dishes-seaweed-iodine",
    sectionId: "food-dishes",
    title: "Seaweed, kelp and iodine-rich products",
    aliases: ["seaweed", "kelp", "nori", "wakame", "iodine food", "sea moss"],
    status: "check-first",
    summary:
      "Food portions of seaweed differ greatly in iodine; concentrated kelp, sea-moss and iodine products need an exact-product review.",
    detail:
      "Occasional nori is not the same as a daily kelp supplement or concentrated drink. Check the species, serving and iodine amount, especially with thyroid disease or a prenatal vitamin containing iodine.",
    sourceIds: ["acog-nutrition", "cdc-medicine"],
  }),
  catalogFinding({
    id: "food-dishes-peanuts-allergens",
    sectionId: "food-dishes",
    title: "Peanuts, nuts and allergenic foods",
    aliases: [
      "peanuts",
      "peanut butter",
      "nuts",
      "allergens pregnancy",
      "avoid peanuts",
    ],
    status: "generally-ok",
    summary:
      "There is no general pregnancy rule to avoid peanuts or other allergenic foods when you can eat them safely and have no allergy.",
    detail:
      "Avoid a food that causes your own allergic reaction and keep adrenaline or another prescribed emergency plan available as directed. Ask for nutrition help if multiple exclusions make eating difficult.",
    sourceIds: ["acog-nutrition", "nhs-food"],
  }),
  catalogFinding({
    id: "food-dishes-pineapple-papaya-myth",
    sectionId: "food-dishes",
    title: "Pineapple, papaya and miscarriage myths",
    aliases: [
      "pineapple",
      "papaya",
      "pineapple miscarriage",
      "papaya pregnancy",
      "fruit causes labor",
    ],
    status: "generally-ok",
    summary:
      "Ordinary portions of familiar ripe fruit are food, not a proven method to cause miscarriage or start labour.",
    detail:
      "Wash and store fruit safely and treat concentrated extracts, unripe preparations or medicinal amounts as a different product that needs checking. Seek care for symptoms rather than blaming one food.",
    sourceIds: ["acog-nutrition", "cdc-food"],
  }),
  catalogFinding({
    id: "food-dishes-dates-labour-myth",
    sectionId: "food-dishes",
    title: "Dates and foods claimed to start labour",
    aliases: [
      "dates fruit",
      "dates induce labor",
      "dates induce labour",
      "labor foods",
      "labour foods",
    ],
    status: "check-first",
    summary:
      "Dates can be eaten as food if they fit your diet, but no food should replace an individual plan for labour timing or induction.",
    detail:
      "Consider portion size when blood-sugar management matters. Do not use concentrated foods, oils or supplements to trigger labour without discussing the exact plan with maternity care.",
    sourceIds: ["acog-nutrition", "acog-labour-birth"],
  }),
  catalogFinding({
    id: "food-dishes-deli-salads-coleslaw",
    sectionId: "food-dishes",
    title: "Deli salads, coleslaw and prepared sandwich fillings",
    aliases: [
      "deli salad",
      "coleslaw",
      "potato salad",
      "egg salad",
      "prepared sandwich filling",
    ],
    status: "check-first",
    summary:
      "Prepared chilled salads are easier to trust when freshly made, continuously refrigerated, within date and handled with clean utensils.",
    detail:
      "Avoid a salad that has sat on a buffet, has an uncertain use-by time or contains raw egg or an unpasteurised ingredient. A freshly prepared home version gives clearer control.",
    sourceIds: ["cdc-food", "nhs-food"],
  }),
  catalogFinding({
    id: "food-dishes-frozen-fruit-smoothies",
    sectionId: "food-dishes",
    title: "Frozen fruit and shop-made smoothies",
    aliases: [
      "frozen fruit",
      "frozen berries",
      "smoothie",
      "shop smoothie",
      "smoothie bowl",
    ],
    status: "check-first",
    summary:
      "Check recalls, cold storage, washing instructions and whether every juice or dairy ingredient is pasteurised.",
    detail:
      "A made-to-order smoothie also depends on clean equipment and safe chilled ingredients. Avoid raw egg, unpasteurised juice and powders whose active ingredients are unclear.",
    sourceIds: ["cdc-food", "nhs-food"],
  }),
  catalogFinding({
    id: "food-dishes-foraged-mushrooms",
    sectionId: "food-dishes",
    title: "Foraged mushrooms and wild plants",
    aliases: [
      "foraged mushrooms",
      "wild mushrooms",
      "foraging pregnancy",
      "wild plants",
      "mushroom picking",
    ],
    status: "avoid",
    summary:
      "Avoid eating self-identified wild mushrooms or plants unless an appropriately qualified expert has confirmed the exact species and safety.",
    detail:
      "Cooking does not reliably make a poisonous species safe. If an uncertain wild mushroom or plant was eaten, contact poison or emergency advice promptly and keep a sample or photograph when safe.",
    sourceIds: ["cdc-food", "nhs-food"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "drinks-caffeine-matcha-yerba-mate",
    sectionId: "drinks-caffeine",
    title: "Matcha, yerba mate and concentrated tea",
    aliases: [
      "matcha",
      "yerba mate",
      "mate tea",
      "green tea powder",
      "concentrated tea",
    ],
    summary:
      "These drinks can contribute meaningful caffeine, and powders or large servings can differ from an ordinary cup of brewed tea.",
    detail:
      "Check the serving size and caffeine information when available, then count it with coffee, cola, chocolate and medicines toward the whole-day total.",
    sourceIds: ["acog-caffeine", "cdc-medicine"],
  }),
  catalogFinding({
    id: "drinks-caffeine-hot-chocolate-cocoa",
    sectionId: "drinks-caffeine",
    title: "Hot chocolate, cocoa and chocolate drinks",
    aliases: [
      "hot chocolate",
      "cocoa",
      "cacao drink",
      "chocolate milk",
      "mocha cocoa",
    ],
    status: "generally-ok",
    summary:
      "Chocolate drinks can fit, but caffeine, serving size, sugar and pasteurisation still belong in the whole-day picture.",
    detail:
      "Check large café drinks for espresso or energy ingredients and count their caffeine. Use pasteurised milk and avoid powders marketed with herbs, stimulants or very high vitamin doses.",
    sourceIds: ["acog-caffeine", "acog-nutrition"],
  }),
  catalogFinding({
    id: "drinks-caffeine-bubble-tea-boba",
    sectionId: "drinks-caffeine",
    title: "Bubble tea and boba",
    aliases: [
      "bubble tea",
      "boba",
      "boba tea",
      "milk tea pearls",
      "tapioca drink",
    ],
    summary:
      "A bubble tea can contain tea caffeine, a large portion of sugar and dairy or toppings whose storage matters.",
    detail:
      "Ask for the tea base, size and milk type, choose pasteurised dairy, and make sure cooked pearls and toppings have been handled and chilled or held safely.",
    sourceIds: ["acog-caffeine", "cdc-food"],
  }),
  catalogFinding({
    id: "drinks-caffeine-tonic-water-quinine",
    sectionId: "drinks-caffeine",
    title: "Tonic water and quinine",
    aliases: [
      "tonic water",
      "quinine",
      "gin and tonic without gin",
      "bitter lemon",
      "quinine drink",
    ],
    summary:
      "Tonic water is not the same as plain sparkling water because it contains quinine and may contain substantial sugar.",
    detail:
      "Check the label and serving size and use it as an occasional drink rather than a treatment for cramps. Medicinal quinine or concentrated products require clinical review.",
    sourceIds: ["cdc-medicine", "acog-nutrition"],
  }),
  catalogFinding({
    id: "drinks-caffeine-coconut-water",
    sectionId: "drinks-caffeine",
    title: "Coconut water",
    aliases: [
      "coconut water",
      "coconut drink",
      "electrolyte coconut water",
      "fresh coconut water",
    ],
    status: "generally-ok",
    summary:
      "Pasteurised packaged coconut water can be an ordinary drink; it is not a treatment for dehydration or a substitute for individual electrolyte advice.",
    detail:
      "Check refrigeration, use-by date, sugar and added ingredients. Fresh or unpasteurised coconut drinks and products with herbal or stimulant blends need a more careful check.",
    sourceIds: ["acog-nutrition", "cdc-food"],
  }),
  catalogFinding({
    id: "drinks-caffeine-tap-well-water",
    sectionId: "drinks-caffeine",
    title: "Tap water, private wells and boil-water notices",
    aliases: [
      "tap water",
      "well water",
      "boil water notice",
      "drinking water safety",
      "private well",
    ],
    summary:
      "Use the current public-water notice or recent private-well testing rather than judging water by taste, smell or clarity.",
    detail:
      "Follow boil or do-not-use instructions exactly and ask the relevant health authority about contaminants that boiling does not remove. Bottled water is not automatically free of every concern.",
    sourceIds: ["cdc-food", "who-antenatal"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "drinks-caffeine-unpasteurized-juice-cider",
    sectionId: "drinks-caffeine",
    title: "Unpasteurised juice, fresh cider and juice-bar drinks",
    aliases: [
      "unpasteurized juice",
      "unpasteurised juice",
      "fresh cider",
      "juice bar",
      "cold pressed juice",
    ],
    status: "avoid",
    summary:
      "Choose pasteurised juice during pregnancy; a fresh, raw or cold-pressed label does not mean the drink is free of harmful germs.",
    detail:
      "Check refrigerated bottles and made-to-order drinks for pasteurisation. Washing produce does not provide the same control as treating the finished juice.",
    sourceIds: ["cdc-food", "nhs-food"],
  }),
  catalogFinding({
    id: "drinks-caffeine-slushies-ice-machines",
    sectionId: "drinks-caffeine",
    title: "Slush drinks, fountain drinks and ice machines",
    aliases: [
      "slushie",
      "slushy",
      "fountain drink",
      "ice machine",
      "crushed ice drink",
    ],
    status: "check-first",
    summary:
      "The ingredients, caffeine and hygiene of the dispensing equipment matter more than the drink being cold or frozen.",
    detail:
      "Choose a visibly clean, well-maintained dispenser, check caffeine and stimulant ingredients, and avoid a machine or outlet with poor hygiene or an active water notice.",
    sourceIds: ["cdc-food", "acog-caffeine"],
  }),
  catalogFinding({
    id: "exercise-movement-resistance-machines-free-weights",
    sectionId: "exercise-movement",
    title: "Resistance machines, free weights and gym lifting",
    aliases: [
      "strength training",
      "weight lifting",
      "weightlifting",
      "lifting weights",
      "gym weights",
    ],
    status: "check-first",
    summary:
      "Strength work can often continue with sensible load, technique and breathing changes when pregnancy is uncomplicated and the movement feels stable.",
    detail:
      "Avoid maximal efforts, breath-holding and lifts where a fall or dropped weight could cause injury. Reduce load or range when form changes and ask about pain, bleeding, dizziness or complications.",
    sourceIds: ["acog-exercise", "acog-back-pain"],
  }),
  catalogFinding({
    id: "exercise-movement-hiit-intervals",
    sectionId: "exercise-movement",
    title: "HIIT and interval workouts",
    aliases: [
      "HIIT",
      "high intensity interval training",
      "interval workout",
      "bootcamp",
      "metcon",
    ],
    status: "check-first",
    summary:
      "High-intensity training needs an individual adjustment based on previous training, symptoms, heat, recovery and pregnancy complications.",
    detail:
      "Use an intensity that preserves control and avoids overheating, collision and breath-holding. Pregnancy is not the time to begin an unfamiliar maximal programme or chase performance records.",
    sourceIds: ["acog-exercise", "acog-heat"],
  }),
  catalogFinding({
    id: "exercise-movement-yoga-pilates",
    sectionId: "exercise-movement",
    title: "Yoga and Pilates outside a heated room",
    aliases: [
      "prenatal yoga",
      "pregnancy pilates",
      "yoga",
      "pilates",
      "reformer pilates",
    ],
    status: "check-first",
    summary:
      "Non-heated yoga or Pilates can often be adapted, but positions, balance, joint range and lying flat may need changes as pregnancy progresses.",
    detail:
      "Tell the instructor you are pregnant, avoid forceful stretching and breath-holding, and use support for balance. Stop for pain, bleeding, dizziness, contractions or fluid loss.",
    sourceIds: ["acog-exercise", "acog-back-pain"],
  }),
  catalogFinding({
    id: "exercise-movement-hiking-trails",
    sectionId: "exercise-movement",
    title: "Hiking and uneven trails",
    aliases: [
      "hiking",
      "trail walking",
      "mountain walk",
      "uneven trail",
      "long hike",
    ],
    status: "check-first",
    summary:
      "A familiar hike may remain possible, but distance, terrain, altitude, heat, weather and access to help change the decision.",
    detail:
      "Choose stable footwear, hydration, a turnaround point and company when appropriate. Avoid remote or technical terrain when balance, pain, breathlessness or pregnancy complications make self-rescue difficult.",
    sourceIds: ["acog-exercise", "acog-travel", "acog-heat"],
  }),
  catalogFinding({
    id: "exercise-movement-dance-aerobics",
    sectionId: "exercise-movement",
    title: "Dance, aerobics and fitness classes",
    aliases: [
      "dance class",
      "aerobics",
      "Zumba",
      "cardio class",
      "fitness class",
    ],
    status: "check-first",
    summary:
      "Familiar low-collision classes can often be modified, while jumps, rapid direction changes, overheating and crowded floors may increase risk.",
    detail:
      "Tell the instructor, keep space to move, lower impact when balance changes and stop for warning symptoms. Avoid any class culture that pressures you to ignore pain or clinical restrictions.",
    sourceIds: ["acog-exercise"],
  }),
  catalogFinding({
    id: "exercise-movement-trampoline-bounce",
    sectionId: "exercise-movement",
    title: "Trampolines, rebounders and bounce classes",
    aliases: [
      "trampoline",
      "rebounder",
      "bounce class",
      "mini trampoline",
      "trampolining",
    ],
    status: "avoid",
    summary:
      "Avoid trampoline and rebounder activities during pregnancy because an unpredictable fall or collision is difficult to control.",
    detail:
      "Choose a stable low-impact activity instead. Do not use prior skill as proof that another jumper, equipment failure or a changing centre of balance cannot cause injury.",
    sourceIds: ["acog-exercise"],
  }),
  catalogFinding({
    id: "exercise-movement-rowing-erg",
    sectionId: "exercise-movement",
    title: "Rowing machine and indoor erg workouts",
    aliases: [
      "rowing machine",
      "rower",
      "erg workout",
      "indoor rowing",
      "rowing pregnancy",
    ],
    status: "check-first",
    summary:
      "An indoor rower can sometimes be adjusted, but abdominal space, pelvic pressure, back comfort, intensity and technique may make it unsuitable later.",
    detail:
      "Reduce compression and load, keep breathing normally and stop if the stroke causes pain, heaviness, leakage, dizziness or contractions. Outdoor rowing adds capsize and rescue risk.",
    sourceIds: ["acog-exercise", "acog-back-pain"],
  }),
  catalogFinding({
    id: "exercise-movement-twins-complications",
    sectionId: "exercise-movement",
    title: "Exercise with twins or a pregnancy complication",
    aliases: [
      "exercise with twins",
      "multiple pregnancy exercise",
      "exercise placenta previa",
      "high risk pregnancy exercise",
      "exercise restriction",
    ],
    status: "check-first",
    priority: "P0",
    summary:
      "Multiple pregnancy and complications can change safe intensity, impact, travel distance and when activity should pause, so use an individual plan.",
    detail:
      "Ask what is encouraged, limited and prohibited for your exact diagnosis and what symptoms require contact. Do not copy restrictions—or clearance—from someone with a different complication.",
    sourceIds: ["acog-exercise", "acog-multiple-pregnancy"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "medicines-supplements-low-dose-aspirin-prescribed",
    sectionId: "medicines-supplements",
    title: "Prescribed low-dose aspirin",
    aliases: [
      "low dose aspirin",
      "baby aspirin",
      "aspirin for preeclampsia",
      "prescribed aspirin",
      "75 mg aspirin",
      "81 mg aspirin",
    ],
    status: "check-first",
    priority: "P0",
    summary:
      "Low-dose aspirin may be prescribed for specific pregnancy indications, but it is not a supplement to start, stop or adjust from a generic recommendation.",
    detail:
      "Confirm the exact tablet, dose, start and stop plan, missed-dose advice and interactions with the prescribing clinician or pharmacist. Ordinary pain-relief aspirin is a different use.",
    sourceIds: ["acog-preeclampsia", "cdc-medicine", "nhs-medicines"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "medicines-supplements-asthma-inhalers",
    sectionId: "medicines-supplements",
    title: "Asthma inhalers and breathing treatment",
    aliases: [
      "asthma inhaler",
      "salbutamol",
      "albuterol",
      "steroid inhaler",
      "asthma medication pregnancy",
    ],
    status: "check-first",
    priority: "P0",
    summary:
      "Keeping asthma controlled matters in pregnancy; review the exact preventer, reliever, spacer and action plan without stopping prescribed inhalers suddenly.",
    detail:
      "Ask which symptoms require urgent help and check inhaler technique and supply. Severe breathlessness, blue lips, fainting or a reliever that is not working needs emergency care.",
    sourceIds: ["cdc-medicine", "nhs-medicines", "cdc-warning"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "medicines-supplements-antidepressants-ssri",
    sectionId: "medicines-supplements",
    title: "Antidepressants and SSRIs",
    aliases: [
      "antidepressant",
      "SSRI",
      "sertraline",
      "fluoxetine",
      "citalopram",
      "escitalopram",
    ],
    status: "check-first",
    priority: "P0",
    summary:
      "The balance includes the exact medicine and the risk of untreated or relapsing illness; do not stop an antidepressant abruptly because of pregnancy.",
    detail:
      "Review dose, previous relapse, side effects, other medicines, birth and postnatal plans with the prescriber. Seek urgent help for suicidal thoughts, severe agitation or inability to stay safe.",
    sourceIds: ["acog-mental-health", "nhs-mental", "nhs-medicines"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "medicines-supplements-adhd-medicines",
    sectionId: "medicines-supplements",
    title: "ADHD medicines",
    aliases: [
      "ADHD medication",
      "methylphenidate",
      "amphetamine medicine",
      "lisdexamfetamine",
      "atomoxetine",
    ],
    status: "check-first",
    priority: "P0",
    summary:
      "ADHD treatment needs an exact medicine-and-function review; neither automatic continuation nor sudden stopping is a safe generic rule.",
    detail:
      "Discuss dose, blood pressure, appetite, sleep, driving or work safety, coexisting mental health and what happened during previous treatment changes.",
    sourceIds: ["cdc-medicine", "nhs-medicines", "acog-mental-health"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "medicines-supplements-anti-seizure-medicines",
    sectionId: "medicines-supplements",
    title: "Anti-seizure and epilepsy medicines",
    aliases: [
      "epilepsy medication",
      "anti seizure medicine",
      "anticonvulsant",
      "lamotrigine",
      "levetiracetam",
      "valproate",
    ],
    status: "check-first",
    priority: "P0",
    summary:
      "Seizure control and medicine-specific pregnancy risks both matter; do not miss, stop or switch prescribed anti-seizure treatment without specialist guidance.",
    detail:
      "Arrange prompt review of the exact medicine, dose, blood levels if relevant, folic-acid plan and seizure emergency plan. A seizure in pregnancy needs urgent medical assessment.",
    sourceIds: ["cdc-medicine", "nhs-medicines", "cdc-warning"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "medicines-supplements-thyroid-medicine",
    sectionId: "medicines-supplements",
    title: "Thyroid medicine",
    aliases: [
      "thyroid medication",
      "levothyroxine",
      "underactive thyroid",
      "overactive thyroid medicine",
      "antithyroid drug",
    ],
    status: "check-first",
    priority: "P0",
    summary:
      "Thyroid treatment usually needs planned monitoring during pregnancy; do not stop or alter the dose without the clinician managing the condition.",
    detail:
      "Confirm when blood tests are due, how the medicine should be taken around food, iron or calcium, and which palpitations, severe vomiting or other symptoms need earlier review.",
    sourceIds: ["cdc-medicine", "nhs-medicines", "acog-prenatal-care"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "medicines-supplements-diabetes-medicine-insulin",
    sectionId: "medicines-supplements",
    title: "Insulin and diabetes medicines",
    aliases: [
      "insulin pregnancy",
      "metformin pregnancy",
      "diabetes medication",
      "blood sugar medicine",
      "gestational diabetes medicine",
    ],
    status: "check-first",
    priority: "P0",
    summary:
      "Diabetes treatment is individual and can change during pregnancy; follow the prescribed glucose, food and medicine plan and report patterns promptly.",
    detail:
      "Know the exact low- and high-glucose action plan and who adjusts doses. Severe low glucose, vomiting with ketones, confusion or inability to keep fluids down needs urgent care.",
    sourceIds: ["acog-gestational-diabetes", "cdc-medicine", "cdc-warning"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "medicines-supplements-topical-steroid",
    sectionId: "medicines-supplements",
    title: "Topical steroid creams and ointments",
    aliases: [
      "steroid cream",
      "topical steroid",
      "hydrocortisone cream",
      "eczema cream",
      "corticosteroid ointment",
    ],
    status: "check-first",
    summary:
      "Topical steroids vary in strength and absorption by product, body area, amount, damaged skin and duration, so check the exact prescription or tube.",
    detail:
      "Use only as directed and do not substitute a stronger product or cover a large area without review. Seek assessment for infection, a spreading rash or severe widespread itching.",
    sourceIds: ["acog-skin", "nhs-medicines", "cdc-medicine"],
  }),
  catalogFinding({
    id: "medicines-supplements-antifungal-thrush-treatment",
    sectionId: "medicines-supplements",
    title: "Antifungal and thrush treatments",
    aliases: [
      "thrush treatment",
      "antifungal cream",
      "clotrimazole",
      "fluconazole",
      "yeast infection medicine",
    ],
    status: "check-first",
    summary:
      "Vaginal, skin and oral antifungals are not interchangeable; confirm the diagnosis, product, route and pregnancy plan before treating yourself.",
    detail:
      "New discharge, smell, pain, sores, bleeding or fluid leakage may have another cause. Avoid using leftover tablets or repeating treatment without review when symptoms persist.",
    sourceIds: ["nhs-medicines", "cdc-medicine", "nhs-pregnancy-symptoms"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "medicines-supplements-antiviral-medicine",
    sectionId: "medicines-supplements",
    title: "Antiviral medicines",
    aliases: [
      "antiviral medicine",
      "acyclovir",
      "aciclovir",
      "oseltamivir",
      "herpes medicine",
      "flu antiviral",
    ],
    status: "check-first",
    priority: "P0",
    summary:
      "Antiviral decisions depend on the infection, medicine and timing; some treatment is time-sensitive, so ask promptly rather than waiting for a routine visit.",
    detail:
      "Do not use another person's or leftover antiviral. Give the clinician the exact symptoms, exposure or test date, product, dose and pregnancy week.",
    sourceIds: ["cdc-infections", "cdc-medicine", "nhs-medicines"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "medicines-supplements-migraine-treatment",
    sectionId: "medicines-supplements",
    title: "Migraine medicines",
    aliases: [
      "migraine medicine",
      "triptan",
      "sumatriptan",
      "migraine prevention",
      "migraine injection",
    ],
    status: "check-first",
    priority: "P0",
    summary:
      "Migraine treatment needs an exact-product plan, and a new severe headache in pregnancy must not automatically be labelled as your usual migraine.",
    detail:
      "Review acute and preventive medicines with the prescriber. Seek urgent assessment for a sudden worst headache, new weakness, confusion, fever, high blood pressure or vision changes.",
    sourceIds: [
      "cdc-medicine",
      "nhs-medicines",
      "acog-preeclampsia",
      "cdc-warning",
    ],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "medicines-supplements-nasal-spray-eye-drops",
    sectionId: "medicines-supplements",
    title: "Nasal sprays and eye drops",
    aliases: [
      "nasal spray",
      "nose spray",
      "eye drops",
      "allergy eye drops",
      "decongestant spray",
    ],
    status: "check-first",
    summary:
      "Local products can still contain active medicines, and similar-looking sprays or drops may use different ingredients and strengths.",
    detail:
      "Check the active ingredient, frequency, reason and how long you plan to use it with a pharmacist. Eye pain, vision loss, severe headache or breathing difficulty needs prompt assessment.",
    sourceIds: ["nhs-medicines", "cdc-medicine"],
  }),
  catalogFinding({
    id: "medicines-supplements-local-anesthetic-numbing",
    sectionId: "medicines-supplements",
    title: "Local anaesthetic and numbing products",
    aliases: [
      "local anesthetic",
      "local anaesthetic",
      "lidocaine",
      "lignocaine",
      "numbing cream",
      "dental anesthetic",
    ],
    status: "check-first",
    summary:
      "Local anaesthetic decisions depend on the procedure, dose, route, body area and other ingredients; tell the treating clinician you are pregnant.",
    detail:
      "Do not apply a large amount of numbing cream or use an imported product without instructions. Necessary dental or minor medical treatment should be planned, not avoided without discussion.",
    sourceIds: ["acog-dental", "nhs-medicines", "cdc-medicine"],
  }),
  catalogFinding({
    id: "medicines-supplements-combination-cough-syrup",
    sectionId: "medicines-supplements",
    title: "Combination cough syrups and night remedies",
    aliases: [
      "cough syrup",
      "night nurse",
      "cold and flu syrup",
      "combination cold medicine",
      "cough medicine",
    ],
    status: "check-first",
    summary:
      "A cough or night product may combine pain relief, antihistamine, decongestant, suppressant, alcohol or herbal ingredients in one dose.",
    detail:
      "Read every active ingredient and avoid doubling one already taken in another product. Ask a pharmacist to match treatment to the actual symptom and pregnancy context.",
    sourceIds: ["nhs-medicines", "cdc-medicine"],
    volatility: "rapid-review",
  }),
];

const environmentAndDailyLifeFindings = [
  catalogFinding({
    id: "everyday-home-reptiles-amphibians",
    sectionId: "everyday-home",
    title: "Pet reptiles, amphibians and aquarium tanks",
    aliases: [
      "pet reptile",
      "snake",
      "lizard",
      "turtle",
      "frog",
      "aquarium cleaning",
    ],
    summary:
      "Reptiles and amphibians can carry Salmonella even when they look healthy, and tank water or equipment can spread contamination around the home.",
    detail:
      "If possible, have someone else clean enclosures. Otherwise use dedicated gloves, wash hands with soap immediately, keep equipment away from food areas and do not clean a tank in a kitchen sink.",
    sourceIds: ["cdc-infections", "cdc-food"],
  }),
  catalogFinding({
    id: "everyday-home-renovation-asbestos-lead-dust",
    sectionId: "everyday-home",
    title: "Renovation dust, asbestos and old lead paint",
    aliases: [
      "renovation",
      "asbestos",
      "lead paint",
      "sanding paint",
      "demolition dust",
      "old house renovation",
    ],
    status: "avoid",
    priority: "P0",
    summary:
      "Do not sand, scrape or demolish materials that may contain lead or asbestos; hidden hazards require assessment before dust is created.",
    detail:
      "Stay out of the work zone, prevent dust being tracked into living areas and use a qualified contractor where hazardous material is possible. Tell your care team about a substantial or repeated exposure.",
    sourceIds: ["cdc-workplace", "cdc-work-solvents"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "everyday-home-oven-drain-cleaners",
    sectionId: "everyday-home",
    title: "Oven cleaner, drain opener and corrosive cleaners",
    aliases: [
      "oven cleaner",
      "drain cleaner",
      "drain opener",
      "caustic soda",
      "corrosive cleaner",
    ],
    summary:
      "Corrosive cleaners can burn skin, eyes or lungs; pregnancy does not make ordinary safety controls optional or guarantee a product is suitable.",
    detail:
      "Use the label exactly, ventilate, wear specified protection and never mix cleaners. Leave the area and seek poison or emergency advice for breathing trouble, burns, eye exposure or a significant spill.",
    sourceIds: ["cdc-workplace", "cdc-warning"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "everyday-home-wood-smoke-fireplaces",
    sectionId: "everyday-home",
    title: "Wood smoke, fireplaces and solid-fuel stoves",
    aliases: [
      "wood smoke",
      "fireplace",
      "wood burner",
      "log burner",
      "solid fuel stove",
      "indoor smoke",
    ],
    summary:
      "Reduce indoor smoke and combustion exposure by maintaining appliances, using effective ventilation and keeping carbon-monoxide alarms working.",
    detail:
      "Do not remain in a smoky room or use an unvented fuel-burning heater indoors. Headache, dizziness, confusion, chest symptoms or several people feeling ill can signal carbon-monoxide exposure and needs urgent action.",
    sourceIds: ["cdc-workplace", "cdc-warning"],
  }),
  catalogFinding({
    id: "everyday-home-candles-incense-fragrance",
    sectionId: "everyday-home",
    title: "Candles, incense, diffusers and strong fragrance",
    aliases: [
      "scented candle",
      "incense",
      "reed diffuser",
      "home fragrance",
      "wax melt",
      "air freshener",
    ],
    summary:
      "Fragrance can worsen nausea, headache or asthma, while smoke and aerosol products add avoidable indoor irritants.",
    detail:
      "Prefer ventilation and the smallest practical exposure. Stop using a product that triggers breathing symptoms, and review concentrated essential-oil or medicinal claims rather than assuming that a natural fragrance is harmless.",
    sourceIds: ["cdc-workplace", "nhs-pregnancy-symptoms"],
  }),
  catalogFinding({
    id: "everyday-home-pest-foggers-fumigation",
    sectionId: "everyday-home",
    title: "Pest foggers, fumigation and concentrated pesticides",
    aliases: [
      "bug bomb",
      "pest fogger",
      "fumigation",
      "insecticide spray",
      "pesticide treatment",
      "exterminator",
    ],
    status: "avoid",
    priority: "P0",
    summary:
      "Avoid applying concentrated pesticide treatments yourself when a lower-exposure method or trained applicator can handle the problem.",
    detail:
      "Use nonchemical controls first where practical, follow re-entry and ventilation instructions exactly, protect food and surfaces and ask the applicator for the product name and safety data before treatment.",
    sourceIds: ["cdc-workplace", "cdc-medicine"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "everyday-home-dry-cleaning-solvents",
    sectionId: "everyday-home",
    title: "Dry-cleaning solvents and freshly cleaned clothing",
    aliases: [
      "dry cleaning",
      "dry cleaning solvent",
      "perc",
      "perchloroethylene",
      "fresh dry cleaned clothes",
    ],
    summary:
      "An occasional dry-cleaned garment is different from repeated workplace or poorly ventilated solvent exposure.",
    detail:
      "Air a garment that has a strong chemical smell and return it to the cleaner if the odour persists. Dry-cleaning workers should request a task-specific exposure review rather than relying on smell alone.",
    sourceIds: ["cdc-work-solvents", "cdc-workplace"],
  }),
  catalogFinding({
    id: "everyday-home-rodent-droppings-cleanup",
    sectionId: "everyday-home",
    title: "Rodent droppings, nests and contaminated storage",
    aliases: [
      "mouse droppings",
      "rat droppings",
      "rodent nest",
      "cleaning droppings",
      "mouse infestation",
    ],
    status: "avoid",
    summary:
      "Do not sweep or vacuum dry rodent waste, which can put contaminated dust into the air.",
    detail:
      "Keep away while another person ventilates and cleans with the recommended wet-disinfection method and appropriate protection. Ask public-health or pest-control professionals about a heavy infestation.",
    sourceIds: ["cdc-infections", "cdc-workplace"],
  }),
  catalogFinding({
    id: "everyday-home-pottery-glazes-stained-glass",
    sectionId: "everyday-home",
    title: "Pottery glazes, stained glass and lead-based crafts",
    aliases: [
      "pottery glaze",
      "ceramics studio",
      "stained glass",
      "lead solder",
      "lead craft",
      "ceramic dust",
    ],
    summary:
      "Some glazes, pigments, solder and studio dust contain lead or other metals, so the exact material and process matter more than the craft name.",
    detail:
      "Check safety data, use lead-free materials, avoid dry sweeping or eating in the work area and prevent contaminated shoes or clothes from entering living spaces. Repeated exposure deserves occupational review.",
    sourceIds: ["cdc-workplace", "cdc-work-ppe"],
  }),
  catalogFinding({
    id: "everyday-home-chemical-spill-poisoning",
    sectionId: "everyday-home",
    title: "Chemical spill, fumes or accidental poisoning",
    aliases: [
      "chemical spill",
      "poisoning",
      "inhaled fumes",
      "cleaner exposure",
      "chemical splash",
      "poison control",
    ],
    status: "urgent",
    priority: "P0",
    summary:
      "A significant inhalation, ingestion, eye splash, burn or spill needs product-specific poison or emergency advice; pregnancy is important context but not the only risk.",
    detail:
      "Move to fresh air when safe, rinse exposed skin or eyes as directed, keep the container or label available and do not induce vomiting unless a poison professional instructs you to.",
    sourceIds: ["cdc-warning", "cdc-workplace"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "work-lifting-ionizing-radiation-xray-staff",
    sectionId: "work-lifting",
    title: "X-ray, fluoroscopy and ionising-radiation work",
    aliases: [
      "x ray technician",
      "radiographer",
      "fluoroscopy",
      "radiation at work",
      "nuclear medicine",
      "ionizing radiation",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Pregnancy does not automatically exclude radiation work, but the employer must review dose, shielding, monitoring and tasks with the radiation-safety team.",
    detail:
      "Report the pregnancy through the confidential route available to you, wear monitoring correctly and do not improvise shielding or stop essential work without an occupational plan.",
    sourceIds: [
      "cdc-ionizing-radiation",
      "cdc-workplace",
      "cdc-pregnant-healthcare-workers",
    ],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "work-lifting-hazardous-drugs-chemotherapy",
    sectionId: "work-lifting",
    title: "Chemotherapy and other hazardous drugs at work",
    aliases: [
      "chemotherapy nurse",
      "hazardous drugs",
      "cytotoxic drugs",
      "antineoplastic drugs",
      "chemo at work",
      "oncology pharmacy",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Preparing, administering, transporting or cleaning waste from hazardous drugs needs a formal pregnancy-aware exposure plan.",
    detail:
      "Ask occupational health to review the exact agents, engineering controls, closed systems, spill procedures, PPE, waste and whether temporary task changes are needed; gloves alone are not a complete control system.",
    sourceIds: [
      "cdc-work-hazardous-drugs",
      "cdc-work-ppe",
      "cdc-pregnant-healthcare-workers",
    ],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "work-lifting-waste-anesthetic-gases",
    sectionId: "work-lifting",
    title: "Waste anaesthetic gases in theatres or dental rooms",
    aliases: [
      "anesthetic gas",
      "anaesthetic gas",
      "nitrous oxide at work",
      "operating room gas",
      "dental nitrous",
      "waste anesthetic gas",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Repeated workplace exposure to escaping anaesthetic gases depends on scavenging, ventilation, equipment maintenance and work practice.",
    detail:
      "Request an occupational assessment of the specific room and procedure. Odour is not a reliable exposure measure, and a mask intended for infection control does not replace gas capture and ventilation.",
    sourceIds: [
      "cdc-workplace",
      "cdc-pregnant-healthcare-workers",
      "cdc-work-ppe",
    ],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "work-lifting-solvents-degreasers-thinners",
    sectionId: "work-lifting",
    title: "Solvents, degreasers, thinners and adhesives at work",
    aliases: [
      "solvent exposure",
      "paint thinner",
      "degreaser",
      "industrial adhesive",
      "toluene",
      "xylene",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Solvents vary greatly, and repeated vapour or skin exposure needs review by exact chemical, concentration, task and ventilation.",
    detail:
      "Bring safety-data sheets to occupational health, ask about substitution and local exhaust, and prevent skin contact and take-home contamination. A respirator is a last control layer, not the first solution.",
    sourceIds: ["cdc-work-solvents", "cdc-work-ppe", "cdc-workplace"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "work-lifting-formaldehyde-disinfectants",
    sectionId: "work-lifting",
    title: "Formaldehyde, fixatives and high-level disinfectants",
    aliases: [
      "formaldehyde",
      "formalin",
      "glutaraldehyde",
      "pathology lab",
      "embalming fluid",
      "high level disinfectant",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Fixatives and high-level disinfectants can irritate or sensitize even below the point of an obvious spill, so routine handling needs engineered controls.",
    detail:
      "Ask for the safety-data sheet, exposure monitoring and ventilation assessment. Report eye, breathing or skin symptoms promptly and do not rely on smell or ordinary examination gloves as proof of control.",
    sourceIds: ["cdc-work-solvents", "cdc-work-ppe", "cdc-workplace"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "work-lifting-lead-metals-industrial-dust",
    sectionId: "work-lifting",
    title: "Lead, mercury and industrial metal exposure",
    aliases: [
      "lead at work",
      "mercury exposure",
      "heavy metals",
      "battery factory",
      "metal dust",
      "smelting",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Metal exposure may come from fumes, dust, contaminated surfaces or take-home clothing and needs material-specific occupational assessment.",
    detail:
      "Ask about substitution, air controls, hygiene, separate work clothing and appropriate biological monitoring. Do not eat, drink or apply cosmetics in a contaminated work area.",
    sourceIds: ["cdc-workplace", "cdc-work-ppe"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "work-lifting-take-home-contamination",
    sectionId: "work-lifting",
    title: "Take-home dust on work clothes, shoes or tools",
    aliases: [
      "take home exposure",
      "dirty work clothes",
      "work dust at home",
      "contaminated shoes",
      "occupational dust laundry",
    ],
    priority: "P0",
    summary:
      "Lead, pesticide, drug or other hazardous dust can travel from work into a car or home on skin, clothing, shoes, bags and tools.",
    detail:
      "Change and wash at work where available, keep work items out of living areas and launder contaminated clothing through the employer's procedure rather than with household clothes.",
    sourceIds: ["cdc-workplace", "cdc-work-ppe"],
  }),
  catalogFinding({
    id: "work-lifting-respirator-fit-pregnancy",
    sectionId: "work-lifting",
    title: "Respirator fit and breathing protection during pregnancy",
    aliases: [
      "respirator",
      "N95 fit",
      "mask fit test",
      "PAPR",
      "breathing protection",
      "respirator pregnancy",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Changes in face shape, breathing or work tolerance can affect respirator use, and the equipment must match the hazard and formal respiratory-protection programme.",
    detail:
      "Ask for re-evaluation or fit testing when required, report dizziness or breathing difficulty and do not substitute an untested mask or improvised seal for approved equipment.",
    sourceIds: [
      "cdc-work-ppe",
      "cdc-pregnant-healthcare-workers",
      "cdc-workplace",
    ],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "work-lifting-aircrew-cosmic-radiation",
    sectionId: "work-lifting",
    title: "Aircrew, frequent flying and cosmic radiation",
    aliases: [
      "flight attendant",
      "pilot pregnancy",
      "aircrew",
      "cosmic radiation",
      "frequent work flights",
      "cabin crew",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Flight crew may accumulate altitude-related radiation and circadian exposure that ordinary occasional travellers do not.",
    detail:
      "Ask occupational health to assess route, altitude, hours, night work and radiation estimates together, plus the airline's pregnancy duties and later-pregnancy restrictions.",
    sourceIds: ["cdc-ionizing-radiation", "cdc-workplace", "acog-travel"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "work-lifting-commercial-kitchen-heat",
    sectionId: "work-lifting",
    title: "Commercial kitchens, bakery heat and smoke",
    aliases: [
      "kitchen work",
      "chef pregnancy",
      "bakery heat",
      "restaurant kitchen",
      "cooking smoke at work",
    ],
    status: "contact-care",
    summary:
      "Hot, humid work with prolonged standing can make hydration, overheating, slips and missed breaks more important than cooking itself.",
    detail:
      "Plan cool breaks, accessible water, ventilation, safer lifting and a route to sit down. Escalate fainting, confusion, persistent contractions or inability to cool rather than finishing the shift.",
    sourceIds: ["cdc-workplace", "acog-heat", "acog-exercise"],
  }),
  catalogFinding({
    id: "work-lifting-loud-noise-hearing-protection",
    sectionId: "work-lifting",
    title: "Loud noise, concerts and hearing protection at work",
    aliases: [
      "loud noise",
      "concert worker",
      "factory noise",
      "hearing protection",
      "music venue work",
    ],
    summary:
      "A noisy job should be assessed by measured exposure and task, not by whether the sound merely feels tolerable.",
    detail:
      "Use the employer's noise controls and correctly fitted hearing protection, keep distance from high-intensity sources where possible and request occupational review for sustained or very loud exposure.",
    sourceIds: ["cdc-workplace", "cdc-work-ppe"],
  }),
  catalogFinding({
    id: "work-lifting-vibration-heavy-machinery",
    sectionId: "work-lifting",
    title: "Whole-body vibration and heavy machinery",
    aliases: [
      "vibration at work",
      "forklift",
      "heavy machinery",
      "tractor driving",
      "construction equipment",
      "whole body vibration",
    ],
    status: "contact-care",
    summary:
      "Repeated jolting, vibration, awkward access and fall risk need task-specific review as pregnancy changes balance and fit.",
    detail:
      "Ask about smoother equipment, speed limits, seat and belt fit, shorter exposure blocks and alternative tasks. Stop for pain, bleeding, leaking fluid, contractions or dizziness and contact care.",
    sourceIds: ["cdc-workplace", "acog-exercise"],
  }),
  catalogFinding({
    id: "work-lifting-needlestick-body-fluid-exposure",
    sectionId: "work-lifting",
    title: "Needlestick, sharps or body-fluid exposure",
    aliases: [
      "needlestick",
      "needle stick",
      "sharps injury",
      "blood splash",
      "body fluid exposure",
      "occupational exposure",
    ],
    status: "urgent",
    priority: "P0",
    summary:
      "Report a sharps injury or significant blood or body-fluid exposure immediately; time-sensitive testing and preventive treatment may be considered.",
    detail:
      "Wash or rinse the exposed area as directed, use the workplace exposure pathway now and tell the assessing clinician you are pregnant. Do not wait for a routine prenatal visit.",
    sourceIds: [
      "cdc-pregnant-healthcare-workers",
      "cdc-infections",
      "cdc-warning",
    ],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "work-lifting-infection-outbreak-reassignment",
    sectionId: "work-lifting",
    title: "Infection outbreak, isolation rooms and reassignment",
    aliases: [
      "infection outbreak at work",
      "isolation room",
      "pregnant nurse exposure",
      "school outbreak",
      "work reassignment infection",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Pregnant workers are not automatically excluded from infection care, but immunity, pathogen, exposure route and controls must be reviewed quickly.",
    detail:
      "Report a specific exposure through occupational health, confirm vaccination or immunity records where relevant and use the required precautions. Reassignment should follow an individual risk assessment, not a blanket rule.",
    sourceIds: [
      "cdc-pregnant-healthcare-workers",
      "cdc-infections",
      "cdc-work-ppe",
    ],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "travel-airport-security-scanners",
    sectionId: "travel",
    title: "Airport security scanners and metal detectors",
    aliases: [
      "airport scanner",
      "airport security pregnancy",
      "metal detector",
      "body scanner",
      "security x ray",
    ],
    status: "generally-ok",
    summary:
      "Passenger metal detectors and security body scanners are different from medical X-rays and are generally used within public-safety standards.",
    detail:
      "You may ask security staff what technology is being used or request the available alternative screening process. Baggage X-ray machines are for luggage; do not enter restricted equipment areas.",
    sourceIds: ["cdc-ionizing-radiation", "acog-travel"],
  }),
  catalogFinding({
    id: "travel-airline-cutoff-medical-certificate",
    sectionId: "travel",
    title: "Airline pregnancy cut-offs and medical certificates",
    aliases: [
      "fit to fly letter",
      "airline pregnancy rule",
      "medical certificate flying",
      "pregnancy flight cutoff",
      "airline doctor letter",
    ],
    priority: "P0",
    summary:
      "Carrier rules can depend on pregnancy week, twins, route and certificate date, and may be stricter than medical guidance.",
    detail:
      "Check the operating airline for every leg before booking and again before travel. Carry the required dated letter and records, but remember that airline acceptance is not medical clearance.",
    sourceIds: ["acog-travel", "nhs-appointments"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "travel-diarrhea-food-poisoning",
    sectionId: "travel",
    title: "Traveller's diarrhoea and food poisoning away from home",
    aliases: [
      "travelers diarrhea",
      "traveller's diarrhoea",
      "food poisoning abroad",
      "diarrhea on vacation",
      "stomach bug travel",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Diarrhoea or vomiting during travel can become a hydration problem quickly, and fever, blood, severe pain or reduced urination changes the urgency.",
    detail:
      "Use safe fluids and contact local care or your maternity team for worsening symptoms. Do not self-treat with leftover antibiotics, anti-diarrhoeal medicine or an unfamiliar remedy without checking the exact product.",
    sourceIds: ["acog-travel", "cdc-food", "nhs-medicines"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "travel-road-trips-breaks-seatbelt",
    sectionId: "travel",
    title: "Long road trips, breaks and seat-belt fit",
    aliases: [
      "road trip",
      "long car ride",
      "driving while pregnant",
      "car travel",
      "seat belt pregnancy",
    ],
    priority: "P0",
    summary:
      "Long car travel needs correctly positioned restraints, planned movement breaks, hydration and a route to maternity care if symptoms start.",
    detail:
      "Wear the lap belt low across the hips below the bump and the shoulder belt across the chest; never place it behind the back or under an arm. Stop safely for warning symptoms.",
    sourceIds: ["nhtsa-seat-belts", "acog-travel"],
  }),
  catalogFinding({
    id: "travel-bus-train-standing-falls",
    sectionId: "travel",
    title: "Bus and train travel, standing and fall risk",
    aliases: [
      "bus travel",
      "train travel",
      "public transport",
      "standing on train",
      "commuting pregnant",
    ],
    status: "generally-ok",
    summary:
      "Public transport is usually practical, but crowding, sudden movement, luggage and long standing can raise fall or fainting risk.",
    detail:
      "Use a handrail, sit when available, keep luggage manageable and plan access to water and toilets. If dizziness starts, sit or lie safely rather than trying to remain standing.",
    sourceIds: ["acog-travel", "acog-exercise"],
  }),
  catalogFinding({
    id: "travel-prescriptions-time-zones",
    sectionId: "travel",
    title: "Prescriptions, refrigeration and time-zone changes",
    aliases: [
      "medicine time zone",
      "insulin travel",
      "travel with prescriptions",
      "medication schedule flight",
      "refrigerated medicine travel",
    ],
    priority: "P0",
    summary:
      "Time zones, delays, refrigeration and security rules can disrupt a medicine plan, especially for insulin, anticoagulants or precisely timed treatment.",
    detail:
      "Before travel, ask the prescriber or pharmacist for a written timing and storage plan for the exact product. Keep medicines and documentation in hand luggage and carry enough for delays.",
    sourceIds: ["acog-travel", "nhs-medicines"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "travel-accommodation-heat-bed-safety",
    sectionId: "travel",
    title: "Accommodation, extreme heat and access to care",
    aliases: [
      "hotel pregnancy",
      "vacation rental",
      "hot hotel room",
      "remote accommodation",
      "pregnancy holiday planning",
    ],
    summary:
      "A destination may be easy to reach but still lack cooling, safe water, transport or nearby maternity assessment.",
    detail:
      "Check sleeping temperature, water, food storage, stairs or fall hazards, travel time to care and how to call for help. Build the plan around the least replaceable need, not just sightseeing.",
    sourceIds: ["acog-travel", "acog-heat"],
  }),
  catalogFinding({
    id: "sex-relationships-oral-sex-air-embolism",
    sectionId: "sex-relationships",
    title: "Oral sex and avoiding air blown into the vagina",
    aliases: [
      "oral sex",
      "cunnilingus",
      "blowing air vagina",
      "air embolism sex",
      "oral sex pregnancy",
    ],
    status: "generally-ok",
    priority: "P0",
    summary:
      "Oral sex is generally compatible with an uncomplicated pregnancy, but a partner should never forcefully blow air into the vagina.",
    detail:
      "Use barriers when STI exposure is possible and avoid contact with an active cold sore or genital lesion. Follow any individualized pelvic-rest or infection advice from your clinician.",
    sourceIds: ["acog-during-pregnancy", "cdc-infections"],
  }),
  catalogFinding({
    id: "sex-relationships-anal-sex-hygiene",
    sectionId: "sex-relationships",
    title: "Anal sex, haemorrhoids and hygiene",
    aliases: [
      "anal sex",
      "hemorrhoids sex",
      "haemorrhoids sex",
      "anal intercourse",
      "anal to vaginal sex",
    ],
    summary:
      "Anal sex may be uncomfortable with haemorrhoids or constipation, and moving a toy, penis or fingers from anus to vagina without cleaning can transfer bacteria.",
    detail:
      "Use a new condom or thoroughly clean before vaginal contact, stop for pain or bleeding and seek care for significant bleeding, fever, severe pain or an injury.",
    sourceIds: ["acog-during-pregnancy", "cdc-infections", "acog-digestive"],
  }),
  catalogFinding({
    id: "sex-relationships-libido-arousal-changes",
    sectionId: "sex-relationships",
    title: "Libido and arousal changes",
    aliases: [
      "low libido",
      "high sex drive",
      "no interest in sex",
      "pregnancy libido",
      "arousal changes",
    ],
    status: "generally-ok",
    summary:
      "Interest in sex can rise, fall or change repeatedly with nausea, fatigue, body changes, hormones, stress and relationship context.",
    detail:
      "No amount of sexual interest is required. Use clear consent, adjust expectations and choose other forms of closeness; contact care if distress, pain, depression or relationship pressure is driving the change.",
    sourceIds: ["acog-during-pregnancy", "acog-mental-health"],
  }),
  catalogFinding({
    id: "sex-relationships-painful-sex",
    sectionId: "sex-relationships",
    title: "Pain during sex",
    aliases: [
      "painful sex",
      "dyspareunia",
      "sex hurts",
      "pain during intercourse",
      "pelvic pain sex",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "New, persistent or severe pain during sex deserves assessment rather than being accepted as an inevitable pregnancy symptom.",
    detail:
      "Stop the activity, note the location and whether there is bleeding, discharge, urinary pain, contractions or fluid loss, and contact your care team for guidance.",
    sourceIds: ["acog-during-pregnancy", "nhs-symptoms-help"],
  }),
  catalogFinding({
    id: "sex-relationships-semen-labour-myth",
    sectionId: "sex-relationships",
    title: "Sex or semen claimed to start labour",
    aliases: [
      "sex induce labor",
      "sex induce labour",
      "semen start labor",
      "orgasm start labour",
      "natural induction sex",
    ],
    summary:
      "Sex is not a reliable do-it-yourself induction method, and whether it is appropriate depends on pregnancy complications, membranes, bleeding and clinician advice.",
    detail:
      "Do not use intercourse to override a recommendation to avoid sex or to manage a concern about overdue pregnancy. Ask your maternity team about evidence-based next steps and when assessment is due.",
    sourceIds: ["acog-labour-birth", "acog-during-pregnancy"],
  }),
  catalogFinding({
    id: "sex-relationships-consent-pressure-safety",
    sectionId: "sex-relationships",
    title: "Consent, sexual pressure and reproductive coercion",
    aliases: [
      "sexual pressure",
      "forced sex",
      "reproductive coercion",
      "partner pressures sex",
      "consent pregnancy",
    ],
    status: "urgent",
    priority: "P0",
    summary:
      "Pregnancy never removes the need for consent; pressure, forced sex, contraception sabotage or threats are abuse and are not your fault.",
    detail:
      "If you are in immediate danger, use emergency help when safe. A clinician can speak with you privately, document injuries, address STI or pregnancy concerns and help make a confidential safety plan.",
    sourceIds: ["acog-ipv", "nhs-mental", "cdc-warning"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "sleep-comfort-left-versus-right-side",
    sectionId: "sleep-comfort",
    title: "Left side versus right side sleeping",
    aliases: [
      "left side sleeping",
      "right side sleeping",
      "which side sleep",
      "sleeping side pregnancy",
      "must sleep left",
    ],
    status: "generally-ok",
    priority: "P0",
    summary:
      "Side sleeping later in pregnancy does not mean only the left side is allowed; comfort, symptoms and individual advice still matter.",
    detail:
      "Use either side and change position as needed. If one position causes breathlessness, dizziness, pain or feeling unwell, move and discuss recurring symptoms with your care team.",
    sourceIds: ["acog-sleep", "acog-during-pregnancy"],
  }),
  catalogFinding({
    id: "sleep-comfort-pregnancy-pillows-positioners",
    sectionId: "sleep-comfort",
    title: "Pregnancy pillows, wedges and sleep positioners",
    aliases: [
      "pregnancy pillow",
      "body pillow",
      "sleep wedge",
      "maternity pillow",
      "sleep positioner",
    ],
    status: "generally-ok",
    summary:
      "A pillow or wedge can support the bump, back or knees, but no special product guarantees safer sleep or treats a medical problem.",
    detail:
      "Choose a stable setup that does not trap you, block breathing or create a fall hazard when getting up. Persistent pain, breathing pauses or severe reflux needs assessment beyond a pillow purchase.",
    sourceIds: ["acog-sleep", "acog-back-pain"],
  }),
  catalogFinding({
    id: "sleep-comfort-naps-daytime-sleepiness",
    sectionId: "sleep-comfort",
    title: "Naps and severe daytime sleepiness",
    aliases: [
      "napping",
      "daytime sleepiness",
      "pregnancy fatigue",
      "falling asleep daytime",
      "need a nap",
    ],
    status: "generally-ok",
    summary:
      "A planned nap can help, but sleepiness that makes driving, work or ordinary activity unsafe needs a cause-focused review.",
    detail:
      "Do not drive or operate equipment when fighting sleep. Mention sudden or extreme fatigue, faintness, breathlessness, loud snoring or sleep attacks to your clinician.",
    sourceIds: ["acog-sleep", "nhs-pregnancy-symptoms"],
  }),
  catalogFinding({
    id: "sleep-comfort-cpap-sleep-apnea-treatment",
    sectionId: "sleep-comfort",
    title: "CPAP and diagnosed sleep apnoea",
    aliases: [
      "CPAP",
      "sleep apnea",
      "sleep apnoea",
      "CPAP pregnancy",
      "breathing machine sleep",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Continue to involve the sleep and maternity teams in diagnosed sleep apnoea; pregnancy changes may require mask, pressure or symptom review.",
    detail:
      "Do not stop prescribed CPAP because of pregnancy. Report poor fit, inability to tolerate treatment, worsening snoring, gasping, morning headache or severe daytime sleepiness.",
    sourceIds: ["acog-sleep", "nhs-medicines"],
  }),
  catalogFinding({
    id: "sleep-comfort-vivid-dreams-nightmares",
    sectionId: "sleep-comfort",
    title: "Vivid dreams and nightmares",
    aliases: [
      "vivid dreams",
      "pregnancy nightmares",
      "bad dreams",
      "dreams about baby",
      "disturbing dreams",
    ],
    status: "generally-ok",
    summary:
      "Vivid or disturbing dreams can become more noticeable with fragmented sleep, stress and major life changes and are not predictions.",
    detail:
      "Use a steady wind-down routine and discuss dreams that trigger panic, trauma symptoms, avoidance of sleep or daytime distress; those effects matter even when the dream itself is common.",
    sourceIds: ["acog-sleep", "acog-mental-health"],
  }),
  catalogFinding({
    id: "sleep-comfort-heartburn-night",
    sectionId: "sleep-comfort",
    title: "Night-time heartburn and reflux",
    aliases: [
      "heartburn at night",
      "reflux sleep",
      "acid reflux bed",
      "GERD pregnancy",
      "indigestion night",
    ],
    summary:
      "Meal timing and a raised upper body may reduce night reflux, but severe chest or upper-abdominal pain should not be assumed to be ordinary heartburn.",
    detail:
      "Avoid lying flat immediately after eating and ask a pharmacist or clinician before choosing an antacid or reflux medicine. Seek urgent advice for chest pressure, breathlessness, fainting or severe persistent pain.",
    sourceIds: ["acog-digestive", "nhs-medicines", "cdc-warning"],
  }),
  catalogFinding({
    id: "sleep-comfort-nasal-congestion-mouth-breathing",
    sectionId: "sleep-comfort",
    title: "Nasal congestion disturbing sleep",
    aliases: [
      "blocked nose at night",
      "pregnancy rhinitis",
      "nasal congestion sleep",
      "mouth breathing",
      "stuffy nose pregnancy",
    ],
    summary:
      "Pregnancy-related nasal congestion can disturb sleep, but fever, facial pain, breathing difficulty or prolonged symptoms may point to another cause.",
    detail:
      "Try non-drug measures such as saline and humidification if suitable, and check the exact nasal spray or decongestant with a pharmacist before use.",
    sourceIds: ["nhs-pregnancy-symptoms", "nhs-medicines"],
  }),
  catalogFinding({
    id: "sleep-comfort-getting-out-of-bed-fall-risk",
    sectionId: "sleep-comfort",
    title: "Getting out of bed, night urination and fall prevention",
    aliases: [
      "getting out of bed",
      "night bathroom pregnancy",
      "fall at night",
      "dizzy getting up",
      "nocturia pregnancy",
    ],
    status: "generally-ok",
    summary:
      "Frequent night urination plus dizziness, loose rugs or darkness can make falls more likely even when each issue seems minor.",
    detail:
      "Sit before standing, use a clear lit path and stable footwear, and keep essentials within reach. Contact care for fainting, a fall onto the abdomen, bleeding, leaking fluid, pain or reduced movement.",
    sourceIds: ["acog-during-pregnancy", "cdc-warning"],
  }),
];

const testingAndSymptomDepthFindings = [
  catalogFinding({
    id: "appointments-warning-signs-first-prenatal-appointment",
    sectionId: "appointments-warning-signs",
    title: "First prenatal appointment and pregnancy confirmation",
    aliases: [
      "first prenatal visit",
      "first midwife appointment",
      "booking appointment",
      "pregnancy confirmation appointment",
      "first ob appointment",
    ],
    priority: "P0",
    summary:
      "The first contact should establish medicines, medical and pregnancy history, current symptoms, support needs and the local plan for examinations, tests and scans.",
    detail:
      "Bring the first day of the last period if known, any clinician-given due date, medicine and supplement names, previous records and questions. Seek earlier care for warning symptoms rather than waiting for the booking visit.",
    sourceIds: ["acog-prenatal-care", "who-antenatal", "nhs-appointments"],
  }),
  catalogFinding({
    id: "appointments-warning-signs-dating-ultrasound",
    sectionId: "appointments-warning-signs",
    title: "Dating ultrasound and estimated due date",
    aliases: [
      "dating scan",
      "dating ultrasound",
      "due date scan",
      "viability scan",
      "early pregnancy ultrasound",
    ],
    priority: "P0",
    summary:
      "A dating ultrasound can help establish gestational age, number of fetuses and pregnancy location, but the reason and timing depend on local care and symptoms.",
    detail:
      "Ask what question the scan is meant to answer and whether a repeat may be needed if it is too early for a definite result. A clinician-provided due date should remain the timeline baseline unless the care team changes it.",
    sourceIds: ["acog-prenatal-care", "who-antenatal", "nhs-appointments"],
  }),
  catalogFinding({
    id: "appointments-warning-signs-anatomy-ultrasound",
    sectionId: "appointments-warning-signs",
    title: "Anatomy ultrasound or anomaly scan",
    aliases: [
      "anatomy scan",
      "anomaly scan",
      "20 week scan",
      "morphology scan",
      "detailed ultrasound",
    ],
    priority: "P0",
    summary:
      "The mid-pregnancy anatomy scan reviews fetal structures, placenta and other features, but it cannot find every condition or guarantee future health.",
    detail:
      "Ask what was seen clearly, what could not be completed, whether follow-up imaging is recommended and when results will be discussed. An incomplete view is not the same as an abnormal finding.",
    sourceIds: [
      "acog-prenatal-care",
      "acog-prenatal-testing",
      "nhs-appointments",
    ],
  }),
  catalogFinding({
    id: "appointments-warning-signs-gestational-diabetes-test",
    sectionId: "appointments-warning-signs",
    title: "Gestational diabetes glucose test",
    aliases: [
      "glucose test",
      "glucose tolerance test",
      "GTT",
      "gestational diabetes screening",
      "glucose drink test",
      "sugar test pregnancy",
    ],
    priority: "P0",
    summary:
      "Glucose screening and diagnostic testing are not interchangeable, and fasting, drink, timing and thresholds vary by protocol.",
    detail:
      "Follow the exact instructions from the testing service, tell them if you vomit or cannot complete the drink and ask how and when results will be communicated. Do not change diet just to influence the test unless instructed.",
    sourceIds: ["acog-gestational-diabetes", "who-antenatal", "nice-antenatal"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "appointments-warning-signs-fetal-echocardiogram",
    sectionId: "appointments-warning-signs",
    title: "Fetal echocardiogram",
    aliases: [
      "fetal echo",
      "foetal echo",
      "baby heart scan",
      "fetal echocardiography",
      "specialist heart ultrasound",
    ],
    summary:
      "A fetal echocardiogram is a specialist ultrasound of the developing heart, usually offered for a specific history, screening result or ultrasound question.",
    detail:
      "Ask why it is recommended, what it can and cannot show, whether imaging was complete and who will explain any follow-up. Referral does not by itself mean a heart condition has been confirmed.",
    sourceIds: ["acog-prenatal-testing", "acog-prenatal-care"],
  }),
  catalogFinding({
    id: "appointments-warning-signs-growth-ultrasound",
    sectionId: "appointments-warning-signs",
    title: "Growth ultrasound",
    aliases: [
      "growth scan",
      "growth ultrasound",
      "baby measuring small",
      "baby measuring large",
      "estimated fetal weight",
    ],
    priority: "P0",
    summary:
      "A growth scan estimates size and trends alongside fluid, placenta and clinical context; one estimate is not a precise birth-weight prediction.",
    detail:
      "Ask which measurements matter, how they compare with earlier scans, the uncertainty around the estimate and whether repeat imaging or monitoring is planned.",
    sourceIds: ["acog-prenatal-care", "nice-antenatal", "who-antenatal"],
  }),
  catalogFinding({
    id: "appointments-warning-signs-nonstress-test",
    sectionId: "appointments-warning-signs",
    title: "Nonstress test or cardiotocography monitoring",
    aliases: [
      "nonstress test",
      "NST",
      "CTG",
      "cardiotocography",
      "fetal monitoring",
      "baby heart rate monitor",
    ],
    priority: "P0",
    summary:
      "A nonstress test records fetal heart-rate patterns over time and is interpreted with pregnancy week, movement and the reason for monitoring.",
    detail:
      "Ask what prompted the test, how long it may take, what the result means and whether another test is needed. Do not use a home Doppler or phone app as a substitute for recommended monitoring.",
    sourceIds: ["acog-prenatal-care", "nice-antenatal", "cdc-warning"],
  }),
  catalogFinding({
    id: "appointments-warning-signs-biophysical-profile",
    sectionId: "appointments-warning-signs",
    title: "Biophysical profile",
    aliases: [
      "biophysical profile",
      "BPP",
      "fetal wellbeing scan",
      "baby wellbeing ultrasound",
      "modified BPP",
    ],
    priority: "P0",
    summary:
      "A biophysical profile combines ultrasound observations, sometimes with heart-rate monitoring, to answer a specific fetal-wellbeing question.",
    detail:
      "Ask which components were assessed, how the score is used in your situation and what follow-up or timing decision is recommended. A score should be explained by the treating team, not interpreted in isolation online.",
    sourceIds: ["acog-prenatal-care", "nice-antenatal"],
  }),
  catalogFinding({
    id: "appointments-warning-signs-amniotic-fluid-measurement",
    sectionId: "appointments-warning-signs",
    title: "Amniotic fluid measurement",
    aliases: [
      "amniotic fluid index",
      "AFI",
      "deepest vertical pocket",
      "low fluid",
      "high fluid",
      "oligohydramnios",
      "polyhydramnios",
    ],
    priority: "P0",
    summary:
      "Low or high estimated fluid is interpreted with ultrasound method, pregnancy week, growth, membranes, symptoms and the wider clinical picture.",
    detail:
      "Ask how the fluid was measured, whether the result needs confirmation, what related findings were present and what monitoring or treatment plan follows.",
    sourceIds: ["acog-prenatal-care", "nice-antenatal", "who-antenatal"],
  }),
  catalogFinding({
    id: "appointments-warning-signs-umbilical-doppler",
    sectionId: "appointments-warning-signs",
    title: "Umbilical artery or fetal Doppler ultrasound",
    aliases: [
      "umbilical Doppler",
      "fetal Doppler scan",
      "artery Doppler",
      "placental blood flow scan",
      "Doppler ultrasound",
    ],
    priority: "P0",
    summary:
      "Clinical Doppler ultrasound measures blood-flow patterns for a defined reason and is different from listening to a heartbeat with a consumer device.",
    detail:
      "Ask which vessel was assessed, what question the test addresses and whether the result changes monitoring or timing. Normal sound from a home device cannot rule out a problem.",
    sourceIds: ["acog-prenatal-care", "nice-antenatal"],
  }),
  catalogFinding({
    id: "appointments-warning-signs-fundal-height-measurement",
    sectionId: "appointments-warning-signs",
    title: "Fundal height and measuring the bump",
    aliases: [
      "fundal height",
      "bump measurement",
      "measuring belly",
      "measuring small",
      "measuring ahead",
    ],
    status: "generally-ok",
    summary:
      "Fundal height is a screening measurement that helps identify a trend; body shape, bladder, fetal position, fibroids and multiples can affect it.",
    detail:
      "Ask whether the measurement changed the trend and whether ultrasound or other follow-up is recommended. Home tape measurements are not a reliable substitute for prenatal assessment.",
    sourceIds: ["acog-prenatal-care", "who-antenatal"],
  }),
  catalogFinding({
    id: "appointments-warning-signs-home-blood-pressure",
    sectionId: "appointments-warning-signs",
    title: "Home blood-pressure monitoring",
    aliases: [
      "home blood pressure",
      "blood pressure cuff",
      "BP monitor pregnancy",
      "high blood pressure reading",
      "checking BP at home",
    ],
    priority: "P0",
    summary:
      "A home reading is useful only with a validated cuff, correct size and technique, plus clear thresholds from the care team.",
    detail:
      "Record the reading, time, symptoms and repeat method your clinician specifies. Severe headache, vision change, chest symptoms, severe upper-abdominal pain or feeling very unwell needs urgent advice regardless of a reassuring single number.",
    sourceIds: ["acog-preeclampsia", "acog-prenatal-care", "cdc-warning"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "appointments-warning-signs-genetic-counseling-carrier-screening",
    sectionId: "appointments-warning-signs",
    title: "Genetic counselling and carrier screening",
    aliases: [
      "genetic counseling",
      "genetic counselling",
      "carrier screening",
      "carrier test",
      "inherited condition",
      "genetics appointment",
    ],
    summary:
      "Carrier screening estimates the chance of passing on selected inherited conditions and is distinct from fetal screening or diagnostic testing.",
    detail:
      "Ask which conditions are included, residual risk after a negative result, what a positive result means for each biological parent and what diagnostic or reproductive options are available without pressure.",
    sourceIds: ["acog-genetic-screening", "acog-prenatal-testing"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "appointments-warning-signs-ultrasound-finding-followup",
    sectionId: "appointments-warning-signs",
    title: "Unexpected ultrasound finding and specialist follow-up",
    aliases: [
      "abnormal ultrasound",
      "soft marker",
      "unexpected scan result",
      "maternal fetal medicine referral",
      "second opinion ultrasound",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "An unexpected finding, incomplete view and screening marker are different situations and should be explained with uncertainty and next steps.",
    detail:
      "Ask for the exact finding in writing, whether it is isolated, what is known and uncertain, which test could clarify it and when a specialist discussion will happen. You may ask for time, an interpreter or a second opinion.",
    sourceIds: [
      "acog-prenatal-testing",
      "acog-genetic-screening",
      "acog-prenatal-care",
    ],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "appointments-warning-signs-cervical-exam-membrane-sweep",
    sectionId: "appointments-warning-signs",
    title: "Cervical examination and membrane sweep",
    aliases: [
      "cervical check",
      "vaginal exam",
      "membrane sweep",
      "stretch and sweep",
      "cervix exam",
    ],
    summary:
      "A cervical examination and a membrane sweep are not the same procedure; both require explanation, consent and a reason relevant to the care plan.",
    detail:
      "Ask what information the examination may change, whether there are alternatives, what discomfort or bleeding to expect and when to seek help afterward. You can pause or decline and revisit the decision.",
    sourceIds: ["acog-labour-birth", "nice-antenatal", "who-antenatal"],
  }),
  catalogFinding({
    id: "appointments-warning-signs-place-of-birth",
    sectionId: "appointments-warning-signs",
    title: "Hospital, birth centre or planned home birth",
    aliases: [
      "place of birth",
      "home birth",
      "birth center",
      "birth centre",
      "hospital birth",
      "where to give birth",
    ],
    summary:
      "Birth-setting options depend on pregnancy history, current findings, local service capability, transfer time and the kinds of pain relief or emergency support desired.",
    detail:
      "Compare who provides care, eligibility, equipment, transfer triggers and travel time, not atmosphere alone. Revisit the plan if the pregnancy or service changes.",
    sourceIds: ["acog-labour-birth", "who-antenatal", "nice-antenatal"],
  }),
  catalogFinding({
    id: "appointments-warning-signs-doula-support-person",
    sectionId: "appointments-warning-signs",
    title: "Doula, birth partner and support-person planning",
    aliases: [
      "doula",
      "birth partner",
      "support person labor",
      "labour companion",
      "birth support",
    ],
    status: "generally-ok",
    summary:
      "A support person can help with comfort, communication and practical needs but does not replace a licensed clinician or make decisions for the pregnant person.",
    detail:
      "Agree on consent, privacy, advocacy preferences, backup plans and when the supporter should call staff. Check the birth setting's current visitor and doula rules.",
    sourceIds: ["who-antenatal", "acog-labour-birth"],
  }),
  catalogFinding({
    id: "appointments-warning-signs-delayed-cord-clamping",
    sectionId: "appointments-warning-signs",
    title: "Delayed cord clamping",
    aliases: [
      "delayed cord clamping",
      "wait to cut cord",
      "optimal cord clamping",
      "umbilical cord timing",
    ],
    summary:
      "Cord-clamping timing is a birth decision that should account for newborn condition, resuscitation needs, local practice and any cord-blood plan.",
    detail:
      "Ask what the service usually does, which situations might change the timing and how immediate skin-to-skin or newborn care would be supported.",
    sourceIds: ["who-newborn", "acog-labour-birth"],
  }),
  catalogFinding({
    id: "appointments-warning-signs-cord-blood-banking-donation",
    sectionId: "appointments-warning-signs",
    title: "Cord-blood banking or donation",
    aliases: [
      "cord blood banking",
      "cord blood donation",
      "stem cell banking",
      "private cord blood",
      "public cord bank",
    ],
    summary:
      "Public donation, private storage and directed family banking have different eligibility, costs, likelihood of use and collection requirements.",
    detail:
      "Ask about evidence for your family situation, accreditation, fees, sample failure, ownership and how collection interacts with cord-clamping plans. Marketing claims are not individualized medical advice.",
    sourceIds: ["acog-labour-birth", "who-newborn"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "appointments-warning-signs-newborn-vitamin-k",
    sectionId: "appointments-warning-signs",
    title: "Newborn vitamin K",
    aliases: [
      "vitamin K shot",
      "newborn vitamin K",
      "vitamin K injection baby",
      "vitamin K birth",
    ],
    priority: "P0",
    summary:
      "Newborn vitamin K prevents a bleeding disorder caused by naturally low vitamin K stores; discuss the local preparation, route and timing before birth.",
    detail:
      "Ask the newborn team to explain benefits, possible effects and what alternatives do or do not provide. This is a newborn decision and is not replaced by taking extra vitamin K during pregnancy without advice.",
    sourceIds: ["who-newborn", "cdc-milestones"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "appointments-warning-signs-newborn-screening-hearing",
    sectionId: "appointments-warning-signs",
    title: "Newborn blood-spot, hearing and heart screening",
    aliases: [
      "newborn screening",
      "heel prick test",
      "hearing screen baby",
      "pulse oximetry newborn",
      "blood spot test",
    ],
    priority: "P0",
    summary:
      "Newborn screening programmes look for selected conditions before symptoms appear, and the exact panel, timing and follow-up pathway vary by health system.",
    detail:
      "Ask which screens are offered, when results arrive, who contacts you and what happens after an incomplete or positive screen. Screening is not the same as a diagnosis.",
    sourceIds: ["who-newborn", "cdc-milestones"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "appointments-warning-signs-feeding-plan-lactation-support",
    sectionId: "appointments-warning-signs",
    title: "Feeding plan and lactation support before birth",
    aliases: [
      "breastfeeding plan",
      "formula feeding plan",
      "lactation consultant",
      "infant feeding plan",
      "colostrum harvesting",
    ],
    summary:
      "A feeding plan should support informed choices, health needs and realistic backup options without treating one feeding method as a measure of parenting.",
    detail:
      "Ask who can help after birth, how weight and hydration will be assessed, how medicines or previous breast surgery affect planning and when antenatal colostrum expression is or is not advised.",
    sourceIds: ["who-feeding", "who-postnatal", "acog-postpartum"],
  }),
  catalogFinding({
    id: "common-symptoms-bleeding-spotting",
    sectionId: "common-symptoms",
    title: "Bleeding or spotting in pregnancy",
    aliases: [
      "bleeding",
      "spotting",
      "vaginal bleeding",
      "brown discharge",
      "bleeding pregnant",
      "pink discharge",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Bleeding has many possible causes and cannot be classified safely by colour alone; contact the maternity service for advice based on timing, amount, pain and history.",
    detail:
      "Use urgent or emergency care for heavy bleeding, severe or one-sided pain, shoulder pain, fainting, weakness, fever or feeling very unwell. Note pads used, clots, symptoms and pregnancy week.",
    sourceIds: ["acog-bleeding", "nhs-symptoms-help", "cdc-warning"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "common-symptoms-diarrhea-gastroenteritis",
    sectionId: "common-symptoms",
    title: "Diarrhoea or gastroenteritis",
    aliases: [
      "diarrhea",
      "diarrhoea",
      "stomach bug",
      "gastroenteritis",
      "loose stools",
      "food poisoning symptoms",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Short-lived diarrhoea may settle, but pregnancy lowers the margin for dehydration and does not rule out foodborne infection or another cause.",
    detail:
      "Contact care for fever, blood, severe pain, repeated vomiting, very little urine, weakness, contractions or symptoms that persist. Check any anti-diarrhoeal medicine before taking it.",
    sourceIds: ["cdc-food", "nhs-pregnancy-symptoms", "nhs-medicines"],
  }),
  catalogFinding({
    id: "common-symptoms-bloating-gas",
    sectionId: "common-symptoms",
    title: "Bloating, gas and abdominal fullness",
    aliases: [
      "bloating",
      "gas",
      "wind",
      "abdominal fullness",
      "burping pregnancy",
    ],
    status: "generally-ok",
    summary:
      "Bloating and gas are common with hormonal and digestive changes, but severe, localized or rapidly worsening pain needs a different response.",
    detail:
      "Try smaller meals, fluids and comfortable movement if tolerated. Contact care for persistent vomiting, fever, inability to pass stool or gas, bleeding, a hard painful abdomen or one-sided pain.",
    sourceIds: ["acog-digestive", "nhs-pregnancy-symptoms"],
  }),
  catalogFinding({
    id: "common-symptoms-fatigue-exhaustion",
    sectionId: "common-symptoms",
    title: "Fatigue and exhaustion",
    aliases: [
      "fatigue",
      "exhausted",
      "extreme tiredness",
      "no energy",
      "pregnancy tiredness",
    ],
    status: "generally-ok",
    priority: "P0",
    summary:
      "Fatigue is common, especially early and late in pregnancy, but severity, onset and associated symptoms can point to anaemia, infection, sleep or other problems.",
    detail:
      "Mention fatigue that is sudden, worsening or disabling, especially with breathlessness, palpitations, fainting, fever, low mood or severe daytime sleepiness. Do not drive when unable to stay alert.",
    sourceIds: ["nhs-pregnancy-symptoms", "acog-sleep", "acog-prenatal-care"],
  }),
  catalogFinding({
    id: "common-symptoms-anemia-low-iron",
    sectionId: "common-symptoms",
    title: "Anaemia or low iron",
    aliases: [
      "anemia",
      "anaemia",
      "low iron",
      "low hemoglobin",
      "low haemoglobin",
      "ferritin pregnancy",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Anaemia has different causes, and a blood count, ferritin or treatment plan should be interpreted with pregnancy stage, symptoms and medical history.",
    detail:
      "Ask which result is low, the suspected cause, exact supplement or treatment, side effects and follow-up test. Seek urgent help for chest pain, severe breathlessness, fainting or a racing heart with feeling unwell.",
    sourceIds: ["acog-nutrition", "who-antenatal", "nice-antenatal"],
  }),
  catalogFinding({
    id: "common-symptoms-increased-thirst-urination",
    sectionId: "common-symptoms",
    title: "Unusual thirst or much more urination",
    aliases: [
      "very thirsty",
      "excessive thirst",
      "peeing a lot",
      "frequent urination",
      "polydipsia pregnancy",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Frequent urination can be common, but marked thirst, large urine volumes, weight change, weakness or recurrent infections deserve review for blood sugar or another cause.",
    detail:
      "Contact care rather than trying to restrict fluids. Pain, fever, vomiting, confusion, deep breathing or inability to keep fluids down increases the urgency.",
    sourceIds: [
      "acog-gestational-diabetes",
      "nhs-pregnancy-symptoms",
      "cdc-warning",
    ],
  }),
  catalogFinding({
    id: "common-symptoms-upper-right-abdominal-pain",
    sectionId: "common-symptoms",
    title: "Severe upper-right or upper-abdominal pain",
    aliases: [
      "right upper quadrant pain",
      "upper abdominal pain",
      "pain under right ribs",
      "epigastric pain",
      "liver pain pregnancy",
    ],
    status: "urgent",
    priority: "P0",
    summary:
      "Severe, persistent upper-abdominal or right-sided rib pain can be a warning sign, especially with headache, vision change, swelling, vomiting or high blood pressure.",
    detail:
      "Use urgent maternity or emergency assessment now rather than assuming indigestion or waiting for a routine visit. Describe the exact location, onset and associated symptoms.",
    sourceIds: ["acog-preeclampsia", "cdc-warning", "nhs-symptoms-help"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "common-symptoms-one-sided-abdominal-pain",
    sectionId: "common-symptoms",
    title: "Severe one-sided lower-abdominal pain",
    aliases: [
      "one sided pain",
      "left side abdominal pain",
      "right side abdominal pain",
      "ectopic pain",
      "sharp pelvic pain",
    ],
    status: "urgent",
    priority: "P0",
    summary:
      "Severe or worsening one-sided pain, especially early in pregnancy or with bleeding, shoulder pain, dizziness or fainting, needs urgent assessment.",
    detail:
      "Do not use an app or home pregnancy test to rule out an ectopic pregnancy or another emergency. Seek urgent maternity or emergency care and avoid driving yourself if faint or unstable.",
    sourceIds: ["acog-bleeding", "cdc-warning", "nhs-symptoms-help"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "common-symptoms-pelvic-pressure-vaginal-pressure",
    sectionId: "common-symptoms",
    title: "New pelvic or vaginal pressure",
    aliases: [
      "pelvic pressure",
      "vaginal pressure",
      "baby pushing down",
      "heaviness pelvis",
      "pressure between legs",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Pelvic heaviness can have several causes, but new or increasing pressure with contractions, backache, bleeding or fluid loss can need prompt assessment.",
    detail:
      "Contact the maternity service and describe pregnancy week, timing, whether it comes and goes and any discharge or urinary symptoms. Use urgent care if pain is severe or symptoms escalate.",
    sourceIds: ["acog-labour-birth", "nhs-symptoms-help", "cdc-warning"],
  }),
  catalogFinding({
    id: "common-symptoms-vulvar-varicose-veins",
    sectionId: "common-symptoms",
    title: "Vulvar or vaginal varicose veins",
    aliases: [
      "vulvar varicosities",
      "vaginal varicose veins",
      "swollen vulva",
      "veins labia",
      "pelvic varicose veins",
    ],
    status: "contact-care",
    summary:
      "Bulging or aching vulvar veins can occur with pregnancy pressure, but a new painful lump, marked one-sided swelling, skin change or bleeding needs examination.",
    detail:
      "Avoid prolonged standing when possible and ask about support or comfort measures. Seek prompt care for sudden severe pain, redness, fever, a hard swelling or substantial bleeding.",
    sourceIds: ["acog-during-pregnancy", "nhs-pregnancy-symptoms"],
  }),
  catalogFinding({
    id: "common-symptoms-urine-leakage-incontinence",
    sectionId: "common-symptoms",
    title: "Urine leakage and incontinence",
    aliases: [
      "urine leakage",
      "incontinence",
      "pee when coughing",
      "bladder leaks",
      "wet underwear pregnancy",
    ],
    status: "contact-care",
    summary:
      "Urine leakage is common but deserves support, and a continuous watery leak can be difficult to distinguish from amniotic fluid without assessment.",
    detail:
      "Ask about pelvic-health support and contact maternity care for a gush, ongoing clear leakage, changed movement, bleeding, contractions, fever or uncertainty about whether waters broke.",
    sourceIds: ["acog-during-pregnancy", "nhs-symptoms-help", "acog-exercise"],
  }),
  catalogFinding({
    id: "common-symptoms-colostrum-breast-leaking",
    sectionId: "common-symptoms",
    title: "Leaking colostrum during pregnancy",
    aliases: [
      "leaking breasts",
      "colostrum pregnancy",
      "yellow nipple discharge",
      "milk before birth",
      "breast leakage",
    ],
    status: "generally-ok",
    summary:
      "Small amounts of colostrum can leak before birth and do not predict future milk supply or require expression.",
    detail:
      "Use a soft breast pad if helpful and ask before antenatal expressing because timing and suitability depend on the pregnancy. Seek assessment for blood, pus, a new lump, fever, marked redness or severe pain.",
    sourceIds: ["who-feeding", "acog-during-pregnancy", "acog-postpartum"],
  }),
  catalogFinding({
    id: "common-symptoms-breast-lump-redness-pain",
    sectionId: "common-symptoms",
    title: "Breast lump, redness or focal pain",
    aliases: [
      "breast lump",
      "red breast",
      "breast pain",
      "nipple discharge blood",
      "breast infection pregnancy",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Pregnancy changes breasts, but a persistent lump, one-sided redness, skin change, bloody discharge or focal pain should be examined.",
    detail:
      "Contact a clinician and describe duration, location, fever and nipple or skin changes. Do not delay because imaging or assessment may still be planned safely during pregnancy.",
    sourceIds: ["acog-during-pregnancy", "acog-prenatal-care"],
  }),
  catalogFinding({
    id: "common-symptoms-hip-tailbone-groin-pain",
    sectionId: "common-symptoms",
    title: "Hip, tailbone or groin pain",
    aliases: [
      "hip pain",
      "tailbone pain",
      "coccyx pain",
      "groin pain",
      "inner thigh pain pregnancy",
    ],
    status: "contact-care",
    summary:
      "Mechanical pain is common, but one label can hide pelvic-girdle, nerve, joint, clot or abdominal causes that need different care.",
    detail:
      "Ask for assessment when pain changes walking, sleep or daily function. Seek urgent care for inability to bear weight, a hot swollen leg, weakness, numbness around the groin, bladder changes or severe sudden pain.",
    sourceIds: ["acog-back-pain", "acog-exercise", "cdc-warning"],
  }),
  catalogFinding({
    id: "common-symptoms-lightning-crotch-shooting-pain",
    sectionId: "common-symptoms",
    title: "Brief shooting vaginal or cervical pain",
    aliases: [
      "lightning crotch",
      "shooting vaginal pain",
      "sharp cervix pain",
      "electric pelvic pain",
      "stabbing vagina pregnancy",
    ],
    status: "contact-care",
    summary:
      "Brief shooting pains can occur with pressure or movement, but the nickname does not rule out labour, infection or another problem.",
    detail:
      "Contact care for repetitive or worsening pain, contractions, bleeding, fluid loss, fever, urinary symptoms or changed movement. Severe or persistent pain needs urgent assessment.",
    sourceIds: ["nhs-pregnancy-symptoms", "nhs-symptoms-help"],
  }),
  catalogFinding({
    id: "common-symptoms-metallic-taste-smell-changes",
    sectionId: "common-symptoms",
    title: "Metallic taste and strong smell sensitivity",
    aliases: [
      "metallic taste",
      "bad taste mouth",
      "smell sensitivity",
      "food smells nauseous",
      "dysgeusia pregnancy",
    ],
    status: "generally-ok",
    summary:
      "Taste and smell changes can accompany early pregnancy and nausea, but persistent mouth symptoms may also come from dental, reflux, medicine or infection causes.",
    detail:
      "Use foods and temperatures you tolerate, keep up oral care and ask for review if the change prevents eating or drinking, comes with mouth lesions or follows a new medicine.",
    sourceIds: [
      "nhs-pregnancy-symptoms",
      "acog-dental",
      "acog-morning-sickness",
    ],
  }),
  catalogFinding({
    id: "common-symptoms-excess-saliva",
    sectionId: "common-symptoms",
    title: "Excess saliva or frequent spitting",
    aliases: [
      "excess saliva",
      "ptyalism",
      "spitting pregnancy",
      "too much saliva",
      "hypersalivation",
    ],
    status: "contact-care",
    summary:
      "Excess saliva can accompany nausea and may be exhausting or make hydration harder even when it is not dangerous by itself.",
    detail:
      "Mention it when it interferes with sleep, fluids, eating or daily life. Seek care sooner if you cannot swallow, have breathing difficulty, signs of dehydration or severe ongoing vomiting.",
    sourceIds: ["acog-morning-sickness", "nhs-pregnancy-symptoms"],
  }),
  catalogFinding({
    id: "common-symptoms-mild-shortness-of-breath",
    sectionId: "common-symptoms",
    title: "Mild breathlessness with activity",
    aliases: [
      "short of breath walking",
      "mild breathlessness",
      "winded pregnancy",
      "out of breath stairs",
      "pregnancy breathing changes",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Some breathlessness can occur with pregnancy, but new, worsening or disproportionate symptoms need review rather than automatic reassurance.",
    detail:
      "Stop and seek urgent help for breathlessness at rest, chest pain, fainting, blue lips, coughing blood, a racing heart with illness or one-sided leg swelling.",
    sourceIds: ["nhs-pregnancy-symptoms", "cdc-warning", "acog-prenatal-care"],
  }),
  catalogFinding({
    id: "common-symptoms-mild-swelling-edema",
    sectionId: "common-symptoms",
    title: "Gradual swelling of feet and ankles",
    aliases: [
      "swollen feet",
      "ankle swelling",
      "edema",
      "oedema",
      "puffy ankles pregnancy",
    ],
    status: "generally-ok",
    priority: "P0",
    summary:
      "Gradual, even swelling can be common, but sudden swelling or swelling with headache, vision change, upper-abdominal pain or high blood pressure needs urgent advice.",
    detail:
      "Rest with comfortable position changes and mention swelling that is worsening or limiting footwear. One hot, painful or much more swollen leg needs prompt assessment for a clot.",
    sourceIds: ["acog-preeclampsia", "nhs-pregnancy-symptoms", "cdc-warning"],
  }),
  catalogFinding({
    id: "common-symptoms-fetal-hiccups-movement-pattern",
    sectionId: "common-symptoms",
    title: "Fetal hiccups and repeated rhythmic movement",
    aliases: [
      "baby hiccups",
      "fetal hiccups",
      "foetal hiccups",
      "rhythmic movement belly",
      "pulsing baby movement",
    ],
    status: "generally-ok",
    summary:
      "Rhythmic repeated movements may be fetal hiccups, but they should not be used to prove that the overall movement pattern is normal.",
    detail:
      "Learn the usual movement pattern as your maternity service advises and contact them promptly for reduced or changed movement, even if hiccup-like movement is still present.",
    sourceIds: ["cdc-warning", "nhs-symptoms-help", "acog-prenatal-care"],
  }),
];

const skinInfectionAndWellbeingDepthFindings = [
  catalogFinding({
    id: "dental-skin-stretch-marks-products",
    sectionId: "dental-skin",
    title: "Stretch marks and products claiming to prevent them",
    aliases: [
      "stretch marks",
      "striae",
      "stretch mark cream",
      "belly oil",
      "prevent stretch marks",
    ],
    status: "generally-ok",
    summary:
      "Stretch marks reflect skin, growth and inherited tendency; no cream can promise prevention, though a simple moisturiser may reduce dryness or itch.",
    detail:
      "Check medicated, retinoid, essential-oil or imported products before use and stop anything that irritates the skin. Rapidly spreading rash or severe itch needs assessment rather than another cosmetic product.",
    sourceIds: ["acog-skin", "nhs-medicines"],
  }),
  catalogFinding({
    id: "dental-skin-melasma-linea-nigra",
    sectionId: "dental-skin",
    title: "Melasma, linea nigra and darker skin patches",
    aliases: [
      "melasma",
      "pregnancy mask",
      "linea nigra",
      "dark patches",
      "skin pigmentation pregnancy",
    ],
    status: "generally-ok",
    summary:
      "Hormonal pigment changes can darken the face, nipples, scars or a line on the abdomen and often change again after pregnancy.",
    detail:
      "Use broad-spectrum sun protection and avoid bleaching or prescription pigment treatments without review. A new irregular lesion, bleeding spot or rapidly changing mole needs examination.",
    sourceIds: ["acog-skin", "acog-during-pregnancy"],
  }),
  catalogFinding({
    id: "dental-skin-new-rash-hives-puppp",
    sectionId: "dental-skin",
    title: "New rash, hives or intensely itchy bumps",
    aliases: [
      "pregnancy rash",
      "PUPPP",
      "PUPPS",
      "hives",
      "itchy bumps",
      "pruritic rash pregnancy",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "A new rash needs assessment by appearance, location, timing, medicines, exposures and whether there is itch without a visible rash.",
    detail:
      "Contact care promptly for severe itch, blistering, fever, facial swelling, mouth or eye involvement, breathing difficulty, illness or exposure to an infectious rash. Do not self-diagnose from photos alone.",
    sourceIds: ["acog-skin", "cdc-infections", "cdc-warning"],
  }),
  catalogFinding({
    id: "dental-skin-changing-mole-lesion",
    sectionId: "dental-skin",
    title: "Changing mole or new skin lesion",
    aliases: [
      "changing mole",
      "new mole pregnancy",
      "skin lesion",
      "mole bleeding",
      "melanoma pregnancy",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Pregnancy is not a reason to dismiss a mole or lesion that is changing in size, shape, colour, symptoms or bleeding.",
    detail:
      "Arrange examination and note when the change started; a clinician can decide whether dermoscopy or biopsy is needed. Do not wait until after birth solely because you are pregnant.",
    sourceIds: ["acog-skin", "acog-prenatal-care"],
  }),
  catalogFinding({
    id: "dental-skin-hair-shedding-nail-changes",
    sectionId: "dental-skin",
    title: "Hair growth, shedding and nail changes",
    aliases: [
      "hair loss pregnancy",
      "hair shedding",
      "brittle nails",
      "nail changes",
      "hair growth pregnancy",
    ],
    status: "generally-ok",
    summary:
      "Hair and nail growth can change during and after pregnancy, but patchy loss, scalp disease or changes with systemic symptoms deserve review.",
    detail:
      "Use gentle hair and nail care and avoid unreviewed high-dose supplements marketed for beauty. Ask about testing when loss is sudden, patchy or accompanies fatigue, weight change or skin symptoms.",
    sourceIds: ["acog-skin", "acog-nutrition"],
  }),
  catalogFinding({
    id: "dental-skin-waxing-shaving-depilatory",
    sectionId: "dental-skin",
    title: "Waxing, shaving and depilatory creams",
    aliases: [
      "waxing",
      "shaving",
      "hair removal cream",
      "depilatory cream",
      "bikini wax pregnancy",
    ],
    summary:
      "Skin may be more sensitive in pregnancy, and the practical risks are irritation, burns, infection and ingredients in the exact product.",
    detail:
      "Patch-test as directed, use clean equipment and avoid broken, infected or very irritated skin. Check numbing products or strong chemical depilatories with a pharmacist rather than increasing exposure to overcome sensitivity.",
    sourceIds: ["acog-skin", "nhs-medicines"],
  }),
  catalogFinding({
    id: "dental-skin-acne-benzoyl-peroxide-acids",
    sectionId: "dental-skin",
    title: "Acne cleansers, benzoyl peroxide and exfoliating acids",
    aliases: [
      "benzoyl peroxide",
      "salicylic acid",
      "glycolic acid",
      "acne wash",
      "pregnancy acne treatment",
    ],
    priority: "P0",
    summary:
      "Acne products can contain several active ingredients at different strengths and body-area exposures, so the exact label needs review.",
    detail:
      "Ask a pharmacist or clinician to separate simple cleanser or moisturiser from medicated actives, peels and retinoids. Avoid oral or topical retinoids and do not combine multiple strong products without a plan.",
    sourceIds: ["acog-skin", "nhs-medicines", "cdc-medicine"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "dental-skin-eczema-psoriasis-flare",
    sectionId: "dental-skin",
    title: "Eczema or psoriasis flare",
    aliases: [
      "eczema pregnancy",
      "psoriasis pregnancy",
      "dermatitis flare",
      "itchy dry skin",
      "skin condition flare",
    ],
    status: "contact-care",
    summary:
      "Established skin disease may improve or worsen, and treatment choices depend on body area, severity, infection, dose and the exact topical or systemic medicine.",
    detail:
      "Keep prescribed treatment under clinician review rather than stopping it abruptly. Contact care for rapidly spreading redness, pus, fever, painful skin, blistering or eye and mouth involvement.",
    sourceIds: ["acog-skin", "nhs-medicines"],
  }),
  catalogFinding({
    id: "dental-skin-sunscreen-sunburn",
    sectionId: "dental-skin",
    title: "Sunscreen, sunburn and heat exposure",
    aliases: [
      "sunscreen pregnancy",
      "sun cream",
      "sunblock",
      "sunburn",
      "SPF pregnancy",
    ],
    status: "generally-ok",
    summary:
      "Sun protection remains useful in pregnancy, when pigment changes and overheating can make exposure more uncomfortable.",
    detail:
      "Use shade, clothing, fluids and a broad-spectrum sunscreen you tolerate; reapply as directed. Severe sunburn, blistering, confusion, fainting or inability to cool needs medical advice.",
    sourceIds: ["acog-skin", "acog-heat"],
  }),
  catalogFinding({
    id: "dental-skin-teeth-whitening",
    sectionId: "dental-skin",
    title: "Teeth whitening and bleaching products",
    aliases: [
      "teeth whitening",
      "tooth bleaching",
      "whitening strips",
      "bleaching gel",
      "cosmetic dentistry pregnancy",
    ],
    summary:
      "Teeth whitening is elective, product strengths vary and gum sensitivity can increase during pregnancy, so postponing or checking first is reasonable.",
    detail:
      "Do not use an unlabelled or imported bleaching product. Ask a dentist about active gum disease, enamel sensitivity and whether routine cleaning would address the concern more appropriately.",
    sourceIds: ["acog-dental", "nhs-medicines"],
  }),
  catalogFinding({
    id: "dental-skin-gum-disease-periodontitis",
    sectionId: "dental-skin",
    title: "Bleeding gums, gingivitis and gum disease",
    aliases: [
      "bleeding gums",
      "gingivitis",
      "gum disease",
      "periodontitis",
      "swollen gums pregnancy",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Pregnancy can make gums more reactive, but persistent bleeding, swelling, recession, loose teeth or bad taste needs dental assessment.",
    detail:
      "Continue gentle brushing with fluoride toothpaste and interdental cleaning; do not avoid dental care because of pregnancy. Seek prompt care for facial swelling, fever, spreading pain or difficulty swallowing.",
    sourceIds: ["acog-dental", "cdc-warning"],
  }),
  catalogFinding({
    id: "dental-skin-mouth-ulcers-oral-lesions",
    sectionId: "dental-skin",
    title: "Mouth ulcer or oral lesion",
    aliases: [
      "mouth ulcer",
      "canker sore",
      "oral lesion",
      "sore tongue",
      "mouth sore pregnancy",
    ],
    status: "contact-care",
    summary:
      "A small ulcer may settle, but a lesion that persists, recurs, spreads or prevents eating and drinking should be examined.",
    detail:
      "Check medicated mouth gels or rinses before use. Seek prompt care for facial swelling, fever, dehydration, difficulty swallowing or breathing, eye involvement or a lesion lasting longer than expected.",
    sourceIds: ["acog-dental", "nhs-medicines", "cdc-warning"],
  }),
  catalogFinding({
    id: "dental-skin-laser-hair-removal-electrolysis",
    sectionId: "dental-skin",
    title: "Laser hair removal and electrolysis",
    aliases: [
      "laser hair removal",
      "electrolysis",
      "IPL hair removal",
      "intense pulsed light",
      "permanent hair removal pregnancy",
    ],
    summary:
      "Elective energy-based hair removal has limited pregnancy-specific evidence and skin pigment or sensitivity can change, so many services defer it.",
    detail:
      "Ask the treating clinician about device, body area and alternatives, and do not rely on a salon's marketing claim as medical clearance. Avoid treatment over irritated, infected or newly pigmented skin.",
    sourceIds: ["acog-skin", "cdc-medicine"],
  }),
  catalogFinding({
    id: "infections-hand-foot-mouth-exposure",
    sectionId: "infections-vaccines",
    title: "Hand, foot and mouth disease exposure",
    aliases: [
      "hand foot mouth",
      "HFMD",
      "coxsackie virus",
      "daycare rash exposure",
      "hand foot and mouth pregnancy",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "After a close exposure, timing, symptoms and pregnancy week matter more than the name of the childcare outbreak alone.",
    detail:
      "Wash hands carefully, avoid sharing utensils and contact your clinician if you develop fever, rash, mouth sores or feel unwell, or if the exposure was near birth.",
    sourceIds: ["cdc-infections", "nhs-symptoms-help"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "infections-rsv-exposure-illness",
    sectionId: "infections-vaccines",
    title: "RSV exposure, illness and pregnancy vaccination",
    aliases: [
      "RSV",
      "respiratory syncytial virus",
      "RSV vaccine pregnancy",
      "RSV exposure",
      "RSV infection pregnant",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Respiratory syncytial virus can resemble another respiratory infection; vaccine timing and availability depend on season, pregnancy week and local guidance.",
    detail:
      "Contact care for breathing difficulty, chest pain, dehydration, persistent fever or worsening illness. Ask the maternity team about the current local maternal or newborn prevention pathway.",
    sourceIds: ["cdc-vaccines", "cdc-infections", "cdc-warning"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "infections-pertussis-whooping-cough-exposure",
    sectionId: "infections-vaccines",
    title: "Whooping cough exposure or persistent coughing fits",
    aliases: [
      "whooping cough",
      "pertussis",
      "coughing fits",
      "pertussis exposure",
      "Tdap exposure",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "A close pertussis exposure or prolonged coughing illness needs prompt review because testing, preventive treatment and vaccination are separate decisions.",
    detail:
      "Contact care with the exposure date, symptoms and vaccination history. Use urgent care for breathing difficulty, blue colour, chest pain, fainting, dehydration or severe worsening.",
    sourceIds: ["cdc-infections", "cdc-vaccines", "cdc-warning"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "infections-tick-bite-lyme",
    sectionId: "infections-vaccines",
    title: "Tick bite and Lyme disease concern",
    aliases: [
      "tick bite",
      "Lyme disease",
      "bullseye rash",
      "erythema migrans",
      "tick pregnancy",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "A tick bite should be assessed by species or region, attachment, removal timing, rash and symptoms rather than treated from a photo alone.",
    detail:
      "Remove an attached tick promptly with appropriate fine-tipped tweezers, save identifying information if practical and contact care about rash, fever, headache, facial weakness, joint symptoms or treatment options.",
    sourceIds: ["cdc-infections", "nhs-medicines"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "infections-norovirus-household-outbreak",
    sectionId: "infections-vaccines",
    title: "Norovirus or vomiting illness in the household",
    aliases: [
      "norovirus",
      "vomiting bug",
      "stomach flu household",
      "gastro outbreak",
      "winter vomiting virus",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "The main immediate risk from a vomiting and diarrhoea illness is often dehydration, while cleaning and food handling affect spread to others.",
    detail:
      "Use soap-and-water handwashing and pathogen-appropriate cleaning, avoid preparing food while ill and contact care for very little urine, weakness, fever, blood, severe pain or inability to keep fluids down.",
    sourceIds: ["cdc-infections", "cdc-food", "nhs-symptoms-help"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "infections-mosquito-bite-fever-travel",
    sectionId: "infections-vaccines",
    title: "Mosquito bites with fever or illness after travel",
    aliases: [
      "mosquito bite fever",
      "fever after travel",
      "dengue pregnancy",
      "malaria symptoms",
      "Zika symptoms",
    ],
    status: "urgent",
    priority: "P0",
    summary:
      "Fever or significant illness after travel to a mosquito-borne disease area needs urgent assessment with destination and dates.",
    detail:
      "Tell the clinician every country and region, travel dates, bites, preventive medicine and symptom onset. Do not wait for a routine visit or self-treat with leftover antimalarial or antibiotic medicine.",
    sourceIds: ["acog-travel", "cdc-infections", "cdc-warning"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "infections-syphilis-hepatitis-c-screening",
    sectionId: "infections-vaccines",
    title: "Syphilis and hepatitis C screening",
    aliases: [
      "syphilis test",
      "hepatitis C test",
      "HCV screening",
      "STI blood test",
      "prenatal infection screen",
    ],
    priority: "P0",
    summary:
      "Prenatal infection screening identifies conditions that may have no symptoms but can change treatment and newborn planning.",
    detail:
      "Ask which infections were tested, when repeat testing is advised for new exposure, how results remain confidential and what confirmatory test follows a reactive screen.",
    sourceIds: ["cdc-infections", "acog-prenatal-care", "who-antenatal"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "infections-tuberculosis-exposure-screening",
    sectionId: "infections-vaccines",
    title: "Tuberculosis exposure or screening",
    aliases: [
      "tuberculosis",
      "TB exposure",
      "TB test pregnancy",
      "positive skin test",
      "quantiferon pregnancy",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "A TB exposure, positive screening test and active TB symptoms are different situations that require public-health and maternity coordination.",
    detail:
      "Contact care promptly after a close exposure or for persistent cough, fever, night sweats, weight loss or coughing blood. Do not delay an indicated evaluation because of pregnancy.",
    sourceIds: [
      "cdc-infections",
      "cdc-pregnant-healthcare-workers",
      "cdc-warning",
    ],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "infections-genital-warts-hpv",
    sectionId: "infections-vaccines",
    title: "Genital warts and HPV",
    aliases: [
      "genital warts",
      "HPV pregnancy",
      "human papillomavirus",
      "wart vulva",
      "abnormal cervical screening",
    ],
    status: "contact-care",
    summary:
      "HPV, visible warts and an abnormal cervical screen are related but not interchangeable, and pregnancy can change which treatments or follow-up are suitable.",
    detail:
      "Arrange examination for a new lesion or bleeding and keep recommended cervical follow-up. Do not apply ordinary hand-or-foot wart medicine to genital skin.",
    sourceIds: ["cdc-infections", "acog-prenatal-care", "nhs-medicines"],
  }),
  catalogFinding({
    id: "infections-cold-sore-oral-herpes",
    sectionId: "infections-vaccines",
    title: "Cold sores and oral herpes",
    aliases: [
      "cold sore",
      "oral herpes",
      "HSV-1",
      "fever blister",
      "cold sore near newborn",
    ],
    status: "contact-care",
    summary:
      "An ordinary recurrent cold sore differs from a first herpes illness or genital lesion, and newborn contact precautions become important around birth.",
    detail:
      "Avoid kissing a newborn or touching lesions before contact, wash hands and ask about treatment for a first, severe or frequent outbreak. Report any genital sore to maternity care promptly.",
    sourceIds: ["cdc-infections", "nhs-medicines", "who-newborn"],
  }),
  catalogFinding({
    id: "infections-food-recall-exposure",
    sectionId: "infections-vaccines",
    title: "Food recall or outbreak exposure",
    aliases: [
      "food recall",
      "recalled food",
      "outbreak food",
      "ate recalled product",
      "food safety alert pregnancy",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "The useful next step depends on the named pathogen, product, batch, amount, date and symptoms—not every recall requires the same test or treatment.",
    detail:
      "Keep the packaging or recall notice, stop eating the product and contact care or public health as the notice directs. Seek urgent advice for fever, severe illness, dehydration or reduced movement.",
    sourceIds: ["cdc-food", "cdc-infections", "cdc-warning"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "infections-strep-throat-antibiotic",
    sectionId: "infections-vaccines",
    title: "Strep throat, tonsillitis and antibiotics",
    aliases: [
      "strep throat",
      "tonsillitis",
      "sore throat antibiotics",
      "positive strep test",
      "throat infection pregnancy",
    ],
    status: "contact-care",
    summary:
      "A severe sore throat can be viral, bacterial or another infection, and antibiotic choice should follow examination or testing rather than leftovers.",
    detail:
      "Contact care for high fever, dehydration, rash, one-sided swelling, difficulty swallowing saliva or breathing. Take a prescribed course exactly as directed and check allergy history.",
    sourceIds: ["cdc-infections", "nhs-medicines", "cdc-warning"],
  }),
  catalogFinding({
    id: "infections-scabies-ringworm-household",
    sectionId: "infections-vaccines",
    title: "Scabies, ringworm or contagious skin infection",
    aliases: [
      "scabies",
      "ringworm",
      "contagious rash",
      "fungal skin infection",
      "household itching",
    ],
    status: "contact-care",
    summary:
      "Contagious rashes need the correct diagnosis because household treatment, cleaning and pregnancy-compatible medicines differ.",
    detail:
      "Avoid sharing towels or bedding and contact a clinician or pharmacist before treatment. Seek urgent care for fever, rapidly spreading redness, facial swelling, blistering or breathing difficulty.",
    sourceIds: ["cdc-infections", "nhs-medicines", "cdc-warning"],
  }),
  catalogFinding({
    id: "mental-health-pregnancy-after-loss",
    sectionId: "mental-health",
    title: "Pregnancy after miscarriage, stillbirth or infant loss",
    aliases: [
      "pregnancy after loss",
      "rainbow baby anxiety",
      "pregnant after miscarriage",
      "pregnant after stillbirth",
      "PAL anxiety",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "A new pregnancy after loss can hold hope, fear, grief and numbness together; none of those reactions predicts the outcome or reflects poor attachment.",
    detail:
      "Ask for a plan covering appointment communication, scan triggers, anniversaries, continuity, mental-health support and how to get help between visits. Reassurance alone may not address trauma.",
    sourceIds: ["acog-mental-health", "nhs-mental", "acog-prenatal-care"],
  }),
  catalogFinding({
    id: "mental-health-current-grief-bereavement",
    sectionId: "mental-health",
    title: "Grief and bereavement during pregnancy",
    aliases: [
      "grief pregnancy",
      "bereavement",
      "death in family pregnant",
      "mourning pregnancy",
      "grieving while pregnant",
    ],
    status: "contact-care",
    summary:
      "Grief can affect sleep, appetite, concentration and daily function without following a fixed timeline or cancelling other feelings about pregnancy.",
    detail:
      "Tell the care team what has changed and what support is available. Seek urgent help for inability to stay safe, not eating or drinking, severe panic, confusion or thoughts of self-harm.",
    sourceIds: ["acog-mental-health", "nhs-mental", "cdc-warning"],
  }),
  catalogFinding({
    id: "mental-health-perinatal-ocd-compulsions",
    sectionId: "mental-health",
    title: "Perinatal OCD, compulsions and intrusive thoughts",
    aliases: [
      "perinatal OCD",
      "pregnancy OCD",
      "compulsions",
      "contamination fear pregnancy",
      "checking baby constantly",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Unwanted intrusive thoughts and compulsive checking or avoidance can be symptoms of OCD and do not by themselves mean someone wants to act on the thoughts.",
    detail:
      "Ask for a perinatal mental-health assessment when rituals, reassurance seeking or avoidance consume time or impair daily life. Use urgent help if you may act, cannot stay safe or lose contact with reality.",
    sourceIds: ["acog-mental-health", "nhs-mental", "cdc-warning"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "mental-health-adhd-autism-accommodations",
    sectionId: "mental-health",
    title: "ADHD, autism and sensory or communication accommodations",
    aliases: [
      "ADHD pregnancy",
      "autistic pregnancy",
      "sensory needs appointment",
      "neurodivergent pregnancy",
      "communication accommodations",
    ],
    status: "contact-care",
    summary:
      "Executive-function, sensory and communication needs can affect appointments and care without being a lack of interest or capacity.",
    detail:
      "Request written steps, quieter waiting, direct language, extra processing time, permission for a support person and one clear contact route. Review medicines separately with the prescriber.",
    sourceIds: ["acog-mental-health", "nhs-mental", "nhs-medicines"],
  }),
  catalogFinding({
    id: "mental-health-relationship-conflict-couples-support",
    sectionId: "mental-health",
    title: "Relationship conflict and couples support",
    aliases: [
      "relationship problems pregnancy",
      "arguing with partner",
      "couples counseling",
      "partner conflict",
      "relationship stress",
    ],
    status: "contact-care",
    summary:
      "Conflict may rise around workload, money, sex, family or expectations, but fear, coercion and violence are not ordinary communication problems.",
    detail:
      "Consider structured support when both people can participate safely. Ask to speak with a clinician alone if there is control, surveillance, threats, forced sex or concern that couples work could increase danger.",
    sourceIds: ["acog-mental-health", "acog-ipv", "nhs-mental"],
  }),
  catalogFinding({
    id: "mental-health-loneliness-isolation",
    sectionId: "mental-health",
    title: "Loneliness and social isolation",
    aliases: [
      "lonely pregnancy",
      "isolated pregnant",
      "no support",
      "alone during pregnancy",
      "social isolation",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Lack of practical or emotional support can affect safety, appointments, food, rest and mental health even without a formal diagnosis.",
    detail:
      "Tell the care team what help is missing and ask about community, social-work, peer or practical support. Use urgent help for immediate danger, inability to meet basic needs or thoughts of harm.",
    sourceIds: ["acog-mental-health", "who-antenatal", "nhs-mental"],
  }),
  catalogFinding({
    id: "mental-health-ambivalence-bonding",
    sectionId: "mental-health",
    title: "Ambivalence or not feeling bonded during pregnancy",
    aliases: [
      "not bonded to baby",
      "ambivalent pregnancy",
      "not excited pregnant",
      "no connection to baby",
      "mixed feelings pregnancy",
    ],
    status: "generally-ok",
    summary:
      "Bonding is not a required instant feeling; ambivalence, numbness or gradual connection can coexist with attentive care.",
    detail:
      "Mention persistent distress, guilt, low mood, anxiety or difficulty functioning so support can address the experience without judging it. Seek urgent help for thoughts of harm or loss of reality.",
    sourceIds: ["acog-mental-health", "nhs-mental"],
  }),
  catalogFinding({
    id: "mental-health-financial-housing-work-stress",
    sectionId: "mental-health",
    title: "Financial, housing or work insecurity",
    aliases: [
      "money stress pregnancy",
      "housing insecurity",
      "job loss pregnant",
      "financial anxiety",
      "work stress pregnancy",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Money, housing and employment problems can become health and safety issues by limiting food, transport, medicines, rest or access to appointments.",
    detail:
      "Tell the care team the concrete barrier and ask for social-work or local practical support. If housing is unsafe, there is no food or medicine, or someone is using money to control you, say so privately.",
    sourceIds: ["who-antenatal", "acog-mental-health", "acog-ipv"],
  }),
  catalogFinding({
    id: "mental-health-therapy-counseling-support-groups",
    sectionId: "mental-health",
    title: "Therapy, counselling and support groups",
    aliases: [
      "therapy pregnancy",
      "counseling pregnant",
      "counselling pregnant",
      "support group pregnancy",
      "perinatal therapist",
    ],
    status: "generally-ok",
    summary:
      "Psychological support can be used during pregnancy, but provider training, confidentiality, method, severity and crisis backup matter.",
    detail:
      "Ask how the provider handles perinatal concerns, urgent deterioration, medicine coordination and privacy. A peer group can add connection but does not replace clinical care for severe symptoms.",
    sourceIds: ["acog-mental-health", "nhs-mental"],
  }),
  catalogFinding({
    id: "mental-health-mania-psychosis-loss-reality",
    sectionId: "mental-health",
    title: "Mania, psychosis or loss of contact with reality",
    aliases: [
      "mania pregnancy",
      "psychosis pregnancy",
      "hearing voices",
      "paranoia pregnant",
      "not sleeping racing thoughts",
      "loss of reality",
    ],
    status: "urgent",
    priority: "P0",
    summary:
      "Hallucinations, fixed false beliefs, severe confusion, extreme agitation or days with almost no sleep and escalating energy need urgent psychiatric and maternity assessment.",
    detail:
      "Use emergency help now, stay with a trusted person if safe and do not drive. Tell responders about pregnancy, medicines, recent sleep and any risk of harm; do not stop psychiatric medicine abruptly without medical direction.",
    sourceIds: ["acog-mental-health", "nhs-mental", "cdc-warning"],
    volatility: "rapid-review",
  }),
];

const coordinatedCareAndPreparationFindings = [
  catalogFinding({
    id: "health-conditions-accessibility-chronic-hypertension",
    sectionId: "health-conditions-accessibility",
    title: "Chronic high blood pressure",
    aliases: [
      "chronic hypertension",
      "high blood pressure before pregnancy",
      "blood pressure medicine pregnancy",
    ],
    status: "check-first",
    priority: "P0",
    summary:
      "Chronic hypertension needs an early pregnancy-specific medicine, blood-pressure, kidney and pre-eclampsia prevention plan; do not change treatment from a generic list.",
    detail:
      "Ask who reviews home and clinic readings, which symptoms need urgent assessment, whether additional laboratory or fetal-growth monitoring is planned and how the plan continues after birth. Bring the exact cuff and medicine list to review.",
    sourceIds: ["acog-preeclampsia", "nhs-existing-conditions"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "health-conditions-accessibility-asthma-control-plan",
    sectionId: "health-conditions-accessibility",
    title: "Asthma and a changing breathing pattern",
    aliases: [
      "asthma pregnancy",
      "wheezing pregnant",
      "asthma action plan pregnancy",
    ],
    status: "check-first",
    priority: "P0",
    summary:
      "Keep asthma controlled and review the exact preventer, reliever, spacer and action plan; sudden or severe breathlessness still needs urgent assessment rather than being assumed to be asthma.",
    detail:
      "Ask how pregnancy changes monitoring, what counts as poor control and when to use urgent care. Do not ration or stop prescribed inhalers without the clinician responsible for asthma and pregnancy making a replacement plan.",
    sourceIds: ["nhs-existing-conditions", "cdc-medicine", "cdc-warning"],
  }),
  catalogFinding({
    id: "health-conditions-accessibility-thyroid-disease",
    sectionId: "health-conditions-accessibility",
    title: "Thyroid disease and thyroid medicine",
    aliases: [
      "hypothyroid pregnancy",
      "hyperthyroid pregnancy",
      "levothyroxine pregnancy",
      "thyroid blood test pregnancy",
    ],
    status: "check-first",
    priority: "P1",
    summary:
      "Existing thyroid disease needs prompt review of the exact diagnosis, medicine and blood-test schedule because pregnancy can change monitoring and treatment needs.",
    detail:
      "Continue prescribed treatment until reviewed. Ask which results are being followed, when repeat tests are due, who changes the dose and which palpitations, severe vomiting, weakness or other symptoms require earlier assessment.",
    sourceIds: ["nhs-existing-conditions", "acog-prepregnancy", "cdc-medicine"],
  }),
  catalogFinding({
    id: "health-conditions-accessibility-kidney-disease",
    sectionId: "health-conditions-accessibility",
    title: "Kidney disease or reduced kidney function",
    aliases: [
      "kidney disease pregnancy",
      "renal disease pregnancy",
      "kidney transplant pregnancy",
      "protein in urine kidney disease",
    ],
    status: "check-first",
    priority: "P0",
    summary:
      "Kidney disease needs coordinated renal and maternity care covering kidney function, blood pressure, protein in urine, medicines and fetal-growth monitoring.",
    detail:
      "Ask who interprets changes from your usual baseline, how often blood and urine tests are needed and which swelling, headache, reduced urine, breathing change or high reading needs urgent assessment. Do not alter fluid or medicine plans alone.",
    sourceIds: ["nhs-existing-conditions", "acog-preeclampsia", "cdc-medicine"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "health-conditions-accessibility-autoimmune-inflammatory-condition",
    sectionId: "health-conditions-accessibility",
    title: "Autoimmune or inflammatory condition",
    aliases: [
      "lupus pregnancy",
      "rheumatoid arthritis pregnancy",
      "autoimmune disease pregnant",
      "inflammatory disease pregnancy",
    ],
    status: "check-first",
    priority: "P1",
    summary:
      "An autoimmune or inflammatory condition needs a shared plan for disease activity, antibodies, organ involvement, medicines, flare symptoms and pregnancy monitoring.",
    detail:
      "Ask the specialist and maternity team what is stable, what would count as a flare and how infection or pregnancy complications will be distinguished. Keep prescribed treatment until a coordinated replacement or dose plan is provided.",
    sourceIds: ["nhs-existing-conditions", "acog-preeclampsia", "cdc-medicine"],
  }),
  catalogFinding({
    id: "health-conditions-accessibility-blood-disorder-anticoagulation",
    sectionId: "health-conditions-accessibility",
    title: "Blood disorder or prescribed anticoagulation",
    aliases: [
      "blood thinner pregnancy",
      "anticoagulant pregnancy",
      "clotting disorder pregnancy",
      "sickle cell pregnancy",
    ],
    status: "check-first",
    priority: "P0",
    summary:
      "A blood disorder or prescribed anticoagulant needs specialist coordination for the exact diagnosis, medicine, laboratory monitoring, bleeding or clot symptoms and birth planning.",
    detail:
      "Do not skip, double or stop a dose without direct instructions. Ask who to call for bleeding, one-sided swelling, chest symptoms or a procedure and how timing around labour, anaesthesia and after-birth care will be handled.",
    sourceIds: ["who-maternal-2025", "cdc-medicine", "cdc-warning"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "health-conditions-accessibility-wheelchair-mobility-transfers",
    sectionId: "health-conditions-accessibility",
    title: "Wheelchair use, mobility aids and transfers",
    aliases: [
      "wheelchair",
      "wheelchair pregnancy",
      "mobility aid pregnancy",
      "disabled pregnant transfers",
      "accessible maternity care",
    ],
    status: "generally-ok",
    priority: "P1",
    summary:
      "Keep the mobility aids that support independence and ask for an access plan as balance, reach, pressure, pain or transfer technique changes during pregnancy.",
    detail:
      "Review examination tables, weighing, hoists, positioning, pressure care, thrombosis risk, transport and emergency evacuation before they become urgent. Support people may assist, but staff must still communicate and obtain consent directly from you.",
    sourceIds: ["who-disability-reproductive-health", "who-antenatal"],
  }),
  catalogFinding({
    id: "health-conditions-accessibility-communication-sensory-access",
    sectionId: "health-conditions-accessibility",
    title: "Communication, hearing, vision or sensory access",
    aliases: [
      "deaf pregnancy interpreter",
      "blind pregnancy accessible information",
      "sensory needs labour",
      "communication disability maternity",
    ],
    status: "generally-ok",
    priority: "P1",
    summary:
      "Request the communication format, interpreter, lighting, quiet space, orientation and extra processing time that let you understand information and make your own decisions.",
    detail:
      "Put access needs in the record and birth preferences, including how staff should get attention, explain touch, identify themselves and communicate during an emergency. A companion supplements professional access support rather than replacing it.",
    sourceIds: ["who-disability-reproductive-health", "who-antenatal"],
  }),
  catalogFinding({
    id: "pregnancy-complications-gestational-diabetes-diagnosis",
    sectionId: "pregnancy-complications",
    title: "Gestational diabetes diagnosis",
    aliases: [
      "gestational diabetes diagnosed",
      "GDM pregnancy",
      "high glucose pregnancy",
      "failed glucose test",
    ],
    status: "check-first",
    priority: "P0",
    summary:
      "A gestational diabetes diagnosis needs an individualized glucose, food, activity, medicine and fetal-growth plan; it is not a verdict about effort or a reason for an extreme diet.",
    detail:
      "Ask how and when to check glucose, what numbers trigger contact, who reviews the record and what changes after birth. Do not start supplements or remove whole food groups to chase a result without clinical nutrition guidance.",
    sourceIds: ["acog-gestational-diabetes", "who-maternal-2025"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "pregnancy-complications-hypertension-preeclampsia-plan",
    sectionId: "pregnancy-complications",
    title: "Gestational hypertension or pre-eclampsia care plan",
    aliases: [
      "diagnosed preeclampsia",
      "gestational hypertension",
      "high blood pressure pregnancy monitoring",
      "HELLP monitoring",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "A hypertension or pre-eclampsia diagnosis needs clear blood-pressure, symptom, laboratory, fetal-monitoring and birth-timing instructions, including how to get assessed between appointments.",
    detail:
      "Ask which readings and symptoms need immediate care and who reviews home measurements. Severe headache, vision change, upper abdominal pain, breathing difficulty, seizure or feeling seriously unwell must not wait for the next scheduled check.",
    sourceIds: ["acog-preeclampsia", "cdc-warning"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "pregnancy-complications-multiple-pregnancy-chorionicity",
    sectionId: "pregnancy-complications",
    title: "Twins or multiples and chorionicity",
    aliases: [
      "twin pregnancy monitoring",
      "multiple pregnancy",
      "chorionicity twins",
      "shared placenta twins",
    ],
    status: "check-first",
    priority: "P1",
    summary:
      "For twins or higher multiples, ask whether placentas and amniotic sacs are shared because chorionicity changes monitoring, complication and birth-planning needs.",
    detail:
      "Keep the written scan description and ask how often growth and fluid are checked, what symptoms require contact and which maternity and neonatal services are available. Do not compare the schedule with a singleton pregnancy.",
    sourceIds: ["acog-multiple-pregnancy", "who-antenatal"],
  }),
  catalogFinding({
    id: "pregnancy-complications-possible-pprom-waters-early",
    sectionId: "pregnancy-complications",
    title: "Possible waters breaking before 37 weeks",
    aliases: [
      "PPROM",
      "waters broke early",
      "leaking fluid preterm",
      "preterm prelabour rupture membranes",
    ],
    status: "urgent",
    priority: "P0",
    summary:
      "A gush or ongoing trickle of possible amniotic fluid before 37 weeks needs immediate maternity assessment, even when there is no pain or contractions.",
    detail:
      "Use a pad rather than a tampon, note colour, smell, amount, time and movement, and follow the urgent route. Do not rely on smell, a home pH test or temporary stopping to rule out membrane rupture.",
    sourceIds: ["acog-preterm-labor", "cdc-warning"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "pregnancy-complications-short-cervix-cerclage",
    sectionId: "pregnancy-complications",
    title: "Short cervix, cervical insufficiency or cerclage",
    aliases: [
      "short cervix pregnancy",
      "cervical insufficiency",
      "cervical stitch cerclage",
      "funneling cervix",
    ],
    status: "check-first",
    priority: "P1",
    summary:
      "A short-cervix or cerclage plan depends on measurements, pregnancy history, gestational age, symptoms and whether the pregnancy is singleton or multiple.",
    detail:
      "Ask what the procedure or monitoring is intended to change, what activity advice is evidence-based and which pressure, contractions, bleeding, discharge or fluid loss needs immediate assessment. Do not prescribe yourself bed rest.",
    sourceIds: ["acog-preterm-labor", "who-maternal-2025"],
  }),
  catalogFinding({
    id: "pregnancy-complications-amniotic-fluid-high-low",
    sectionId: "pregnancy-complications",
    title: "High or low amniotic fluid",
    aliases: [
      "polyhydramnios",
      "oligohydramnios",
      "too much amniotic fluid",
      "low amniotic fluid",
    ],
    status: "check-first",
    priority: "P1",
    summary:
      "An amniotic-fluid finding needs confirmation in context with growth, membranes, anatomy, maternal health and pregnancy week; one number does not explain the cause or outcome.",
    detail:
      "Ask how fluid was measured, whether the finding is persistent and what monitoring or tests follow. Contact maternity care promptly for fluid leakage, bleeding, contractions, breathing difficulty or a clear movement change.",
    sourceIds: ["acog-during-pregnancy", "who-maternal-2025", "cdc-warning"],
  }),
  catalogFinding({
    id: "pregnancy-complications-breech-transverse-position",
    sectionId: "pregnancy-complications",
    title: "Breech or transverse position later in pregnancy",
    aliases: [
      "breech baby",
      "transverse lie",
      "baby not head down",
      "external cephalic version",
    ],
    status: "check-first",
    priority: "P1",
    summary:
      "A breech or transverse position matters differently by pregnancy week; ask when position will be rechecked and which turning or birth options apply to your pregnancy.",
    detail:
      "Ask about benefits, limits and contraindications of external cephalic version and how placenta, fluid, previous birth, multiples or other complications affect the plan. Do not use forceful home manipulation.",
    sourceIds: ["acog-labour-birth", "who-maternal-2025"],
  }),
  catalogFinding({
    id: "pregnancy-complications-red-cell-antibodies-rhesus",
    sectionId: "pregnancy-complications",
    title: "Red-cell antibodies or Rh incompatibility planning",
    aliases: [
      "rhesus negative pregnancy",
      "Rh negative pregnancy",
      "red cell antibodies pregnancy",
      "anti D pregnancy",
    ],
    status: "check-first",
    priority: "P1",
    summary:
      "A blood-group or antibody result needs interpretation by antibody type, level, pregnancy history and the other biological parent or fetal blood information available.",
    detail:
      "Ask whether preventive treatment, repeat blood tests, fetal assessment or specialist review is needed and when. Report bleeding, abdominal injury or a procedure promptly because timing may matter for the individual plan.",
    sourceIds: ["who-antenatal", "nice-antenatal"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "loss-uncertainty-support-waiting-for-repeat-scan",
    sectionId: "loss-uncertainty-support",
    title: "Waiting for a repeat scan or blood test",
    aliases: [
      "pregnancy of uncertain viability",
      "repeat hcg scan",
      "too early to see heartbeat",
      "waiting for miscarriage confirmation",
    ],
    status: "check-first",
    priority: "P0",
    summary:
      "When an early result is inconclusive, ask exactly what was and was not seen, why waiting may improve accuracy and which symptoms should override the planned follow-up date.",
    detail:
      "Keep the written appointment and urgent route. Heavy bleeding, severe or one-sided pain, shoulder pain, fainting or feeling seriously unwell needs immediate assessment rather than waiting for repeat testing.",
    sourceIds: ["acog-bleeding", "cdc-warning"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "loss-uncertainty-support-physical-recovery-after-miscarriage",
    sectionId: "loss-uncertainty-support",
    title: "Physical recovery after miscarriage",
    aliases: [
      "after miscarriage bleeding",
      "miscarriage recovery",
      "pain after pregnancy loss",
      "when to seek help after miscarriage",
    ],
    status: "check-first",
    priority: "P0",
    summary:
      "Before leaving care, get individualized expectations for bleeding, pain, medicine, testing and follow-up plus a clear urgent route for heavy bleeding, fever, fainting or worsening pain.",
    detail:
      "Ask when ordinary activity, work, sex, bathing and attempts at another pregnancy can be considered for your situation. Emotional recovery may follow a different timetable from physical recovery and deserves its own support.",
    sourceIds: [
      "acog-pregnancy-loss-support",
      "acog-postpartum",
      "cdc-warning",
    ],
  }),
  catalogFinding({
    id: "loss-uncertainty-support-results-after-loss",
    sectionId: "loss-uncertainty-support",
    title: "Receiving test or placental results after a loss",
    aliases: [
      "autopsy results stillbirth",
      "placenta results after loss",
      "genetic testing pregnancy loss",
      "why did pregnancy loss happen",
    ],
    status: "check-first",
    priority: "P1",
    summary:
      "Arrange a planned results conversation that separates what a test found, what it ruled out, what remains unexplained and what may change future care.",
    detail:
      "Ask for a written copy and time for questions. A result can be useful even when it does not identify one cause, and lack of an explanation is not evidence that an ordinary action or emotion caused the loss.",
    sourceIds: ["acog-stillbirth", "acog-pregnancy-loss-support"],
  }),
  catalogFinding({
    id: "loss-uncertainty-support-memory-making-rituals",
    sectionId: "loss-uncertainty-support",
    title: "Memory-making, rituals and private choices",
    aliases: [
      "memory box pregnancy loss",
      "funeral after stillbirth",
      "photos after loss",
      "pregnancy loss ritual",
    ],
    status: "generally-ok",
    priority: "P1",
    summary:
      "Photos, keepsakes, naming, ceremonies, spiritual care or choosing none of these are personal options; there is no correct amount of public recognition or memory-making.",
    detail:
      "Ask staff what choices are time-sensitive and whether items can be kept for later decisions. Make space for cultural and family needs without pressuring the pregnant person or partner to participate in a ritual they do not want.",
    sourceIds: ["acog-stillbirth", "acog-pregnancy-loss-support"],
  }),
  catalogFinding({
    id: "loss-uncertainty-support-returning-work-social-contact",
    sectionId: "loss-uncertainty-support",
    title: "Returning to work and social contact after loss",
    aliases: [
      "return to work after miscarriage",
      "tell people pregnancy loss",
      "social media after stillbirth",
      "workplace bereavement pregnancy loss",
    ],
    status: "generally-ok",
    priority: "P1",
    summary:
      "Decide who receives details, who can update others and what work or social contact feels manageable; privacy, time away and practical adjustments can change over time.",
    detail:
      "A trusted person can cancel appointments, handle messages or explain boundaries. Ask a clinician for documentation when physical recovery affects work, and seek mental-health support when isolation or return pressure is becoming harmful.",
    sourceIds: ["acog-pregnancy-loss-support", "acog-mental-health"],
  }),
  catalogFinding({
    id: "loss-uncertainty-support-partner-family-grief",
    sectionId: "loss-uncertainty-support",
    title: "Partner and family grief after pregnancy loss",
    aliases: [
      "partner grief miscarriage",
      "dad grief stillbirth",
      "support partner pregnancy loss",
      "family after miscarriage",
    ],
    status: "generally-ok",
    priority: "P1",
    summary:
      "Partners and relatives may grieve differently or at different times; support should include them without shifting physical recovery, decisions or emotional labour back onto the recovering person.",
    detail:
      "Use direct questions about practical help and preferred communication rather than assuming silence means coping. Individual, couples or peer support may help when conflict, blame, numbness or isolation continues.",
    sourceIds: ["acog-pregnancy-loss-support", "acog-stillbirth"],
  }),
  catalogFinding({
    id: "loss-uncertainty-support-grief-anxiety-daily-life",
    sectionId: "loss-uncertainty-support",
    title: "Grief or anxiety disrupting daily life",
    aliases: [
      "depression after miscarriage",
      "anxiety after stillbirth",
      "trauma after pregnancy loss",
      "cannot cope after miscarriage",
    ],
    status: "contact-care",
    priority: "P0",
    summary:
      "Contact a health professional when grief, panic, guilt, numbness, nightmares or avoidance is making sleep, eating, work, relationships or self-care difficult.",
    detail:
      "Ask for support matched to your needs, which may include practical care, bereavement counselling, therapy, peer support or medicine review. Use emergency help now for thoughts of harm, severe confusion or loss of reality.",
    sourceIds: [
      "acog-pregnancy-loss-support",
      "acog-mental-health",
      "cdc-warning",
    ],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "birth-newborn-preparation-consent-plan-changes",
    sectionId: "birth-newborn-preparation",
    title: "Consent and communication when the birth plan changes",
    aliases: [
      "informed consent labour",
      "birth plan changed",
      "emergency birth decisions",
      "consent during labour",
    ],
    status: "generally-ok",
    priority: "P0",
    summary:
      "A change in circumstances should still be explained in plain language with the reason, urgency, material options and next step whenever the situation allows.",
    detail:
      "Write how staff should communicate, who may support you and what helps under stress. A support person can repeat questions and record information but does not replace your consent or speak over you.",
    sourceIds: ["who-antenatal", "acog-labour-birth"],
  }),
  catalogFinding({
    id: "birth-newborn-preparation-access-needs-labour",
    sectionId: "birth-newborn-preparation",
    title: "Disability and access plan for labour and recovery",
    aliases: [
      "accessible labour ward",
      "disabled birth plan",
      "interpreter during labour",
      "sensory birth plan",
    ],
    status: "check-first",
    priority: "P1",
    summary:
      "Document transfers, positioning, equipment, communication, sensory needs, medication support and who coordinates reasonable adjustments before labour begins.",
    detail:
      "Ask whether the planned setting has accessible rooms, hoists, examination equipment and staff familiar with your needs. Include how urgent communication works if an interpreter or chosen support person is not immediately present.",
    sourceIds: ["who-disability-reproductive-health", "who-antenatal"],
  }),
  catalogFinding({
    id: "birth-newborn-preparation-blood-products-preferences",
    sectionId: "birth-newborn-preparation",
    title: "Blood products and major-bleeding preferences",
    aliases: [
      "blood transfusion birth",
      "refuse blood products pregnancy",
      "postpartum hemorrhage plan",
      "major bleeding birth plan",
    ],
    status: "check-first",
    priority: "P1",
    summary:
      "If transfusion choices, antibodies, anaemia or bleeding risk need special planning, discuss them early with maternity, anaesthesia and blood-bank teams rather than during an emergency.",
    detail:
      "Ask which products or alternatives are acceptable, how decisions are documented, whether advance directives apply and what the planned setting can provide. Individual beliefs and risks require specialist discussion, not a generic promise.",
    sourceIds: ["who-maternal-2025", "acog-placenta-accreta"],
    volatility: "rapid-review",
  }),
  catalogFinding({
    id: "birth-newborn-preparation-feeding-after-surgery-medicine",
    sectionId: "birth-newborn-preparation",
    title: "Feeding preparation after breast surgery or with regular medicine",
    aliases: [
      "breastfeeding after breast surgery",
      "medicine breastfeeding plan",
      "low milk supply risk pregnancy",
      "feeding plan medical condition",
    ],
    status: "check-first",
    priority: "P1",
    summary:
      "Previous breast or chest surgery, endocrine conditions and regular medicines are reasons for an early feeding and medicine review, not proof that one feeding method will or will not work.",
    detail:
      "Ask who will assess feeding and milk transfer, what supplementation options exist and how parent and baby medicines are checked after birth. Protect informed choice and do not delay food for a baby while waiting for an ideal plan.",
    sourceIds: ["acog-breastfeeding-challenges", "who-feeding", "cdc-medicine"],
  }),
  catalogFinding({
    id: "birth-newborn-preparation-safe-sleep-products",
    sectionId: "birth-newborn-preparation",
    title: "Safe newborn sleep products",
    aliases: [
      "baby nest safe sleep",
      "newborn sleep positioner",
      "inclined sleeper baby",
      "crib bassinet setup",
    ],
    status: "avoid",
    priority: "P0",
    summary:
      "Use a firm, flat sleep surface made for infant sleep with a fitted sheet; keep pillows, loose bedding, bumpers, toys, nests and positioners out of the sleep space.",
    detail:
      "Place the baby on their back for sleep and avoid overheating or smoke exposure. Marketing words such as cocoon, anti-reflux or breathable do not replace current safe-sleep guidance for the exact product.",
    sourceIds: ["cdc-safe-sleep", "aap-safe-sleep"],
  }),
  catalogFinding({
    id: "birth-newborn-preparation-parent-followup-plan",
    sectionId: "birth-newborn-preparation",
    title: "The recovering parent’s follow-up plan",
    aliases: [
      "postpartum appointment plan",
      "mother check after birth",
      "parent recovery follow up",
      "postnatal care plan",
    ],
    status: "generally-ok",
    priority: "P0",
    summary:
      "Before birth, plan separate follow-up for the recovering parent covering physical recovery, mood, feeding, sleep, chronic conditions, medicines, contraception and future health.",
    detail:
      "Write down who contacts you, when the first check occurs and which symptoms bypass routine follow-up. Baby appointments do not assess blood pressure, wounds, bleeding, pelvic health, trauma or mental health for the parent.",
    sourceIds: ["who-postnatal", "acog-postpartum", "cdc-warning"],
  }),
  catalogFinding({
    id: "birth-newborn-preparation-newborn-screening-followup",
    sectionId: "birth-newborn-preparation",
    title: "Newborn screening and results follow-up",
    aliases: [
      "newborn blood spot test",
      "newborn hearing screen",
      "newborn screening results",
      "heel prick test",
    ],
    status: "check-first",
    priority: "P1",
    summary:
      "Ask which newborn screens are offered, when each is done, who receives the result and what happens after an incomplete or unexpected screen.",
    detail:
      "Screening is not the same as diagnosis. Keep contact details current, attend repeat testing promptly and ask for an explanation of what a positive, unclear or missed result means for the next step.",
    sourceIds: ["who-newborn", "who-postnatal"],
  }),
  catalogFinding({
    id: "birth-newborn-preparation-neonatal-team-conversation",
    sectionId: "birth-newborn-preparation",
    title: "Preparing for possible neonatal care",
    aliases: [
      "NICU tour pregnancy",
      "neonatal intensive care preparation",
      "premature baby hospital plan",
      "neonatologist consultation",
    ],
    status: "check-first",
    priority: "P1",
    summary:
      "When preterm birth or newborn illness is possible, ask for a neonatal conversation about likely first steps, uncertainty, transfer, parent access, feeding support and communication.",
    detail:
      "Ask who gives updates, how consent works, whether skin-to-skin or milk expression may be possible and what practical support is available. A range of outcomes should be explained without treating one estimate as certainty.",
    sourceIds: ["acog-preterm-labor", "who-newborn", "who-postnatal"],
  }),
];

const findingRelationships = {
  "everyday-home-hot-tub-or-sauna": [
    "exercise-movement-hot-yoga-hot-pilates-and-extreme-heat-workouts",
    "everyday-home-warm-bath-or-shower",
  ],
  "common-symptoms-preeclampsia": [
    "pregnancy-complications-hypertension-preeclampsia-plan",
    "common-symptoms-headache-vision",
    "common-symptoms-upper-right-abdominal-pain",
  ],
  "appointments-warning-signs-gestational-diabetes-test": [
    "pregnancy-complications-gestational-diabetes-diagnosis",
    "health-conditions-accessibility-chronic-hypertension",
  ],
  "pregnancy-complications-gestational-diabetes-diagnosis": [
    "appointments-warning-signs-gestational-diabetes-test",
    "health-conditions-accessibility-type-1-or-type-2-diabetes-before-pregnancy",
    "birth-newborn-preparation-parent-followup-plan",
  ],
  "pregnancy-complications-hypertension-preeclampsia-plan": [
    "common-symptoms-preeclampsia",
    "common-symptoms-headache-vision",
    "birth-newborn-preparation-parent-followup-plan",
  ],
  "pregnancy-complications-possible-pprom-waters-early": [
    "appointments-warning-signs-preterm-birth",
    "birth-newborn-preparation-neonatal-team-conversation",
  ],
  "pregnancy-complications-multiple-pregnancy-chorionicity": [
    "appointments-warning-signs-twins-multiples",
    "birth-newborn-preparation-neonatal-team-conversation",
  ],
  "loss-uncertainty-support-waiting-for-repeat-scan": [
    "common-symptoms-one-sided-abdominal-pain",
    "common-symptoms-bleeding-spotting",
    "loss-uncertainty-support-physical-recovery-after-miscarriage",
  ],
  "loss-uncertainty-support-physical-recovery-after-miscarriage": [
    "loss-uncertainty-support-results-after-loss",
    "loss-uncertainty-support-grief-anxiety-daily-life",
  ],
  "mental-health-pregnancy-after-loss": [
    "loss-uncertainty-support-waiting-for-repeat-scan",
    "loss-uncertainty-support-grief-anxiety-daily-life",
  ],
  "birth-newborn-preparation-safe-sleep-products": [
    "birth-newborn-preparation-newborn-screening-followup",
    "birth-newborn-preparation-parent-followup-plan",
  ],
  "appointments-warning-signs-caesarean": [
    "birth-newborn-preparation-consent-plan-changes",
    "birth-newborn-preparation-parent-followup-plan",
  ],
};

const findings = [
  ...baselineFindings,
  ...expandedFindings,
  ...depthFindings,
  ...environmentAndDailyLifeFindings,
  ...testingAndSymptomDepthFindings,
  ...skinInfectionAndWellbeingDepthFindings,
  ...coordinatedCareAndPreparationFindings,
].map((entry) => ({
  ...entry,
  relatedIds: findingRelationships[entry.id] ?? [],
}));

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
      reviewer: "Internal editorial record",
      volatility: "annual",
    },
  },
];

const collections = {
  timeline,
  milestones,
  essentials,
  findings,
  substitutions,
  preconception,
  postpartumTopics,
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
    id: entry.id,
    type: "timeline",
    title: entry.title,
    summary: entry.dek,
    href:
      entry.kind === "postpartum"
        ? `/timeline/postpartum/${entry.slug}/`
        : `/timeline/${entry.slug}/`,
    topics: entry.topics,
    aliases: [
      entry.windowLabel,
      entry.slug.replaceAll("-", " "),
      ...entry.topics,
    ],
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
    priority: entry.kind === "postpartum" ? 12 : 10,
  })),
  ...essentials.map((entry) => ({
    id: entry.id,
    type: "essential",
    title: entry.title,
    summary: entry.intro,
    href: `/essentials/#${entry.slug}`,
    topics: [entry.slug],
    aliases: [
      entry.eyebrow,
      entry.slug.replaceAll("-", " "),
      ...entry.examples.map((example) => example.name),
    ],
    text: [
      ...entry.dos,
      ...entry.donts,
      ...entry.askDoctor,
      ...entry.examples.flatMap((example) => [example.name, example.guidance]),
    ].join(" "),
    priority: 5,
  })),
  ...findings.map((entry) => ({
    id: entry.id,
    type: "finding",
    title: entry.title,
    summary: entry.summary,
    href: `/essentials/finding/${entry.id}/`,
    topics: [
      entry.sectionId,
      entry.status,
      entry.priority,
      entry.recordType,
      entry.careTier,
      ...entry.intents,
    ],
    aliases: entry.aliases,
    text: [
      ...entry.details,
      ...entry.decisionFactors,
      entry.careNote,
      entry.recordType,
    ].join(" "),
    priority: entry.priority === "P0" ? 40 : entry.priority === "P1" ? 28 : 18,
    status: entry.status,
    careTier: entry.careTier,
    sectionId: entry.sectionId,
    reviewedAt: entry.review.reviewedAt,
    intents: entry.intents,
  })),
  ...substitutions.map((entry) => ({
    id: `swap-${entry.id}`,
    type: "swap",
    title: entry.item,
    summary: entry.shortAnswer,
    href: `/essentials/#swap-${entry.id}`,
    topics: [entry.group, entry.status, ...entry.searchTerms],
    aliases: entry.searchTerms,
    text: [
      entry.why,
      entry.labelCheck,
      ...entry.alternatives.flatMap((alternative) => [
        alternative.label,
        alternative.title,
        alternative.note,
      ]),
    ].join(" "),
    priority: 22,
  })),
  ...preconception.map((entry) => ({
    id: entry.id,
    type: "preconception",
    title: entry.title,
    summary: entry.dek,
    href: "/getting-pregnant/",
    topics: ["trying to conceive", "fertility", "folic acid", "ovulation"],
    aliases: [
      "getting pregnant",
      "trying to conceive",
      "preconception",
      "fertility",
      "folic acid before pregnancy",
    ],
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
    priority: 16,
  })),
  ...postpartumTopics.map((entry) => ({
    id: `postpartum-${entry.id}`,
    type: "postpartum",
    title: entry.title,
    summary: entry.summary,
    href: `/timeline/after-birth/#${entry.id}`,
    topics: ["after birth", "postpartum", entry.id.replaceAll("-", " ")],
    aliases: [
      entry.eyebrow,
      entry.id.replaceAll("-", " "),
      `${entry.title} after birth`,
    ],
    text: [...entry.practicalSteps, ...entry.contactCare, ...entry.urgent].join(
      " ",
    ),
    priority: 17,
    careTier: "care-team",
    sectionId: "after-birth",
    reviewedAt: entry.review.reviewedAt,
    intents: ["after-birth"],
  })),
  ...urgent.map((entry) => ({
    id: entry.id,
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
    aliases: entry.signs.map((sign) => sign.title),
    text: [
      entry.action,
      ...entry.signs.flatMap((sign) => [sign.title, sign.detail]),
    ].join(" "),
    priority: 45,
  })),
  ...urgent.flatMap((entry) =>
    entry.signs.map((sign) => {
      const section =
        entry.id === "contact-care-team"
          ? "care-team"
          : entry.audience === "infant"
            ? "infant"
            : "maternal";
      return {
        id: `${entry.id}-${findingSlug(sign.title)}`,
        type: "urgent",
        title: sign.title,
        summary: sign.detail,
        href: `/urgent-help/#${section}-${findingSlug(sign.title)}`,
        topics: [entry.tier, entry.audience, "warning sign"],
        aliases: [
          sign.title,
          `${sign.title} in pregnancy`,
          `${sign.title} after birth`,
        ],
        text: `${entry.intro} ${entry.action}`,
        priority: 55,
      };
    }),
  ),
  ...milestones.map((entry) => ({
    id: `milestone-${entry.id}`,
    type: "milestone",
    title: entry.title,
    summary: entry.description,
    href: `/timeline/#milestone-${entry.id}`,
    topics: [entry.category, entry.importance, entry.anchor],
    aliases: [
      entry.title,
      entry.anchor.replaceAll("-", " "),
      `${entry.start} to ${entry.end} days`,
    ],
    text: entry.description,
    priority: 20,
  })),
  ...[
    {
      id: "partner-before-appointments",
      title: "Support before appointments",
      summary:
        "Help prepare questions, transport, notes and the practical plan before pregnancy appointments.",
      href: "/partners/#support-before-appointments",
      aliases: [
        "help at appointments",
        "support person appointment",
        "partner at scan",
      ],
    },
    {
      id: "partner-during-pregnancy",
      title: "Support during pregnancy",
      summary:
        "Share food, rest, medicine checks, household work and decisions without taking over consent.",
      href: "/partners/#support-during-pregnancy",
      aliases: [
        "help pregnant partner",
        "pregnancy partner support",
        "support person pregnancy",
      ],
    },
    {
      id: "partner-at-birth",
      title: "Support at birth",
      summary:
        "Protect consent, remember preferences, help communication and stay flexible when the plan changes.",
      href: "/partners/#support-at-birth",
      aliases: [
        "birth partner",
        "labor support",
        "labour support",
        "support person birth",
      ],
    },
    {
      id: "partner-after-birth",
      title: "Support after birth",
      summary:
        "Own practical work, protect rest, notice warning signs and keep the recovering parent's care visible.",
      href: "/partners/#support-after-birth",
      aliases: ["postpartum partner", "after birth support", "help new parent"],
    },
  ].map((entry) => ({
    ...entry,
    type: "partner",
    topics: ["partner", "support person"],
    text: entry.summary,
    priority: 14,
  })),
];
mkdirSync(resolve("public/data"), { recursive: true });
writeFileSync(
  resolve("public/data/search-index.json"),
  `${JSON.stringify(searchIndex)}\n`,
  "utf8",
);

const searchShardNames = {
  core: "Core guide pages",
  everyday: "Everyday foods, products and activities",
  care: "Symptoms, conditions, tests and specialist care",
  planning: "Birth and after-birth planning",
};
const searchShards = { core: [], everyday: [], care: [], planning: [] };
const everydayRecordTypes = new Set([
  "food",
  "drink",
  "activity",
  "medicine",
  "home-exposure",
  "work-exposure",
  "travel",
  "sexual-health",
  "sleep",
  "personal-care",
]);
for (const record of searchIndex) {
  if (
    record.type === "postpartum" ||
    record.topics.includes("birth-preparation")
  )
    searchShards.planning.push(record);
  else if (record.type !== "finding") searchShards.core.push(record);
  else if (record.topics.some((topic) => everydayRecordTypes.has(topic)))
    searchShards.everyday.push(record);
  else searchShards.care.push(record);
}
const searchShardDir = resolve("public/data/search");
mkdirSync(searchShardDir, { recursive: true });
for (const [name, records] of Object.entries(searchShards))
  writeFileSync(
    resolve(searchShardDir, `${name}.json`),
    `${JSON.stringify(records)}\n`,
    "utf8",
  );
writeFileSync(
  resolve("public/data/search-manifest.json"),
  `${JSON.stringify({
    version: 1,
    shards: Object.entries(searchShards).map(([name, records]) => ({
      id: name,
      label: searchShardNames[name],
      href: `/data/search/${name}.json`,
      count: records.length,
    })),
  })}\n`,
  "utf8",
);

console.log(
  `Generated ${timeline.length} timeline entries, ${essentials.length} pregnancy essentials, ${findings.length} direct findings, ${substitutions.length} practical swaps, ${postpartumTopics.length} after-birth topics, ${preconception.length} preconception guide, ${milestones.length} milestones and ${sources.length} internal source records.`,
);
