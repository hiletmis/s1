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

    if (taskParam.title == null) {
        throw ("Title is required")
    }

    if (taskParam.description == null) {
        throw ("Description is required")
    }

    if (taskParam.location == null) {
        throw ("Location is required")
    }

    if (taskParam.period == null) {
        throw ("Period is required")
    }

    const task = new Task(taskParam);
    task._id = uuidv4();
    task.company = payload.sub;

    await task.save();
    return task
}

async function getTasks(payload) {
    const company = await security.checkCompany(payload.sub);
    const tasks = await Task.find({ company: payload.sub }, { "__v": 0, "company": 0 });
    return tasks
}

async function updateTask(taskParam, payload) {
    const company = await security.checkCompany(payload.sub);

}

async function deleteTask(taskParam, payload) {
    const company = await security.checkCompany(payload.sub);
    await Task.deleteOne(taskParam._id);
    return { message: "Success" }
}