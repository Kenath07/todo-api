# Todo API

A RESTful API for managing todo items built with Node.js, Express, and MongoDB.

## Features

- ✅ CRUD operations for todos
- 🔒 Security headers with Helmet
- 🚦 Rate limiting to prevent abuse
- 🔒 Configurable CORS
- ✅ Input validation
- 📊 Dynamic statistics endpoint
- 💡 Motivational tips based on task count
- 🧪 Testing setup with Jest
- 🔍 ESLint for code quality

## API Endpoints

### Base URL
```
http://localhost:5000
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get API info and statistics |
| GET | `/api/todos` | Get all todos |
| POST | `/api/todos` | Create a new todo |
| PUT | `/api/todos/:id` | Update a todo |
| DELETE | `/api/todos/:id` | Delete a todo |
| GET | `/api/todos/suggest` | Get motivational tip |

### Request/Response Formats

#### Create Todo (POST)
```json
{
  "title": "Learn Node.js"
}
```

#### Update Todo (PUT)
```json
{
  "title": "Learn Node.js and Express",
  "completed": true
}
```

#### Todo Response
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "title": "Learn Node.js",
  "completed": false,
  "createdAt": "2023-09-05T12:34:56.789Z"
}
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   MONGO_URI=mongodb://localhost:27017/todo-api
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   - If using local MongoDB, make sure it's running
   - If using MongoDB Atlas, update `MONGO_URI` with your connection string

### Running the Application

#### Development Mode
```bash
npm run dev
```
This uses nodemon for automatic restarts on file changes.

#### Production Mode
```bash
npm start
```

### Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Code Quality

```bash
# Run ESLint
npm run lint
```

## Security Features

- **Helmet**: Sets various HTTP headers to protect against common web vulnerabilities
- **Rate Limiting**: Limits requests to 100 per 15 minutes per IP
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Validates all incoming data
- **Environment Variable Validation**: Ensures required environment variables are set

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGO_URI` | Yes | - | MongoDB connection string |
| `PORT` | No | 5000 | Server port |
| `NODE_ENV` | No | development | Environment (development/production) |

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "message": "Error description"
}
```

## Deployment Notes

### Production Setup

1. Set `NODE_ENV=production`
2. Update CORS origins in `server.js` to include your frontend domain
3. Use a production MongoDB instance
4. Consider using a process manager like PM2
5. Set up proper logging and monitoring

### Example Production CORS Configuration
```javascript
const corsOptions = {
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true,
  optionsSuccessStatus: 200
};
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run linting and tests
6. Submit a pull request

## License

ISC License
