function* generatorFunction() {
  // Line 1
  console.log("This will be executed first.");
  yield "Hello, "; // Line 2
  console.log("I will be printed after the pause");
  yield "World!";
}
const generatorObject = generatorFunction(); // Line 3
console.log(generatorObject.next().value); // Line 4
console.log(generatorObject.next().value); // Line 5

// =================================================

function* iterableObj() {
  yield "This";
  yield "is";
  yield "iterable.";
}
for (const val of iterableObj()) {
  console.log(val);
}

// =================================================

function* naturalNumbers() {
  let num = 1;
  while (true) {
    yield num;
    num = num + 1;
  }
}
const numbers = naturalNumbers();
console.log(numbers.next().value);
console.log(numbers.next().value);

// =================================================

function* take(n, iter) {
  let index = 0;
  for (const val of iter) {
    if (index >= n) {
      return;
    }
    index = index + 1;
    yield val;
  }
}

// =================================================

function* cycled(iter) {
  const arrOfValues = [...iter];
  while (true) {
    for (const val of arrOfValues) {
      yield val;
    }
  }
}
console.log(...take(10, cycled(take(3, naturalNumbers()))));
// 1 2 3 1 2 3 1 2 3 1
