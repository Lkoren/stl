import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import os, sys, inspect
#import ast
#import glob
#import json
import logging
#import array

from tornado.options import define, options



# use this if you want to include modules from a subforder
# cmd_subfolder = os.path.realpath(os.path.abspath(os.path.join(os.path.split(inspect.getfile( inspect.currentframe() ))[0],"../DisplayEngine/")))
# if cmd_subfolder not in sys.path:
#     sys.path.insert(0, cmd_subfolder)


define("port", default=8888, help="run on the given port", type=int)
logging.info("starting torando web server")

class DisplayBaseHandler(tornado.web.RequestHandler):
	def get(self):
		print "hello world"




#dev only:
#http://stackoverflow.com/questions/12031007/disable-static-file-caching-in-tornado

#For production: switch to static handler. 
#class StaticNonCaching(tornado.web.StaticFileHandler):
#	def set_extra_headers(self, path):
#		self.set_header("Cache-control", "no-cache")


def main():
	tornado.options.parse_command_line()

	settings = dict(
	template_path = os.path.join(os.path.dirname(__file__), "templates"),            
	debug=True,
	static_path = os.path.join(os.path.dirname(__file__), "static"),
	#ui_modules={"Entry": EntryModule},
	#xsrf_cookies=True,
	#cookie_secret="__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
	#login_url="/auth/login",            
	)
	application = tornado.web.Application([
		(r"/", DisplayBaseHandler),
		#(r"/static/(\w+)", tornado.web.StaticFileHandler, dict(path=settings['static_path']) ),        
	], **settings)
	http_server = tornado.httpserver.HTTPServer(application)
	http_server.listen(options.port)
	tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
	main()
