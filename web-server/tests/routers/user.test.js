const request = require('supertest');
const app = require('../../src/appSetup');
const User = require('../../src/models/user');
const {userId, userData, initDataBase} = require('../fixtures/db');

describe('router user tests', () => {
  beforeEach(async () => {
    this.newUserData = {
      name:'testUser',
      email:'testuser@test.com',
      password: '1234567',
      age: 2
    };
    await initDataBase();
  });
  it('create new user', async () => {
    const resp = await request(app).post('/api/user')
    .send(this.newUserData)
    .expect(201);
    // assert the data is actaully in db
    const createdUser = await User.findOne({email: this.newUserData.email});
    expect(createdUser).not.toBeNull();
    const userTokens = createdUser.tokens;
    // assert the response
    expect(resp.body.user).toMatchObject({
      name: this.newUserData.name,
      email: this.newUserData.email,
      age: this.newUserData.age
    });
    expect(resp.body.token).toBe(userTokens[userTokens.length-1].token);
  });
  it('login existing user', async () => {
    let loginUser = await User.findById(userId[0]);
    const resp = await request(app).post('/api/user/login')
    .send({
      email: userData[0].email,
      password: userData[0].password
    }).expect(200);
    loginUser = await User.findById(userId[0]);
    expect(loginUser).not.toBeNull();
    const userTokens = loginUser.tokens;
    expect(resp.body.token).toBe(userTokens[userTokens.length-1].token);
  });
  it('can not login existing user with wrong pass', async () => {
    await request(app).post('/api/user/login')
    .send({
      email: userData[0].email,
      password: '1234568'
    }).expect(401);
  });
  it('success auth to get user profile when having token', async () => {
    const userAuthToken = userData[0].tokens[0].token;
    await request(app).get('/api/user/me')
    .set('Authorization', `Bearer ${userAuthToken}`)
    .send()
    .expect(200);
  });
  it('failed auth to get user profile when not having token', async () => {
    await request(app).get('/api/user/me')
    .send()
    .expect(401);
  });
  it('deleted account when having token', async () => {
    const userAuthToken = userData[0].tokens[0].token;
    await request(app).delete('/api/user/me')
    .set('Authorization', `Bearer ${userAuthToken}`)
    .send()
    .expect(200);
    const user = await User.findById(userId[0]);
    expect(user).toBeNull();
  });
  it('deleted account when having token', async () => {
    await request(app).delete('/api/user/me')
    .send()
    .expect(401);
  });
  it('upload avatar', async () => {
    const userAuthToken = userData[0].tokens[0].token;
    await request(app).post('/api/user/me/avatar')
    .set('Authorization', `Bearer ${userAuthToken}`)
    .attach('avatar', './web-server/tests/fixtures/avatar.png')
    .expect(200);
    const user = await User.findById(userId[0]);
    expect(user.avatar).toEqual(expect.any(Buffer));
  });
  it('should update user successfully', async () => {
    const userAuthToken = userData[0].tokens[0].token;
    const resp = await request(app).patch('/api/user/me')
    .set('Authorization', `Bearer ${userAuthToken}`)
    .send({
      name: 'newName'
    })
    .expect(200);
    expect(resp.body.name).toBe('newName');
    const user = await User.findById(userId[0]);
    expect(user.name).toBe('newName');
  });
  it('should update user successfully', async () => {
    const userAuthToken = userData[0].tokens[0].token;
    await request(app).patch('/api/user/me')
    .set('Authorization', `Bearer ${userAuthToken}`)
    .send({
      address: 'my address'
    })
    .expect(400);
    const user = await User.findById(userId[0]);
    expect(user.name).toBe(userData[0].name);
  });
});