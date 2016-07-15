import { TYPES as TRAVERSAL_TYPES, processes as traversalProcesses } from './traversal';
import TraversalTypeError from './error/TraversalTypeError';
import cloneData from './utils/cloneData';
import * as operations from './node/operations';

const cloneNode = node => new Node(cloneData(node.data));

export default class Node {

  data = null;
  parent = null;
  children = [];

	constructor(data, parent = null) {
		this.data = data;
		this.parent = parent;
	}

	getChildren() {
		return this.children;
	}

	setChildren(children) {
		this.children = children;
	}

	copy() {
		return new Node(cloneData(this.data));
	}

  getIndex() {
		return operations.getIndex(this);
  }

  isRoot() {
    return operations.isRoot(this);
  }

  isLeaf() {
		return operations.isLeaf(this);
  }

  getLevel() {
		return operations.getLevel(this);
  }

  climb(op, acc) {
		return operations.climb(this, op, acc);
  }

  addChild(... children) {
		const wrapData = childData => new Node(childData, this);
		operations.addChild(this, children, wrapData);
  }

  remove() {
		return operations.remove(this);
  }

  traverse(op, TRAVERSAL_TYPE) {
		operations.traverse(this, op, TRAVERSAL_TYPE)
  }

  find(term, TRAVERSAL_TYPE) {
		return operations.find(this, term, TRAVERSAL_TYPE);
  }

  filter(term, TRAVERSAL_TYPE) {
		return operations.filter(this, term, TRAVERSAL_TYPE);
  }

  reduce(op, acc, TRAVERSAL_TYPE) {
		return operations.reduce(this, op, acc, TRAVERSAL_TYPE);
  }

  map(op) {
		return operations.map(this.clone(), op);
  }


  clone() {
		return operations.clone(this);
  }

}
