const brain = require("brain.js");

const config = {
  iterations: 500,
  log: true,
  logPeriod: 100,
};

const data = [
  { input: "I hate you.", output: "negative" },
  { input: "I kinda do not like this movie.", output: "negative" },
  { input: "This car sucks.", output: "negative" },
  { input: "You are aweful.", output: "negative" },
  { input: "I love you.", output: "positive" },
  { input: "I kinda do like this movie.", output: "positive" },
  { input: "This car is great to drive.", output: "positive" },
  { input: "Hmm, I think I like you.", output: "positive" },
];

const network = new brain.recurrent.LSTM({ hiddenLayers: [10] });
network.train(data, config);

const output = network.run("You are great!");
console.log(`Sentiment: ${output}`);
