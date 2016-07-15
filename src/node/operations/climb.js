export default (node, op, acc) => {
	do {
		acc = op(node, acc);
	}
	while ((node = node.parent));
	return acc;
}
