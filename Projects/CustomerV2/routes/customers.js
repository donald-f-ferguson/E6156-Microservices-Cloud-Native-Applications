

let post = function(req, res, next) {

};

let get_by_query = function(req, res, next) {
    let ans = {
        msg: "Echoing request.",
        operation: "GET /customers",
        query_params: req.query
    };
    res.json(ans);
};

let get_by_id = function(req, res, next) {

    let ans = {
        msg: "Echoing request.",
        operation: "GET /customers/<id>",
        path_params: req.params,
        query_params: req.query
    };
    res.json(ans);
};

exports.get_by_id = get_by_id;
exports.get_by_query = get_by_query;
exports.post = post;

