var r_util = require('leya-util');

var fn = function(routes, opts) {
    this.routes = routes;
    this.opts = opts;
    /*
	var split, len, i, m=[],param=[];

	router = router.router;

	this.routes = {};

	for(var r in router) {
		if(typeof r === 'string') {
			split = r.split('/');

			for(i=0,len=split.length; i < len;i++) {
				s = split[i];

				if(s.startsWith(':')) {
					m.push('([a-zA-Z0-9\-\_\+\$]*)');
					param.push(s.substring(1));
					param[s.substring(1)] = param.length-1;
				} else {
					m.push(s);
				}
			}

			this.routes[m.join('/')] = {
				param: param,
				method: router[r]
			};
		} else {
			throw new Error('Wrong format!');
		}
	}
    */
}, fnp = fn.prototype;

fnp.getDir = function() {
    return this.dir;
};

fnp.getPath = function(route) {
    return [this.getDir(), route].join('/');
}

fnp.forward = function(msg) {
    var me = this,
        url = msg.getUrl(),
        urls = url.split('/'),
        r_, rs, params;
        
    if(r_util.each(this.routes, function(route, paths) {
        return r_util.each(paths.split('|'), function(path) {
            rs = path.split('/');
            
            if(urls.length != rs.length) {
                return;
            }
            
            params = {};
            
            if(r_util.each(rs, function(s, i) {
                if(s.startsWith(':')) {
                    params[s.substring(1)] = urls[i];
                } else if(s !== urls[i]) {
                    return true;
                }
            }) === true) return;
            
            msg.params = params;
            r_ = require(me.getPath(route[msg.getMethod()]));
            r_.opts = me.opts;
            r_.forwardRequest(msg);
            
            return false;
        });    
    }) !== false) msg.sendStatus(404);
};

module.exports = fn;
