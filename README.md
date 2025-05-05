# Ineffa Landing Page

This project provides a React application built with Vite, featuring a landing page and admin panel.

## Consultation Management System

The admin panel includes a complete consultation management system that allows administrators to view, filter, and manage consultations, including updating their status and payment status.

### Features

- View all consultations with pagination
- Filter consultations by status
- Search consultations by ID, customer name, or email
- View detailed information for each consultation
- Update consultation status and payment status
- Responsive design for all device sizes

## Environment Configuration

This project uses environment variables to configure various settings. The main configuration file is `.env` in the project root.

### Available Environment Variables

- `VITE_APP_API_URL`: The base URL for API requests (e.g., `http://localhost:5000`)

### Setup Instructions

1. Create a `.env` file in the project root if it doesn't exist
2. Add the required environment variables

```
VITE_APP_API_URL=http://localhost:5000
```

### Usage in Code

Access environment variables in your React components using:

```javascript
const apiUrl = import.meta.env.VITE_APP_API_URL;
```

**Note:** All environment variables must be prefixed with `VITE_` to be accessible in the frontend code.

## API Integration

The consultation management system connects to the backend API using the following endpoints:

- `GET /consultations` - Get all consultations with pagination
- `GET /consultations/:id` - Get a specific consultation by ID
- `PATCH /consultations/:id` - Update a consultation's status or payment status
- `GET /consultations/stats` - Get consultation statistics

### Troubleshooting

If you're experiencing issues connecting to the API:

1. Ensure the backend server is running
2. Check that the `VITE_APP_API_URL` environment variable is set correctly
3. Verify that you're authenticated (check for the presence of an `adminToken` in localStorage)

## Vite Configuration

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Ineffa_Frontend
