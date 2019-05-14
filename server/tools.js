//  A better approach to generating a unique hash for each word: it uses bitwise operations instead of prime factorization.
exports.hashCode = String.prototype.hashCode = function () {
    var hash = 0;
    if (this.length == 0) return hash;
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        return hash;
    }
}
exports.postToCorpus = function (wordsFromReq, dataStore) {
    for (var i = 0; i < wordsFromReq.length; i++) {
        let currentWord = wordsFromReq[i];
        let currentHash = currentWord.toLowerCase().split("").sort().join("").hashCode()

        if (dataStore[currentHash] == undefined && !(dataStore[currentHash] instanceof Object)) {
            dataStore[currentHash] = [currentWord]
        } else {
            dataStore[currentHash].push(currentWord)
        }
    }
}

exports.getAnagrams = function (wordFromReq, dataStore) {
    let currentWord = wordFromReq;
    let currentHash = currentWord.toLowerCase().split("").sort().join("").hashCode();
    return dataStore[currentHash]
}

exports.deleteSingleWord = function (wordFromReq, dataStore) {
    let currentWord = wordFromReq;
    let currentHash = currentWord.toLowerCase().split("").sort().join("").hashCode();

    //filter is particularly useful because it works whether or not the word is in the corpus
    dataStore[currentHash] = dataStore[currentHash].filter(m => {
        return m !== currentWord;
    });
}