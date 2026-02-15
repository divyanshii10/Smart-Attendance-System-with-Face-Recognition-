# Attendance Management System

A modern, clean, and elegant attendance management system built with React, TypeScript, and Tailwind CSS. This frontend application is designed to integrate with a Python-based computer vision backend for face recognition and ID verification.

## Features

- **Dashboard**: Overview of attendance statistics with interactive charts
- **Live Attendance**: Real-time face recognition and ID verification interface
- **Student Management**: View, search, and filter student records
- **Reports**: Generate attendance reports with date range filters and CSV export
- **Settings**: Configure camera, confidence threshold, and system preferences
- **Authentication**: Secure admin login with protected routes

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation and routing
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **Lucide React** - Icons

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── Header.tsx       # Top header bar
│   │   └── Layout.tsx       # Main layout wrapper
│   ├── ui/
│   │   ├── Card.tsx         # Reusable card component
│   │   ├── Button.tsx       # Reusable button component
│   │   └── Table.tsx        # Table and pagination components
│   ├── charts/
│   │   └── AttendanceChart.tsx  # Chart.js wrapper
│   └── ProtectedRoute.tsx   # Route protection component
│
├── pages/
│   ├── Login.tsx            # Login page
│   ├── Dashboard.tsx        # Dashboard with stats
│   ├── LiveAttendance.tsx   # Live attendance tracking
│   ├── Students.tsx         # Student management
│   ├── Reports.tsx          # Reports and analytics
│   └── Settings.tsx         # System settings
│
├── services/
│   └── api.ts               # API service with mock data
│
├── hooks/
│   └── useAuth.tsx          # Authentication hook
│
├── types/
│   └── index.ts             # TypeScript type definitions
│
├── utils/
│   └── helpers.ts           # Utility functions
│
├── App.tsx                  # Main app component with routing
└── main.tsx                 # Application entry point
```

## Demo Credentials

- **Email**: admin@college.edu
- **Password**: admin123

## Pages Overview

### 1. Login Page
- Clean, centered authentication form
- Email and password validation
- Remember me functionality
- Demo credentials displayed

### 2. Dashboard
- Total students count
- Today's attendance statistics
- Weekly attendance trend chart
- Recent activity feed
- Department-wise attendance breakdown

### 3. Live Attendance
- Camera feed placeholder
- Face detection status
- ID card verification status
- Real-time activity log
- Start/Stop session controls

### 4. Students
- Searchable student table
- Department filter
- Pagination
- View student details

### 5. Reports
- Date range filter
- Attendance statistics cards
- Bar chart visualization
- Detailed attendance records table
- CSV export functionality

### 6. Settings
- Camera device selection
- Confidence threshold slider
- Notification preferences
- Auto-export settings
- System information panel

## Design Guidelines

- **Colors**: Soft gray, white, navy blue, and muted accents
- **Typography**: Inter font family
- **Spacing**: Consistent 8px grid system
- **Components**: Rounded cards with subtle shadows
- **Responsive**: Mobile-friendly design

## API Integration

The application includes a mock API service (`src/services/api.ts`) that simulates backend responses. To connect to your Python backend:

1. Update the `API_BASE_URL` in `src/services/api.ts`
2. Replace mock implementations with actual API calls
3. Ensure the backend endpoints match the expected structure

### Expected API Endpoints

- `POST /api/login` - User authentication
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/weekly` - Weekly attendance data
- `GET /api/students` - List all students
- `POST /api/attendance/start` - Start attendance session
- `POST /api/attendance/stop` - Stop attendance session
- `GET /api/attendance/records` - Get attendance records
- `GET /api/settings` - Get system settings
- `PUT /api/settings` - Update system settings

## Customization

### Changing Colors

Edit `tailwind.config.js` to customize the color scheme:

```js
theme: {
  extend: {
    colors: {
      primary: {...},
      secondary: {...}
    }
  }
}
```

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route in `src/App.tsx`
3. Add navigation link in `src/components/layout/Sidebar.tsx`

## Best Practices

- All routes except `/login` are protected
- Loading states are handled for async operations
- Error handling is implemented for API calls
- Components are reusable and well-structured
- TypeScript provides full type safety

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is created for educational purposes.

## Support

For issues or questions, please create an issue in the repository.
