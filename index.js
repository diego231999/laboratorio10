const { response } = require('express');
const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000
const bp = require('body-parser');


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

app.post('/empleados/update', bp.urlencoded({extended: true}), function (req, res) {
    let employeeId = req.body.EmployeeID;
    let email = req.body.Email;
    let address = req.body.Address;
    let parametros;
    let query;
    console.log(email);
    console.log(address);
    if(email==null && address!=null){
        parametros = [address, employeeId];
        query="UPDATE employees SET address=? where employees.EmployeeID=?";
    }else if(address==null && email!=null){
        parametros = [email, employeeId];
        query="UPDATE employees SET email=? where employees.EmployeeID=?";
    }else{
        parametros = [email,address, employeeId];
        query="UPDATE employees SET email=?, address=? where employees.EmployeeID=?";
    }

    conn.query(query, parametros, function (err, result) {
        if (err) throw err;

        conn.query("SELECT * FROM employees", function (err, results) {
            res.json(results);
        });
    });
});


app.listen(port, () => console.log(`Example app listening on port port!`))


