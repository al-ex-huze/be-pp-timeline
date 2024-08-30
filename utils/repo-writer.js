const { repoParser } = require("./repo-utils");

const repoData = require("../db/data/development-data/rawrepos28082024")
const fs = require("fs");

const parsedRepoData = JSON.stringify(repoParser(repoData))

fs.writeFile("/home/al-ex-huze/Repos/be-pp-timeline/db/data/development-data/repos.js", "module.exports = " + parsedRepoData, (err) => {
    if (err) throw err;
})