// ✅ League name normalization
import cskLogo from "../assets/logos/csk_logo.png";
import dcLogo from "../assets/logos/dc_logo.png";
import iplLogo from "../assets/logos/ipl_logo.png";
import kkrLogo from "../assets/logos/kkr_logo.jpg";
import rcbLogo from "../assets/logos/rcb_logo.jpg";
import rrLogo from "../assets/logos/rr_logo.png";
import srhLogo from "../assets/logos/srh_logo.jpg";
import miLogo from "../assets/logos/mi_logo.jpg";
import pbksLogo from "../assets/logos/pbks_logo.jpg";
import lsgLogo from "../assets/logos/lsg_logo.jpg";
import gtLogo from "../assets/logos/gt_logo.jpg";

import pslLogo from "../assets/logos/psl_logo.png";
import islamLogo from "../assets/logos/islam_logo.jpg";
import karachiLogo from "../assets/logos/karachi_logo.png";
import lahoreLogo from "../assets/logos/lahore_logo.jpg";
import multansultanLogo from "../assets/logos/multansultan_logo.png";
import peshawarLogo from "../assets/logos/peshawar_logo.png";
import quettaLogo from "../assets/logos/quetta_logo.png";
import hyderabadLogo from "../assets/logos/hyderabad_logo.jpg";
import rawalLogo from "../assets/logos/rawal_logo.jpg";

import bplLogo from "../assets/logos/bpl_logo.png";
import sylhetLogo from "../assets/logos/sylhet_logo.jpg";
import rajshahiLogo from "../assets/logos/rajshahi_logo.jpg";
import noakhaliLogo from "../assets/logos/noakhali_logo.jpg";
import chattogramLogo from "../assets/logos/chattogram_logo.jpg";
import dhakaLogo from "../assets/logos/dhaka_logo.jpg";
import rangurLogo from "../assets/logos/rangur_logo.jpg";

const LeagueNameMap = {
  "BPL 2025-2026": "BPL",
  "Womens Premier League 2026": "WPL",
  "BIG BASH LEAGUE 2025-2026": "BBL",
  "SA T20 2026": "SAT20",
  "Men's Super Smash 2025-2026": "SUPERSMASH",
  "Indian Premier League 2026": "IPL",
  "Pakistan Super League 2026": "PSL",
};

// ✅ Team logos
const LeagueTeamLogos = {
  IPL: {
    league_logo: iplLogo,
    "Royal Challengers Bengaluru": rcbLogo,
    "Sunrisers Hyderabad": srhLogo,
    "Mumbai Indians": miLogo,
    "Kolkata Knight Riders": kkrLogo,
    "Rajasthan Royals": rrLogo,
    "Chennai Super Kings": cskLogo,
    "Punjab Kings": pbksLogo,
    "Gujarat Titans": gtLogo,
    "Lucknow Super Giants": lsgLogo,
    "Delhi Capitals": dcLogo,
  },

  PSL: {
    league_logo: pslLogo,
    "Islamabad United": islamLogo,
    "Karachi Kings": karachiLogo,
    "Lahore Qalandars": lahoreLogo,
    "Multan Sultans": multansultanLogo,
    "Peshawar Zalmi": peshawarLogo,
    "Quetta Gladiators": quettaLogo,
    "Hyderabad Kingsmen": hyderabadLogo,
    Rawalpindiz: rawalLogo,
  },

  BPL: {
    league_logo: bplLogo,
    "Sylhet Titans": sylhetLogo,
    "Rajshahi Warriors": rajshahiLogo,
    "Noakhali Express": noakhaliLogo,
    "Chattogram Royals": chattogramLogo,
    "Dhaka Capitals": dhakaLogo,
    "Rangpur Riders": rangurLogo,
  },

  BBL: {
    league_logo:
      "https://dko97fmntp7zh.cloudfront.net/8dddc4ac-0bea-4d02-9cea-22034fd5f25e_bbl.png",

    "Perth Scorchers":
      "https://dko97fmntp7zh.cloudfront.net/c364454b-a01c-41e0-a88b-81cea92b064a_PRS.webp",

    "Sydney Sixers":
      "https://dko97fmntp7zh.cloudfront.net/02414fd1-d1ca-4d75-8d1c-44b69f693b0c_SYS.webp",

    "Melbourne Renegades":
      "https://dko97fmntp7zh.cloudfront.net/fc13d5f2-d611-44cf-9c37-6802e74cfe0e_MLR.webp",

    "Brisbane Heat":
      "https://dko97fmntp7zh.cloudfront.net/3bad56d5-ebb8-4117-82b5-08d2ca4a83ab_BRISBANE.webp",

    "Hobart Hurricanes":
      "https://dko97fmntp7zh.cloudfront.net/57b6b2d4-c243-418d-b313-2e6f0e3679be_HBH.webp",

    "Sydney Thunder":
      "https://dko97fmntp7zh.cloudfront.net/72fb8d55-5dc0-4182-9db1-08272dcb66e2_STHUNDER.webp",

    "Adelaide Strikers":
      "https://dko97fmntp7zh.cloudfront.net/9dd7dfe2-ce8d-49d5-8117-f9d055a331a5_ADS.webp",

    "Melbourne Stars":
      "https://dko97fmntp7zh.cloudfront.net/f8ead18f-0746-42ec-b9da-b2d5068e9bfb_MLS.webp",
  },
  SAT20: {
    league_logo:
      "https://dko97fmntp7zh.cloudfront.net/ce3d7145-48c7-42e2-936d-e96a4eab2047_sat20.webp",
    "MI Cape Town":
      "https://dko97fmntp7zh.cloudfront.net/60707a20-d904-48a4-bddd-669a7128b69a_MICAPE.webp",

    "Durban's Super Giants":
      "https://dko97fmntp7zh.cloudfront.net/475cd1c1-f05a-472a-b57e-dd377c982db3_DURBAN.webp",

    "Pretoria Capitals":
      "https://dko97fmntp7zh.cloudfront.net/2ab20dae-493f-4db3-a7c0-573acb5e7884_PRETORIA.webp",

    "Joburg Super Kings":
      "https://dko97fmntp7zh.cloudfront.net/11a2c80e-374b-4094-b61b-025442ce0604_JOBURG.webp",

    "Paarl Royals":
      "https://dko97fmntp7zh.cloudfront.net/37ef9c56-cce4-4784-8fca-108006a29149_PAARL.webp",

    "Sunrisers Eastern Cape":
      "https://dko97fmntp7zh.cloudfront.net/e2ebcb19-239e-4c8f-86f4-425d369c017f_SUNRISE.webp",
  },

  WPL: {
    league_logo:
      "https://dko97fmntp7zh.cloudfront.net/23e2ad8d-ed33-4717-9f3f-7f5e864a629b_Gemini_Generated_Image_p2pjuvp2pjuvp2pj.png",
    "Mumbai Indians Women":
      "https://dko97fmntp7zh.cloudfront.net/ba2b2c10-9f90-49b9-9ed1-207d90d1a515_MI.webp",

    "Royal Challengers Bengaluru Women":
      "https://dko97fmntp7zh.cloudfront.net/8d803a74-8119-44f2-bf1e-b34147feddab_RCB.webp",

    "UP Warriorz Women":
      "https://dko97fmntp7zh.cloudfront.net/6afacec5-4477-44ae-941f-81b8706ba3a9_UP.webp",

    "Gujarat Giants Women":
      "https://dko97fmntp7zh.cloudfront.net/c7c6a5a9-3b6c-46fa-817d-06bf4e1f1ce5_GUJRAT.webp",

    "Delhi Capitals Women":
      "https://dko97fmntp7zh.cloudfront.net/391aaf66-a1f1-4090-8bb4-88dc0747d1a6_DC.webp",
  },

  SUPERSMASH: {
    league_logo:
      "https://dko97fmntp7zh.cloudfront.net/b077557c-3b30-4655-a403-2c5b4a11ba6a_Super-smash-kfc-logo.png",

    "Auckland Aces":
      "https://dko97fmntp7zh.cloudfront.net/70931958-2643-46fd-9d44-0cfd502b80a5_AUCK.webp",
    "Canterbury Kings":
      "https://dko97fmntp7zh.cloudfront.net/0af5884e-ee4f-40d2-ba88-7b0dad63eb14_CANT.webp",
    "Central Stags":
      "https://dko97fmntp7zh.cloudfront.net/8e741b21-0bab-4429-890f-68020b4418a6_CS.webp",
    "Northern Brave":
      "https://dko97fmntp7zh.cloudfront.net/abfd7ff6-a9ae-4690-93f7-0d9567876c94_NB.webp",
    "Otago Volts":
      "https://dko97fmntp7zh.cloudfront.net/519b89ab-40a3-4801-93e6-e07730512066_OTG.webp",
    "Wellington Firebirds":
      "https://dko97fmntp7zh.cloudfront.net/80ec7ce7-639b-4d20-b58f-520a8bcaf569_57.webp",
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
