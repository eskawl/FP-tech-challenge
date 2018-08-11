const { getConnection } = require('./utils')

const knex = require('knex')({
    client: 'mysql',
    connection: getConnection(),
});

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;