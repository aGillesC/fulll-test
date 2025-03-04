const fizzBuzz = (n) => {
    if (!Number.isInteger(n) || n < 1) {
      throw new Error("Invalid input: N must be a positive integer.");
    }
  
    const FIZZ_DIVISOR = 3;
    const BUZZ_DIVISOR = 5;
    const FIZZ_WORD = "Fizz";
    const BUZZ_WORD = "Buzz";
    const outputArray = new Array(n);
  
    for (let i = 1; i <= n; i++) {
      let outputWord = "";
      const isMultipleOfThree = i % FIZZ_DIVISOR === 0;
      const isMultipleOfFive = i % BUZZ_DIVISOR === 0;
  
      if (isMultipleOfThree) outputWord += FIZZ_WORD;
      if (isMultipleOfFive) outputWord += BUZZ_WORD;
  
      outputArray[i - 1] = outputWord || i.toString();
    }
  
    console.log(outputArray.join("\n"));
  };
  
  fizzBuzz(16);
  // fizzBuzz(10000000);
  // fizzBuzz(1.1);
  