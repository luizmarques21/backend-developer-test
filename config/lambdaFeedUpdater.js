const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});
const s3 = new AWS.S3();

async function storeJobs(jobs) {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: process.env.JOBS_OBJECT_KEY,
        Body: JSON.stringify(jobs)
    };

    await s3.putObject(params).promise();
}

exports.handler = async (event) => {
    let jobs = JSON.parse(event.Records[0].body);

    jobs = jobs.filter((job) => { job.status == 'published' });

    await storeJobs(jobs);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Jobs stored successfully in S3' })
    };
}