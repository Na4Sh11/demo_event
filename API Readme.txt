1. /ping
Description: Check if the server is running.
Method: GET
Response:
json
{
  "status": "ok"
}

2. /events
Description: Retrieve a list of events.
Method: GET
Query Parameters:
category (optional): Filter by category.
location (optional): Filter by location.
date (optional): Filter by date.
Response:
json
Copy code
[
  {
    "id": "string",
    "name": "string",
    "date": "YYYY-MM-DD",
    "time": "HH:MM",
    "location": "string",
    "description": "string",
    "category": "string",
    "organizer": "string"
  }
]

3. /events/:id
Description: Retrieve detailed information about a specific event.
Method: GET
Path Parameters:
id: Event ID.
Response:
json
Copy code
{
  "id": "string",
  "name": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "location": "string",
  "description": "string",
  "category": "string",
  "organizer": "string"
}

4. /events
Description: Create a new event.
Method: POST
Request Body:
json
Copy code
{
  "name": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "location": "string",
  "description": "string",
  "category": "string",
  "organizer": "string"
}
Response:
json
Copy code
{
  "id": "string",
  "name": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "location": "string",
  "description": "string",
  "category": "string",
  "organizer": "string"
}

5. /events/:id
Description: Update details of an existing event.
Method: PUT
Path Parameters:
id: Event ID.
Request Body:
json
Copy code
{
  "name": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "location": "string",
  "description": "string",
  "category": "string",
  "organizer": "string"
}
Response:
json
Copy code
{
  "id": "string",
  "name": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "location": "string",
  "description": "string",
  "category": "string",
  "organizer": "string"
}

6. /events/:id
Description: Delete an event.
Method: DELETE
Path Parameters:
id: Event ID.
Response:
json
Copy code
{
  "message": "Event deleted successfully."
}

7. /users
Description: Retrieve a list of users.
Method: GET
Response:
json
Copy code
[
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "registrationDate": "YYYY-MM-DD"
  }
]

8. /users/:id
Description: Retrieve detailed information about a specific user.
Method: GET
Path Parameters:
id: User ID.
Response:
json
Copy code
{
  "id": "string",
  "name": "string",
  "email": "string",
  "registrationDate": "YYYY-MM-DD",
  "eventsAttended": [
    {
      "id": "string",
      "name": "string",
      "date": "YYYY-MM-DD"
    }
  ]
}

9. /users/:id
Description: Update details of a specific user.
Method: PUT
Path Parameters:
id: User ID.
Request Body:
json
Copy code
{
  "name": "string",
  "email": "string",
  "password": "string"  // Note: Ensure passwords are hashed before storage.
}
Response:
json
Copy code
{
  "id": "string",
  "name": "string",
  "email": "string",
  "registrationDate": "YYYY-MM-DD"
}

10. /users/:id/events
Description: Get a list of events attended by a specific user.
Method: GET
Path Parameters:
id: User ID.
Response:
json
Copy code
[
  {
    "id": "string",
    "name": "string",
    "date": "YYYY-MM-DD"
  }
]

11. /bookmarks
Description: Retrieve a list of bookmarked events for a specific user.
Method: GET
Query Parameters:
userId: User ID.
Response:
json
Copy code
[
  {
    "eventId": "string",
    "eventName": "string"
  }
]

12. /bookmarks
Description: Bookmark an event for a specific user.
Method: POST
Request Body:
json
Copy code
{
  "userId": "string",
  "eventId": "string"
}
Response:
json
Copy code
{
  "message": "Event bookmarked successfully."
}

13. /bookmarks/:id
Description: Remove a bookmark for a specific user.
Method: DELETE
Path Parameters:
id: Bookmark ID.
Response:
json
Copy code
{
  "message": "Bookmark removed successfully."
}

14. /auth/login
Description: Handle user login.
Method: POST
Request Body:
json
Copy code
{
  "email": "string",
  "password": "string"
}
Response:
json
{
  "token": "string",
  "expiresIn": "number" // Token expiration time in seconds
}

15. /auth/logout
Description: Handle user logout.
Method: POST
Response:
json
Copy code
{
  "message": "User logged out successfully."
}

16. /auth/me
Description: Get the current authenticated user's information.
Method: GET
Headers:
Authorization: Bearer token
Response:
json
Copy code
{
  "id": "string",
  "name": "string",
  "email": "string",
  "registrationDate": "YYYY-MM-DD"
}