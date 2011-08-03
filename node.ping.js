

var http = require('http');
var request = require('request');

var opts = {
  host: "127.0.0.1",
  ping_port: 9876,
  couch_port: 5984,
  db_name: "ping"
};

var spacer = "R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";


function init() {
  startPingHost();
}


function startPingHost() {
  http.createServer(function (req, res) {

    if (req.url !== '/spacer.gif') {
      res.end();
      return false;
    }

    var buf = new Buffer(43);
    buf.write(spacer, "base64");

    res.writeHead(200, {'Content-Type': 'image/gif'});
    res.write(buf);
    res.end();

    writeStats(req.headers);

  }).listen(opts.ping_port, opts.host);
  console.log('Ping server running at http://' + opts.host + ':' + opts.ping_port);
};

function writeStats(headers) {

  var stats = {
    date: JSON.stringify(new Date()),
    headers: {
      'user-agent' : headers['user-agent']
    }
  };

  request({
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    uri: "http://" + opts.host + ":" + opts.couch_port + "/" + opts.db_name,
    body: JSON.stringify(stats)
  }, function(err, resp, body) {
    console.log(body);
  });
}

init();