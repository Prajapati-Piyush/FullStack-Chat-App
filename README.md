# Realtime Chat App

A realtime chat application built with Node.js, Express, and WebSocket (Socket.io) for real-time messaging. This app allows users to join chat rooms and send messages instantly to other users connected to the same room.

---

## Features

- **Realtime Messaging**: Users can send and receive messages instantly using WebSockets (Socket.io).
- **Chat Rooms**: Users can join and leave specific chat rooms.
- **User Authentication**: Basic authentication for user login.
- **Message History**: Messages are displayed in the order they were sent, with no permanent storage (can be extended to save messages to a database).
- **Responsive Design**: The app is designed to work well on both desktop and mobile devices.

---

## Tech Stack

- **Frontend**: 
  - HTML, CSS, JavaScript
  - React (if you’re using a frontend framework like React)
  - Socket.io-client for WebSocket communication

- **Backend**:
  - Node.js
  - Express.js
  - Socket.io for real-time communication
  - dotenv for environment variable management

- **Database** (Optional):
  - MongoDB (can be used for storing messages, users, etc.)

---

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js (>= 14.x)
- npm (>= 6.x)

---

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/realtime-chat-app.git
   cd realtime-chat-app
