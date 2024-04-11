const  express = require('express');
const router = express.Router();
const user = [];

// middleware yang digunakan di router ini
router.use(function timeLog(req, res, next){
    console.log('Time', Date.now());
    next();
});

router.get('/', (req, res) => {
    res.render('index'); 
})
router.get('/greet', (req, res) => {
    const name = req.query.name || 'void';
    res.render('greet', {name: name});
});
// register page, untuk menampilkan form
router.get('/register', (req, res) => {
    res.render('register');
});
// post /register untuk menerima isi form
router.post('/register', (req, res) => {
    const {email, password} = req.body;
    user.push({email, password});
    res.json(user);
});

module.exports = router;