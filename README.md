# RoomNest Server

RoomNest is a web application that allows users to manage property listings, including creating, updating, and saving properties. It provides user authentication and profile management features.

## Features

- User registration and login
- Profile management
- Property listing creation and management
- Save properties for later viewing
- JWT-based authentication
- Image uploads using Cloudinary
- MongoDB for data storage

## Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose)
- Cloudinary for image uploads
- JSON Web Tokens (JWT) for authentication

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd roomnest-server
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your environment variables:
   ```
   DATABASE_URL=<your-mongodb-connection-string>
   CLOUDINARY_URL=<your-cloudinary-url>
   JWT_SECRET=<your-jwt-secret>
   ```

## Usage

1. Start the server:
   ```
   npm start
   ```

2. The application will be running on `http://localhost:3000`.

## API Endpoints

### User Routes

- `POST /api/v1/user/register` - Register a new user
- `POST /api/v1/user/login` - Log in an existing user
- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update user profile

### Listing Routes

- `POST /api/v1/listing/create` - Create a new property listing
- `GET /api/v1/listing` - Fetch all active listings
- `GET /api/v1/listing/:id` - Get a listing by ID
- `PUT /api/v1/listing/:id` - Update a listing
- `DELETE /api/v1/listing/:id` - Delete a listing

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.