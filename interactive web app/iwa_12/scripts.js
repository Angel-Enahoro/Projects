
// Edit below line 


const STATUS_MAP = {
    shelf: {
        color: 'green',
        canReserve: true,
        canCheckout: true,
        canCheckIn: false,
    },
    reserved: {
        color: 'blue',
        canReserve: false,
        canCheckout: true,
        canCheckIn: false,
    },
    overdue: {
        color: 'red',
        canReserve: false,
        canCheckout: false,
        canCheckIn: true,
    },
    checkedOut: {
        color: 'orange',
        canReserve: false,
        canCheckout: false,
        canCheckIn: true,
    }
}


const bookStatus = document.querySelector('#book1 .bookStatus');
const reserve = document.querySelector('#book2 .bookStatus');
const checkin = document.querySelector('#book3 .bookStatus');
const checkout = document.querySelector ('.checkout')
const shelf = document.querySelector('.bookStatus')


bookStatus.style.color = STATUS_MAP.overdue.color
reserve.style.color = STATUS_MAP.reserved.color
checkin.style.color = STATUS_MAP.shelf.color 
checkout.style.color = STATUS_MAP.checkout.color 
