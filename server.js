const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");
const PORT = 3000;
const app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/scrapings");

app.get("/scrape", function(req, res) {
    axios.get("url").then(function(response) {
        var $ = cheerio.load(response.data);
        $("").each(function(i, element) {
            let result = {};
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");
            db.Comment.create(result)
                .then(function(dbComment) {
                    console.log(dbComment);
                })
                .catch(function(err) {
                    return res.json(err);
                });
        });
        res.send("Scrape Complete");
    });
});

app.get("/scraping/:id", function(req, res) {
    const id = req.params.id;
    console.log(id);
    db.Scraping.findOne({_id: id})
        .populate("comment")
        .then(function(dbComment){
            res.json(dbComment);
        })
        .catch(function(err) {
            console.log(err);
        });
});
app.post("/scraping/:id", function(req, res) {
    const id = req.params.id;
    db.Comment.create(req.body)
        .then(function(comment){
            console.log(comment);
            const commentId = comment._id
            db.Scraping.findOneAndUpdate({
                _id: id
            },
            {
                $set: {comment: commentId}
            },
            {
                new: true
            }
            )
            .then(function(Comment) {
                res.json(Comment);
            }):
        })
        .catch(function(err) {
            console.log(err);
        });
});
app.listen(PORT, function() {
    console.log("App is Running");
});