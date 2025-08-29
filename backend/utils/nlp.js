const winkNLP = require("wink-nlp");
const model = require("wink-eng-lite-web-model");

const nlp = winkNLP(model);
const its = nlp.its;

function parseCommand(command) {
  const doc = nlp.readDoc(command.toLowerCase());

  let intent = "unknown";
  if (command.includes("add") || command.includes("buy") || command.includes("need")) {
    intent = "add";
  } else if (command.includes("remove") || command.includes("delete")) {
    intent = "remove";
  } else if (command.includes("find") || command.includes("search")) {
    intent = "search";
  }

  let quantity = 1;
  const numbers = doc.tokens().filter(t => t.out(its.type) === "number");
  if (numbers.length > 0) quantity = parseInt(numbers[0].out(its.value));

  let item = "";
  const nouns = doc.tokens().filter(t => t.out(its.pos) === "NOUN");
  if (nouns.length > 0) item = nouns[nouns.length - 1].out();

  return { intent, item, quantity };
}

module.exports = parseCommand;
