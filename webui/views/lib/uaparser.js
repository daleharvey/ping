var regexes = require('views/lib/user_agent_parsers').user_agent_parsers;

var parsers = regexes.map(function(obj) {

  var regexp = new RegExp(obj.regex),
      famRep = obj.family_replacement,
      majorVersionRep = obj.major_version_replacement;

  function parser(ua) {

    var m = ua.match(regexp);

    if (!m) {
      return null;
    }

    return {
      family: (famRep ? famRep.replace('$1', m[1]) : m[1]),
      major: parseInt(majorVersionRep ? majorVersionRep : m[2]),
      minor: m[3] ? parseInt(m[3]) : null,
      patch: m[4] ? parseInt(m[4]) : null
    };
  }

  return parser;
});

function parse(ua) {
  for (var i=0; i < parsers.length; i++) {
    var result = parsers[i](ua);
    if (result) {
      return result;
    }
  }
  return false;
}

exports.parse = parse;