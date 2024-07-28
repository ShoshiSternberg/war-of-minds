
# War of Minds

## Overview

"War of Minds" is an interactive and engaging multiplayer game designed to challenge players' strategic thinking and problem-solving skills. The project includes a .NET Core-based server, a React-based client, and an SQL Server database. The game features an ELO rating system to rank players based on their performance.

## Repository Structure

This repository is organized into two main directories:

- `server`: Contains the .NET Core backend code.
- `client`: Contains the React frontend code.

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- .NET Core SDK
- Node.js and npm
- SQL Server

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ShoshiSternberg/war-of-minds.git
   cd war-of-minds
   ```

2. **Install server dependencies:**

   ```bash
   cd server
   dotnet restore
   ```

3. **Install client dependencies:**

   ```bash
   cd ../client
   npm install
   ```

4. **Setup SQL Server Database:**

   - Ensure SQL Server is installed and running.
   - Create a new database named `WarOfMinds`.
   - Update the connection string in the `appsettings.json` file in the `server` directory to point to your SQL Server instance.

   Example connection string:

   ```json
   "ConnectionStrings": {
       "DefaultConnection": "Server=your_server_name;Database=WarOfMinds;User Id=your_user_id;Password=your_password;"
   }
   ```

### Running the Application

1. **Start the server:**

   ```bash
   cd server
   dotnet run
   ```

2. **Start the client:**

   ```bash
   cd ../client
   npm start
   ```

   The client will typically be available at `http://localhost:3000`.

### Database Migrations

If you need to apply database migrations, you can use the following commands in the `server` directory:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## Project Structure

### Server

The server is built with .NET Core and follows a clean architecture with distinct layers for entities, interfaces, and repositories. Key components include:

- **context**: Define the core data definitions.
- **Repositories**: Implement data access logic, interacting with the database via Entity Framework Core.
- **Common [DTOs (Data Transfer Objects)]**: Used for data exchange between the server and client.
- **Services**: Contain the business logic, including the elo rating calculator.
- **WebApi**: Handle HTTP requests and responses by the controllers, including the game logic in the signalR directory.

### Client

The client is a React application designed to provide an intuitive user interface. It includes components for:

- **User Registration and Login**: Securely register and authenticate users.
- **Profile Management**: Allow users to view and edit their profiles.
- **Game Lobby**: Enable users to create or join game rooms.
- **Gameplay**: Manage real-time interactions during the game using WebSockets.

### ELO Rating System

The ELO rating system is implemented to rank players based on their performance in games. Players earn or lose points based on the outcome of matches against other players, with adjustments made according to the relative skill levels of the opponents.

## Features

- **User Registration and Login**: Secure authentication mechanism.
- **Profile Management**: Users can view and edit their profiles.
- **Game Lobby**: Users can create or join game rooms.
- **Real-time Gameplay**: Interactive gameplay with real-time updates.
- **ELO Rating System**: Implemented to rank players based on their performance.
- **SQL Server Integration**: The application uses SQL Server to manage and store game and user data.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgements

Special thanks to all contributors and resources that made this project possible.
