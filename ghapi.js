const axios = require("axios");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
    path: `${__dirname}/.env.${ENV}`,
});

if (!process.env.GH_TOKEN) {
    throw new Error("GH_TOKEN not set");
}

const user = "al-ex-huze";
const repo = "be-pp-timeline";

const ghApi = axios.create({
    baseUrl: `https://api.github.com`,
});

exports.getGhApiCb = (req, res, next) => {
    getGhApi()
        .then((response) => {
            console.log(response);
            res.status(200).send(response);
        })
        .catch(next);
};

const getGhApi = () => {
    return ghApi
        .get(`/repos/${user}/${repo}`, {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${process.env.GH_TOKEN}`,
                "Content-Type": "application/json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
            // auth: {}
        })
        .then((response) => {
            console.log("response in API");
        });
};
