---

# Dr. John's Appointment Portal

Dr. John's Appointment Portal is a full-stack application that allows users to easily create and search for appointment bookings. The system includes a Node.js backend with Firebase Firestore as the database and a Vue.js frontend. This portal is designed to provide an efficient appointment management experience.

![Create Booking Portal Screenshot](#)  
![Search Bookings Portal Screenshot](#)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [REST API Endpoints](#rest-api-endpoints)
- [Usage](#usage)

---

## Features

### Frontend Portals
1. **Create Booking**: Schedule a new appointment based on available time slots.
2. **Search for Bookings**: Search for existing bookings within a specified date range.

### Backend API Functionality
- **Create New Booking**: Allows users to create a booking.
- **View Available Time Slots**: Returns available time slots on a given day.
- **Retrieve Bookings within Date Range**: Returns all bookings scheduled within a specified interval.

## Tech Stack

- **Backend**: Node.js, Express, Firebase Firestore
- **Frontend**: Vue.js

---

## Setup Instructions

### Backend Setup

1. **Navigate to the backend folder**:
   ```bash
   cd backend
   ```

2. **Use Node Version Manager (NVM)**:
   ```bash
   nvm use
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Run the Firebase Emulator**:
   Use the following command to start the Firebase emulator for local testing:
   ```bash
   firebase emulators:start --only functions
   ```

### Frontend Setup

1. **Navigate to the frontend folder**:
   ```bash
   cd frontend-app
   ```

2. **Use Node Version Manager (NVM)**:
   ```bash
   nvm use
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Run the frontend server**:
   ```bash
   npm run serve
   ```
   The frontend will typically be available at `http://localhost:8080`.

---

## Environment Variables

### Backend Environment Variables (`backend/.env`)

The backend requires the following environment variables for configuration. Create a `.env` file in the `backend` folder:

```plaintext
START_TIME=10:00:00
END_TIME=18:00:00
TIMEZONE=America/New_York
DURATION=30
BASE_URL=http://127.0.0.1:5001/time-slot-booker/us-central1/api/events
```

### Frontend Environment Variables (`frontend-app/.env`)

The frontend requires environment variables to connect to the backend API. Place these values in `.env` within the `frontend-app` folder:

```plaintext
BASE_URL=http://127.0.0.1:5001/time-slot-booker/us-central1/api/events
DURATION=30
```

---

## REST API Endpoints

The backend exposes the following REST API endpoints:

1. **Create a New Booking**
   - **Endpoint**: `POST /events`
   - **Payload**: `{ "date": "YYYY-MM-DD", "duration": 30 }`
   - **Description**: Creates a new booking with the specified date and duration.

2. **Get Available Free Slots**
   - **Endpoint**: `GET /events/free-slots`
   - **Parameters**:
     - `dateTime`: (ISO string) The date and time to check for availability.
     - `timezone`: (string) The timezone in which to check the slots.
   - **Description**: Returns all available time slots for the specified date.

3. **Find Bookings within a Date Range**
   - **Endpoint**: `GET /events`
   - **Parameters**:
     - `startDate`: (string) Start date for the range.
     - `endDate`: (string) End date for the range.
   - **Description**: Retrieves all bookings scheduled within the specified date range.

---

## Usage

1. **Create Booking**: Navigate to the "Create Booking" portal to schedule an appointment.
2. **Search Bookings**: Use the "Search Bookings" portal to view appointments within a selected date range.

For development and testing, set up the Firebase emulator and configure both frontend and backend environments as described above.
