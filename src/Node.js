import { TYPES as TRAVERSAL_TYPES, processes as traversalProcesses } from './traversal';
import TraversalTypeError from './error/TraversalTypeError';
import cloneData from './utils/cloneData';

const invalidType = type => Object.keys(TRAVERSAL_TYPES).map(key => TRAVERSAL_TYPES[key]).indexOf(type) < 0;

export default class Node {

  data = null;
  parent = null;
  _children = [];

  get children() {
    return this._children.slice();
  }

  set children(children) {
    this._children = children;
  }

  constructor(data, parent = null) {
    this.data = data;
    this.parent = parent;
  }

  get index() {
    if (!this.parent) {
      return null;
    }
    return this.parent.children.findIndex(node => node.data === this.data);
  }

  get isRoot() {
    return !this.parent;
  }

  get isLeaf() {
    return !this.children.length;
  }

  get level() {
    return this.climb((n, l) => ++l, -1);
  }

  climb(op, acc) {
    let node = this;
    do {
      acc = op(node, acc);
    }
    while ((node = node.parent));
    return acc;
  }

  addChild(...children) {
    children = children.map(child => {
      if (child instanceof Node) {
        child.parent = this;
        return child;
      }
      return new Node(child, this);
    });
    this.children = this.children.concat(children);
  }

  remove() {
    if (!this.parent) {
      return this;
    }
    const children = this.parent.children;
    children.splice(this.index, 1);
    this.parent.children = children;
    this.parent = null;
    return this;
  }

  traverse(op, TRAVERSAL_TYPE = TRAVERSAL_TYPES.DFS_PRE) {
    if (invalidType(TRAVERSAL_TYPE)) {
      throw new TraversalTypeError();
    }
    traversalProcesses[TRAVERSAL_TYPE](this, op);
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

  filter(term, TRAVERSAL_TYPE) {
    const matches = [];
    this.traverse(node => {
      if (term(node)) {
        matches.push(node);
      }
    }, TRAVERSAL_TYPE);
    return matches;
  }

  reduce(op, acc, TRAVERSAL_TYPE) {
    this.traverse(node => {
      acc = op(acc, node);
    }, TRAVERSAL_TYPE);
    return acc;
  }

  map(op) {
    let mapped;
    this.clone().traverse(node => {
      const newNode = op(node);
      if (!node.parent) {
        mapped = newNode;
        return;
      }
      const children = node.parent.children;
      children.splice(node.index, 1, newNode);
      node.parent.children = children;
    }, TRAVERSAL_TYPES.DFS_POST);
    return mapped;
  }

  clone() {
    return this.reduce((root, node) => {
      const clone = node._clone();
      clone.children = [];
      if (!root) {
        return clone;
      }
      const route = node.climb((node, route) => [node.index].concat(route), []);
      const parent = route.slice(1, -1)
                      .reduce((node, idx) => node.children[idx], root);
      parent.addChild(clone);
      return root;
    });
  }

  _clone() {
    return new Node(cloneData(this.data));
  }

}
