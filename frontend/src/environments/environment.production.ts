export const environment = {
  production: true,
  dataMode: 'static',
  seedDataBaseUrl: 'assets/seed-data',
  // Kept for local/API builds and learner visibility.
  apiBaseUrl: 'http://localhost:5001/api'
} as const;
