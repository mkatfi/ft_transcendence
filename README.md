<img width="100%" alt="Hello World" src="https://github.com/orcaprog/orca-ft_transcendence/blob/main/carbon%20(4).png">
# ft_transcendence Project

## Project Overview
The **ft_transcendence** project involves developing a fully functional real-time Pong contest website with advanced gameplay features while adhering to strict security and development standards. The project challenges developers to create a single-page application (SPA) with both basic and advanced functionalities, allowing players to compete in live Pong games and tournaments.

---

## Core Requirements

### Minimal Technical Requirements

#### Frontend:
- Must use pure **vanilla JavaScript** unless overridden by a specific module.
- Should be a **single-page application (SPA)** with browser Back/Forward button support.
- Must function seamlessly on the latest version of **Google Chrome**.

#### Backend (Optional):
- If implemented, must be written using the **Django framework**.
- Should adhere to database constraints if a database is used.

#### Game Features:
- Enable **live Pong games** with two players using the same keyboard.
- Include a **tournament system** with player matchmaking and alias registration.

#### Security:
- Passwords must be securely **hashed**.
- Protect against **SQL injection** and **XSS attacks**.
- Use **HTTPS** (and **WSS** for WebSocket connections).
- Validate all forms and user inputs.

#### Containerization:
- The project must run in an autonomous **Docker container** with a single command (`docker-compose up --build`).

#### Error Handling:
- The website should have **no unhandled errors or warnings** during use.

---

## Modules for Additional Features

### Web Development:
- Backend framework: **Django**.
- Frontend: **Pure vanilla JavaScript** with **Bootstrap** for styling.

### Gameplay Enhancements:
- Support for **remote players**.
- Provide **game history** and **matchmaking**.

### User Management:
- Standard user authentication.
- Tournament management.
- **Remote authentication** and **JWT-based access**.

### DevOps:
- Implement a **microservices architecture** for the backend.

### Accessibility & Compatibility:
- Support for **multiple devices and browsers**.
- Provide accessibility options for **visually impaired users**.

---

## Local Setup Instructions

### 1. Clone the Repository
Open your terminal and run:
```bash
git clone https://github.com/orcaprog/orca-ft_transcendence
```

### 2. Navigate to the Project Directory
```bash
cd ft_transcendence
```

### 3. Ensure Dependencies Are Installed
Make sure the following dependencies are installed on your system:

#### Required Tools:
- **Make**: Used to automate build tasks.
- **Docker**: A containerization platform to run your application.
- **Docker Compose**: A tool to define and run multi-container Docker applications.

#### Check Dependencies:
- Verify **Make**:
  ```bash
  make --version
  ```
- Verify **Docker**:
  ```bash
  docker --version
  ```
- Verify **Docker Compose**:
  ```bash
  docker-compose --version
  ```

If any dependency is missing, install it before proceeding.

### 4. Start the Project
Run the following command:
```bash
make
```
This will:
- Build the Docker containers for the project.
- Start the application and its associated services (e.g., backend, database, etc.).

### 5. Access the Application
Once the containers are running, open your browser and navigate to:
```
https://localhost:8082
```

---

## Have Fun!
Enjoy building and playing in the **ft_transcendence** Pong contest website. Let the games begin!

