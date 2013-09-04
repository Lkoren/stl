import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.auth
import tornado.escape
import os, sys, inspect
import logging
import stl
from tornado.options import define, options
import tornado.httputil
#import bcrypt

# use this if you want to include modules from a subforder
# cmd_subfolder = os.path.realpath(os.path.abspath(os.path.join(os.path.split(inspect.getfile( inspect.currentframe() ))[0],"../DisplayEngine/")))
# if cmd_subfolder not in sys.path:
#     sys.path.insert(0, cmd_subfolder)

authorized_users = ['Liav Koren', 'Andre Tiemann']

define("port", default=8888, help="run on the given port", type=int)
logging.info("starting torando web server")

class STL_handler(tornado.web.RequestHandler):
	def get(self):
		self.render("upload_form.html")
		print "hello world!"
	def post(self):
		try:
			f = self.request.files
		except:
			f = None
		try:
			u = self.get_argument('url')
		except:
			u = None
		try: 
			data = f
		except:
			data = u
		s = stl.Stl()
		u = self.get_argument('units')
		params= {"file": data, "units": u}

		v = s.find_volume(params)	
		self.render("results.html", volume = v, units = u)

class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        user_json = self.get_secure_cookie("user")
        return tornado.escape.json_decode(user_json)

class AuthHandler(BaseHandler, tornado.auth.GoogleMixin):
    @tornado.web.asynchronous
    def get(self):
        if self.get_argument("openid.mode", None):
            self.get_authenticated_user(self.async_callback(self._on_auth))
            return
        self.authenticate_redirect()
 
    def _on_auth(self, user):
        if not user:
            self.send_error(500)
        print "got user: " + str(user['name'])
        self.set_secure_cookie("user", tornado.escape.json_encode(user))
        if user['name'] in authorized_users:
        	self.redirect("/admin")
        else:
        	self.redirect("/")

class Logout_handler(BaseHandler):
	def get(self):
		self.clear_cookie("user")
		self.redirect("/login")

class Admin_handler(BaseHandler):
	def get(self):
		self.render("admin.html")
#dev only:
#http://stackoverflow.com/questions/12031007/disable-static-file-caching-in-tornado

#For production: switch to static handler. 
#class StaticNonCaching(tornado.web.StaticFileHandler):
#	def set_extra_headers(self, path):
#		self.set_header("Cache-control", "no-cache")


def main():
	tornado.options.parse_command_line()

	settings = dict(
	template_path = os.path.join(os.path.dirname(__file__), "static"),            
	debug=True,
	static_path = os.path.join(os.path.dirname(__file__), "static"),
	cookie_secret = "/gDj/FGERTSG1Nd0QYBEZO5lwJL6rE3Brtw1G1TzFYE=",
	xsrf_cookies = True,
	login_url = "/login"
	#ui_modules={"Entry": EntryModule},
	#xsrf_cookies=True,
	#cookie_secret="__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
	#login_url="/auth/login",            
	)
	application = tornado.web.Application([
		(r"/", STL_handler),
		(r"/upload", STL_handler),
		(r"/login", AuthHandler),
		(r"/admin", Admin_handler),
		(r"/logout", Logout_handler),
		#(r"/static/(\w+)", tornado.web.StaticFileHandler, dict(path=settings['static_path']) ),        
	], **settings)
	http_server = tornado.httpserver.HTTPServer(application)
	http_server.listen(options.port)
	tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
	main()
