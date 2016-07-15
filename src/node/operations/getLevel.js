import climb from './climb';

export default (node) => {
	return climb(node, (n, l) => ++l, -1);
}
