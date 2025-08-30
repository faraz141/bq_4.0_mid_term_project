const Event = require('../models/Event');

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      venue,
      price,
      totalSeats,
      category,
      tags
    } = req.body;

    // Create event
    const seats = Array.from({ length: Number(totalSeats) }, (_, idx) => ({
      number: String(idx + 1),
      isBooked: false,
      bookedAt: null
    }));

    const event = await Event.create({
      title,
      description,
      date,
      venue,
      price,
      totalSeats,
      seats,
      availableSeats: totalSeats,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      createdBy: req.user.id,
      bannerImage: req.file ? req.file.path.replace(/\\/g, '/') : null
    });

    res.status(201).json({
      status: 'success',
      message: 'Event created successfully',
      data: {
        event
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { category, status, search, sortBy = 'date', sortOrder = 'asc' } = req.query;
    const { date: dateStr, location, minPrice, maxPrice } = req.query;

    // Build filter object
    const filter = { status: 'active' };
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } }
      ];
    }

    // Date filter (exact day)
    if (dateStr) {
      const start = new Date(dateStr);
      const end = new Date(dateStr);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    // Location filter uses venue field
    if (location) {
      filter.venue = { $regex: location, $options: 'i' };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const events = await Event.find(filter)
      .populate('createdBy', 'name email')
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const total = await Event.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        events,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalEvents: total,
          eventsPerPage: limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        event
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      venue,
      price,
      totalSeats,
      category,
      tags,
      status
    } = req.body;

    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (date) updateFields.date = date;
    if (venue) updateFields.venue = venue;
    if (price) updateFields.price = price;
    if (totalSeats) updateFields.totalSeats = totalSeats;
    if (category) updateFields.category = category;
    if (tags) updateFields.tags = tags.split(',').map(tag => tag.trim());
    if (status) updateFields.status = status;

    // Update banner image if uploaded
    if (req.file) {
      updateFields.bannerImage = req.file.path.replace(/\\/g, '/');
    }

    // Recalculate available seats and adjust seat map if total seats changed
    if (totalSeats) {
      const currentEvent = await Event.findById(req.params.id);
      const bookedCount = currentEvent.seats.filter(s => s.isBooked).length;

      if (totalSeats < bookedCount) {
        return res.status(400).json({
          status: 'error',
          message: `Cannot reduce totalSeats below booked seats (${bookedCount})`
        });
      }

      updateFields.availableSeats = totalSeats - bookedCount;

      if (totalSeats > currentEvent.totalSeats) {
        const toAdd = totalSeats - currentEvent.totalSeats;
        const maxNum = currentEvent.seats.reduce((m, s) => Math.max(m, parseInt(s.number, 10) || 0), 0);
        const newSeats = Array.from({ length: toAdd }, (_, i) => ({
          number: String(maxNum + i + 1),
          isBooked: false,
          bookedAt: null
        }));
        updateFields.seats = currentEvent.seats.concat(newSeats);
      } else if (totalSeats < currentEvent.totalSeats) {
        // Remove only extra unbooked seats from the end by number
        const sorted = [...currentEvent.seats].sort((a, b) => (parseInt(a.number, 10) || 0) - (parseInt(b.number, 10) || 0));
        const targetLength = totalSeats;
        let trimmed = [];
        for (let i = 0; i < sorted.length; i++) {
          if (trimmed.length < targetLength) {
            trimmed.push(sorted[i]);
          } else if (sorted[i].isBooked) {
            // Should not happen due to earlier check, but guard anyway
            trimmed.push(sorted[i]);
          }
        }
        // Fallback if any mismatch, rebuild by keeping first N seats
        trimmed = sorted.slice(0, targetLength);
        updateFields.seats = trimmed;
      }
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updateFields,
      {
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Event updated successfully',
      data: {
        event
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get events by category
// @route   GET /api/events/category/:category
// @access  Public
const getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const events = await Event.find({ 
      category, 
      status: 'active' 
    })
      .populate('createdBy', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ date: 1 });

    const total = await Event.countDocuments({ category, status: 'active' });

    res.status(200).json({
      status: 'success',
      data: {
        events,
        category,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalEvents: total,
          eventsPerPage: limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getEventsByCategory
};
