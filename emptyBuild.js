function (fnames, dir, company, url, email, phone, newurl, content, headers, color){
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
		`

		`,
		function(err){
			if (err) throw err;
			console.log(dir + "index.html created!");
		}
	);
	fs.appendFile(cssfile,
    `

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
			
      `,
      function(err){
			if (err) throw err;
		});
		console.log(path + " created!");
	}
}
