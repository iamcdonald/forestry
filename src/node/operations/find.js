import traverse from './traverse';

export default (node, term, TRAVERSAL_TYPE) => {
	let found = null;
	traverse(node, node => {
		if (term(node)) {
			found = node;
			return null;
		}
	}, TRAVERSAL_TYPE);
	return found;
}
