const fs = require('fs');
const express = require('express');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res) => {
    const category = req.query.category;
    const search = req.query.search;

    const db = await sqlite.open({
        filename: './product.db',
        driver: sqlite3.Database
    });

    const query = getQuery(category, search);
    
    const products = await db.all(query);
    const categoryList = ["전체", "파이썬", "C", "자바", "자바스크립트", "웹개발", "앱개발", "데이터분석", "머신러닝"];
    
    res.render('index', {products, categoryList, curCategory: category, search});
})

function getQuery(category, search) {
    if (search == undefined) search = "";
    if (category === "전체" || category == undefined) {
        return `SELECT * FROM products WHERE product_title LIKE '%${search}%'`
    } else {
        return `SELECT * FROM products WHERE product_title LIKE '%${search}%' and product_category = '${category}'`
    }
}

app.get('/product/:product_id', async (req, res) => {
    const product_id = req.params.product_id;
    const comment = JSON.parse(fs.readFileSync('./comment.json'));

    const db = await sqlite.open({
        filename: './product.db',
        driver: sqlite3.Database
    });

    const query = `SELECT * FROM products WHERE product_id = ${product_id}`;
    
    const product = await db.all(query);

    res.render('product', {product: product[0], comments: comment[product_id]})
})

app.post('/product', (req, res) => {
    const comment = req.body.comment;
    const product_id = req.body.product_id;

    const comments = JSON.parse(fs.readFileSync('./comment.json'));
    
    comments[product_id].push(comment);
    const json = JSON.stringify(comments, null, '\t');
    fs.writeFileSync('./comment.json', json);

    res.redirect('/product/' + product_id);
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/signup', (req, res) => {
    res.render('signup');
})

app.get('/products', async (req, res) => {
    const db = await sqlite.open({
        filename: './product.db',
        driver: sqlite3.Database
    });

    const result = await db.all('SELECT * FROM products');

    res.send(result);
})


app.listen(3000, () => {
    console.log('Server started on port 3000')
});