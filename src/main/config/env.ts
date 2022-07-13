export default {
  port: process.env.PORT || 5000,
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/hands-on-libras',
  jwtSecret: process.env.JWT_SECRET || 'tj67O==5H',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || 3600
}
