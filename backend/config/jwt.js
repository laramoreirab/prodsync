import dotenv from 'dotenv'

dotenv.config()

export const JWT_CONFIG = {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    rememberExpiresIn: process.env.JWT_REMEMBER_EXPIRES_IN || '30d'
};
