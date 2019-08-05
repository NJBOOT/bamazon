var mysql = require('mysql');
var inquirer = require('inquirer');
var table = require('console.table');


let connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "H2A32B3AE51F13B45",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    display();
});

function display() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        chooseProduct();
          
    })
}

function chooseProduct() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID of the item you want to buy?",
            name: "choice",
            validate: function (input){
                var checked = parseInt(input)
                if (checked >= 1 && checked <=10)
                    return true
                else
                console.log("\nPlease enter a valid number")
            }
        },
        {
            type: "input",
            message: "How many units would you like to purchase?",
            name: "quantity",
            validate: function (input){
                var checked = parseInt(input)
                if (checked >= 1 && checked <=500)
                    return true
                else
                console.log("\nPlease enter a valid number")   
        }
    }
    ]).then(function(answer) {
        console.log(answer)
        connection.query('SELECT * FROM products WHERE item_id = ?', [answer.choice], function(err, res){
            if (err) throw err;
            console.log(res)
            let item = res
            let quantity = res[0].stock_quantity
            console.log(quantity)
            let quantityOrder = answer.quantity
            console.log(quantityOrder)
            if (quantity > quantityOrder){
                // completeOrder();
            } else console.log ("Insufficient Quantity") 
            connection.end(); 
        })

    })
}

function completeOrder () {
connection.query ("UPDATE products SET product_sales = product_sales + ?, ? WHERE ?",
[

]
,function (err,res){

})
}