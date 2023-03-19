const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');

 const app = express();

 app.set('view engine', 'ejs');

 app.use(bodyParser.urlencoded({extended: true}));
 app.use(express.static('public'));

 mongoose.connect('mongodb+srv://Joeonome:joeonome@cluster0.ftmn626.mongodb.net/todolistDB', {useNewUrlParser: true});


 const itemSchema = new mongoose.Schema({
    name: String
  });

 const Item = mongoose.model('Item', itemSchema);

 const item1 = new Item({
    name: 'A Simple To-do List of tasks'
 });

 const item2 = new Item({
    name: 'To add new items, click on the + button'
 });

 const item3 = new Item({
    name: 'Click on the checkbox if completed'
 });

 const defaultItems = [item1, item2, item3];

 const listSchema = new mongoose.Schema({
    name: String,
    items: Array
 });
 
// console.log(itemSchema);

 const List = mongoose.model("List", listSchema);

 app.get("/", async (req, res) => {
    const result = await Item.find();
    // console.log(result);
    // let day = date();
    if (result.length === 0) {
        Item.insertMany(defaultItems);
        res.redirect("/");
    } else {
        res.render("list", {kindOfTask: "Today", newListItems: result})
    }
});

app.get("/Home/:customListName", async (req, res) => 
{
    customListName = _.capitalize(req.params.customListName);


    try {
        searchList = await List.findOne({name: customListName});
        if (searchList.length === 0) {
            List.insertMany(defaultItems);
            res.redirect("/" + customListName);
        } else {
            res.render("list", {kindOfTask: searchList.name, newListItems: searchList.items});
        }
       
    } catch {
        const list = new List({
            name: customListName,
            items: defaultItems
        });
        // console.log(list);
        // console.log(defaultItems);
        list.save();
        res.redirect("/" + customListName);
    }
});

app.post("/", async (req, res) => {
    const itemFrontEnd = req.body.newItem;
    const buttonValue = req.body.button;

    const novelItem = new Item({
        name: itemFrontEnd
    });

    try {
    const searchedName = await List.findOne({name: buttonValue});
    searchedName.items.push(novelItem);
    searchedName.save();
    res.redirect("/Home/" + buttonValue);
    } catch {
        novelItem.save();
    res.redirect("/");
    };
});

app.post("/delete", async (req, res) => {
    const hiddenName = req.body.hiddenName;
    const checkBox = req.body.checkbox;
    // console.log(hiddenName);
    // console.log(List);
    // console.log(checkBox);
    if (hiddenName === "Today") {
        const p = await Item.deleteOne({name: checkBox});
        res.redirect("/");
    } 
    else { const view = await List.findOneAndUpdate({name: hiddenName}, {"$pull": {items: {name: checkBox}}});
        res.redirect("/Home/" + hiddenName);
    };
    
});

 app.listen(3000, () => console.log("Na we dey here!"));