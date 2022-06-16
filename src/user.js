const fs = require('fs').promises;
const {pick} = require('lodash');
const { v4: uuid } = require('uuid');
const {USER_DB, throwError} = require('./constants.js');

const createUser = (name) => {
  return {
    id: uuid(),
    name,
    workouts: []
  }
}

const validUserFields = ['name', 'workouts'];

const addUser = async (name) => {
  const newUser = createUser(name);
  const data = await fs.readFile(USER_DB, 'utf-8').catch(throwError);

  const userArray = data.length ? JSON.parse(data) : [];
  userArray.push(newUser)

  await fs.writeFile(USER_DB, JSON.stringify(userArray)).catch(err => {
    throw err
  });
  return 'success';
}

// newData should be object with updated fields
const updateUser = async (id, newData) => {
  const users = await readAllUsers().catch(throwError);

  const userIdx = users.findIndex(u => u.id === id);

  if (userIdx < 0) {
    throw new Error('User does not exist!')
  }

  const user = users[userIdx];

  const pickedNewData = pick(newData, validUserFields)
  const updatedUser = {
    ...user,
    ...pickedNewData,
  };

  users[userIdx] = updatedUser;

  await fs.writeFile(USER_DB, JSON.stringify(users)).catch(throwError);

  return 'success'
}

const readAllUsers = async (id) => {
  const data = await fs.readFile(USER_DB, 'utf-8').catch(throwError);  

  const userArray = data.length ? JSON.parse(data) : [];

  return userArray.length ? userArray : [];
}

const readUserById = async (id) => {
  const data = await fs.readFile(USER_DB, 'utf-8').catch(throwError);  

  const userArray = data.length ? JSON.parse(data) : [];

  const user = userArray.find(user => user.id === id);
  return user || {};
}

// addUser('Mark')
// readUserById('05718696-fbc7-4b36-82fd-10b742d992a0')/

module.exports = {
  addUser,
  readUserById,
  readAllUsers,
  updateUser,
}