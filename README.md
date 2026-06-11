# APIs
### Auth APIs ✅
- **POST** `/api/auth/login` - Login a user and receive a JWT token.
- **POST** `/api/auth/register` - Register a new user account.
- **POST** `/api/auth/logout` - Logout the user and invalidate the JWT token.

### User APIs
- **GET** `/api/users` - Retrieve a list of all users (admin only).
- **GET** `/api/users/:id` - Retrieve a specific user by ID.
- **PUT** `/api/users/:id` - Update a specific user's information.
- **DELETE** `/api/users/:id` - Delete a specific user (admin only).

### Content APIs ✅
- **GET** `/api/content` - Retrieve a list of all content items.
- **GET** `/api/content/:id` - Retrieve a specific content item by ID.
- **POST** `/api/content` - Create a new content item.
- **PUT** `/api/content/:id` - Update a specific content item.
- **DELETE** `/api/content/:id` - Delete a specific content item.

### Tags APIs ✅
- **GET** `/api/tags` - Retrieve a list of all tags.

### Shared Links APIs
- **GET** `/api/shared-links` - Retrieve a list of all shared links.
- **POST** `/api/shared-links` - Create a new shared link.
- **DELETE** `/api/shared-links/:id` - Delete a specific shared link.

