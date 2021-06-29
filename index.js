const { response } = require('express');
const express = require('express');
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

app.listen(port, () => console.log(`Example app listening on port port!`))