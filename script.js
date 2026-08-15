const main = document.querySelector("main");
const loginForm = document.querySelector(".login");
const registerForm = document.querySelector(".register");
const registerHere = document.querySelector(".registerHere");
const loginHere = document.querySelector(".loginHere");
const aside = document.querySelector("aside");
const section = document.querySelector("section");
const hero = document.querySelector(".hero");
const history = document.querySelector(".history");
const box = document.querySelectorAll(".box");
const overlay = document.querySelector(".overlay");
const header = document.querySelector("header");
const settingsPage = document.querySelector(".settingsPage");
const currency = document.querySelectorAll(".currency");
const profileDetail = document.querySelector(".profileDetail");
const totalIncome = document.querySelector(".totalIncome");
const totalExpense = document.querySelector(".totalExpense");
const currentBalance = document.querySelector(".currentBalance");
const totalTransactions = document.querySelector(".totalTransactions");
const dataBox = document.querySelector(".dataBox");

registerHere.addEventListener("click", () => {
  registerForm.style.display = "flex";
  loginForm.style.display = "none";
});

loginHere.addEventListener("click", () => {
  registerForm.style.display = "none";
  loginForm.style.display = "flex";
});

let userArr = JSON.parse(localStorage.getItem("registeredUsers")) || [];

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let name = e.target[0].value;
  let password = e.target[1].value;
  if (name.trim() === "" || password.trim() === "") return;

  userArr.push({
    name,
    password,
    currency:"$"
  });

  localStorage.setItem("registeredUsers", JSON.stringify(userArr));

  alert("Registration Succesfull!Now you can login");
  registerForm.style.display = "none";
  loginForm.style.display = "flex";

  registerForm.reset();
});
let recentUser = JSON.parse(localStorage.getItem("presentUser"));

if(recentUser){
section.style.display = "flex";
main.style.display = "none";
aside.style.display = "flex"; 
}

loginForm.addEventListener("submit", (e) => {
  let name = e.target[0].value;
  let password = e.target[1].value;
let data = userArr.find((elem) => elem.name === name && elem.password === password)

  if (
    data
  ) {
    alert("Welcome to Fintrack");
    aside.style.display = "flex";
    section.style.display = "flex";
    main.style.display = "none";
    localStorage.setItem(
      "presentUser",
      JSON.stringify({ name, currency: `${data.currency}` }),
    );
    showTransactions(),
      changeAmount()
    header.querySelector(".currentUser").textContent = name;
  } else {
    alert("invalid username or password");
  }

  loginForm.reset();
});

header.querySelector(".logOut").addEventListener("click", () => {
  aside.style.display = "none";
  section.style.display = "none";
  main.style.display = "flex";
});

aside.querySelector(".addTransaction").addEventListener("click", () => {
  overlay.style.display = "flex";
});
let transactions =
  JSON.parse(localStorage.getItem(`transactions_${recentUser.name}`)) || [];

let showTransactions = () => {
  dataBox.innerHTML = "";
  transactions.forEach((elem) => {
    const colorClass = elem.type==="Income"?"income":"expense"
    dataBox.innerHTML += `
          <div class="singleBox">
            <div class="above">
              <h2  >${elem.date}</h2>
              <h3>${elem.description}</h3>
              <button>${elem.type}</button>
              <div class="money">
                <h5 class="${colorClass}" >${elem.type === "Income" ? "+" : "-"}</h5>
                <h4 class="${colorClass}" >${recentUser.currency}${elem.amount}</h4>
              </div>
              <div class="actionss">
                <i onclick="editData('${elem.id}')" class="ri-pencil-fill"></i>
                <i onclick="deleteData('${elem.id}')" class="ri-delete-bin-6-fill"></i>
              </div>
            </div>
              <div class="horizontal"></div>
          </div>
        `;
  });
};
showTransactions();
let editedId = "";
let editData = (id) => {
  console.log(id);
  editedId = id;
  let object = transactions.find((val) => val.id === id);
  overlay.style.display = "flex";
  overlay.querySelector(".moneyType").value = object.type;
  overlay.querySelector(".DescriptionType").value = object.description;
  overlay.querySelector(".amountType").value = object.amount;
  overlay.querySelector(".dateType").value = object.date;
  overlay.querySelector(".source").value = object.category;
};

let deleteData = (id) => {
  transactions = transactions.filter((val) => val.id !== id);
  localStorage.setItem(
    `transactions_${recentUser.name}`,
    JSON.stringify(transactions),
  );
  showTransactions();
  changeAmount();
};

overlay.querySelector("form").addEventListener("submit", (e) => {

  let type = e.target[0].value;
  let description = e.target[1].value;
  let amount = Number(e.target[2].value);
  let date = e.target[3].value;
  let category = e.target[4].value;

  let obj = {
    id: editedId || crypto.randomUUID(),
    amount,
    type,
    description,
    date,
    category,
  };
  if (editedId) {
    transactions = transactions.map((elem) =>
      elem.id === editedId ? obj : elem,
    );
  } else {
    transactions.push(obj);
  }
  localStorage.setItem(
    `transactions_${recentUser.name}`,
    JSON.stringify(transactions),
  );

  e.target.reset();
  editedId = "";
  showTransactions();
  changeAmount();
  overlay.style.display = "none";
});

let changeAmount = () => {
  if (recentUser) {
    header.querySelector(".currentUser").textContent = `${recentUser.name}`;
    currency.forEach((elem) => {
      elem.textContent = `${recentUser.currency}`;
    });
  }
  let addIncome = transactions.reduce((acc, n) => {
    if (n.type === "Income") acc += n.amount;
    return acc;
  }, 0);
  let addExpense = transactions.reduce((acc, n) => {
    if (n.type === "Expense") acc += n.amount;
    return acc;
  }, 0);
  totalExpense.textContent = addExpense;
  totalIncome.textContent = addIncome;
  totalTransactions.textContent = transactions.length;
  currentBalance.textContent = addIncome - addExpense;
};
changeAmount();

overlay.addEventListener("click", (e) => {
  if (e.target.className === "overlay" || e.target.className === "close")
    overlay.style.display = "none";
});
aside.querySelector(".dashboard").style.backgroundColor = "#b2cdef";
aside.querySelector(".settings").style.backgroundColor = "transparent";

aside.querySelector(".settings").addEventListener("click", () => {
  settingsPage.style.display = "flex";
  aside.querySelector(".settings").style.backgroundColor = "#dbeafe";
  aside.querySelector(".dashboard").style.backgroundColor = "transparent";
  section.querySelector(".hero").style.display = "none";
  section.querySelector(".history").style.display = "none";
});

aside.querySelector(".dashboard").addEventListener("click", () => {
  settingsPage.style.display = "none";
  aside.querySelector(".dashboard").style.backgroundColor = "#dbeafe";
  aside.querySelector(".settings").style.backgroundColor = "transparent";
  section.querySelector(".hero").style.display = "grid";
  section.querySelector(".history").style.display = "flex";
});

profileDetail.querySelector("input").value = `${recentUser.name}`;
profileDetail.querySelector("select").value = `${recentUser.currency}`;

profileDetail.addEventListener("submit", (e) => {
  e.preventDefault();
  let name = e.target[0].value;
  let currency = e.target[1].value;

  let updatedArr = userArr.map((elem) => {
    if(elem.name === recentUser.name){
      return {
        ...elem,
        name,
        currency
      }
    }
    return elem
  });
  localStorage.setItem("registeredUsers", JSON.stringify(updatedArr));

  recentUser.name = name;
  recentUser.currency = currency;
  showTransactions();
  changeAmount();
  localStorage.setItem("presentUser", JSON.stringify(recentUser));
  alert("Changes are saved");
});

let themee = localStorage.getItem("theme") || "lightMode";
if (themee === "darkMode") {
  document.body.classList.add("darkMode");
}
hero.querySelector(".layer").addEventListener("click", () => {
  const isDark = document.body.classList.toggle("darkMode");
  themee = isDark ? "darkMode" : "lightMode";
  localStorage.setItem("theme", themee);

});

  hero.querySelector(".resetBtn").addEventListener("click",()=>{
         let isConfirm = confirm("WARNING: This will delete all your transaction data permanently")

         if(isConfirm){
          transactions.splice(0,transactions.length)
          localStorage.setItem(`transactions_${recentUser.name}`,JSON.stringify(transactions))
          showTransactions()
          changeAmount()
         }
  })

history.querySelector(".search").addEventListener("keyup",(e)=>{
 const dataa = e.target.value.trim().toLowerCase()
 
 const allTransactions = JSON.parse(localStorage.getItem(`transactions_${recentUser.name}`))
  if(dataa!==""){
     transactions = allTransactions.filter((val)=>{
      return val.description.trim().toLowerCase().includes(dataa) || val.type.toLowerCase().includes(dataa)

    })
  }else{
      transactions = [...allTransactions]
    }

  showTransactions()
  transactions = JSON.parse(localStorage.getItem(`transactions_${recentUser.name}`))

})

history.querySelector(".category").addEventListener("change",(e)=>{
  if(e.target.value==="Income"){
     transactions = transactions.filter((val)=> val.type==="Income")
  }else if(e.target.value==="Expense"){
     transactions = transactions.filter((val)=> val.type==="Expense")
  }
  
 showTransactions()
  transactions = JSON.parse(localStorage.getItem(`transactions_${recentUser.name}`))
})

let income = totalIncome.textContent;
let expenses = totalExpense.textContent;
const incomeBar = document.getElementById("incomeBar");
const expenseBar = document.getElementById("expenseBar");
const incomeTooltip = document.getElementById("incomeTooltip");
const expenseTooltip = document.getElementById("expenseTooltip");
const yAxis = document.getElementById("yAxis");
const gridLines = document.getElementById("gridLines");

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function getNiceStep(maxValue, targetSteps = 5) {
  const roughStep = maxValue / targetSteps;
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const normalized = roughStep / magnitude;
  let niceNumber;
  if (normalized <= 1) {
    niceNumber = 1;
  } else if (normalized <= 2) {
    niceNumber = 2;
  } else if (normalized <= 5) {
    niceNumber = 5;
  } else {
    niceNumber = 10;
  }
  return niceNumber * magnitude;
}

function updateCashFlow(newIncome, newExpenses) {
  income = Number(newIncome) || 0;
  expenses = Number(newExpenses) || 0;
  const largestValue = Math.max(income, expenses, 1);
  const step = getNiceStep(largestValue, 5);
  const maxAxisValue = Math.ceil(largestValue / step) * step;
  yAxis.innerHTML = "";
  gridLines.innerHTML = "";
  const steps = Math.round(maxAxisValue / step);
  for (let i = 0; i <= steps; i++) {
    const value = i * step;
    const percentage = (value / maxAxisValue) * 100;
    const label = document.createElement("div");
    label.className = "y-label";
    label.style.bottom = `${percentage}%`;
    label.textContent = formatNumber(value);
    yAxis.appendChild(label);
    const line = document.createElement("div");
    line.className = "grid-line";
    line.style.bottom = `${percentage}%`;
    gridLines.appendChild(line);
  }
  const incomeHeight = (income / maxAxisValue) * 100;
  const expenseHeight = (expenses / maxAxisValue) * 100;
  incomeBar.style.height = `${incomeHeight}%`;
  expenseBar.style.height = `${expenseHeight}%`;
  incomeTooltip.textContent = `Income: ${formatNumber(income)}`;
  expenseTooltip.textContent = `Expenses: ${formatNumber(expenses)}`;
}

updateCashFlow(income, expenses);