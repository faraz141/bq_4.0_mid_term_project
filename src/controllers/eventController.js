// controllers/eventController.js
const Event = require("../models/EventSchema");
const upload = require("../middlewares/fileUpload");
const Joi = require("joi");

const createEventSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  date: Joi.date().required(),
  time: Joi.string().required(),
  location: Joi.string().required(),
  category: Joi.string().required(),
  totalSeats: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0).required(),
  status: Joi.string().valid("upcoming", "active", "ended").optional(),
});

const updateEventSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  date: Joi.date().optional(),
  time: Joi.string().optional(),
  location: Joi.string().optional(),
  category: Joi.string().optional(),
  totalSeats: Joi.number().integer().min(1).optional(),
  price: Joi.number().min(0).optional(),
  status: Joi.string().valid("upcoming", "active", "ended").optional(),
});

// Create Event (Admin only)
exports.createEvent = [
  upload.single("banner"),
  async (req, res) => {
    const { error } = createEventSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    try {
      const {
        title,
        description,
        date,
        time,
        location,
        category,
        totalSeats,
        price,
        status,
      } = req.body;
      const banner = req.file ? req.file.path : "";

      const seats = Event.generateSeats(parseInt(totalSeats));
      const availableSeats = parseInt(totalSeats);

      const newEvent = new Event({
        title,
        description,
        date,
        time,
        location,
        category,
        totalSeats,
        availableSeats,
        price,
        banner,
        status,
        createdBy: req.user.userId,
        seats,
      });

      await newEvent.save();
      res.status(201).json({ message: "Event created", event: newEvent });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating event" });
    }
  },
];

// Get All Events (Public with filters)
exports.getEvents = async (req, res) => {
  try {
    const { date, location, minPrice, maxPrice, category } = req.query;
    const filter = {};

    if (date) filter.date = new Date(date);
    if (location) filter.location = { $regex: location, $options: "i" };
    if (category) filter.category = { $regex: category, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const events = await Event.find(filter);
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching events" });
  }
};

// Get Single Event
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

// Update Event (Admin only)
exports.updateEvent = [
  upload.single("banner"),
  async (req, res) => {
    const { error } = updateEventSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    try {
      const {
        title,
        description,
        date,
        time,
        location,
        category,
        totalSeats,
        price,
        status,
      } = req.body;
      const banner = req.file ? req.file.path : undefined;

      const updateData = {
        title,
        description,
        date,
        time,
        location,
        category,
        price,
        status,
      };

      if (banner !== undefined) updateData.banner = banner;
      if (totalSeats) {
        updateData.totalSeats = parseInt(totalSeats);
        updateData.seats = Event.generateSeats(updateData.totalSeats);
        updateData.availableSeats = updateData.totalSeats;
      }

      const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });
      if (!event) return res.status(404).json({ message: "Event not found" });

      res.status(200).json({ message: "Event updated", event });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating event" });
    }
  },
];

// Delete Event (Admin only)
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

exports.getAvailableSeats = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const available = event.seats.filter((seat) => !seat.isBooked);
    res.status(200).json(available);
  } catch (error) {
    res.status(500).json({ message: "Error fetching available seats" });
  }
};
