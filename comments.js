// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Set up body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set up mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/comments', { useNewUrlParser: true, useUnifiedTopology: true });

// Create mongoose schema
const commentSchema = new mongoose.Schema({
    name: String,
    comment: String
});

// Create mongoose model
const Comment = mongoose.model('Comment', commentSchema);

// Set up CORS to allow us to access our server from a different server
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // Allow any origin
    res.header('Access-Control-Allow-Headers', '*'); // Allow any headers
    res.header('Access-Control-Allow-Methods', '*'); // Allow any methods
    next();
});

// Set up GET route to get comments
app.get('/api/comments', async (req, res) => {
    try {
        let comments = await Comment.find();
        res.send(comments);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// Set up POST route to add comments
app.post('/api/comments', async (req, res) => {
    const comment = new Comment({
        name: req.body.name,
        comment: req.body.comment
    });
    try {
        await comment.save();
        res.send(comment);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// Set up DELETE route to delete comments
app.delete('/api/comments/:id', async (req, res) => {
    try {
        await Comment.deleteOne({ _id: req.params.id });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// Set up PUT route to update comments
app.put('/api/comments/:id', async (req, res) => {
    try {
        let comment = await Comment.findOne({ _id: req.params.id });
        comment.name = req.body.name;
        comment.comment = req.body.comment;
        await comment.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// Listen on port 3000