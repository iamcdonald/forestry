const cloneData = (data, childrenProp) => {
  if (data instanceof Object) {
    if (typeof data.clone === 'function') {
      return data.clone();
    }
    if (Array.isArray(data)) {
      return data.map(cloneData);
    }
    return Object.keys(data).reduce((clone, key) => {
      if (key !== childrenProp) {
        clone[key] = cloneData(data[key]);
      }
      return clone;
    }, {});
  }
  return data;
};

export default cloneData;
