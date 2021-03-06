var config = require('../config/config.js');
var seats = require('../config/seat');

exports.index = function(req, res){
  var winston = req.app.get('winston');
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var room = req.params.room;

	winston.info('[/' + room + '] access from ' + ip);

	if(!(room in seats)) {
		res.status(404);

		if (req.accepts('html')) {
			res.render('404', { url: req.url });
			return;
		}
	}

  var roomList = [];
  for(r in seats) {
    roomList.push(r);
  }

	var need_help = !('help' in req.session);
	req.session['help'] = false;

	res.render('index', {
    sits: seats[room],
		conference: config.conference,
		channel: config.irc.channel.replace('#', ''),
		room: room,
		need_help: need_help,
    room_list: roomList,
		gaid: config.gaid,
	});
};
