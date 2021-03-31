interface Rates {
  ui: number;
  s: number;
  p: number;
  i: number;
}

interface Firm {
  name: string;
  rank: number;
  new: Rates;
  old: Rates;
  tetr: {
    old: number;
    new: number;
  };
}

interface StateData {
  name: string;
  tier1: string;
  tier2: string;
  firms: Firm[];
}

interface dimensions {
  width: number;
  height: number;
}

interface margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
