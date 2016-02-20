import { simpleDataGen } from '../test-utils/dataGen';

export default (t, setup) => {
  t.test('getNodeUsingRoute', t => {

    t.test('returns the node at a given root from the node called on', t => {
      t.plan(2);
      let root = setup(simpleDataGen);
      t.deepEqual(root.getNodeUsingRoute([0, 1]), root.children[0].children[1]);
      t.deepEqual(root.getNodeUsingRoute([1]), root.children[1]);
    });

    t.test('returns null if the route is invalid', t => {
      t.plan(1);
      let root = setup(simpleDataGen);
      t.equal(root.getNodeUsingRoute([1, 0, 3]), null);
    });
  });
}
