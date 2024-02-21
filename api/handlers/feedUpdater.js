const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});
const s3 = new AWS.S3();

async function getPublishedJobs() {
    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING
    });
    const client = pool.connect();
    const sql = `SELECT j.id, title, description, c.name AS company_name, j.created_at FROM jobs j
                LEFT JOIN companies c ON j.company_id = c.id
                WHERE status = $1`;
    const res = await client.query(sql, ['published'])
    client.release();

    return res.rows;
}

async function storeJobs(jobs) {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: process.env.JOBS_OBJECT_KEY,
        Body: JSON.stringify(jobs)
    };

    await s3.putObject(params).promise();
}

exports.handler = async () => {
    try {
        const jobs = await getPublishedJobs();

        await storeJobs(jobs);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Jobs stored successfully in S3' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
}