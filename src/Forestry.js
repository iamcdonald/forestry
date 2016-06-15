import { TYPES as TRAVERSAL_TYPES } from './traversal';
import node from './node';
import tree from './tree';
export { TRAVERSAL_TYPES };

const forestry = (data, childrenProp = null) => {
  if (childrenProp) {
    return Object.create(tree).init(data, childrenProp);
  }
  return Object.create(node).init(data);
};

export default forestry;
