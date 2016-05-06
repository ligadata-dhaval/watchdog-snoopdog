exports.add = function(req, res) {
    var user = req.body;
    console.log("User: "+JSON.stringify(user))
    db.collection('users', function(err, collection) {
        collection.insert(user, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result));
                res.send(result[0]);
            }
        });
    });
}