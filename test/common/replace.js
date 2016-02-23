import { simpleDataGen } from '../test-utils/dataGen';

export default (t, setup) => {
  t.test('replace', t => {

    t.test('replaces current node with passed data', t => {
      t.plan(1);
      let root = setup(simpleDataGen);
      root.children[0].replace('WHEPTH');
      t.equal(root.children[0], 'WHEPTH');
    });

    t.test('does nothing if called on root', t => {
      t.plan(1);
      let root = setup(simpleDataGen);
      root.replace('rainbowz');
      t.notEqual(root, 'rainbowz');
    });
  });
}
