exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === "23502") {
        res.status(400).send({ msg: "PSQL ERROR - 23502 - Failing row contains (null, test body)." });
    } else
    if (err.code) {
        console.log(err, "PSQL ERROR");
    } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({ msg: "Internal Server Error" });
};