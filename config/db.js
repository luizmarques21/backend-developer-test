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

async function saveJobDraft(newJob) {
    const client = await connect();
    const sql = 'INSERT INTO jobs(company_id, title, description, location, notes) VALUES ($1, $2, $3, $4, $5)';
    const values = [newJob.company_id, newJob.title, newJob.description, newJob.location, newJob.notes];
    await client.query(sql, values);
}

module.exports = { listCompanies, getCompany, saveJobDraft }