/*************************************************************************
* WEB322– Assignment 4
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part of this assignment has been copied manually or electronically from any
other source.
* (including 3rd party web sites) or distributed to other students.
*
* Name: Anna Seo       Student ID: 110186202       Date: Sunday, October 30, 2022
*
* Your app’s URL (from Heroku) :https://nameless-mountain-75165.herokuapp.com/
*
*************************************************************************/
const e = require("express");
const express = require("express");
const app = express();
const multer = require('multer');
const path = require('path');
var data_service = require('./data-service');
const HTTP_PORT = process.env.PORT || 8080;

const exphbs = require('express-handlebars');
app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs', 
    defaultLayout: 'main',
    helpers:{
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
            '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
        }
    }
}));

app.set('view engine', '.hbs');

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

app.get("/", (req, res) => {
    res.render('home', {
    });
});

app.get("/about", (req, res) => {
    res.render('about', {
    });
});

app.get("/employees", function (req, res) {
    var status = req.query.status;
    var department = req.query.department;
    var manager = req.query.manager;
    if (status) {
        data_service.getEmployeesByStatus(status).then((data) => {
            res.render("employees", {employees: data}) 
        }).catch((err) => {
            res.render({message:"no results"});
        })
    }
    else if (department) {
        data_service.getEmployeesByDepartment(department).then((data) => {
            res.render("employees", {employees: data}) 
        }).catch((err) => {
            res.render({message:"no results"});
        })
    }
    else if (manager) {
        data_service.getEmployeesByManager(manager).then((data) => {
            res.render("employees", {employees: data}) 
        }).catch((err) => {
            res.render({message:"no results"});
        })
    }
    else {
        data_service.getAllEmployees().then((data) => {
            res.render("employees", {employees: data}) 
        }).catch((err) => {
            res.render({message:"no results"});
        })
    }
});

app.get("/employee/:value", (req, res) => {
    data_service.getEmployeeByNum(req.params.value).then((data) => {
        res.render("employee", {employee: data});
    }).catch((err) => {
        res.render("employee",{message:"no results"});
    })
});

app.post("/employee/update", (req, res) => {
    data_service.updateEmployee(req.body).then((data) => {
        res.redirect("/employees");
    })
});

app.get("/employees/add", (req, res) => {
    res.render('addEmployee', {
    });
});

app.post("/employees/add", (req, res) => {
    data_service.addEmployee(req.body).then((data) => {
        res.redirect("/employees");
    })
})

app.get("/departments", (req, res) => {
    data_service.getDepartments().then((data) => {
        res.render("departments",{departments: data});
    }).catch((err) => {
        res.json({message: err})
    })
});

app.get("/images/add", (req, res) => {
    res.render('addImage', {
    })
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.get("/images", (req, res) => {
    let fs = require('fs');
    var imgArr = { images: [] };
    fs.readdir("./public/images/uploaded", function (err, items) {
        for (var i = 0; i < items.length; i++) {
            imgArr.images.push(items[i]);
        }
        res.render("images", imgArr);
    });
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

data_service.initialize()
    .then(() => {
        app.listen(HTTP_PORT, onHttpStart);
    })
    .catch(function (err) {
        console.log(err);
    })