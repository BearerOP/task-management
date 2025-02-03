# Task Management Application

This is a user-specific Task Management application built with Next.js, using Server Actions and MongoDB for data persistence.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Basic task details (title, description, due date)
- Data persistence using MongoDB
- Error handling and loading states
- User-specific tasks

## Tech Stack

- **Frontend:** Next.js (App Router)
- **Backend:** Next.js Server Actions
- **Database:** MongoDB
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Authentication:** JWT

## Setup Instructions

### Prerequisites
- Node.js (Latest LTS version recommended)
- MongoDB (Local or Cloud instance)
- A `.env` file with required environment variables (see below)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/BearerOP/task-management.git
   cd task-management-app
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. Run the development server:
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint             | Description                |
|--------|----------------------|----------------------------|
| POST   | `/api/register`      | Register a new user        |
| POST   | `/api/login`         | Authenticate user          |
| GET    | `/api/tasks`         | Get all tasks for a user   |
| POST   | `/api/tasks`         | Create a new task          |
| PUT    | `/api/tasks/:id`     | Update a task              |
| DELETE | `/api/tasks/:id`     | Delete a task              |

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before making any changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

