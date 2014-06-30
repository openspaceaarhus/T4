// Key codes
const BUTTON_OK = 13;
const BUTTON_LEFT = 37;
const BUTTON_UP = 38;
const BUTTON_RIGHT = 39;
const BUTTON_DOWN = 40;
const BUTTON_A = 65;
const BUTTON_B = 66;
const BUTTON_C = 67;
const BUTTON_D = 68;
const BUTTON_E = 69;
const BUTTON_F = 70;
const BUTTON_0 = 48;
const BUTTON_1 = 49;
const BUTTON_2 = 50;
const BUTTON_3 = 51;
const BUTTON_4 = 52;
const BUTTON_5 = 53;
const BUTTON_6 = 54;
const BUTTON_7 = 55;
const BUTTON_8 = 56;
const BUTTON_9 = 57;

// States
const CLOCK_SPLASH = 0;
const CLOCK_CONFIG = 1;
const CLOCK_PAUSED = 2;
const CLOCK_STARTED = 3;
const CLOCK_WALLCLOCK = 4;

// Default values
const DEFAULT_MINUTES = 15;
const DEFAULT_SECONDS = 0;

// Offset constants
const DIGIT_TENMINUTES = 0;
const DIGIT_MINUTES = 1;
const DIGIT_TENSECONDS = 2;
const DIGIT_SECONDS = 3;

// Event handlers

function init()
{
    new logoanimation().animate();
    clock = new clockdisplay(DEFAULT_MINUTES, DEFAULT_SECONDS, CLOCK_SPLASH);
    clock.animate();
    document.documentElement.addEventListener("keydown", keyDownHandler, false);
    playaudio("beep");
}

function playaudio(id)
{
    var elm = document.getElementById(id);
    if (elm != undefined && elm instanceof HTMLAudioElement)
        elm.play();
}

keyPressInProgress = false;

function keyDownHandler(evt)
{
    // This is a keyDown event. Therefore, we need to limit incoming events...
    if (!keyPressInProgress)
    {
        keyPressInProgress = true;
        setTimeout(function() { keyPressInProgress = false;}, 200);

        playaudio("beep");
        switch(clock.state)
        {
        case CLOCK_SPLASH: handlesplashkeys(evt.keyCode); break;
        case CLOCK_CONFIG: handleconfigkeys(evt.keyCode); break;
        case CLOCK_PAUSED: handlepausedkeys(evt.keyCode); break;
        case CLOCK_STARTED: handlestartedkeys(evt.keyCode); break;
        case CLOCK_WALLCLOCK: handlewallclockkeys(evt.keyCode); break;
        default: break;
        }
    }
}

// User input

function handlesplashkeys(code)
{
    if (code == BUTTON_D)
        enterTimer();
    else if (code == BUTTON_B)
        enterWallclock();
}

function handleconfigkeys(code)
{
    switch(code)
    {
    case BUTTON_C: enterSplash(); break;
    case BUTTON_D: startClock(); break;
    case BUTTON_UP: clock.up(); break;
    case BUTTON_DOWN: clock.down(); break;
    case BUTTON_LEFT: clock.left(); break;
    case BUTTON_RIGHT: clock.right(); break;
    case BUTTON_0: clock.setSelectedDigit(0); clock.right(); break;
    case BUTTON_1: clock.setSelectedDigit(1); clock.right(); break;
    case BUTTON_2: clock.setSelectedDigit(2); clock.right(); break;
    case BUTTON_3: clock.setSelectedDigit(3); clock.right(); break;
    case BUTTON_4: clock.setSelectedDigit(4); clock.right(); break;
    case BUTTON_5: clock.setSelectedDigit(5); clock.right(); break;
    case BUTTON_6: clock.setSelectedDigit(6); clock.right(); break;
    case BUTTON_7: clock.setSelectedDigit(7); clock.right(); break;
    case BUTTON_8: clock.setSelectedDigit(8); clock.right(); break;
    case BUTTON_9: clock.setSelectedDigit(9); clock.right(); break;
    default: break;
    }
}

function handlepausedkeys(code)
{
    if (code == BUTTON_C)
        showConfig();
    else if (code == BUTTON_D)
        startClock();
}

function handlestartedkeys(code)
{
    if (code == BUTTON_C)
        showConfig();
    else if (code == BUTTON_D)
        pauseClock();
}

function handlewallclockkeys(code)
{
    if (code == BUTTON_C)
        enterSplash();
}

function setInstructions(newid)
{
    document.getElementById("instructions").setAttribute("xlink:href", "#" + newid);
}

function enterSplash()
{
    clock.state = CLOCK_SPLASH;
    zoomin();
}

function enterTimer()
{
    showConfig();
    clock.render();
    zoomout();
}

function enterWallclock()
{
    setInstructions("wallclockinstructions");
    clock.state = CLOCK_WALLCLOCK;
    clock.setWallclockTime();
    clock.render();
    zoomout();
}

function showConfig()
{
    setInstructions("configinstructions");
    clock.state = CLOCK_CONFIG;
    clock.reset();
}

function startClock()
{
    setInstructions("startedinstructions");
    clock.state = CLOCK_STARTED;
}

function pauseClock()
{
    setInstructions("pausedinstructions");
    clock.state = CLOCK_PAUSED;
}

// The clock object

function clockdisplay(defaultmins, defaultsecs, initialstate)
{
    this.totalminutes = defaultmins;
    this.totalseconds = defaultsecs;
    this.state = initialstate;
    this.newsecond = true;
    this.time = new Date();
    this.reset();
}

clockdisplay.prototype.reset = function()
{
    this.timeminutes = this.totalminutes;
    this.timeseconds = this.totalseconds;
    this.showblinking = true;
    this.selectedDigit = DIGIT_TENMINUTES;
}

clockdisplay.prototype.up = function()
{
    this.setSelectedDigit(this.getSelectedDigit() + 1);
}

clockdisplay.prototype.down = function()
{
    this.setSelectedDigit(this.getSelectedDigit() - 1);
}

clockdisplay.prototype.left = function()
{
    this.selectedDigit = (this.selectedDigit + 3) % 4;
    this.render();
}

clockdisplay.prototype.right = function()
{
    this.selectedDigit = (this.selectedDigit + 1) % 4;
    this.render();
}

clockdisplay.prototype.getSelectedDigit = function()
{
    switch(this.selectedDigit)
    {
    case DIGIT_TENMINUTES: return Math.floor(this.timeminutes / 10);
    case DIGIT_MINUTES: return this.timeminutes % 10;
    case DIGIT_TENSECONDS: return Math.floor(this.timeseconds / 10);
    case DIGIT_SECONDS: return this.timeseconds % 10;
    default: return 0;
    }
}

clockdisplay.prototype.setSelectedDigit = function(newdigit)
{
    switch(this.selectedDigit)
    {
    case DIGIT_TENMINUTES: this.timeminutes = this.totalminutes = ((newdigit + 10) % 10) * 10 + (this.totalminutes % 10); break;
    case DIGIT_MINUTES: this.timeminutes = this.totalminutes = ((newdigit + 10) % 10) + (this.totalminutes - this.totalminutes % 10); break;
    case DIGIT_TENSECONDS: this.timeseconds = this.totalseconds = ((newdigit + 6) % 6) * 10 + (this.totalseconds % 10); break;
    case DIGIT_SECONDS: this.timeseconds = this.totalseconds = ((newdigit + 10) % 10) + (this.totalseconds - this.totalseconds % 10); break;
    default: break;
    }
    this.render();
}

clockdisplay.prototype.animate = function()
{
    var c = this;
    var newtime = new Date();
    var timediff = newtime - this.time;
    this.time = newtime;
    if (this.state == CLOCK_WALLCLOCK)
        window.setTimeout(function(){c.animate();}, 100)
    else
        window.setTimeout(function(){c.animate();}, this.newsecond ? 500: 1000 - timediff)
    this.newsecond = !this.newsecond;
    this.render();
}

clockdisplay.prototype.render = function()
{    
    var separator = document.getElementById("separator");
    var progressbar = document.getElementById("progressbar");

    var tenminutes = document.getElementById("tenminutes");
    var minutes = document.getElementById("minutes");
    var tenseconds = document.getElementById("tenseconds");
    var seconds = document.getElementById("seconds");
    
    minutes.textContent = this.timeminutes % 10;
    tenminutes.textContent = Math.floor(this.timeminutes / 10);
    var bboxmin = minutes.getBBox();
    tenminutes.setAttribute("x", bboxmin.x);

    tenseconds.textContent = Math.floor(this.timeseconds / 10);
    seconds.textContent = this.timeseconds % 10;
    var bboxsec = tenseconds.getBBox();
    seconds.setAttribute("x", bboxsec.x + bboxsec.width);

    if (this.state == CLOCK_WALLCLOCK)
    {
        var secs = this.time.getSeconds();
        progressbar.setAttribute("width", (secs / 60) * 1240);
    }
    else
    {
        var alltime = this.totalminutes * 60 + this.totalseconds;
        var elapsedtime = this.timeminutes * 60 + this.timeseconds;
        if (this.totalminutes * 60 + this.totalseconds != 0 && alltime >= elapsedtime)
            progressbar.setAttribute("width", ((alltime - elapsedtime) / alltime) * 1240);
        else
            progressbar.setAttribute("width", 0);
    }

    if (this.state == CLOCK_STARTED)
    {
        this.showblinking = !this.newsecond;
        setVisible(tenminutes, true);
        setVisible(minutes, true);
        setVisible(tenseconds, true);
        setVisible(seconds, true);
        setVisible(separator, this.showblinking);
        
        if (this.newsecond)
            this.timeseconds--;

        if (this.timeseconds < 0)
        {
            this.timeseconds = 59;
            this.timeminutes--;
        }
        
        if (this.timeminutes < 0)
        {
            this.state = CLOCK_PAUSED;
            this.timeminutes = 0;
            this.timeseconds = 0;
        }

        if (this.timeminutes == 5 && this.timeseconds == 0 && this.newsecond)
            playaudio("5minutes");
    }
    else if (this.state == CLOCK_CONFIG)
    {
        this.showblinking = !this.showblinking;
        setVisible(tenminutes, this.showblinking || this.selectedDigit != 0);
        setVisible(minutes, this.showblinking || this.selectedDigit != 1);
        setVisible(tenseconds, this.showblinking || this.selectedDigit != 2);
        setVisible(seconds, this.showblinking || this.selectedDigit != 3);
        setVisible(separator, true);
    }
    else if (this.state == CLOCK_PAUSED)
    {
        this.showblinking = !this.showblinking;
        setVisible(tenminutes, this.showblinking);
        setVisible(minutes, this.showblinking);
        setVisible(tenseconds, this.showblinking);
        setVisible(seconds,  this.showblinking);
        setVisible(separator, this.showblinking);
        if (this.timeminutes == 0 && this.timeseconds == 0)
            playaudio("timesup");
    }
    else if (this.state == CLOCK_WALLCLOCK)
    {
        this.showblinking = !this.newsecond;
        setVisible(tenminutes, true);
        setVisible(minutes, true);
        setVisible(tenseconds, true);
        setVisible(seconds,  true);
        setVisible(separator, this.time.getSeconds() % 2 == 0);
        this.setWallclockTime();

    }
    else
    {
        setVisible(tenminutes, true);
        setVisible(minutes, true);
        setVisible(tenseconds, true);
        setVisible(seconds,  true);
        setVisible(separator, true);
    }
}

clockdisplay.prototype.setWallclockTime = function()
{
    this.timeminutes = this.time.getHours();
    this.timeseconds = this.time.getMinutes();
} 

function setVisible(domobj, visible)
{
    domobj.setAttribute("style", visible ? "visibility:visible;" : "visibility:hidden;");
}

// Animations

function zoomout()
{
    zoom(3, 3, -2600, -1550, 1, 1, 0, 0, 0, 30);
}

function zoomin()
{
    zoom(1, 1, 0, 0, 3, 3, -2600, -1550, 0, 30);
}

function zoom(fromzoomx, fromzoomy, fromoffsetx, fromoffsety, tozoomx, tozoomy, tooffsetx, tooffsety, step, totalsteps)
{
    step++;
    var canvas = document.getElementById("canvas");
    var newfraction = step / totalsteps;
    var oldfraction = 1.0 - newfraction;
    canvas.setAttribute("transform", "matrix(" + (oldfraction * fromzoomx + newfraction * tozoomx) + ", 0, 0, " + (oldfraction * fromzoomy + newfraction * tozoomy) + ", " + (oldfraction * fromoffsetx + newfraction * tooffsetx) + ", " + (oldfraction * fromoffsety + newfraction * tooffsety) + ")");
    if (step < totalsteps)
        window.setTimeout(function(){zoom(fromzoomx, fromzoomy, fromoffsetx, fromoffsety, tozoomx, tozoomy, tooffsetx, tooffsety, step, totalsteps);}, 10);        
}

function logoanimation()
{
    this.logo = document.getElementById("animatedlogo"); 
    var bbox = this.logo.getBBox();
    var x = parseInt(this.logo.getAttribute("x"), 10);
    var y = parseInt(this.logo.getAttribute("y"), 10);    
    this.centerx = bbox.x + bbox.width / 2;
    this.centery = bbox.y + bbox.height / 2;
    // Chrome and Firefox do not have the same definition of BBox as Opera do. Therefore, we need a little hack here...
    if (bbox.x < x && bbox.y < y)
    {
	    this.centerx += x;
	    this.centery += y;
    }
    this.angle = 0;
    this.anglestep = 1;
    this.timestep = 25;
}

logoanimation.prototype.animate = function()
{
    var animation = this;
    window.setTimeout(function(){animation.animate();}, this.timestep);
    this.logo.setAttribute ("transform", "rotate(" + this.angle + " " + this.centerx + " " + this.centery + ")");
    this.angle = (this.angle + this.anglestep) % 360;
}
