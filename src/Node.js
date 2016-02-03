import * as traversal from './traversal';

const asArray = items => Array.isArray(items) ? items : [ items ];

const traversalTypesArr = Object.keys(traversal.processes);

const isNode = node => node instanceof Node;

const cloneData = (data, cloneFunc) => {
	if (typeof data.clone === 'function') {
		return data.clone();
	}
	if (cloneFunc) {
		return cloneFunc(data);
	}
	return data;
}

export default class Node {

  parent = null;
  children = [];

  constructor(data) {
  	this.data = data;
  }

  index() {
    if (!this.parent) {
      return null;
    }
    let index = this.parent.children.findIndex(c => c === this);
    return index >= 0 ? index : null;
  }

  level() {
    let level = -1;
    this.climb(() => ++level);
    return level;
  }

  isRoot() {
    return !this.parent;
  }

  isLeaf() {
    return this.children.length === 0;
  }

  addChild(children) {
    children = asArray(children).map(child => {
        if (!isNode(child)) {
          child = new Node(child);
        }
        child.parent = this;
        return child;
      });
    this.children = this.children.concat(children);
    return this;
  }

  remove() {
    if (this.isRoot()) {
      return;
    }
    this.parent.children.splice(this.index(), 1);
    this.parent = null;
    return this;
  }

  getRoot() {
    let node = this;
    while (node.parent) {
      node = node.parent;
    }
    return node;
  }

  climb(op) {
    let node = this;
    do {
      op(node);
    } while ((node = node.parent));
  }

  traverse(op, TRAVERSAL_TYPE) {
    TRAVERSAL_TYPE = TRAVERSAL_TYPE ? TRAVERSAL_TYPE : traversal.TYPES.DFS_PRE;
  	if (traversalTypesArr.indexOf(TRAVERSAL_TYPE) < 0) {
  		throw new Error(`Traversal type is not valid. It must be one of ${traversalTypesArr.join(', ')}.`);
  	}
  	traversal.processes[TRAVERSAL_TYPE](this, op);
    return this;
  }

  find(term, TRAVERSAL_TYPE) {
    let found = null;
    this.traverse(node => {
      if (term(node)) {
        found = node;
        return null;
      }
    }, TRAVERSAL_TYPE);
    return found;
  }

  all(term, TRAVERSAL_TYPE) {
    let found = [];
    this.traverse(node => {
      if (term(node)) {
        found.push(node);
      }
    }, TRAVERSAL_TYPE);
    return found;
  }

  filter(term) {
    return this.clone().traverse(node => {
      if (!term(node)) {
        node.remove();
        node.children.length = 0;
      }
    }, traversal.TYPES.DFS_POST);
  }

  reduce(func, acc, TRAVERSAL_TYPE) {
    this.traverse(node => acc = func(acc, node), TRAVERSAL_TYPE);
    return acc;
  }


  map(func) {
    let mapped = this.traverse(function (node) {
        node._temp = func(node);
        var isNodeObj = isNode(node._temp);
        if (!isNodeObj) {
          if (node._temp !== Object(node._temp)) {
            node._temp = {
              data: node._temp
            };
          }
          node._temp.children = [];
        }
        for (var i = 0, l = node.children.length; i < l; i++) {
          if (isNodeObj) {
            node._temp.addChild(node.children[i]._temp);
          } else {
            node._temp.children.push(node.children[i]._temp);
          }
          delete node.children[i]._temp;
        }
      }, traversal.TYPES.DFS_POST)._temp;
    delete this._temp;
    return mapped;
  }

  clone(dataCloneFunc) {
    return this.map(node => new Node(cloneData(node.data, dataCloneFunc)));
  }
}
