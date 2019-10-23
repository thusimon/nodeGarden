const users = {};

const addUser = (id, name, room) => {
  name = name.trim();
  room = room.trim();

  if (!name || !room) {
    return { err: 'name and room cannot be empty'};
  }

  const roomUsers = users[room] || [];
  const findUser = roomUsers.find(user => (user.name==name));

  if (findUser) {
    return { err: 'name is already taken'};
  }

  const user = {id, name};
  roomUsers.push(user);
  users[room] = roomUsers;
  return {user: {...user, room}};
}

const removeUser = (id) => {
  for (let room in users) {
    const roomUsers = users[room];
    const idx = roomUsers.findIndex(user => user.id==id);
    if (idx > -1) {
      const findUser = roomUsers.splice(idx, 1);
      return {...findUser[0], room};
    }
  }
}

const getUser = (id) => {
  for (let room in users) {
    const roomUsers = users[room];
    const idx = roomUsers.findIndex(user => user.id==id);
    if (idx > -1) {
      return {...roomUsers[idx], room};
    }
  }
}

const getUsersInRoom = (room) => {
  return users[room];
}

const getUsers = () => {
  return users;
}

module.exports = {addUser, removeUser, getUser, getUsersInRoom, getUsers};