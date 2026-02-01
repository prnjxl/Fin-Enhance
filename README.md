structure of the project

project-root/
│
├── frontend/                # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/        # images, icons, fonts
│   │   ├── components/    # reusable UI components
│   │   ├── pages/         # page-level components
│   │   ├── layouts/       # navbar, sidebar layouts
│   │   ├── services/      # API calls
│   │   ├── hooks/         # custom React hooks
│   │   ├── context/       # global context/state
│   │   ├── redux/         # (optional) Redux store
│   │   ├── utils/         # helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/                # Node + Express backend
│   ├── config/            # DB & environment config
│   │   └── db.js
│   │
│   ├── controllers/       # request handling logic
│   │   └── userController.js
│   │
│   ├── models/            # MongoDB schemas
│   │   └── User.js
│   │
│   ├── routes/            # Express routes
│   │   └── userRoutes.js
│   │
│   ├── middleware/        # auth, error handling
│   │   └── authMiddleware.js
│   │
│   ├── services/          # business logic
│   ├── utils/             # helper utilities
│   ├── server.js          # entry point
│   └── package.json
│
├── .env
├── .gitignore
├── package.json           # optional root scripts
└── README.md