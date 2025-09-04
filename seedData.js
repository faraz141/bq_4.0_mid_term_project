const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./src/models/userModel");
const Event = require("./src/models/EventSchema");
const Booking = require("./src/models/bookingSchema");
const bcrypt = require("bcrypt");

// MongoDB Connection
const mongoURL =
  process.env.MONGODB_URI || "mongodb://localhost:27017/event-booking-system";
mongoose
  .connect(mongoURL)
  .then(() => console.log("Connected to MongoDB for seeding"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Seed Data
const seedData = async () => {
  try {
    // Clear existing data (optional, comment out to preserve data)
    await User.deleteMany({});
    await Event.deleteMany({});
    await Booking.deleteMany({});

    // Seed Users (10 users with varied roles)
    const users = await User.insertMany([
      {
        name: "Admin One",
        email: "admin1@example.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
        profilePicture: "admin1.jpg",
        createdAt: new Date("2025-08-01"),
      },
      {
        name: "Admin Two",
        email: "admin2@example.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
        profilePicture: "admin2.jpg",
        createdAt: new Date("2025-08-02"),
      },
      {
        name: "User One",
        email: "user1@example.com",
        password: await bcrypt.hash("user123", 10),
        role: "user",
        profilePicture: "user1.jpg",
        createdAt: new Date("2025-08-03"),
      },
      {
        name: "User Two",
        email: "user2@example.com",
        password: await bcrypt.hash("user123", 10),
        role: "user",
        profilePicture: "user2.jpg",
        createdAt: new Date("2025-08-04"),
      },
      {
        name: "User Three",
        email: "user3@example.com",
        password: await bcrypt.hash("user123", 10),
        role: "user",
        profilePicture: "user3.jpg",
        createdAt: new Date("2025-08-05"),
      },
      {
        name: "User Four",
        email: "user4@example.com",
        password: await bcrypt.hash("user123", 10),
        role: "user",
        profilePicture: "user4.jpg",
        createdAt: new Date("2025-08-06"),
      },
      {
        name: "User Five",
        email: "user5@example.com",
        password: await bcrypt.hash("user123", 10),
        role: "user",
        profilePicture: "user5.jpg",
        createdAt: new Date("2025-08-07"),
      },
      {
        name: "User Six",
        email: "user6@example.com",
        password: await bcrypt.hash("user123", 10),
        role: "user",
        profilePicture: "user6.jpg",
        createdAt: new Date("2025-08-08"),
      },
      {
        name: "User Seven",
        email: "user7@example.com",
        password: await bcrypt.hash("user123", 10),
        role: "user",
        profilePicture: "user7.jpg",
        createdAt: new Date("2025-08-09"),
      },
      {
        name: "User Eight",
        email: "user8@example.com",
        password: await bcrypt.hash("user123", 10),
        role: "user",
        profilePicture: "user8.jpg",
        createdAt: new Date("2025-08-10"),
      },
    ]);

    // Seed Events (15 events with varied statuses and locations)
    const events = await Event.insertMany([
      // Upcoming Events
      {
        title: "Concert 2025",
        description: "A music concert",
        date: new Date("2025-09-10"),
        time: "18:00",
        location: "Karachi",
        category: "Music",
        totalSeats: 100,
        availableSeats: 80,
        price: 500,
        banner: "concert1.jpg",
        status: "upcoming",
        createdBy: users[0]._id,
        seats: Event.generateSeats(100).slice(0, 80),
      },
      {
        title: "Rock Fest",
        description: "Rock music festival",
        date: new Date("2025-09-12"),
        time: "19:00",
        location: "Lahore",
        category: "Music",
        totalSeats: 150,
        availableSeats: 120,
        price: 600,
        banner: "rockfest.jpg",
        status: "upcoming",
        createdBy: users[0]._id,
        seats: Event.generateSeats(150).slice(0, 120),
      },
      {
        title: "Tech Summit",
        description: "Technology conference",
        date: new Date("2025-09-15"),
        time: "14:00",
        location: "Islamabad",
        category: "Technology",
        totalSeats: 200,
        availableSeats: 150,
        price: 400,
        banner: "techsummit.jpg",
        status: "upcoming",
        createdBy: users[1]._id,
        seats: Event.generateSeats(200).slice(0, 150),
      },
      {
        title: "Art Expo",
        description: "Art exhibition",
        date: new Date("2025-09-20"),
        time: "10:00",
        location: "Multan",
        category: "Art",
        totalSeats: 50,
        availableSeats: 40,
        price: 300,
        banner: "artexpo.jpg",
        status: "upcoming",
        createdBy: users[0]._id,
        seats: Event.generateSeats(50).slice(0, 40),
      },
      {
        title: "Food Festival",
        description: "Culinary event",
        date: new Date("2025-09-25"),
        time: "12:00",
        location: "Peshawar",
        category: "Food",
        totalSeats: 75,
        availableSeats: 60,
        price: 250,
        banner: "foodfest.jpg",
        status: "upcoming",
        createdBy: users[1]._id,
        seats: Event.generateSeats(75).slice(0, 60),
      },

      // Past Events
      {
        title: "Past Concert",
        description: "A past music event",
        date: new Date("2025-08-20"),
        time: "18:00",
        location: "Karachi",
        category: "Music",
        totalSeats: 100,
        availableSeats: 0,
        price: 500,
        banner: "pastconcert.jpg",
        status: "ended",
        createdBy: users[0]._id,
        seats: Event.generateSeats(100).map((s) => ({
          ...s,
          isBooked: true,
          bookedBy: users[2]._id,
        })),
      },
      {
        title: "Past Tech Talk",
        description: "Past tech discussion",
        date: new Date("2025-08-15"),
        time: "15:00",
        location: "Lahore",
        category: "Technology",
        totalSeats: 80,
        availableSeats: 0,
        price: 350,
        banner: "pasttech.jpg",
        status: "ended",
        createdBy: users[1]._id,
        seats: Event.generateSeats(80).map((s) => ({
          ...s,
          isBooked: true,
          bookedBy: users[3]._id,
        })),
      },
      {
        title: "Past Workshop",
        description: "Past learning session",
        date: new Date("2025-08-10"),
        time: "09:00",
        location: "Islamabad",
        category: "Workshop",
        totalSeats: 60,
        availableSeats: 0,
        price: 200,
        banner: "pastworkshop.jpg",
        status: "ended",
        createdBy: users[0]._id,
        seats: Event.generateSeats(60).map((s) => ({
          ...s,
          isBooked: true,
          bookedBy: users[4]._id,
        })),
      },

      // Fully Booked Upcoming Event
      {
        title: "Sold Out Show",
        description: "A fully booked show",
        date: new Date("2025-09-18"),
        time: "20:00",
        location: "Karachi",
        category: "Theater",
        totalSeats: 50,
        availableSeats: 0,
        price: 700,
        banner: "soldout.jpg",
        status: "upcoming",
        createdBy: users[1]._id,
        seats: Event.generateSeats(50).map((s) => ({
          ...s,
          isBooked: true,
          bookedBy: users[5]._id,
        })),
      },

      // Events with Partial Bookings
      {
        title: "Jazz Night",
        description: "Jazz music evening",
        date: new Date("2025-09-22"),
        time: "17:00",
        location: "Lahore",
        category: "Music",
        totalSeats: 90,
        availableSeats: 60,
        price: 450,
        banner: "jazznight.jpg",
        status: "upcoming",
        createdBy: users[0]._id,
        seats: Event.generateSeats(90)
          .slice(0, 60)
          .concat(
            Event.generateSeats(30).map((s) => ({
              ...s,
              isBooked: true,
              bookedBy: users[6]._id,
            }))
          ),
      },
      {
        title: "Coding Bootcamp",
        description: "Coding training",
        date: new Date("2025-09-28"),
        time: "13:00",
        location: "Islamabad",
        category: "Technology",
        totalSeats: 120,
        availableSeats: 80,
        price: 350,
        banner: "bootcamp.jpg",
        status: "upcoming",
        createdBy: users[1]._id,
        seats: Event.generateSeats(120)
          .slice(0, 80)
          .concat(
            Event.generateSeats(40).map((s) => ({
              ...s,
              isBooked: true,
              bookedBy: users[7]._id,
            }))
          ),
      },
    ]);

    // Seed Bookings (20 bookings with varied statuses)
    await Booking.insertMany([
      // Bookings for Past Events
      {
        eventId: events[5]._id,
        userId: users[2]._id,
        seatNumbers: events[5].seats.slice(0, 10).map((s) => s.seatNumber),
        tickets: 10,
        totalPrice: 5000,
        status: "confirmed",
        bookingDate: new Date("2025-08-19"),
      },
      {
        eventId: events[6]._id,
        userId: users[3]._id,
        seatNumbers: events[6].seats.slice(0, 8).map((s) => s.seatNumber),
        tickets: 8,
        totalPrice: 2800,
        status: "confirmed",
        bookingDate: new Date("2025-08-14"),
      },
      {
        eventId: events[7]._id,
        userId: users[4]._id,
        seatNumbers: events[7].seats.slice(0, 6).map((s) => s.seatNumber),
        tickets: 6,
        totalPrice: 1200,
        status: "confirmed",
        bookingDate: new Date("2025-08-09"),
      },

      // Bookings for Fully Booked Event
      {
        eventId: events[8]._id,
        userId: users[5]._id,
        seatNumbers: events[8].seats.slice(0, 10).map((s) => s.seatNumber),
        tickets: 10,
        totalPrice: 7000,
        status: "confirmed",
        bookingDate: new Date("2025-09-17"),
      },
      {
        eventId: events[8]._id,
        userId: users[6]._id,
        seatNumbers: events[8].seats.slice(10, 20).map((s) => s.seatNumber),
        tickets: 10,
        totalPrice: 7000,
        status: "confirmed",
        bookingDate: new Date("2025-09-17"),
      },
      {
        eventId: events[8]._id,
        userId: users[7]._id,
        seatNumbers: events[8].seats.slice(20, 30).map((s) => s.seatNumber),
        tickets: 10,
        totalPrice: 7000,
        status: "confirmed",
        bookingDate: new Date("2025-09-17"),
      },
      {
        eventId: events[8]._id,
        userId: users[8]._id,
        seatNumbers: events[8].seats.slice(30, 40).map((s) => s.seatNumber),
        tickets: 10,
        totalPrice: 7000,
        status: "confirmed",
        bookingDate: new Date("2025-09-17"),
      },
      {
        eventId: events[8]._id,
        userId: users[9]._id,
        seatNumbers: events[8].seats.slice(40, 50).map((s) => s.seatNumber),
        tickets: 10,
        totalPrice: 7000,
        status: "confirmed",
        bookingDate: new Date("2025-09-17"),
      },

      // Bookings for Upcoming Events with Partial Bookings
      {
        eventId: events[0]._id,
        userId: users[2]._id,
        seatNumbers: events[0].seats.slice(0, 5).map((s) => s.seatNumber),
        tickets: 5,
        totalPrice: 2500,
        status: "confirmed",
        bookingDate: new Date("2025-09-09"),
      },
      {
        eventId: events[1]._id,
        userId: users[3]._id,
        seatNumbers: events[1].seats.slice(0, 7).map((s) => s.seatNumber),
        tickets: 7,
        totalPrice: 4200,
        status: "pending",
        bookingDate: new Date("2025-09-11"),
      },
      {
        eventId: events[2]._id,
        userId: users[4]._id,
        seatNumbers: events[2].seats.slice(0, 10).map((s) => s.seatNumber),
        tickets: 10,
        totalPrice: 4000,
        status: "confirmed",
        bookingDate: new Date("2025-09-14"),
      },
      {
        eventId: events[3]._id,
        userId: users[5]._id,
        seatNumbers: events[3].seats.slice(0, 3).map((s) => s.seatNumber),
        tickets: 3,
        totalPrice: 900,
        status: "canceled",
        bookingDate: new Date("2025-09-19"),
      },
      {
        eventId: events[4]._id,
        userId: users[6]._id,
        seatNumbers: events[4].seats.slice(0, 4).map((s) => s.seatNumber),
        tickets: 4,
        totalPrice: 1000,
        status: "confirmed",
        bookingDate: new Date("2025-09-24"),
      },
      {
        eventId: events[9]._id,
        userId: users[7]._id,
        seatNumbers: events[9].seats.slice(0, 8).map((s) => s.seatNumber),
        tickets: 8,
        totalPrice: 3600,
        status: "pending",
        bookingDate: new Date("2025-09-21"),
      },
      {
        eventId: events[10]._id,
        userId: users[8]._id,
        seatNumbers: events[10].seats.slice(0, 12).map((s) => s.seatNumber),
        tickets: 12,
        totalPrice: 4200,
        status: "confirmed",
        bookingDate: new Date("2025-09-27"),
      },

      // Additional Bookings for Variety
      {
        eventId: events[0]._id,
        userId: users[9]._id,
        seatNumbers: events[0].seats.slice(5, 10).map((s) => s.seatNumber),
        tickets: 5,
        totalPrice: 2500,
        status: "confirmed",
        bookingDate: new Date("2025-09-09"),
      },
      {
        eventId: events[1]._id,
        userId: users[2]._id,
        seatNumbers: events[1].seats.slice(7, 14).map((s) => s.seatNumber),
        tickets: 7,
        totalPrice: 4200,
        status: "canceled",
        bookingDate: new Date("2025-09-11"),
      },
      {
        eventId: events[2]._id,
        userId: users[3]._id,
        seatNumbers: events[2].seats.slice(10, 15).map((s) => s.seatNumber),
        tickets: 5,
        totalPrice: 2000,
        status: "pending",
        bookingDate: new Date("2025-09-14"),
      },
    ]);

    console.log("Seed data inserted successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Seeding error:", error);
    mongoose.connection.close();
  }
};

// Run the seeding
seedData();
