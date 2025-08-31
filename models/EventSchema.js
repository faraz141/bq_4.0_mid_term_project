const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  isBooked: { type: Boolean, default: false }
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true }, // Event date
  time: { type: String, required: true }, // e.g. "18:00"
  location: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  price: { type: Number, required: true },
  banner: { type: String },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'ended'],
    default: 'upcoming'
  },
  seats: [seatSchema]
}, { timestamps: true });

// 🔹 Generate random seat numbers
eventSchema.statics.generateSeats = function(totalSeats) {
  const seats = [];
  const usedNumbers = new Set();

  while (seats.length < totalSeats) {
    const randomNum = Math.floor(Math.random() * 1000) + 1;
    if (!usedNumbers.has(randomNum)) {
      usedNumbers.add(randomNum);
      seats.push({ seatNumber: `S${randomNum}` });
    }
  }

  return seats;
};

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;