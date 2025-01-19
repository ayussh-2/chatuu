# 💬 Chatuu: The Next-Gen Chat Application

Chatuu is a sleek and modern chat application designed for seamless communication. With an intuitive interface and powerful features, it redefines how you connect with others. The frontend is built using **Next.js** and styled with **TailwindCSS**, while the backend leverages **Express** and **Prisma** for a scalable and efficient architecture. Dockerized for easy deployment, Chatuu is ready to take your chat experience to the next level! ✨

---

## ✨ Features

### Frontend

-   📱 **Responsive Design**: Fully responsive, ensuring a great user experience across devices.
-   🌙 **Dark Mode Support**: Enjoy chatting in dark mode.
-   ✅ **Form Validation**: Powered by `react-hook-form` and `zod`.
-   ⚡ **Real-time Updates**: Instant messaging with `socket.io-client`.
-   🎨 **Interactive UI Components**: Built with `@radix-ui` for smooth user interactions.

### Backend

-   🔒 **Authentication**: Google OAuth 2.0 for secure sign-ins currently not working :( .
-   🗄️ **Database Management**: PostgreSQL handled efficiently using Prisma.
-   ⚡ **Real-time Communication**: Real-time chat powered by `socket.io`.
-   🧰 **Redis Integration**: Optimized caching with Redis.

### Deployment

-   🐳 **Dockerized Setup**: Seamless deployment with Docker Compose.
-   📈 **Scalable Architecture**: Microservices-friendly backend design.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

-   [Node.js](https://nodejs.org/) ⚙️
-   [Docker](https://www.docker.com/) 🐋

### Installation

#### Clone the Repository

    git clone https://github.com/ayussh-2/chatuu.git
    cd chatuu

#### Frontend Setup

1.  Navigate to the client folder:

        cd client

2.  Install dependencies:

        yarn install

3.  Start the development server:

        yarn dev

#### Backend Setup

1.  To configure the backend, define environment variables inside the `.env` file with the following content:
```
     DATABASE_URL=postgresql://postgres:password@db:5432/chatuu?schema=public
     REDIS_URL=redis://redis:6379
     CLIENT_URL=http://localhost:3000
     JWT_SECRET=your-secret-key
     GOOGLE_CLIENT_ID=
     GOOGLE_CLIENT_SECRET=
     GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/callback/google
```

2.  Here is an example `docker-compose.yml` file for reference:

        services:
            app:
                build: .
                container_name: chatuu-server
                restart: always
                ports:
                    - "5000:5000"
                env_file:
                    - .env
                depends_on:
                    - db
                    - redis
                volumes:
                    - .:/app
                    - /app/node_modules
            db:
                image: postgres:15
                container_name: postgres-db
                environment:
                    POSTGRES_USER: postgres
                    POSTGRES_PASSWORD: 91101
                    POSTGRES_DB: chatuu
                ports:
                    - "5432:5432"
                volumes:
                    - postgres_data:/var/lib/postgresql/data

            redis:
                image: redis:7
                container_name: redis-server
                ports:
                    - "6379:6379"

        volumes:
            postgres_data:

3.  Run the application:

        - yarn docker-build
        - yarn docker-up

Access the application:

-   🌐 Frontend: [http://localhost:3000](http://localhost:3000)
-   🌐 Backend: [http://localhost:5000](http://localhost:5000)

---

## 🛠️ Technologies Used

### Frontend

-   ⚛️ **Next.js**
-   🎨 **TailwindCSS**
-   ✅ **React Hook Form**
-   ⚡ **Socket.io Client**
-   🪄 **ShadCN UI**

### Backend

-   🚀 **Express**
-   🗄️ **Prisma**
-   🧰 **Redis**
-   🐘 **PostgreSQL**

### Deployment

-   🐋 **Docker**
-   🐋 **Docker Compose**

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1.  🔀 Fork the repository.
2.  🌱 Create a new branch (`git checkout -b feature/your-feature`).
3.  ✏️ Commit your changes (`git commit -m 'Add your feature'`).
4.  📤 Push to the branch (`git push origin feature/your-feature`).
5.  🔧 Open a Pull Request.

---

## Status
[![Netlify Status](https://api.netlify.com/api/v1/badges/f3a835ad-5f7e-43e1-93fe-34cb1845cf7a/deploy-status)](https://app.netlify.com/sites/chatuu/deploys)

## ⚖️ License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

### 😊 Happy Chatting with Chatuu!
