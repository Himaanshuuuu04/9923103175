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
````
