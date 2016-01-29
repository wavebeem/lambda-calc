'use strict';

const chalk = require('chalk');
const util = require('util');
const parse = require('./parse').parse;
const evaluate = require('./evaluate').evaluate;
const Scope = require('./scope');

const opts = {depth: null, colors: true}

function show(x) {
  console.log(util.inspect(x, opts));
}

// const code = '(:x x) two';

// const code = `
// (:k :const const)
// three
// (:k :x k)
// one
// two
// `;

const code = `
(
  :pair
  :first
  :second

  :unchurch
  :succ
  :+
  :*
  :^

  :three
  :two

  unchurch
    (+
      (* two two)
      (^ three (succ two))
    )
)

(:a :b :f f a b)
(:p p (:x :y x))
(:p p (:x :y y))

(:n n JS-Succ JS-Zero)
(:n :f :x f (n f x))
(:a :b :f :x a f (b f x))
(:a :b :f a (b f))
(:a :b a b)

(:f :x f (f (f x)))
(:f :x f (f x))
`;

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
