import { TYPES as TRAVERSAL_TYPES } from './traversal';
import { default as Node } from './Node';
import cloneData from './utils/cloneData';
export { Node, TRAVERSAL_TYPES };

export default class Forestry extends Node {

	constructor(data, childrenProp, parent = null) {
		super(data, parent);
		this._childrenProp = childrenProp;
	}

	// get children() {
	// 	if (!this._children.length) {
	// 		let children = this.data[this._childrenProp] || [];
	// 		this._children = children.map(child => new Forestry(child, this._childrenProp, this))
	// 	}
	// 	return this._children;
	// }
	//
	// set children(children) {
	// 	this._children = children;
	// 	this.data[this._childrenProp] = children.map(child => child.data);
	// }

	get children() {
		let children = this.data[this._childrenProp] || [];
		return children.map(child => new Forestry(child, this._childrenProp, this));
	}

	set children(children) {
		this.data[this._childrenProp] = children.map(child => child.data);
	}

	clone() {
		return new Forestry(cloneData(this.data), this._childrenProp);
	}

}
