import { simpleDataGen } from '../test-utils/dataGen';

export default (t, setup) => {
  t.test('climb', t => {
    t.test('climbs from node to root passing each node encountered through passed function', t => {
      t.plan(2);
      const root = setup(simpleDataGen);
      let captured = [];
      const op = node => captured.push(node);
      root.children[0].children[0].climb(op);
      t.deepEqual(
        captured,
        [
          root.children[0].children[0],
          root.children[0],
          root
        ]);

      captured = [];
      root.children[1].climb(op);
      t.deepEqual(
        captured,
        [
          root.children[1],
          root
        ]);
    });
  });
};
