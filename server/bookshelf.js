const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB,
    }
});

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;