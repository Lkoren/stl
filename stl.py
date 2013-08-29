import struct

class Stl:
	units = ["mm", "cm", "in"]	
	def load(self, file):
		print "received file:"
		self.file = file['file'][0]['body']
		print self.file	 ## module level var
		print "Total triangles: "
		print self.count_triangles(self.file)

		try:
			while len(self.file) > 0:
				self.vol += self.read_triangle()
			print "Ding! Total volume is: "
			print self.vol
		except Exception, e:
			print "Error: "
			print e
	def __init__(self):
		self.normals = []
		self.points = []
		self.triangles = []
		self.bytes = []
		self.vol = 0
	def nibble(self, b):
		out = self.file[:b]
		self.file = self.file[b:]
		print "nibbled: "
		print out
		return out
	def count_triangles(self, file):
		self.nibble(80)
		return struct.unpack("@i", self.nibble(4))[0]
	def read_triangle(self):
		u = struct.unpack
		n = u("<3f", self.nibble(12))
		p1 = u("<3f", self.nibble(12))
		p2 = u("<3f", self.nibble(12))
		p3 = u("<3f", self.nibble(12))
		b = u("<h", self.nibble(2))
		l = len(self.points)
		self.normals.append(n)	
		self.points.append(p1)
		self.points.append(p2)
		self.points.append(p3)
		self.triangles.append((l, l+1, l+2))
		self.bytes.append(b[0])
		return self.signedVolumeOfTriangle(p1,p2,p3)		
	def signedVolumeOfTriangle(self,p1, p2, p3):
		v321 = p3[0]*p2[1]*p1[2]
		v231 = p2[0]*p3[1]*p1[2]
		v312 = p3[0]*p1[1]*p2[2]
		v132 = p1[0]*p3[1]*p2[2]
		v213 = p2[0]*p1[1]*p3[2]
		v123 = p1[0]*p2[1]*p3[2]
		return (1.0/6.0)*(-v321 + v231 + v312 - v132 - v213 + v123)

