import session from 'express-session';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import 'dotenv/config';

const MongoDBStore = connectMongoDBSession(session);

const setupSessionStore = () => {
    const store = new MongoDBStore({
        uri: process.env.DATABASE_URL,
        databaseName: 'media_review_app'
    });
    store.on('error', (error) => {
        console.error('Session store error:', error);
    });
    return store;
};

export default setupSessionStore;