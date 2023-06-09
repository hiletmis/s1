const db = require('_helpers/db');
const { v4: uuidv4 } = require('uuid')
const security = require('_helpers/security.check');

require('dotenv').config();

const Job = db.Job;

module.exports = {
    createJob,
    getJobs,
    updateJob,
    deleteJob
};

async function createJob(jobParam, payload) {
    const company = await security.checkCompany(payload.sub);
    const job = security.validateJob(jobParam);
    job.company = payload.sub;
    await job.save();
    return job
}

async function getJobs(payload) {
    const company = await security.checkCompany(payload.sub);
    return await Job.find({ company: payload.sub }, { "__v": 0, "company": 0 });
}

async function updateJob(jobParam, payload) {
    const company = await security.checkCompany(payload.sub);

    if (jobParam.job == null) {
        throw ("Job ID is required")
    }

    const job = await Job.findById({ _id: jobParam.job, company: payload.sub }, { "__v": 0, "company": 0 });
    const updatedJob = security.validateJobUpdate(job, jobParam);

    await updatedJob.save();
    return updatedJob

}

async function deleteJob(jobParam, payload) {
    const company = await security.checkCompany(payload.sub);

    if (jobParam.job == null) {
        throw ("Job ID is required")
    }

    await Job.deleteOne({ _id: jobParam.job, company: payload.sub });
    return { message: "Success" }
}