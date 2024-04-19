# SIO Project - Candidate no. 02342392008

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js installed (v14.x or later recommended)
- npm (Node Package Manager)
- MySQL server running on your local machine or remotely

## Installation

To install Projetsio, follow these steps:

1. Clone the repository: `git clone https://github.com/Ielfsciene/sioproject`
2. Navigate to the project directory
3. Install the necessary dependencies: `npm install`

## Configuration

The `.env` file is exceptionally pre-included to facilitate your installation. This would not normally be the case. If you want to perform a manual setup of the .env file, it will follow this template:
```
PORT="3000"
JWT_KEY="Any sufficiently encryption key"
RECAPTCHA_SECRET_KEY="Secret key for your reCAPTCHA v3 application"
CLIENT_PASS="Your lower-privileged MySQL user password here"
SERVER_PASS="Your higher-privileged MySQL user password here"
```
You will need to set up a reCAPTCHA v3 application [here](https://www.google.com/recaptcha/admin/create)
Make sure to set up both the public reCAPTCHA key on the `signup` and `login` page as well as the secret key in the `.env` file.

## Setting up the database

You will need to set up a MySQL server with two users (client and server) with the following permissions:
- Client (SELECT)
- Server (SELECT, UPDATE, INSERT, EXECUTE)

You can run the sql dump file on a MySQL database to set up the entire schema and dataset at once.

## Running the application

To run the application, use the following command: `npm start`
This will deploy the application.

You can then navigate to the frontend of the application [here](http://localhost:3000/home)
