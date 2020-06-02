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
          p.createCanvas(200, 20 * squareSize);
          resolve(self);
        };
        self.drawColors = function (y, colors) {
          colors.forEach((color, i) => {
            p.fill(...color.map(times(255)));
            p.rect(squareSize * i, y, squareSize, squareSize);
          });
        };
      })
  );
}

(async () => {
  // oppgaver:
  // - bytt så rød og grønn er preferred farger, tren
  // - utvid med én ekstra farge du liker

  const sketch = await new Sketch();

  const colors = () => [rgb(), rgb()];

  // https://github.com/BrainJS/brain.js/blob/develop/src/neural-network.js#L36-L43
  const net = new brain.NeuralNetwork({
    hiddenLayers: [6, 6],
  });

  const trainingData = range(1000)
    .map((_) => colors())
    .map((colors) => ({
      input: colors.flat(),
      output: [score(...colors)],
    }));

  net.train(trainingData, {
    // https://github.com/BrainJS/brain.js/blob/develop/src/neural-network.js#L18-L34

    // logging
    log: true,
    logPeriod: 1000,

    // stop after max iterations
    iterations: 10000,

    // train until error threshold
    errorThresh: 0.008,
  });

  range(1000)
    .map((_) => colors())
    .map((colors) => [net.run(colors.flat())[0], colors])
    .sort((a, b) => b[0] - a[0])
    .slice(0, 20)
    .forEach(([result, colors], i) => {
      console.log("prediction", result);
      sketch.drawColors((i + 1) * squareSize, colors);
    });
})();

const score = ([r, g, b], [rr, gg, bb]) =>
  Math.max(r, g, b) == b && Math.max(rr, gg, bb) == rr ? 1 : 0;
