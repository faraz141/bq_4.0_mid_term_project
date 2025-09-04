// utils/cronJobs.js
const cron = require("node-cron");
const Event = require("../models/EventSchema");

const updateExpiredEvents = async () => {
  try {
    const now = new Date();
    await Event.updateMany(
      { date: { $lt: now }, status: { $ne: "ended" } },
      { status: "ended" }
    );
    console.log("Updated expired events to 'ended'");
  } catch (error) {
    console.error("Cron error:", error);
  }
};

exports.startCronJob = () => {
  cron.schedule("0 0 * * *", updateExpiredEvents, {
    scheduled: true,
    timezone: "Asia/Karachi",
  });
  console.log("Cron job started to update expired events at midnight");
};
