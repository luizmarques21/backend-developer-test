async function connect() {
    if (global.connection) {
        return global.connection.connect();
    }

    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING
    });

    console.log('Criou pool de conexões no PostgreSQL');

    global.connection = pool;
    return pool.connect();
}

async function listCompanies() {
    const client = await connect();
    const res = await client.query('SELECT * FROM companies');
    return res.rows;
}

async function getCompany(companyId) {
    const client = await connect();
    const res = await client.query('SELECT * FROM companies WHERE id = $1', [companyId]);
    return res.rows[0];
}

module.exports = { listCompanies, getCompany }