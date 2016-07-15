import test from 'ava';
import { simpleDataGen } from '../test-utils/dataGen';

export default (ctx, setup) => {
  ctx = `${ctx} : climb`;
  test(`${ctx} : climbs from node to root passing each node encountered through passed function`, t => {
    const root = setup(simpleDataGen);
    let captured = [];
    const op = node => captured.push(node);
    root.getChildren()[0].getChildren()[0].climb(op);
    t.deepEqual(
      captured,
      [
        root.getChildren()[0].getChildren()[0],
        root.getChildren()[0],
        root
      ]);

    captured = [];
    root.getChildren()[1].climb(op);
    t.deepEqual(
      captured,
      [
        root.getChildren()[1],
        root
      ]);
  });
};
