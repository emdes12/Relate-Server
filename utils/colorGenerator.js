const colors = [
  "black",
  "darkblue",
  "darkcyan",
  "darkgoldenrod",
  "darkgray",
  "darkgreen",
  "darkgrey",
  "darkkhaki",
  "darkmagenta",
  "darkolivegreen",
  "darkorange",
  "darkorchid",
  "darkred",
  "darksalmon",
  "darkseagreen",
  "darkslateblue",
  "darkslategray",
  "darkslategrey",
  "darkturquoise",
  "darkviolet",
  "midnightblue",
  "navy",
  "indigo",
  "maroon",
  "rebeccapurple",
  "dimgray",
  "dimgrey",
  "saddlebrown",
  "sienna",
  "teal",
  "purple",
  "olive",
  "firebrick",
  "brown",
  "crimson",
  "mediumvioletred",
  "royalblue",
  "slateblue",
  "steelblue",
];

const colorGenerator = () => {
  const randNum = Math.floor(Math.random() * colors.length);

  return colors[randNum];
};

export default colorGenerator;
