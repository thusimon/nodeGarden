const users = [];

const addUser = (id, name, room) => {
  name = name.trim();
  room = room.trim();

  if (!name || !room) {
    return { err: 'name and room cannot be empty'};
  }

  const findUser = users.find(user => (user.name==name && user.room==room));

  if (findUser) {
    return { err: 'name is already taken'};
  }

  const user = {id, name, room};
  users.push(user);
  return {user};
}

const removeUser = (id) => {
  const idx = users.findIndex(user => user.id==id);
  if (idx > -1) {
    return users.splice(idx, 1);
  }
}

const getUser = (id) => {
  return users.find(user => user.id==id);
}

const getUsersInRoom = (room) => {
  return users.filter(user => user.room==room);
}

module.exports = {addUser, removeUser, getUser, getUsersInRoom};