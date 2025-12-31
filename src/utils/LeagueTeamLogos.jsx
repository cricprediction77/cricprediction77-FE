// ✅ League name normalization
const LeagueNameMap = {
  "Bangladesh Premier League 2025-2026": "BPL",
  "Indian Premier League": "IPL",
  "Caribbean Premier League": "CPL",
  "Women Premier League 2026": "WPL",
  "Mens Big Bash League 2025-2026": "BBL",
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

  IPL: {
    league_logo: "https://example.com/ipl/ipl-logo.png",
  },

  WPL: {
    league_logo: "https://example.com/wpl/wpl-logo.png",
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
