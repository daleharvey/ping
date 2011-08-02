function(doc) {

  var uaParser = require('views/lib/uaparser');

  if (!doc.headers) {
    emit(["unknown"], 1);
    return;
  }

  var ua = doc.headers['user-agent'];
  var res = uaParser.parse(ua);

  if (!res) {
    emit(["Unknown"], 1);
  } else {
    emit([res.family, res.major, res.minor, res.patch,], 1);
  }

}