import { TYPES as TRAVERSAL_TYPES, processes as traversalProcesses } from './traversal';
import TraversalTypeError from './error/TraversalTypeError';
import cloneData from './utils/cloneData';

const invalidType = type => Object.keys(TRAVERSAL_TYPES).map(key => TRAVERSAL_TYPES[key]).indexOf(type) < 0;
const asArray = items => Array.isArray(items) ? items : [ items ];

export default class Node {

	data = null;
	parent = null;
	_children = [];

  constructor(data, parent = null) {
  	this.data = data;
		this.parent = parent;
  }

	get children() {
		return this._children;
	}

	set children(children) {
		this._children = children;
	}

	getIndex() {
		if (!this.parent) {
			return null;
		}
		return this.parent.children.findIndex(node => node === this);
	}

	getRoute() {
		let indexes = [];
		this.climb(node => indexes.unshift(node.getIndex()));
		return indexes.slice(1);
	}

	getNodeUsingRoute(route = []) {
		try {
			return route.reduce((node, idx) => node.children[idx], this);
		} catch (e) {
			return null;
		}
	}

	climb(op) {
		let node = this
		do {
			op(node)
		}
		while((node = node.parent));
	}

	addChildren(children) {
		children = asArray(children).map(child => new Node(child, this));
		this.children = this.children.concat(children);
	}

	remove() {
		if (!this.parent) {
			return;
		}
		let children = this.parent.children;
		children.splice(this.getIndex(), 1);
		this.parent.children = children;
		this.parent = null;
		return this;
	}

	replace(node) {
		if (this.parent) {
			this.parent.children.splice(this.getIndex(), 1, node);
		}
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
				node.replace(newNode);
				if (!node.parent) {
					mapped = newNode;
				}
			}, TRAVERSAL_TYPES.DFS_POST);
		return mapped;
	}

  clone() {
		this.traverse(node => {
			let clone = new Node(node.data);
			clone.children = node.children.map(c => c.data);
			clone.children.forEach(child => child.parent = clone);
			node.data = clone;
		}, TRAVERSAL_TYPES.DFS_POST);
		let clone = this.data;
		this.traverse(node => node.data = cloneData(node.data.data));
		return clone;
	}


}
