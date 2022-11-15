const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/task');

router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body, owner: req.user._id
    })
    try {
        await task.save();
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(e)
    }
})

//GET  /tasks?completed=true
// GET /tasks?limit=10&skip=20
// Get /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const   match = {};
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    } 

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
      await req.user.populate({
        path: 'tasks',
        match,
        options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        }
      });
        res.status(200).send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id, owner: req.user.id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send();
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);  //returns an array of the keys in the object
    const allowedUpdates = ["description", "completed"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) 

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'});
    }

    try {
        const task = await Task.findOne({_id, owner: req.user._id});

        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save();
        //const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true})
        
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }

})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router;