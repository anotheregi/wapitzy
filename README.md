# WhatsApp API

A production-ready WhatsApp API service built with Node.js, Express, and Baileys library for WhatsApp Web automation.

## Features

- WhatsApp Web integration using Baileys
- Campaign management for bulk messaging
- Contact list management
- RESTful API endpoints
- Database persistence with MySQL and Sequelize
- Comprehensive testing with Jest
- CI/CD pipeline with GitHub Actions
- Security middleware (Helmet, rate limiting)
- Swagger API documentation
- Health check endpoints

## Prerequisites

- Node.js 18.x
- MySQL 8.0+
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wa-api-main
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=wa_api
DB_PORT=3306

# Application Configuration
NODE_ENV=development
PORT=3000
API_KEY=your_api_key_here
```

4. Set up the database:
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE wa_api;"

# The application will automatically create tables on startup
```

5. Start the application:
```bash
# Development mode
npm run dev

# Production mode
npm start

# Using PM2
npm run pm2
```

## Database Setup

The application uses Sequelize ORM with MySQL. Database tables are automatically created when the application starts.

### Models

- **Campaign**: Manages bulk messaging campaigns
- **ContactList**: Stores contact lists for campaigns

### Migrations

Database synchronization happens automatically on application startup. For production, consider using proper migration scripts.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | localhost |
| `DB_USER` | MySQL username | root |
| `DB_PASSWORD` | MySQL password | (empty) |
| `DB_NAME` | MySQL database name | wa_api |
| `DB_PORT` | MySQL port | 3306 |
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Application port | 3000 |
| `API_KEY` | API key for authentication | (required) |

## API Endpoints

### Campaigns
- `POST /campaigns` - Create a new campaign
- `GET /campaigns` - Get all campaigns
- `GET /campaigns/:id` - Get campaign by ID
- `PUT /campaigns/:id/status` - Update campaign status
- `DELETE /campaigns/:id` - Delete a campaign
- `GET /campaigns/stats` - Get campaign statistics

### Contacts
- `POST /contacts` - Create a contact list
- `GET /contacts` - Get all contact lists
- `GET /contacts/:id` - Get contact list by ID
- `PUT /contacts/:id` - Update contact list
- `DELETE /contacts/:id` - Delete contact list
- `POST /contacts/import-csv` - Import contacts from CSV
- `GET /contacts/:id/phones` - Get phone numbers from list

### Health Check
- `GET /health` - Application health check

### Swagger Documentation
- `GET /api-docs` - API documentation

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/campaignController.test.js
```

### Test Structure

- **Unit Tests**: Test individual controller functions
- **Integration Tests**: Test API endpoints and database interactions

Test files are located in the `tests/` directory:
- `campaignController.test.js` - Campaign controller tests
- `contactController.test.js` - Contact controller tests
- `integration.test.js` - Integration tests

## Development

### Code Quality

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Project Structure

```
wa-api-main/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/             # Route controllers
│   ├── middlewares/             # Express middlewares
│   ├── models/                  # Sequelize models
│   ├── routes/                  # API routes
│   ├── services/                # Business logic services
│   └── utils/                   # Utility functions
├── tests/                       # Test files
├── .github/
│   └── workflows/               # CI/CD workflows
├── .env.example                 # Environment variables template
├── app.js                       # Application entry point
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## Deployment

### Using PM2

```bash
# Start with PM2
npm run pm2

# Check status
npm run pm2:logs

# Restart
npm run pm2:restart

# Stop
npm run pm2:stop
```

### Heroku Deployment

1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Add MySQL add-on (e.g., ClearDB or JawsDB)
4. Deploy using Heroku CLI or GitHub integration

### Docker Deployment

```dockerfile
# Example Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .
EXPOSE 3000

CMD ["npm", "start"]
```

## Security

- Helmet.js for security headers
- Rate limiting middleware
- Input validation with express-validator
- API key authentication
- CORS configuration

## Monitoring

- Health check endpoints
- Winston/Pino logging
- Express healthcheck middleware

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.
