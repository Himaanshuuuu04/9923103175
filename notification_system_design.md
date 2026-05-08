# Stage-1

# Notification System Design

## Overview

This document contains the REST API design and notification structure for the student notification platform. The system is designed to support placement updates, event notifications, and result announcements for logged-in users.

The platform also supports:

- Real-time notifications
- Read/unread status
- Pagination
- Filtering notifications by type

---

# Notification Types

The application supports the following notification categories:

- Event
- Result
- Placement

---

# Notification Structure

```json
{
  "id": "146095a-d8b6-4a34-9e69-3900a14576bc",
  "studentId": 1042,
  "type": "Placement",
  "title": "Placement Opportunity",
  "message": "AMD is hiring for SDE roles.",
  "isRead": false,
  "createdAt": "2026-04-22T17:51:30Z"
}
```

---

# Fields Description

| Field | Description |
|------|-------------|
| id | Unique notification id |
| studentId | Student receiving the notification |
| type | Notification category |
| title | Notification title |
| message | Main notification message |
| isRead | Read/unread status |
| createdAt | Notification creation time |

---

# API Design

## 1. Get Notifications

Used to fetch notifications for the logged-in user.

### Endpoint

```http
GET /notifications
```

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Query Parameters

| Parameter | Description |
|-----------|-------------|
| page | Current page number |
| limit | Number of notifications per page |
| type | Filter notifications by type |

### Example Request

```http
GET /notifications?page=1&limit=10&type=Placement
```

### Success Response

```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "123",
        "type": "Placement",
        "title": "Placement Update",
        "message": "Google hiring drive announced.",
        "isRead": false,
        "createdAt": "2026-04-22T17:51:30Z"
      }
    ],
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

---

## 2. Create Notification

Used to create a new notification.

### Endpoint

```http
POST /notifications
```

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body

```json
{
  "studentId": 1042,
  "type": "Result",
  "title": "Result Published",
  "message": "Your semester result has been published."
}
```

### Success Response

```json
{
  "success": true,
  "message": "Notification created successfully"
}
```

---

## 3. Mark Notification as Read

Used to update notification read status.

### Endpoint

```http
PATCH /notifications/:id/read
```

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Example Request

```http
PATCH /notifications/123/read
```

### Success Response

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## 4. Bulk Notification API

Used to send notifications to multiple students together.

### Endpoint

```http
POST /notifications/bulk
```

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body

```json
{
  "studentIds": [101, 102, 103],
  "type": "Placement",
  "title": "Placement Opportunity",
  "message": "Microsoft internship applications are open."
}
```

### Success Response

```json
{
  "success": true,
  "message": "Bulk notifications created successfully"
}
```

---

# Pagination

Pagination is used to avoid loading all notifications at once.

Example:

```http
GET /notifications?page=1&limit=10
```

Benefits:

- Faster API response
- Better frontend performance
- Reduced server load

---

# Real-Time Notifications

The system uses WebSockets for real-time notification updates.

## WebSocket Connection

```ws
ws://localhost:5000
```

---

# Real-Time Flow

1. User logs into the application
2. Frontend establishes WebSocket connection
3. Server pushes new notifications instantly
4. Notification list updates automatically

---

# Why WebSockets

WebSockets provide persistent communication between client and server and are suitable for live notification systems where updates should appear instantly without refreshing the page.

---

# Error Response Format

```json
{
  "success": false,
  "message": "Invalid notification type"
}
```

---

# Common Status Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 400 | Invalid request |
| 401 | Unauthorized |
| 404 | Resource not found |
| 500 | Internal server error |

---

# Naming Conventions Used

The API follows predictable naming conventions:

```http
GET /notifications
POST /notifications
PATCH /notifications/:id/read
POST /notifications/bulk
```

This keeps endpoints simple and consistent across the application.

Add this below your existing Stage-1 content in the same file 



# Stage-2

# Database Design

PostgreSQL is used as the primary database for storing notifications. Since the application requires filtering, pagination, sorting, and querying based on notification type and users, a relational database is more suitable for this use case.

PostgreSQL also provides good indexing support and handles large amounts of structured data efficiently.

---

# Notifications Table Schema

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    student_id INT NOT NULL,
    type VARCHAR(20) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

# Table Fields

| Column | Description |
|--------|-------------|
| id | Unique notification id |
| student_id | Student receiving notification |
| type | Notification category |
| title | Notification heading |
| message | Notification content |
| is_read | Read/unread status |
| created_at | Notification creation time |

---

# Why PostgreSQL

PostgreSQL is selected because the notification system needs:

- Filtering notifications
- Pagination support
- Sorting by time
- Fast query performance
- Reliable data consistency

A relational database works better here because notification data is structured and relationships are simple.

---

# Possible Problems as Data Increases

As the number of users and notifications grows, some issues may occur.

## 1. Slow Queries

If the table contains millions of notifications, fetching unread notifications can become slow.

---

## 2. Full Table Scans

Without indexes, PostgreSQL may scan the complete table to find matching notifications.

This increases query time significantly.

---

## 3. Large API Responses

Returning all notifications together can increase response size and slow down both backend and frontend performance.

---

## 4. High Concurrent Requests

During placement season or result announcements, many students may access notifications at the same time.

This can increase database load.

---

# Solutions

## 1. Database Indexing

Indexes are added to improve query performance.

```sql
CREATE INDEX idx_notifications_student
ON notifications(student_id);

CREATE INDEX idx_notifications_type
ON notifications(type);

CREATE INDEX idx_notifications_student_read_created
ON notifications(student_id, is_read, created_at DESC);
```

These indexes help PostgreSQL fetch filtered notifications faster.

---

## 2. Pagination

Pagination is used to avoid loading all notifications together.

Example:

```http
GET /notifications?page=1&limit=10
```

Benefits:

- Faster API response
- Reduced database load
- Better frontend performance

---

## 3. Redis Caching

Frequently accessed data such as unread notification counts can be cached using Redis.

This reduces repeated database queries.

---

## 4. Queue-Based Processing

Bulk notifications should not be processed directly in the request cycle.

Instead, notifications can be pushed into a queue and processed in the background.

This improves scalability and prevents server overload.

---

# SQL Queries

## Fetch Notifications

```sql
SELECT *
FROM notifications
WHERE student_id = 1042
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;
```

---

## Fetch Notifications by Type

```sql
SELECT *
FROM notifications
WHERE student_id = 1042
AND type = 'Placement'
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;
```

---

## Create Notification

```sql
INSERT INTO notifications (
    id,
    student_id,
    type,
    title,
    message
)
VALUES (
    '146095a-d8b6-4a34-9e69-3900a14576bc',
    1042,
    'Placement',
    'Placement Opportunity',
    'Google hiring drive announced.'
);
```

---

## Mark Notification as Read

```sql
UPDATE notifications
SET is_read = true
WHERE id = '146095a-d8b6-4a34-9e69-3900a14576bc';
```

---

# Database Scaling Approach

To handle larger amounts of traffic and notification data, the following optimizations can be used:

- Database indexing
- Pagination
- Redis caching
- Queue workers
- Optimized SQL queries

These improvements help maintain good performance even when the number of users increases.


# Stage-3

# Query Optimization

The following query is being used to fetch unread notifications for a student:

```sql
SELECT *
FROM notifications
WHERE student_id = 1042
AND is_read = false
ORDER BY created_at ASC;
```

The query is correct because it returns unread notifications for a specific student. However, the performance can become slow when the database grows large.

At the current scale of around 50,000 students and millions of notifications, this query may take longer because the database has to scan many rows before returning the result.

---

# Why The Query Is Slow

## 1. Full Table Scan

If proper indexes are not present, PostgreSQL may scan the entire notifications table to find matching rows.

As the number of notifications increases, query execution time also increases.

---

## 2. Sorting Overhead

The query sorts notifications using:

```sql
ORDER BY created_at ASC
```

Sorting large datasets increases processing time.

---

## 3. Fetching Unnecessary Columns

Using:

```sql
SELECT *
```

fetches all columns even when some fields are not required.

This increases memory usage and response size.

---

# Improved Query

A better version of the query would be:

```sql
SELECT id, type, title, message, created_at
FROM notifications
WHERE student_id = 1042
AND is_read = false
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;
```

---

# Improvements Made

Changes in the optimized query:

- Only required columns are selected
- Pagination is added
- Latest notifications are fetched first
- Response size is smaller

This helps reduce database load and improves API response time.

---

# Recommended Index

To improve performance further, the following composite index can be added:

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(student_id, is_read, created_at DESC);
```

---

# Why This Index Helps

This index helps PostgreSQL quickly filter:

- student notifications
- unread notifications
- sorted notifications

Without the index, the database may scan the full table and then sort the data separately.

With the index, PostgreSQL can directly locate matching rows in sorted order.

---

# Computation Cost

## Without Index

Approximate complexity:

```text
O(n log n)
```

because the database scans and sorts large amounts of data.

---

## With Composite Index

Approximate complexity:

```text
O(log n)
```

since indexed lookups are much faster.

---

# Should Every Column Be Indexed?

No.

Adding indexes on every column is not recommended because:

- indexes consume extra storage
- insert and update operations become slower
- maintaining too many indexes affects performance

Indexes should only be added on columns frequently used in filtering, searching, or sorting.

---

# Useful Columns For Indexing

The following columns are suitable for indexing:

- student_id
- is_read
- created_at
- type

These fields are commonly used in notification queries.

---

# Query To Find Students Who Received Placement Notifications In Last 7 Days

```sql
SELECT DISTINCT student_id
FROM notifications
WHERE type = 'Placement'
AND created_at >= NOW() - INTERVAL '7 days';
```

---

# Why DISTINCT Is Used

A student can receive multiple placement notifications.

Using `DISTINCT` ensures that each student appears only once in the result.

---

# Additional Improvements

Some additional optimizations that can improve performance are:

- pagination
- Redis caching
- limiting API response size
- queue-based processing for bulk notifications

These techniques help maintain stable performance as the system grows.

---

# Stage-4

# Reducing Database Load

Currently, notifications are fetched whenever a student opens or refreshes the page. With thousands of users, this can create too many database requests and slow down the system.

To improve performance, the following changes can be used.

---

# 1. Pagination

Instead of loading all notifications together, only a limited number of notifications should be fetched.

Example:

```http
GET /notifications?page=1&limit=10
```

This reduces API response size and lowers database load.

### Trade-off

Users need additional requests to load older notifications.

---

# 2. Redis Caching

Frequently used data like unread counts or recent notifications can be stored in Redis.

This avoids repeated database queries for the same data.

### Trade-off

Cached data may not always be instantly updated.

---

# 3. WebSockets

WebSockets can be used for real-time updates instead of repeatedly calling notification APIs.

This reduces unnecessary polling requests.

### Trade-off

Maintaining WebSocket connections increases server memory usage.

---

# 4. Database Indexing

Indexes help PostgreSQL fetch notifications faster.

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(student_id, is_read, created_at DESC);
```

### Trade-off

Indexes require additional storage and slightly slow down inserts.

---

# 5. Queue-Based Processing

Bulk notifications should be processed using queues instead of directly inside API requests.

This prevents the server from getting overloaded during heavy traffic.

### Trade-off

Queues add some extra backend complexity.

---

# Final Approach

A combination of pagination, caching, indexing, WebSockets, and queues can improve performance and reduce database load when the number of users grows.
---

# Stage-5

# Bulk Notification Processing

The current implementation sends emails and notifications one by one inside a loop.

This approach can become slow when notifications need to be sent to thousands of students at the same time.

Main issues with the current approach:

- API response becomes slow
- Failed email requests can stop the process
- Database and email operations happen sequentially
- High server load during bulk processing

---

# Better Approach

A queue-based system should be used for bulk notifications.

Instead of processing everything directly inside the request, notification jobs can be added to a queue and handled by background workers.

This improves scalability and reliability.

---

# Why Queue Processing Helps

Benefits:

- Faster API response
- Better error handling
- Failed jobs can be retried
- Reduced server load
- Notifications can be processed in parallel

---

# Saving To Database And Sending Email

Both operations should not depend completely on each other.

The notification can first be stored in the database, and email sending can happen separately using background workers.

This ensures that notifications are not lost even if email delivery fails temporarily.

---

# Revised Pseudocode

```text
function notify_all(student_ids, message)

    for student_id in student_ids

        add_job_to_queue({
            student_id,
            message
        })

worker_process(job)

    save_notification_to_db(job)

    send_email(job)

    push_real_time_notification(job)
```

---

# Stage-6

# Priority Notification System

The notification system should display the most important notifications first so that users can quickly view urgent updates like placement drives or result announcements.

Priority order used:

```text
Placement > Result > Event
```

Placement notifications are given highest priority because they are usually time-sensitive.

---

# Approach Used

Notifications are fetched from the API and sorted using:

1. Notification priority
2. Latest timestamp

Priority weights:

| Type | Priority |
|------|-----------|
| Placement | 3 |
| Result | 2 |
| Event | 1 |

If two notifications have the same priority, the latest notification is shown first.

---

# JavaScript Implementation

```js
const axios = require("axios");

const API_URL =
  "http://4.224.186.213/evaluation-service/notifications";

const ACCESS_TOKEN =
  "YOUR_ACCESS_TOKEN";

const priorityMap = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

async function fetchNotifications() {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    const notifications =
      response.data.notifications || [];

    const sortedNotifications =
      notifications.sort((a, b) => {
        const priorityDifference =
          priorityMap[b.Type] -
          priorityMap[a.Type];

        if (priorityDifference !== 0) {
          return priorityDifference;
        }

        return (
          new Date(b.Timestamp) -
          new Date(a.Timestamp)
        );
      });

    const topNotifications =
      sortedNotifications.slice(0, 10);

    console.log(
      "\n===== TOP PRIORITY NOTIFICATIONS =====\n"
    );

    topNotifications.forEach(
      (notification, index) => {
        console.log(
          `${index + 1}. [${notification.Type}]`
        );

        console.log(
          `Message : ${notification.Message}`
        );

        console.log(
          `Time    : ${notification.Timestamp}`
        );

        console.log(
          "-----------------------------------"
        );
      }
    );
  } catch (error) {
    console.log(
      "\nError while fetching notifications\n"
    );

    if (error.response) {
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

fetchNotifications();
```

---

# Time Complexity

The sorting operation takes:

```text
O(n log n)
```

where `n` is the number of notifications returned from the API.

---

# Possible Optimization

For larger datasets, a priority queue or heap can be used to avoid sorting the complete list every time.

This can improve efficiency when handling a very large number of notifications.

---

# Output

The final output displays:

- highest priority notifications first
- latest notifications first within same priority
- top 10 notifications

This improves visibility of important updates for users.

