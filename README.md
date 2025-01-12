<img width="100%" alt="Hello World" src="https://github.com/orcaprog/orca-ft_transcendence/blob/main/carbon%20(4).png">

### Project Overview: ft_transcendence

The **ft_transcendence** project involves developing a fully functional **real-time Pong contest website** with advanced gameplay features and strict compliance with security and development standards. This project challenges developers to create a single-page application (SPA) with both basic and advanced functionalities, allowing players to compete in live Pong games and tournaments. Here's a summary of the core requirements and modules:

---

### Core Requirements

#### Minimal Technical Requirements:
1. **Frontend**:
   - Must use **pure vanilla JavaScript** unless overridden by a module.
   - Should be a **single-page application** with browser Back/Forward button support.
   - Must function seamlessly on the latest version of **Google Chrome**.

2. **Backend**:
   - Optional; if implemented, must be written in **Django framwork**.
   - Should adhere to database constraints if a database is used.

3. **Game Features**:
   - Enable **live Pong games** with two players using the same keyboard.
   - Include a **tournament system** with player matchmaking and alias registration.

4. **Security**:
   - Passwords must be securely hashed.
   - Protect against **SQL injection** and **XSS** attacks.
   - Use **HTTPS (WSS for WebSocket)** connections.
   - Validate all forms and user inputs.

5. **Containerization**:
   - The project must run in an autonomous **Docker container** with a single command (`docker-compose up --build`).

6. **Error Handling**:
   - The website should have **no unhandled errors or warnings** during use.

---

### Modules for Additional Features

1. **Web Development**:
   - Backend framework  Django.
   - Frontend  Pure vannila js ,using bostrap.

2. **Gameplay Enhancements**:
   - Support for **remote players** .
   - New games with history and matchmaking.

3. **User Management**:
   - Standard user authentication and tournament management.
   - Remote authentication and JWT-based access.

6. **DevOps**:
   - Microservices architecture for the backend.

7. **Accessibility & Compatibility**:
   - Support for multiple devices, and browsers.
   - Accessibility options for visually impaired users.

---



To use this project locally, follow these steps:  

### 1. **Clone the Repository**  
   Open your terminal and run:  
   ```bash
   git clone https://github.com/orcaprog/orca-ft_transcendence
   ``` 

### 2. **Navigate to the Project Directory**  
   ```bash
   cd orca-ft_transcendence
   ```  

### 3. **Ensure Dependencies Are Installed**  
   Make sure the following dependencies are installed on your system:  
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

### 4. **Start the Project**  
   Run the following command:  
   ```bash
   make
   ```  

   This will:  
   - Build the Docker containers for the project.  
   - Start the application and its associated services (e.g., backend, database, etc.).  

### 5. **Access the Application**  
   Once the containers are running, open your browser and navigate to:  
   ```  
   https://localhost:8082
   ```
### Have fun!
