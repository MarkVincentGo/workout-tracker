const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { readUserById, addUser, readAllUsers } = require('./src/user');
const { addUserWorkout, deleteUserWorkout } = require('./src/userWorkouts');
const { addWorkout, readWorkout, readAllWorkouts } = require('./src/workout');

const app = express();
const port = process.env.PORT || 8080;

app.use(morgan('dev'));
app.use(express.json());

// users
app.get('/user' , async (req, res) => {
  try {
    const users = await readAllUsers()
    res.status(200);
    res.send(users);
  } catch (err) {
    console.error(err);
    res.status(500);
    res.send(err.message);
  }
})

app.get('/user/:id', async (req, res) => {
  const {id} = req.params;

  try {
    const user = await readUserById(id)
    res.status(200);
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500);
    res.send(err.message);
  }
})

app.post('/user', async (req, res) => {
  const {name} = req.body;

  try {
    await addUser(name);
    res.status(200)
    res.end('Success!')
  } catch (err) {
    console.error(err);
    res.status(500);
    res.send(err.message);
  }
})

// workouts
app.get('/workout', async (req, res) => {
  try {
    const workouts = await readAllWorkouts()
    res.status(200);
    res.send(workouts);
  } catch (err) {
    console.error(err);
    res.status(500);
    res.send(err.message);
  }
})

app.get('/workout/:id', async (req, res) => {
  const {id} = req.params;

  try {
    const workout = await readWorkout(id)
    res.status(200);
    res.send(workout);
  } catch (err) {
    console.error(err);
    res.status(500);
    res.send(err.message);
  }
})

app.post('/workout', async (req, res) => {
  const {name} = req.body;

  try {
    await addWorkout(name);
    res.status(200);
    res.end('Success!');
  } catch (err) {
    console.error(err);
    res.status(500);
    res.send(err.message);
  }
})

// user workouts


app.post('/userWorkout', async (req, res) => {
  const {userId, workoutData} = req.body;

  try {
    await addUserWorkout(userId, workoutData)
    res.status(200);
    res.end('Success!');
  } catch (err) {
    console.error(err);
    res.status(500);
    res.send(err.message);
  }
})

app.delete('/userWorkout', async (req, res) => {
  const {userId, workoutId, userWorkoutId} = req.query;

  try {
    await deleteUserWorkout(userId, workoutId, userWorkoutId);
    res.status(200);
    res.end('Success!');
  } catch (err) {
    console.error(err);
    res.status(500);
    res.send(err.message);
  }
})

app.use(express.static(path.join(__dirname, 'build')));
app.listen(port, console.log(`App is listening on port ${port}`))