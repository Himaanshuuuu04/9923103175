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