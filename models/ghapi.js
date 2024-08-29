const axios = require("axios");

const ENV = process.env.NODE_ENV || "development";

require("dotenv").config()
require("dotenv").config({
    path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.GH_TOKEN) {
    throw new Error("GH_TOKEN not set");
}

const user = "al-ex-huze";
const repo = "be-pp-timeline";

const ghApi = axios.create({
    baseURL: "https://api.github.com",
});

exports.getAuthUserCall = (user) => {
    return ghApi
        .get(`/${user}`, {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${process.env.GH_TOKEN}`,
                "Content-Type": "application/json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        })
        .then((response) => {
            console.dir(response.data, { depth: null });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.getPublicUserCall = (user) => {
    return ghApi
        .get(`/users/${user}`, {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${process.env.GH_TOKEN}`,
                "Content-Type": "application/json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        })
        .then(({ data }) => {
            return JSON.stringify(data);
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.getAllReposForUserCall = (user) => {
    return ghApi
        .get(`/users/${user}/repos`, {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${process.env.GH_TOKEN}`,
                "Content-Type": "application/json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        })
        .then(({ data }) => {
            return JSON.stringify(data);
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.getWeeklyCommitsCall = (repo) => {
    return ghApi
        .get(`/repos/${user}/${repo}/stats/code_frequency`, {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${process.env.GH_TOKEN}`,
                "Content-Type": "application/json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        })
        .then(({ data }) => {
            return JSON.stringify(data);
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.getYearlyActivityCall = (repo) => {
    return ghApi
        .get(`/repos/${user}/${repo}/stats/commit_activity`, {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${process.env.GH_TOKEN}`,
                "Content-Type": "application/json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        })
        .then(({ data }) => {
            return JSON.stringify(data);
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.getLanguagesUsedByRepoCall = (repo) => {
    return ghApi
        .get(`/repos/${user}/${repo}/languages`, {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${process.env.GH_TOKEN}`,
                "Content-Type": "application/json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        })
        .then(({ data }) => {
            return JSON.stringify(data);
        })
        .catch((error) => {
            console.log(error);
        });
};
