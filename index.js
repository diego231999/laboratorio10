const {response} = require('express');
const express = require('express');

const bodyParser = require('body-parser');
const multer = require('multer');
let upload = multer();

const mysql = require('mysql2');

const app = express();
const port = 3000


let conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lab10_employees'
});

conn.connect(function (err) {
    if (err) throw err;
    console.log("Conexión exitosa a base de datos");
});


app.get("/empleados/get", function (req, res) {

    conn.query("SELECT * FROM employees", function (err, results) {
        if (err) throw err;

        let employeeList = [];
        for (var j = 0; j < results.length; j++) {

            employee = {
                'EmployeeID': results[j]['EmployeeID'],
                'LastName': results[j]['LastName'],
                'FirstName': results[j]['FirstName'],
                'Title': results[j]['Title']
            };
            employeeList.push(employee);
        }

        res.json(employeeList);
    });

});

app.get('/empleados/getManagerEmployees/:id', (req, res) => {
    let ReportsTo = req.params.id;

    let query = "SELECT * FROM lab10_employees.employees where ReportsTo = ?";
    let parameters = [ReportsTo];

    conn.query(query, parameters, function (err, results) {
        if (err) throw err;

        let employeeList = [];
        for (var j = 0; j < results.length; j++) {

            employee = {
                'EmployeeID': results[j]['EmployeeID'],
                'LastName': results[j]['LastName'],
                'FirstName': results[j]['FirstName'],
                'Title': results[j]['Title']
            };
            employeeList.push(employee);
        }

        res.json(employeeList);
    });
})

app.get('/empleados/getByTitle/:title', (req, res) => {
    let Title = req.params.title;

    let query = "SELECT * FROM lab10_employees.employees where Title = ?";
    let parameters = [Title];

    conn.query(query, parameters, function (err, results) {
        if (err) throw err;

        let employeeList = [];
        for (var j = 0; j < results.length; j++) {

            employee = {
                'EmployeeID': results[j]['EmployeeID'],
                'LastName': results[j]['LastName'],
                'FirstName': results[j]['FirstName'],
                'Title': results[j]['Title']
            };
            employeeList.push(employee);
        }

        res.json(employeeList);
    });
})
//PREGUNTA4
app.post('/empleados/update', bodyParser.json(),function(request, response){
    let query = "";

    let employeeId = request.body.id;
    let correo = request.body.email;
    let direccion = request.body.address;

    console.log(`${employeeId} Recibido`);
    console.log(`${correo} Recibido`);
    console.log(`${direccion} Recibido`);

    let parametros = [];

    let status = "ok";
    let message = "Employee updated";
    let jsonResponse = {
        "status": status,
        "message": message
    }

    if(correo !== undefined && direccion !== undefined){
        query = "update employees set Address = ? , Email = ?  where EmployeeID = ? ;";
        parametros = [direccion, correo, employeeId];

    }else{
        if(correo === undefined){
            query = "update employees set Address = ?  where EmployeeID = ? ;";
            parametros = [direccion, employeeId];

        }else if(direccion === undefined){
            query = "update employees set Email = ?  where EmployeeID = ? ;";
            parametros = [correo, employeeId];

        }
    }

    conn.query(query, parametros, function (err, result){
        console.log(query);
        if (err) {
            jsonResponse["status"] = "error";
            jsonResponse["message"] = err["sqlMessage"];
            response.status(400);
            response.json(jsonResponse);
        } else {
            response.json(jsonResponse);
        }
    });

});

// PREGUNTA 5
app.get('/productos/get', function (request, response) {
    let page = request.query.page;
    console.log(page);
    let size = 10;
    let pageQuery = size * page - size; // depende del tamaño de la pagina
    let query = "select  ProductID, ProductName, UnitPrice, UnitsInStock from products limit ?, ?";
    let params = [pageQuery, size];

    conn.query(query, params, function (err, result) {
        if (err) throw err;
        response.json(result)
    });
});

// PREGUNTA 6
app.post('/categorias/create', upload.none(), function (request, response) {
    let name = request.body.name;
    let description = request.body.description;
    let picture = request.body.picture;

    console.log(`Nombre: ${name} | Description: ${description} |  Imagen: ${picture}`);

    let status = "OK";
    let message = "Category created";

    let jsonResponse = {
        "status": status,
        "message": message
    }
    // validacion de la extension
    if (!(picture.toString().split('.')[1] === "png" || picture.toString().split('.')[1] === "jpeg")) {
        jsonResponse["status"] = "error";
        jsonResponse["message"] = "Picture name doesn't have correct extension";
        response.status(400);
        response.json(jsonResponse);
    }

    let params = {
        CategoryName: name,
        Description: description,
        Picture: picture
    };
    let query = "insert into categories set ? ;"

    conn.query(query, params, function (err, result) {
        if (err) {
            jsonResponse["status"] = "error";
            jsonResponse["message"] = err["sqlMessage"];
            response.status(400);
            response.json(jsonResponse);
        } else {
            response.json(jsonResponse);
        }
    });


});

app.listen(port, () => console.log(`Example app listening on port port!`))