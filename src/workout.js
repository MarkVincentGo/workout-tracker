const fs = require('fs').promises;
const { v4: uuid } = require('uuid');
const {WORKOUTS_DB} = require('./constants.js');

const createWorkout = (name) => {
  return {
    id: uuid(),
    name,
  }
}

const addWorkout = async (name) => {
  const newWorkout = createWorkout(name);
  const data = await fs.readFile(WORKOUTS_DB, 'utf-8').catch(err => {
    throw err;
  });

  let workoutArray = [];
  if (data.length) {
    workoutArray = JSON.parse(data);
  }

  const existingWorkout = workoutArray.find(workout => workout.name === name);
  if (existingWorkout) {
    throw new Error('Workout already exists!');
  }

  workoutArray.push(newWorkout);

  await fs.writeFile(WORKOUTS_DB, JSON.stringify(workoutArray)).catch(err => {
    throw err;
  })
  return 'success';
}

const readAllWorkouts = async () => {
  const data = await fs.readFile(WORKOUTS_DB, 'utf-8').catch(err => {
    throw err;
  });

  let workoutArray = [];
  if (data.length) {
    workoutArray = JSON.parse(data);
  };

  return workoutArray.length ? workoutArray : []; 
}

const readWorkout = async (workoutId) => {
  const data = await fs.readFile(WORKOUTS_DB, 'utf-8').catch(err => {
    throw err;
  });

  let workoutArray = [];
  if (data.length) {
    workoutArray = JSON.parse(data);
  };

  const workout = workoutArray.find(workout => workout.id === workoutId);
  return workout || {} 
}

const deleteWorkouts = async (workoutId) => {
  const data = await fs.readFile(WORKOUTS_DB, 'utf-8').catch(err => {
    throw err;
  });

  let workoutArray = [];
  if (data.length) {
    workoutArray = JSON.parse(data);
  };

  const filteredWorkouts = workoutArray.filter(workout => workout.id !== workoutId);
  await fs.writeFile(WORKOUTS_DB, JSON.stringify(filteredWorkouts)).catch(err => {
    throw err;
  });

  return 'success';
}

// writeUser('Mark')
// readUserById('05718696-fbc7-4b36-82fd-10b742d992a0')/

module.exports = {
  addWorkout,
  readWorkout,
  readAllWorkouts,
  deleteWorkouts,
}