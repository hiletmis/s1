const db = require('_helpers/db');
const { v4: uuidv4 } = require('uuid')
const security = require('_helpers/security.check');
const queryCheck = require('_helpers/query.check');

require('dotenv').config();

const Daily = db.Daily;
const Task = db.Task;

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};

async function createTask(taskParam, payload) {
    const isCompany = await security.checkCompany(payload.sub, true);
    const isUser = await security.getUser(payload.sub, true);

    if (isCompany == null && isUser == null) {
        throw ("Authentication Error")
    }

    const company = isCompany != null ? isCompany._id : isUser.company;
    const task = Task.findById({ _id: taskParam.task, company: company }, { "__v": 0, "company": 0 });

    if (task == null) {
        throw ("Task does not exist")
    }

    const daily = new Daily(taskParam);
    daily.company = company;

    await daily.save();
    return daily

}

async function getTasks(payload) {
    const isCompany = await security.checkCompany(payload.sub, true);
    const isUser = await security.getUser(payload.sub, true);

    if (isCompany == null && isUser == null) {
        throw ("Authentication Error")
    }

    const company = isCompany != null ? isCompany._id : isUser.company;
    const performedBy = isUser != null ? isUser._id : payload.performedBy;

    const query = queryCheck.taskQueryBuilder(payload, { company: company, performedBy: performedBy });

    return await Daily.find(query, { "__v": 0, "company": 0 });
}

async function updateTask(taskParam, payload) {
    const isCompany = await security.checkCompany(payload.sub, true);
    const isUser = await security.getUser(payload.sub, true);

    if (isCompany == null && isUser == null) {
        throw ("Authentication Error")
    }

    const company = isCompany != null ? isCompany._id : isUser.company;

    if (taskParam.task == null) {
        throw ("Task ID is required")
    }

    let query = { _id: taskParam.task, company: company };

    if (isUser != null) {
        query.performedBy = isUser._id;
    }

    const daily = await Daily.findById(query, { "__v": 0, "company": 0 });

    if (daily == null) {
        throw ("Task does not exist")
    }

    if (isCompany != null) {
        if (taskParam.performedBy != null) {
            const user = await security.getUser(taskParam.performedBy);
            daily.performedBy = user._id;
        }
    }

    if (taskParam.location != null) {
        daily.location = taskParam.location;
    }

    if (taskParam.status != null) {
        daily.status = taskParam.status;
    }

    if (taskParam.notes != null) {
        daily.notes = taskParam.notes;
    }

    if (isCompany != null) {
        if (taskParam.due_date != null) {
            daily.due_date = taskParam.due_date;
        }
    }

    await daily.save();
    return daily
}

async function deleteTask(taskParam, payload) {
    const company = await security.checkCompany(payload.sub);
    await Daily.deleteOne(taskParam._id);
    return { message: "Success" }
}