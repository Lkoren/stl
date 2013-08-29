
class STLutils	
	def run
		if ARGV.length == 0
			puts "Please include a filename"
		else
			reset() 
			puts "Received filename #{ARGV[0]}"
			@f = File.new(ARGV[0], "rb")
			calc_vol(@f, "cm")
		end
	end
	def reset
		@norms = []
		@points = []
		@triangles = []
		@bytecount = []
		@fb = [] #debug list
	end
	def read_header
		@f.seek(@f.tell() + 80)
	end
	def read_length
		len = @f.read(4).unpack('S')
		#print "Number of triangles is #{len[0]}"
		return len 
	end
	def unpack(format, len)
		s = @f.read(len)
		@fb << s #comment this out for production
		s = s.unpack(format)		
		return s
	end
	def read_triangles
		n = unpack("e3", 12)
		p1 = unpack("e3", 12)		
		p2 = unpack("e3", 12)
		p3 = unpack("e3", 12)		
		b = unpack("v", 2)
		l = @points.length
		@norms << n
		@points << p1
		@points << p2
		@points << p3
		@triangles << l
		@triangles << l + 1
		@triangles << 1 + 2
		@bytecount << b
		return triangle_signed_vol(p1, p2, p3)
	end
	def dump_logs
		@norms.each_index{|i| print "norm #{i} is: #{@norms[i]}"}
		@points.each_index{|i| print "point #{i} is: #{@points[i]}"}
		@triangles.each_index{|i| print "triangle #{i} is: #{@triangles[i]}"}
		@bytecount.each_index{|i| print "bytecount #{i} is: #{@bytecount[i]}"}		
	end
	def triangle_signed_vol(p1, p2, p3)
		v321 = p3[0]*p2[1]*p1[2]
		v231 = p2[0]*p3[1]*p1[2]
		v312 = p3[0]*p1[1]*p2[2]
		v132 = p1[0]*p3[1]*p2[2]
		v213 = p2[0]*p1[1]*p3[2]
		v123 = p1[0]*p2[1]*p3[2]
		return ((v231 + v312 + v123 - v132 - v213  -v321)/6.0)
	end
	def calc_vol(filename, units)
		print "processing #{ARGV[0]} \n"
		read_header()		
		len = read_length()
		print "This object has #{len[0]} triangles\n"
		vol = 0.0
		begin
			(len[0]*5).times {vol += read_triangles()}
		rescue
			if units == "mm"
				print "ding! Total volume is #{vol} mm^3"
			elsif units == "cm"
				print "ding! Total volume is #{vol/1000} cm^3"
			elsif units == ("inch" || "in" || "inches") 
				print "ding! Total volume is #{vol/16387.064} in^3"
			end										
		end
	end
end

s = STLutils.new()
s.run()


