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
  console.log(currentAccount);

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
  console.log(amount , receiverAcc);

  inputTransferAmount.value = inputTransferTo.value = '';

  if(amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Updated UI
    updateUI(currentAccount);

  }
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
