# Boilerplate Express.js with TypeScript

This is a robust boilerplate for building RESTful APIs using Express.js, TypeScript, and Prisma ORM. It provides a solid foundation with pre-configured authentication, validation, file handling, and a clear project structure, allowing developers to quickly bootstrap their backend projects.

## Features

-   **TypeScript:** Strongly typed codebase for better maintainability and fewer runtime errors.
-   **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
-   **Prisma ORM:** Modern database toolkit for Node.js and TypeScript, providing type-safe database access.
-   **JWT Authentication:** Secure user authentication using JSON Web Tokens.
-   **Joi Validation:** Schema-based data validation for incoming requests.
-   **Bcrypt:** Password hashing for secure storage.
-   **Multer:** Middleware for handling `multipart/form-data`, primarily used for uploading files.
-   **Socket.IO:** Real-time bidirectional event-based communication.
-   **Modular Project Structure:** Organized into `config`, `core`, `exceptions`, `helpers`, and `middlewares` for clear separation of concerns.
-   **Error Handling:** Centralized error handling for consistent API responses.
-   **Code Generation:** A simple script to generate new module structures (controller, service, router, validator).

## Technologies Used

-   Node.js
-   Express.js
-   TypeScript
-   Prisma ORM
-   PostgreSQL (or any other database supported by Prisma)
-   Joi
-   jsonwebtoken
-   bcrypt
-   multer
-   socket.io

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

-   Node.js (v18 or higher)
-   npm or Yarn
-   PostgreSQL (or Docker for easy setup)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Razdan12/Boilerplate.git
    cd Boilerplate
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory based on `.env.example` (if available, otherwise create one with the following structure):

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/database_name?schema=public"
    JWT_SECRET="your_jwt_secret_key"
    JWT_REFRESH_SECRET="your_jwt_refresh_secret_key"
    PORT=3000
    ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
    ```
    *Replace `user`, `password`, `localhost:5432`, `database_name`, `your_jwt_secret_key`, and `your_jwt_refresh_secret_key` with your actual database credentials and secret keys.*

4.  **Database Setup (Prisma):
    **Ensure your PostgreSQL database is running.**

    Run Prisma migrations to create the database schema:
    ```bash
    npx prisma migrate dev --name init
    ```

### Running the Project

-   **Development Mode (with hot-reloading):**
    ```bash
    npm run dev
    ```

-   **Build and Start (Production Mode):**
    First, build the TypeScript code:
    ```bash
    npm run build
    ```
    Then, start the compiled JavaScript application:
    ```bash
    npm run start
    ```

    The API server will run on the port specified in your `.env` file (default: `3000`).

## Project Structure

```
Boilerplate/
├───.git/
├───node_modules/
├───prisma/
│   └───schema.prisma             # Prisma schema definition
├───secrets/
│   ├───private.pem               # Private key for JWT (generate your own)
│   └───public.pem                # Public key for JWT (generate your own)
├───src/
│   ├───index.ts                  # Main application entry point
│   ├───routes.ts                 # Centralized API route definitions
│   ├───base/
│   │   ├───controller.base.ts    # Base controller with common methods
│   │   ├───service.base.ts       # Base service with common database operations
│   │   └───validator.base.ts     # Base Joi validator configurations
│   ├───config/
│   │   ├───constant.ts           # Application-wide constants
│   │   ├───multer.ts             # Multer configuration for file uploads
│   │   └───prisma.db.ts          # Prisma client instance
│   ├───core/
│   │   └───user/                 # Example user module (empty by default)
│   ├───exceptions/
│   │   ├───catch.exception.ts    # Custom exception handling utilities
│   │   ├───errors.exception.ts   # Custom error classes
│   │   └───handler.exception.ts  # Global error handler middleware
│   ├───helpers/
│   │   ├───bcrypt.helper.ts      # Utility for password hashing
│   │   ├───file.helper.ts        # File system utilities
│   │   ├───image.helper.ts       # Image related utilities
│   │   ├───jwt.helper.ts         # JWT token generation and verification
│   │   ├───money.helper.ts       # Money formatting utilities
│   │   ├───phoneNumber.ts        # Phone number formatting utilities
│   │   ├───response.helper.ts    # Standardized API response helpers
│   │   └───time.helper.ts        # Time and date utilities
│   ├───middlewares/
│   │   ├───auth.middleware.ts    # JWT authentication middleware
│   │   ├───multer.middleware.ts  # Multer middleware for file uploads
│   │   ├───upload.middleware.ts  # File upload handling logic
│   │   ├───validator.middleware.ts # Joi validation middleware
│   │   └───whatsappAuth.midleware.ts # WhatsApp authentication middleware (example)
│   ├───socket/
│   │   └───index.ts              # Socket.IO configuration and utilities
│   └───utils/
│       └───type.ts               # Common utility types
├───uploads/                      # Directory for uploaded files
├───.gitignore
├───.prettierrc
├───nodemon.json
├───package-lock.json
├───package.json
├───tsconfig.json
└───README.md                     # Project README file
```

## Code Generation

This boilerplate includes a simple code generator to scaffold new modules (controller, service, router, validator) quickly.

To use it, run:

```bash
node generator/core.ts --name <ModuleName> --model-name <PrismaModelName>
```

-   Replace `<ModuleName>` with the desired name for your module (e.g., `Product`, `Order`). This will be used for folder and file naming.
-   Replace `<PrismaModelName>` with the exact name of your Prisma model (e.g., `Product`, `Order`). This is used by the service layer to interact with the database.

Example:

```bash
node generator/core.ts --name Product --model-name Product
```

This will create a `product` folder under `src/core` with `product.controller.ts`, `product.router.ts`, `product.service.ts`, and `product.validator.ts` files, pre-filled with basic CRUD operations and imports.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the ISC License - see the `LICENSE` file for details. (Note: A `LICENSE` file is not included in this boilerplate. You should add one if you plan to open-source your project.)
