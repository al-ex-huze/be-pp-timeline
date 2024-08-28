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

exports.getGhApiCb = (req, res, next) => {
    getGhApi()
        .then((response) => {
            console.log("response in controller" +response);
            res.status(200).send(response);
        })
        .catch(next);
};

const getGhApi = () => {
    return ghApi
        .get(`/repos/${user}/${repo}/stats/code_frequency`, {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${process.env.GH_TOKEN}`,
                "Content-Type": "application/json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
            // auth: {}
        })
        .then((response) => {
            console.log("response in API: " + response);
        })
        .catch((error) => {
            console.log("&*&* GET ERROR: " + error)
        });
};
