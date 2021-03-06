const db = require('../../server/servertools');

/* All functions follow the same model: they return a promise upon performing a CRUD operation in the database. */

function countTotalWords() {
    return new Promise(function (resolve, reject) {
        db.getMongo().db(db.dbName).collection(db.colName).aggregate([
            { '$project': { 'anagrams': { '$size': '$anagrams' } } }
            , { '$group': { '_id': 0, 'count': { '$sum': '$anagrams' } } }
        ]).toArray(
            function (err, res) {
                err ? reject(err) : resolve(res);
            }
        )
    })
}

function averageLength() {
    return new Promise(function (resolve, reject) {
        db.getMongo().db(db.dbName).collection(db.colName).aggregate([
            { '$unwind': '$anagrams' }
            , { '$group': { '_id': 0, 'average': { '$avg': { '$strLenCP': '$anagrams' } } } }
        ]).toArray(
            function (err, res) {
                err ? reject(err) : resolve(res);
            }
        )
    })
}

function getMinLength() {
    return new Promise(function (resolve, reject) {
        db.getMongo().db(db.dbName).collection(db.colName).aggregate([
            { '$unwind': '$anagrams' }
            , { '$project': { 'anagrams': '$anagrams', 'minLength': { '$strLenCP': '$anagrams' } } }
            , { '$sort': { 'minLength': 1 } }
            , { '$limit': 1 }
        ]).toArray(
            function (err, res) {
                err ? reject(err) : resolve(res);
            }
        )
    })
}

function getMaxLength() {
    return new Promise(function (resolve, reject) {
        db.getMongo().db(db.dbName).collection(db.colName).aggregate([
            { '$unwind': '$anagrams' }
            , { '$project': { 'anagrams': '$anagrams', 'maxLength': { '$strLenCP': '$anagrams' } } }
            , { '$sort': { 'maxLength': -1 } }
            , { '$limit': 1 }
        ]).toArray(
            function (err, res) {
                err ? reject(err) : resolve(res);
            }
        )
    })
}

/*  Each function below, receives req from the endpoint described in server.js,
    then they call one of the functions above.  The functions above return promises.
    Upon receiving the promise resolution, they'll return the HTTP status code along with a response.
*/

exports.totalWords = (req, res) => {
    countTotalWords()
        .then((resolution) => res.status(200).send({ "Total words": resolution[0]["count"] }))
        .catch(err => res.status(404).send())
}

exports.average = (req, res) => {
    averageLength()
        .then((resolution) => res.status(200).send({ "Average word length": resolution[0]["average"].toFixed(2) }))
        .catch(err => res.status(404).send())
}

exports.min = (req, res) => {
    getMinLength()
        .then((resolution) => res.status(200).send({
            "Minimum word length": resolution[0]["minLength"],
            "Word": resolution[0]["anagrams"]
        }))
        .catch(err => res.status(404).send())
}

exports.max = (req, res) => {
    getMaxLength()
        .then((resolution) => res.status(200).send({
            "Maximum word length": resolution[0]["maxLength"],
            "Word": resolution[0]["anagrams"]
        }))
        .catch(err => res.status(404).send())
}