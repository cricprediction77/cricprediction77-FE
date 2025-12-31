// ✅ League name normalization
const LeagueNameMap = {
  "Bangladesh Premier League 2025-2026": "BPL",
  "Indian Premier League": "IPL",
  "Caribbean Premier League": "CPL",
  "Women Premier League 2026": "WPL",
  "BIG BASH LEAGUE 2025-2026": "BBL",
  "SA T20 2026": "SAT20",
  "WPL 2026": "WPL"
};

// ✅ Team logos
const LeagueTeamLogos = {
  BPL: {
    league_logo:
      "https://dko97fmntp7zh.cloudfront.net/5871001f-0f0a-4de9-9fca-47cbe669a1ba_1000645627.png",

    "Sylhet Titans":
      "https://dko97fmntp7zh.cloudfront.net/c288d927-e736-40df-9317-4faafdc11523_sylhetwithoutbg.jpg",

    "Rajshahi Warriors":
      "https://dko97fmntp7zh.cloudfront.net/66e66501-4aad-431d-952e-05e23594dbb0_rajshahiwithoutpg.jpg",

    "Noakhali Express":
      "https://dko97fmntp7zh.cloudfront.net/a566d0d4-385b-4f5a-b4b7-f0b8472ece1f_noakhaliwithoutbg.jpg",

    "Chattogram Royals":
      "https://dko97fmntp7zh.cloudfront.net/d0e1ba59-0169-4603-b67b-7bc3868f629d_chattogramwithoutbg.jpg",

    "Dhaka Capitals":
      "https://dko97fmntp7zh.cloudfront.net/008c40fd-5d31-4201-845d-b7bfd4c581a4_dhakawithoutbg.jpg",

    "Rangpur Riders":
      "https://dko97fmntp7zh.cloudfront.net/94ebf1c2-be97-4cee-9b5f-eb6da366dd06_rangpurwithoutbg.jpg",
  },

  BBL: {
    league_logo:
      "https://dko97fmntp7zh.cloudfront.net/c7c377fa-68a5-43b1-aea0-fc0ec65a1f47_BBLLOGO.jpg",

    "Perth Scorchers":
      "https://dko97fmntp7zh.cloudfront.net/8bc2565d-e57f-49e7-8ba1-a75a0d7e7aea_PERTH.jpg",

    "Sydney Sixers":
      "https://dko97fmntp7zh.cloudfront.net/8d02bcad-5de8-4c2a-841b-30831913da69_SIDNEYSIXERS.jpg",

    "Melbourne Renegades":
      "https://dko97fmntp7zh.cloudfront.net/bd1d6980-6a0f-43e2-97b8-14f4555a3eb3_MELBOURNERENEGDADES.png",

    "Brisbane Heat":
      "https://dko97fmntp7zh.cloudfront.net/c925b53f-bcd4-4c8d-b3e6-d9a06f1730d7_BRISBANEHEAT.jpg",

    "Hobart Hurricanes":
      "https://dko97fmntp7zh.cloudfront.net/a0fa2cf4-f7c5-4485-b09c-8ea8c7c1b446_HOBART HURRICANES.jpg",

    "Sydney Thunder":
      "https://dko97fmntp7zh.cloudfront.net/e15857f6-b06a-4646-b248-9cdb6ac83aab_SYDNEYTHUNDERS.jpg",

    "Adelaide Strikers":
      "https://dko97fmntp7zh.cloudfront.net/f7199e47-02b9-41c6-bce8-617f1ad14ed8_ADELAIDESTRIKERS.jpg",

    "Melbourne Stars":
      "https://dko97fmntp7zh.cloudfront.net/94ebf1c2-be97-4cee-9b5f-eb6da366dd06_rangpurwithoutbg.jpg",
  },
  SAT20: {
    league_logo:
      "https://dko97fmntp7zh.cloudfront.net/0f4fca2a-bd6d-42ac-a8bc-1e966f4df105_SAT20LOGO.jpg",

    "MI Cape Town":
      "https://dko97fmntp7zh.cloudfront.net/da39d2fe-83a5-415e-88fb-e1169f8db54e_MICAPETOWN.jpg",

    "Durban's Super Giants":
      "https://dko97fmntp7zh.cloudfront.net/f8f896a9-c1e0-4d61-9f17-a4d78c243d26_DUBAQN'S SUPERGIANTS.png",

    "Pretoria Capitals":
      "https://dko97fmntp7zh.cloudfront.net/504df789-b63c-42bd-83af-922471e216f4_PRETORIACAPITALS.png",

    "Joburg Super Kings":
      "https://dko97fmntp7zh.cloudfront.net/5290f6c2-d937-460d-8454-6209e448e8fb_JOBURGSUPERKINGS.png",

    "Paarl Royals":
      "https://dko97fmntp7zh.cloudfront.net/dd05c05e-9ce9-40b8-9a5f-4368eafb573f_PAARLROYALS.jpg",

    "Sunrisers Eastern Cape":
      "https://dko97fmntp7zh.cloudfront.net/0574c131-67bd-4c17-b0fe-87df8d8e99f3_SUNRISERS.png",
  },

  IPL: {
    league_logo: "https://example.com/ipl/ipl-logo.png",
  },

  WPL: {
    league_logo:"https://dko97fmntp7zh.cloudfront.net/8cb5d74f-a49b-4065-8862-7cf7ef0f180a_WPLLOGO.png",
     "Mumbai Indians":
        "https://dko97fmntp7zh.cloudfront.net/7d0cb9eb-0614-46a4-b86d-0c00b0e76cd0_MUMBQAIINDIAQNS.jpg",

    "Royal Challengers Bengaluru":
        "https://dko97fmntp7zh.cloudfront.net/a5c57ffc-cea5-421d-afa4-41c17d058318_ROYALCHALLENGERS.jpg",

    "UP Warriorz":
        "https://dko97fmntp7zh.cloudfront.net/ffeac60a-67a5-4d03-9cd4-76d6220ea183_UPWARRIORS.jpg",

    "Gujarat Giants":
        "https://dko97fmntp7zh.cloudfront.net/137d0275-cdf1-41df-9bb1-f13a82596515_GUJARATGIANTS.png",

    "Delhi Capitals":
        "https://dko97fmntp7zh.cloudfront.net/2df67b46-bda9-45ad-b1e9-c4dabc86044f_DELHICAPITALS.jpg",

  },

  CPL: {
    league_logo: "https://example.com/cpl/cpl-logo.png",
  },
};

/**
 * ✅ Final safe logo resolver
 */
export const getTeamLogo = (leagueType, teamName) => {
  const normalizedLeague = LeagueNameMap[leagueType] || leagueType; // fallback

  return LeagueTeamLogos?.[normalizedLeague]?.[teamName] || null;
};
export const getLeagueLogo = (leagueType) => {
  const normalizedLeague = LeagueNameMap[leagueType] || leagueType;
  return LeagueTeamLogos?.[normalizedLeague]?.league_logo || null;
};

export default LeagueTeamLogos;
