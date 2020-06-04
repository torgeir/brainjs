const div = (m) => (n) => n / m;
const times = (n) => (m) => n * m;
const rand = (n) => n * Math.random();
const range = (l) => [...Array(l)].map((_, i) => i);
const rgb = () => range(3).map((_) => rand(1));

const squareSize = 50;

function Sketch() {
  const self = this;
  return new Promise(
    (resolve) =>
      new p5(function (p) {
        p.setup = function () {
          p.frameRate(1);
          p.noStroke();
          p.createCanvas(200, 50 * squareSize);
          resolve(self);
        };
        self.drawColors = (y, colors) =>
          colors.forEach((color, i) => {
            p.fill(...color.map(times(255)));
            p.rect(squareSize * i, y, squareSize, squareSize);
          });
      })
  );
}

(async () => {
  const sketch = await new Sketch();

  // https://github.com/BrainJS/brain.js/blob/develop/src/neural-network.js#L36-L43
  const net = new brain.NeuralNetwork({
    hiddenLayers: [6, 6],
    calculateDeltas: () => console.log(1),
  });

  const paletteToAllPaletteCombinations = ([c1, c2, c3]) => [
    [c1, c2, c3],
    // [c1, c3, c2],
    [c2, c1, c3],
    // [c2, c3, c1],
    [c3, c1, c2],
    // [c3, c2, c1],
  ];
  const paletteToDatarow = ([[r1, g1, b1], [r2, g2, b2], [r3, g3, b3]]) => ({
    input: { r1, g1, b1 },
    output: { r2, g2, b2, r3, g3, b3 },
  });
  const normalizeRgb = ([r, g, b]) => [r / 255, g / 255, b / 255];

  const normalizedPallets = palettes
    .filter((p) => p.length === 3)
    .map((p) => p.map(normalizeRgb))
    .flatMap(paletteToAllPaletteCombinations);

  const trainingData = normalizedPallets.map(paletteToDatarow);

  net.train(trainingData, {
    // https://github.com/BrainJS/brain.js/blob/develop/src/neural-network.js#L18-L34

    // logging
    log: true,
    logPeriod: 1000,

    // stop after max iterations
    iterations: 5000,

    // train until error threshold
    errorThresh: 0.05,
  });

  const drawPredictions = () => {
    range(20).forEach((_, i) => {
      const [r1, g1, b1] = rgb();

      const { r2, g2, b2, r3, g3, b3 } = net.run({ r1, g1, b1 });

      const colors = [
        [r1, g1, b1],
        [r2, g2, b2],
        [r3, g3, b3],
      ];

      sketch.drawColors((i + 1) * squareSize, colors);
    });
  };

  const drawRandomTrainingData = () => {
    const l = normalizedPallets.length;

    range(20)
      .map(() => Math.round(l * Math.random()))
      .map((x) => normalizedPallets[x])
      .forEach((x, i) => {
        sketch.drawColors((i + 22) * squareSize, x);
      });
    normalizedPallets.slice();
  };

  // global
  draw = () => {
    drawPredictions();
    drawRandomTrainingData();
  };
  draw();
})();
