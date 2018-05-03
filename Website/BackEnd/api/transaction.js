var transaction = require('../models/transactionSchema');
var express = require('express');
var User = require('../models/userSchema');
var router = express.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
    transaction.find(function (err, transaction) {
        if (err) {
            res.send(err);
        }
        if (!transaction) {
            res.sendStatus(404);
        }
        else {
            res.json(transaction);
        }
    });


});
router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    transaction.findById(id).exec(function (err, transactionFound) {
        if (err) {
            res.send(err);
        }
        if (!transactionFound) {
            res.sendStatus(404);
        }
        else {
            res.json(transactionFound);
        }
    });
});
router.post('/', function (req, res) {
    var Transaction = new transaction(req.body);
    User.findOne({wallet_adr: Transaction.sender_adr}, function (err, user) {
        //console.log(user);
        //user.apiExpirationDate = new Date(user.apiExpirationDate);
        if (Transaction.selected_package === "Month") {
            if (user.apiExpirationDate < new Date()) {
                user.apiExpirationDate = new Date();

            }
            user.apiExpirationDate.setDate(user.apiExpirationDate.getDate() + 30);
            console.log("new date : " + user.apiExpirationDate);

        }
        else if (Transaction.selected_package === "Week") {
            if (user.apiExpirationDate < new Date()) {
                user.apiExpirationDate = new Date();

            }
            user.apiExpirationDate.setDate(user.apiExpirationDate.getDate() + 7);
            console.log("new date : " + user.apiExpirationDate);
        }
        else if(Transaction.selected_package === "Ticket"){
            console.log("current : "+user.token_balance);
            user.token_balance = user.token_balance + 10;
            console.log("new : "+user.token_balance);
        }
        else {
            console.log(err)
        }
        User.findOneAndUpdate({_id: user._id}, {
            $set: {
                token_balance: user.token_balance,
                apiExpirationDate: user.apiExpirationDate
            }
        }, function (err, u) {
            if (err) {
                console.log(err);
            } else {
                console.log(u);
            }
        });
    });

    Transaction.save(function (err, Newtransaction) {
        if (err)
            res.send(err);
        else
            res.send(Newtransaction);
    });
});
router.delete('/:id', function (req, res) {

    var id = req.params.id;
    transaction.findByIdAndRemove(id, function (err, country) {
        if (err)
            res.send(err);
        else
            res.sendStatus(202);
    });

});
module.exports = router;
