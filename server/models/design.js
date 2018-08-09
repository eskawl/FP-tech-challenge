const bookshelf = require('../bookshelf');

const Design = bookshelf.Model.extend({
    tableName: 'designs'
});

module.exports = Design;