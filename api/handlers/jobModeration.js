const OpenAI = require('openai');
const openai = new OpenAI({
    organization: process.env.OPENAI_ORGANIZATION
});

async function updateJob(job) {
    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING
    });
    const client = pool.connect();
    const sql = 'UPDATE jobs SET status = $1, notes = $2 WHERE id = $3';
    const params = [job.status, job.notes, job.id];
    await client.query(sql, params);
    client.release();
}

exports.handler = async (event) => {
    try {
        const job = JSON.parse(event.Records[0].body);
        const textModeration = job.title + job.description;

        const moderation = await openai.moderations.create({ input: textModeration });
        const isFlagged = moderation.results.some((result) => { return result.flagged});

        let newJob = {};
        if (isFlagged) {
            newJob = {status: 'rejected', notes: JSON.stringify(moderation.results), ...job};
        } else {
            newJob = {status: 'published', ...job};
        }
        
        await updateJob(job);

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