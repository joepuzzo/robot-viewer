const r3_6_check = [
  [
    Math.cos(angle4) * Math.cos(angle5) * Math.cos(angle6) + -Math.sin(angle4) * Math.sin(angle6),
    Math.cos(angle4) * Math.cos(angle5) * -Math.sin(angle6) + -Math.sin(angle4) * Math.cos(angle6),
    Math.cos(angle4) * -Math.sin(angle5),
  ],
  [
    Math.sin(angle4) * Math.cos(angle5) * Math.cos(angle6) + Math.cos(angle4) * Math.sin(angle6),
    Math.sin(angle4) * Math.cos(angle5) * -Math.sin(angle6) + Math.cos(angle4) * Math.cos(angle6),
    Math.sin(angle4) * -Math.sin(angle5),
  ],
  [Math.sin(angle5) * Math.cos(angle6), Math.sin(angle5) * -Math.sin(angle6), Math.cos(angle5)],
];
