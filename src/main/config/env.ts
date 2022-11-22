export default {
  port: process.env.PORT || 5000,
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/hands-on-libras',
  jwtSecret: process.env.JWT_SECRET || 'tj67O==5H',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || 3600,
  nodeMailerConfig: {
    host: process.env.NODE_MAILER_HOST || 'smtp.ethereal.email',
    port: process.env.NODE_MAILER_PORT || 587,
    user: process.env.NODE_MAILER_USER || 'robert.pfeffer50@ethereal.email',
    pass: process.env.NODE_MAILER_PASS || 'fMDQFEE2p8rB5SSvER'
  }
}
