# Riwi Nexus - Frontend Application

A modern, responsive Single Page Application (SPA) built for Riwi Nexus, providing an intuitive interface for human resources management. This frontend client offers role-based dashboards, dynamic forms for HR procedures, and real-time notifications, delivering a seamless user experience across all organizational levels.

The application features a **Vanilla JavaScript ES6+ architecture** with **TailwindCSS styling**, **Vite build system**, and **FullCalendar integration** for visual event management. It demonstrates modern frontend development patterns with component-based architecture, responsive design, and optimized performance.

---

## 📋 Project Information

- **Project:** Riwi Nexus - HR Management Platform
- **Team:** Nexus-code
- **Repository:** Frontend Application

---

## 🎯 Core Features

- ✅ **Single Page Application (SPA):** Fast navigation with Navigo router for seamless user experience
- ✅ **Role-Based Authentication:** Secure login system with three access levels (Employee, Leader, HR Admin)
- ✅ **Dynamic HR Forms:** Interactive forms for vacation, leave, and certificate requests with real-time validation
- ✅ **Management Dashboards:** Comprehensive dashboards tailored for employees and administrators
- ✅ **Real-Time Notifications:** Live notification system with visual indicators and updates
- ✅ **Responsive Design:** Mobile-first approach with TailwindCSS for optimal viewing across all devices
- ✅ **Calendar Integration:** FullCalendar implementation for visual event and request management
- ✅ **Component Architecture:** Modular component system for maintainable and reusable code
- ✅ **Loading States:** Professional skeleton loaders and loading indicators for better UX
- ✅ **Modern Build System:** Vite-powered development with hot module replacement and optimized production builds

---

## �️ Technologies Used

- **Core:** HTML5, CSS3, JavaScript ES6+
- **Styling:** TailwindCSS ^3.4.4 for utility-first responsive design
- **Build Tool:** Vite ^5.3.1 for fast development and optimized builds
- **Router:** Navigo ^8.11.1 for SPA navigation
- **Calendar:** FullCalendar ^6.1.19 with day grid and interaction plugins
- **CSS Processing:** PostCSS ^8.4.38 with Autoprefixer ^10.4.19

---

## 📁 Project Structure

```
Nexus-Code-Frontend/
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── LICENSE                     # Project license
├── README.md                   # This documentation
├── index.html                  # Main HTML entry point
├── package.json                # Project dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # TailwindCSS configuration
├── .github/
│   └── CODEOWNERS             # Repository ownership rules
├── guidelines/                 # Team documentation
│   ├── coding_style.md        # Code style guidelines
│   └── plan.md                # Project planning documentation
├── public/                     # Static assets
│   ├── _redirects             # Netlify redirect rules
│   └── images/                # Image assets
│       ├── hidden.png
│       ├── login-illustration.png
│       ├── logo-dark.png
│       ├── logo-light.webp
│       ├── logo-riwi.ico
│       └── visible.png
└── src/                       # Source code
    ├── main.js                # Application entry point
    ├── assets/                # CSS and other assets
    ├── components/            # Reusable UI components
    │   ├── Calendar.js        # Calendar component with FullCalendar
    │   ├── FormHelpers.js     # Form utility functions
    │   ├── Layout.js          # Main layout component
    │   ├── LoadingStates.js   # Loading state components
    │   ├── Navbar.js          # Navigation bar component
    │   ├── NotificationBell.js # Notification system component
    │   ├── Sidebar.js         # Sidebar navigation component
    │   └── SkeletonLoader.js  # Skeleton loading components
    └── pages/                 # Page components
        ├── Dashboard.js       # Main dashboard page
        ├── EditEmployee.js    # Employee editing form
        ├── Forbidden.js       # Access denied page
        ├── ForgotPassword.js  # Password recovery page
        ├── Login.js           # Authentication page
        ├── ManageUsers.js     # User management interface
        ├── ManagerRequests.js # Request management for leaders
        ├── MyRequests.js      # Employee's personal requests
        ├── NewEmployee.js     # Employee creation form
        └── NewRequest.js      # Request creation form
```


## � Dependencies & Versions

### Core Dependencies

- **@fullcalendar/core** ^6.1.19 → Core calendar functionality for event management
- **@fullcalendar/daygrid** ^6.1.19 → Day grid view plugin for calendar
- **@fullcalendar/interaction** ^6.1.19 → Interactive calendar features (drag, drop, select)
- **navigo** ^8.11.1 → Lightweight SPA router for seamless navigation

### Development Dependencies

- **vite** ^5.3.1 → Next-generation frontend build tool with HMR
- **tailwindcss** ^3.4.4 → Utility-first CSS framework for rapid UI development
- **postcss** ^8.4.38 → CSS transformation and optimization tool
- **autoprefixer** ^10.4.19 → Automatic vendor prefix handling for CSS

---

## ⚙️ Prerequisites

- **Node.js** >=18.0.0
- **npm** >=9.0.0

---

## 🚀 Installation & Setup

### 🔹 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TonyS-dev/Nexus-Code-Frontend.git
   cd Nexus-Code-Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_API_TIMEOUT=10000
   
   # Application Configuration
   VITE_APP_NAME=Riwi Nexus
   VITE_APP_VERSION=1.0.0
   
   # Development Configuration
   VITE_DEV_MODE=true
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

5. **Build for production:**
   ```bash
   npm run build
   ```

6. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 🔧 Available Scripts

- `npm run dev` → Start development server with hot module replacement
- `npm run build` → Build optimized production bundle
- `npm run preview` → Preview production build locally
- `npm run lint` → Run ESLint code analysis
- `npm run format` → Format code with Prettier

---

## 🏗️ Component Architecture

### Core Components

- **Layout.js:** Main application layout with responsive sidebar and navigation
- **Navbar.js:** Top navigation bar with user profile and quick actions
- **Sidebar.js:** Collapsible sidebar navigation with role-based menu items
- **NotificationBell.js:** Real-time notification system with unread count indicators

### UI Components

- **Calendar.js:** FullCalendar integration for request and event visualization
- **FormHelpers.js:** Reusable form validation and help9er utilities
- **LoadingStates.js:** Loading spinners and state management components
- **SkeletonLoader.js:** Skeleton loading placeholders for better UX

### Page Components

- **Dashboard.js:** Role-specific dashboard with analytics and quick actions
- **Login.js:** Authentication interface with form validation
- **MyRequests.js:** Employee personal request management interface
- **ManagerRequests.js:** Leader request approval and management interface
- **ManageUsers.js:** HR admin user management interface
- **NewEmployee.js / EditEmployee.js:** Employee CRUD operations
- **NewRequest.js:** Request creation interface with dynamic form fields

---

## 🎨 UI/UX Features

- **Responsive Design:** Mobile-first approach with TailwindCSS utilities
- **Dark/Light Theme:** Theme switching capability with persistent user preferences
- **Accessibility:** ARIA labels, keyboard navigation, and screen reader support
- **Loading States:** Skeleton loaders and loading indicators for better perceived performance
- **Form Validation:** Client-side validation with real-time feedback
- **Toast Notifications:** Non-intrusive success and error message system

---

## 📱 Browser Support

- **Chrome:** Latest stable version
- **Firefox:** Latest stable version
- **Safari:** Latest stable version
- **Edge:** Latest stable version
- **Mobile:** iOS Safari, Chrome Mobile, Samsung Internet

---

## 📝 Code Quality & Architecture

- **Component-Based Architecture:** Modular design with reusable components
- **ES6+ Modern JavaScript:** Arrow functions, destructuring, async/await patterns
- **Separation of Concerns:** Clear distinction between UI logic, API calls, and state management
- **DRY Principle:** Centralized utilities for common operations
- **Responsive Design Patterns:** Mobile-first approach with progressive enhancement
- **Performance Optimization:** Code splitting, lazy loading, and optimized asset delivery

---

## 📋 Team

**Team:** Nexus-code  
**Repository:** Frontend Application