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
    return await Task.find({ company: payload.sub }, { "__v": 0, "company": 0 });
}

async function updateTask(taskParam, payload) {
    const company = await security.checkCompany(payload.sub);

    if (taskParam.task == null) {
        throw ("Task ID is required")
    }

    const task = await Task.findById({ _id: taskParam.task, company: payload.sub }, { "__v": 0, "company": 0 });

    if (task == null) {
        throw ("Task does not exist")
    }

    if (taskParam.title != null) {
        task.title = taskParam.title
    }

    if (taskParam.description != null) {
        task.description = taskParam.description
    }

    if (taskParam.location != null) {
        task.location = taskParam.location;
    }

    if (taskParam.period != null) {
        task.period = taskParam.period;
    }

    if (taskParam.score != null) {
        task.score = taskParam.score;
    }

    if (taskParam.duration != null) {
        task.duration = taskParam.duration;
    }

    await task.save();
    return task

}

async function deleteTask(taskParam, payload) {
    const company = await security.checkCompany(payload.sub);

    if (taskParam.task == null) {
        throw ("Task ID is required")
    }

    await Task.deleteOne({ _id: taskParam.task, company: payload.sub });
    return { message: "Success" }
}