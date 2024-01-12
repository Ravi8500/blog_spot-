const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

// Schema definition directly in the app.js file
const blogSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    photo: {
        type: Array
    },
    text: {
        type: String
    },
    title: {
        type: String
    }
});

// Model based on the schema
const Blog = mongoose.model('Blog', blogSchema);

// MongoDB connection
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose.connect('mongodb://riteshponty:VcCujxKVZPImncPV@ac-aztryrz-shard-00-00.kieyyok.mongodb.net:27017,ac-aztryrz-shard-00-01.kieyyok.mongodb.net:27017,ac-aztryrz-shard-00-02.kieyyok.mongodb.net:27017/?ssl=true&replicaSet=atlas-woodvy-shard-0&authSource=admin&retryWrites=true&w=majority')
    .then(() => {
        console.log('Database connected');
    })
    .catch((err) => {
        console.log(err);
    });

// Express configurations
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
    res.redirect("/add-blog");
});

app.get("/show-blogs", async (req, res) => {
    const allBlogs = await Blog.find({});
    console.log(allBlogs);
    res.render('Show_blogs', { allBlogs });
});

app.get('/add-blog', (req, res) => {
    res.render("add_items");
});

app.post('/add-blog', async (req, res) => {
    console.log(req.body);
    const { fname, lname, email, title, image1, image2, image3, image4, content } = req.body;

    const isDataStored = await Blog.create({
        name: fname + " " + lname,
        email: email,
        photo: [image1, image2, image3, image4],
        text: content,
        title: title
    });

    if (!isDataStored) {
        console.log('Error');
    }

    console.log('Data stored successfully');
    res.redirect("/show-blogs");
});

app.get("/read-blog/:id", async (req, res) => {
    const { id } = req.params;
    const item = await Blog.findById(id);
    console.log(item);
    res.render('read_blogs', { item });
});

app.post("/delete-blog/:id", async (req, res) => {
    const { id } = req.params;
    const deleteItem = await Blog.findByIdAndDelete(id);

    if (!deleteItem) {
        console.log('Item not deleted');
    }

    console.log('Item deleted');
    res.redirect("/show-blogs");
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
