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

function newStyle(fnames, dir, company, url, email, phone, newurl, content, headers, color, name, externals, bio){
	let j=0;
	let k = 0;
	let links = ``;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  if (!fs.existsSync(dir + 'static/')){
    fs.mkdirSync(dir + 'static/');
  }
	for (k in fnames){
		let revkt = fnames[k].split('-').join(' ');
		revkt = revkt.replace('.html','');
		let text = revkt.toLowerCase()
			.split(' ')
			.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
			.join(' ');
		let link = `    <div class="card">
      <div class="card-body">
        <a href="` + fnames[k] + `"><h6 class="card-title">` + text + `</h6></a>
        <p class="card-text"><!-- Blurb goes here --></p>
      </div>
    </div>
    `
		links = links + "\n" + link;
	}
  let indexfile = dir + 'index.html';
  let cssfile = dir + 'index.css';
  let fontcolor = '#000000';
  if (color === '#333333'){
    fontcolor = '#eeeeee';
  }
  let exLinks = [];
  for (y in externals){
    exLinks.push(`<li><a href="` + externals[y] + `" target="_blank" rel="noopener noreferrer"><!-- Link Name --></a></li>`)
  }
  let niceLinks = ``;
  for (d in exLinks){
    niceLinks = niceLinks + exLinks[d] + '\n';
  }
  let cleanBio = "<p>" + bio.replace(/(\r\n|\n|\r)/gm, "</p>\n<p>") + "</p>";
  console.log(cleanBio);
  console.log(niceLinks);
	fs.appendFile(
		indexfile,
		`
    <!doctype html>
    <html lang="en">
      <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <link rel="stylesheet" href="/static/index.css" type="text/css">
        <link href="https://fonts.googleapis.com/css?family=Alata|Open+Sans&display=swap" rel="stylesheet">
        <title>` + company + ` | ` + name + `</title>
      </head>
      <body>
        <header>
          <div id="wrapper">
            <div class="container" id="necklace">
              <div class="row">
                <div class="col-1" id="logo">
                  <img src="/static/logo.png" />
                </div>
                <div class="col-3" id="name">
                  <h2>` + company + `</h2>
                </div>
                <div class="col-8">
                  <ul class="nav">
                    <li class="nav-item">
                      <a class="nav-link active" href="/">Home</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="` + url + `">Opportunities</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="` + url + `">Products</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="tel:` + phone + `">Call Me for Info</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="mailto:` + email + `">Email Me!</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div class="container" id="centercol">
          <div class="row">
            <div class="col-3" id="phrases">
              ` + links + `
            </div>
            <div class="col-7" id="maintext">
              <h1>` + name + `</h1>
              <h4>` + company + `</h4>
              ` + cleanBio + `
              <p>
                <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#capform" aria-expanded="false" aria-controls="capform">
                  Find Out More!
                </button>
              </p>
              <div class="collapse" id="capform">
                <div class="card card-body">
                  <form>
                    <div class="form-group">
                      <label for="name">Your Name:</label>
                      <input type="text" class="form-control" id="name" placeholder="Enter Your Name">
                    </div>
                    <div class="form-group">
                      <label for="email">Email Address:</label>
                      <input type="email" class="form-control" id="email" placeholder="Enter Your Email">
                    </div>
                    <div class="form-group">
                      <label for="phone">Phone Number:</label>
                      <input type="text" class="form-control" id="phone" placeholder="Enter Your Phone Number">
                    </div>
                    <div class="form-group">
                      <label for="message">Message:</label>
                      <input type="textarea" class="form-control" id="message" placeholder="Put your question/comment here.">
                    </div>
                    <button type="submit" class="btn btn-success" onClick="sendData()">Submit</button>
                  </form>
                </div>
              </div>
            </div>
            <div class="col-2" id="linklist">
              <ul id="externals">
                ` + niceLinks + `
              </ul>
              <ul id="related">
                <li><a href="https://google.com" target="_blank" rel="noopener noreferrer">Linkage</a></li>
                <li><a href="https://google.com" target="_blank" rel="noopener noreferrer">Somewhere</a></li>
                <li><a href="https://google.com" target="_blank" rel="noopener noreferrer">Another Link</a></li>
                <li><a href="https://google.com" target="_blank" rel="noopener noreferrer">Something Else</a></li>
              </ul>
              <ul id="socials">
                <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><img src="/static/fb.png" class="socialicon" /></a></li>
                <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><img src="/static/insta.png" class="socialicon" /></a></li>
                <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><img src="/static/twit.png" class="socialicon" /></a></li>
                <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><img src="/static/yt.png" class="socialicon" /></a></li>
              </ul>
          </div>
        </div>
      </div>
        <div class="divider"></div>
        <div class="container" id="vid">
          <div class="row">
            <div class="col-12" id="vidframe">
              <!-- youtube iframe goes here -->
            </div>
          </div>
        </div>
        <footer>
          <div class="container">
            <h5>Powered by <a href="https://the1stpagegroup.com">The First Page Group</a></h5>
          </div>
        </footer>

        <!-- Optional JavaScript -->
        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
        <script src="https://smtpjs.com/v3/smtp.js"></script>
        <script>
          function sendData(){
            let nameVal = document.getElementById("name").value;
            let mailVal = document.getElementById("email").value;
            let addVal = document.getElementById("phone").value;
            let msgVal = document.getElementById("message").value;
            Email.send({
              Host: "smtp.gmail.com",
              Username: "1stpgemail@gmail.com",
              Password: "Yeswewill@1",
              To: "yeswewill111@gmail.com, ` + email + `",
              From: mailVal,
              Subject: "Info Request from ` + url + `",
              Body: "Name: " + nameVal + "   Phone: " + addVal + "    Message: " + msgVal
            }).then(
              message => alert(message)
            );
          };
          </script>
      </body>
    </html>
		`,
		function(err){
			if (err) throw err;
			console.log(dir + "index.html created!");
		}
	);
	fs.appendFile(cssfile,
    `
    html, body {
        margin:0;
    }

    h1, h2, h3 {
        font-family:'Alata', serif;
    }

    h4, h5, h6, a, p, li {
        font-family:'Open Sans', sans-serif;
    }

    ul, li {
        list-style:none;
    }

    a {
        color:#333333;
    }

    a:hover {
        color:` + color + `;
    }

    #logo img {
        max-height:65px;
        margin-top:5px;
    }

    header .container .row {
        height:150px;
    }

    #name h2 {
        font-size:20px;
        margin-top:25px;
        margin-left:5px
    }

    #externals, #related {
        border-bottom: ` + color + ` 1px solid;
    }

    #externals li, #related li {
        margin-bottom:20px;
        margin-left:-15px;
    }

    #socials li img {
        max-width:50px;
        margin-bottom:20px;
        margin-left:10px;
    }

    #socials ul li {
        display:inline-block;
        margin-top:50px;
    }

    #upperlinks .nav {
        margin-top:50px;
    }

    #upperlinks .nav a {
        font-size:14px;
    }

    #maintext img {
        margin:5px 0 15px;
        max-width:100%;
    }

    #wrapper {
        width:100%;
        height:75px;
        background:` + color + `85;
        margin-bottom:25px;
    }

    .nav {
        margin:auto;
        margin-top:15px;
    }

    .nav a {
        color:#010101;
        font-weight:bold;
    }

    .nav a:hover {
        color:` + color + `;
    }

    #contentbox img {
        max-width:100%;
        margin:10px 0 25px;
    }

    .card-body {
        background:#eeeeee;
        font-size:14px;
        line-height:15px;
        padding:10px;
    }

    .card-body h6 {
        font-weight:bold;
        font-size:14px;
    }

    .divider {
        background: ` + color + `85;
        height:25px;
        margin:25px 0px;
        width:100%;
    }

    #linksvid .col-3 li {
        margin-bottom:25px;
    }

    #linksvid .col-3 li a {
        font-weight:bold;
    }

    footer {
        width:100%;
        height:80px;
        background:#cccccc;
        padding-top:5px;
        margin-top:25px;
    }

    footer h5 {
        margin-top:25px;
    }

    @media only screen and (max-width:425px){
        #wrapper #name {display:none;}
        #logo {display:none;}
        #necklace .col-8 {max-width:100% !important; width:100%; flex:0 0 100%;}
        #necklace .col-8 .nav-item {margin:0 !important;}
        #necklace .col-8 .nav-item a {margin:0; font-size:12px; line-height:1;}
        .nav-link {padding:5px 5px 15px;}
        #linklist {display:none;}
        #maintext h1 {font-size:24px;}
        #maintext h4 {font-size:14px;}
        #maintext p {font-size:12px;}
        #phrases .card .card-body a h6 {font-size:10px !important;}
        #phrases .card .card-body p {font-size:10px;}
        .card-text {display:none;}
    }
    `,
    function(err){
			if (err) throw err;
			console.log(dir + "index.css created!");
		}
	);

	for (j in fnames){
		let path = dir + fnames[j];
    let cleanContent = "<p>" + content[j].replace(/(\r\n|\n|\r)/gm, "</p>\n<p>") + "</p>";
    console.log(cleanContent);
		fs.appendFile(path,
      `
      <!doctype html>
      <html lang="en">
        <head>
          <!-- Required meta tags -->
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

          <!-- Bootstrap CSS -->
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
          <link rel="stylesheet" href="/static/index.css" type="text/css">
          <link href="https://fonts.googleapis.com/css?family=Alata|Open+Sans&display=swap" rel="stylesheet">
          <title>` + company + ` | ` + headers[j] + `</title>
        </head>
        <body>
          <header>
            <div id="wrapper">
              <div class="container" id="necklace">
                <div class="row">
                  <div class="col-1" id="logo">
                    <img src="/static/logo.png" />
                  </div>
                  <div class="col-3" id="name">
                    <h2>` + company + `</h2>
                  </div>
                  <div class="col-8">
                    <ul class="nav">
                      <li class="nav-item">
                        <a class="nav-link active" href="/">Home</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="` + url + `">Opportunities</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="` + url + `">Products</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="tel:` + phone + `">Call Me for Info</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="mailto:` + email + `">Email Me!</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div class="container" id="centercol">
            <div class="row">
              <div class="col-3" id="phrases">
                ` + links + `
              </div>
              <div class="col-7" id="maintext">
                <h1>` + headers[j] + `</h1>
                <h4><!-- Blurb goes here --></h4>
                ` + cleanContent + `
                <p>
                  <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#capform" aria-expanded="false" aria-controls="capform">
                    Find Out More!
                  </button>
                </p>
                <div class="collapse" id="capform">
                  <div class="card card-body">
                    <form>
                      <div class="form-group">
                        <label for="name">Your Name:</label>
                        <input type="text" class="form-control" id="name" placeholder="Enter Your Name">
                      </div>
                      <div class="form-group">
                        <label for="email">Email Address:</label>
                        <input type="email" class="form-control" id="email" placeholder="Enter Your Email">
                      </div>
                      <div class="form-group">
                        <label for="phone">Phone Number:</label>
                        <input type="text" class="form-control" id="phone" placeholder="Enter Your Phone Number">
                      </div>
                      <div class="form-group">
                        <label for="message">Message:</label>
                        <input type="textarea" class="form-control" id="message" placeholder="Put your question/comment here.">
                      </div>
                      <button type="submit" class="btn btn-success" onClick="sendData()">Submit</button>
                    </form>
                  </div>
                </div>
              </div>
              <div class="col-2" id="linklist">
                <ul id="externals">
                  ` + niceLinks + `
                </ul>
                <ul id="related">
                  <li><a href="https://google.com" target="_blank" rel="noopener noreferrer">Linkage</a></li>
                  <li><a href="https://google.com" target="_blank" rel="noopener noreferrer">Somewhere</a></li>
                  <li><a href="https://google.com" target="_blank" rel="noopener noreferrer">Another Link</a></li>
                  <li><a href="https://google.com" target="_blank" rel="noopener noreferrer">Something Else</a></li>
                </ul>
                <ul id="socials">
                  <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><img src="/static/fb.png" class="socialicon" /></a></li>
                  <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><img src="/static/insta.png" class="socialicon" /></a></li>
                  <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><img src="/static/twit.png" class="socialicon" /></a></li>
                  <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><img src="/static/yt.png" class="socialicon" /></a></li>
                </ul>
                <ul id="more">
                  <li><a href="` + url + `" target="_blank" rel="noopener noreferrer"><button class="btn btn-primary">Learn More</button></a></li>
                </ul>
            </div>
          </div>
        </div>
          <footer>
            <div class="container">
              <h5>Powered by <a href="https://the1stpagegroup.com">The First Page Group</a></h5>
            </div>
          </footer>

          <!-- Optional JavaScript -->
          <!-- jQuery first, then Popper.js, then Bootstrap JS -->
          <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
          <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
          <script src="https://smtpjs.com/v3/smtp.js"></script>
          <script>
            function sendData(){
              let nameVal = document.getElementById("name").value;
              let mailVal = document.getElementById("email").value;
              let addVal = document.getElementById("phone").value;
              let msgVal = document.getElementById("message").value;
              Email.send({
                Host: "smtp.gmail.com",
                Username: "1stpgemail@gmail.com",
                Password: "Yeswewill@1",
                To: "yeswewill111@gmail.com, ` + email + `",
                From: mailVal,
                Subject: "Info Request from ` + newurl + `",
                Body: "Name: " + nameVal + "   Phone: " + addVal + "    Message: " + msgVal
              }).then(
                message => alert(message)
              );
            };
            </script>
        </body>
      </html>
      `,
      function(err){
			if (err) throw err;
		});
		console.log(path + " created!");
	}
}

function realEstate(fnames, dir, company, url, email, phone, newurl, content, headers, color, name, externals, bio){
	let j=0;
	let k = 0;
	let links = ``;
  let services = ``;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  if (!fs.existsSync(dir + 'static/')){
    fs.mkdirSync(dir + 'static/');
  }
	for (k in fnames){
		let revkt = fnames[k].split('-').join(' ');
		revkt = revkt.replace('.html','');
		let text = revkt.toLowerCase()
			.split(' ')
			.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
			.join(' ');
		let link = `<a class="dropdown-item" href="/` + fnames[k] + `">` + text + `</a>`;
    let serviceList = text.split(' ');
    serviceList.pop();
    let serviceText = '';
    for (d in serviceList){
      serviceText = serviceText + " " + serviceList[d];
    }
    let serviceItem = `<li>` + serviceText + `</li>`;
    services = services + "\n" + serviceItem;
		links = links + "\n" + link;
	}
  let indexfile = dir + 'index.html';
  let cssfile = dir + 'index.css';
  let fontcolor = '#000000';
  if (color === '#333333'){
    fontcolor = '#eeeeee';
  }
  let exLinks = [];
  for (y in externals){
    exLinks.push(`<a class="dropdown-item" href="` + externals[y] + `" target="_blank" rel="noreferrer noopener">Link Text Goes Here</a>`)
  }
  let niceLinks = ``;
  for (d in exLinks){
    niceLinks = niceLinks + exLinks[d] + '\n';
  }
  let cleanBio = "<p>" + bio.replace(/(\r\n|\n|\r)/gm, "</p>\n<p>") + "</p>";
  console.log(cleanBio);
  console.log(niceLinks);
	fs.appendFile(
		indexfile,
		`
    <!doctype html>
    <html lang="en">
      <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <link rel="stylesheet" type="text/css" href="/static/index.css">
        <link href="https://fonts.googleapis.com/css?family=Baskervville|Domine&display=swap" rel="stylesheet">
        <title>` + company + ` | ` + name + `</title>
      </head>
      <body>
        <div id="slider" class="carousel slide" data-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img class="d-block w-100" src="/static/slide1.jpg" alt="" />
            </div>
            <div class="carousel-item">
              <img class="d-block w-100" src="/static/slide2.jpg" alt="" />
            </div>
            <div class="carousel-item">
              <img class="d-block w-100" src="/static/slide3.jpg" alt="" />
            </div>
          </div>
        </div>
        <nav class="navbar navbar-expand-lg navbar-primary bg-dark">
          <a class="navbar-brand" href="/"><img src="/static/logo.png" alt="RE Logo" /></a>
          <button class="navbar-toggler" type="button btn-primary" data-toggle="collapse" data-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle Navigation">
            <span class="navbar-toggler-icon"><img src="/static/nav.png" alt="Nav Icon" /></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarContent">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="postsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Blog Posts
                </a>
                <div class="dropdown-menu" aria-labelledby="postsDropdown">
                  ` + links + `
                </div>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="externalsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Links
                </a>
                <div class="dropdown-menu" aria-labelledby="externalsDropdown">
                  ` + niceLinks + `
                </div>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="tel:` + phone + `">Call for More Info</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="mailto:` + email + `">Email Me!</a>
              <div class="socials">
                <li class="nav-item">
                  <a class="nav-link" href="https://facebook.com"><img src="/static/fb.png" alt="FB Logo" /></a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="https://twitter.com"><img src="/static/twit.png" alt="Twitter Logo" /></a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="https://instagram.com"><img src="/static/insta.png" alt="Instagram Logo" /></a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="https://youtube.com"><img src="/static/yt.png" alt="YT Logo" /></a>
                </li>
              </div>
            </ul>
          </div>
        </nav>
        <div class="container" id="maintext">
          <div class="row">
            <div class="col-12">
              <h1>` + name + `</h1>
              <h4>` + company + `</h4>
              ` + bio + `
              <ul>
                <li><strong>Services We Provide:</strong></li>
                 ` + services + `
              </ul>
              <p>
              <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#capform" aria-expanded="false" aria-controls="capform">
                Find Out More!
              </button>
              </p>
              <div class="collapse" id="capform">
                <div class="card card-body">
                  <form>
                    <div class="form-group">
                      <label for="name">Your Name:</label>
                      <input type="text" class="form-control" id="name" placeholder="Enter Your Name">
                    </div>
                    <div class="form-group">
                      <label for="email">Email Address:</label>
                      <input type="email" class="form-control" id="email" placeholder="Enter Your Email">
                    </div>
                    <div class="form-group">
                      <label for="phone">Phone Number:</label>
                      <input type="text" class="form-control" id="phone" placeholder="Enter Your Phone Number">
                    </div>
                    <div class="form-group">
                      <label for="message">Message:</label>
                      <input type="textarea" class="form-control" id="message" placeholder="Put your question/comment here.">
                    </div>
                    <button type="submit" class="btn btn-success" onClick="sendData()">Submit</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer>
          <h6>Powered by <a href="https://the1stpagegroup.com" target="_blank" rel="noreferrer noopener">The 1st Page Group</a></h6>
        </footer>

        <!-- Optional JavaScript -->
        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
        <script src="https://smtpjs.com/v3/smtp.js"></script>
        <script>
          function sendData(){
            let nameVal = document.getElementById("name").value;
            let mailVal = document.getElementById("email").value;
            let addVal = document.getElementById("phone").value;
            let msgVal = document.getElementById("message").value;
            Email.send({
              Host: "smtp.gmail.com",
              Username: "1stpgemail@gmail.com",
              Password: "Yeswewill@1",
              To: "yeswewill111@gmail.com, ` + email + `",
              From: mailVal,
              Subject: "Info Request from ` + newurl + `",
              Body: "Name: " + nameVal + "   Phone: " + addVal + "    Message: " + msgVal
            }).then(
              message => alert(message)
            );
          };
          </script>
      </body>
    </html>
		`,
		function(err){
			if (err) throw err;
			console.log(dir + "index.html created!");
		}
	);
	fs.appendFile(cssfile,
    `
    h1, h2, h3 {
        font-family:'Baskervvile', serif;
    }

    h4, h5, h6, p, a, li, label, input, button {
        font-family:'Domine', serif;
    }

    #slider {
        max-height:600px;
    }

    #slider img {
        height:600px;
    }

    .navbar {
        height:60px;
    }

    .navbar img {
        max-height:40px;
    }

    .socials {
        position:relative;
        margin-left:1200px;
    }

    .socials li {
        display:inline-block;
    }

    .nav-item .nav-link {
        margin-top:8px;
    }

    .navbar-toggler-icon img {
        max-height:30px;
    }

    #maintext {
        margin-top:25px;
    }

    footer {
        height:50px;
        background:#dddddd;
        text-align:center;
    }

    footer h6 {
        padding-top:15px;
    }
    `,
    function(err){
			if (err) throw err;
			console.log(dir + "index.css created!");
		}
	);

	for (j in fnames){
		let path = dir + fnames[j];
    let cleanContent = "<p>" + content[j].replace(/(\r\n|\n|\r)/gm, "</p>\n<p>") + "</p>";
    console.log(cleanContent);
		fs.appendFile(path,
      `
      <!doctype html>
      <html lang="en">
        <head>
          <!-- Required meta tags -->
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

          <!-- Bootstrap CSS -->
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
          <link rel="stylesheet" type="text/css" href="/static/index.css">
          <link href="https://fonts.googleapis.com/css?family=Baskervville|Domine&display=swap" rel="stylesheet">
          <title>` + name + ` | ` + headers[j] + `</title>
        </head>
        <body>
          <nav class="navbar navbar-expand-lg navbar-primary bg-dark">
            <a class="navbar-brand" href="/"><img src="/static/logo.png" alt="RE Logo" /></a>
            <button class="navbar-toggler" type="button btn-primary" data-toggle="collapse" data-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle Navigation">
              <span class="navbar-toggler-icon"><img src="/static/nav.png" alt="Nav Icon" /></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarContent">
              <ul class="navbar-nav mr-auto">
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="postsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Blog Posts
                  </a>
                  <div class="dropdown-menu" aria-labelledby="postsDropdown">
                    ` + links + `
                  </div>
                </li>
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="externalsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    External Links
                  </a>
                  <div class="dropdown-menu" aria-labelledby="externalsDropdown">
                    ` + exLinks + `
                  </div>
                </li>
                <div class="socials">
                  <li class="nav-item">
                    <a class="nav-link" href="https://facebook.com"><img src="/static/fb.png" alt="FB Logo" /></a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="https://twitter.com"><img src="/static/twit.png" alt="Twitter Logo" /></a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="https://instagram.com"><img src="/static/insta.png" alt="Instagram Logo" /></a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="https://youtube.com"><img src="/static/yt.png" alt="YT Logo" /></a>
                  </li>
                </div>
              </ul>
            </div>
          </nav>
          <div class="container" id="maintext">
            <div class="row">
              <div class="col-8">
                <h1>` + headers[j] + `</h1>
                <h4><!-- Blurb Goes Here --></h4>
                ` + cleanContent + `
                <p>
                  <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#capform" aria-expanded="false" aria-controls="capform">
                    Find Out More!
                  </button>
                </p>
                <div class="collapse" id="capform">
                  <div class="card card-body">
                    <form>
                      <div class="form-group">
                        <label for="name">Your Name:</label>
                        <input type="text" class="form-control" id="name" placeholder="Enter Your Name">
                      </div>
                      <div class="form-group">
                        <label for="email">Email Address:</label>
                        <input type="email" class="form-control" id="email" placeholder="Enter Your Email">
                      </div>
                      <div class="form-group">
                        <label for="phone">Phone Number:</label>
                        <input type="text" class="form-control" id="phone" placeholder="Enter Your Phone Number">
                      </div>
                      <div class="form-group">
                        <label for="message">Message:</label>
                        <input type="textarea" class="form-control" id="message" placeholder="Put your question/comment here.">
                      </div>
                      <button type="submit" class="btn btn-success" onClick="sendData()">Submit</button>
                    </form>
                  </div>
                </div>
              </div>
              <div class="col-4">
                <div class="list-group" id="rellinks">
                  <a href="/related" target="_blank" rel="noreferrer noopener"><li class="list-group-item">Related Link 1</li></a>
                  <a href="/related" target="_blank" rel="noreferrer noopener"><li class="list-group-item">Related Link 2</li></a>
                  <a href="/related" target="_blank" rel="noreferrer noopener"><li class="list-group-item">Related Link 3</li></a>
                  <a href="/related" target="_blank" rel="noreferrer noopener"><li class="list-group-item">Related Link 4</li></a>
                </div>
              </div>
            </div>
          </div>
          <footer>
            <h6>Powered by <a href="https://the1stpagegroup.com" target="_blank" rel="noreferrer noopener">The 1st Page Group</a></h6>
          </footer>

          <!-- Optional JavaScript -->
          <!-- jQuery first, then Popper.js, then Bootstrap JS -->
          <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
          <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
          <script src="https://smtpjs.com/v3/smtp.js"></script>
          <script>
            function sendData(){
              let nameVal = document.getElementById("name").value;
              let mailVal = document.getElementById("email").value;
              let addVal = document.getElementById("phone").value;
              let msgVal = document.getElementById("message").value;
              Email.send({
                Host: "smtp.gmail.com",
                Username: "1stpgemail@gmail.com",
                Password: "Yeswewill@1",
                To: "yeswewill111@gmail.com, ` + email + `",
                From: mailVal,
                Subject: "Info Request from ` + newurl + `",
                Body: "Name: " + nameVal + "   Phone: " + addVal + "    Message: " + msgVal
              }).then(
                message => alert(message)
              );
            };
            </script>
        </body>
      </html>
      `,
      function(err){
			if (err) throw err;
		});
		console.log(path + " created!");
	}
}

app.post('/builder', (req, res) => {
  console.log(req.body);
  let name = req.body.fullname.toLowerCase().replace(/\s/g, "");
  let x = 0;
  let content = [];
  if (req.body.color === 'Blue'){
    let color = '#4a668f';
  } else if (req.body.color === 'Green'){
    let color = '#339933';
  } else if (req.body.color === 'Red'){
    let color = '#cc0000';
  } else if (req.body.color === 'Dark'){
    let color = '#333333';
  } else if (req.body.color === 'Purple'){
    let color = '#cc66ff';
  } else if (req.body.color === 'Light'){
    let color = '#999999';
  }
  for (x in req.body.cleanTerms){
    content.push(req.body[req.body.cleanTerms[x]]);
  }
  if (req.body.style === 'Sales') {
    newStyle(nameMaker(req.body.terms), 'D:/CodingStuff/Sites/yeswewill/customers/' + name + '/', req.body.company, req.body.site, req.body.emailaddress, req.body.phone, req.body.seoSite, content, req.body.terms, req.body.color, req.body.fullname, req.body.externals, req.body.bio)
  } else if (req.body.style === 'Real Estate') {
    realEstate(nameMaker(req.body.terms), 'D:/CodingStuff/Sites/yeswewill/customers/' + name + '/', req.body. company, req.body.site, req.body.emailaddress, req.body.phone, req.body.seoSite, content, req.body.terms, req.body.color, req.body.fullname, req.body.externals, req.body.bio)
  }
});
