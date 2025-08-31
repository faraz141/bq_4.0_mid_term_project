const cron = require("node-cron");
const Event = require("../models/EventSchema");
const Booking = require("../models/bookingSchema");

const deleteOldEvents = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const oldEvents = await Event.find({ date: { $lt: sevenDaysAgo } });

    if (oldEvents.length === 0) {
      console.log("old Events not avaiable");
      return;
    }

    const oldEventIds = oldEvents.map((event) => event._id);

    const bookingsResult = await Booking.deleteMany({
      eventId: { $in: oldEventIds },
    });
    console.log(
      `Successfully deleted ${bookingsResult.deletedCount} old bookings.`
    );

    const eventsResult = await Event.deleteMany({ _id: { $in: oldEventIds } });
    console.log(
      `Successfully deleted ${eventsResult.deletedCount} old events.`
    );
  } catch (error) {
    console.error("this Error is ", error);
  }
};

exports.startCronJob = () => {
  cron.schedule("0 0 * * *", deleteOldEvents, {
    scheduled: true,
    timezone: "Asia/Karachi", // Apne timezone ke mutabiq badlein
  });
  console.log(
    "cron job deleted all events and bookings older than 7 days at midnight every day"
  );
};
