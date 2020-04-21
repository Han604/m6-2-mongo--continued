const router = require('express').Router();

const { batchImport, getSeats, updateSeat } = require('./handlers');

// Code that is generating the seats.
// ----------------------------------
// const seats = {};
// const row = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
// for (let r = 0; r < row.length; r++) {
//   for (let s = 1; s < 13; s++) {
//     seats[`${row[r]}-${s}`] = {
//       price: 225,
//       isBooked: false,
//     };
//   }
// }
// ----------------------------------

router.get('/api/seat-availability', getSeats);

router.post('/api/book-seat', updateSeat);

module.exports = router;
