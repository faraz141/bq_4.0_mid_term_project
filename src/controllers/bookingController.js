// controllers/bookingController.js
const Booking = require("../models/bookingSchema");
const Event = require("../models/EventSchema");
const Joi = require("joi");

const bookSeatsSchema = Joi.object({
  seatNumbers: Joi.array().items(Joi.string()).min(1).required(),
});

exports.bookSeats = async (req, res) => {
  const { error } = bookSeatsSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { eventId } = req.params;
    const { seatNumbers } = req.body;
    const userId = req.user.userId;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const availableSeats = event.seats
      .filter((seat) => !seat.isBooked)
      .map((s) => s.seatNumber);
    const invalidSeats = seatNumbers.filter(
      (sn) => !availableSeats.includes(sn)
    );
    if (invalidSeats.length > 0) {
      return res.status(400).json({
        message: `Seats not available: ${invalidSeats.join(", ")}`,
        available: availableSeats,
      });
    }

    seatNumbers.forEach((sn) => {
      const seat = event.seats.find((s) => s.seatNumber === sn);
      if (seat) {
        seat.isBooked = true;
        seat.bookedBy = userId;
      }
    });

    await event.save();

    const tickets = seatNumbers.length;
    const totalPrice = tickets * event.price;

    const booking = new Booking({
      eventId,
      userId,
      seatNumbers,
      tickets,
      totalPrice,
      status: "confirmed",
    });

    await booking.save();

    res.status(201).json({
      message: "Seats booked successfully",
      assignedSeats: seatNumbers,
      bookingId: booking._id,
      totalPrice,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: error.message || "Error booking seats" });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId }).populate(
      "eventId",
      "title date location price"
    );
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

exports.getEventBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      eventId: req.params.eventId,
    }).populate("userId", "name email");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event bookings" });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      userId: req.user.userId,
    });
    if (!booking)
      return res
        .status(404)
        .json({ message: "Booking not found or unauthorized" });

    const event = await Event.findById(booking.eventId);
    if (event) {
      booking.seatNumbers.forEach((sn) => {
        const seat = event.seats.find((s) => s.seatNumber === sn);
        if (seat) {
          seat.isBooked = false;
          seat.bookedBy = undefined;
        }
      });
      await event.save();
    }

    booking.status = "canceled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};

exports.updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  const statusSchema = Joi.string()
    .valid("pending", "confirmed", "canceled")
    .required();
  const { error } = statusSchema.validate(status);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { status },
      { new: true }
    );

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.json({ message: "Status updated", booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};
