const db = require('_helpers/db');
const { v4: uuidv4 } = require('uuid')
const security = require('_helpers/security.check');

require('dotenv').config();

const Daily = db.Task;

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};

async function createTask(taskParam, payload) {
    const company = await security.checkCompany(payload.sub);


}

async function getTasks(payload) {
    const company = await security.checkCompany(payload.sub);
    const tasks = await Daily.find({ company: payload.sub }, { "__v": 0, "company": 0 });
    return tasks
}

async function updateTask(taskParam, payload) {
    const company = await security.checkCompany(payload.sub);

}

async function deleteTask(taskParam, payload) {
    const company = await security.checkCompany(payload.sub);
    await Daily.deleteOne(taskParam._id);
    return { message: "Success" }
}