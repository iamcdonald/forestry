import traverse from './traverse';

export default (node, term, TRAVERSAL_TYPE) => {
	const matches = [];
	traverse(node, node => {
		if (term(node)) {
			matches.push(node);
		}
	}, TRAVERSAL_TYPE);
	return matches;
}
