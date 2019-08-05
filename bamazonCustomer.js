var mysql = require('mysql');
var inquirer = require('inquirer');
var table = require('console.table');

let item = ""
let quantityOrder = 0

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
            validate: function (input) {
                var checked = parseInt(input)
                if (checked >= 1 && checked <= 100)
                    return true
                else
                    console.log("\nPlease enter a valid number")
            }
        },
        {
            type: "input",
            message: "How many units would you like to purchase?",
            name: "quantity",
            validate: function (input) {
                var checked = parseInt(input)
                if (checked >= 1 && checked <= 500)
                    return true
                else
                    console.log("\nPlease enter a valid number")
            }
        }
    ]).then(function (answer) {
        connection.query('SELECT * FROM products WHERE item_id = ?', [answer.choice], function (err, res) {
            if (err) throw err;
            item = res[0];
            quantityOrder = answer.quantity;
            let quantity = res[0].stock_quantity;
            if (quantity > quantityOrder) {
                completeOrder(item, quantityOrder);
            } else console.log("Insufficient Quantity")
        })

    })
}

function completeOrder(item, quantityOrder) {
    connection.query("UPDATE products SET ? WHERE ?",
        [
            { stock_quantity: item.stock_quantity - quantityOrder },
            { item_id: item.item_id }

        ],
        function (err, res) {
            console.log(`\nYou just purchased ${quantityOrder} units of ${item.product_name}.\n Your total was $${quantityOrder * item.price}.`)

        })
    connection.end()
}