const { selectTimelines, insertTimeline } = require("../models/timelines.model.js");

exports.getTimelines = (req, res, next) => {
    selectTimelines()
    .then((timelines) => {
        res.status(200).send({ timelines });
    })
    .catch(next);
};

exports.createTimeline = (req, res, next) => {
    console.log("tl-ctrl create > insert")
    console.log("req: " + req)
    console.log("req.body: " + req.body)
    insertTimeline(req.body)
    .then((timeline) => {
        res.status(201);
        res.send({ timeline });
    })
    .catch(next);
}