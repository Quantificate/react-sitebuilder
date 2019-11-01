const exp = require('express');
const fs = require('fs');
const sql = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = exp();
const port = process.env.PORT || 5000;

let db = new sql.Database('./fpg.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to DB');
  }
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.listen(port, () => console.log(`Server running on port` + port));

app.get('/customers', (req, res) => {
  db.all(
    `SELECT
      id,
      company,
      site,
      contactname,
      fullname,
      emailaddress,
      address,
      city,
      state,
      zip,
      phone,
      seoSite,
      hasTerms,
      username,
      package
      FROM customers;
    `, (err, rows) => {
      if (err) {
        throw err;
      }
      res.send(rows);
    }
  )
  // db.close();
});

app.get('/customerTerms', (req, res) => {
  db.all(
    `SELECT * FROM customerTerms;`,
    (err, rows) => {
      if (err) {
        console.log(err);
      }
      res.send(rows);
    }
  )
});

function nameMaker(kts){
	let i=0;
	let ktout = [];
	for (i in kts){
		let current = kts[i].toLowerCase();
		let fixed = current.split(' ').join('-');
		let ktfile = fixed + '.html'
		ktout.push(ktfile);
	}
	return ktout;
}

function genericMLM(fnames, dir, company, url, email, newurl){
	let j=0;
	let k = 0;
	let links = ``;
	for (k in fnames){
		let revkt = fnames[k].split('-').join(' ');
		revkt = revkt.replace('.html','');
		let text = revkt.toLowerCase()
			.split(' ')
			.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
			.join(' ');
		let link = '				<li><a href="/' + fnames[k] + '">' + text + '</a></li>';
		links = links + "\n" + link;
	}
	fs.appendFile(
		dir + 'index.html',
		`<!DOCTYPE html>
		<html>
		  <head>
			<title>` + company + `</title>
			<link href="https://fonts.googleapis.com/css?family=Abel|Raleway&display=swap" rel="stylesheet">
			<link href="index.css" rel="stylesheet" type="text/css">
		  </head>
		  <body>
			<header>
			</header>
			<div id="contentarea">
			  <div id="infobox">
				<div id="logo">
				  <img src="/static/logo.png" alt="` + company + ` Logo" />
				</div>
				<div id="infoform">
				  <form action="javascript: sendData()">
					<div>
					  <label for="name">Name:</label>
					  <input type="text" id="name" name="name">
					</div>
					<div>
					  <label for="mail">E-mail:</label>
					  <input type="email" id="mail" name="mail">
					</div>
					<div>
					  <label for="address">Phone #:</label>
					  <input type="text" id="address" name="address">
					</div>
					<div>
					  <label for="message">Message:</label>
					  <input type="textbox" id="message" name="message">
					</div>
					<div class="button">
					  <button type="submit">Find Out More!</button>
					</div>
				  </form>
				  <div id="buttonbox">
					<a href="` + url + `"><div id="button"><h3>Click Here for More Info!</h3></div></a>
				  </div>
				</div>
			  </div>
			  <div id="linkbox">
				<ul>`
				  + links +
				`</ul>
			  </div>
			  <div id="relinks">
				<ul>
				  <li><a href="https://www.homebusinessmag.com">Home Business</a></li>
				  <li><a href="https://www.smallbiztrends.com">Small Business Trends</a></li>
				  <li><a href="https://www.entrepreneur.com">Entrepreneur</a></li>
				</ul>
				<h6>Powered by <a href="http://the1stpagegroup.com">The First Page Group</a></h6>
			  </div>
			</div>
		  <script src="https://smtpjs.com/v3/smtp.js"></script>
		  <script>
			function sendData(){
			  let nameVal = document.getElementById("name").value;
			  let mailVal = document.getElementById("mail").value;
			  let addVal = document.getElementById("address").value;
			  let msgVal = document.getElementById("message").value;
			  Email.send({
				Host: "smtp.gmail.com",
				Username: "1stpgemail@gmail.com",
				Password: "Yeswewill@1",
				To: "yeswewill111@gmail.com, ` + email + `",
				From: mailVal,
				Subject: "Info Request from ` + newurl + `",
				Body: "Name: " + nameVal + "   Address: " + addVal + "    Message: " + msgVal
			  }).then(
				message => alert(message)
			  );

			};
			</script>
		  </body>
		</html>`,
		function(err){
			if (err) throw err;
			console.log(dir + "index.html created!");
		}
	);
	fs.appendFile(dir + 'index.css', ``, function(err){
			if (err) throw err;
			console.log(dir + "index.css created!");
		}
	);

	for (j in fnames){
		let path = dir + fnames[j];
		fs.appendFile(path, ``, function(err){
			if (err) throw err;
		});
		console.log(path + " created!");
	}
}

app.post('/builder', (req, res) => {
  console.log(req.body);
  let name = req.body.fullname.toLowerCase().replace(/\s/g, "");
  if(req.body.style === 'Generic MLM'){
    genericMLM(nameMaker(req.body.terms), 'D:/CodingStuff/Sites/yeswewill/' + name + '/', req.body.company, req.body.site, req.body.emailaddress, req.body.seoSite);
  }
});
