const db = require('_helpers/db');
const { v4: uuidv4 } = require('uuid')
const security = require('_helpers/security.check');

require('dotenv').config();

const Task = db.Task;

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};

async function createTask(taskParam, payload) {
    const company = await security.checkCompany(payload.sub);
    const task = security.validateTask(taskParam);
    task.company = payload.sub;
    await task.save();
    return task
}

async function getTasks(payload) {
    const company = await security.checkCompany(payload.sub);
    return await Task.find({ company: payload.sub }, { "__v": 0, "company": 0 });
}

async function updateTask(taskParam, payload) {
    const company = await security.checkCompany(payload.sub);

    if (taskParam.task == null) {
        throw ("Task ID is required")
    }

    const task = await Task.findById({ _id: taskParam.task, company: payload.sub }, { "__v": 0, "company": 0 });
    const updatedTask = security.validateTaskUpdate(task, taskParam);

    await updatedTask.save();
    return updatedTask

}

async function deleteTask(taskParam, payload) {
    const company = await security.checkCompany(payload.sub);

    if (taskParam.task == null) {
        throw ("Task ID is required")
    }

    await Task.deleteOne({ _id: taskParam.task, company: payload.sub });
    return { message: "Success" }
}