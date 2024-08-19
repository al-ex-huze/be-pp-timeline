const express = require("express");
const app = express();
app.use(express.json());

const { getEndpoints } = require("./controllers/api.controller.js");
const { getTimelines, createTimeline, removeTimeline } = require("./controllers/timelines.controller.js");
const {
    handleCustomErrors,
    handlePsqlErrors,
    handleServerErrors,
} = require("./errors/app.errors.js");

app.get("/api", getEndpoints);
app.get("/api/timelines", getTimelines);
app.post("/api/timelines", createTimeline);
app.delete("/api/timelines/:timeline_name", removeTimeline);


app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);
app.all("*", (req, res) => {
    res.status(404).send({ msg: "route not found" });
});

module.exports = app;