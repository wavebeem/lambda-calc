// TODO: Unsafe to store variable names in objects directly. Switch to maps or
// null-prototype objects.

const empty = ['EmptyScope'];

function layer(parent, obj) {
  return ['Scope', obj, parent];
}

function lookup(scope, name) {
  if (scope[0] === 'EmptyScope') {
    throw new Error('no such variable ' + name);
  } else if (scope[1].hasOwnProperty(name)) {
    return scope[1][name];
  } else {
    return lookup(scope[2], name);
  }
}

exports.empty = empty;
exports.layer = layer;
exports.lookup = lookup;
