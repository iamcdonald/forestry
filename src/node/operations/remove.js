export default (node) => {
	if (!node.parent) {
		return node;
	}
	const children = node.parent.getChildren();
	children.splice(node.getIndex(), 1);
	node.parent.setChildren(children);
	node.parent = null;
	return node;
}
