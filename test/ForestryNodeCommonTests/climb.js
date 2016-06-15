import { simpleDataGen } from '../test-utils/dataGen';
import test from 'ava';

export default (ctx, setup) => {
  test(`${ctx} : climb : climbs from node to root passing each node encountered through passed function`, t => {
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
};
