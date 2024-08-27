/src
│
├── /api
│ ├── /queries
│ │ └── [entity].ts # React Query hooks for fetching data
│ ├── /mutations
│ │ └── [entity].ts # React Query hooks for mutating data
│ └── apiClient.ts # Axios or fetch client setup
│
├── /components
│ ├── /[ComponentName]
│ │ ├── index.tsx # Main component file
│ │ ├── [ComponentName].tsx # Component implementation
│ │ └── [ComponentName].styles.ts # Optional: styles related to the component
│ └── index.ts # Barrel file to export components
│
├── /features
│ ├── /[FeatureName]
│ │ ├── [FeatureName]Slice.ts # Redux slice
│ │ ├── [FeatureName]Selectors.ts # Redux selectors
│ │ ├── [FeatureName]Actions.ts # Redux actions
│ │ ├── [FeatureName].types.ts # TypeScript types
│ │ ├── /components
│ │ │ └── [Component].tsx # Components specific to the feature
│ │ ├── /hooks
│ │ │ └── use[Feature].ts # Hooks specific to the feature
│ │ └── /services
│ │ └── [Feature]Service.ts # Business logic specific to the feature
│ └── index.ts # Barrel file for all features
│
├── /hooks
│ ├── use[CustomHook].ts # Custom hooks shared across the app
│ └── index.ts # Barrel file to export hooks
│
├── /layout
│ ├── Header.tsx # Layout component (e.g., header, footer)
│ ├── Footer.tsx
│ └── index.ts # Barrel file to export layout components
│
├── /pages
│ ├── /[PageName]
│ │ ├── [PageName].tsx # Page component
│ │ └── [PageName].styles.ts # Optional: styles specific to the page
│ └── index.ts # Barrel file to export pages
│
├── /redux
│ ├── rootReducer.ts # Root reducer combining all slices
│ ├── store.ts # Redux store configuration
│ └── [Middleware].ts # Custom middlewares if any
│
├── /routes
│ ├── AppRouter.tsx # Main router configuration
│ ├── PrivateRoute.tsx # Route protection component
│ └── index.ts # Barrel file to export routes
│
├── /styles
│ ├── /themes
│ │ └── [ThemeName].ts # Theme definitions
│ ├── globalStyles.ts # Global styles
│ └── index.ts # Barrel file to export styles
│
├── /types
│ ├── [Feature].d.ts # TypeScript definitions shared across features
│ ├── react-app-env.d.ts # React environment types
│ └── index.ts # Barrel file to export types
│
├── /utils
│ ├── [utility].ts # General utility functions
│ └── index.ts # Barrel file to export utilities
│
├── App.tsx # Main application component
├── index.tsx # Entry point
└── react-query-client.ts # React Query client setup
