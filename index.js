const express = require('express')
const app = express()	
const port = 3000
//bodyParser
let body_parser = require('body-parser')
app.use(body_parser.urlencoded({extended:true}));
app.use(body_parser.json());


//mysql
var mysql = require('mysql');
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '',
	database: 'tutorial_node_js'
});

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/logs', (req, res) => {
	res.send('')
});

	let data = [{
		'nama' : 'Geofany',
		'email' : 'geo@geo.com',
		'telepon' : '088888',
		'alamat_rumah' : 'Jalan jalan aja',
		'tanggal_lahir' : '12/08/2002'
	},
	{
		'nama' : 'Atta halilintar',
		'email' : 'atta@ahha.com',
		'telepon' : '080808080',
		'alamat_rumah' : 'jalan sakti mantra guna',
		'tanggal_lahir' : '11/01/2001'
	}]
app.get('/user', (req,res)=>{
	res.send(data,200);
});


app.get('/user/:id', (req,res)=> {
	if(req.params.id>data.length-1){
		res.send(404);
	}else{
		res.send(data[req.params.id],200);
	}
})

app.post('/user',(req,res)=>{
	var response = {
		'nama' :req.body.nama,
		'email' :req.body.email,
		'telepon' :req.body.telepon,
		'alamat_rumah' : req.body.alamat_rumah,
		'tanggal_lahir' : req.body.tanggal_lahir
	}
	data.push(response);
	res.send(response, 201);
})

app.put('/user/:id',(req,res)=>{
	var response = {
		'name' : req.body.name,
		'email' : req.body.email,
		'telepon' : req.body.telepon,
		'alamat_rumah' : req.body.alamat_rumah,
		'tanggal_lahir' : req.body.tanggal_lahir
	}
	data[req.params.id] = response;
	res.send(response, 200);
})

app.delete('/user/:id', (req,res)=> {

	data.splice(req.params.id, 1);
	res.send(204);
})

app.get('/v2/user',(req,res)=>{

	connection.query('SELECT * FROM siswa',function(error, results){
		if(error) throw error;

		res.send(results, 200);
	})
})
app.get('/v2/user/:id',(req,res)=>{
	var id = req.params.id;
	connection.query('SELECT * FROM siswa WHERE id= ?', [id],function(error,results){
		if(results.length>0){
			if(error) throw error;

			res.send(results[0], 200);
		}else{
			res.send(404);
		}
	})
})

app.post('/v2/user',(req,res)=>{
	var data = {
		nama:req.body.nama,
		jurusan:req.body.jurusan,
		jenis_kelamin:req.body.jenis_kelamin,
		no_hp:req.body.no_hp
	}

	connection.query('INSERT INTO siswa (nama, jurusan,jenis_kelamin, no_hp) VALUES (?,?,?,?)',
		[data.nama, data.jurusan, data.jenis_kelamin, data.no_hp],
		function (error, results){
			if(error) throw error;
			var id = results.insertId;
			if(id){
				data.id = results.insertId;
				res.send(data, 201);
			}else{
			res.send(results, 200);
		}
		})
})

app.put('/v2/user/:id',(req,res)=>{
	var id = req.params.id;
	var data = {
		nama:req.body.nama,
		jurusan:req.body.jurusan,
		jenis_kelamin:req.body.jenis_kelamin,
		no_hp: req.body.no_hp
	}

	connection.query('UPDATE siswa SET nama=?, jurusan=?, jenis_kelamin=?, no_hp=? WHERE id=?',
		[data.nama, data.jurusan, data.jenis_kelamin, data.no_hp, id],
		function (error, results){
			if(error) throw error;
			var changedRows = results.changedRows;
			if(changedRows){
				data.id = id;
				res.send(data, 201);
			}else{
			res.send(results, 404);
		}
		})
})

app.delete('/v2/user/:id',(req,res)=>{
	var id = req.params.id

	connection.query('DELETE FROM siswa where id=?',[id],
		function(error, results){
			if(error) throw error;

			if(results.affectedRows>0){
				res.send(204)
			}else{
				res.send(404)
			}
		})
})

app.get('/error-server', (req, res) => {
    res.send(500);

});
app.get('/bad-request', (req, res) => {
    res.send(400);
});
app.get('/created', (req, res) => {
    res.send(201);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))