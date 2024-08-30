const languageParser = (languagesRaw) => {
    if (languagesRaw.length === 0) return [];
    const clonedLanguages = [...languagesRaw];
    const newLanguages = clonedLanguages.map((element) => {
        const newObj = {};
        for (const key in element) {
            newObj.full_name_languages = `al-ex-huze/${key}`;
            newObj.languages_and_size = (JSON.stringify(element[key]))
        }
        return newObj;
    });
    return newLanguages;
};

module.exports = { languageParser };
