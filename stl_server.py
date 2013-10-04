"""
STL webserver.
"""

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.auth
import tornado.escape
import os
import logging
import stl
from tornado.options import define, options
import tornado.httputil
import ast
import ui_methods
import json

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

    def post(self):
        try:
            f = self.request.files
        except:
            f = None
        try:
            u = self.get_argument('url')
        except:
            u = None
        if f:
            data = f
        elif u:
            data = u
        if f or u:
            try:
                with open("./static/stl/temp.stl", "w") as tempFile:
                    tempFile.write(data['file'][0]['body'])
                    tempFile.close()
            except:
                    logging.warning("Failed to create temp stl file for preview.")
            s = stl.Stl()
            self.units = self.get_argument('units')
            params = {"file": data, "units": u, "callback": self.callback}
            s.find_volume(params)
        else:
            self.write("Sorry, we didn't receive a file. Please try again.")

    def callback(self, params):
        printers = self.eval_printer_list()
        self.render("results.html", volume=params['volume'], units=self.units, printer_list=printers)

    def eval_printer_list(self):
        """
        #parses printer_list into python data structure.
        """
        try:
            with open("./admin/printer_options.ast", "r") as f:
                f.seek(0)
                data = ast.literal_eval(f.read())
                f.close()
                return data
        except:
            logging.warning("Filed to open printer options file.")


class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        try:
            user_json = json.loads(self.get_secure_cookie("user"))
            """
            print "#######################################"
            print "name: "
            print user_json["name"]
            print "Authorized? "
            print user_json["name"] in authorized_users
            print "#######################################"
            """
            if user_json["name"] in authorized_users:
                print "Authorized!"
                return user_json["name"]
        except:
            self.redirect("/")
            return None


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
        self.set_secure_cookie("user", tornado.escape.json_encode(user))
        if user['name'] in authorized_users:
            self.redirect("/admin")
        else:
            self.redirect("/")


class Logout_handler(BaseHandler):
    def get(self):
        self.clear_cookie("user")
        self.redirect("/")


class Admin_handler(BaseHandler, STL_handler):
    @tornado.web.authenticated
    #@tornado.web.asynchronous
    def get(self):
        data = self.eval_printer_list()
        self.render("admin.html", printer_list=data)

    def post(self):
        data = ast.literal_eval(self.get_argument('data'))
        self.save_settings(data)

    def save_settings(self, data):
        try:
            with open("./admin/printer_options.ast", "w") as f:
                f.seek(0)
                f.write(str(data))
                f.close()
                self.write(json.dumps({"result": "Settings file saved."}))
        except:
            logging.warning("Error saving settings file.")
            self.write(json.dumps({"result": "Failed to save settings file. Sorry. Check file permissions."}))


class List_handler(tornado.web.RequestHandler):
    def get(self):
        data = self.stringify_printer_list()
        self.write(data)

    def stringify_printer_list(self):
        try:
            with open("./admin/printer_options.ast", "r") as f:
                f.seek(0)
                data = json.dumps(str(f.read().replace('"', r"\'")))
                #print data
                f.close()
                return data
        except:
            logging.warning("Filed to open printer options file.")


class Preview_handler(tornado.web.RequestHandler):
    def get(self):
        with open("./static/stl/temp.stl") as stl_data:
            data = stl_data.read()
            self.write(data)

    def post(self):
        f = self.get_argument('data')
        print f
        self.write("thanks!" + str(f))


"""
datastruct:
printers = {
    "printers": [ {"makerbot": [{"draft quality": 2.00}, {"medium quality": 4.00}, {"high quality": 6.00}]},
      {"form1": [{"draft quality": 5.00}, {"high quality": "10.00"}]}
    ]
}
"""

#dev only:
#http://stackoverflow.com/questions/12031007/disable-static-file-caching-in-tornado

#For production: switch to static handler.
#class StaticNonCaching(tornado.web.StaticFileHandler):
#   def set_extra_headers(self, path):
#       self.set_header("Cache-control", "no-cache")


def main():
    tornado.options.parse_command_line()
    settings = dict(
        template_path=os.path.join(os.path.dirname(__file__), "static"),
        debug=True,
        static_path=os.path.join(os.path.dirname(__file__), "static"),
        cookie_secret="/gDj/FGERTSG1Nd0QYBEZO5lwJL6rE3Brtw1G1TzFYE=",
        xsrf_cookies=True,
        login_url="/login",
        ui_methods=ui_methods,
    )
    application = tornado.web.Application([
        (r"/", STL_handler),
        (r"/upload", STL_handler),
        (r"/login", AuthHandler),
        (r"/admin", Admin_handler),
        (r"/logout", Logout_handler),
        (r"/printer_list", List_handler),
        (r"/preview", Preview_handler)
        #(r"/static/(\w+)", tornado.web.StaticFileHandler, dict(path=settings['static_path']) ),
    ], **settings)
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
