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
        $scope.currentTime = new Date().toISOString();
        var defaultTime = moment().add(2, 'hours').toDate();
        $scope.newTask = {
            duetime: defaultTime,
            distance: (Math.random() * 10).toFixed(2)
        }

        $scope.addTask = function (task) {
            //console.log('submit')


            task.duetime = task.duetime.valueOf();
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
    }).controller('ActiveTaskCtrl', function ($state,$ionicActionSheet, $ionicModal, $ionicPopover, $ionicHistory, $ionicNavBarDelegate, $rootScope, $scope, $ionicPopup, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, Tasks) {
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

        $scope.openPopover = function() {

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                //buttons: [
                //    { text: 'edit' }
                //],
                destructiveText: 'Cancel task',
                //titleText: 'Modify your album',
                cancelText: 'back',
                cancel: function() {
                    // add cancel code..
                },
                buttonClicked: function(index) {
                    return true;
                },
                destructiveButtonClicked: function(){
                    $scope.cancelTask();
                }
            });

            // For example's sake, hide the sheet after two seconds
            $timeout(function() {
                hideSheet();
            }, 2000);

        };

        //$ionicPopover.fromTemplateUrl('task_options.html', {
        //    scope: $scope
        //}).then(function(popover) {
        //    $scope.popover = popover;
        //});
        //$scope.openPopover = function($event) {
        //    console.log('pop');
        //    $scope.popover.show($event);
        //};
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
                //$state.go('app.tasks.list');
            });
        });

        $scope.$on('onPrice', function () {
            var approvalPopup = $ionicPopup.confirm({
                title: 'Price approval',
                template: 'Approve purchase price of $' + $scope.task.price + '?',
                cancelText: "No",
                okText: "Yes"
            });
            approvalPopup.then(function (res) {
                if(res){
                    Tasks.approvePrice();
                }else{
                    Tasks.rejectPrice();
                }
            });
        });
        $scope.approvePrice = function(){
            Tasks.approvePrice();
        }
        $scope.rejectPrice = function(){
            Tasks.rejectPrice();
        }

        $scope.approval_status = ['Rejected', 'Pending', 'Approved'];

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
            else if (index !== $scope.task.stage) {
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
                template: 'Canceling a task will forfeit reward or incur penalty',
                cancelText: "No",
                okText: "Yes"
            });
            confirmPopup.then(function (res) {
                if (res) {
                    Tasks.cancel($scope.task);
                    $state.go('app.tasks.list');
                }
            });
        }

        $scope.completeTask = function(){
            //Tasks.complete($scope.task);
            Tasks.confirm($scope.task);
            $scope.completion_modal.hide();
        }
        $scope.dismissTask = function(){
            Tasks.mine.task = null;
            $state.go('app.tasks.list');
        }
        $ionicModal.fromTemplateUrl('report-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.report_modal = modal;
        });
        $ionicModal.fromTemplateUrl('completion-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.completion_modal = modal;
        });
        $scope.closeModal = function() {
            $scope.completion_modal.hide();
        };
        $scope.openModal = function() {
            $scope.completion_modal.show();
        };

        $scope.reportUser = function(){
            $scope.report_modal.show();
        }
        $scope.closeReportModal = function() {
            $scope.report_modal.hide();
        };
        $scope.submitReport = function(report){
            console.log('reporting');
            $scope.report_modal.hide();
            $scope.completion_modal.hide();
            //Tasks.mine.task.status = "In review";
            Tasks.report();
        }

        $scope.updatePrice = function(price){
            if($scope.task.budget[0] <= price && price <= $scope.task.budget[1]){
                // auto approves
                Tasks.approvePrice();
            }else{
                // send for approval
                Tasks.setPrice(price);
            }
        }
    }).directive('momentCountdown', function (
        $window,
        $timeout
    ) {
        var dateTypes = [
            'year',
            'month',
            'day',
            'hour',
            'minute',
            'second',
            'millisecond'
        ];

        function getDuration (time) {
            var diff = $window.moment(time).diff();

            return $window.moment.duration(diff);
        }

        function getDurationObject (time) {
            var duration = getDuration(time);
            var durationObject = {};

            angular.forEach(dateTypes, function (type) {
                var typeVal = duration[type + 's']();
                if (typeVal) {
                    durationObject[type] = typeVal;
                }
            });

            return durationObject;
        }

        return {
            restrict: 'EA',
            controller: function ($scope, $element, $attrs) {
                var self = this;
                var interval = $attrs.momentInterval || 1000;

                $attrs.$observe('moment', function (time) {
                    self.countdown = getDurationObject(time);

                    function countdown () {
                        $timeout(function () {
                            self.countdown = getDurationObject(time);

                            countdown();
                        }, interval);
                    }

                    countdown();
                });
            },
            controllerAs: 'moment'
        };
    });
;
