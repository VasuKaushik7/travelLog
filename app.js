const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());
mongoose.connect('mongodb+srv://vasu:247333@cluster0.n8lxb2n.mongodb.net/?retryWrites=true&w=majority');
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("Server listing on" + PORT);
})
const logsSchema = new mongoose.Schema({
    title: String,
    description: String,
    likes: Number,
    dislikes: Number
})

const Log = new mongoose.model("Log", logsSchema);

// const log=new Log({
//     title:"This is a test title",
//     description:"This is a test description"
// })
// log.save()
// .then(function(){
//     console.log("saved successfully");
// })
// .catch(function(err){
//     if(err){
//         console.log("error----->",err);
//     }
// })'
app.get("/", (request, response) => {
    const status = {
        "Status": "Running"
    };
    response.send(status);
})
app.get("/status", (request, response) => {
    const status = {
        "Status": "Running"
    };
    response.send(status);
})

app.get("/logs", (req, res) => {
    Log.find()
        .then(function (notes) {
            res.send(notes);
        })
        .catch(function (err) {
            res.send(err);
        })
})
app.post("/logs", function (req, res) {
    console.log(req.body.title, req.body.description);
    let newLog = new Log({
        title: req.body.title,
        description: req.body.description,
        likes: 0,
        dislikes: 0
    })
    newLog.save()
        .then(
            function () {
                res.send(JSON.stringify("Added Successfully"));
            }
        )
        .catch(
            function (err) {
                res.send(err);
            }
        )
})
app.delete("/logs", function (req, res) {
    let logId = req.body.id;
    Log.findByIdAndRemove(logId)
        .then(
            function () {
                res.send(JSON.stringify("Deleted Successfully"))
            }
        )
        .catch(
            function (err) {
                res.send(err);
            }
        )
})

app.post("/likes", function (req, res) {
    let id = req.body.id;
    if (req.body.action == "liked") {
        Log.findByIdAndUpdate({ _id: id }, { $inc: { 'likes': 1 } })
            .then(
                function () {
                    res.send(JSON.stringify("Liked Successfully"));
                }
            )
            .catch(
                function (err) {
                    res.send(err);
                }
            )

    }
    else if (req.body.action == "disliked") {
        Log.findByIdAndUpdate({ _id: id }, { $inc: { 'dislikes': 1 } })
        .then(
            function () {
                res.send(JSON.stringify("DisLiked Successfully"));
            }
        )
        .catch(
            function (err) {
                res.send(err);
            }
        )

    }

})

app.get("/likes/:id", function (req, res) {
    let id = req.params.id;
    console.log("id------>",id);
    Log.findById(id)
        .then(
            function (doc) {
                console.log(doc.likes)
                let a = doc.likes;
                let b = doc.dislikes;
                let likes = JSON.stringify({ "likes": a, "dislikes": b })
                res.send(likes);
            }
        )
        .catch(
            function (err) {
                res.send(err);
            }
        )
})