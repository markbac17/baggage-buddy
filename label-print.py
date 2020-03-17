#!/usr/bin/env python3

# === LICENSE STATEMENT ===
# Copyright (c) 2011 Sebastian J. Bronner <waschtl@sbronner.com>
# 
# Copying and distribution of this file, with or without modification, are
# permitted in any medium without royalty provided the copyright notice and
# this notice are preserved.
# === END LICENSE STATEMENT ===

# The following module libraries are not included with python and need to be
# installed separately:
# * Pillow (python-pillow or python3-pillow)
# * PyUSB  (python-pyusb, python3-pyusb, python-usb, or python3-usb)


from PIL import Image, ImageDraw, ImageFont
import argparse
import array
import fcntl
import os
import re
import struct
import subprocess
import sys
import termios
import textwrap
import usb


#FONT_FILENAME = '/usr/share/fonts/TTF/DejaVuSans.ttf'
#FONT_FILENAME = '/usr/share/fonts/TTF/DejaVuSans-Bold.ttf'
#FONT_FILENAME = '/usr/share/fonts/TTF/DejaVuSans-Oblique.ttf'
#FONT_FILENAME = '/usr/share/fonts/TTF/DejaVuSans-BoldOblique.ttf'
#FONT_FILENAME = '/usr/share/fonts/TTF/DejaVuSans-ExtraLight.ttf'
FONT_FILENAME = '/usr/share/fonts/TTF/DejaVuSansCondensed.ttf'
#FONT_FILENAME = '/usr/share/fonts/TTF/DejaVuSansCondensed-Bold.ttf'
#FONT_FILENAME = '/usr/share/fonts/TTF/DejaVuSansCondensed-Oblique.ttf'
#FONT_FILENAME = '/usr/share/fonts/TTF/DejaVuSansCondensed-BoldOblique.ttf'
#FONT_FILENAME = '/usr/share/fonts/TTF/ezra/SILEOT.ttf'
#FONT_FILENAME = '/usr/share/fonts/TTF/gentium/Gentium-R.ttf'  # IPA
FONT_SIZERATIO = 7./8
VERSION = "0.2.0 (2016-11-07)"


class DymoLabeler:
    """Create and work with a Dymo LabelManager PnP object.

    This class contains both mid-level and high-level functions. In general,
    the high-level functions should be used. However, special purpose usage
    may require the mid-level functions. That is why they are provided.
    However, they should be well understood before use. Look at the
    high-level functions for help. Each function is marked in its docstring
    with 'HLF' or 'MLF' in parentheses.
    """
    _ESC = 0x1b
    _SYN = 0x16
    _MAX_BYTES_PER_LINE = 8  # 64 pixels on a 12mm tape
    _USB_VENDOR = 0x0922
    _USB_PRODUCT = (0x1001, 0x1002)
    # Number of commands to send before waiting for a response. This helps
    # to avoid timeouts due to differences between data transfer and
    # printer speeds. I added this because I kept getting "IOError: [Errno
    # 110] Connection timed out" with long labels. Using dev.default_timeout
    # (1000) and the transfer speeds available in the descriptors somewhere, a
    # sensible timeout can also be calculated dynamically.
    _SYNWAIT = 64

    def __init__(self):
        """Initialize the LabelManager object. (HLF)"""
        self.cmd = []
        self.response = False
        self.bytes_per_line_ = None
        self.dot_tab_ = 0

        # Find and prepare device communication endpoints.
        dev = usb.core.find(custom_match = lambda d: (d.idVendor ==
            self._USB_VENDOR and d.idProduct in self._USB_PRODUCT))
        if dev is None:
            raise RuntimeError("No USB device matching the following criteria "
                "was found:\n  idVendor: 0x%04x\n  idProduct: %s" %
                (self._USB_VENDOR, ', '.join('0x%04x' % id_ for id_ in
                self._USB_PRODUCT)))
        try:
            dev.set_configuration()
        except usb.core.USBError as e:
            if e.errno == 13:
                # Handle error number 13 (Access denied) by printing
                # instructions for gaining access.
                lines = []
                lines.append("You do not have sufficient access to the "
                    "device. You probably want to add some udev rules in "
                    "/etc/udev/rules.d/dymoprint.rules along the following "
                    "lines:")
                lines.append("")
                for id_ in self._USB_PRODUCT:
                    lines.append('ACTION=="add", SUBSYSTEMS=="usb", '
                        'ATTRS{idVendor}=="%04X", ATTRS{idProduct}=="%04X", '
                        'MODE="0660", GROUP="users"' % (self._USB_VENDOR, id_))
                lines.append("")
                lines.append("Following that, turn your device off and back "
                    "on again to activate the new permissions.")
                raise RuntimeError('\n'.join(lines))
            if e.errno == 16:
                # Handle error number 16 (Resource busy) by ignoring it. It
                # just means that the configuration has already been set.
                pass
            else:
                # On all other errors, the original exception is simple
                # re-raised.
                raise
        intf = usb.util.find_descriptor(dev.get_active_configuration(),
            bInterfaceClass=0x3)
        if dev.is_kernel_driver_active(intf.bInterfaceNumber):
            dev.detach_kernel_driver(intf.bInterfaceNumber)
        self.data = usb.util.find_descriptor(intf, custom_match = (lambda e:
            usb.util.endpoint_direction(e.bEndpointAddress) ==
            usb.util.ENDPOINT_OUT))
        self.status = usb.util.find_descriptor(intf, custom_match = (lambda e:
            usb.util.endpoint_direction(e.bEndpointAddress) ==
            usb.util.ENDPOINT_IN))

    def send_command(self):
        """Send the already built command to the LabelManager. (MLF)"""
        if len(self.cmd) == 0:
            return
        while len(self.cmd) > 0:
            synCount = 0
            pos = -1
            while synCount < self._SYNWAIT:
                try:
                    pos += self.cmd[pos+1:].index(self._SYN) + 1
                except ValueError:
                    pos = len(self.cmd)
                    break
                synCount += 1
            cmdBin = array.array('B', [self._ESC, ord('A')])
            cmdBin.tofile(self.data)
            rspBin = self.status.read(8)
            rsp = array.array('B', rspBin).tolist()
            print(rsp, pos, len(self.cmd))
            cmdBin = array.array('B', self.cmd[:pos])
            cmdBin.tofile(self.data)
            self.cmd = self.cmd[pos:]
        self.cmd = []
        if not self.response:
            return
        self.response = False
        responseBin = self.status.read(8)
        response = array.array('B', responseBin).tolist()
        return response

    def reset_command(self):
        """Remove a partially built command. (MLF)"""
        self.cmd = []
        self.response = False

    def build_command(self, cmd):
        """Add the next instruction to the command. (MLF)"""
        self.cmd += cmd

    def status_request(self):
        """Set instruction to get the device's status. (MLF)"""
        cmd = [self._ESC, ord('A')]
        self.build_command(cmd)
        self.response = True

    def dot_tab(self, value):
        """Set the bias text height, in bytes. (MLF)"""
        if value < 0 or value > self._MAX_BYTES_PER_LINE:
            raise ValueError
        cmd = [self._ESC, ord('B'), value]
        self.build_command(cmd)
        self.dot_tab_ = value
        self.bytes_per_line_ = None

    def tape_color(self, value):
        """Set the tape color. (MLF)"""
        if value < 0: raise ValueError
        cmd = [self._ESC, ord('C'), value]
        self.build_command(cmd)

    def bytes_per_line(self, value):
        """Set the number of bytes sent in the following lines. (MLF)"""
        if value < 0 or value + self.dot_tab_ > self._MAX_BYTES_PER_LINE:
            raise ValueError
        if value == self.bytes_per_line_:
            return
        cmd = [self._ESC, ord('D'), value]
        self.build_command(cmd)
        self.bytes_per_line_ = value

    def cut(self):
        """Set instruction to trigger cutting of the tape. (MLF)"""
        cmd = [self._ESC, ord('E')]
        self.build_command(cmd)

    def line(self, value):
        """Set next printed line. (MLF)"""
        self.bytes_per_line(len(value))
        cmd = [self._SYN] + value
        self.build_command(cmd)

    def chain_mark(self):
        """Set Chain Mark. (MLF)"""
        self.dot_tab(0)
        self.bytes_per_line(self._MAX_BYTES_PER_LINE)
        self.line([0x99] * self._MAX_BYTES_PER_LINE)

    def skip_lines(self, value):
        """Set number of lines of white to print. (MLF)"""
        if value <= 0:
            raise ValueError
        self.bytes_per_line(0)
        cmd = [self._SYN] * value
        self.build_command(cmd)

    def init_label(self):
        """Set the label initialization sequence. (MLF)"""
        cmd = [0x00] * 8
        self.build_command(cmd)

    def get_status(self):
        """Ask for and return the device's status. (HLF)"""
        self.status_request()
        response = self.send_command()
        print(response)

    def print_label(self, lines, dot_tab):
        """Print the label described by lines. (HLF)"""
        self.init_label
        self.tape_color(0)
        self.dot_tab(dot_tab)
        for line in lines:
            self.line(line)
        self.skip_lines(56)  # advance printed matter past cutter
        self.skip_lines(56)  # add symmetric margin
        self.status_request()
        response = self.send_command()
        print(response)


def die(message=None):
    if message: print(message, file=sys.stderr)
    sys.exit(1)


def pprint(par, fd=sys.stdout):
    rows, columns = struct.unpack('HH', fcntl.ioctl(sys.stderr,
        termios.TIOCGWINSZ, struct.pack('HH', 0, 0)))
    print(textwrap.fill(par, columns), file=fd)


def main():
    # set up argument parsing with usage and help output
    description = ("This script will print labels on a Dymo LabelManager PnP "
        "connected to your computer via USB.")
    parser = argparse.ArgumentParser(
        description=description)
    parser.add_argument(
        '-v', '--version',
        action='version',
        version='%(prog)s ' + VERSION
        )
    parser.add_argument(
        'lines',
        metavar='line',
        nargs='+',
        help=("A single line will be printed at the maximum available size on "
            "the label. If multiple lines are specified, they will be reduced "
            "in size to fit the vertical space and will be placed in a "
            "column."))
    args = parser.parse_args()

    # create dymo labeler object
    lm = DymoLabeler()
    
    # create an empty label image
    labelheight = lm._MAX_BYTES_PER_LINE * 8
    lineheight = float(labelheight) / len(args.lines)
    fontsize = int(round(lineheight * FONT_SIZERATIO))
    font = ImageFont.truetype(FONT_FILENAME, fontsize)
    labelwidth = max(font.getsize(line)[0] for line in args.lines)
    labelbitmap = Image.new('1', (labelwidth, labelheight))
    
    # write the text into the empty image
    labeldraw = ImageDraw.Draw(labelbitmap)
    for i, line in enumerate(args.lines):
        lineposition = int(round(i * lineheight))
        labeldraw.text((0, lineposition), line, font=font, fill=255)
    del labeldraw
    
    # convert the image to the proper matrix for the dymo labeler object
    labelrotated = labelbitmap.transpose(Image.ROTATE_270)
    labelstream = labelrotated.tobytes()
    labelstreamrowlength = labelheight//8 + (1 if labelheight%8 != 0 else 0)
    if len(labelstream)/labelstreamrowlength != labelwidth:
        die('An internal problem was encountered while processing the label '
            'bitmap!')
    labelrows = [labelstream[i:i+labelstreamrowlength] for i in
        range(0, len(labelstream), labelstreamrowlength)]
    labelmatrix = [array.array('B', labelrow).tolist() for labelrow in
        labelrows]
    
    # optimize the matrix for the dymo label printer
    dottab = 0
    while max(line[0] for line in labelmatrix) == 0:
        labelmatrix = [line[1:] for line in labelmatrix]
        dottab += 1
    for line in labelmatrix:
        while len(line) > 0 and line[-1] == 0:
            del line[-1]
    
    # print the label
    lm.print_label(labelmatrix, dottab)


if __name__ == '__main__':
    main()


# TODO
# * support multiple ProductIDs (1001, 1002)
# * put everything in classes that would need to be used by a GUI
# * allow selection of font with command line options
# * allow font size specification with command line option (points, pixels?)
# * provide an option to show a preview of what the label will look like
# * read and write a .dymoprint file containing user preferences
# * implement errors using exceptions
# * implement regular output using standard methods
# * get rid of die()
# * get rid of pprint()
# * get rid of access_error()
# * provide a version that includes its dependent libraries, and a version that
#   uses system libraries
