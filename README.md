## Tech Talk Tuesday Timer ##

*Copyright (C) 2012-2014 A.T.Brask <atbrask@gmail.com>*

This is a self-contained countdown timer for our Tech Talk Tuesdays at OSAA
(Open Space Aarhus - http://www.osaa.dk ). It has been implemented from scratch
in SVG and Javascript with a dash of embedded CSS and HTML 5. It's totally
over-engineered because that's fun to do. The goal was to see whether a single
SVG file could contain everything needed for running a simple application like
this. Turns out it could!

###The Setup at Open Space Aarhus###
* An old laptop mounted on the wall
* An ATI Remote Wonder for remote controlling the thing.

###Usage###
The timer has several states, each with its own user interface. Any input
device that can act as a keyboard is usable for this.

####Logo Screen####
* Press 'B' to go to Wallclock Mode.
* Press 'D' to go to the Configuration Screen.

####Configuration Screen####
* Press 0..9 and the arrow keys to set the time.
* Press 'D' to start the timer
* Press 'C' to go to the Logo Screen

####Running Timer####
* Press 'D' to pause the timer.
* Press 'C' to cancel the timer.
* When there's 5 minutes left, a warning sound is played.
* When time's up, the alarm goes off.

####Paused Timer####
* Press 'D' to resume the countdown.
* Press 'C' to cancel the timer.

####Wallclock Mode####
* Press 'C' to go back to the Logo Screen.

###How to Build the Final SVG File###
One of my "dogma rules" for this project is that the SVG file must be entirely
self-contained. Therefore, we need to embed the font and the audio clips in the
SVG at Base64-encoded data URLs. This makes editing the file very cumbersome,
so I have made another solution. 

While editing and debugging the code, one has these files to work with:

* t3timer-dev.svg
* t3timer-dev.js
* Bender_Black.otf
* 5minutes.wav
* beep.wav
* timesup.wav

Once a new version of the code is ready for deployment, all the content files
can be inlined into the SVG file by running the bundled Python script:

`python inline.py t3timer-dev.svg t3timer.svg`

This will create a self-contained file called **t3timer.svg**.

###Browser Compatibility###
SVG is still an evolving format and web browsers support slightly different
subsets of it. As of 2014-06-30 the situation is as follows for this project:

Browser         | Status
:---------------|:-----------------------------------------------------------
Google Chrome   | *Fully supported.*
Apple Safari    | *Fully supported, but sound is a bit delayed.*
Mozilla Firefox | *Fully supported, but the animation may stutter a bit.*
Opera           | *Fully supported.*
Microsoft IE    | *Runs in IE 11, but is missing sound and the custom font.*
Microsoft Edge  | *Fully supported.*

###Known Issues###
Google Chrome seems to have a memory leak somewhere. After some hours the
browser window with Tech Talk Tuesday Timer will run out of memory and crash. 

###Version History###
####1.0 (2012-07-03)####
* Initial release. Yay! :-D

####1.1 (2012-07-03)####
* Flemming requested more accuracy, Rune requested faster blinking.

####1.2 (2012-09-18)####
* The guys requested sound alerts at 05:00 and when the time is up. I threw in
button beeps too.

####1.3 (late 2012)####
* In Linux it's difficult to setup the ATI Remote Wonder remote control to do
anything when the OK button is pushed. Now on we use D instead (for "Do it").

####1.4 (2013-06-04)####
* Added Firefox compatibility by replacing the embedded SVG font with an
embedded Base64-encoded OpenType version of the same font.
* Added <audio> tags instead of procedural sound generation.
* Added Opera compatibility by doing a lot of small tweaks.
* Finally, I've added a tool for inlining the external files.

####1.5 (2014-02-18)####
* Added wallclock mode.

####1.6 (2014-06-30)####
* Various small changes.
* Documentation.
* Uploaded to GitHub.
