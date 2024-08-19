const express = require("express");
const app = express();

const { getEndpoints } = require("./controllers/api.controller.js");

app.get("/api", getEndpoints);

app.all("*", (req, res) => {
    res.status(404).send({ msg: "route not found" });
});

module.exports = app;