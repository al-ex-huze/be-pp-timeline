const axios = require("axios");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config();

if (!process.env.GH_TOKEN) {
    throw new Error("GH_TOKEN not set");
}

const user = "al-ex-huze";
const repo = "be-pp-timeline";

const ghApi = axios.create({
    baseURL: "https://api.github.com",
});

exports.getAuthUserCall = (user) => {
    console.log(user)
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
            console.log(reponse)
            console.dir(response, { depth: null });
            return response;
        })
        .catch((error) => {
            return error;
        });
};

exports.getPublicUserCall = (user) => {
    console.log(user)
    return ghApi
        .get(`/users/${user}`, {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${process.env.GH_TOKEN}`,
                "Content-Type": "application/json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        })
        .then((response) => {
            console.log(reponse)
            console.dir(response, { depth: null });
            return response;
        })
        .catch((error) => {
            return error;
        });
};

exports.getAllReposCall = (user) => {
    console.log(user)
    return ghApi
        .get(`/${user}/repos`, {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${process.env.GH_TOKEN}`,
                "Content-Type": "application/json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        })
        .then((response) => {
            console.log(reponse)
            console.dir(response, { depth: null });
            return response;
        })
        .catch((error) => {
            return error;
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
        .then((response) => {
            // console.dir(response.data, { depth: null });
            return response.data;
        })
        .catch((error) => {
            return error;
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
        .then((response) => {
            // console.dir(response.data, { depth: null });
            return response.data;
        })
        .catch((error) => {
            return error;
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
        .then((response) => {
            // console.dir(response.data, { depth: null });
            return response.data;
        })
        .catch((error) => {
            return error;
        });
};
