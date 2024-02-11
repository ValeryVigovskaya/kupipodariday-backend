export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3001,
  },
  database: {
    host: process.env.HOST_DB || 'localhost',
    port: parseInt(process.env.PORT_DB, 10) || 5432,
    user: process.env.USERNAME || 'student',
    password: process.env.PASSWORD || 'student',
    name: process.env.NAME_DB || 'kupipodariday',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'jwt_secret_key',
  },
});
