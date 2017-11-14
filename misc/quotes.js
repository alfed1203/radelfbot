var fs = require("fs")
var quotes = fs.readFileSync("/Users/Admin/quotes.txt" , 'utf8').split("|")
module.exports = quotes;