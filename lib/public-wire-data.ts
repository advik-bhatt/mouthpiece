export type LocalSource = {
  id: string;
  name: string;
  url: string;
  category: "city" | "transportation" | "school" | "event" | "permit" | "rutgers";
  sourceType: "official" | "public";
};

export type LocalChange = {
  id: string;
  sourceId: string;
  title: string;
  category: "transportation" | "city-agenda" | "event" | "school" | "construction";
  status: "new" | "updated" | "rejected";
  importance: "urgent" | "resident-relevant" | "routine" | "unsupported";
  whatChanged: string;
  whyItMatters: string;
  whoIsAffected: string[];
  evidence: string[];
  rejectionReason?: string;
};

export type CivicBrief = {
  id: string;
  headline: string;
  area: string;
  category: string;
  confidence: "high" | "medium" | "low";
  status: "active" | "upcoming" | "updated" | "resolved";
  summary: string;
  whyItMatters: string;
  whoIsAffected: string[];
  sources: {
    title: string;
    url: string;
    role: string;
  }[];
  agentTrace: string[];
};

export const localSources: LocalSource[] = [
  {
    id: "nb_city_notices",
    name: "New Brunswick city notices",
    url: "https://www.cityofnewbrunswick.org/",
    category: "city",
    sourceType: "official",
  },
  {
    id: "nj_transit_alerts",
    name: "NJ Transit service alerts",
    url: "https://www.njtransit.com/service-advisory",
    category: "transportation",
    sourceType: "official",
  },
  {
    id: "rutgers_events",
    name: "Rutgers events",
    url: "https://www.rutgers.edu/events",
    category: "rutgers",
    sourceType: "official",
  },
  {
    id: "nb_parking",
    name: "New Brunswick parking authority",
    url: "https://www.njnbpa.org/",
    category: "transportation",
    sourceType: "official",
  },
];

export const seededChanges: LocalChange[] = [
  {
    id: "change_george_street",
    sourceId: "nb_city_notices",
    title: "George Street construction may affect downtown traffic this weekend",
    category: "transportation",
    status: "new",
    importance: "resident-relevant",
    whatChanged:
      "A new construction notice appeared for George Street affecting traffic from Saturday morning through Sunday evening.",
    whyItMatters:
      "George Street is a major downtown route used by residents, Rutgers students, buses, delivery drivers, and local businesses.",
    whoIsAffected: ["Downtown residents", "Rutgers students", "commuters", "bus riders", "local businesses"],
    evidence: ["Official city notice", "Transit advisory check"],
  },
  {
    id: "change_parking_fee",
    sourceId: "nb_city_notices",
    title: "City council agenda includes parking fee discussion",
    category: "city-agenda",
    status: "new",
    importance: "resident-relevant",
    whatChanged:
      "A city council agenda item references proposed discussion of downtown parking fee changes.",
    whyItMatters:
      "Parking fees affect commuters, students, residents, and small businesses near downtown.",
    whoIsAffected: ["drivers", "commuters", "students", "small businesses"],
    evidence: ["City council agenda"],
  },
  {
    id: "routine_minutes",
    sourceId: "nb_city_notices",
    title: "Routine administrative minutes posted",
    category: "city-agenda",
    status: "rejected",
    importance: "routine",
    whatChanged: "Meeting minutes were posted with no clear resident-facing change.",
    whyItMatters: "Low direct resident impact.",
    whoIsAffected: [],
    evidence: ["Posted minutes"],
    rejectionReason: "Routine administrative update with no clear action item or resident impact.",
  },
];

export const publishedBrief: CivicBrief = {
  id: "brief_george_street",
  headline: "George Street construction may affect downtown traffic this weekend",
  area: "New Brunswick, NJ",
  category: "Transportation",
  confidence: "high",
  status: "upcoming",
  summary:
    "A public construction notice indicates that George Street may face traffic disruption from Saturday morning through Sunday evening.",
  whyItMatters:
    "George Street is a major downtown route. Even a short closure can affect residents, Rutgers students, bus riders, deliveries, parking, and weekend travel.",
  whoIsAffected: ["Downtown residents", "Rutgers students", "commuters", "bus riders", "local businesses"],
  sources: [
    {
      title: "City construction notice",
      url: "https://www.cityofnewbrunswick.org/",
      role: "Used to verify location, timing, and construction context.",
    },
    {
      title: "NJ Transit service advisory page",
      url: "https://www.njtransit.com/service-advisory",
      role: "Checked for possible transit impact.",
    },
  ],
  agentTrace: [
    "Checked 4 local public sources.",
    "Detected 3 changes since the previous snapshot.",
    "Rejected 1 routine administrative update.",
    "Verified date and affected street from official source context.",
    "Classified as resident-relevant because it affects transportation access.",
    "Published a cited micro-brief with source links and trace.",
  ],
};
