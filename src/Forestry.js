import { TYPES as TRAVERSAL_TYPES } from './traversal';
import { default as Node } from './Node';
import cloneData from './utils/cloneData';
export { Node, TRAVERSAL_TYPES };

export default class Forestry extends Node {

	constructor(data, childrenProp, parent = null) {
		super(data, parent);
		this._childrenProp = childrenProp;
	}

	getIndex() {
		if (!this.parent) {
			return null;
		}
		return this.parent.data[this._childrenProp].findIndex(node => node === this.data);
	}

	get children() {
		let children = this.data[this._childrenProp] || [];
		return children.map(child => new Forestry(child, this._childrenProp, this));
	}

	set children(children) {
		this.data[this._childrenProp] = children.map(child => child.data);
	}

	replace(node) {
		if (node instanceof Forestry) {
			node = node.data;
		}
		this.parent.data[this._childrenProp].splice(this.getIndex(), 1, node);
	}

	clone() {
		let clone = this.data;
		this.traverse(node => {
			let clone = cloneData(node.data);
			if (node.parent) {
				node.replace(clone);
			} else {
				node.data = clone;
			}
		}, TRAVERSAL_TYPES.DFS_PRE);
		return new Forestry(clone, this._childrenProp);
	}

}
