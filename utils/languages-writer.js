const { languageParser } = require("./languages-utils");

const languagesData = require("../db/data/development-data/rawlanguages29082024")
const fs = require("fs");

const parsedLanguagesData = JSON.stringify(languageParser(languagesData))

fs.writeFile("/home/al-ex-huze/Repos/be-pp-timeline/db/data/development-data/languages.js", "module.exports = " + parsedLanguagesData, (err) => {
    if (err) throw err;
})  