const express = require("express");
const app = express();

const { getEndpoints } = require("./controllers/api.controller.js");

const { handleServerErrors } = require("./errors/app.errors.js");

app.get("/api", getEndpoints);

app.use(handleServerErrors);
app.all("*", (req, res) => {
    res.status(404).send({ msg: "route not found" });
});

module.exports = app;