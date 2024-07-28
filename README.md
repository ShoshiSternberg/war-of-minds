
# War of Minds

## Overview

"War of Minds" is an interactive and engaging multiplayer game designed to challenge players' strategic thinking and problem-solving skills. The project includes a .NET Core-based server and a React-based client.

## Repository Structure

This repository is organized into two main directories:

- `server`: Contains the .NET Core backend code.
- `client`: Contains the React frontend code.

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- .NET Core SDK
- Node.js and npm

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/war-of-minds.git
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

## Project Structure

### Server

The server is built with .NET Core and follows a clean architecture with distinct layers for entities, interfaces, and repositories. Key components include:

- **Entities**: Define the core data models.
- **Interfaces**: Abstract the data access layer, facilitating easier testing and dependency injection.
- **Repositories**: Implement data access logic, interacting with the database via Entity Framework Core.

### Client

The client is a React application designed to provide an intuitive user interface. It includes components for:

- **User Registration and Login**: Securely register and authenticate users.
- **Profile Management**: Allow users to view and edit their profiles.
- **Game Lobby**: Enable users to create or join game rooms.
- **Gameplay**: Manage real-time interactions during the game using WebSockets.

## Features

- **User Registration and Login**: Secure authentication mechanism.
- **Profile Management**: Users can view and edit their profiles.
- **Game Lobby**: Users can create or join game rooms.
- **Real-time Gameplay**: Interactive gameplay with real-time updates.
- **ELO Rating System**: Implemented to rank players based on their performance.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

Special thanks to all contributors and resources that made this project possible.
