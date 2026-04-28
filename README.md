# Admin Dashboard Frontend (React + Redux)

This project is an admin dashboard built using React, Redux, and Axios.  
It connects to backend APIs and allows admins to manage users, plans, transactions, banners, and contacts.

The system handles authentication, token refresh, protected routes, and full admin control features.

---

## Overview

This dashboard provides:

- Admin authentication with OTP
- Automatic token refresh
- User management (view, disable, delete)
- Plan management
- Transaction monitoring
- Contact form handling
- Banner management
- Analytics and statistics

---

## Project Structure

Main parts of the system:

- API Layer → handles all backend calls  
- Axios Instance → handles tokens and refresh logic  
- Redux Store → manages global state  
- Auth System → login, logout, token handling  
- Pages → UI screens  
- Components → reusable UI blocks  

---

## Flow (Brick by Brick)

### 1. Authentication Flow

Login process:

1. Admin enters email and password  
2. API sends OTP to email  
3. Admin verifies OTP  
4. Backend returns accessToken and refreshToken  
5. Tokens are stored in Redux and localStorage  
6. User is redirected to dashboard  

Reference: :contentReference[oaicite:0]{index=0}

---

### 2. Token Handling

- Access token is attached to every request  
- If request fails with 401:
  - System automatically calls refresh token API  
  - New access token is stored  
  - Original request is retried  

Important logic:

```
if (error.response.status === 401) {
  call refresh-token
  update redux store
  retry original request
}
```

Special case:

- Some requests (login, OTP) skip refresh logic using:
```
skipAuthRefresh: true
```

---

### 3. Axios Instance

Central request handler:

- Adds Authorization header
- Logs API calls
- Handles token refresh
- Handles logout on failure

Base URL:
```
https://api.vedvivah.com/api
```

---

### 4. API Layer

All APIs are separated into modules:

#### Admin API
Handles:

- register
- login
- verify OTP
- logout
- forgot password
- reset password

#### Contact API
Handles:

- create contact
- fetch all contacts
- delete contact
- mark contacted

Reference: :contentReference[oaicite:1]{index=1}

---

#### Plan API

Handles:

- create plan
- update plan
- delete plan
- get all plans

Reference: :contentReference[oaicite:2]{index=2}

---

#### Admin Stats API

Handles:

- user stats
- gender ratio
- profile completion
- connections
- all users
- disable / enable user
- transactions
- verification status

---

### 5. Redux State Management

Store contains:

```
auth:
  accessToken
  refreshToken
  admin
  isAuthenticated

user:
  admin data
```

Key actions:

- setCredentials → save tokens
- logout → clear tokens
- initializeAuth → restore session

---

### 6. App Initialization

On app load:

1. Check tokens in storage  
2. Decode token  
3. If expired → refresh token  
4. If valid → restore session  
5. Else → logout  

---

### 7. Routing System

Routes are protected using a wrapper:

```
<ProtectedRoute>
```

Flow:

- If authenticated → allow access  
- If not → redirect to login  

Main routes:

- /login
- /
- /users
- /transactions
- /settings
- /plan-control
- /alerts
- /user-verification

---

### 8. Dashboard

Dashboard shows:

- total users
- new users
- gender ratio
- profile completion
- connections

Includes charts and analytics.

---

### 9. User Management

Admin can:

- view all users
- search users
- filter by plan
- view detailed profile
- disable user with reason
- enable user
- delete user

Reference: :contentReference[oaicite:3]{index=3}

---

### 10. Disabled Users Panel

Features:

- view disabled users
- filter by date
- search by email or ID
- see disable reason

Reference: :contentReference[oaicite:4]{index=4}

---

### 11. User Verification

Admin can:

- see verification status
- approve or reject users
- add remarks

Reference: :contentReference[oaicite:5]{index=5}

---

### 12. Plans Management

Admin can:

- create plans
- edit plans
- update pricing
- manage features

Reference: :contentReference[oaicite:6]{index=6}

---

### 13. Transactions

Features:

- view billing data
- search users
- filter plans
- export CSV

Reference: :contentReference[oaicite:7]{index=7}

---

### 14. Contacts Management

Admin can:

- view contact requests
- mark as contacted
- delete contact

Reference: :contentReference[oaicite:8]{index=8}

---

### 15. Banner Management

Admin can:

- upload banners
- delete banners
- preview images

Reference: :contentReference[oaicite:9]{index=9}

---

### 16. Plan Applications

Admin can:

- view applications
- filter by status
- view detailed info
- pagination support

Reference: :contentReference[oaicite:10]{index=10}

---

## Tech Stack

- React
- Redux Toolkit
- Axios
- React Router
- Framer Motion
- Tailwind CSS

---

## How to Run

### Install dependencies
```
npm install
```

### Start development server
```
npm run dev
```

---

## Environment Variables

```
VITE_API_URL=https://api.vedvivah.com/api
```

---

## Developer Notes

- Token refresh is handled globally using Axios interceptors  
- Always use axiosInstance instead of axios directly  
- Avoid using skipAuthRefresh except for login APIs  
- API errors should be handled consistently  
- Large API responses should be paginated  
- Avoid storing sensitive data in localStorage  

---


---

## Summary

This project is a complete admin dashboard system with:

- secure authentication  
- automatic token handling  
- modular API structure  
- full user and system control  



---
