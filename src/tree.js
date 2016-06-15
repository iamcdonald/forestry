import node from './node';
import cloneData from './cloneData';

const tree = {

  init(data, childrenProp, parent = null) {
    node.init.call(this, data, parent);
    this._childrenProp = childrenProp;
    this._children = this.children.map(() => true);
    return this;
  },

  get children() {
    const children = (this.data && this.data[this._childrenProp]) || [];
    return children.map((child, idx) => {
      if (this._children[idx]) {
        return Object.create(tree).init(child, this._childrenProp, this);
      }
      return child;
    });
  },

  set children(children) {
    this._children = children.map(child => {
      return tree.isPrototypeOf(child) && child._childrenProp === this._childrenProp;
    });
    this.data[this._childrenProp] = children.map((child, idx) => this._children[idx] ? child.data : child);
  },

  addChild(...children) {
    children = children.map(child => {
      if (node.isPrototypeOf(child)) {
        child.parent = this;
        return child;
      }
      return Object.create(tree).init(child, this._childrenProp, this);
    });
    this.children = this.children.concat(children);
  },

  _clone() {
    return Object.create(tree).init(cloneData(this.data, this._childrenProp), this._childrenProp);
  }

};

Object.setPrototypeOf(tree, node);

export default tree;
