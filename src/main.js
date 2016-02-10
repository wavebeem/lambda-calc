'use strict';

const chalk = require('chalk');
const util = require('util');
const fs = require('fs');
const parse = require('./parse').parse;
const evaluate = require('./evaluate').evaluate;
const Scope = require('./scope');

const opts = {depth: null, colors: true}
function show(x) {
  console.log(util.inspect(x, opts));
}

const argv = process.argv.slice(2);
if (argv.length !== 1) {
  console.error('please give a filename');
  process.exit(1);
}
const filename = argv[0];
const code = fs.readFileSync(filename, 'utf-8');

const globals = {
  'JS-Zero': 0,
  'JS-Succ': x => x + 1,
};

const result = parse(code);
if (result.status) {
  const ast = result.value;
  const scope = Scope.layer(Scope.empty, globals);
  const value = evaluate(scope, ast);
  show(value);
} else {
  show(result);
}
