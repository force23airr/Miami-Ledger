export type BlueprintStatus =
  | "Concept"
  | "Dream"
  | "Proposed"
  | "Under study"
  | "Shelved";

export type Blueprint = {
  slug: string;
  title: string;
  tagline: string;
  category:
    | "Transit"
    | "Towers"
    | "Climate"
    | "Public Space"
    | "Mixed-use"
    | "Infrastructure";
  status: BlueprintStatus;
  yearTarget: string; // e.g. "2030", "2045"
  location: string; // e.g. "Brickell", "Wynwood", "Biscayne Bay"
  architect: string; // attribution or "Speculative"
  // Tailwind gradient classes for the hero when no real image exists.
  cover: string;
  // Optional: drop a real rendering at /public/blueprints/<slug>.jpg
  // and the page will auto-detect and use it.
  imagePath?: string;
  // Long-form sections for the detail page.
  pitch: string;
  whyNow: string;
  whereItFits: string;
  specs: string[];
};

export const BLUEPRINTS: Blueprint[] = [
  {
    slug: "brickell-monorail-loop",
    title: "The Brickell Monorail Loop",
    tagline: "An elevated 8.4-mile ring that finally makes Brickell walkable.",
    category: "Transit",
    status: "Concept",
    yearTarget: "2034",
    location: "Brickell · Downtown · Edgewater",
    architect: "Speculative · Ledger Desk",
    cover: "from-amber-500/30 via-orange-700/20 to-zinc-950",
    pitch:
      "A driverless elevated monorail circling Brickell, Downtown, and Edgewater on a single track every 90 seconds. Stations every quarter mile, every station within a five-minute walk of the next. Zero cars added to the surface grid; existing Metromover folded into the loop as a feeder.",
    whyNow:
      "Brickell's job density now exceeds Manhattan's per square mile in some blocks. The Metromover hits capacity by 8:30am most weekdays and the surface streets are at war with sidewalks. Capital is sitting in the EB-5 and CRA buckets waiting for a fundable transit project. The Loop is the smallest viable fix that meaningfully changes the experience of being downtown.",
    whereItFits:
      "Anchors at Brickell City Centre, Mary Brickell Village, the Adrienne Arsht Center, the AAA, Bayfront Park, Wynwood-Edgewater border, and the Miami River walk. Connects to the existing Metromover at three points and to Brightline at MiamiCentral.",
    specs: [
      "Length: ~8.4 miles, single bidirectional track with passing loops",
      "Stations: 19, all step-free, all canopied",
      "Cars: 4-car driverless trains, 280 passengers each",
      "Headway: 90 seconds peak, 4 minutes off-peak",
      "Power: third-rail, solar canopy at each station",
      "Construction: $2.1B–$2.7B est. · 6-year build",
      "Fare: integrated with Metromover (free) or $2.50 standalone",
    ],
  },
  {
    slug: "biscayne-floating-park",
    title: "Biscayne Floating Park",
    tagline:
      "A 14-acre tidal park that rises with the bay and absorbs storm surge.",
    category: "Climate",
    status: "Dream",
    yearTarget: "2040",
    location: "Biscayne Bay · off Bayfront",
    architect: "Speculative · Ledger Desk",
    cover: "from-cyan-500/25 via-emerald-700/20 to-zinc-950",
    pitch:
      "A 14-acre buoyant park anchored offshore from Bayfront Park. The structure floats on a lattice of recycled concrete pontoons that rise with the tide and absorb storm surge before it hits the seawall. Mangrove nurseries on the windward side; an open-air amphitheater, sport courts, and a cold-water spring at the center.",
    whyNow:
      "Sea level off Miami Beach has climbed about a foot since 1994. The City of Miami's own resilience plan models another 12-30 inches by 2060. The seawall is the wrong tool for a soft coastline. A floating system buys time, hosts ecology, and gives the city a piece of public realm that doesn't compete with developable land.",
    whereItFits:
      "Connected to Bayfront Park by a 320-ft pedestrian bridge that detaches in named-storm conditions. Walkable from the AAA, the Pérez Art Museum, and the Frost Science Museum. Programmed nights and weekends; quiet weekday mornings.",
    specs: [
      "Footprint: 14 acres at high tide, 19 acres at low tide",
      "Structure: 1,200 modular concrete pontoons, recycled aggregate",
      "Storm rating: Category 4 surge tolerance (12-ft rise)",
      "Ecology: 2.4 acres of mangrove nursery, native-only planting",
      "Amenities: amphitheater (1,800 seats), 4 paddle/sport courts, cold spring",
      "Estimated cost: $410M · 5-year build",
    ],
  },
  {
    slug: "mia-brickell-maglev",
    title: "MIA-Brickell Maglev",
    tagline: "Airport to Brickell in 8 minutes, every 4 minutes.",
    category: "Transit",
    status: "Concept",
    yearTarget: "2038",
    location: "MIA · Doral · Brickell",
    architect: "Speculative · Ledger Desk",
    cover: "from-violet-600/25 via-indigo-700/20 to-zinc-950",
    pitch:
      "A 14-mile maglev shuttle running underground for the urban segment and elevated through Doral. MIA to Brickell in 8 minutes door-to-door. One transfer to the Tri-Rail / Brightline system at MiamiCentral. Cuts MIA-Brickell from a 35-minute Uber to a coffee.",
    whyNow:
      "MIA is the busiest international gateway in the Americas after JFK and the airport-to-downtown experience is its weakest link. Tourism, business travel, and conference traffic all suffer the same friction. Maglev is operational in Shanghai (since 2003) and Japan (Chuo Shinkansen tested at 374 mph). Cost has fallen as Chinese export financing makes the technology bid-able.",
    whereItFits:
      "Underground stations at MIA, Doral City Place, Civic Center, MiamiCentral, Brickell. Open trench through Doral with a noise-shielded cover. Direct interchange with Brightline to Orlando.",
    specs: [
      "Length: 14.2 miles · 5 stations",
      "Top speed: 220 mph (urban operating speed: 140 mph)",
      "Headway: 4 minutes",
      "Capacity: 1,200 passengers per train",
      "Estimated cost: $4.8B–$6.3B · 9-year build",
      "Operator: public-private (FDOT + concessionaire)",
    ],
  },
  {
    slug: "wynwood-subway",
    title: "The Wynwood Subway",
    tagline:
      "A two-mile subway connecting Brickell, Edgewater, and Wynwood.",
    category: "Transit",
    status: "Proposed",
    yearTarget: "2032",
    location: "Brickell · Edgewater · Wynwood",
    architect: "Speculative · Ledger Desk",
    cover: "from-fuchsia-500/25 via-rose-700/20 to-zinc-950",
    pitch:
      "A two-mile underground line with three stations linking the Brickell employment core to the Wynwood arts district by way of Edgewater. Replaces the daily car traffic that clogs Biscayne Boulevard and converts the surface street to a slower, greener, pedestrian-first corridor.",
    whyNow:
      "Wynwood gets 2M+ annual visitors and has zero rapid transit. The Walk Score-to-transit gap is the largest in any major American arts district. Tunnel boring costs in dry-soil cities have come down ~28% since 2020. Three stations is the smallest viable network that still moves the needle.",
    whereItFits:
      "Stations at Brickell City Centre (Metromover transfer), Edgewater Bayview, and NW 2nd Ave at 23rd St (Wynwood core). All within 100m of major bus routes.",
    specs: [
      "Length: 2.1 miles · 3 stations",
      "Tunnel: twin bores, 18-ft diameter",
      "Trains: 4-car, 600 passengers, automatic operation",
      "Headway: 3 minutes peak",
      "Estimated cost: $1.2B–$1.6B · 5-year build",
    ],
  },
  {
    slug: "miami-beach-seawall-walk",
    title: "Miami Beach Seawall Walk",
    tagline:
      "A 9-mile resilient promenade that doubles as the city's flood defense.",
    category: "Climate",
    status: "Under study",
    yearTarget: "2036",
    location: "Miami Beach · Government Cut to 87th St",
    architect: "Speculative · Ledger Desk",
    cover: "from-sky-500/25 via-blue-700/20 to-zinc-950",
    pitch:
      "A 9-mile elevated promenade behind the dunes, raised 14 feet above mean high water. Promenade by day, deployable barrier by emergency. Lined with shaded benches, food kiosks, outdoor showers, and four public restrooms per mile. Replaces the current seawall, which is failing.",
    whyNow:
      "Miami Beach has spent $500M+ on flood pumps that are already overwhelmed during king tides. The existing seawall is a patchwork of fifteen private and public sections built between 1932 and 2018. Any storm event past Cat 2 overtops it. A unified, elevated, public-realm-first solution costs roughly the same and yields a defining piece of city infrastructure.",
    whereItFits:
      "Continuous from Government Cut to 87th Street. Connects to the boardwalk, Lummus Park, and 21 cross streets. Bike lane on the west side, pedestrian on the east, dunes-buffer in between.",
    specs: [
      "Length: 9.0 miles continuous",
      "Elevation: +14 ft MHW · Cat 4 surge rated",
      "Width: 24 ft (12 ft pedestrian, 8 ft cycle, 4 ft furniture zone)",
      "Materials: bone-white precast concrete, basalt aggregate",
      "Amenities: 36 restrooms, 18 kiosks, 14 outdoor showers",
      "Estimated cost: $620M · 6-year build",
    ],
  },
  {
    slug: "305-vertical-farms",
    title: "305 Vertical Farms Network",
    tagline:
      "Forty rooftop farms that grow 18% of Miami's leafy greens locally.",
    category: "Infrastructure",
    status: "Concept",
    yearTarget: "2030",
    location: "City-wide",
    architect: "Speculative · Ledger Desk",
    cover: "from-lime-500/25 via-emerald-700/20 to-zinc-950",
    pitch:
      "A network of 40 rooftop greenhouses on city-owned buildings — schools, libraries, recreation centers, transit yards. Hydroponic, solar-shaded, run by a public-benefit corporation. Produce sold at cost to corner stores and farmer's markets in food deserts.",
    whyNow:
      "Miami imports 91% of its fresh produce by truck or air. The 95-mile freeway corridor accounts for ~40% of carbon emissions in food supply. Rooftop space on city facilities sits unused. LED + hydroponic costs have dropped 60% since 2018.",
    whereItFits:
      "Sites already identified across 7 city districts: Liberty City, Overtown, Little Haiti, Allapattah, Coconut Grove, West Flagler, Edgewater.",
    specs: [
      "Sites: 40 rooftops on city-owned buildings",
      "Output: ~6.2M lbs leafy greens / yr (~18% of metro consumption)",
      "Power: 100% rooftop solar + battery",
      "Workforce: 220 jobs, union, year-round",
      "Estimated cost: $84M capex · $11M/yr opex · break-even year 6",
    ],
  },
  {
    slug: "skybridge-system",
    title: "The Brickell Skybridge System",
    tagline:
      "An aerial walkway network connecting the towers of Brickell — air-conditioned, 24/7.",
    category: "Infrastructure",
    status: "Concept",
    yearTarget: "2031",
    location: "Brickell · 8th to 14th Streets",
    architect: "Speculative · Ledger Desk",
    cover: "from-amber-400/25 via-yellow-700/20 to-zinc-950",
    pitch:
      "A network of glass-clad aerial walkways at the third- and fourth-floor levels of major Brickell towers, linking residential buildings, offices, hotels, and the Metromover. Air-conditioned, 24/7, public, free. A second pedestrian level above the cars.",
    whyNow:
      "Brickell summers are increasingly unwalkable: heat index above 105°F for 70+ days a year and rising. Surface streets are dominated by cars. Tower owners already have skywalks among their own properties — formalizing a public network is a coordination problem, not a construction problem. Hong Kong, Calgary, and Minneapolis all run versions of this.",
    whereItFits:
      "Initial spine: Brickell City Centre to the Four Seasons to Mary Brickell Village to Metromover Brickell Station. Phase 2 extends north toward the river.",
    specs: [
      "Length (phase 1): 1.4 miles, 11 connections",
      "Width: 14 ft public, 22 ft at junctions",
      "Climate: full HVAC, glass curtain wall",
      "Hours: 24/7 access · public easement",
      "Estimated cost: $180M · 3-year build",
    ],
  },
  {
    slug: "liberty-city-innovation",
    title: "Liberty City Innovation District",
    tagline:
      "A 90-acre tech corridor anchored by community ownership.",
    category: "Mixed-use",
    status: "Dream",
    yearTarget: "2035",
    location: "Liberty City · NW 22nd Ave corridor",
    architect: "Speculative · Ledger Desk",
    cover: "from-rose-500/25 via-red-700/20 to-zinc-950",
    pitch:
      "A 90-acre district anchored by a publicly-owned tech campus, a community land trust on 60% of the residential parcels, and a guaranteed 30% set-aside for Liberty City-based businesses in the commercial space. Designed by Miami's only Black-led urban design studio in collaboration with longtime residents.",
    whyNow:
      "Liberty City has been cycled through redevelopment plans since the 1960s, every one of which extracted more wealth than it created. A community-owned model — proven in Atlanta's Westside Future Fund and DC's CityFirst — produces durable economic gains where conventional zoning incentives have not. Capital is now available through New Markets Tax Credits + opportunity zone wind-down structures.",
    whereItFits:
      "NW 22nd Ave from 54th to 79th Streets. Existing assets: Miami-Dade College North campus, Liberty City Charter School, Hadley Park, the original Pork & Beans housing footprint.",
    specs: [
      "Land: 90 acres mixed (residential, commercial, civic)",
      "Housing: 2,400 units · 60% community land trust",
      "Commercial: 1.4M sf · 30% Liberty City businesses",
      "Anchor: 220K sf publicly-owned tech campus",
      "Governance: community board with veto on land sales",
      "Estimated total investment: $1.1B over 10 years",
    ],
  },
];

export function getBlueprint(slug: string): Blueprint | undefined {
  return BLUEPRINTS.find((b) => b.slug === slug);
}
