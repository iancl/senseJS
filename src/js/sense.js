// SenseJS 1.0.1 Module
// Created By Ian Calderon for Say Media
//smskip:validation

(function(window, document, undefined){

var
/*===================================== Local ======================================*/

Sense = {},

config = {
	isChrome: false
},

// binds context to function
local_bind = parent.local_bind || function(scope, fn) {
 	var _function = fn;
  
 	return function(evt) {
		return _function.apply(scope, arguments);
  	};
},

// binds context to multiple function
bind_context = parent.bind_context || function() {
	var args = Array.prototype.slice.call(arguments, 0),
		scope = args.shift(0),
		i;

 	for(i in args){
 		scope[args[i]] = local_bind(scope, scope[args[i]]);
 	}
 	args = null;
 	scope = null;
},

// will detect if browser is chrome so it can apply some fixes
detectBrowser = function(){
	if( (navigator.userAgent.toLowerCase().match(/android/i)) && (navigator.userAgent.toLowerCase().match(/chrome/i)) ) {
		config.isChrome = true;
	}
},

// will create al inital vars and set intial values
BuildClass = function(options){

	// will store a reference of the options object
	this.options = options || {};

	// necessary to handle mouse events
	this.isMouseDown = false;


	// X axis related
	this.touchStartPosX = 0;
	this.currentPosX = 0;

	// Y axis related
	this.touchStartPosY = 0;
	this.currentPosY = 0;


	// detect if device supports touch
	this.isTouchSupported = 'ontouchstart' in window;

	// other params
	this.element = document.querySelector(this.options.selector);
	this.options.context = (typeof this.options.context !== 'undefined') ? this.options.context : window;
	this.options.distance = this.options.distance || 30;


	// event listeners
	bind_context(this, "touchmove", "touchstart", "touchend");
	setListeners.call(this);


	// other
	this.destroy = local_destroy;

},

// will determine if how to get the coordinates based on the type of method the device supports
getCoordinates = function(evt){
	if (this.isTouchSupported === true) {
		this.touchStartPosX = evt.touches[0].clientX;
		this.touchStartPosY = evt.touches[0].clientY;
	} else if(this.isMouseDown === true) {
		this.touchStartPosX = evt.clientX;
		this.touchStartPosY = evt.clientY;
	}
},

// will determine if how to get the X axis coordinates based on the type of method the device supports
getXAxisCoordinate = function(evt){
	var xCoordinate;

	if (this.isTouchSupported === true) {
		xCoordinate = evt.touches[0].clientX;
	} else if(this.isMouseDown === true) {
		xCoordinate = evt.clientX;
	}

	return xCoordinate;
},

// will determine if how to get the Y axis coordinates based on the type of method the device supports
getYAxisCoordinate = function(evt){
	var yCoordinate;

	if (this.isTouchSupported === true) {
		yCoordinate = evt.touches[0].clientY;
	} else if(this.isMouseDown) {
		yCoordinate = evt.clientY;
	}

	return yCoordinate;
},
// adds all event listeners
setListeners = function(){

	if (this.isTouchSupported === true) {

		this.element.addEventListener('touchstart', this.touchstart);
		this.element.addEventListener('touchmove', this.touchmove);
		this.element.addEventListener('touchend', this.touchend);

	} else {

		this.element.addEventListener('mousedown', this.touchstart);
		document.addEventListener('mousemove', this.touchmove);
		this.element.addEventListener('mouseup', this.touchend);

	}
},

// removes all event listeners
removeListeners = function(){

	if (this.isTouchSupported) {

		this.element.removeEventListener('touchstart', this.touchstart);
		this.element.removeEventListener('touchmove', this.touchmove);
		this.element.removeEventListener('touchend', this.touchend);

	} else {

		this.element.removeEventListener('mousedown', this.touchstart);
		document.removeEventListener('mousemove', this.touchmove);
		this.element.removeEventListener('mouseup', this.touchend);

	}

},

// will fire a callback based on the current direction
fireCallback = function(){
	// need to find correct calculation for callbacks
	switch(this.direction){
		case "left":
			if (this.options.onLeft)this.options.onLeft.call(this.options.context);
		break;

		case "right":
			if(this.options.onRight) this.options.onRight.call(this.options.context);
		break;

		case "up":
			if(this.options.onUp) this.options.onUp.call(this.options.context);
		break;

		case "down":
			if(this.options.onDown) this.options.onDown.call(this.options.context);
		break;
	}
},

// will determine what is the current direction
determineDirection = function(){
	var direction;

	if (this.goingLeft === true) {
		this.direction = "left";
	} else if(this.goingRight === true){
		this.direction = "right";
	} else if(this.goingUp === true){
		this.direction = "up";
	} else if(this.goingDown === true){
		this.direction = "down";
	}

	// reset start time if direction changes
	if (this.tempDirection !== this.direction) {
		this.touchStartTime = new Date();
		this.tempDirection = this.direction;
	}

},
// will destroy all dom references
local_destroy = function(){
	removeListeners.call(this);

	this.options.context = null;
	delete this.context;

	this.element = null;
	delete this.element;

	this.options = null;
	delete this.options;
},

// ANIMATION RELATED
makeEaseOut = function(delta){
	return function(progress){
		return 1 - delta(1 - progress);
	};
},
quad = function(progress){
	return Math.pow(progress, 2);
},
easingFn = {
	quad: makeEaseOut(quad),
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TouchMove Class
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var TouchMove = function(options){

	options.speed = (typeof options.speed !== "undefined") ? options.speed : 60;

	// params only for touchMove
	this.touchStartTime = 0;
	this.touchEndTime = 0;
	this.touchMoveTime = 0;
	this.speedX = 0;
	this.speedY = 0;
	this.interval = undefined;
	this.fps = 1000/60;
	this.duration = 900;
	this.animationStarted = false;
	this.animationStartTime = 0;
	this.animationTimePassed = 0;
	this.totalTicks = 0;
	this.direction = "";
	this.tempDirection = "";
	this.goingLeft = false;
	this.goingRight = false;
	this.goingUp = false;
	this.goingDown = false;
	this.delta = 0;
	this.deacceleration = options.speed - (options.distance.toString().substring(0,3));

	bind_context(this, "animationRunLoop");

	// build class normally
	BuildClass.apply(this, arguments);
};

TouchMove.prototype = {
	constructor: TouchMove,
	touchstart: function(evt){
		this.isMouseDown = true;

		// clear timeout
		this.stopRunLoop();

		this.touchStartTime = new Date();

		// update coordinates
		getCoordinates.apply(this, arguments);
		this.currentPosX = this.touchStartPosX;
		this.currentPosY = this.touchStartPosY;

		// storing to calculate velocity
		this.startPosX = this.touchStartPosX;
		this.startPosY = this.touchStartPosY;

		// fire callback if necessary
		if (this.options.onTouchstart) this.options.onTouchstart.call(this.options.context, {startX: this.touchStartPosX, startY: this.touchStartPosY, event: evt});
	},
	touchmove: function(evt){


		// X AXIS VALUES
		var currentPositionX = getXAxisCoordinate.apply(this, arguments),
			differenceX = currentPositionX - this.touchStartPosX,

		// Y AXIS VALUES
			currentPositionY = getYAxisCoordinate.apply(this, arguments),
			differenceY = currentPositionY - this.touchStartPosY,

		// other
			shouldPreventDefault = false,
			shouldAnimate = false;


		// to determine if should animate
		this.touchMoveTime = new Date();

		// Fix for android devices when vertical scrolling is enabled
		// will prevent default based if the user has dragged the finger a considerable length
		// prevent default will fire by default if the onUp and onDown callbacks are provided.
		if (this.isTouchSupported === true && this.options.allowVerticalScrolling === true && !this.options.onUp && !this.options.onDown && config.isChrome === false) {

			shouldPreventDefault = (Math.abs(differenceX) > 10 && Math.abs(differenceY) < 25) ? true : false;

		} else {
			shouldPreventDefault = true;
		}


		// will prevent default if necessary based on the shouldPreventDefault value
		if (shouldPreventDefault === true) {
			evt.preventDefault();
		}


		// reset values
		this.goingRight = false;
		this.goingLeft = false;
		this.goingDown = false;
		this.goingUp = false;

		// if there was movement and it was longer than the specified distance
		// the left, right, top, or bottom callbacks will be invoked

		// X axis related
		if (differenceX > this.options.distance) {
			this.touchStartPosX = currentPositionX;
			this.goingRight = true;
			shouldAnimate = true;
		}
		if (differenceX * -1 > this.options.distance) {
			this.touchStartPosX = currentPositionX;
			this.goingLeft = true;
			shouldAnimate = true;
		}

		// Y axis related
		if (differenceY > this.options.distance) {
			this.touchStartPosY = currentPositionY;
			this.goingDown = true;
			shouldAnimate = true;
		}
		if (differenceY * -1 > this.options.distance) {
			this.touchStartPosY = currentPositionY;
			this.goingUp = true;
			shouldAnimate = true;
		}

		if (shouldAnimate === true) {
			determineDirection.call(this);
			fireCallback.call(this);
		}

	},
	handleVelocity: function(intX, intY){

		// acceleration related
		var distanceX = Math.abs(intX - this.startPosX) + this.deacceleration,
			distanceY = Math.abs(intY - this.startPosY) + this.deacceleration,
			touchTime = this.touchEndTime - this.touchStartTime,
			speedX = (distanceX / touchTime) * 10,
			speedY = (distanceY / touchTime) * 10,
			shouldAnimate = false;



		this.speedX = speedX;
		this.speedY = speedY;


		determineDirection.call(this);

		if (this.speedX > 1 || this.speedY > 1) {
			shouldAnimate = true;
		}

		if (shouldAnimate === true) {
			this.startRunLoop();
		}

	},
	animationRunLoop: function(){

		var progress, delta;

		if (this.animationStarted === false) {
			this.startTime = new Date();
			this.animationStarted = true;
		}

		// animation progress related
		this.totalTicks++;
		this.timePassed = new Date() - this.startTime;
		progress = this.timePassed/this.duration;

		if (progress > 1) progress = 1;

		progress = easingFn.quad(progress);

		if (this.direction == "left" || this.direction == "right") {
			delta = Math.ceil(this.speedX * progress);
		} else {
			delta = Math.ceil(this.speedY * progress);
		}

		if (this.delta != delta) {
			this.delta = delta;
			fireCallback.call(this);
		}

		if (progress === 1) this.stopRunLoop();

	},
	touchend: function(evt){

		this.touchEndTime = new Date();

		var timePassedSinceTouchMove = this.touchEndTime - this.touchMoveTime;

		var timeInSeconds = new Date(timePassedSinceTouchMove).getTime() / 1000;

		// enable momentum only if user wants to
		if (this.options.enableMomentum === true && timeInSeconds < 0.2 && this.options.speed > 0 ) {
			this.handleVelocity(this.touchStartPosX, this.touchStartPosY);
		}

		this.touchstartX = 0;
		this.touchstartY = 0;
		this.isMouseDown = false;


		if (this.options.onTouchend) this.options.onTouchend.call(this.options.context, {event: evt});
	},
	startRunLoop: function(){
		this.interval = setInterval(this.animationRunLoop, this.fps);
	},
	stopRunLoop: function(){
		clearInterval(this.interval);
		this.totalTicks = 0;
		this.animationStarted = false;
		this.direction = "";
		this.tempDirection = "";
		this.goingLeft = false;
		this.goingRight = false;
		this.goingUp = false;
		this.goingDown = false;
	}

};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TouchSwipe Class
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var TouchSwipe = function (){
	BuildClass.apply(this, arguments);
};

TouchSwipe.prototype = {
	constructor: TouchSwipe,
	alreadySwiped: false,
	touchstart: function(evt){

		// for mouse support
		this.isMouseDown = true;

		// to know if user alreadys swiped
		this.alreadySwiped = false;

		// update coordinates
		getCoordinates.apply(this, arguments);
		this.currentPosX = this.touchStartPosX;
		this.currentPosY = this.touchStartPosY;

		// fire callback if necessary
		if (this.options.onTouchstart) this.options.onTouchstart.call(this.options.context, {startX: this.touchStartPosX, startY: this.touchStartPosY, event: evt});
	},
	touchmove: function(evt){


		// stop here if user already swiped and has not lifted the finger or if the mouse button is not down
		if (this.isMouseDown === false || this.alreadySwiped === true) return;


		// X AXIS VALUES
		var currentPositionX = getXAxisCoordinate.apply(this, arguments),
			differenceX = currentPositionX - this.touchStartPosX,

		// Y AXIS VALUES
			currentPositionY = getYAxisCoordinate.apply(this, arguments),
			differenceY = currentPositionY - this.touchStartPosY,

		// other
			shouldPreventDefault = false;



		// fire callback if necessary
		if (this.options.onTouchmove) this.options.onTouchmove.call(this.options.context, {currentX: currentPositionX, currentY: currentPositionY, startX: this.touchStartPosX, startY: this.touchStartPosY, event: evt});


		// Fix for android devices when vertical scrolling is enabled
		// will prevent default based if the user has dragged the finger a considerable length
		// prevent default will fire by default if the onUp and onDown callbacks are provided.
		if (this.isTouchSupported === true && this.options.allowVerticalScrolling === true && !this.options.onUp && !this.options.onDown && config.isChrome === false) {

			shouldPreventDefault = (Math.abs(differenceX) > 10 && Math.abs(differenceY) < 25) ? true : false;

		} else {
			shouldPreventDefault = true;
		}


		// will prevent default if necessary based on the shouldPreventDefault value
		if (shouldPreventDefault === true) {
			evt.preventDefault();
		}


		// if there was movement and it was longer than the specified distance
		// the left, right, up, or down callbacks will be invoked

		// X axis related
		if (differenceX > this.options.distance) {
			this.touchStartPosX = currentPositionX;
			this.alreadySwiped = true;
			if (this.options.onRight) {
				this.options.onRight.call(this.options.context, {currentX: currentPositionX, currentY: currentPositionY, event: evt});
			}
		}
		if (differenceX * -1 > this.options.distance) {
			this.touchStartPosX = currentPositionX;
			this.alreadySwiped = true;

			if (this.options.onLeft) {
				this.options.onLeft.call(this.options.context, {currentX: currentPositionX, currentY: currentPositionY, event: evt});
			}
		}

		// Y axis related
		if (differenceY > this.options.distance) {
			this.touchStartPosY = currentPositionY;
			this.alreadySwiped = true;

			if (this.options.onDown) {
				this.options.onDown.call(this.options.context, {currentX: currentPositionX, currentY: currentPositionY, event: evt});
			}
		}
		if (differenceY * -1 > this.options.distance) {
			this.touchStartPosY = currentPositionY;
			this.alreadySwiped = true;

			if (this.options.onUp) {
				this.options.onUp.call(this.options.context, {currentX: currentPositionX, currentY: currentPositionY, event: evt});
			}
		}

	},
	// handler for the touchend event
	// will reset all values and fire optional callback
	touchend: function(evt){
		this.touchstartX = 0;
		this.touchstartY = 0;
		this.isMouseDown = false;
		this.alreadySwiped = false;

		if (this.options.onTouchend) this.options.onTouchend.call(this.options.context, {event: evt});
	}
};

/*===================================== sharing ======================================*/
// append to parent

Sense.onTouchMove = function(options){
	return new TouchMove(options);
};

Sense.onTouchSwipe = function(options){
	return new TouchSwipe(options);
};

window.Sense = Sense;

}(this, document));
