# Step-by-Step Guide to Setting Up Your SaaS Billing Platform

## Step # 1 : Installing Docker and Docker Compose:

Start by downloading Docker, which includes Docker Compose as part of its desktop installation for Windows and Mac. For Linux users, Docker Compose must be installed separately. This setup will enable you to manage containerized applications smoothly. Visit the official Docker website to download the appropriate installer for your operating system and follow the provided installation instructions to set up both Docker and Docker Compose.

## Step # 2: Navigate to the Project's Root Directory

After cloning the repository, switch to the project's root folder to begin configuration and setup.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/93faccac-c32e-40fc-b6c2-33185ed11872/b14aa0a8-077f-4fd4-9151-96ba25e24d52/image.png)

## Step # 4: Set Environment Variables for Docker Compose

Configure the required environment variables to ensure the Docker Compose setup runs correctly.

```bash
PORT=3000
CLUSTER_ENV=dev
#----- Database Credential------------------
DB_HOST=host.docker.internal
DB_PORT=5433
DB_USER=tahakhan
DB_PASSWORD=
DB_DATABASE=postgres
DB_TYPE=postgres
ENABLE_AUTOMATIC_CREATION=true
AUTO_LOAD_ENTITIES=true
JWT_SECRET=6502f2502a8b22bbbd724cd4efedcbe7fbdf47410cbb385e69c6494bcc107ea7
# ----------- EMAIL CREDENTIAL --------------------
SMTP_HOST=smtp.example.com
EMAIL_USER=user
EMAIL_PASSWORD=your-email-password
SENDER_ADDRESS=send-email-address
```

## Step # 5: Launch PostgreSQL with Docker Compose

This **`docker-compose.pg.yml`** file will set up a **PostgreSQL** container and automatically create the necessary databases. To automate this process, I've implemented a shell script.

**`docker-compose -f docker-compose.pg.yml up -d`**

## Step # 6: Execute Docker Compose to Start the SaaS Billing Application

Use Docker Compose to launch your SaaS billing application, initializing all necessary services defined in the **`docker-compose.yml`** file.

**`docker-compose up -d && docker-compose logs -f`**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/93faccac-c32e-40fc-b6c2-33185ed11872/443b4a15-11d7-4368-b222-1533f6e88082/image.png)

## Step # 6.1: Implemented APP E2E Testing

End-to-end (E2E) testing has been implemented to verify that the entire application works as expected from start to finish, ensuring all components interact correctly and the user experience remains smooth.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/93faccac-c32e-40fc-b6c2-33185ed11872/fd499434-1793-45f2-9c9d-304dd16d614e/image.png)

## Step # 7: Access API Documentation:

Visit **http://localhost:3000/api_docs** to view the API documentation for the SaaS billing application.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/93faccac-c32e-40fc-b6c2-33185ed11872/98d28e3a-bc7b-440a-9403-481a63965343/image.png)
