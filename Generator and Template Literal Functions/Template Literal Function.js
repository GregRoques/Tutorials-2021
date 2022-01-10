function bold(strings, ...values) {
  // strings = spaces between variables are seperated into individual strings
  //values = variables passed to template literal
  console.log(strings);
  console.log(values);
  const boldedString = values.reduce((previousValue, value, index) => {
    return `${previousValue}<strong>${value}</strong>${strings[index + 1]}`;
  }, strings[0]);
  return boldedString;
}

const cat1 = "Callie";
const cat2 = "Midnight";

const boldedTL = bold`My cats ${cat1} and ${cat2} love treats!`;
console.log(boldedTL);
