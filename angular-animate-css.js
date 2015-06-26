/**
 * Created by Ivo on 25.06.2015.
 */
angular.module('ngAnimateCss', []).directive('animate', function () {

    // css class templates
    var animationContent = '-webkit-animation: {{animation}} {{duration}};-moz-animation: {{animation}} {{duration}};-ms-animation: {{animation}} {{duration}};-o-animation: {{animation}} {{duration}};animation: {{animation}} {{duration}};';
    var stagingContent = '-webkit-transition-delay: {{staging}};-moz-transition-delay: {{staging}};-ms-transition-delay: {{staging}};-o-transition-delay: {{staging}};transition-delay: {{staging}};-webkit-transition-duration: 0s;-moz-transition-duration: 0s;-ms-transition-duration: 0s;-o-transition-duration: 0s;transition-duration: 0s;';
    var transitionContent = '-webkit-transition: {{duration}} linear all;-moz-transition: {{duration}} linear all;-ms-transition: {{duration}} linear all;-o-transition: {{duration}} linear all;transition: {{duration}} linear all;';
    var defaultAnimationContent = '@-webkit-keyframes default-animation {0% {opacity: 0;-webkit-transform: scale3d(.3, .3, .3);transform: scale3d(.3, .3, .3);}50% {opacity: 1;}}@keyframes default-animation {0% {opacity: 0;-webkit-transform: scale3d(.3, .3, .3);transform: scale3d(.3, .3, .3);}50% {opacity: 1;}}.default-animation {-webkit-animation-name: default-animation;animation-name: default-animation;}';
    var opacityZero = 'opacity:0;';
    var opacityOne = 'opacity:1;';
    var DEFAULT_ANIMATION = 'default-animation';

    function link(scope, element, attrs) {
        // attributes that should be visible on the whole module
        var angularDirectiveType, mainCssClass;

        //####################################################################################################
        //################################### DOM UTILS ######################################################
        //####################################################################################################
        // get all css classes
        function getAllSelectors() {
            var ret = [];
            for (var i = 0; i < document.styleSheets.length; i++) {
                var rules = document.styleSheets[i].rules || document.styleSheets[i].cssRules;
                for (var x in rules) {
                    if (typeof rules[x].selectorText === 'string') {
                        ret.push(rules[x].selectorText);
                    }
                }
            }
            return ret;
        }

        //check if class already exists
        function selectorExists(selector) {
            var selectors = getAllSelectors();
            for (var i = 0; i < selectors.length; i++) {
                if (selectors[i] === selector) {
                    return true;
                }
            }
            return false;
        }

        // add a newly created css class to the head of the HTML Doc
        // http://stackoverflow.com/questions/1720320/how-to-dynamically-create-css-class-in-javascript-and-apply
        function createClass(styleContent) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = styleContent;
            document.getElementsByTagName('head')[0].appendChild(style);
        }

        //####################################################################################################
        //####################################################################################################
        //####################################################################################################

        // retrieve the correct angular attribute if present
        // this is used later on to anticipate the correct behaviour
        function getAngularDirective(attrs) {
            if (attrs.ngHide) {
                return 'ng-hide';
            } else if (attrs.ngShow) {
                return 'ng-show';
            } else if (attrs.ngIf) {
                return 'ng-if';
            } else if (attrs.ngRepeat) {
                return 'ng-repeat';
            } else if (attrs.ngView) {
                return 'ng-view';
            } else if (attrs.ngInclude) {
                return 'ng-include';
            } else if (attrs.ngSwitch) {
                return 'ng-switch';
            }
            return undefined;
        }


        // Creates a list of css class names and content which will be later on added to the DOM
        function getCssClassList(angularDirectiveType) {
            var cssClassList = [];
            var fullMainCssClass = '.' + mainCssClass;
            var cssClassContent = animationContent;

            //Always add default empty class
            cssClassList.push({name: fullMainCssClass, content: ''});

            switch (angularDirectiveType) {
                case 'ng-show':
                case 'ng-hide':
                    cssClassList.push({name: fullMainCssClass + '.ng-hide-remove', content: generateCssClassContent(cssClassContent)});
                    cssClassList.push({name: fullMainCssClass + '.ng-hide-add', content: generateCssClassContent(cssClassContent, true)});
                    break;
                case 'ng-if':
                case 'ng-view':
                case 'ng-include':
                case 'ng-switch':
                    cssClassList.push({name: fullMainCssClass + '.ng-enter', content: generateCssClassContent(cssClassContent)});
                    cssClassList.push({name: fullMainCssClass + '.ng-leave', content: generateCssClassContent(cssClassContent, true)});
                    break;
                case 'ng-repeat':
                    cssClassList.push({name: fullMainCssClass + '.ng-enter', content: generateCssClassContent(transitionContent)});
                    cssClassList.push({name: fullMainCssClass + '.ng-leave', content: generateCssClassContent(transitionContent, true)});
                    cssClassList.push({
                        name: fullMainCssClass + '.ng-enter.ng-enter-active' + ', ' + fullMainCssClass + '.ng-move.ng-move-active',
                        content: generateCssClassContent(cssClassContent) + opacityOne
                    });
                    cssClassList.push({
                        name: fullMainCssClass + '.ng-leave.ng-leave-active',
                        content: generateCssClassContent(cssClassContent, true) + opacityZero
                    });
                    if (attrs.staging) {
                        cssClassList.push({
                            name: fullMainCssClass + '.ng-enter-stagger' + ',' +
                            fullMainCssClass + '.ng-leave-stagger' + ',' +
                            fullMainCssClass + '.ng-move-stagger',
                            content: generateCssClassContent(stagingContent)
                        });

                        cssClassList.push({
                            name: fullMainCssClass + '.ng-enter' + ', ' + fullMainCssClass + '.ng-move' + ', ' + fullMainCssClass + '.ng-leave.ng-leave-active',
                            content: opacityZero
                        });

                        cssClassList.push({
                            name: fullMainCssClass + '.ng-leave',
                            content: opacityOne
                        });
                    }

                break;
            }
            return cssClassList;
        }


        // generate the final css class content by injecting the scope attributes to as string template
        // the directive's attributes have prios
        function generateCssClassContent(template, outAnimation) {
            if (template) {
                var cssClass = angular.copy(template);
                var animation;
                if (outAnimation && attrs.animateOut) {
                    animation = attrs.animateOut;
                } else if (attrs.animateIn) {
                    animation = attrs.animateIn;
                } else if (attrs.animate) {
                    animation = attrs.animate;
                } else {
                    animation = DEFAULT_ANIMATION;
                }

                cssClass = cssClass.replace(/\{\{animation\}\}/g, animation);
                cssClass = cssClass.replace(/\{\{duration\}\}/g, attrs.duration + 'ms');
                cssClass = cssClass.replace(/\{\{staging\}\}/g, attrs.staging + 'ms');
                return cssClass;
            }
            return '';
        }


        // use the class names and class content to gen a string that contains both lists
        function createClasses(cssClassList) {
            if (cssClassList && cssClassList.length > 0) {
                var classListStr = '';
                for (var i = 0; i < cssClassList.length; i++) {
                    classListStr += cssClassList[i].name + '{' + cssClassList[i].content + '}';
                }
                createClass(classListStr);
            }
        }


        // creates a class name based on the entered attributes
        // if you are using the same setup multiple times the name will be the same
        // and the class would not need to be generated and added to the DOM again
        function generateMainCssClassName() {
            var className = angularDirectiveType;
            className += attrs.animate ? '-' + attrs.animate : '';
            className += attrs.animateIn ? '-' + attrs.animateIn : '';
            className += attrs.animateOut ? '-' + attrs.animateOut : '';
            className += attrs.duration ? '-' + attrs.duration : '';
            className += attrs.staging ? '-' + attrs.staging : '';

            return className;
        }

        // initialize default value if not done
        function setDefaults() {
            if (!attrs.duration) {
                attrs.duration = 300;
            }
            if (!attrs.animate) {
                attrs.animate = DEFAULT_ANIMATION;
                // create default animation (zoomIn from animate.css)
                if (!selectorExists('.' + DEFAULT_ANIMATION)) {
                    createClass(defaultAnimationContent);
                }
            }
        }


        // main function which applies that adds the appropriate css class to the current element
        function setAnimation() {
            // check if element contains a expected angular attribute
            if (angularDirectiveType = getAngularDirective(attrs)) {
                setDefaults();
                // gen a ccs class
                mainCssClass = generateMainCssClassName();
                // check if the css class already exists
                if (!selectorExists('.' + mainCssClass)) {
                    // create all necessary classes for the used ng attribute (e.g. ng-show)
                    var cssClassList = getCssClassList(angularDirectiveType);
                    createClasses(cssClassList);
                }
                element.addClass(mainCssClass);
            }
        }

        setAnimation();
    }

    return {
        priority: 0,
        restrict: 'A',
        scope: {
            animateIn: '=',
            animateOut: '=',
            duration: '=',
            staging: '='
        },
        link: link
    };
});