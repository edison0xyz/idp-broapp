/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $ionicPopover, $timeout, $state, $ionicPopup) {
        // Form data for the login modal
        $scope.loginData = {};
        $scope.isExpanded = false;
        $scope.hasHeaderFabLeft = false;
        $scope.hasHeaderFabRight = false;

        var navIcons = document.getElementsByClassName('ion-navicon');
        for (var i = 0; i < navIcons.length; i++) {
            navIcons.addEventListener('click', function () {
                this.classList.toggle('active');
            });
        }

        ////////////////////////////////////////
        // Layout Methods
        ////////////////////////////////////////

        $scope.hideNavBar = function () {
            document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
        };

        $scope.showNavBar = function () {
            document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
        };

        $scope.noHeader = function () {
            var content = document.getElementsByTagName('ion-content');
            for (var i = 0; i < content.length; i++) {
                if (content[i].classList.contains('has-header')) {
                    content[i].classList.toggle('has-header');
                }
            }
        };

        // A confirm dialog
        $scope.showLogoutConfirmation = function () {

            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure you want to log out?',
                template: 'We hate to see you go.',
                okText: 'yes',
                cancelText: 'no'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $state.go('login');

                } else {

                }
            });
        };

        $scope.setExpanded = function (bool) {
            $scope.isExpanded = bool;
        };

        $scope.setHeaderFab = function (location) {
            var hasHeaderFabLeft = false;
            var hasHeaderFabRight = false;

            switch (location) {
                case 'left':
                    hasHeaderFabLeft = true;
                    break;
                case 'right':
                    hasHeaderFabRight = true;
                    break;
            }

            $scope.hasHeaderFabLeft = hasHeaderFabLeft;
            $scope.hasHeaderFabRight = hasHeaderFabRight;
        };

        $scope.hasHeader = function () {
            var content = document.getElementsByTagName('ion-content');
            for (var i = 0; i < content.length; i++) {
                if (!content[i].classList.contains('has-header')) {
                    content[i].classList.toggle('has-header');
                }
            }

        };

        $scope.hideHeader = function () {
            $scope.hideNavBar();
            $scope.noHeader();
        };

        $scope.showHeader = function () {
            $scope.showNavBar();
            $scope.hasHeader();
        };

        $scope.clearFabs = function () {
            var fabs = document.getElementsByClassName('button-fab');
            if (fabs.length && fabs.length > 1) {
                fabs[0].remove();
            }
        };

        $scope.isView = function (viewName) {
            return $state.is(viewName);
        }
        console.log('appctrl')
    })

    .controller('LoginCtrl', function ($scope, $timeout, $stateParams, ionicMaterialInk, Bros, Reset, User, $state) {
        //$scope.$parent.clearFabs();
        //$timeout(function () {
        //    $scope.$parent.hideHeader();
        //}, 0);
        ionicMaterialInk.displayEffect();
        $scope.bros = Bros.all;
        $scope.loginAs = function (bro) {
            User.login(bro);
            $state.go('app.tasks.list');
        }
        $scope.reset = function () {
            Reset.reset();
        }
    })

    //.controller('BrosCtrl', function ($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    //    // Set Header
    //    $scope.$parent.showHeader();
    //    $scope.$parent.clearFabs();
    //    $scope.$parent.setHeaderFab('left');
    //
    //    // Delay expansion
    //    $timeout(function () {
    //        $scope.isExpanded = true;
    //        $scope.$parent.setExpanded(true);
    //    }, 300);
    //
    //    // Set Motion
    //    ionicMaterialMotion.fadeSlideInRight();
    //
    //    // Set Ink
    //    ionicMaterialInk.displayEffect();
    //})

    .controller('HistoryCtrl', function ($scope,$ionicTabsDelegate,$stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, Tasks) {
        // Set Header
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.$parent.setHeaderFab('left');

        // Delay expansion
        // $timeout(function () {
        //     $scope.isExpanded = true;
        //     $scope.$parent.setExpanded(true);
        // }, 300);

        // Set Motion
        ionicMaterialMotion.fadeSlideInRight();

        // Set Ink
        ionicMaterialInk.displayEffect();
        //
        //$scope.myRequests = History.getMyRequest(2);
        //$scope.otherRequests = History.getRequestByOthers(2) ;

        $scope.histories = Tasks.history;
        $scope.activeTask = Tasks.mine;
        console.log($scope.activeTask);

        $scope.gotoActive = function(){
            $ionicTabsDelegate.select(1);
        }


    })

    .controller('ProfileCtrl', function ($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $rootScope) {
        // Set Header
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        $scope.user = $rootScope.user;
        // Set Motion
        $timeout(function () {
            ionicMaterialMotion.slideUp({
                selector: '.slide-up'
            });
        }, 300);

        $timeout(function () {
            ionicMaterialMotion.fadeSlideInRight({
                startVelocity: 3000
            });
        }, 700);

        // Set Ink
        ionicMaterialInk.displayEffect();
    })

    .controller('ActivityCtrl', function ($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
        $scope.$parent.showHeader();
        $scope.$parent.noHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
        $scope.$parent.setHeaderFab('right');

        $timeout(function () {
            ionicMaterialMotion.fadeSlideIn({
                selector: '.animate-fade-slide-in .item'
            });
        }, 200);

        // Activate ink for controller
        ionicMaterialInk.displayEffect();
    })

    //.controller('GalleryCtrl', function ($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    //    //$scope.$parent.showHeader();
    //    $scope.$parent.clearFabs();
    //    $scope.isExpanded = false;
    //    $scope.$parent.setExpanded(false);
    //    $scope.$parent.setHeaderFab(false);
    //
    //    // Activate ink for controller
    //    ionicMaterialInk.displayEffect();
    //
    //    ionicMaterialMotion.pushDown({
    //        selector: '.push-down'
    //    });
    //    ionicMaterialMotion.fadeSlideInRight({
    //        selector: '.animate-fade-slide-in .item'
    //    });
    //
    //})
    //.controller('MainCtrl', function ($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    //    // Set Header
    //    //$scope.$parent.noHeader();
    //    $scope.$parent.clearFabs();
    //    $scope.isExpanded = false;
    //    $scope.$parent.setExpanded(false);
    //    $scope.$parent.setHeaderFab(false);
    //
    //    // Set Motion
    //    $timeout(function () {
    //        ionicMaterialMotion.slideUp({
    //            selector: '.slide-up'
    //        });
    //    }, 300);
    //
    //    $timeout(function () {
    //        ionicMaterialMotion.fadeSlideInRight({
    //            startVelocity: 3000
    //        });
    //    }, 700);
    //
    //    // Set Ink
    //    ionicMaterialInk.displayEffect();
    //})
    .controller('BroHelpCtrl', function ($scope, $state, $ionicHistory, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, Tasks) {
        //$scope.$parent.showHeader();
        $scope.$parent.noHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab('right');

        $timeout(function () {
            ionicMaterialMotion.fadeSlideIn({
                selector: '.animate-fade-slide-in .item'
            });
        }, 200);

        // Activate ink for controller
        ionicMaterialInk.displayEffect();
        $scope.activeTask = Tasks.mine;

        if ($scope.activeTask.task) {
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            console.log('brohelpctrl to active');
            $state.go('app.tasks.active');
        } else {
            $scope.tasks = Tasks.opened;
        }
        //$scope.tasks.$watch(function(){
        Tasks.$watch(function () {
            $timeout(function () {
                ionicMaterialMotion.fadeSlideIn({
                    selector: '.animate-fade-slide-in .item'
                });
            }, 100);
        });

        console.log('brohelpctrl');
    })
    .controller('TaskCtrl', function ($scope, $state, $stateParams, $timeout, $ionicPopup, ionicMaterialMotion, ionicMaterialInk, Tasks) {
        //$scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab('right');

        $timeout(function () {
            ionicMaterialMotion.fadeSlideIn({
                selector: '.animate-fade-slide-in .item'
            });
        }, 100);

        // Activate ink for controller
        ionicMaterialInk.displayEffect();
        $scope.task = Tasks.get($stateParams.id);

        // A confirm dialog
        $scope.showConfirm = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm',
                template: 'Are you sure you want to help this bro?',
                cancelText: "No",
                okText: "Yes"
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $scope.acceptTask();
                } else {
                    console.log('You are not sure');
                }
            });
        };

        $scope.acceptTask = function () {
            Tasks.setActive($scope.task);
            $state.go('app.tasks.active');
        }
    })
    .controller('NewTaskCtrl', function ($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk,
                                         Bros, $rootScope, Tasks, $ionicPopup, $state) {
        //$scope.$parent.showHeader();
        //$scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab('right');

        $timeout(function () {
            ionicMaterialMotion.fadeSlideIn({
                selector: '.animate-fade-slide-in .item'
            });
        }, 200);

        // Activate ink for controller
        ionicMaterialInk.displayEffect();

        $scope.addTask = function (task) {
            task.bro = $rootScope.user;
            task.status = "open";
            task.date = new Date();
            Tasks.add(task);
            var alertPopup = $ionicPopup.alert({
                title: 'Task request sent',
                template: 'Awaiting for your true bro...'
            });
            alertPopup.then(function (res) {
                $state.go('app.tasks.active');
            });
        }
    }).controller('ActiveTaskCtrl', function ($state, $ionicHistory, $ionicNavBarDelegate, $rootScope, $scope, $ionicPopup, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, Tasks) {
        //$scope.$parent.showHeader();
        $scope.$parent.noHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab('right');
        $ionicNavBarDelegate.showBackButton(false);
        $timeout(function () {
            ionicMaterialMotion.fadeSlideIn({
                selector: '.animate-fade-slide-in .item'
            });
        }, 200);
        var updateElapsed = function () {
            $timeout(function () {
                if ($scope.task) {

                    $scope.elasped = moment().diff($scope.task.date);
                }
                updateElapsed();
            }, 1000);
        };

        if (!Tasks.mine.task) {
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            console.log('activectrl to list');
            $state.go('app.tasks.list');
        } else {
            $scope.task = Tasks.mine.task;
            var title = $scope.task.bro.id == $rootScope.user.id ? 'My request' : 'My Task';
            console.log(title)
            $ionicNavBarDelegate.title(title);
        }
        // Activate ink for controller
        ionicMaterialInk.displayEffect();
        $scope.$on('cancelled', function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Task cancelled',
                template: 'The requester has cancelled this task'
            });
            alertPopup.then(function (res) {
                //Tasks.cancel($scope.task);
                $state.go('app.tasks.list');
            });
        });
        if ($scope.task && $scope.task.hasPurchase) {
            $scope.stages = [
                "Task started",
                "Item purchased",
                "Item delivered"
            ];
        } else {
            $scope.stages = [
                "Task started",
                "Task completed"
            ];
        }
        updateElapsed();
        $scope.setStage = function (index) {
            index += 1;
            if (!$scope.task.stage)
                $scope.task.stage = 1;
            else if ($scope.task.stage < $scope.stages.length && index !== $scope.task.stage) {
                if ($scope.task.stage < index)
                    $scope.task.stage += 1;
                else
                    $scope.task.stage = index
            }
            Tasks.save($scope.task);
        }
        $scope.addMessage = function (task) {
            Tasks.addMessage($scope.task, {user: $rootScope.user, message: task.message});
            task.message = "";
        }

        $scope.cancelTask = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure?',
                template: 'Canceling a task will forfeit reward or incur penalty'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    Tasks.cancel($scope.task);
                    $state.go('app.tasks.list');
                }
            });
        }

        $scope.completeTask = function(){
            Tasks.complete($scope.task);
            $state.go('app.tasks.list');
        }
        console.log('activectrl');

    })
;
