import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import os, sys, inspect
import logging
import stl
from tornado.options import define, options
import tornado.httputil


# use this if you want to include modules from a subforder
# cmd_subfolder = os.path.realpath(os.path.abspath(os.path.join(os.path.split(inspect.getfile( inspect.currentframe() ))[0],"../DisplayEngine/")))
# if cmd_subfolder not in sys.path:
#     sys.path.insert(0, cmd_subfolder)


define("port", default=8888, help="run on the given port", type=int)
logging.info("starting torando web server")

class STL_handler(tornado.web.RequestHandler):
	def get(self):
		self.render("upload_form.html")
		print "hello world!"
	def post(self):
		f = self.request.files
		u = self.get_argument('url')

		print "File and url: "
		print f
		print u

		s = stl.Stl()
		u = self.get_argument('units')
		params= {"file":f, "units": u}

		#v = s.find_volume(params)
		
		#self.render("results.html", volume = v, units = u)






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
	#ui_modules={"Entry": EntryModule},
	#xsrf_cookies=True,
	#cookie_secret="__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
	#login_url="/auth/login",            
	)
	application = tornado.web.Application([
		(r"/", STL_handler),
		(r"/upload", STL_handler)
		#(r"/static/(\w+)", tornado.web.StaticFileHandler, dict(path=settings['static_path']) ),        
	], **settings)
	http_server = tornado.httpserver.HTTPServer(application)
	http_server.listen(options.port)
	tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
	main()
