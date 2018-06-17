/*
****@ Core node modules
*/
var express = require('express');
var http = require('http');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');

/*
*** Parse all form data
*/
app.use(bodyParser.urlencoded({ extended: false }));

/*
***@ Used for foramtting dates
*/
var dateFormat = require('dateformat');
var now = new Date();

/*
* This is view engine
* Template parsing
* We are using EJS types
*/
app.set('view engine', 'ejs');

/****
	*
	* Import all related JavaScript and CSS files to inject in our APP
	*
	*
*****/
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));


/****
	*
	* Database is connection
	* Localhost - When is production mode change this to your host
	* User - User name of the database
	* Password - Database password
	* Database - Database is the name of the database
	*
****/

var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'mydb'
});

/**
****Global site title and base url
**/
var siteTitle = "Simple Application";
var baseURL = "http://localhost:4000/"


/****
	*
	*	When page is loaded
	*	Default page is loaded and the data is being called from MySQL database
	*	We also adding some JavaScrips and CSS Styles
	*
****/

app.get('/', function (req, res){
	/*
		Get the event list
	*/
	con.query("SELECT * FROM sampleitem ORDER BY Name", function (err, Result){
		res.render('pages/index', {
			siteTitle : siteTitle,
			pageTitle : "Event list",
			items : Result
		
		});
	});
});

/*
* Add new event
*/

app.get('/event/add', function (req, res){
	/*
		Get the event list
	*/
	res.render('pages/add-event.ejs', {
		siteTitle : siteTitle,
		pageTitle : "Add new event",
		items : ''
	});
});

/*
	This is a POST method to data and pre-populate to the firm
*/

app.post('/event/add', function(req, res){
	/*
	** Get the record base on ID
	*/

	var query = "INSERT INTO `sampleitem` (`Name`, `Quantity`, `Value`) VALUES (";
		query += " '"+req.body.Name+"', ";
		query += " '"+req.body.Quantity+"',";
		query += " '"+req.body.Value+"')";

	con.query(query, function (err, Result) {
		res.redirect(baseURL);
	});
});

/*
 * Edit Event
 *
*/

app.get('/event/edit/:event_id', function(req, res){
	/*
	*	Get the record base on ID
	*/
	con.query("SELECT * FROM sampleitem WHERE ID = '"+ req.params.event_id + "'", function (err, Result) {
		res.render('pages/edit-event', {
			siteTitle : siteTitle,
			pageTitle : "Editing event : " + Result[0].Name,
			item : Result
		});
	});
});


/*
	This is a POST method
*/
app.post('/event/edit/:event_id', function(req, res) {
	/*
	** Get the record base on event ID
	*/
	var query = "UPDATE `sampleitem` SET";
		query += " `Name` = '"+req.body.Name+"',";
		query += " `Quantity` = '"+req.body.Quantity+"',";
		query += " `Value` = '"+req.body.Value+"'";
		query += " WHERE `ID` = "+req.params.event_id+"";

	con.query(query, function (err, Result) {
		if(Result.affectedRows)
		{
			res.redirect(baseURL);
		}
	});
});

app.get('/event/delete/:event_id', function(req, res) {
	con.query("DELETE FROM sampleitem WHERE ID='"+req.params.event_id+"'", function (err, Result) {
		if(Result.affectedRows)
		{
			res.redirect(baseURL);
		}
	});
});

/*****
	 *
	 * Connect to the server
	 *
******/
var server = app.listen(4000, function(){
	console.log("Server started on 4000,,,,");
});