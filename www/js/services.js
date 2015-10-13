/* global angular, document, window */
'use strict';

angular.module('starter.services', ['firebase'])
    .factory('Tasks', function (Bros, $firebaseArray, $firebaseObject) {
        var TaskRef = new Firebase("https://broapp.firebaseio.com/tasks");

        var tasks = [
            {
                id: 1,
                bro: Bros.get(2),
                task: "HELP! Can anyone get me some flowers?",
                hasPurchase: true,
                budget: [10, 20],
                date: moment().subtract(5, 'minutes').valueOf(),
                reward: 10,
                status: 'open',
                savior: null,
                messages: []
            }, {
                id: 2,
                bro: Bros.get(3),
                task: "Can anyone help me buy a cake please? Chocolate flavor will be great!",
                hasPurchase: true,
                budget: [40, 60],
                reward: 25,
                // open, active, completed
                status: 'open',
                savior: null,
                date: moment().subtract(2, 'minutes').valueOf(),
                messages: []
            }, {
                id: 3,
                bro: Bros.get(3),
                task: "I need a Bro to take care of our pet dog tonight!",
                hasPurchase: false,
                //budget: [40, 60],
                reward: 50,
                // open, active, completed
                status: 'active',
                savior: Bros.get(1),
                date: moment().valueOf(),
                messages: []
            }, {
                id: 4,
                bro: Bros.get(1),
                task: "Can someone help buy a gift for my girlfriend",
                hasPurchase: true,
                budget: [50, 70],
                reward: 30,
                // open, active, completed
                status: 'completed',
                savior: Bros.get(3),
                date: moment().valueOf(),
                messages: []
            }
        ];

        //TaskRef.set({});
        //for (var i = 0; i < tasks.length; i++) {
        //    TaskRef.child(tasks[i].status).push().set(tasks[i]);
        //}

        var taskArr = $firebaseArray(TaskRef);
        var opened = $firebaseArray(TaskRef.child("open"));
        var active = $firebaseObject(TaskRef.child("active"));
        return {
            all: taskArr,
            opened: opened,
            active: active,
            get: function (i) {
                return opened.$getRecord(i);
            },
            add: function (new_task) {
                console.log('added');
                if (new_task.status) {
                    new_task.date = Firebase.ServerValue.TIMESTAMP;
                    TaskRef.child(new_task.status).push().set(new_task);
                    tasks.push(new_task);
                }
            },
            setActive: function (activeTask) {
                TaskRef.child("active").set(activeTask);
            }
        };
    })
    .factory('Bros', function () {
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
        return {
            all: bros,
            get: function (i) {
                var theBro = undefined;
                bros.forEach(function (bros) {
                    if (bros.id == i)
                        theBro = bros;
                });
                return theBro;
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


    .factory('Profile', function () {
        var me = {
            id: 2,
            name: 'Sebastian',
            points: '240',
            display_pic: 'img/jj.jpg',
            badges: [],
            my_tasks: []
        };
        return me;
    });
;
