const Scope = require('./scope');

function Lambda(scope, node) {
  return x => {
    const newScope = Scope.layer(scope, {[node.identifier.name]: x});
    return evaluate(newScope, node.expression);
  };
}

function Application(scope, node) {
  const l = evaluate(scope, node.left);
  const r = evaluate(scope, node.right);
  return l(r);
}

function Identifier(scope, node) {
  return Scope.lookup(scope, node.name);
}

const table = {
  Application,
  Identifier,
  Lambda
};

function evaluate(scope, node) {
  if (table.hasOwnProperty(node.type)) {
    return table[node.type](scope, node);
  } else {
    throw new Error('invalid node type ' + node.type);
  }
}

exports.evaluate = evaluate;
