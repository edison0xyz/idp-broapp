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
                if ((mine.task && mine.task.$id == event.key)) {
                    // event when task requires approval
                    var task = taskArr.$getRecord(event.key);
                    if (task.price_approval != undefined && task.price_approval == 0 && task.bro.id == $rootScope.user.id) {
                        console.log('onPrice')
                        $rootScope.$broadcast('onPrice');
                    }

                    //    //mine.task = null;
                    //    updateActive();
                }
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

        var webexBot = {
            init: "(bot) Hey bro! Can you help me get a ginseng drink from SIS Lvl 3 Research labs(Rlabs)" +
            "and send it to T-junction",
            next: ["(bot) Keep me updated, thanks!","(bot) Sorry bro, can't talk now",
                "(bot) Oh that can't be helped, do what you can",
                "(bot) I will be at T-junction on the Giant Smoo Smoo!",
                "(bot) Thanks for your help bro!"],
            idx: 0
        };
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
                activeTask.start_time = Firebase.ServerValue.TIMESTAMP;
                taskArr.$save(activeTask);
                mine.task = activeTask;
                var self = this;
                setTimeout(function () {
                    self.addMessage(mine.task, {user: mine.task.bro, message: webexBot.init});
                }, 3000);
            },
            setPrice: function (price) {
                mine.task.price = price;
                mine.task.price_approval = 0;
                taskArr.$save(mine.task);
            },
            approvePrice: function () {
                mine.task.price_approval = 1;
                taskArr.$save(mine.task);
            },
            rejectPrice: function () {
                mine.task.price_approval = -1;
                taskArr.$save(mine.task);
            },
            report: function (task) {
                mine.task.status = 'In review';
                taskArr.$save(mine.task);
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
            updateETA: function (task, minutes) {
                task.eta = moment().add(minutes, "minutes").valueOf();
                taskArr.$save(task);
            },
            confirm: function (task) {
                if (task.bro.id == $rootScope.user.id) {
                    task.bro.confirmed = true;
                    task.bro.end_time = Firebase.ServerValue.TIMESTAMP;

                } else {
                    task.savior.confirmed = true;
                    task.savior.end_time = Firebase.ServerValue.TIMESTAMP;
                    // for web ex
                    task.status = 'completed';
                    task.bro.confirmed = true;
                }
                if (task.savior.confirmed && task.bro.confirmed) {
                    task.status = 'completed';
                    task.end_time = Firebase.ServerValue.TIMESTAMP;
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
                message.time = Firebase.ServerValue.TIMESTAMP;
                task.messages.push(message);
                taskArr.$save(task);
                var self = this;
                if (message.user.id !== task.bro.id) {
                    setTimeout(function () {
                        self.addMessage(mine.task, {user: task.bro, message: webexBot.next[webexBot.idx]});
                        if(webexBot.idx < webexBot.next.length-1)
                            webexBot.idx++;
                        else
                            webexBot.idx = 0;
                    }, Math.floor((Math.random() * 1000) + 2000));
                }
            },
            $watch: function (cb) {
                listener = cb;
            }
        };
    })
    .factory('Bros', function ($firebaseArray, $q) {
        var BrosRef = new Firebase("https://broapp.firebaseio.com/bros");
        var BrosArr = $firebaseArray(BrosRef);

        return {
            all: BrosArr,
            get: function (i) {
                return BrosArr.$getRecord(BrosArr.$keyAt(i));
            },
            findOrCreateBro: function (name) {
                var deferred = $q.defer();
                var foundBro = null;
                var maxId = 0;
                BrosArr.$loaded(function (arr) {
                    arr.forEach(function (bro) {
                        if (bro.name == name) {
                            foundBro = bro;
                        }
                        if (bro.id > maxId)
                            maxId = bro.id;
                    });
                    if (foundBro) {
                        deferred.resolve(foundBro);
                        console.log("Bro found");
                    } else {
                        console.log("Creating new bro", name);

                        var newBro = {
                            id: maxId + 1,
                            name: name,
                            points: 0,
                            nextLevel: 0,
                            rank: 'New Bro',
                            display_pic: 'img/default.png',
                            map: 'img/map-Sebastian.jpg'
                        };
                        BrosArr.$add(newBro).then(function (broRef) {
                            deferred.resolve(BrosArr.$getRecord(broRef.key()));
                        });
                    }
                });
                return deferred.promise;
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
                name: 'Smoo Smoo',
                points: 100,
                nextLevel: 120,
                rank: 'Smoo-th Bro',
                display_pic: 'img/smoo.jpg'
            }
            //{
            //    id: 2,
            //    name: 'Sebastian',
            //    points: 4557,
            //    nextLevel: 5000,
            //    rank: 'Super Bro',
            //    display_pic: 'img/derrick.png',
            //    map: 'img/map-Sebastian.jpg'
            //},
            //{
            //    id: 3,
            //    name: 'Joshua',
            //    points: 780,
            //    nextLevel: 900,
            //    rank: 'Big Bro',
            //    display_pic: 'img/chan.png',
            //    map: 'img/map-Joshua.jpg'
            //},
            //{
            //    id: 4,
            //    name: 'Edison',
            //    points: 880,
            //    nextLevel: 900,
            //    rank: 'Big Bro',
            //    display_pic: 'img/edison.jpg'
            //}, {
            //    id: 5,
            //    name: 'Zac',
            //    points: 7880,
            //    nextLevel: 8100,
            //    rank: 'Epic Bro',
            //    display_pic: 'img/zac.jpg'
            //}
        ];
        var TaskRef = new Firebase("https://broapp.firebaseio.com/tasks");
        var TaskArr = $firebaseArray(TaskRef);
        var tasks = [
            {
                id: 1,
                bro: bros[0],
                task: "(Web Experiment) Need help collecting welfare for my girlfriend! " +
                "Welfare is held at SIS L3 Rlabs please send it to T-Junction! Thank you!",
                date: moment().subtract(5, 'minutes').valueOf(),
                reward: 10,
                status: 'open',
                savior: null,
                distance: 2,
                messages: []
            }
            //}, {
            //    id: 2,
            //    bro: bros[1],
            //    task: "Can anyone help me buy a cake please? Chocolate flavor will be great!",
            //    hasPurchase: true,
            //    budget: [40, 60],
            //    reward: 25,
            //    // open, active, completed
            //    status: 'completed',
            //    savior: null,
            //    distance: 8,
            //    date: moment().subtract(2, 'minutes').valueOf(),
            //    messages: []
            //}, {
            //    id: 3,
            //    bro: bros[2],
            //    task: "I need a Bro to take care of our pet dog tonight!",
            //    hasPurchase: false,
            //    //budget: [40, 60],
            //    reward: 50,
            //    // open, active, completed
            //    status: 'completed',
            //    savior: bros[1],
            //    distance: 6,
            //    date: moment().valueOf(),
            //    messages: []
            //}, {
            //    id: 4,
            //    bro: bros[0],
            //    task: "Can someone help buy a gift for my girlfriend",
            //    hasPurchase: true,
            //    budget: [50, 70],
            //    reward: 30,
            //    // open, active, completed
            //    status: 'completed',
            //    savior: bros[2],
            //    distance: 4,
            //    date: moment().valueOf(),
            //    messages: []
            //},
            //{
            //    id: 5,
            //    bro: bros[3],
            //    task: "I need a wingman tonight!",
            //    hasPurchase: true,
            //    budget: [50, 70],
            //    reward: 30,
            //    // open, active, completed
            //    status: 'active',
            //    savior: bros[4],
            //    distance: 7,
            //    date: moment().valueOf(),
            //    messages: []
            //}
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
    .factory('User', function ($rootScope, Tasks, Bros) {
        var me = {};
        return {
            login: function (bro) {
                me = bro;
                Tasks.mine.task = null;
                $rootScope.user = bro;
                Tasks.update();
            },
            loginNew: function (username) {
                Bros.findOrCreateBro(username).then(function (bro) {
                    if (bro) {
                        console.log("Login as bro", bro);
                        me = bro;
                        Tasks.mine.task = null;
                        $rootScope.user = bro;
                        Tasks.update();
                    }
                });
            },
            track: function (event, data) {
                if (!me.events)
                    me.events = [];
                var track = {
                    event: event,
                    timestamp: Firebase.ServerValue.TIMESTAMP,
                    data: data
                }
                me.events.push(track);
                Bros.all.$save(me);
            },
            current: me
        };
    }).filter('digits', function () {
        return function (input) {
            if (input < 10) {
                input = '0' + input;
            }
            return input;
        }
    })
;
