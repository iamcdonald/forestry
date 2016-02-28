import { TYPES as TRAVERSAL_TYPES } from './traversal';
import { default as Node } from './Node';
import cloneData from './utils/cloneData';
export { Node, TRAVERSAL_TYPES };

export default class Forestry extends Node {

	constructor(data, childrenProp, parent = null) {
		super(data, parent);
		this._childrenProp = childrenProp;
		this._children = Array.apply(null, { length: this.children.length}).map(() => true);
	}

	get children() {
		let children = this.data[this._childrenProp] || [];
		return children.map((child, idx) => this._children[idx] ? new Forestry(child, this._childrenProp, this) : child);
	}

	_setChildren(children) {
		this._children = children.map(child => child instanceof Forestry);
		this.data[this._childrenProp] = children.map((child, idx) => this._children[idx] ? child.data : child);
	}

	addChild(...children) {
		children = children.map(child => new Forestry(child, this._childrenProp, this));
		this._setChildren(this.children.concat(children));
	}

	// clone() {
	// 	return new Forestry(cloneData(this.data), this._childrenProp);
	// }

	_clone() {
		return new Forestry(cloneData(this.data, this._childrenProp), this._childrenProp);
	}

}
