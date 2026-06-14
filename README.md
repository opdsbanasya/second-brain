# APIs
### Auth APIs ✅
- **POST** `/api/auth/login` - Login a user and receive a JWT token.
    - Request body: 
        ```json
        {
            "email": "user@gmail.com",
            "password": "User@123"
        }
        ```
    - Response: Set HTTP-only cookie with JWT token and return user info.
        ```json
        {
            "message": "Login successful",
            "user": {
                "_id": "6a2ab*******912fc38c",
                "name": "User",
                "email": "user@gmail.com",
                "createdAt": "2026-06-11T12:54:50.764Z",
                "updatedAt": "2026-06-11T12:54:50.764Z",
                "__v": 0
            }
        }
        ```

- **POST** `/api/auth/register` - Register a new user account.
    - Request body: 
        ```json
        {
            "name": "Dharm",
            "email": "dharm.singh@gmail.com",
            "password": "Hello@123"
        }
        ```
    - Response: Return success message and user info.

- **POST** `/api/auth/logout` - Logout the user and invalidate the JWT token.
    - Response: Clear the JWT cookie and return a success message.

### User APIs
- **GET** `/api/users` - Retrieve a list of all users (admin only).
- **GET** `/api/users/:id` - Retrieve a specific user by ID.
- **PUT** `/api/users/:id` - Update a specific user's information.
- **DELETE** `/api/users/:id` - Delete a specific user (admin only).

### Content APIs ✅
- **POST** `/api/content` - Create a new content item.
    - Request body: 
        ```json
        {
            "title": "My First Note",
            "link": "https://example.com/my-first-note",
            "contentType": "article",
            "tags": ["personal", "important"],
            "description": "This is a note about my first article."
        }
        ```
    - Response: Return the created content item with its ID.
        ```json
        {
            "_id": "7b3c4d5e6f7g8h9i0j1k2l3",
            "title": "My First Note",
            "link": "https://example.com/my-first-note",
            "contentType": "article",
            "tags": ["personal", "important"],
            "description": "This is a note about my first article.",
            "createdAt": "2026-06-11T13:00:00.000Z",
            "updatedAt": "2026-06-11T13:00:00.000Z",
            "__v": 0
        }
        ```

- **GET** `/api/content` - Retrieve a list of all content items.
    - Response: Return a list of content items.
    ```json
        {
            "contents": [
                {
                    "_id": "7b3c4d5e6f7g8h9i0j1k2l3",
                    "title": "My First Note",
                    "link": "https://example.com/my-first-note",
                    "contentType": "article",
                    "tags": ["personal", "important"],
                    "description": "This is a note about my first article.",
                    "createdAt": "2026-06-11T13:00:00.000Z",
                    "updatedAt": "2026-06-11T13:00:00.000Z",
                    "__v": 0
                }
            ]
        }
    ```

- **GET** `/api/content/:id` - Retrieve a specific content item by ID.
    - Response: Return the content item with the specified ID.
        ```json
        {
            "_id": "7b3c4d5e6f7g8h9i0j1k2l3",
            "title": "My First Note",
            "link": "https://example.com/my-first-note",
            "contentType": "article",
            "tags": ["personal", "important"],
            "description": "This is a note about my first article.",
            "createdAt": "2026-06-11T13:00:00.000Z",
            "updatedAt": "2026-06-11T13:00:00.000Z",
            "__v": 0
        }
        ```

- **PUT** `/api/content/:id` - Update a specific content item.
    - Request body: 
        ```json
        {
            "title": "Updated Note Title",
            "description": "This is an updated description for the note."
        }
        ```
    - Response: Return the updated content item.
        ```json
        {
            "_id": "7b3c4d5e6f7g8h9i0j1k2l3",
            "title": "Updated Note Title",
            "link": "https://example.com/my-first-note",
            "contentType": "article",
            "tags": ["personal", "important"],
            "description": "This is an updated description for the note.",
            "createdAt": "2026-06-11T13:00:00.000Z",
            "updatedAt": "2026-06-11T14:00:00.000Z",
            "__v": 0
        }
        ```

- **DELETE** `/api/content/:id` - Delete a specific content item.
    - Response: Return a success message confirming deletion.
        ```json
        {
            "message": "Content item deleted successfully"
        }
        ```

### Tags APIs ✅
- **GET** `/api/tags` - Retrieve a list of all tags.
   - Response: Return a list of tags.
        ```json
        {
            "tags": [
                {
                    "_id": "6a2c44a8c186ab0979f52378",
                    "name": "link",
                    "__v": 0
                },
            ]
        }
        ```

### Shared Links APIs ✅
- **GET** `/api/shared-links` - Retrieve a list of all shared links.
    - Response: Return a list of shared links.
        ```json
        {
            "sharedLinks": [
                {
                    "_id": "6a2c44a8c186ab0979f52378",
                    "contentId": "7b3c4d5e6f7g8h9i0j1k2l3",
                    "userId": "6a2ab*******912fc38c",
                    "createdAt": "2026-06-11T13:00:00.000Z",
                    "__v": 0
                },
            ]
        }
        ```
- **POST** `/api/shared-links` - Create a new shared link.
    - Request body: 
        ```json
        {
            "contentId": "7b3c4d5e6f7g8h9i0j1k2l3"
        }
        ```
    - Response: Return the created shared link with its ID.
        ```json
        {
            "_id": "6a2c44a8c186ab0979f52378",
            "contentId": "7b3c4d5e6f7g8h9i0j2l3",
            "userId": "6a2ab*******912fc38c",
            "createdAt": "2026-06-11T13:00:00.000Z",
            "__v": 0
        }
        ```
- **DELETE** `/api/shared-links/:id` - Delete a specific shared link.
    - Response: Return a success message confirming deletion.
        ```json
        {
            "message": "Shared link deleted successfully"
        }
        ```

