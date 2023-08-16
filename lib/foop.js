/*
  * 함수에서 실행 상태를 유지할 수 있다. 비공개로 유지가 가능하다.
*/
function counter() {
  let count = 0;
  return (fn) => {
    count++;
    fn(count);
  }
}

class Counter {
  constructor() {
    this._counter = 0;
  }
  increment() {
    this._counter++;
  }
  getCount() {
    return this._counter;
  }
}

// view
function view() {
  const increment = counter();
  const counter = new Counter();

  function clickHandler() {
    increment(render);
  }

  function clickHandler2() {
    counter.increment();
    render(counter.getCount());
  }
}

const foo = counter();

// 실행
//> foo(); -> 1
//> foo(); -> 2 ...