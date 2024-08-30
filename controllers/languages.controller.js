const { selectLanguages } = require("../models/languages.model");

exports.getLanguages = (req, res, next) => {
    selectLanguages()
        .then((languages) => {
            res.status(200).send({ languages });
        })
        .catch(next);
};
