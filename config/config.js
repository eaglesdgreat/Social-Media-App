const config = {
        env: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 3030,
        jwtSecret: process.env.JWT_SECRET || 'your_secret_key',
        mongoUri: process.env.MONGO_HOST || 'mongodb://localhost/media'
}

export default config