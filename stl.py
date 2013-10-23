import struct
import logging
import re

class Stl:
    def __init__(self):
        self.normals = []
        self.points = []
        self.triangles = []
        self.bytes = []
        self.vol = 0
        #RE pattern from JSC3D/Triffid Hunter: code.google.com/p/jsc3d/
        self.pattern = ('').join(['facet\\s+normal\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+',
        'outer\\s+loop\\s+' + 'vertex\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+',
        'vertex\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+',
        'vertex\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+',
        'endloop\\s+','endfacet'])
        self.search_queary = re.compile(self.pattern)

    def process(self, params):
        self.file = params['file']['file'][0]['body']  #TODO: uuugly -- refactor
        ascii = re.search(self.search_queary, self.file)
        if ascii:
            print("got ascii!")
            self.vol = self.process_ascii()
        else:
            print("not ascii")
            self.vol = self.process_binary()
        units = params['units']
        if units == "mm":
            self.vol /= 1000
        elif units == "in":
            self.vol /= 16.387064
        if self.vol <= 0:
            raise Exception("There was a file processing error. The volume\
            appears to be less than or equal to zero. Please check that the\
            file is a properly formated, watertight STL format.")
        callback = params['callback']
        callback({"volume": self.vol})

    def signedVolumeOfTriangle(self, p1, p2, p3):
        v321 = p3[0]*p2[1]*p1[2]
        v231 = p2[0]*p3[1]*p1[2]
        v312 = p3[0]*p1[1]*p2[2]
        v132 = p1[0]*p3[1]*p2[2]
        v213 = p2[0]*p1[1]*p3[2]
        v123 = p1[0]*p2[1]*p3[2]
        return (1.0/6.0)*(-v321 + v231 + v312 - v132 - v213 + v123)

    def cm_to_mm(self, vol):
        return vol/1000

    def in_to_mm(self, vol):
        return vol/16387.064

    #Ascii file functions:
    def process_ascii(self):
        ascii_data = self.search_queary.findall(self.file)
        """
        the ascii data is a list of 12-tuples, each tuple holding the face
        normal and three vertex coords as strings, eg:
        ('-0', '0', '1', '0', '0', '1', '0.5e10', '0', '1', '0', '0.5', '1')
        """
        vol = 0
        for tup in ascii_data:
            try:
                n = self.toFloat(tup[0:3])
                p1 = self.toFloat(tup[3:6])
                p2 = self.toFloat(tup[6:9])
                p3 = self.toFloat(tup[9:12])
                vol += self.signedVolumeOfTriangle(p1, p2, p3)
            except IndexError:
                logging.warning("Error parsing stl file")
                try:
                    with open("/logs/error.log" "w") as log:
                        log.write(ascii_data)
                except IOError:
                    logging.warning("process_ascii encountered an error\
                        parsing while parsing data and was also unable to\
                        write to write to log file. Please check file\
                        system permissions.")
            except Exception as e:
                logging.warning("Unexpected exception: " + str(e))
        print ("Ding! total ascii volume is: " + str(vol))
        return vol


    def toFloat(self, tup):
        try:
            return [float(num) for num in tup]
        except ValueError:
            logging.warning("Error converting ascii stream to numerical data")

    #Binary file functions:
    def process_binary(self):
        self.count_triangles(self.file)
        vol = 0
        try:
            while len(self.file) > 0:
                vol += self.read_triangle()
            return vol
        except Exception, e:
            logging.warning(e)
            return False

    def read_triangle(self):
        u = struct.unpack
        try:
            n = u("<3f", self.nibble(12))
            p1 = u("<3f", self.nibble(12))
            p2 = u("<3f", self.nibble(12))
            p3 = u("<3f", self.nibble(12))
            b = u("<h", self.nibble(2))
            #print "n: " + str(n)
        except SyntaxError:
            logging.warning("Syntax error in file." + self.file)
        l = len(self.points)
        self.normals.append(n)
        self.points.append(p1)
        self.points.append(p2)
        self.points.append(p3)
        self.triangles.append((l, l+1, l+2))
        self.bytes.append(b[0])
        return self.signedVolumeOfTriangle(p1, p2, p3)

    def nibble(self, b):
        """
        Parse b bits from the head of the file, and remove those bits from the
        file.
        """
        out = self.file[:b]
        self.file = self.file[b:]
        #print "nibbled: " + out
        return out

    def count_triangles(self, file):
        """
        The first 80 bits are header info we don't care about. The next four
        are a triangle count.
        """
        self.nibble(80)
        return struct.unpack("@i", self.nibble(4))[0]