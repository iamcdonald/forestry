const cloneData = data => {
	if (data instanceof Object) {
		if (typeof data.clone === 'function') {
			return data.clone();
		}
		if (Array.isArray(data)) {
			return data.slice();
		}
		let clone = Object.assign({}, data);
		Object.keys(clone).forEach(key => {
			clone[key] = cloneData(clone[key]);
		});
		return clone;

	}
	return data;
}

export default cloneData;
