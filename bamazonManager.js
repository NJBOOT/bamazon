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
    console.log("You are connected thread: " + connection.threadId)
});

function isNumber (input) {
    var checker = parseInt(input)
    if (!isNaN(checker) && checker > 0)
        return true
    else {
        console.log("Please enter a valid number")
    }
}

menu();

function menu() {
    inquirer.prompt([
        {
            type: "list",
            name: "adminMenu",
            choices: [
                `View Products for Sale`,
                `View Low Inventory`,
                `Add to Inventory`,
                `Add New Product`,
                `Exit`
            ]
        }
    ]).then(function (answers) {
        switch (answers.adminMenu) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Exit":
                process.exit()
        }
    }

    )
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        menu();
    })
}
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <5", function (err, res) {
        if (err) throw err;
        if (res === null) {
            console.log("There are no items with low inventory.")
        }
        else {
            for (let i = 0; i < res.length; i++)
                console.log(`\nThere are only ${res[i].stock_quantity} units of ${res[i].product_name} in stock.\n`)
        }
        menu();
    })
}
function addInventory() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID of the product you are adding inventory to?",
            name: "product",
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
            message: "How many units do you want to add?",
            name: "quantity",
            validate: function (input) {
                var checker = parseInt(input)
                if (!isNaN(checker) && checker > 0)
                    return true
                else {
                    console.log("Please enter a valid number")
                }
            }
        }
    ]).then(function (answer) {
        let itemID = answer.product;
        let quantity = answer.quantity;
        connection.query("SELECT stock_quantity FROM products WHERE item_id = ?", [itemID], function (err, res) {
            if (err) throw err;
            connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: res[0].stock_quantity + parseFloat(answer.quantity)
                    },
                    {
                        item_id: itemID
                    }
                ], function (err, res) {
                    if (err) throw err;
                })
            menu();
        })
    })
}
function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the name of the product:",
            name: "name"
        },
        {
            type: "input",
            message: "Enter the department of the product:",
            name: "department"

        },
        {
            type: "input",
            message: "Enter the price of the product $:",
            name: "price",
            validate: function (input) {
                var checker = parseInt(input)
                if (!isNaN(checker) && checker > 0)
                    return true
                else {
                    console.log("Please enter a valid number")
                }
            }
        },
        {
            type: "input",
            message: "Enter the quantity of the product:",
            name: "quantity",
            validate: function (input) {
                var checker = parseInt(input)
                if (!isNaN(checker) && checker > 0)
                    return true
                else {
                    console.log("Please enter a valid number")
                }
            }
        }
    ]).then(function (answer){
        connection.query("INSERT into products SET ?",{
            product_name: answer.name,
            department_name: answer.department,
            price: answer.price,
            stock_quantity: answer.quantity
        },function(err,res){
            if (err) throw err;
            console.log(`You have added ${answer.quantity} units of ${answer.name} in the ${answer.department} department at the price of $${answer.price}`)
        })
        menu();
    })
 }

