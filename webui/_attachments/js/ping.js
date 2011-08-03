var dbName = 'ping';
var router = Router();
var $db = $.couch.db("ping");
var $changes = null;

function updateCounter() {
  $.get('/' + dbName + '/').then(function(data) {
    data = JSON.parse(data);
    $("#counter").text(data.doc_count);
  });

}

function startCounter() {
  $changes = $db.changes();
  $changes.onChange(updateCounter);
  updateCounter();
}

setTimeout(startCounter, 1000);

router.get(/^(#)?$/, function (rtr) {
  $db.view("webui/browsers", {group_level:2}).then(function(data) {
    drawGraph(data);
  });
});

function find(obj, search) {
  for (var i = 0; i < obj.length; i++) {
    if (obj[i].label === search) {
      return obj[i];
    }
  }
  return {"label": search, data: []};
}

function drawGraph(data) {
  var maxlen = 0, graphData = [];
  $.each(data.rows, function(index, val) {
    var obj = find(graphData, val.key[0]);
    obj.data.unshift(val.value);
    if (obj.data.length === 1) {
      graphData.push(obj);
    }
    maxlen = obj.data.length > maxlen ? obj.data.length : maxlen;
  });

  var ndata = [], tmp;
  for (var x = 0; x < maxlen; x++) {
    tmp = [];
    for (var y = 0; y < graphData.length; y++) {
      var t = graphData[y].data.pop();
      tmp.push([y, t || 0]);
    }
    ndata.push({data:tmp, clickable:true, hoverable:true, shadowSize:5});
  }

  var ticks = $.map(graphData, function(val, index) {
    return [[index, graphData[index].label]];
  });

  $.plot($("#placeholder"), ndata, {
    series: {
      stack: true,
      grid: {show:true, autoHighlight: true, hoverable:true, clickable:true},
      lines: { show: false},
      points: { show: false },
      bars: {
        show: true, align: 'center', barWidth:0.9, lineWidth: 0, fill:0.9,
        hoverable: true, autoHighlight:true, clickable:true
      }
    },
    yaxis: {color:"#FFF"},
    xaxis: {ticks: ticks, color:"#FFF"},
  });

}

router.init(window);
