function cloneData(data, childrenProp) {
  if (isArray(data)) {
    return cloneArray(data);
  }
  if (isObject(data)) {
    return cloneObject(data, childrenProp);
  }
  return data;
}

function isObject(data) {
  return Object.getPrototypeOf(data) === Object.prototype;
}

function isArray(data) {
  return Object.getPrototypeOf(data) === Array.prototype;
}

function cloneObject(data, childrenProp) {
  return Object.keys(data).reduce((clone, key) => {
    if (key !== childrenProp) {
      clone[key] = cloneData(data[key]);
    }
    return clone;
  }, {});
}

function cloneArray(arr) {
  return arr.map(cloneData);
}

export default cloneData;
