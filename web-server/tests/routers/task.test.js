const request = require('supertest');
const app = require('../../src/appSetup');
const Task = require('../../src/models/task');
const {userId, userData, taskData, initDataBase} = require('../fixtures/db');

describe('task router tests', () => {
  beforeEach(initDataBase);
  it('should create task for user', async () => {
    const userAuthToken = userData[0].tokens[0].token;
    const resp = await request(app).post('/api/task')
    .set('Authorization', `Bearer ${userAuthToken}`)
    .send({
      description: 'test task'
    })
    .expect(201);
    expect(resp.body.description).toBe('test task');
    const task = await Task.findById(resp.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toBe(false);
  });
  it('get correct task from user one', async () => {
    const userAuthToken = userData[0].tokens[0].token;
    const resp = await request(app).get('/api/task')
    .set('Authorization', `Bearer ${userAuthToken}`)
    .send()
    .expect(200);
    expect(resp.body.tasks.length).toBe(2);
  });
  it('can not delete user one task by user two', async () => {
    const userAuthToken = userData[1].tokens[0].token;
    const taskId = taskData[0]._id;
    await request(app).delete(`/api/task/${taskId}`)
    .set('Authorization', `Bearer ${userAuthToken}`)
    .send()
    .expect(404);
    // the original task is till here
    const task = await Task.findById(taskId);
    expect(task).not.toBeNull();
  })
})