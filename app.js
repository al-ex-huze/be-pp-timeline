const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const {
    getAuthUser,
    getEventsForUser,
    getPublicUser,
    getAllReposForUser,
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
const { getAllRepos } = require("./controllers/repos.controller.js");
const { getLanguages } = require("./controllers/languages.controller.js");
const {
    getFeels,
    patchFeelsForWeek,
} = require("./controllers/feels.controller.js");
const {
    createTimeline,
    getTimelines,
    getTimelineByName,
    patchTimelineByName,
    removeTimeline,
} = require("./controllers/timelines.controller.js");
const {
    getEvents,
    getEventByID,
    createEvent,
    removeEvent,
    patchEventDates,
} = require("./controllers/events.controller.js");

// app.get("/ghapi/auth_user/:user", getAuthUser);
// app.get("/ghapi/events/:user", getEventsForUser);
// app.get("/ghapi/public_user/:user", getPublicUser);
// app.get("/ghapi/all_repos/:user/", getAllReposForUser);
// app.get("/ghapi/weekly_commits/:repo", getWeeklyCommits);
// app.get("/ghapi/yearly_activity/:repo", getYearlyActivity);
// app.get("/ghapi/languages_used/:repo", getLanguagesUsedByRepo);

app.get("/api", getEndpoints);

app.delete("/api/timelines/:timeline_name", removeTimeline);
app.get("/api/timelines", getTimelines);
app.get("/api/timelines/:timeline_name", getTimelineByName);
app.patch("/api/timelines/:timeline_name", patchTimelineByName);
app.post("/api/timelines", createTimeline);

app.get("/api/events", getEvents);
app.post("/api/events", createEvent);
app.get("/api/events/:event_id", getEventByID);
app.delete("/api/events/:event_id", removeEvent);
app.patch("/api/events/:event_id", patchEventDates);

app.get("/api/repos", getAllRepos);

app.get("/api/languages", getLanguages);

app.get("/api/feels", getFeels);
app.patch("/api/feels/:week_number", patchFeelsForWeek);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);
app.all("*", (req, res) => {
    res.status(404).send({ msg: "route not found" });
});

module.exports = app;
