const fs = require('fs');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

const file = fs.readFileSync('./product.json', 'utf-8');
const json = JSON.parse(file);

const list = Object.values(json);


const SELECT = 'SELECT * FROM products';

function InsertQuery(item) {
    return `INSERT INTO products(product_title, product_image, product_price, product_category) VALUES('${item.title}', '${item.img}', '${item.price}', '${item.category[0]}');`;
}


const main = (callback) => {
    callback();
}


const saveItems = async () => {
    let db = await getDBconnection();

    for (item of list) {
        const query = InsertQuery(item);
    
        const result = db.run(query);
    }
}

const commentJson = async () => {
    let db = await getDBconnection();
    const obj = {};
    const products = await db.all(`SELECT * FROM products`);
    for (product of products) {
        obj[product.product_id] = [];
    }
    const json = JSON.stringify(obj, null, '\t');
    fs.writeFileSync('../comment.json', json);
}

const getDBconnection = async () => {
    const db = await sqlite.open({
        filename: '../product.db',
        driver: sqlite3.Database
    })
    return db;
}

main(commentJson);