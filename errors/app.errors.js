exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === "23502") {
        res.status(400).send({ msg: "PSQL ERROR: 23502 - Missing input." });
    } else if (err.code === "22P02") {
        res.status(400).send({ msg: "PSQL ERROR: 22P02 - Invalid input." });
    } else if (err.code === "2201X") {
        res.status(400).send({ msg: "PSQL ERROR: 2201X - Negative Page Number." });
    } else if (err.code === "2201W") {
        res.status(400).send({ msg: "PSQL ERROR: 2201W - Negative Limit Number." });
    } else if (err.code === "23505") {
        res.status(409).send({ msg: "PSQL ERROR: 23505 - Violates unique constraint." });
    } else if (err.code) {
        console.log(err, "PSQL ERROR");
    } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
};
