import { TYPES as TRAVERSAL_TYPES } from './traversal';
import { default as Node } from './Node';
import cloneData from './utils/cloneData';
import * as operations from './node/operations';
export { Node, TRAVERSAL_TYPES };

const isForestry = node => node instanceof Forestry;
const forestryNodeTypesEqual = (a, b) => {
	return isForestry(a) && isForestry(b) && a._childrenProp === b._childrenProp;
}

const updateChildrenWrapState = (node, children) => {
	node._shouldWrapChildState = children.map(child => forestryNodeTypesEqual(node, child))
}

const initChildrenWrapState = node => {
	const children = node.data[node._childrenProp] || [];
	node._shouldWrapChildState = children.map(() => true);
}

export default class Forestry {

	data = null;
  parent = null;

  constructor(data, childrenProp, parent = null) {
		this.data = data;
    this.parent = parent;
    this._childrenProp = childrenProp;
		initChildrenWrapState(this);
  }

  getChildren() {
    const children = this.data[this._childrenProp] || [];
    return children.map((child, idx) =>  this._shouldWrapChildState[idx] ? new Forestry(child, this._childrenProp, this) : child);
  }

  setChildren(children) {
		updateChildrenWrapState(this, children);
    this.data[this._childrenProp] = children.map((child, idx) => this._shouldWrapChildState[idx] ? child.data : child);
  }

	copy() {
		return new Forestry(cloneData(this.data, this._childrenProp), this._childrenProp);
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
		const wrapData = childData => new Forestry(childData, this._childrenProp, this);
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
