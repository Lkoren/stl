from sst.actions import *
from sst import cases

class RootTest(cases.SSTTestCase):
	def test_root_page(self):
		go_to('http://localhost:8888/')
		assert_title_contains('Draft Print 3D')
		assert_title_contains('booga')
		assert_button("file_select")
		assert_button("upload")
		return self


class LoginTest(cases.SSTTestCase):
	def login(self):
		go_to('http://localhost:8888/login')
		assert_element(id="Email")
		assert_element(id="Passwd")
		assert_element(id="booga")
		return self		