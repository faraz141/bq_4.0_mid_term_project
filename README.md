🎟 Event Management System

A full-stack event management system built with Node.js, Express, and MongoDB that allows users to book event tickets with real-time seat selection and admins to manage events.

🚀 Features

✅ Authentication & Authorization

JWT-based Signup/Login.

Role-based access control (Admin & User).

✅ Event Management

Full CRUD operations for events (Admin only).

Event details: title, description, start time, end time, location, price, category, banner.

Public event listing.

Advanced filters (date, location, price range, category).

✅ Booking System

Book tickets with seat selection.

Seat availability validation.

Store booking details with user reference.

✅ File Uploads

Profile picture upload for users.

Event banner upload for admins (Multer).

✅ Analytics & Reports

Most popular events by bookings.

Total revenue per event.

Top 5 users by number of bookings.

✅ Cron Jobs

Auto-remove or mark expired events as inactive every midnight.

✅ Seat Management

Seats stored in event schema with booking status.

Prevents double booking with real-time validation.
