require('dotenv').config();
const path = require('path')
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')

const Blog = require('./models/blog')
const app = express();
const PORT = process.env.PORT || 8000;

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const { checkAuthenticationCookie } = require('./middleware/athentication');
app.use(express.static(path.resolve('./public')))


// mongoose.connect('mongodb://localhost:27017/blogify').then((e) => console.log("Mongodb connected"))
// mongoose.connect('mongodb://127.0.0.1:27017/blogify', {
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser:true,
    useUnifiedTopology: true,
})
.then(() => console.log("DB Connection is Successful"))
.catch( (error) => {
    console.log("Issue in DB Connection");
    console.error(error.message);
    //iska matlab kya h ?
    process.exit(1);
} );


app.set('view engine','ejs');
app.set('views',path.resolve("./views"))

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthenticationCookie("token"));

app.get("/", async (req,res) =>{
    const allBlogs = await Blog.find({})
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    })
})

app.use("/user", userRoute)
app.use("/blog", blogRoute)

app.listen(PORT, ()=> console.log(`Server is running on port${PORT}`));
