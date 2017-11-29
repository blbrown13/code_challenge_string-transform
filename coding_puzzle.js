const DICTIONARY = require('./dictionary.json');
const ALPHABET = new Set();

for (var i = 0; i < 26; i++) {
	var chr = String.fromCharCode(65 + i);
	ALPHABET.add(chr);
}


function findLowestCost(costs, strOne, strTwo) {
  strOne = strOne.toUpperCase();
  strTwo = strTwo.toUpperCase();

  checkValidInput(costs, strOne, strTwo);
  
  let addCost = costs[0];
  let deleteCost = costs[1];
  let changeCost = costs[2];
  let anagramCost = costs[3];
  let lowestCost = Number.POSITIVE_INFINITY;
  
  function transformString(currStrOne, currStrTwo, currCost, currCache) {
    // BASE CASES
    if (currCost >= lowestCost) {
      return;
    } else if (currStrOne === currStrTwo) {
        lowestCost = Math.min(lowestCost, currCost); 
        return;
    }
    
    currCache[currStrOne] = currStrOne;
    let newStrOne;

    // TRANSFORMATION OPERATIONS
    if (currStrOne.length > currStrTwo.length) {
      // DELETE LETTER
      for (let i = 0; i < currStrOne.length; i++) {
        newStrOne = currStrOne.substr(0, i) + currStrOne.substr(i + 1);

        if (isValidWord(newStrOne)) {
          transformString(newStrOne, currStrTwo, currCost + deleteCost, currCache);
        }
      }
    } else if (currStrOne.length < currStrTwo.length) {
      // ADD LETTER
        for (let letter of ALPHABET) {
          newStrOne = currStrOne + letter;

          if (isValidWord(newStrOne)) { 
            transformString(newStrOne, currStrTwo, currCost + addCost, currCache);
          }
        }
    } else {
        // ANAGRAM OR CHANGE 
        if (isAnagram(currStrOne, currStrTwo)) { 
          // MAKE ANAGRAM
          [currStrOne, currStrTwo] = makeAnagram(currStrOne, currStrTwo);
          transformString(currStrOne, currStrTwo, currCost + anagramCost, currCache);

        } else {
            // CHANGE LETTER
            let index = getStartIndex(currStrOne, currStrTwo);

            for (let i = index; i < currStrOne.length; i++) {
              for (let letter of ALPHABET) {
                newStrOne = currStrOne.substr(0, i) + letter + currStrOne.substr(i + 1);

                if (isValidWord(newStrOne) && newStrOne !== currStrOne && !currCache.hasOwnProperty(newStrOne)) { 
                  transformString(newStrOne, currStrTwo, currCost + changeCost, currCache);            
                }
              }
            }
            return;
        }
    }
  }

  transformString(strOne, strTwo, 0, {});

  return lowestCost === Number.POSITIVE_INFINITY ? -1 : lowestCost;
}


function checkValidInput(costs, strOne, strTwo) {
  if (arguments.length !== 3) {
    throw new Error('Invalid input! Please enter 3 arguments.');
  } else if (typeof strOne !== 'string' || typeof strTwo !== 'string') {
      throw new Error('Invalid input! Please enter 2 strings as arguments.');
  } else if (!Array.isArray(costs)) {
      throw new Error('Invalid input! Costs argument must be an array.');
  } else if (costs.length !== 4) {
      throw new Error('Invalid input! Costs array must have 4 values.');
  } else if (strOne.length < 3 || strTwo.length < 3) {
    throw new Error('Invalid input! Strings must be at least 3 characters in length.');
  } else if (!isValidWord(strOne) || !isValidWord(strTwo)) {
      throw new Error('Invalid input! Strings must be words in dictionary.');
  }

  return true;
}


function isValidWord(string) {
  return DICTIONARY.hasOwnProperty(string);
}


function isAnagram(strOne, strTwo) {
  if (strOne.length !== strTwo.length) {
    return false;
  }

  [strOne, strTwo] = makeAnagram(strOne, strTwo);

  return strOne === strTwo;
}


function makeAnagram(strOne, strTwo) {  
  strOne = strOne.split('').sort().join('');
  strTwo = strTwo.split('').sort().join('');

  return [strOne, strTwo];
}


function getStartIndex(strOne, strTwo) {
  for (var i = 0; i < strOne.length; i++) {
    if (strOne.charAt(i) !== strTwo.charAt(i)) {
      return i;
    }
  }
}

// *********************************************************
// PROVIDED EXAMPLE INPUT

// EXAMPLE #1
// 1 3 1 5
// HEALTH
// HANDS
// (output: 7) (HEALTH - HEATH - HEATS - HENTS - HENDS - HANDS)

// EXAMPLE #2
// 1 9 1 3
// TEAM
// MATE
// (output: 3) (TEAM - MATE)

// EXAMPLE #3
// 7 1 5 2
// OPHTHALMOLOGY
// GLASSES
// (output: -1)

// *********************************************************
// TESTING

let testInput = [
  [[1,3,1,5], 'HEALTH', 'HANDS', 7],
  [[1,9,1,3], 'TEAM', 'MATE', 3],
  [[7,1,5,2], 'OPHTHALMOLOGY', 'GLASSES', -1],
  [[1,2,3,4], 'BAT', 'FATE', 4],
  [[2,4,2,5], 'CAT', 'HAT', 2],
  [[1,3,2,4], 'MAT', 'MATH', 1],
  [[1,2,3,4], 'TOOTH', 'TEETH', -1],
  [[1,2,3,4], 'ADVERSE', 'AVERSE', 2],
  [[1,2,3,4], 'AFFECT', 'EFFECT', 3],
  [[1,2,3,4], 'CODE', 'CODE', 0]
];

function runTests(tests) {
  console.log('RUNNING TESTS...');

  let total = 0;
  let passed = 0;

  tests.forEach((test) => {
    total += 1;

    let costs = test[0];
    let start = test[1];
    let end = test[2];
    let expected = test[3];
    let actual = findLowestCost(costs, start, end);

    console.log(`\n${total}: Start Word: ${start}, End Word: ${end}, Expected Output: ${expected}, Actual Output: ${actual}`);
    
    if (actual === expected) {
      passed += 1;
      console.log(true);
    } else {
      console.log(false);
    }
  });

  console.log(`\nTESTS PASSED: ${passed} / ${total}`);
}

runTests(testInput);


// *** ERROR HANDLING TESTS (remove comments individually):
// console.log(findLowestCost([1,3,1,5], 'BRANDON', 'RALLY')); // => ERROR
// console.log(findLowestCost([1,3,1,5], 'HEALTH', '13')); // => ERROR
// console.log(findLowestCost([1,3,1], 'BRANDON', 'RALLY')); // => ERROR
// console.log(findLowestCost(13, 'BRANDON', 'RALLY')); // => ERROR



 


