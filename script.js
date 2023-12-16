'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};



const calcAndDisplayBalance = function(movements) {
  const balance = movements.reduce((acc , mov) => acc + mov , 0);
  labelBalance.textContent = `${balance} €`;
}

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});


btnTransfer.addEventListener("click" , function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';

  if(amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Updated UI
    updateUI(currentAccount);

  }
});


btnLoan.addEventListener('click' , function(e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //Add the movement here:
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
})

btnClose.addEventListener('click' , function(e) {
  e.preventDefault();
  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin ){
    const index = accounts.findIndex(acc => acc.username ==currentAccount.username);
    //Delete account
    accounts.splice(index , 1);

    //Hide UI
    containerApp.style.opacity = 100;
  }
  inputCloseUsername.value = inputClosePin.value = '';
})

let sorted = false;
btnSort.addEventListener('click' , function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements , !sorted);
  sorted = !sorted;
})



/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);




const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];



//FIND
// const firstWithdraw = movements.find(mov => mov<0)
// console.log(firstWithdraw);
//
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);
//
// for(const acc of accounts) {
//   if(acc.owner === 'Jessica Davis') {
//     console.log(acc);
//   }
// }


//PIPELINE
// const eurToUsd = 1.1;
// const totalDepositsUSD = movements
//   .filter(mov=>mov>0)
//   .map(mov => mov * eurToUsd).
//   reduce((acc , mov) => acc + mov , 0);
//
// console.log(totalDepositsUSD);
//



//Reduce
//acc = accumolator --> SNOWBALL
// const balance = movements.reduce(function(acc , cur , i , arr) {
//   console.log(`Iteration number ${i}: ${acc}`);
//   return acc + cur
// } , 0);


// Maximum number
// const max = movements.reduce((acc , mov) => {
//   if(acc > mov) {
//     return acc;
//   } else {
//     return mov;
//   }
// } , movements[0])
// console.log(max);

//Arrow Function
// const balance = movements.reduce((acc , cur ) => acc + cur , 0);
//
//
// let balance2 = 0;
// for (const mov of movements) {
//   balance2+=mov;
// }
// console.log(balance);
//
// console.log(balance);
//





//Filter
// const deposits = movements.filter(function(mov) {
//   return mov>0;
// })
// console.log(deposits);
// const withdrawals = movements.filter(function(mov) {
//   return mov < 0;
// });
// console.log(withdrawals);




//
//
// const eurToUsd = 1.1;
// const movementsUSD = movements.map(mov => mov*eurToUsd)
// console.log(movementsUSD);
// console.log(movements);
//
//
// const movementsUSDfor = [];
// for(const mov of movements) {
//   movementsUSDfor.push(mov*eurToUsd);
// }
//
// console.log(movementsUSDfor);
//
//
// const movementsDescriptions = movements.map((mov , i) =>
//   `Movement ${i+1}: you ${(mov>0) ? 'deposited' : 'withdrew'}${Math.abs(mov)}`
// )
//
// console.log(movementsDescriptions);
/////////////////////////////////////////////////
//SLICE
// let arr = ['a' , 'b' , 'c' , 'd' , 'e'];
// console.log(arr.slice(2));
// console.log(arr.slice(2 , 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1,-1));

//SPLICE
// console.log(arr.splice(2));
// console.log(arr.splice(-1));
// console.log(arr);
//
// //REVERSE
// arr = ['a' , 'b' , 'c' , 'd' , 'e'];
// const arr2 = ['j' , 'i' , 'h' , 'g' , 'f'];
// console.log(arr2.reverse());
// console.log(arr2);
//
// //CONCAT
// const letters = arr.concat(arr2);
// console.log(letters)
// console.log([...arr,...arr2]);
//
// //JOIN
//
// console.log(letters.join(' - '));

// const arr = [23 , 11 , 64];
// console.log(arr[0]);
// console.log(arr.at(0));
//
// //getting last array elements
// console.log(arr[arr.length-1]);
// // console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));
//
//
// console.log('jonas'.at(-1));


// for (const [i,movement] of movements.entries() ) {
//   if(movement>0) {
//     console.log(`Movement ${i+1}: you deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i+1}: you withdraw${Math.abs(movement)}`);
//   }
// }
// console.log("---------FOREACH---------");
// movements.forEach(function(mov, i , arr) {
//   if(mov>0) {
//     console.log(`Movement ${i+1}: you deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i+1}: you withdraw${Math.abs(mov)}`);
//   }
// })




// currencies.forEach(function(value , key , map) {
//   console.log(`${key} ${value}`);
// })
//
//
// console.log("--------SET---------");
// const currenciesUnique = new Set(['USD' , 'GRP' , 'USD' , 'EUR' , 'EUR']);
//
// currenciesUnique.forEach(function(value , key , map) {
//   console.log(`${key} ${value}`);
// });


//Strings
// const owners = ["Jonas" , "Zack" , "Adam" , "Martha"];
// owners.sort();
// console.log(owners);
//
// //Numbers
// console.log(movements);
// // movements.sort((a,b) => {
// //   if(a>b)
// //     return 1;
// //   if(b>a)
// //     return -1;
// // })
//
// movements.sort((a,b) => a-b)
// console.log(movements);
//
// const x = new Array(7);
// console.log(x);
//
// // x.fill(1);
// x.fill(1,3 , 5);
// console.log(x);
//
//
// const y = Array.from({length: 7} , () => 1);
// console.log(y);
//
//
// const z = Array.from({length : 6} , (cur , i) => i + 1);
// console.log(z);
//
// const k = Array.from({length: 100} , (_ , i) => z);
// console.log(k);
//
// const movementsUI = Array.from(document.querySelectorAll('.movements__type'));
//
// console.log(movementsUI);
//
// labelBalance.addEventListener('click' , function() {
//   const movementsUI = Array.from(document.querySelectorAll('.movements__value') ,
//     el => Number(el.textContent.replace('€' , '')));
//   console.log(movementsUI);
// })


// const bankDepositSum = accounts.flatMap(acc => acc.movements).filter(mov => mov > 0).reduce((sum,mov) => sum+mov , 0);
// console.log(bankDepositSum);
// // const numDeposit1000 = accounts.flatMap(acc => acc.movements).filter(mov => mov >= 1000).length;
// const numDeposit1000 = accounts.flatMap(acc => acc.movements).reduce((count,cur) =>cur >= 1000 ? ++count : count,0);
// console.log(numDeposit1000);
// const sums = accounts.flatMap(acc => acc.movements).reduce((sums,cur) => {
//   cur > 0 ? sums.deposits+=cur : sums.withdrawals+=cur;
//   return sums;
// }, {deposits: 0 , withdrawals: 0});
// console.log(sums);
//
// const converTitleCase = function(title) {
//   const capitalize = word => word[0].toUpperCase() + word.slice(1);
//   const exceptions = ['a' , 'an' , 'and' , 'the' , 'but' , 'or' , 'on' , 'in' , 'with'];
//   const titleCase = title.toLowerCase().split(' ')
//     .map(word => exceptions.includes(word) ? word : capitalize(word))
//     .join(' ');
//   return capitalize(titleCase);
// }
// console.log(converTitleCase("this is a nice title"));
// console.log(converTitleCase("this is a LONG title but not too long"));
// console.log(converTitleCase("and here is another title with an EXAMPLE"));
//
//


///////////////////////////////////////
// Coding Challenge #4

/*
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property.
Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28.
(The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners,
so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all
owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!"
and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order
(keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10).
Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/
//
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] }
// ];
//
// //1.
// dogs.forEach(dog => dog.recFood = Math.trunc(dog.weight ** 0.75 * 28));
// console.log(dogs);
// //2.
// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'))
// console.log(`Sarah's dog is eating ${dogSarah.curFood > dogSarah.recFood ? "too much!" : "little!"}`);
//
// //3.
// const ownersEatTooMuch = dogs.filter(dog => dog.curFood > dog.recFood).flatMap(dog => dog.owners);
// const ownersEatTooLittle = dogs.filter(dog => dog.curFood < dog.recFood).flatMap(dog => dog.owners);
// //4.
// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
// console.log(`${ownersEatTooLittle.join(' and ')} 's dogs eat too little!`);
// //5.
// console.log(dogs.some(dog => dog.curFood === dog.recFood));
// //6.
// //current > (recommended * 0.90) && current < (recommended * 1.10).
// const checkEatingOkay = dog => dog.curFood > dog.recFood * 0.9  && dog.curFood < (dog.recFood * 1.10)
// console.log(dogs.some(checkEatingOkay));
// //7.
// console.log(dogs.filter(checkEatingOkay));
// //8.
// const dogsSorted = dogs.slice().sort((a,b) => a.recFood - b.recFood)
// console.log(dogsSorted);
//
//
//
//
//
//


























