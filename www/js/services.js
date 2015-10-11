/* global angular, document, window */
'use strict';

angular.module('starter.services', [])
    .factory('Tasks', function (Bros) {
        var tasks = [
            {
                id: 1,
                bro: Bros.get(2),
                task: "HELP! Can anyone get me some flowers?",
                hasPurchase: true,
                budget: [10, 20],
                reward: 10,
                status: 'open',
                savior: null,
                stage: 1,
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
                date: new Date(),
                stage: 1,
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
                date: new Date(),
                stage: 1,
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
                date: new Date(),
                stage: 1,
                messages: []
            }
        ];
        return {
            all: tasks,
            opened: function () {
                var opened = [];
                tasks.forEach(function (task) {
                    if (task.status == "open")
                        opened.push(task);
                });
                return opened;
            },
            get: function (i) {
                var theTask = undefined;
                tasks.forEach(function (task) {
                    if (task.id == i)
                        theTask = task;
                });
                return theTask;
            },
            add: function (new_task) {
                var next_id = 0;
                tasks.forEach(function (task) {
                    if (task.id > next_id) {
                        next_id = task.id;
                    }
                });
                new_task.id = next_id + 1;
                tasks.push(new_task);
            },
            active: function () {
                var theTask = undefined;
                tasks.forEach(function (task) {
                    if (task.status == "active")
                        theTask = task;
                });
                return theTask;
            },
            setActive: function (id) {
                tasks.forEach(function (task) {
                    if (task.id == id)
                        task.status = "active";
                    else
                        task.status = task.status == "active" ? "open" : task.status;
                });
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
                display_pic: 'img/derrick.png'
            },
            {
                id: 2,
                name: 'Sebastian',
                points: '240',
                rank: 'Super Bro',
                display_pic: 'img/jj.jpg',
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
                bro: Bros.get(2),
                task: "HELP! Can anyone get me some flowers?",
                budget: [10, 20],
                reward: 10,
            }, {
                id: 2,
                bro: Bros.get(2),
                task: "Can anyone help me buy a cake please? Chocolate flavor will be great!",
                budget: [40, 60],
                reward: 25,
            },
            {
                id: 3,
                bro: Bros.get(2),
                task: "Drive me somewhere! ",
                budget: [40, 60],
                reward: 25,
            }
        ];
        return {
            all: taskHistories,

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
