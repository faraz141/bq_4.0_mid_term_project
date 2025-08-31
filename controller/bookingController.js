const Booking = require("../models/bookingSchema");
const Event = require("../models/EventSchema");

exports.bookSeats = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { seatCount } = req.body;
    const userId = req.user.userId;

    if (!seatCount || typeof seatCount !== "number" || seatCount <= 0) {
      return res
        .status(400)
        .json({ message: "seatCount must be a positive number" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const availableSeats = event.seats.filter((seat) => !seat.isBooked);
    if (availableSeats.length < seatCount) {
      return res.status(400).json({
        message: `Only ${availableSeats.length} seats available`,
        available: availableSeats.map((s) => s.seatNumber),
      });
    }

    const seatsToBook = availableSeats.slice(0, seatCount);
    const assignedSeatNumbers = seatsToBook.map((seat) => {
      const target = event.seats.find((s) => s.seatNumber === seat.seatNumber);
      if (target) {
        target.isBooked = true;
        target.bookedBy = userId;
      }
      return seat.seatNumber;
    });

    await event.save();

    // ✅ Booking object set here
    const booking = new Booking({
      eventId,
      userId,
      seatNumbers: assignedSeatNumbers,
    });

    await booking.save();

    res.status(201).json({
      message: "Seats booked successfully",
      assignedSeats: assignedSeatNumbers,
      bookingId: booking._id,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: error.message || "Error booking seats" });
  }
};

// 🔹 1. Get all bookings for logged-in user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("🔥 Booking Fetch Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// all only User and admin see this

exports.getBookings = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      console.error("Authentication error: User ID not found in token.");
      return res
        .status(401)
        .json({ message: "Authentication failed. User not found." });
    }

    const filter = { userId: req.user.userId };

    const bookings = await Booking.find(filter).populate({
      path: "eventId",
      select: "title date location totalSeats price",
    });

    // User ko response bhej rahe hain
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Bookings lene mein galti ho gayi" });
  }
};

// 🔹 2. Delete a booking (only by owner)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({
      _id: req.params.bookingId,

      userId: req.user.userId,
    });

    if (!booking)
      return res
        .status(404)
        .json({ error: "Booking not found or unauthorized" });

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};

// 🔹 3. Admin updates booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

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
