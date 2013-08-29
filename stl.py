import struct

class Stl:
	def load(self, file):
		print "received file:"
		self.file = file['file'][0]['body']
		print self.file	 ## module level var
		print "Total triangles: "
		print self.count_triangles(self.file)
	def reset(self):
		self.normals = []
		self.points = []
		self.triangles = []
		self.bytes = []
	def count_triangles(self, file):
		file = file[80:]
		return struct.unpack("@i", file[:4])[0]