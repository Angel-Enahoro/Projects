const FREE_WARNING = 'Free shipping only applies to single customer orders'
const BANNED_WARNING = 'Unfortunately we do not ship to your country of residence'
const NONE_SELECTED = '0'
let shippingLocation = 'NK'
let shipping = null
let currency = null
const customers = 1 ;

if (shippingLocation === 'RSA') {
  shipping = 400
  currency = 'R'
} else if (shippingLocation === 'NAM') {
  shipping = 600
  currency = '$'
} else {
  shipping = 800
  currency = '$'
}

const shoes = 300 * 1
const toys = 100 * 5
const shirts = 150 * NONE_SELECTED
const batteries = 35 * 2
const pens = 5 * NONE_SELECTED

const finalCost = shoes + toys + shirts + batteries + pens



if (shippingLocation === 'NK') {
  console.log(BANNED_WARNING)
} else 
  if (finalCost >= 1000 && (shippingLocation === 'RSA' || shippingLocation === 'NAM') && customers === 1) {
    shipping = 0
  } else {
    console.log(FREE_WARNING)
  }



console.log('Price:', currency, finalCost + shipping)