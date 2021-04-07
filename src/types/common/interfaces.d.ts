interface Rates {
  ui: number;
  s: number;
  p: number;
  i: number;
}

interface Firm {
  name: string;
  new: Rates;
  old: Rates;
  tetr: {
    old: number;
    new: number;
  };
}

interface StateData {
  name: string;
  fips: number;
  abbr: string;
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
