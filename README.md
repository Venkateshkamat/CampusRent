# CampusRent

CampusRent is a platform designed to facilitate renting and lending of campus-related items (e.g., textbooks, electronics, dorm essentials) among students. This repository contains the full-stack source code, with the backend hosted on **Google App Engine** and the frontend deployed on **GitLab Pages**.

**Live Demo:** [https://campusrent-front-9a4add.gitlab.io](https://campusrent-front-9a4add.gitlab.io)

---

## Features

- User authentication (login/signup)
- Post rental listings with images, descriptions, and pricing
- Search and filter items by category, price, or location
- Real-time chat between borrowers and lenders
- Manage rentals (create, update, delete listings)
- Responsive design for mobile and desktop

---

## Technologies Used

### Frontend
- **React**: JavaScript library for building dynamic user interfaces.
- **React Router**: Handles client-side routing and navigation.
- **Axios**: Promise-based HTTP client for API communication.
- **Bootstrap/Material-UI**: Responsive styling and UI components.
- **GitLab Pages**: Static frontend hosting with CI/CD pipelines.

### Backend
- **Node.js**: JavaScript runtime for server-side logic.
- **Express.js**: Framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing user data, listings, and transactions.
- **Mongoose**: ODM (Object Data Modeling) for MongoDB.
- **Google App Engine**: Scalable cloud hosting for the backend API.
- **JWT**: JSON Web Tokens for secure user authentication.

### Additional Tools
- **Git**: Version control and collaboration.
- **Postman**: API testing and documentation.
- **ESLint/Prettier**: Code quality and formatting.

---

## Deployment Details

### Backend (Google App Engine)
- The Node.js/Express API is deployed on Google App Engine for automatic scaling and managed infrastructure.
- Environment variables (e.g., MongoDB URI, JWT secret) are configured via `app.yaml`.
- **API Base URL**: `https://[YOUR_APP_ENGINE_PROJECT_ID].uc.r.appspot.com`

### Frontend (GitLab Pages)
- The React frontend is built and deployed using GitLab CI/CD pipelines.
- Static files are served from GitLab Pages for fast, global access.
- Configured with environment variables for API endpoints.

---

## Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Venkateshkamat/CampusRent.git
   cd CampusRent/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your environment variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3001
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the API endpoint in `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:3001
   ```
4. Run the development server:
   ```bash
   npm start
   ```

---

## Contributing

Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/new-feature`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature/new-feature`.
5. Submit a pull request.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

**CampusRent** · [Frontend Demo](https://campusrent-front-9a4add.gitlab.io) · [GitHub Repository](https://github.com/Venkateshkamat/CampusRent)


