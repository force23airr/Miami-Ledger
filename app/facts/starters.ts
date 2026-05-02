// Starter prompts for the Facts Desk. Mix of Miami-specific and general
// curiosity. Keep these phrased like real desk questions.
export type FactStarter = {
  q: string;
  category: "Miami" | "Florida" | "Markets" | "World" | "Weird";
};

export const STARTERS: FactStarter[] = [
  {
    q: "How many arrests happened in Miami-Dade County last year?",
    category: "Miami",
  },
  {
    q: "What's the median home price in Brickell vs. Coral Gables?",
    category: "Miami",
  },
  {
    q: "How many cargo ships pass through PortMiami in a typical week?",
    category: "Miami",
  },
  {
    q: "What's the busiest hour at Miami International Airport?",
    category: "Miami",
  },
  {
    q: "Which Miami zip code has the most Bugattis registered?",
    category: "Miami",
  },
  {
    q: "How fast is sea level rising in Miami Beach?",
    category: "Miami",
  },
  {
    q: "How many Cubans arrived in South Florida in 2024?",
    category: "Miami",
  },
  {
    q: "How many alligator attacks happen in Florida each year?",
    category: "Florida",
  },
  {
    q: "What's the largest crocodile ever recorded in Florida?",
    category: "Florida",
  },
  {
    q: "How many lightning strikes hit Florida annually?",
    category: "Florida",
  },
  {
    q: "How many billionaires live in Miami-Dade?",
    category: "Markets",
  },
  {
    q: "What's the all-time record price of Bitcoin in USD?",
    category: "Markets",
  },
  {
    q: "How many shipping containers does the U.S. move per day?",
    category: "Markets",
  },
  {
    q: "How long does the average IPO take from filing to listing?",
    category: "Markets",
  },
  {
    q: "How many countries have a higher GDP than Florida's economy?",
    category: "World",
  },
  {
    q: "How many people speak Spanish at home in the U.S.?",
    category: "World",
  },
  {
    q: "What's the deepest hole humans have ever dug?",
    category: "Weird",
  },
  {
    q: "How many satellites are currently orbiting Earth?",
    category: "Weird",
  },
  {
    q: "How heavy is the heaviest blue whale ever weighed?",
    category: "Weird",
  },
  {
    q: "How long would it take to walk to the Moon at 3 mph?",
    category: "Weird",
  },
];
