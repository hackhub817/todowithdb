//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2",{
  dbName: 'todolistDB',
},()=>{
  console.log("db is connected");
});

const itemsSchema={
  name:String
};
const Item= mongoose.model("Item",itemsSchema);
 
const item1 = new  Item ({
  name:"welcome"
});

const item2 = new  Item ({
  name:"+ to add"
});

const item3 = new  Item ({
  name:"-- to subtract"
});

const defaultItems =  [item1,item2,item3];
// Item.insertMany(defaultItems,function(err){
//   if(err)
//   {
//     console.log(err);
//   }else {
//     console.log("Successfully saved all tht items in DB");
//   }

// });



app.get("/", function(req, res) {

  Item.find({},function(err,foundItems){
    
    if(foundItems.length==0)
    {
      Item.insertMany(defaultItems,function(err){
  if(err)
  {
    console.log(err);
  }else {
    console.log("Successfully saved all tht items in DB");
  }

});
res.redirect("/");
}
else{
  res.render("list", {listTitle: "Today", newListItems: foundItems});

}

    })
  });


app.post("/", function(req, res){

  const itemName = req.body.newItem;

 //ADD ITEM IN THE TODO LIST DATABASE
  
 const item =new Item({
   name:itemName
 });
 item.save();

 res.redirect("/");

});


//NEW ROUTE TO DELETER ITME IN THE TODOLIST
app.post("/delete",function(req,res){
  const id=req.body.checkbox;

  Item.findByIdAndRemove(id,function(err)
  {
    if(err)
    {
      console.log(err);
    }else{
      console.log("Successfully deleted");
      res.redirect("/");
    }
  })
  
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
