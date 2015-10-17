/* global angular, document, window */
'use strict';

angular.module('starter.services', ['firebase'])
    .factory('Tasks', function (Bros, $firebaseArray, $rootScope) {
        var TaskRef = new Firebase("https://broapp.firebaseio.com/tasks");
        var taskArr = $firebaseArray(TaskRef);
        var openArr = $firebaseArray(TaskRef.orderByChild('status').equalTo('open'));
        var historyArr = $firebaseArray(TaskRef.orderByChild('status').equalTo('completed'));
        var mine = {
            task: null
        };
        var listener = undefined;
        taskArr.$watch(function (event) {
            console.log(event);
            if (event.event == 'child_removed') {
                console.log('removed', event.key);
                if ((mine.task && mine.task.$id == event.key)) {
                    if (mine.task.bro.id !== $rootScope.user.id)
                        $rootScope.$broadcast('cancelled');
                    mine.task = null;
                }
            }
            if (event.event == 'child_changed') {
                console.log('changed', event.key);
                //if ((mine.task && mine.task.$id == event.key)) {
                //    //mine.task = null;
                //    var task = taskArr.$getRecord(event.key);
                //    $rootScope.$broadcast('completed');
                //    updateActive();
                //}
            }
            if (event.event == "child_added") {
                console.log('added', event.key);
                updateActive(event);
            }
            if (listener) {
                listener();
            }
        });

        function updateActive(event) {
            if (!mine.task) {
                if (event) {
                    var task = taskArr.$getRecord(event.key);
                    if (task.status != 'completed') {
                        //console.log('adding task', task);
                        if ($rootScope.user && (task.bro.id == $rootScope.user.id || (task.savior && task.savior.id == $rootScope.user.id))) {
                            mine.task = task;
                        }
                    }
                } else {
                    taskArr.forEach(function (task) {
                        if (task.status != 'completed') {
                            //console.log('updating task', task);
                            if ($rootScope.user && (task.bro.id == $rootScope.user.id || (task.savior && task.savior.id == $rootScope.user.id))) {
                                mine.task = task;
                            }
                        }
                    });
                }
            }
        }

        return {
            all: taskArr,
            opened: openArr,
            history: historyArr,
            mine: mine,
            update: function () {
                updateActive();
            },
            add: function (new_task) {
                console.log('added');
                if (new_task.status) {
                    new_task.date = Firebase.ServerValue.TIMESTAMP;
                    taskArr.$add(new_task);
                }
            },
            get: function (key) {
                return taskArr.$getRecord(key);
            },
            setActive: function (activeTask) {
                activeTask.status = 'active';
                activeTask.savior = $rootScope.user;
                taskArr.$save(activeTask);
                mine.task = activeTask;
            },
            cancel: function (task) {
                if ($rootScope.user && task.bro.id == $rootScope.user.id) {
                    taskArr.$remove(task);
                } else {
                    task.status = 'open';
                    task.savior = null;
                    mine.task = null;
                    taskArr.$save(task);
                }
            },
            confirm: function (task) {
                if(task.bro.id == $rootScope.user.id) {
                    task.bro.confirmed = true;
                }else{
                    task.savior.confirmed = true;
                }
                if(task.savior.confirmed  && task.bro.confirmed ){
                    task.status = 'completed';
                }
                taskArr.$save(task);
            },
            save: function (task) {
                taskArr.$save(task);
            },
            addMessage: function (task, message) {
                if (!task.messages)
                    task.messages = [];
                delete task.message;
                task.messages.push(message);
                taskArr.$save(task);
            },
            $watch: function (cb) {
                listener = cb;
            }
        };
    })
    .factory('Bros', function ($firebaseArray) {
        var BrosRef = new Firebase("https://broapp.firebaseio.com/bros");
        var BrosArr = $firebaseArray(BrosRef);

        return {
            all: BrosArr,
            get: function (i) {
                return BrosArr.$getRecord(BrosArr.$keyAt(i));
            }
        };
    })

    .factory('History', function (Bros) {
        var taskHistories = [
            {
                id: 1,
                requestedBy: Bros.get(2),
                task: "HELP! Can anyone get me some flowers?",
                budget: [10, 20],
                reward: 10,
                completedBy: Bros.get(3),
                dateCompleted: 1413020671
            }, {
                id: 2,
                requestedBy: Bros.get(2),
                task: "Can anyone help me buy a cake please? Chocolate flavor will be great!",
                budget: [40, 60],
                reward: 25,
                dateCompleted: 1413020671,
                completedBy: Bros.get(3)
            },
            {
                id: 3,
                requestedBy: Bros.get(2),
                task: "Drive me somewhere! ",
                budget: [40, 60],
                reward: 25,
                dateCompleted: 1413020671,
                completedBy: Bros.get(1)
            },
            {
                id: 4,
                requestedBy: Bros.get(3),
                task: "Drive me somewhere! ",
                budget: [40, 60],
                reward: 25,
                dateCompleted: 1413020671,
                completedBy: Bros.get(2)
            }
        ];
        return {
            all: taskHistories,
            getMyRequest: function (i) {
                // get list of tasks requested by user (i)
                var myRequests = [];
                taskHistories.forEach(function (taskHistories) {
                    if (taskHistories.requestedBy == Bros.get(i))
                        myRequests.push(taskHistories);
                });
                return myRequests;
            },

            getRequestByOthers: function (i) {
                // get list of tasks requested by user (i)
                var otherRequests = [];
                taskHistories.forEach(function (taskHistories) {
                    if (taskHistories.completedBy == Bros.get(i))
                        otherRequests.push(taskHistories);
                });
                return otherRequests;

            }
        };
    })
    .factory('Reset', function (Bros, $firebaseArray) {
        var BrosRef = new Firebase("https://broapp.firebaseio.com/bros");
        var BrosArr = $firebaseArray(BrosRef);
        var bros = [
            {
                id: 1,
                name: 'Jia Jing',
                points: '100',
                rank: 'Noob Bro',
                display_pic: 'img/jj.jpg'
            },
            {
                id: 2,
                name: 'Sebastian',
                points: '240',
                rank: 'Super Bro',
                display_pic: 'img/derrick.png',
                map: 'img/map-Sebastian.jpg'
            },
            {
                id: 3,
                name: 'Joshua',
                points: '780',
                rank: 'Big Bro',
                display_pic: 'img/chan.png',
                map: 'img/map-Joshua.jpg'
            }
        ];
        var TaskRef = new Firebase("https://broapp.firebaseio.com/tasks");
        var TaskArr = $firebaseArray(TaskRef);
        var tasks = [
            {
                id: 1,
                bro: bros[0],
                task: "HELP! Can anyone get me some flowers?",
                hasPurchase: true,
                budget: [10, 20],
                date: moment().subtract(5, 'minutes').valueOf(),
                reward: 10,
                status: 'open',
                savior: null,
                distance: 2,
                messages: []
            }, {
                id: 2,
                bro: bros[1],
                task: "Can anyone help me buy a cake please? Chocolate flavor will be great!",
                hasPurchase: true,
                budget: [40, 60],
                reward: 25,
                // open, active, completed
                status: 'open',
                savior: null,
                distance: 8,
                date: moment().subtract(2, 'minutes').valueOf(),
                messages: []
            }, {
                id: 3,
                bro: bros[2],
                task: "I need a Bro to take care of our pet dog tonight!",
                hasPurchase: false,
                //budget: [40, 60],
                reward: 50,
                // open, active, completed
                status: 'completed',
                savior: bros[1],
                distance: 6,
                date: moment().valueOf(),
                messages: []
            }, {
                id: 4,
                bro: bros[0],
                task: "Can someone help buy a gift for my girlfriend",
                hasPurchase: true,
                budget: [50, 70],
                reward: 30,
                // open, active, completed
                status: 'completed',
                savior: bros[2],
                distance: 4,
                date: moment().valueOf(),
                messages: []
            }
        ];

        return {
            reset: function () {
                TaskRef.set({});
                for (var i = 0; i < tasks.length; i++) {
                    TaskArr.$add(tasks[i]);
                }
                BrosRef.set({});
                for (var i = 0; i < bros.length; i++) {
                    BrosArr.$add(bros[i]);
                }
            }
        };
    })
    .factory('User', function ($rootScope, Tasks) {
        var me = {};
        return {
            login: function (bro) {
                me = bro;
                $rootScope.user = bro;
                Tasks.update();
            },
            current: me
        };
    });
;
