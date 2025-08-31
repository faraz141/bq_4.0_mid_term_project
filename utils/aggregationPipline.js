const mongoose = require("mongoose");
const Booking = require("../models/bookingSchema");

exports.searchTopBookedEvents = async (req, res) => {
  try {
    const { search, location, minPrice, maxPrice, date, time } = req.query;

    const pipeline = [
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },

      {
        $match: {
          ...(search && {
            "event.title": { $regex: search, $options: "i" },
          }),
          ...(location && {
            "event.location": { $regex: location, $options: "i" },
          }),
          ...(minPrice &&
            maxPrice && {
              "event.price": { $gte: Number(minPrice), $lte: Number(maxPrice) },
            }),

          ...(date && {
            "event.date": {
              $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
              $lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
            },
          }),
          ...(time && {
            "event.time": { $regex: time, $options: "i" },
          }),
        },
      },

      {
        $group: {
          _id: "$event._id",
          title: { $first: "$event.title" },
          location: { $first: "$event.location" },
          price: { $first: "$event.price" },
          date: { $first: "$event.date" },
          time: { $first: "$event.time" },
          totalBookings: { $sum: 1 },
        },
      },

      {
        $sort: { totalBookings: -1 },
      },

      {
        $limit: 10,
      },
    ];

    const results = await Booking.aggregate(pipeline);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("Aggregation error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
