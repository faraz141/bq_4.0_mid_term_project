// utils/aggregationPipeline.js
const Booking = require("../models/bookingSchema");

exports.getPopularEvents = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$eventId",
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { totalBookings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $project: {
          _id: 0,
          event: "$event",
          totalBookings: 1,
        },
      },
    ];

    const results = await Booking.aggregate(pipeline);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching popular events" });
  }
};

exports.getRevenue = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$eventId",
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { totalRevenue: -1 } },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $project: {
          _id: 0,
          event: "$event",
          totalRevenue: 1,
        },
      },
    ];

    const results = await Booking.aggregate(pipeline);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching revenue" });
  }
};

exports.getTopUsers = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$userId",
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { totalBookings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          user: { name: "$user.name", email: "$user.email" },
          totalBookings: 1,
        },
      },
    ];

    const results = await Booking.aggregate(pipeline);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching top users" });
  }
};
