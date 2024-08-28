const axios = require("axios");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({});

if (!process.env.GH_TOKEN) {
    throw new Error("GH_TOKEN not set");
}

const user = "al-ex-huze";
const repo = "be-pp-timeline";

const ghApi = axios.create({
    baseURL: "https://api.github.com",
});

exports.getWeeklyCommitsCall = () => {
    console.log("DEBUG 1")
    return ghApi
        .get(`/repos/${user}/${repo}/stats/code_frequency`, {
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${process.env.GH_TOKEN}`,
                "Content-Type": "application/json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        })
        .then((response) => {
            // console.log("API WEEKLY " + response.data)
            return response.data;
        })
        .catch((error) => {
            return error;
        });
};

exports.getYearlyActivityCall = () => {
    console.log("DEBUG 2")
    return ghApi
        .get(`/repos/${user}/${repo}/stats/commit_activity`, {
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${process.env.GH_TOKEN}`,
                "Content-Type": "application/json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        })
        .then((response) => {
            console.log("API YEARLY " + response.total)
            return response.total;
        })
        .catch((error) => {
            return error;
        });
};

