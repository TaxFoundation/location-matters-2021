interface Rates {
  ui: number;
  s: number;
  p: number;
  i: number;
}

interface Industry {
  name: string;
  rank: number;
  new: Rates;
  old: Rates;
}
