const range = (l) => [...Array(l)].map((_, i) => i);

const trafficQuery = (trpId) => {
  return (
    "{" +
    range(10).map((i) => {
      const to = new Date();
      to.setDate(to.getDate() - i * 100);
      const from = new Date();
      from.setDate(from.getDate() - (i + 1) * 100);
      const fromText = from.toISOString();
      const toText = to.toISOString();
      return `
   batch${i}: trafficData(trafficRegistrationPointId: "${trpId}") {
    volume {
      byDay(from: "${fromText}", to: "${toText}") {
        edges {
          node {
            from
            total {
              volume
              coverage {
                percentage
              }
            }
          }
        }
      }
    }
  }
`;
    }) +
    "}"
  );
};

const graphQlQuery = (query) => {
  return fetch("https://www.vegvesen.no/trafikkdata/api/", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
    }),
  }).then((res) => res.json());
};

const parseNodes = (nodes) => {
  console.log(nodes);
  let map = nodes.map(parseNode);
  console.log(map);
  return map;
};

const parseNode = (node) => {
  dayNumber = new Date(node.from).getDay();

  input = range(7).map((i) => 1.0 * (dayNumber == i));
  output = [node.total.volume];
  return { input, output };
};

const trainNet = (trainingData) => {
  console.log(trainingData);
  const config = {
    inputSize: 7,
    hiddenLayers: [],
    activation: "relu",
    learningRate: 0.01,
  };
  const net = new brain.NeuralNetwork(config);

  net.train(trainingData, {
    // https://github.com/BrainJS/brain.js/blob/develop/src/neural-network.js#L18-L34

    // logging
    log: true,
    logPeriod: 1,

    // stop after max iterations
    iterations: 100,

    // train until error threshold
    errorThresh: 0.008,
  });

  console.log(net.run([0, 1, 0, 0, 0, 0, 0]));
  console.log(net.run([0, 0, 1, 0, 0, 0, 0]));
  console.log(net.run([0, 0, 0, 1, 0, 0, 0]));
  console.log(net.run([0, 0, 0, 0, 1, 0, 0]));
  console.log(net.run([0, 0, 0, 0, 0, 1, 0]));
  console.log(net.run([0, 0, 0, 0, 0, 0, 1]));
  console.log(net.run([1, 0, 0, 0, 0, 0, 0]));
};

graphQlQuery(trafficQuery("44656V72812"))
  .then((data) =>
    Object.entries(data.data).flatMap((batch) => batch[1].volume.byDay.edges)
  )
  .then((edges) => edges.map((edge) => edge.node))
  .then((nodes) =>
    parseNodes(nodes.filter((node) => node.total.coverage.percentage >= 98))
  )
  .then(trainNet);
