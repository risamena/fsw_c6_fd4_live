const express =  require('express');
const app = express();
const PORT = 4646;
app.use(express.urlencoded());
app.set('view engine', 'ejs') //coba ejs
app.use(express.static('public')); // untuk  menampilkan file di public
// Coba Morgan
const morgan = require('morgan');
app.use(morgan('dev'));

// data
const posts = require('./posts.json');
const postsDetail = require('./posts_detail.json');
// routing
// ----------- COBA EJS + Router Middleware ------------
const router = require('./router');
app.use(router);
// ----------- END - COBA EJS + Router Middleware ------------
// READ
app.get('/api/posts', (req, res) => {
    res.status(200).json(posts);
})
// READ
app.get('/api/posts/:id', (req, res) => {
    // 1. Ambil data dari masing-masing DB
    const article = posts.posts.find(function(value){
        const isMatched = value.id == req.params.id;
        return isMatched;
    });
    const detail = postsDetail.data.find(function(value){
        const isMatched = value.id ==req.params.id;
        return isMatched;
    });
    // 2. Gabungkan kedua data tersebut
    const data = {...article, ...detail}; // Object distructuring JS
    res.status(200).json(data);
});
// READ
app.post( '/api/posts', (req,res) => {
    // 1. ambil data yang dikirim User
    const payload = req.body; // harus nambah middleware, urlencoded
    // 2. nambahin data ke DB posts
    const {title, author} = payload; //object destructuring
    const newId = posts.posts.length + 1;
    posts.posts.push({id: newId, title, author}); //title: title dapat ditulis title saja
    // 3. nambahin data ke DB posts detail
    const {content, dateCreated, label} = payload;
    postsDetail.data.push({id:newId, content, dateCreated, label});
    // 4. kirim respon
    res.status(201).json({
        status: "success",
        data: {id: newId, ...payload}
    });
});
// UPDATE
app.put('/api/posts',(req, res) => {
    // // update ke posts.json
    // let post = posts.posts.find(i => i.id == req.params.id) ;
    // const params = {title: req.body.title, author: req.body.author};
    // post = {...post, ...params};
    // posts.posts.map(i => i.id == post.id ? post : i);
    // // update ke postsDetail
    // let postDetail = postsDetail.data.find(i => i.id == req.params.id) ;
    // const paramsDetail = {content: req.body.content, dateCreated: req.body.dateCreated, label: req.body.label};
    // postDetail = {...postDetail, ...paramsDetail};
    // postsDetail.data.map(i => i.id == postDetail.id ? postDetail : i);

    // res.status(200).json({
    //     status:"success",
    //     data: req.body
    // });
    // 1. ambil data yang dikirim user
    const id = req.params.id;
    const payload = req.body;
    const {title, author, content, dateCreated, label} = payload;
    // 2. cari data yang sudah ada
    const oldDataPost = posts.posts.find(function (value){
        const isMatched = value.id === id;
        return isMatched;
    });
    const oldDataPostDetail = postsDetail.data.find(function (value){
        const isMatched = value.id === id;
        return isMatched;
    });
    // 3. ganti data yang lama dengan data yang baru
    const newPost = { ...oldDataPost, title, author};
    const newPostDetail = { ...oldDataPostDetail, content, dateCreated, label };
    // 3.1 cari index dari data yang sudah ada
    // const indexPost = posts.posts.indexOf(function(value){
    //     const isMatched = value.id == id;
    //     return isMatched;
    // })
    // const indexPostDetail = postsDetail.data.indexOf(function(value){
    //     const isMatched = value.id == id;
    //     return isMatched;
    // })
    // console.log(indexPost);
    // console.log(indexPostDetail);
    // 3.2 replace data di index tersebut dengan data baru
    posts.posts[newPost.id - 1] = newPost;
    postsDetail.data[newPostDetail.id - 1] = newPostDetail;
    // 4. kirim respons ke user
    res.status(200).json(payload);
    // masih error. lihat ulang video live chapter 6 fd 5
});
// DELETE
app.delete('/api/posts/:id', (req, res) => {
    // 1. cari data di array berdasarkan id
    posts.posts.filter(i => i.id != req.params.id);

    res.status(200).json({
        message: `Post dengan id ${req.params.id} berhasil dihapus`
    });
});

// using morgan
// internal server error handler
app.use( function(err, req, res, next){
    console.log(err);
    res.status(500).json({
        status: 'fail',
        errors: err.message
    });

});
// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        status: 'fail',
        errors: 'Maaf, halaman tidak ditemukan!'
    });
});
// running server
app.listen(PORT, () => {
    console.log( `Server is listening on port http://localhost:${PORT}`);
});