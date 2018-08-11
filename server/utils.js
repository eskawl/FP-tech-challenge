const devMode = process.env.NODE_ENV === 'development';


exports.getConnection = () => {
    let connection;
    
    if (devMode) {
        connection= {
            host: '127.0.0.1',
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB,
        }
    } else {
        connection = process.env.CLEARDB_DATABASE_URL
    }

    return connection;
}

