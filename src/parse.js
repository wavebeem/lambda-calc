'use strict';

const P = require('parsimmon');

const _ = P.regex(/\s*/);
const __ = P.regex(/\s+/);

const Paren =
  P.lazy(() =>
    P.string('(')
      .skip(_)
      .then(Expr)
      .skip(_)
      .skip(P.string(')'))
  );

const Atom = P.lazy(() => P.alt(Paren, Id, Fn));

function sepBy1(p, sep) {
  return p.chain(first =>
    sep.then(p).atLeast(1).map(rest =>
      [first].concat(rest)
    )
  );
}

const Apply =
  P.lazy(() =>
    sepBy1(Atom, __).map(atoms =>
      atoms.reduce((left, right) =>
        ({type: 'Application', left, right})
      )
    )
  );

const Expr = P.lazy(() => Apply.or(Atom));

const Id =
  P.regex(/[a-zA-Z_*+\/^<>?&-]+/)
  .desc('identifier')
  .map(name => ({type: 'Identifier', name}));

const Fn =
  P.seqMap(
    P.string(':')
      .then(Id)
      .skip(__)
      .desc('parameter'),
    Expr,
    (identifier, expression) =>
      ({type: 'Lambda', identifier, expression})
  ).desc('function');

const Program =
  _.then(Expr).skip(_);

function parse(text) {
  return Program.parse(text);
}

exports.parse = parse;
