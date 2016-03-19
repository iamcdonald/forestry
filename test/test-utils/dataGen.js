export const simpleDataGen = () => {
  return function * () {
    yield 'one-hundred';
    yield 'two-hundred';
    yield 'three-hundred';
    yield 'four-hundred';
    yield 'five-hundred';
    yield 'six-hundred';
    yield 'seven-hundred';
    yield 'eight-hundred';
    yield 'nine-hundred';
  };
};

export const objectDataGen = () => {
  return function * () {
    yield { data: 'one-hundred' };
    yield { data: 'two-hundred' };
    yield { data: 'three-hundred' };
    yield { data: 'four-hundred' };
    yield { data: 'five-hundred' };
    yield { data: 'six-hundred' };
    yield { data: 'seven-hundred' };
    yield { data: 'eight-hundred' };
    yield { data: 'nine-hundred' };
  };
};

class Test {
  constructor(data) {
    this.data = data;
  }

  clone() {
    return new Test(this.data);
  }
}

export const classDataGen = () => {
  return function * () {
    yield new Test('one-hundred');
    yield new Test('two-hundred');
    yield new Test('three-hundred');
    yield new Test('four-hundred');
    yield new Test('five-hundred');
    yield new Test('six-hundred');
    yield new Test('seven-hundred');
    yield new Test('eight-hundred');
    yield new Test('nine-hundred');
  };
};
