# Raise Hub

You can view the Website here <a href = "https://raise-hub.onrender.com/"> Click Here</a>

Raise Hub is a platform designed to facilitate funding for foundations and charitable causes. Users can sign up, log in, add money to their wallets, and donate to various foundations. Administrators can manage foundation requests, approving or rejecting them as needed.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Routes](#routes)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

## Features

- User authentication (Sign Up, Sign In, Sign Out)
- User wallet management (Add money, Donate)
- Foundation requests and approval by admin
- Transaction history for users
- Admin dashboard to manage foundation requests

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- EJS (Embedded JavaScript templates)
- bcrypt (for password hashing)
- dotenv (for environment variables)
- express-session (for session management)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Raise-hub.git
   cd Raise-hub
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```plaintext
   MONGODB_USERNAME=your_mongodb_username
   MONGODB_PASSWORD=your_mongodb_password
   SESSION_KEY=your_session_key
   ```

4. Start the server:
   ```bash
   node server.js
   ```

5. Open your browser and navigate to `http://localhost:5000`.

## Usage

- Visit the homepage and sign up or log in.
- Admins can log in using a special admin account (`number: 1111`, `password: 1111`).
- Users can view and donate to approved foundations after logging in.
- Admins can manage foundation requests through the admin dashboard.

## Routes

### User Routes

- `GET /`: Load the login/sign-up page.
- `GET /signout`: Sign out the current user.
- `GET /signin`: Load the sign-in page.
- `GET /signup`: Load the sign-up page.
- `POST /login`: Log in a user.
- `POST /signup`: Sign up a new user.
- `GET /success`: Load the user dashboard.
- `POST /donate`: Donate to a foundation.
- `POST /addMoney`: Add money to the user's wallet.

### Foundation Routes

- `GET /foundationRequest`: Load the foundation request form.
- `POST /foundationRequest`: Submit a new foundation request.

### Admin Routes

- `GET /admin`: Load the admin dashboard.
- `POST /admin/approveFoundation`: Approve a foundation request.
- `POST /admin/rejectFoundation`: Reject a foundation request.

## Environment Variables

- `MONGODB_USERNAME`: MongoDB username for database connection.
- `MONGODB_PASSWORD`: MongoDB password for database connection.
- `SESSION_KEY`: Secret key for session management.

## Contributors
<ul>
         <li><a href="https://github.com/VenkatreddyPadala">Venkat Reddy Padala</a></li>
         <li><a href="https://github.com/pranayreddyambati">Pranay Reddy Ambati</a></li>
         <li><a href="https://github.com/ordr-github">Deepak Reddy Obulareddy</a></li>
         <li><a href="https://github.com/revanth0514">Revanth Chowdary Garapati</a></li>
         <li><a href="https://github.com/print-keer">Keerthi Manoja</a></li>
         <li><a href="https://github.com/Sravanthikurumoju">Sravanthi Vani</a></li>
      </ul>


