const leoName = 'Leo'
const leoSurname = 'Musvaire'
const leoBalance = '-9394'

const sarahName = 'Sarah'
const sarahSurname = 'Kleinhans '
const sarahBalance = '-4582.21000111'

const divider = '----------------------------------';

const owedLeo = (parseFloat(leoBalance) * -1).toFixed(2).replace(/(\d)(?=(\d{3})+$)/g, '$1')
const owedSarah = (parseFloat(sarahBalance) * -1).toFixed(2).replace(/(\d)(?=(\d{3})+$)/g, '$1')
const leo = leoName + " " + leoSurname + " (Owed: R " + owedLeo + ")"
const sarah = sarahName + sarahSurname + " (Owed: R " + owedSarah + ")"
const total = "  Total amount owed: R " + (parseFloat(owedLeo) + parseFloat(owedSarah)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const result = "\n" + leo + "\n" + sarah + "\n" + divider + "\n" + total + "\n" + divider

console.log(result) 
