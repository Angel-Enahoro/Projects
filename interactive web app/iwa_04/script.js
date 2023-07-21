const date = 2050;
let count = 0;
let title = "parent";

if (date == "2050") {
  console.log("January", "New Year’s Day");
  console.log("March", "Human Rights Day");
  let month = "April";
  console.log(month, "Family Day");
  console.log(month, "Freedom Day");
  count = count + 4;

 
  if (title  == "student") {
	  console.log('June', 'Youth Day')
		count = count + 1
  }


  console.log("August", "Women’s Day");
  console.log("September", "Heritage Day");
  month = "December";
  console.log(month, "Day of Reconciliation");
  count = count + 3;


if (title == "parent") {  
  console.log(month, "Christmas Day");
  count = count + 1;
}

console.log(month, "Day of Goodwill");
  count = count + 1;
  } 



console.log("Your status is:", title);
console.log("The year is:", date);
console.log("The total holidays is:", count);