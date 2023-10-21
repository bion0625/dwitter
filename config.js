import dotenv from 'dotenv';
dotenv.config();

const required = (key, defaultValue = undefined) => {
    const value = process.env[key] || defaultValue;
    if(value == null){
        throw new Error(`Key ${key} is undefined`)
    }
    return value;
}
export const config = {
    jwt: {
        secretKey: required('JWT_SECRET'),
        expiresInSec: parseInt(required('JET_EXPRIE_SEC', 86400))
    },
    becrypt: {
        saltRounds: parseInt(required('BCRYPT_SOLT_ROUNDS', 12))
    },
    port: parseInt(required('PORT', 8080)),
    db: {
        host: required('DB_HOST'),
        user: required('DB_USER'),
        database: required('DB_DATABASE'),
        password: required('DB_PASSWORD'),
    },
    cors: {
        allowedOrigin: required('CORS_ALLOW_ORIGIN')
    },
    csrf: {
        plainToken: required('CSRF_SECRET_KEY')
    },
}