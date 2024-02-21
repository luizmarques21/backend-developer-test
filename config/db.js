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
    client.release();
    return res.rows;
}

async function getCompany(companyId) {
    const client = await connect();
    const res = await client.query('SELECT * FROM companies WHERE id = $1', [companyId]);
    client.release();
    return res.rows[0];
}

async function saveJobDraft(newJob) {
    const client = await connect();
    const sql = 'INSERT INTO jobs(company_id, title, description, location) VALUES ($1, $2, $3, $4)';
    const values = [newJob.company_id, newJob.title, newJob.description, newJob.location];
    await client.query(sql, values);
    client.release();
}

async function updateJob(newJob) {
    const client = await connect();
    const sql = 'UPDATE jobs SET title = $1, location = $2, description = $3 WHERE id = $4';
    const values = [newJob.title, newJob.location, newJob.description, newJob.id];
    await client.query(sql, values);
    client.release();
}

async function publishJob(job_id) {
    const client = await connect();
    const sql = 'UPDATE jobs SET status = $1 WHERE id = $2';
    const values = ['published', job_id];
    await client.query(sql, values);
    client.release();
}

async function archiveJob(job_id) {
    const client = await connect();
    const sql = 'UPDATE jobs SET status = $1 WHERE id = $2';
    const values = ['archived', job_id];
    await client.query(sql, values);
    client.release();
}

async function deleteJob(job_id) {
    const client = await connect();
    await client.query('DELETE FROM jobs WHERE id = $1', [job_id]);
    client.release();
}

async function getJob(jobId) {
    const client = await connect();
    const res = await client.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
    client.release();
    return res.rows[0];
}

module.exports = { 
    listCompanies, 
    getCompany, 
    saveJobDraft, 
    updateJob, 
    publishJob,
    archiveJob,
    deleteJob,
    getJob
}