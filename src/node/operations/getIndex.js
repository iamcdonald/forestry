export default (node) => {
	if (!node.parent) {
		return null;
	}
	return node.parent.getChildren().findIndex(child => child.data === node.data);
}
