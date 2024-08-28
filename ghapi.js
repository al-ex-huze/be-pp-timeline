const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const user = "al-ex-huze";
const repo = "be-pp-timeline";

const ghApi = axios.create({
    baseUrl: `https://api.github.com`,
});

exports.getGhApi = () => {
    return ghApi
        .get(`/repos/${user}/${repo}`, {
            headers: {
                Authorization: `Bearer ${process.env.GH_TOKEN}`,
                "Content-Type": "application/json",
            },
            // auth: {}
        })
        .then((response) => {
            console.log("response in API")
        });
};
