
exports.up = function (knex, Promise) {
    return knex.schema.createTable('designs', function (table) {
        table.increments('id').primary();
        table.string('name');
        table.json('value')
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('books')
};
