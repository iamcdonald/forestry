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

	_setChildren(children) {
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
		return this.parent.children.findIndex(node => {
			return node.data == this.data
		});
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
		while((node = node.parent));
		return acc;
	}

	addChild(...children) {
		children = children.map(child => new Node(child, this));
		this._setChildren(this.children.concat(children));
	}

	remove() {
		if (!this.parent) {
			return this;
		}
		let children = this.parent.children;
		children.splice(this.index, 1);
		this.parent._setChildren(children);
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
		this.traverse(node => term(node) && (found = node) && null, TRAVERSAL_TYPE);
		return found;
	}

	filter(term, TRAVERSAL_TYPE) {
		let found = [];
		this.traverse(node => term(node) && found.push(node), TRAVERSAL_TYPE);
		return found;
	}

	reduce(op, acc, TRAVERSAL_TYPE) {
		this.traverse(node => acc = op(acc, node), TRAVERSAL_TYPE);
		return acc;
	}

	map(op) {
		let mapped;
		this.clone().traverse(node => {
				let newNode = op(node);
				if (!node.parent) {
					mapped = newNode;
					return;
				}
				let children = node.parent.children,
					idx = node.index;
				children.splice(idx, 1, newNode);
				node.parent._setChildren(children);
			}, TRAVERSAL_TYPES.DFS_POST);
		return mapped;
	}

	clone() {
		return this.reduce((root, node) => {
			if (!root) {
				let clone = this._clone();
				clone._setChildren([]);
				return clone;
			}
			let route = node.climb((node, route) => [node.index].concat(route), []),
			  parent = route.slice(1, -1)
											.reduce((node, idx) => node.children[idx], root);
			parent.addChild(cloneData(node.data, node._childrenProp));
			parent.children[parent.children.length - 1]._setChildren([]);
			return root;
		});
	}

	_clone() {
		return new Node(cloneData(this.data));
	}

}
