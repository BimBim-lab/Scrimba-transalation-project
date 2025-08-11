export const API_BASE =
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:3000/api/v1'
    : 'https://your-production-api.com/api/v1';