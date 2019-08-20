const express = require('express')
const app = express()
const port = 3000
let body_parser = require('body-parser')
app.use(body_parser.urlencoded({ extended: true }))
app.use(body_parser.json());

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'belajar_express'
});
connection.connect()
let data = [{
    'name': 'santuy',
    'email': 'santuy@gmail.com',
    'phone': '08777777777'
},
{
    'name': 'ashiap',
    'email': 'ashiap@gmail.com',
    'phone': '08999999999'

}]

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/logs', (req, res) => {
    console.log('Open Pages Logs')
    res.send('');
})

app.get('/user', (req, res) => {

    res.send(data, 200)
})
app.get('/user/:id', (req, res) => {
    if (req.param.id > data.length - 1) {
        res.send(404)
    } else {
        res.send(data[req.param.id], 200);
    }
})

app.post('/user', (req, res) => {
    var response = {
        'name': req.body.name,
        'email': req.body.email,
        'phone': req.body.phone
    }
    data.push(response);

    res.send(response, 201);
})

app.put('/user/:id', (req, res) => {
    var response = {
        'name': req.body.name,
        'email': req.body.email,
        'phone': req.body.phone
    }
    data[req.param.id] = response;

    res.send(response, 200)
});
app.delete('/user/:id', (req, res) => {
    data.slice(req.param.id, 1);

    res.send(204);
});

app.get('/v2/user', (req, res) => {
    connection.query('SELECT * FROM user',function(error,result){
        if(error) throw error;

        res.send(result, 200);
    })
})

app.get('/v2/user/:id', (req, res) => {
    var id = req.params.id
    connection.query('SELECT * FROM user WHERE id="'+id+'"',
    function(error,result){
        if(error) throw error;
        if(result.length>0){
            res.send(result[0], 200)
        }else{
            res.send(404);
        }
    })
})

app.post('/v2/user', (req, res) => {
    var data = {
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone
    }

    connection.query('INSERT INTO user (name, email, phone) VALUES(?,?,?)',[data.name,data.email,data.phone],
    function(error, result){
        if(error) throw error
        var id =  result.insertId
        if(id){
            data.id = result.insertId
            res.send(data, 201);

        }else{
            res.send(400);
        }
    })
});

app.put('/v2/user/:id', (req, res) => {
    var id = req.params.id
    var data = {
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone
    }

    connection.query('UPDATE user SET name=?, email=?, phone=? WHERE id=?',[data.name,data.email,data.phone,id],
    function(error, result){
        if(error) throw error
        var ChangedRows =  result.ChangedRows
        if(ChangedRows>0){
            data.id = id
            res.send(data, 200);

        }else{
            res.send(404);
        }
    })
});

app.delete('/v2/user/:id', (req, res) => {
    var id = req.params.id

    connection.query('DELETE FROM user WHERE id = ?',[id],
    function(error, result){
        if(error) throw error
        if (result.affectedRows>0){
            res.send(204)
        }else{
            res.send(404);
        }
    })
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))