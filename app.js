const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const {
    getAuthUser,
    getPublicUser,
    getAllRepos,
    getWeeklyCommits,
    getYearlyActivity,
    getLanguagesUsedByRepo,
} = require("./controllers/gh.controller.js");
const {
    handleCustomErrors,
    handlePsqlErrors,
    handleServerErrors,
} = require("./errors/app.errors.js");
const { getEndpoints } = require("./controllers/api.controller.js");
const {
    getTimelines,
    createTimeline,
    removeTimeline,
    getTimelineByName,
} = require("./controllers/timelines.controller.js");
const {
    getEvents,
    getEventByID,
    createEvent,
    removeEvent,
    patchEventDates,
} = require("./controllers/events.controller.js");

app.get("/ghapi/auth_user/:user", getAuthUser);
app.get("/ghapi/public_user/:user", getPublicUser);
app.get("/ghapi/all_repos/:user/", getAllRepos);
app.get("/ghapi/weekly_commits/:repo", getWeeklyCommits);
app.get("/ghapi/yearly_activity/:repo", getYearlyActivity);
app.get("/ghapi/languages_used/:repo", getLanguagesUsedByRepo);

app.get("/api", getEndpoints);
app.get("/api/timelines", getTimelines);
app.get("/api/timelines/:timeline_name", getTimelineByName);
app.post("/api/timelines", createTimeline);
app.delete("/api/timelines/:timeline_name", removeTimeline);

app.get("/api/events", getEvents);
app.post("/api/events", createEvent);
app.get("/api/events/:event_id", getEventByID);
app.delete("/api/events/:event_id", removeEvent);
app.patch("/api/events/:event_id", patchEventDates);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);
app.all("*", (req, res) => {
    res.status(404).send({ msg: "route not found" });
});

module.exports = app;
