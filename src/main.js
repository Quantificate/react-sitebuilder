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

function genericMLM(fnames, dir, company, url, email, phone, newurl, content, headers, color){
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
		let link = '				<li><a href="/' + fnames[k] + '">' + text + '</a></li>';
		links = links + "\n" + link;
	}
  let indexfile = dir + 'index.html';
  let cssfile = dir + 'index.css';
	fs.appendFile(
		indexfile,
		`<!DOCTYPE html>
		<html>
		  <head>
			<title>` + company + `</title>
      <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet">
			<link href="index.css" rel="stylesheet" type="text/css">
		  </head>
		  <body>
      <header>
        <div id="hat">
          <div id="lefthat">
            <ul>
              <li id="notdrop"><a href="tel:` + phone + `">` + phone + `</a></li>
              <li id="notdrop"><a href="mailto:` + email + `">` + email + `</a></li>
            </ul>
          </div>
          <div id="righthat">
            <ul>
              <li id="drop"><a href="https://www.facebook.com/">Facebook</a></li>
              <li id="drop"><a href="https://www.twitter.com">Twitter</a></li>
              <li id="drop"><a href="https://www.instagram.com/">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div id="collar">
          <h1>` + company + `</h1>
        </div>
        <div id="necklace">
          <ul>
            <li><a href="/" id="navlink">Home</a></li>
            <li>
              <div id="oppsdrop">
                <span>Business Opportunities</span>
                <div id="oppdropdown">
                  <ul>
                    <li><a href="` + url + `">Opportunity</a></li>
                  </ul>
                </div>
              </div>
            </li>
            <li>
              <div id="condrop">
                <span>Contact</span>
                <div id="condropdown">
                  <ul>
                    <li><a href="tel:` + phone + `">` + phone + `</a></li>
                    <li><a href="mailto:` + email + `">Email Me</a></li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </header>
      <div class="slideshow-container">

        <!-- Full-width images with number and caption text -->
        <div class="mySlides fade">
          <img src="/static/slide1.jpg" style="width:100%">
        </div>

        <div class="mySlides fade">
          <img src="/static/slide2.jpg" style="width:100%">
        </div>

        <div class="mySlides fade">
          <img src="/static/slide3.jpg" style="width:100%">
        </div>
      </div>
      <br>
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
	fs.appendFile(cssfile,
    `

    * {box-sizing:border-box;}

    html, body {
      margin:0;
      background:#eeeeee;
    }

    h1, h2, h3, h4, h5, h6, p, li, a {
      font-family: 'Open Sans', sans-serif;
    }

    ul {
      list-style:none;
    }

    i {
      width:inherit;
      height:inherit;
    }

    a {
      text-decoration:none;
      color:#000000;
    }

    a:hover {
      color:` + color + `;
    }

    #hat {
      width:70%;
      margin:auto;
    }

    #lefthat {
      float:left;
      width:60%;
    }

    #lefthat li {
      display:inline;
      float:left;
      margin-right:10px;
    }

    #lefthat li a {
      font-size:16px;
    }

    #drop {
      text-decoration:none;
      background:url('/static/drop.png');
      background-size:cover;
      background-position:center;
      width:40px;
      height:60px;
      text-align:center;
    }

    #lefthat #drop a i {
      font-size:16px;
      color:#ffffff;
      margin:26px 2px 0px 0px;
    }

    #righthat #drop a i {
      font-size:16px;
      color:#ffffff;
      margin:26px 0px 0px 1px;
    }

    #drop a i:hover {
      color:skyblue !important;
    }

    #righthat {
      float:right;
      width:30%;
    }

    #righthat li {
      display:inline;
      float:right;
      width:auto;
      margin-left:15px;
    }

    #collar {
      clear:both;
      text-align:center;
      background:` + color + `;
      color:#eeeeee;
      height:50px;
    }

    #necklace {
      text-align:center;
      background:` + color + `;
      margin-top:-16px;
      height:30px;
    }

    #necklace li {
      display:inline;
      margin:10px 30px 10px 0px;
    }

    #necklace li a {
      color:#eeeeee;
      font-weight:bold;
    }

    #necklace li a:hover {
      color:skyblue;
      font-weight:bold;
    }

    #contentarea {
      width:80%;
      height:auto;
      background:#eeeeee;
      margin:auto;
      padding-top:10px;
    }

    #contentarea2 {
      width:80%;
      height:auto;
      background:#eeeeee;
      margin:auto;
      margin-top:10px;
      padding-top:10px;
    }

    #contentbox {
      width:80%;
      float:left;
    }

    #contentbox2 {
      width:70%;
      margin:0px 0px 0px 25px;;
      float:left;
    }

    #contentbox2 li {
      list-style:disc;
    }

    #buttonbox {
      width:100%;
      height: 100px;
      margin-top:15px;
    }

    #button {
      width:140%;
      height:75px;
      margin:auto;
      text-align:center;
      background:` + color + `;
      border:#000000 1px solid;
      border-radius:10px;
      color:#ffffff;
      text-shadow:#000000 1px 1px 3px;
      box-shadow:#000000 2px 2px 5px;
    }

    #button:hover {
      background:#eeeeee;
      color:` + color + `;
    }

    #infobox {
      float:right;
      max-width:125px;
    }

    #logo {
      max-width:150px;
      margin:auto;
    }

    #logo img {
      width:175px;
      margin:auto;
      border:#000000 1px solid;
      border-radius:5px;
    }

    #infoform button {
      margin-top:10px;
      font-family:'Open Sans', sans-serif;
    }

    #linkbox {
      width:60%;
      margin: 75px auto;
      text-align:center;
      clear:both;
    }

    #linkbox2 {
      width:60%;
      margin:75px auto;
      text-align:center;
      clear:both;
    }

    #relinks {
      width:60%;
      margin:auto;
      text-align:center;
      clear:both;
    }

    #relinks ul {
      height:12px;
      width:100%;
      margin:0;
    }

    #relinks li {
      display:inline;
      padding:0 5px 0 5px;
      text-align:center;

    }

    #relinks2 {
      width:60%;
      margin:auto;
      text-align:center;
      clear:both;
    }

    #relinks2 ul {
      height:12px;
      width:100%;
      margin:0;
    }

    #relinks2 li {
      display:inline;
      padding:0 5px 0 5px;
      text-align:center;
      border: none !important;
    }

    #relinks2 li a {
      font-size:16px !important;
    }

    #linkbox ul:first-child {
      border:none;
    }

    #linkbox ul {
      height:12px;
      width:100%;
      margin:0;
    }

    #linkbox li {
      display:inline;
      border-left:#000000 1px solid;
      padding:0 5px 0 5px;
      text-align:center;
      height:15px !important;
    }

    #linkbox li a {
      font-size:10px;
    }

    #linkbox2 ul:first-child {
      border:none;
    }

    #linkbox2 ul {
      height:12px;
      width:100%;
      margin:75px 0px;
    }

    #linkbox2 li {
      display:inline;
      border-left:#000000 1px solid;
      padding:0 5px 0 5px;
      text-align:center;
      height:15px !important;
    }

    #linkbox2 li a {
      font-size:10px;
    }

    #link1 {
      border:none !important;
    }

    /* Dropdowns */

    #necklace span {
      color:#eeeeee;
      font-weight:bold;
    }

    #necklace span:hover {
      color:skyblue;
      font-weight:bold;
    }

    #oppsdrop, #prodrop, #condrop {
      position:relative;
      display:inline-block;
    }

    #oppdropdown, #prodropdown, #condropdown {
      display:none;
      position:absolute;
      background-color:#f9f9f9;
      min-width: 250px;
      box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);
      padding: 12px 16px;
      z-index:1;
      border-radius:5px;
    }

    #oppdropdown ul, #prodropdown ul, #condropdown ul {
      padding-inline-start:0px;
    }

    #oppsdrop:hover #oppdropdown, #prodrop:hover #prodropdown, #condrop:hover #condropdown {
      display:block;
    }

    #condropdown li {
      display:block;
    }

    #condropdown li i {
      margin-right:10px;
    }

    #oppsdrop li, #prodrop li, #condrop li {
      margin:5px 0px;
      display:block;
      width: 100%;
      padding:0;
    }

    #oppsdrop li a, #prodrop li a, #condrop li a {
      color:#000000;
    }

    /* Slideshow container */
    .slideshow-container {
      width: 100%;
      height:600px;
      position: relative;
      margin: auto;
    }

    .mySlides img {
      max-height:600px;
    }

    /* Hide the images by default */
    .mySlides {
      display: none;
    }

    /* Next & previous buttons */
    .prev, .next {
      cursor: pointer;
      position: absolute;
      top: 50%;
      width: auto;
      margin-top: -22px;
      padding: 16px;
      color: white;
      font-weight: bold;
      font-size: 18px;
      transition: 0.6s ease;
      border-radius: 0 3px 3px 0;
      user-select: none;
    }

    /* Position the "next button" to the right */
    .next {
      right: 0;
      border-radius: 3px 0 0 3px;
    }

    /* On hover, add a black background color with a little bit see-through */
    .prev:hover, .next:hover {
      background-color: rgba(0,0,0,0.8);
    }

    /* Caption text */
    .text {
      color: #f2f2f2;
      font-size: 15px;
      padding: 8px 12px;
      position: absolute;
      bottom: 8px;
      width: 100%;
      text-align: center;
    }

    /* Number text (1/3 etc) */
    .numbertext {
      color: #f2f2f2;
      font-size: 12px;
      padding: 8px 12px;
      position: absolute;
      top: 0;
    }

    /* The dots/bullets/indicators */
    .dot {
      cursor: pointer;
      height: 15px;
      width: 15px;
      margin: 0 2px;
      background-color: #bbb;
      border-radius: 50%;
      display: inline-block;
      transition: background-color 0.6s ease;
    }

    .active, .dot:hover {
      background-color: #717171;
    }

    /* Fading animation */
    .fade {
      -webkit-animation-name: fade;
      -webkit-animation-duration: 1.5s;
      animation-name: fade;
      animation-duration: 1.5s;
    }

    @-webkit-keyframes fade {
      from {opacity: .4}
      to {opacity: 1}
    }

    @keyframes fade {
      from {opacity: .4}
      to {opacity: 1}
    }

    @media screen and (max-width:1400px){
      #linkbox {
        margin-bottom:100px !important;
      }

      #relinks h6 {
        margin-top:50px;
      }
    }

    @media only screen and (max-width:990px){
      .slideshow-container {
        display:none;
      }

      .dot {display:none;}

      #lefthat {
        display:none;
      }

      #righthat {
        width:100%;
      }

      #righthat #drop a i {
        font-size:28px;
        margin-top:30px;
      }

      #drop {
        width:60px;
        height:80px;
      }

      #collar {height:75px;}
      #collar h1 {font-size:48px;}
      #necklace {height:50px;}
      #necklace a {font-size:32px;}
      #necklace span {font-size:32px;}
      #button {width:100%;}
      #relinks {margin-top:110px;}
      #linkbox {margin-top:150px;}
      #relinks h6 {margin-top:50px;}
    }
    `,
    function(err){
			if (err) throw err;
			console.log(dir + "index.css created!");
		}
	);

	for (j in fnames){
		let path = dir + fnames[j];
		fs.appendFile(path,
      `
      <!DOCTYPE html>
  		<html>
  		  <head>
  			<title>` + company + `</title>
  			<link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet">
  			<link href="index.css" rel="stylesheet" type="text/css">
  		  </head>
  		  <body>
        <header>
          <div id="hat">
            <div id="lefthat">
              <ul>
                <li id="notdrop"><a href="tel:` + phone + `">` + phone + `</a></li>
                <li id="notdrop"><a href="mailto:` + email + `">` + email + `</a></li>
              </ul>
            </div>
            <div id="righthat">
              <ul>
                <li id="drop"><a href="https://www.facebook.com/">Facebook</a></li>
                <li id="drop"><a href="https://www.twitter.com">Twitter</a></li>
                <li id="drop"><a href="https://www.instagram.com/">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div id="collar">
            <h1>` + company + `</h1>
          </div>
          <div id="necklace">
            <ul>
              <li><a href="/" id="navlink">Home</a></li>
              <li>
                <div id="oppsdrop">
                  <span>Business Opportunities</span>
                  <div id="oppdropdown">
                    <ul>
                      <li><a href="` + url + `">Opportunity</a></li>
                    </ul>
                  </div>
                </div>
              </li>
              <li>
                <div id="condrop">
                  <span>Contact</span>
                  <div id="condropdown">
                    <ul>
                      <li><a href="tel:` + phone + `">` + phone + `</a></li>
                      <li><a href="mailto:` + email + `">Email Me</a></li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </header>
  			<div id="contentarea">
          <div id="contentarea">
            <h1>` + headers[j] + `</h1>
            <p>` + content[j] + `</p>
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
  		</html>
      `,
      function(err){
			if (err) throw err;
		});
		console.log(path + " created!");
	}
}

function kangen(fnames, dir, company, url, email, phone, newurl, content, headers, color){
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
		let link = '				<li><a href="/' + fnames[k] + '">' + text + '</a></li>';
		links = links + "\n" + link;
	}
  let indexfile = dir + 'index.html';
  let cssfile = dir + 'index.css';
	fs.appendFile(
		indexfile,
		`<!DOCTYPE html>
		<html>
		  <head>
			<title>` + company + `</title>
      <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet">
			<link href="index.css" rel="stylesheet" type="text/css">
		  </head>
		  <body>
      <header>
        <div id="hat">
          <div id="lefthat">
            <ul>
              <li id="notdrop"><a href="tel:` + phone + `">` + phone + `</a></li>
              <li id="notdrop"><a href="mailto:` + email + `">` + email + `</a></li>
            </ul>
          </div>
          <div id="righthat">
            <ul>
              <li id="drop"><a href="https://www.facebook.com/">Facebook</a></li>
              <li id="drop"><a href="https://www.twitter.com">Twitter</a></li>
              <li id="drop"><a href="https://www.instagram.com/">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div id="collar">
          <h1>` + company + `</h1>
        </div>
        <div id="necklace">
          <ul>
            <li><a href="/" id="navlink">Home</a></li>
            <li>
              <div id="oppsdrop">
                <span>Business Opportunities</span>
                <div id="oppdropdown">
                  <ul>
                    <li><a href="` + url + `">Opportunity</a></li>
                  </ul>
                </div>
              </div>
            </li>
            <li>
              <div id="condrop">
                <span>Contact</span>
                <div id="condropdown">
                  <ul>
                    <li><a href="tel:` + phone + `">` + phone + `</a></li>
                    <li><a href="mailto:` + email + `">Email Me</a></li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </header>
      <div class="slideshow-container">

        <!-- Full-width images with number and caption text -->
        <div class="mySlides fade">
          <img src="/static/slide1.jpg" style="width:100%">
        </div>

        <div class="mySlides fade">
          <img src="/static/slide2.jpg" style="width:100%">
        </div>

        <div class="mySlides fade">
          <img src="/static/slide3.jpg" style="width:100%">
        </div>
      </div>
      <br>
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
	fs.appendFile(cssfile,
    `

    * {box-sizing:border-box;}

    html, body {
      margin:0;
      background:#eeeeee;
    }

    h1, h2, h3, h4, h5, h6, p, li, a {
      font-family: 'Open Sans', sans-serif;
    }

    ul {
      list-style:none;
    }

    i {
      width:inherit;
      height:inherit;
    }

    a {
      text-decoration:none;
      color:#000000;
    }

    a:hover {
      color:` + color + `;
    }

    #hat {
      width:70%;
      margin:auto;
    }

    #lefthat {
      float:left;
      width:60%;
    }

    #lefthat li {
      display:inline;
      float:left;
      margin-right:10px;
    }

    #lefthat li a {
      font-size:16px;
    }

    #drop {
      text-decoration:none;
      background:url('/static/drop.png');
      background-size:cover;
      background-position:center;
      width:40px;
      height:60px;
      text-align:center;
    }

    #lefthat #drop a i {
      font-size:16px;
      color:#ffffff;
      margin:26px 2px 0px 0px;
    }

    #righthat #drop a i {
      font-size:16px;
      color:#ffffff;
      margin:26px 0px 0px 1px;
    }

    #drop a i:hover {
      color:skyblue !important;
    }

    #righthat {
      float:right;
      width:30%;
    }

    #righthat li {
      display:inline;
      float:right;
      width:auto;
      margin-left:15px;
    }

    #collar {
      clear:both;
      text-align:center;
      background:` + color + `;
      color:#eeeeee;
      height:50px;
    }

    #necklace {
      text-align:center;
      background:` + color + `;
      margin-top:-16px;
      height:30px;
    }

    #necklace li {
      display:inline;
      margin:10px 30px 10px 0px;
    }

    #necklace li a {
      color:#eeeeee;
      font-weight:bold;
    }

    #necklace li a:hover {
      color:skyblue;
      font-weight:bold;
    }

    #contentarea {
      width:80%;
      height:auto;
      background:#eeeeee;
      margin:auto;
      padding-top:10px;
    }

    #contentarea2 {
      width:80%;
      height:auto;
      background:#eeeeee;
      margin:auto;
      margin-top:10px;
      padding-top:10px;
    }

    #contentbox {
      width:80%;
      float:left;
    }

    #contentbox2 {
      width:70%;
      margin:0px 0px 0px 25px;;
      float:left;
    }

    #contentbox2 li {
      list-style:disc;
    }

    #buttonbox {
      width:100%;
      height: 100px;
      margin-top:15px;
    }

    #button {
      width:140%;
      height:75px;
      margin:auto;
      text-align:center;
      background:` + color + `;
      border:#000000 1px solid;
      border-radius:10px;
      color:#ffffff;
      text-shadow:#000000 1px 1px 3px;
      box-shadow:#000000 2px 2px 5px;
    }

    #button:hover {
      background:#eeeeee;
      color:` + color + `;
    }

    #infobox {
      float:right;
      max-width:125px;
    }

    #logo {
      max-width:150px;
      margin:auto;
    }

    #logo img {
      width:175px;
      margin:auto;
      border:#000000 1px solid;
      border-radius:5px;
    }

    #infoform button {
      margin-top:10px;
      font-family:'Open Sans', sans-serif;
    }

    #linkbox {
      width:60%;
      margin: 75px auto;
      text-align:center;
      clear:both;
    }

    #linkbox2 {
      width:60%;
      margin:75px auto;
      text-align:center;
      clear:both;
    }

    #relinks {
      width:60%;
      margin:auto;
      text-align:center;
      clear:both;
    }

    #relinks ul {
      height:12px;
      width:100%;
      margin:0;
    }

    #relinks li {
      display:inline;
      padding:0 5px 0 5px;
      text-align:center;

    }

    #relinks2 {
      width:60%;
      margin:auto;
      text-align:center;
      clear:both;
    }

    #relinks2 ul {
      height:12px;
      width:100%;
      margin:0;
    }

    #relinks2 li {
      display:inline;
      padding:0 5px 0 5px;
      text-align:center;
      border: none !important;
    }

    #relinks2 li a {
      font-size:16px !important;
    }

    #linkbox ul:first-child {
      border:none;
    }

    #linkbox ul {
      height:12px;
      width:100%;
      margin:0;
    }

    #linkbox li {
      display:inline;
      border-left:#000000 1px solid;
      padding:0 5px 0 5px;
      text-align:center;
      height:15px !important;
    }

    #linkbox li a {
      font-size:10px;
    }

    #linkbox2 ul:first-child {
      border:none;
    }

    #linkbox2 ul {
      height:12px;
      width:100%;
      margin:75px 0px;
    }

    #linkbox2 li {
      display:inline;
      border-left:#000000 1px solid;
      padding:0 5px 0 5px;
      text-align:center;
      height:15px !important;
    }

    #linkbox2 li a {
      font-size:10px;
    }

    #link1 {
      border:none !important;
    }

    /* Dropdowns */

    #necklace span {
      color:#eeeeee;
      font-weight:bold;
    }

    #necklace span:hover {
      color:skyblue;
      font-weight:bold;
    }

    #oppsdrop, #prodrop, #condrop {
      position:relative;
      display:inline-block;
    }

    #oppdropdown, #prodropdown, #condropdown {
      display:none;
      position:absolute;
      background-color:#f9f9f9;
      min-width: 250px;
      box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);
      padding: 12px 16px;
      z-index:1;
      border-radius:5px;
    }

    #oppdropdown ul, #prodropdown ul, #condropdown ul {
      padding-inline-start:0px;
    }

    #oppsdrop:hover #oppdropdown, #prodrop:hover #prodropdown, #condrop:hover #condropdown {
      display:block;
    }

    #condropdown li {
      display:block;
    }

    #condropdown li i {
      margin-right:10px;
    }

    #oppsdrop li, #prodrop li, #condrop li {
      margin:5px 0px;
      display:block;
      width: 100%;
      padding:0;
    }

    #oppsdrop li a, #prodrop li a, #condrop li a {
      color:#000000;
    }

    /* Slideshow container */
    .slideshow-container {
      width: 100%;
      height:600px;
      position: relative;
      margin: auto;
    }

    .mySlides img {
      max-height:600px;
    }

    /* Hide the images by default */
    .mySlides {
      display: none;
    }

    /* Next & previous buttons */
    .prev, .next {
      cursor: pointer;
      position: absolute;
      top: 50%;
      width: auto;
      margin-top: -22px;
      padding: 16px;
      color: white;
      font-weight: bold;
      font-size: 18px;
      transition: 0.6s ease;
      border-radius: 0 3px 3px 0;
      user-select: none;
    }

    /* Position the "next button" to the right */
    .next {
      right: 0;
      border-radius: 3px 0 0 3px;
    }

    /* On hover, add a black background color with a little bit see-through */
    .prev:hover, .next:hover {
      background-color: rgba(0,0,0,0.8);
    }

    /* Caption text */
    .text {
      color: #f2f2f2;
      font-size: 15px;
      padding: 8px 12px;
      position: absolute;
      bottom: 8px;
      width: 100%;
      text-align: center;
    }

    /* Number text (1/3 etc) */
    .numbertext {
      color: #f2f2f2;
      font-size: 12px;
      padding: 8px 12px;
      position: absolute;
      top: 0;
    }

    /* The dots/bullets/indicators */
    .dot {
      cursor: pointer;
      height: 15px;
      width: 15px;
      margin: 0 2px;
      background-color: #bbb;
      border-radius: 50%;
      display: inline-block;
      transition: background-color 0.6s ease;
    }

    .active, .dot:hover {
      background-color: #717171;
    }

    /* Fading animation */
    .fade {
      -webkit-animation-name: fade;
      -webkit-animation-duration: 1.5s;
      animation-name: fade;
      animation-duration: 1.5s;
    }

    @-webkit-keyframes fade {
      from {opacity: .4}
      to {opacity: 1}
    }

    @keyframes fade {
      from {opacity: .4}
      to {opacity: 1}
    }

    @media screen and (max-width:1400px){
      #linkbox {
        margin-bottom:100px !important;
      }

      #relinks h6 {
        margin-top:50px;
      }
    }

    @media only screen and (max-width:990px){
      .slideshow-container {
        display:none;
      }

      .dot {display:none;}

      #lefthat {
        display:none;
      }

      #righthat {
        width:100%;
      }

      #righthat #drop a i {
        font-size:28px;
        margin-top:30px;
      }

      #drop {
        width:60px;
        height:80px;
      }

      #collar {height:75px;}
      #collar h1 {font-size:48px;}
      #necklace {height:50px;}
      #necklace a {font-size:32px;}
      #necklace span {font-size:32px;}
      #button {width:100%;}
      #relinks {margin-top:110px;}
      #linkbox {margin-top:150px;}
      #relinks h6 {margin-top:50px;}
    }
    `,
    function(err){
			if (err) throw err;
			console.log(dir + "index.css created!");
		}
	);

	for (j in fnames){
		let path = dir + fnames[j];
		fs.appendFile(path,
      `
      <!DOCTYPE html>
  		<html>
  		  <head>
  			<title>` + company + ` | ` + headers[j] + `</title>
  			<link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet">
  			<link href="index.css" rel="stylesheet" type="text/css">
  		  </head>
  		  <body>
        <header>
          <div id="hat">
            <div id="lefthat">
              <ul>
                <li id="notdrop"><a href="tel:` + phone + `">` + phone + `</a></li>
                <li id="notdrop"><a href="mailto:` + email + `">` + email + `</a></li>
              </ul>
            </div>
            <div id="righthat">
              <ul>
                <li id="drop"><a href="https://www.facebook.com/">Facebook</a></li>
                <li id="drop"><a href="https://www.twitter.com">Twitter</a></li>
                <li id="drop"><a href="https://www.instagram.com/">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div id="collar">
            <h1>` + company + `</h1>
          </div>
          <div id="necklace">
            <ul>
              <li><a href="/" id="navlink">Home</a></li>
              <li>
                <div id="oppsdrop">
                  <span>Business Opportunities</span>
                  <div id="oppdropdown">
                    <ul>
                      <li><a href="` + url + `">Opportunity</a></li>
                    </ul>
                  </div>
                </div>
              </li>
              <li>
                <div id="condrop">
                  <span>Contact</span>
                  <div id="condropdown">
                    <ul>
                      <li><a href="tel:` + phone + `">` + phone + `</a></li>
                      <li><a href="mailto:` + email + `">Email Me</a></li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </header>
  			<div id="contentarea">
          <div id="contentarea">
            <h1>` + headers[j] + `</h1>
            <p>` + content[j] + `</p>
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
  		</html>
      `,
      function(err){
			if (err) throw err;
		});
		console.log(path + " created!");
	}
}

function minRE(fnames, dir, company, url, email, phone, newurl, content, headers, color, name){
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
		let link = '				<li><a href="/' + fnames[k] + '">' + text + '</a></li>';
		links = links + "\n" + link;
	}
  let indexfile = dir + 'index.html';
  let cssfile = dir + 'index.css';
  let fontcolor = '#000000';
  if (color === '#333333'){
    fontcolor = '#eeeeee';
  }
	fs.appendFile(
		indexfile,
		`
    <!DOCTYPE html>
    <html>
      <head>
        <title>` + company + ` | ` + name + `</title>
        <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet">
        <link href="index.css" rel="stylesheet" type="text/css">
      </head>
      <body>
        <header>
          <a href="/" id="logo"><img src="/static/logo.png" alt="` + company + ` Logo" /></a>
          <img src="/static/customer.jpg" alt="` + name + `" />
          <div id="menubar">
            <div id="contacts">
              <ul>
                <li>` + name + `:<a href="tel:` + phone + `">` + phone + `</a></li>
                <li class="socialicon"><a href="https://twitter.com/"><div>Twitter</div></a></li>
                <li class="socialicon"><a href="https://www.facebook.com/"><div >Facebook</div></a></li>
                <li class="socialicon"><a href="https://www.instagram.com"><div>Instagram</div></a></li>
                <li class="socialicon"><a href="https://www.linkedin.com/"><div>LinkedIn</div></a></li>
                <li class="socialicon"><a href="https://www.pinterest.com"><div>Pinterest</div></a></li>
                <li class="socialicon"><a href="https://www.youtube.com"><div >YouTube</div></a></li>
              </ul>
            </div>
            <div id="menu">
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/">Buyers</a></li>
                <li><a href="/">Sellers</a></li>
                <li><a href="/">Communities</a></li>
                <li><a href="/">School Zones</a></li>
                <li><a href="/">RSS News Feed</a></li>
              </ul>
            </div>
          </div>
        </header>
        <div id="jumbo">
          <div id="searchbox">
            <div id="toprow">
              <div id="hone">
                <h1>Get Your Free Home Valuation!</h1>
              </div>
            </div>
            <div id="midrow">
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
                  <label for="address">Address:</label>
                  <input type="text" id="address" name="address">
                </div>
                <div>
                  <label for="message">Message:</label>
                  <input type="textbox" id="message" name="message">
                </div>
                <div class="button">
                  <button type="submit">Get Your Free Valuation</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div id="contentarea">
          <div id="contentbox">
            <h1 id="contenttitle">` + name + `</h1>
            <p>Bio Here</p>
          </div>
          <div id="linkbox">
            <ul>
              ` + links + `
            </ul>
          </div>
          <div id="relinks">
            <ul>
              <li><a href="https://www.zillow.com/">Zillow</a></li>
              <li><a href="https://www.realtor.com/realestateagents/">Realtor.com</a></li>
              <li><a href="/">School Zones</a></li>
              <li><a href="/">Communities</a></li>
            </ul>
            <h6>Powered by <a href="http://the1stpagegroup.com">The First Page Group</h6>
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
              Subject: "Home Valuation Request from ` + url + `",
              Body: "Name: " + nameVal + "   Address: " + addVal + "    Message: " + msgVal
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
      margin: 0;
      padding: 0;
      background:#eeeeee;
    }

    h1, h2, h3, h4, h5, h6, ul, li, ol, p, a, label {
      font-family: 'Open Sans', sans-serif;
    }

    ul {
      list-style:none;
    }

    a {
      text-decoration:none;
      color:#000000;
    }

    a:hover {
      text-decoration:none;
      color:#333333;
    }

    header {
      width:100%;
      height:80px;
      background-color:` + color + `;
      box-shadow: #333333 1px 1px 5px;
    }

    header > img {
      max-height: 60px;
      margin:10px 0px;
    }

    .contenthead {
      width:100%;
      height:80px;
      background-color:` + color + `;
      box-shadow: #333333 1px 1px 5px;
    }

    #logo {
      height:60px;
      margin:10px 15px;
      float:left;
    }

    #logo img {
      height:60px;
    }

    #menubar {
      width:70%;
      height:75px;
      float:right;
    }

    #contacts {
      float:right;
      text-align:right;
      height:45%;
      width:60%;
      margin-right:25px;
    }

    #contacts ul li {
      display:inline-block;
      margin-right:10px;
    }

    #contacts ul li a {
      color:` + fontcolor + `;
    }

    .socialicon {
      border-radius:5px;
      border: ` + color + ` 1px solid;
      width: auto;
      height: auto;
      text-align:center;
      font-size:14px;
      padding:5px;
    }

    .socialicon:hover{
        background-color:#999999;
    }

    #menu {
      float:right;
      clear:right;
      height:45%;
    }

    #menu li {
      display:inline;
      margin-right:35px;
    }

    #menu li a {
      font-size:14px;
      text-transform:uppercase;
      color:` + fontcolor + `;
    }

    #jumbo {
      width:100%;
      height:800px;
      background-image:url('/static/house.jpg');
      background-size:cover;
      background-position:center;
    }

    #searchbox {
      width:50%;
      height:225px;
      padding:10px;
      position: absolute;
      top:450px;
      left:500px;
      background:rgba(0,0,0,0.4);
      border:#ffffff 1px solid;
      border-radius:5px;
    }

    #toprow {
      width:100%;
      height:30%;

    }

    #hone {
      width:100%;
      height:100%;
      text-align:center;
      color:` + color + `;
      font-weight:normal;
      font-size:22px;
      margin-top:-20px;
    }

    #hone h1 {
      text-shadow:#333333 1px 1px 3px;
    }

    #options {
      width:68%;
      height:70%;
      float:right;
      margin-top:15px;
      margin-right:-25px;
    }

    #options li {
      display:inline-block;
      width:23%;
      font-size:12px;
      text-align:center;
      margin:0;
    }

    .itembox {
      color:#ffffff;
      background:#274f74;
      padding:5px;
      margin:0px;
      border-left:#eeeeee 1px solid;
      width:100%;
    }

    .box1 {
      background:#aaaaaa;
      border-left:none;
    }

    #midrow {
      width:100%;
      height:60%;
      margin-top:5px;
    }

    #midrow form {
      text-align:center;
      width:30%;
      margin:auto;
    }

    #midrow form div {
      margin-top:5px;
    }

    #midrow form input {
      float:right;
    }

    #midrow form label {
      color:#ffffff;
      font-weight:bold;
      text-shadow:#000000 1px 1px 3px;
    }

    #midrow button {
      font-family: 'Open Sans', sans-serif;
      color:#eeeeee;
      background:` + color + `;
      border-radius:5px;
      border:#eeeeee 1px solid;
      padding:5px;
    }

    #dropbox {
      font-size:12px;
      color:` + color + `;
      background:#eeeeee;
      padding:10px 15px 10px 15px;
      width:175px;
      text-align:left;
      margin:10px 5px 0 5px;
      border-radius:2px;
    }

    #botright {
      width:35%;
      position:absolute;
      text-align:right;
      right:70px;
      bottom:75px;
      line-height:12px;
    }

    #botright p {
      color:#ffffff;
      text-shadow:#333333 1px 1px;
      font-size:28px;
    }

    #stats {
      font-size:20px !important;
    }

    #contentarea {
      width:100%;
      height:auto;
      background:#eeeeee;
      margin-top:-25px;
      padding-top:10px;
    }

    #contentarea2 {
      width:100%;
      height:auto;
      background:#eeeeee;
      margin-top:10px;
      padding-top:10px;
    }

    #contentbox {
      width:60%;
      margin:auto;
    }

    #contentbox2 {
      width:60%;
      margin:auto;
    }

    #contentbox2 li {
      list-style:disc;
    }

    #linkbox {
      width:60%;
      margin:75px auto;
      text-align:center;
    }

    #linkbox2 {
      width:60%;
      margin:75px auto;
      text-align:center;
    }

    #relinks {
      width:60%;
      margin:auto;
      text-align:center;
    }

    #relinks ul {
      height:12px;
      width:100%;
      margin:0;
    }

    #relinks li {
      display:inline;
      padding:0 5px 0 5px;
      text-align:center;

    }

    #relinks2 {
      width:60%;
      margin:auto;
      text-align:center;
    }

    #relinks2 ul {
      height:12px;
      width:100%;
      margin:0;
    }

    #relinks2 li {
      display:inline;
      padding:0 5px 0 5px;
      text-align:center;
      border: none !important;
    }

    #relinks2 li a {
      font-size:16px !important;
    }

    #linkbox ul:first-child {
      border:none;
    }

    #linkbox ul {
      height:12px;
      width:100%;
      margin:0;
    }

    #linkbox li {
      display:inline;
      border-left:#000000 1px solid;
      padding:0 5px 0 5px;
      text-align:center;
      height:15px !important;
    }

    #linkbox li a {
      font-size:10px;
    }

    #linkbox2 ul:first-child {
      border:none;
    }

    #linkbox2 ul {
      height:12px;
      width:100%;
      margin:75px 0px;
    }

    #linkbox2 li {
      display:inline;
      border-left:#000000 1px solid;
      padding:0 5px 0 5px;
      text-align:center;
      height:15px !important;
    }

    #linkbox2 li a {
      font-size:10px;
    }

    #link1 {
      border:none !important;
    }

    #formtitle {
      width:100%;
    }

    #formtitle #hone {
      text-align:center;
      color:#ffffff;
      text-shadow:none;
      margin:0;
    }

    #formed {
      width:100%;
      height:60%;
      margin-top:5px;
    }

    #formed form {
      text-align:center;
      width:30%;
      margin:auto;
      background:rgba(0,0,0,0.5);
      border:#000000 2px solid;
      padding:10px;
      border-radius:5px;
    }

    #formed form div {
      width:50%;
      margin:auto;
      line-height:25px;
    }

    #formed form input {
      float:right;
    }

    #formed form label {
      color:#ffffff;
      font-weight:bold;
    }

    #formed button {
      font-family: 'Open Sans', sans-serif;
      color:#ffffff;
      background:royalblue;
      border-radius:5px;
      border:#000000 1px solid;
      padding:10px;
      font-weight:bold;
    }

    #formbox {
      height:400px;
      margin-top:-28px;
      background:url('/static/house.jpg');
      background-size:cover;
      background-position:center;
    }

    /* mobile view fixes */
    @media only screen and (max-width:992px){
      #hone h1 {
        font-size:28px;
      }

      #contacts {
        width:60%;
      }

      #searchbox {
        height:auto;
      }

      #searchbox form input {
        float:none;
      }

      #linkbox {
        margin-bottom:110px;
      }
    }

    `,
    function(err){
			if (err) throw err;
			console.log(dir + "index.css created!");
		}
	);

	for (j in fnames){
		let path = dir + fnames[j];
		fs.appendFile(path,
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>` + company + ` | ` + name + `</title>
          <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet">
          <link href="index.css" rel="stylesheet" type="text/css">
        </head>
        <body>
          <header>
            <a href="/" id="logo"><img src="/static/logo.png" alt="` + company + ` Logo" /></a>
            <img src="/static/customer.jpg" alt="` + name + `" />
            <div id="menubar">
              <div id="contacts">
                <ul>
                  <li>` + name + `:<a href="tel:` + phone + `">` + phone + `</a></li>
                  <li class="socialicon"><a href="https://twitter.com/"><div>Twitter</div></a></li>
                  <li class="socialicon"><a href="https://www.facebook.com/"><div >Facebook</div></a></li>
                  <li class="socialicon"><a href="https://www.instagram.com"><div>Instagram</div></a></li>
                  <li class="socialicon"><a href="https://www.linkedin.com/"><div>LinkedIn</div></a></li>
                  <li class="socialicon"><a href="https://www.pinterest.com"><div>Pinterest</div></a></li>
                  <li class="socialicon"><a href="https://www.youtube.com"><div >YouTube</div></a></li>
                </ul>
              </div>
              <div id="menu">
                <ul>
                  <li><a href="/">Home</a></li>
                  <li><a href="/">Buyers</a></li>
                  <li><a href="/">Sellers</a></li>
                  <li><a href="/">Communities</a></li>
                  <li><a href="/">School Zones</a></li>
                  <li><a href="/">RSS News Feed</a></li>
                </ul>
              </div>
            </div>
          </header>
          <div id="contentarea2">
            <div id="contentbox2">
              <h1 id="contenttitle2">` + headers[j] + `</h1>
              ` + content[j] + `
            </div>
            <div id="linkbox2">
              <ul>
                ` + links + `
              </ul>
              <div id="relinks2">
                <ul>
                  <li><a href="https://www.zillow.com/profile/">Zillow</a></li>
                  <li><a href="https://www.realtor.com/realestateagents/">Realtor.com</a></li>
                  <li><a href="/">School Zones</a></li>
                  <li><a href="/">Communities</a></li>
                </ul>
                <h6>Powered by <a href="http://the1stpagegroup.com">The First Page Group</h6>
              </div>
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
                Subject: "Home Valuation Request from ` + url + `",
                Body: "Name: " + nameVal + "   Address: " + addVal + "    Message: " + msgVal
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
  if(req.body.style === 'Generic MLM'){
    genericMLM(nameMaker(req.body.terms), 'D:/CodingStuff/Sites/yeswewill/' + name + '/', req.body.company, req.body.site, req.body.emailaddress, req.body.phone, req.body.seoSite, content, req.body.terms, req.body.color);
  } else if (req.body.style === 'Kangen'){
    kangen(nameMaker(req.body.terms), 'D:/CodingStuff/Sites/yeswewill/' + name + '/', req.body.company, req.body.site, req.body.emailaddress, req.body.phone, req.body.seoSite, content, req.body.terms, req.body.color);
  } else if (req.body.style === 'RE Minimalist'){
    minRE(nameMaker(req.body.terms), 'D:/CodingStuff/Sites/yeswewill/' + name + '/', req.body.company, req.body.site, req.body.emailaddress, req.body.phone, req.body.seoSite, content, req.body.terms, req.body.color, req.body.fullname);
  }
});
