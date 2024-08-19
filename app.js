const express = require("express");
const app = express();

const { getEndpoints } = require("./controllers/api.controller.js");
const { getTimelines } = require("./controllers/timelines.controller.js");
const { handleServerErrors } = require("./errors/app.errors.js");

app.get("/api", getEndpoints);
app.get("/api/timelines", getTimelines);

app.use(handleServerErrors);
app.all("*", (req, res) => {
    res.status(404).send({ msg: "route not found" });
});

module.exports = app;