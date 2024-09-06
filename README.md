
## **Task 1: Case Study: Build a Simple Billing App for a SaaS Platform**

### Note:

I had planned to build the SaaS billing app architecture using microservices with an event-driven approach, leveraging gRPC and Kafka. However, due to some office deadlines, I ended up going with a monolithic architecture instead.

### **Problem Statement:**

Your task is to design and implement a billing app for a SaaS platform that supports multiple subscription tiers and handles recurring billing.

## **Schema Design:**

### 1. Customer Table

- `id`: Primary Key, unique identifier for each customer. This is essential for uniquely identifying customer records across the database.
- `name`: Name of the customer. This is important for personalization and communication purposes.
- `email`: Customer's email address. This is critical for communication, login identification, and password resets.
- `created_at`: Timestamp of when the customer record was created. This helps in tracking when the customer joined the service.
- `updated_at`: Timestamp of the last update made to the customer's record. Useful for auditing changes.
- `subscriptionPlanId`: Foreign key linked to the SubscriptionPlan table. It determines which plan the customer is currently subscribed to.
- `subscription_status`: Status of the customer's subscription (e.g., active, canceled, pending). Useful for managing access to services and billing.
- `subscription_start_date`: This field represents the date when the customer’s subscription begins.
- `subscription_end_date`: This field indicates the date when the customer’s current subscription period will end
- `last_payment_date`: Date of the last payment. This helps in determining billing cycles and delinquency.

### 2. SubscriptionPlan Table

- `id`: Primary Key, unique identifier for each subscription plan.
- `name`: Descriptive name of the plan (e.g., Basic, Pro, Enterprise). Helps customers understand the tier of service.
- `price`: Monthly price of the subscription plan. Necessary for billing purposes.
- `duration`: Duration of the subscription plan (typically in months). Useful for determining when the subscription renews or expires.
- `billing_cycle`: This field defines how often the customer is billed for the subscription plan. This is crucial for setting up automated billing, invoice generation, and subscription management
- `status`: Status of the plan (active/inactive). Helps manage availability of the plan for new or upgrading customers.
- `features`: Description of features provided in the plan. Useful for sales and customer support to explain plan capabilities.

### 3. Invoice Table

- `id`: Primary Key, unique identifier for each invoice.
- `customerId`: Foreign key linked to the Customer table. Identifies the customer to whom the invoice is issued.
- `subscriptionPlanId`: Foreign key linked to the SubscriptionPlan table. Details the plan for which the invoice is issued.
- `amount`: Total amount charged on the invoice. Necessary for financial records and customer billing.
- `issue_date`: Date when the invoice is issued.
- `due_date`: Date by which the payment should be made. Important for reminding customers and managing collections.
- `payment_date`: Date when the payment was received. Useful for reconciling accounts and managing cash flow.
- `status`: Status of the invoice (e.g., paid, unpaid, overdue). Key for tracking the payment lifecycle.

### 4. Payment Table

- `id`: Primary Key, unique identifier for each payment.
- `invoiceId`: Foreign key linked to the Invoice table. Ensures that the payment is correctly associated with an invoice.
- `amount`: Amount paid. This should match the invoice amount or part of it if the payment is partial.
- `payment_date`: Timestamp of when the payment was made. Critical for financial records.
- `payment_method`: Method of payment (e.g., credit card, PayPal, bank transfer). Important for processing and reconciliation.
- `status`: Status of the payment (e.g., successful, failed, pending). Helps in managing payment processing and troubleshooting.

## **Core Technologies Powering Our SaaS Platform**

**Backend:** Node Js

**Database:** PostgreSQL

**Framework:** Nest Js

## **Step-by-Step Guide to Setting Up Your SaaS Billing Platform**

### Step # 1 : Installing Docker and Docker Compose:

Start by downloading Docker, which includes Docker Compose as part of its desktop installation for Windows and Mac. For Linux users, Docker Compose must be installed separately. This setup will enable you to manage containerized applications smoothly. Visit the official Docker website to download the appropriate installer for your operating system and follow the provided installation instructions to set up both Docker and Docker Compose.

### Step # 2 : Clone the Billing SaaS Application Repository:

This step involves cloning your SaaS billing application from its GitHub repository.

[https://github.com/tahakhan-dev/billing-saas-app.git](https://github.com/tahakhan-dev/billing-saas-app.git)

### Step # 3: Navigate to the Project's Root Directory

After cloning the repository, switch to the project's root folder to begin configuration and setup.

![image.png](src/public/images/markdown/image.png)

### Step # 4: Set Environment Variables for Docker Compose

Configure the required environment variables to ensure the Docker Compose setup runs correctly.

```jsx
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

### Step # 5: Launch PostgreSQL with Docker Compose

This docker-compose.pg.yml file will set up a PostgreSQL container and automatically create the necessary databases. To automate this process, I've implemented a shell script.

```jsx
docker-compose -f docker-compose.pg.yml up -d
```

### Step # 6: Execute Docker Compose to Start the SaaS Billing Application

Use Docker Compose to launch your SaaS billing application, initializing all necessary services defined in the `docker-compose.yml` file.

```jsx
docker-compose  up -d && docker-compose logs -f
```

![image.png](src/public/images/markdown/image%201.png)

### Step # 6.1: Implemented APP E2E Testing

End-to-end (E2E) testing has been implemented to verify that the entire application works as expected from start to finish, ensuring all components interact correctly and the user experience remains smooth.

![image.png](src/public/images/markdown/image%202.png)

### Step # 7: Access API Documentation:

Visit `http://localhost:3000/api_docs` to view the API documentation for the SaaS billing application.

![image.png](src/public/images/markdown/image%203.png)

# Exploring Core Features and Use Cases

This section delves into the primary functionalities and practical applications of the system.

## **Subscription Management:**

- **Create and manage subscription plans with different pricing and billing cycles.**

![image.png](src/public/images/markdown/image%204.png)

- **Assign subscription plans to customers and manage their subscription status**
**Steps:**
1. Retrieve a list of all customers.
2. Choose a customer ID that you wish to manage.
3. Assign a subscription plan to the selected customer using this API endpoint: `/api/customer/{id}/assign-subscription/{subscriptionPlanId}`.

![image.png](src/public/images/markdown/image%205.png)

![image.png](src/public/images/markdown/image%206.png)

## **Billing Engine:**

- **Automatically generate invoices at the end of each billing cycle based on the
customer’s subscription plan**

**Steps :**

1. Update the `subscription_end_date` to today's date to trigger generation at the end of each billing cycle.

![image.png](src/public/images/markdown/image%207.png)

1. Following the update, a cron job will execute at midnight to generate the customer's invoice.

![image.png](src/public/images/markdown/image%208.png)

- **Handle prorated billing for mid-cycle upgrades or downgrades.**

Utilize this API to adjust billing for mid-cycle subscription upgrades or downgrades.

![image.png](src/public/images/markdown/image%209.png)

## **Payment Processing:**

- Record payments made by customers and update invoice status accordingly

![image.png](src/public/images/markdown/image%2010.png)

- As you can observe, I have made the payment for my pending invoice.
- A new payment will be recorded against this invoice.
- The invoice status will be updated to 'paid,' and the payment date will be recorded at the time of payment.
- The subscription end date will be extended from today to next month based on the plan selected.

![image.png](src/public/images/markdown/image%2011.png)

![image.png](src/public/images/markdown/image%2012.png)

![image.png](src/public/images/markdown/image%2013.png)

- **Handle failed payments and implement retry logic.**

Utilize this API endpoint `/api/payment/{id}/fail` to manage failed payments and initiate retries.

![image.png](src/public/images/markdown/image%2014.png)

## **Notifications:**

- **Send email notifications to customers when an invoice is generated, when a payment is successful, or when a payment fails**

I have implemented email notifications that are automatically sent to the customer's preferred address whenever a payment is processed or fails. Similarly, when an invoice is generated, an event triggers an email notification to inform the customer about the new invoice.

![image.png](src/public/images/markdown/image%2015.png)

![image.png](src/public/images/markdown/image%2016.png)

## **InvoiceGenerationFunction(OptionalButPlus):**

The deadline you gave me was reasonable, but I didn't get a chance to work on it for five days because I had office work and other deadlines to meet. I only had time to work on it over the weekend, which is why I couldn't implement the AWS serverless functionality. If I had two more days, I would definitely complete it.

# The following design patterns are used in this application:

### 1. **Repository Pattern**

- **Where it's used**: The repository pattern is used in the service layer to encapsulate the logic for interacting with the database. In  app, repositories like `CustomerRepository`, `InvoiceRepository`, and `SubscriptionPlanRepository` are used to abstract data persistence from the business logic.
- **How it works**: Instead of writing database queries in the service layer, the repository provides an interface to perform CRUD operations. This pattern improves separation of concerns by isolating the database layer from the application logic.

**Example**:

```jsx
const customer = await this.customerRepository.findOne({ where: { id: customerId } });
```

### 2. **Service Layer Pattern**

- **Where it's used**: The **service layer** pattern is seen in your `CustomerService`, `InvoiceService`, `SubscriptionService`, and `PaymentService`. It provides a level of abstraction over business logic, keeping controllers thin and focused on handling HTTP requests.
- **How it works**: The service layer contains business rules and logic. For instance, in `upgradeOrDowngradeSubscription()`, you calculate prorated costs, create invoices, and update subscription details. The service interacts with repositories and coordinates between them.
- **Example**:
    
    ```tsx
    const updatedCustomer = await this.customerService.update(customerId, updateCustomerDto);
    ```
    

### 3. **Dependency Injection (DI) Pattern**

- **Where it's used**: This pattern is inherent to NestJS and used throughout the application. Each class that depends on another class (e.g., services, repositories) is injected via the constructor. This decouples components from each other and makes the system more modular and testable.
- **How it works**: Services and repositories are passed into constructors, and NestJS handles their lifecycle. For example, the `CustomerService` depends on the `CustomerRepository` and `SubscriptionPlanRepository`, but it does not need to instantiate these dependencies.

**Example**:

```tsx
constructor(
  @InjectRepository(CustomerEntity) private readonly customerRepository: Repository<CustomerEntity>,
) {}
```

### 4. **Event-Driven Pattern (Asynchronous Messaging)**

- **Where it's used**: I use event-driven notifications, which would apply the event-driven pattern. For example, when an invoice is created, an event like `InvoiceCreatedEvent` could be emitted, and the notification service listens for that event to send an email notification.
- **How it works**: Events are published when something significant happens (e.g., invoice generation or failed payment). Other services (e.g., notification) subscribe to these events and handle them asynchronously.

**Example**:

```tsx
this.eventEmitter.emit('invoice.created', { invoiceId: newInvoice.id });
```

### Summary of Patterns I am Using:

1. **Repository Pattern**: Used for data access and separation of business logic from the persistence layer.
2. **Service Layer Pattern**: Handles the core business logic and orchestrates between the controller and repository.
3. **Dependency Injection**: Used throughout the application, as it's inherent in NestJS.
4. **Event-Driven/Observer Pattern**: Used for sending notifications or triggering actions asynchronously after certain events (like invoice generation or payment success).

Each of these design patterns is being used to make  application more modular, scalable, and maintainable.

# **Deliverables:**

1. I have provided you with a GitHub repository link to clone the project. 

```jsx
https://github.com/tahakhan-dev/billing-saas-app.git
```

1. This is a brief documentation to help you set up and configure the project. I've provided all the necessary steps for the setup.
2. You can access the basic API documentation, which is built using Swagger. [http://localhost:3000/api_docs](http://localhost:3000/api_docs)

## **Task 2: Code Refactoring**

**Problematic Code:**

**JavaScript:**

```jsx
 app.get('/product/:productId', (req, res) => {
       db.query(`SELECT * FROM products WHERE id=${req.params.productId}`, (err,
   result) => {
           if (err) throw err;
           res.send(result);
       });
});
```

1. **SQL Injection Vulnerability:**
    - **Problem:** The original code constructs an SQL query by directly embedding the `productId` from the request URL into the SQL statement. This practice is dangerous because it makes the application vulnerable to SQL injection attacks, where an attacker can manipulate the SQL query by crafting a malicious `productId`
    - **Impact:** SQL injection can lead to unauthorized access to or manipulation of the database. An attacker might execute arbitrary SQL commands, potentially causing data breaches, data corruption, or even complete compromise of the database.
    - **Solution:** Use parameterized queries (also known as prepared statements) to safely pass user input to the SQL query. Instead of directly embedding the `productId` into the query string, you should use a placeholder (`?` in MySQL, `$1` in PostgreSQL, etc.) and pass the user input as a separate parameter.
    - **Implementation:**
    
    ```jsx
    const query = 'SELECT * FROM products WHERE id = ?';
    db.query(query, [req.params.productId], (err, result) => {
        // Handle the result or error
    });
    ```
    
2. **Poor Error Handling:**
    - **Problem:** The original code uses `throw err` within the callback function of the database query. While this will stop the code execution if an error occurs, it does not handle the error in a user-friendly manner. It might crash the entire server if not properly caught and handled elsewhere in the application.
    - **Impact:** If an error occurs, the server might crash, leading to downtime and a poor user experience. Additionally, the lack of meaningful error messages makes it difficult for users to understand what went wrong and how they might rectify the issue.
    - **Solution:** Instead of throwing the error with `throw err`, you should handle it gracefully by logging the error and returning an appropriate response to the client. This can be done using `console.error()` for logging and `res.status()` for setting the HTTP status code.
    - **Implementation:**
    
    ```jsx
    db.query(query, [req.params.productId], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        // Handle the result
    });
    ```
    
3. **Missing Proper HTTP Status Codes:**
    - **Problem:** The original code does not return appropriate HTTP status codes based on the outcome of the operation. For example, it does not handle scenarios where the requested product is not found in the database.
    - **Impact:** Not returning the correct HTTP status codes can lead to confusion for the client applications consuming this API. It also violates RESTful API principles, where responses should include status codes that indicate the success or failure of a request.
    - **Solution:** Use `res.status()` to return the correct HTTP status codes depending on the result of the operation. For example, return `404 Not Found` if the requested resource does not exist, and return `200 OK` for successful operations.
    - **Implementation:**
    
    ```jsx
    if (result.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(result);
    ```
    

### **Refactored Code:**

```jsx
app.get('/product/:productId', (req, res) => {
    const productId = req.params.productId;
    
    // Use a parameterized query to prevent SQL injection
    const query = 'SELECT * FROM products WHERE id = ?';
    db.query(query, [productId], (err, result) => {
        if (err) {
         // Log the error for debugging purposes
            console.error(err); 
            
         // Send a 500 Internal Server Error response with a generic message
            return res.status(500).send('Internal Server Error');
        }
        if (result.length === 0) {
            return res.status(404).send('Product not found');
        }
        res.status(200).send(result);
    });
});

```