import dataGen from './dataGen';

class Test {
  constructor(data) {
    this.data = data;
  }

  clone() {
    return new Test(this.data);
  }
}

export const simpleTreeCreator = (creator) => {
  const [d1, d2, d3, d4, d5] = dataGen()();
  let root = creator(d1);
  root.addChildren([{ reading: d2 }, { reading: d3 }])
  root.children[0].addChildren([{ reading: d4 }, { reading: d5 }]);
  return root;
}

export const objectTreeCreator = (creator) => {
  const [d1, d2, d3, d4, d5] = dataGen()();
  let root = creator({data: d1});
  root.addChildren([{data: d2}, {data: d3}])
  root.children[0].addChildren([{data: d4}, {data: d5}]);
  return root;
}

export const classTreeCreator = (creator) => {
  const [d1, d2, d3, d4, d5] = dataGen()();
  let root = creator(new Test(d1));
  root.addChildren([new Test(d2), new Test(d3)])
  root.children[0].addChildren([new Test(d4), new Test(d5)]);
  return root;
}
