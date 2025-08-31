const Event = require('../models/EventSchema');
const upload = require('../middleware/fileupload'); // Multer middleware

// 🔹 Create Event (Admin only)
exports.createEvent = [
  upload.single('banner'),
  async (req, res) => {
    try {
      const { title, description, date, time, location, totalSeats, price, status } = req.body;
      const banner = req.file ? req.file.path : '';

      const seats = Event.generateSeats(parseInt(totalSeats));

      const newEvent = new Event({
        title,
        description,
        date,
        time,
        location,
        totalSeats,
        price,
        banner,
        status,
        seats
      });

      await newEvent.save();
      res.status(201).json({ message: "Event created", event: newEvent });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating event" });
    }
  }
];

// 🔹 Get All Events (Public)
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching events" });
  }
};

// 🔹 Get Single Event
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching event" });
  }
};

// 🔹 Update Event (Admin only)
exports.updateEvent = [
  upload.single('banner'),
  async (req, res) => {
    try {
      const { title, description, date, time, location, totalSeats, price, status } = req.body;
      const banner = req.file ? req.file.path : '';

      const updateData = {
        title,
        description,
        date,
        time,
        location,
        totalSeats,
        price,
        status
      };

      if (banner) updateData.banner = banner;
      if (totalSeats) updateData.seats = Event.generateSeats(parseInt(totalSeats));

      const event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!event) return res.status(404).json({ message: "Event not found" });

      res.status(200).json({ message: "Event updated", event });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating event" });
    }
  }
];

// 🔹 Delete Event (Admin only)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting event" });
  }
};

// 🔹 Book Random Seat (User)
// exports.bookSeat = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) return res.status(404).json({ message: "Event not found" });

//     const availableSeat = event.seats.find(seat => !seat.isBooked);
//     if (!availableSeat) return res.status(400).json({ message: "No seats available" });

//     availableSeat.isBooked = true;
//     await event.save();

//     res.status(200).json({ message: "Seat booked", seatNumber: availableSeat.seatNumber });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error booking seat" });
//   }
// };

exports.getAvailableSeats = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  const available = event.seats.filter(seat => !seat.isBooked);
  res.status(200).json(available);
};
