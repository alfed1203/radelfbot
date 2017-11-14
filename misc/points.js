var fs = require("fs")
var firstsplit = fs.readFileSync("/Users/Admin/points.txt", 'utf8').split(" ")
var newArray = [];
if(firstsplit != undefined){
firstsplit.forEach(function(item){
    var itemArray = item.split("|")
    newArray.push(itemArray);
})
};
newArray.sort(function(a,b){return b[1] - a[1]})
module.exports = newArray;