import traverse from './traverse';

export default (node, op, acc, TRAVERSAL_TYPE) => {
	traverse(node, node => {
		acc = op(acc, node);
	}, TRAVERSAL_TYPE);
	return acc;
}
