import { TYPES as TRAVERSAL_TYPES, processes as traversalProcesses } from './traversal';
import TraversalTypeError from './error/TraversalTypeError';
import cloneData from './utils/cloneData';

const invalidType = type => Object.keys(TRAVERSAL_TYPES).map(key => TRAVERSAL_TYPES[key]).indexOf(type) < 0;
const asArray = items => Array.isArray(items) ? items : [ items ];

export default class Node {

	data = null;
	parent = null;
	_children = [];

	get children() {
		return this._children;
	}

	set children(children) {
		this._children = children;
	}

  constructor(data, parent = null) {
  	this.data = data;
		this.parent = parent;
  }

	getIndex() {
		if (!this.parent) {
			return null;
		}
		return this.parent.children.findIndex(node => {
			return node.data == this.data
		});
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
					idx = node.getIndex();
				children.splice(idx, 1, newNode);
				node.parent.children = children;
			}, TRAVERSAL_TYPES.DFS_POST);
		return mapped;
	}

	clone() {
		return this.reduce((root, node) => {
			if (!root) {
				return node._clone();
			}
			let route = node.getRoute().slice(0, -1),
				parent = root.getNodeUsingRoute(route);
			parent.addChildren(cloneData(node.data));
			return root;
		});
	}

}
