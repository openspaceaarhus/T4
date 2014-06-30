import sys, base64
from os import listdir
from os.path import isfile, join, realpath, dirname

def guessMimetype(filename):
    extension = filename.split('.')[-1].lower()
    knowntypes = {'wav': 'audio/x-wav',
                  'js': 'application/javascript',
                  'otf': 'application/font-sfnt',
                  'ttf': 'application/font-sfnt'}
    if extension in knowntypes:
        return knowntypes[extension]
    else:
        return 'application/octet-stream'

def inlineBinaryFile(prefix, postfix, filename, outstream):
    data = base64.b64encode(open(filename).read())
    mimetype = guessMimetype(filename)
    print >>outstream, '{0}data:{1};base64,{2}{3}'.format(prefix, mimetype, data, postfix)

def inlineJavascript(filename, indentation, outstream):
    jslines = [line.rstrip() for line in open(filename).readlines()]
    print >>outstream, '{0}<script type="text/javascript">'.format(indentation * ' ')
    print >>outstream, '{0}<![CDATA['.format((indentation * 2) * ' ')
    for jsline in jslines:
        print >>outstream, '{0}{1}'.format((indentation * 3) * ' ', jsline)
    print >>outstream, '{0}//]]>'.format((indentation * 2) * ' ')
    print >>outstream, '{0}</script>'.format(indentation * ' ')

def processLine(filenames, line, outstream):
    for filename in filenames:
        if '"'+filename+'"' in line:
            if filename.endswith('.js'):
                print "Javascript found! Let's try to inline {0} with mimetype {1}...".format(filename, guessMimetype(filename))
                inlineJavascript(filename, len(line) - len(line.lstrip(' ')), outstream)
                return
            else:
                print "Binary file found! Let's try to base64 encode {0} with mimetype {1}...".format(filename, guessMimetype(filename))
                start = line.find(filename)
                prefix = line[:start]
                postfix = line[start+len(filename):]
                inlineBinaryFile(prefix, postfix, filename, outstream)
                return
    ## If we made it down to here, we didn't find any file reference. We can safely just output the input line.
    print >>outstream, line
    

def processFile(path, infilename, outfilename):
    files = [f for f in listdir(path) if isfile(join(path,f))]
    print "Found {0} files in the input directory".format(len(files))
    input = [line.rstrip() for line in open(infilename).readlines()]
    print "Read {0} lines from {1}".format(len(input), infilename)
    outfile = open(outfilename, 'w')
    for line in input:
        processLine(files, line, outfile)
    outfile.flush()
    outfile.close()
           
if __name__ == '__main__':
    print "Tech Talk Tuesday Timer Inliner Tool for SVG (or T^4ITS) v0.1 (c) 2013-2014 A.T.Brask <atbrask@gmail.com>"
    print ""
    if len(sys.argv) != 3:
        print "Syntax: python inline.py [input file] [output file]"
        exit()

    infilename = realpath(sys.argv[1])
    outfilename = realpath(sys.argv[2])
    mypath = dirname(infilename)

    print "Input file: {0}".format(infilename)
    print "Output file: {0}".format(outfilename)
    print "Processing..."
    processFile(mypath, infilename, outfilename)
    print "Done."
        
