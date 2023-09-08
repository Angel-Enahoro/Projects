// Order 1
const root1 = document.querySelector('[data-key="order1"]');
const biscuits1 = root1.querySelector('.biscuits .count');
const donuts1 = root1.querySelector('.donuts .count');
const pancakes1 = root1.querySelector('.pancakes .count');
const status1 = root1.querySelector('.status dd');

biscuits1.textContent = root1.dataset.biscuits;
donuts1.textContent = root1.dataset.donuts;
pancakes1.textContent = root1.dataset.pancakes;
status1.textContent = root1.dataset.delivered === "true" ? 'Delivered' : 'Pending';

// Order 2
const root2 = document.querySelector('[data-key="order2"]');
const biscuits2 = root2.querySelector('.biscuits .count');
const donuts2 = root2.querySelector('.donuts .count');
const pancakes2 = root2.querySelector('.pancakes .count');
const status2 = root2.querySelector('.status dd');

biscuits2.textContent = root2.dataset.biscuits;
donuts2.textContent = root2.dataset.donuts;
pancakes2.textContent = root2.dataset.pancakes;
status2.textContent = root2.dataset.delivered === "true" ? 'Delivered' : 'Pending';

// Order 3
const root3 = document.querySelector('[data-key="order3"]');
const biscuits3 = root3.querySelector('.biscuits .count');
const donuts3 = root3.querySelector('.donuts .count');
const pancakes3 = root3.querySelector('.pancakes .count');
const status3 = root3.querySelector('.status dd');

biscuits3.textContent = root3.dataset.biscuits;
donuts3.textContent = root3.dataset.donuts;
pancakes3.textContent = root3.dataset.pancakes;
status3.textContent = root3.dataset.delivered === "true" ? 'Delivered' : 'Pending';
