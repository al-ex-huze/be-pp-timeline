const express = require("express");
const app = express();
app.use(express.json());

const {
    handleCustomErrors,
    handlePsqlErrors,
    handleServerErrors,
} = require("./errors/app.errors.js");
const { getEndpoints } = require("./controllers/api.controller.js");
const { getTimelines, createTimeline, removeTimeline } = require("./controllers/timelines.controller.js");
const { getEvents, getEventByID } = require("./controllers/events.controller.js");

app.get("/api", getEndpoints);
app.get("/api/timelines", getTimelines);
app.post("/api/timelines", createTimeline);
app.delete("/api/timelines/:timeline_name", removeTimeline);

app.get("/api/events", getEvents);
app.get("/api/events/:event_id", getEventByID);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);
app.all("*", (req, res) => {
    res.status(404).send({ msg: "route not found" });
});

module.exports = app;