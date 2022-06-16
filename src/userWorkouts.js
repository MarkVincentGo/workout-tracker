const fs = require('fs').promises;
const { v4: uuid } = require('uuid');
const moment = require('moment');
const {readUserById, updateUser} = require('./user.js')
const {throwError} = require('./constants.js')
const {readWorkout} = require('./workout.js')

const createUserWorkoutEntry = ({date, weight, reps, effort}) => {
  return {
    id: uuid(),
    date,
    weight,
    reps,
    effort,
  }
}

/**
 * 
 * newUserWorkout = {
 * workoutId
 * weight
 * reps
 * effort
 * }
 *
 */


const addUserWorkout = async (userId, newUserWorkout) => {
  const {id} = newUserWorkout;
  try {
    const user = await readUserById(userId).catch(throwError);
    
    const workouts = [...user.workouts];

  const workoutIdx = workouts.findIndex(w => w.id === id);
    const newWorkoutHistoryEntry = createUserWorkoutEntry(newUserWorkout);
    
    // if workout is in history, add to history
    if (workoutIdx >= 0) {
      const modifiedWorkout = workouts[workoutIdx];
      modifiedWorkout.history = [
        ...modifiedWorkout.history,
        newWorkoutHistoryEntry,
      ]
      workouts[workoutIdx] = modifiedWorkout;
      updateUser(userId, {workouts})

    } else {
      const newWorkoutEntry = await readWorkout(id);
      newWorkoutEntry.history = [newWorkoutHistoryEntry];
      newWorkouts = [...workouts, newWorkoutEntry];
      await updateUser(userId, {workouts: newWorkouts})
    }



  } catch (err) {
    throw err;
  }

}



const readAllUserWorkouts = async (userId) => {
  try {
    const user = await readUserById(userId).catch(throwError);
    return uesr.workouts;
  } catch (err) {
    throw err;
  }
}

const readUserWorkoutByWorkoutId = async (userId, workoutId) => {
  try {
    const user = await readUserById(userId).catch(throwError);
    const selectedWorkout = user.workouts.find(w => w.id === workoutId) ?? null;

    return selectedWorkout;
  } catch (err) {
    throw err;
  }
}

const deleteUserWorkout = async (userId, workoutId, userWorkoutId) => {
  try {
    const user = await readUserById(userId).catch(throwError);
    
    //list of workouts not specific to user
    const workouts = [...user.workouts];

    const targetWorkoutIdx = workouts.findIndex(w => w.id === workoutId);
    const targetWorkout = workouts[targetWorkoutIdx];

    // with the targeted workout, pull history
    const workoutHistory = [...targetWorkout.history];
    
    // filter out userWorkout from history
    const newWorkoutHistory = workoutHistory.filter(wh => wh.id !== userWorkoutId);
    
    // reassign new array to history if length changed
    if (workoutHistory.length !== newWorkoutHistory.length) {
      targetWorkout.history = newWorkoutHistory;

      // update workout in user array
      workouts[targetWorkoutIdx] = targetWorkout;
      
      // call updateUser
      await updateUser(userId, {workouts})
    }
  } catch (err) {
    throw err;
  }
}

module.exports = {
  addUserWorkout,
  readAllUserWorkouts,
  readUserWorkoutByWorkoutId,
  deleteUserWorkout,
}