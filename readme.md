# SenseJS:


SenseJS help you determine if the user has swiped or dragged the finger over the screen. It is only 8kb so it is suitable for mobile apps.


Notes
----
- Mobile Support: Android 2.1+, iOS 3.2+, Blackberry OS 7.0+
- Desktop Browser Support: Chrome 4.0+, Firefox 3.5+, Safari 3.5+, IE 10+
- Version 1.0.1

Pending
----
- Add shake detection

&nbsp;

###### ___How to use:___


There are two methods that can be used:

* onTouchSwipe(params)
* onTouchMove(params)

Calling any of those methods will return a new instance of the detection class so you can create as many instances as you need.

Please try to store the instance on a variable so you can destroy it later to release references and release some memory.

###### ___Instantiate and release example:___

&nbsp;

```javascript
// Swipe Detection example

// IF USING SAYJS
var swipeDetection = Sense.onTouchSwipe(params);

// IF USING AS STANDALONE LIBRARY
var swipeDetection = Sense.onTouchSwipe(params);

// destroy instance
swipeDetection.destroy();
swipeDetection = null;
```

---

&nbsp;

#### Swipe Detection:

&nbsp;

```javascript
Sense.onTouchSwipe(params);

```

&nbsp;

Will be applied to the specified selector and will call the specified callbacks when it detects a swipe gesture over the element.

Method returns a new instance so you can apply it to as many elements as you want.

A set of required or optional params needs to be specified.

###### ___Parameters:___

&nbsp;

```javascript
{
	selector: "#idSelector", 				// required
	distance: 50, 							// required
	context: this,							// optional
	allowVerticalScrolling: true,			// optional
	onTouchstart: function(params){},  		// optional
	onTouchmove: function(params){},		// optional
	onTouchend: function(params){},			// optional
	onRight: function(event){}, 			// optional
	onLeft: function(event){}, 				// optional
	onUp: function(event){}, 				// optional
	onDown: function(event){} 				// optional
	
}
```

&nbsp;

###### ___Parameters description:___

**___selector:___** 

* Required parameter.
* String value.
* Css selector of the element which the detection needs to be applied to.
* Selector must be of a unique element: "#id".

**___distance:___**

* Required parameter.
* Integer value.
* Number of pixels the user needs to swipe in order to invoke the callbacks.
* User can swipe in any direction.

**___allowVerticalScrolling:___**

* Optional parameter.
* Boolean value.
* Default value is "false".
* By default the page won't scroll up or down when detecting touch events. So setting this value to true will allow the user to scroll up or down.
* This was added to workaround a Android bug.

**___onTouchstart___**

* Optional parameter.
* Is the "touchstart" handler with additional params

**___onTouchmove___**

* Optional parameter.
* Is the touchmove handler with additional params

**___onTouchend___**

* Optional Parameter
* Is the touchend handler with additional params

**___onLeft___**

* Will be called when a left swipe is detected.

**___onRight___**

* Will be called when a right swipe is detected.

**___onDown___**

* Will be called when a down swipe is detected.

**___onUp___**

* Will be called when a up swipe is detected.


###### ___Example:___

&nbsp;

```javascript
// will detect left of right swipe only
// will not use all optional params

// always store instance
var swipeInstance = Sense.onTouchSwipe({
	selector: "#gallery",
	distance: 50,
	allowVerticalScrolling: true,
	onLeft: function(event){
		
		// calling method that will update gallery
		showNextImage();
		
		// test
		alert('left swipe');
	},
	onRight: function(){
	
		// calling method that will update gallery
		showPreviousImage();
		
		// test
		alert('left swipe');
	}
	
});	
```

&nbsp;

---

&nbsp;

#### Movement Detection():

&nbsp;

```javascript

Sense.onTouchMove(params);

```

&nbsp;

Will be applied to the specified selector and will call the specified callbacks when the user moves the finger the distance specified, the callbacks will be invoked. and this will happens as many times as necessary untill the user lifts his finger. Very useful for 360 showrooms and dragging elements.

Method returns a new instance so you can apply it to as many elements as you want.

Note: Drag momevent momentum and acceleration features are in progress.

A set of required or optional params needs to be specified.

###### ___Parameters:___

&nbsp;

```javascript
{
	selector: "#idSelector", 				// required
	distance: 50, 							// required
	allowVerticalScrolling: true,			// optional
	enableMomentum: true,					// optional
	speed: 20,								// optional
	onTouchstart: function(event){},  		// optional
	onTouchend: function(event){},  		// optional
	onRight: function(event){}, 			// optional
	onLeft: function(event){}, 				// optional
	onUp: function(event){}, 				// optional
	onDown: function(event){} 				// optional
	
}
```

&nbsp;

###### ___Parameters description:___

**___selector:___** 

* Required parameter.
* String value.
* Css selector of the element which the detection needs to be applied to.
* Selector must be of a unique element: "#id".

**___distance:___**

* Required parameter.
* Integer value.
* Number of pixels the user needs to swipe in order to invoke the callbacks.
* User can swipe in any direction.

**___allowVerticalScrolling___**

* Optional parameter.
* Boolean value.
* Will allow the page to be scrolled up or down only if there are no onUp or onDown callbacks specified.

**___enableMomentum___**

* Optional parameter.
* Boolean Value
* Will continue calling the callbacks based on the swipe speed

**___speed___**

* Optional parameter.
* Integer value.
* Will affect the speed of the momentum.

**___onRight___**

* Will be called when a right finger movement is detected.
* Receives event object.

**___onLeft___**

* Will be called when a left finger movement is detected.
* Receives event object.

**___onUp___**

* Will be called when a up finger movement is detected.
* Receives event object.

**___onDown___**

* Will be called when a down finger movement is detected.
* Receives event object.


###### ___Example:___

&nbsp;

```javascript
// will detect left of right fingerMovement only
// will not use all optional params

// always store instance
var dragInstance = Sense.detectMovement({
	selector: "#gallery",
	distance: 50,
	enableMomentum: true,
	speed: 50,
	leftMove: function(event){
		
		// calling method that will update gallery
		next360Image();
		
		// test
		alert('left move');
	},
	rightMove: function(){
	
		// calling method that will update gallery
		previous360Image();
		
		// test
		alert('right move');
	}
	
});	
```

---

&nbsp;

&nbsp;




+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	Created by Ian Calderon for Say Media.

+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	


