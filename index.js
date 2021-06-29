const express = require('express');
const mysql = require('mysql2');
const bp = require('body-parser');

const app = express();

let conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lab10_employees'
});

app.post('/empleados/update', bp.urlencoded({extended: true}), function (req, res) {

    let employeeId = req.body.employeeId;
    let email = req.body.email;
    let address = req.body.address;
    let parametros;
    let query;
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
