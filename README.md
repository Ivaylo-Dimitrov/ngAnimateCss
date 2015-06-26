# ngAnimateCss
Creates and appends css animations to AngularJS directives (ng-show, ng-if, ...) with one single html attribute.
This is a small project that helps you to easily add css animations to you AngularJS application.  

# Demo
Will follow when I have some time.

## How does it work?
```html
<div ng-show="delayed" animate></div>
```
In this case the default animation "zoomIn" with be applied to the div when $scope.delayed evaluates to true.

```html
<ul>
  <li ng-repeat="item in list" animate duration="300" staging="150"></li>
</ul
```
Will animate the ng-repeat items. The animation for each element will take 300ms to finish and there will be a statging (delay) for each element of 150ms

Available options:
+ __animate__ - inits the directive, if you pass no value the directive will use the default animation "zoomIn". Adding an animation is the intended use: ```html animate="fadeIn" ``` (The "fadeIn" animatin needs to be declared by you or e.g. by animate.css)
+ __animate-in__ - ```(optional)``` if you want to use a particular animatation for the entering event. Default the animation of "animate" will be used.
+ __animate-out__ - ```(optional)``` if you want to use a particular animatation for the leaving event. Default the animation of "animate" will be used. 
+ __duration__ - ```(optional)``` how long should be animated in ms. Default 300ms.
+ __staging__ - ```(optional)``` works only on ng-repeat with AngularJS >=1.4. Will display the items with a delay (in ms).

# Install
Use [animate.css](http://daneden.github.io/animate.css/) or create your own css animations
+ Add animate.css, angular, angular-animate, __angular-animate-css__ (ngAnimateCss = this directive)
+ Add ngAnimateCss to the dependancies of you angular module
 
E.g.:
```html
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.3.0/animate.css">
</head>
	<body ng-app="YourApp">
	<div ng-controller="YourController">
      <h1 ng-show="displayTitle" animate="bounce" duration="500"></h1> 
	</div>
	<script src="/vendor/js/angular.js"></script>
	<script src="/vendor/js/angular-animate.js"></script>
	<script src="/vendor/js/angular-animate-css.js"></script>
	<script>

		// Include app dependency on ngMaterial
		angular.module( 'app', [ 'ngAnimate', 'ngAnimateCss' ] )
			.controller("YourController", function ($scope, $timeout){
			  // angular doesn't show animations when the module is directly initialized
			  // that is why we need to wait a little bit
			  $timeout(function(){
			    $scope.displayTitle = true;
			  });
			});

	</script>
</body>
</html>
```

## Supported Angular directives
At this point these angular directives are supported (others will follow):
+ ng-hide / ng-show
+ ng-include
+ ng-if
+ ng-view
+ ng-switch
+ ng-repeat


## Why not use the default Angular animation?
1. You always need to look up that happens on which state of the animation and you also have to check what is the correct enter and leave css class for the currently used directive.
2. Once you know what is needed to create the correct animation you want to add the browser support and that again requires a google search
3. In the end you have everything you need and the result is a 20 to 50 lines of css

This annoying and costs you a lot of time. That is the reason why I created a small directive that does all of this stuff for you.


