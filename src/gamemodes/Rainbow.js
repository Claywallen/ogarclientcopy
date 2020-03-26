﻿var FFA = require('./FFA'); // Base gamemode
var Entity = require('../entity');

function Rainbow() {
    FFA.apply(this, Array.prototype.slice.call(arguments));

    this.ID = 20;
    this.name = "Rainbow FFA";
    this.specByLeaderboard = true;
    this.interfall = 0;
    this.colors = [{
            'r': 255,
            'g': 0,
            'b': 0
        }, // Red
        {
            'r': 255,
            'g': 32,
            'b': 0
        }, {
            'r': 255,
            'g': 64,
            'b': 0
        }, {
            'r': 255,
            'g': 96,
            'b': 0
        }, {
            'r': 255,
            'g': 128,
            'b': 0
        }, // Orange
        {
            'r': 255,
            'g': 160,
            'b': 0
        }, {
            'r': 255,
            'g': 192,
            'b': 0
        }, {
            'r': 255,
            'g': 224,
            'b': 0
        }, {
            'r': 255,
            'g': 255,
            'b': 0
        }, // Yellow
        {
            'r': 192,
            'g': 255,
            'b': 0
        }, {
            'r': 128,
            'g': 255,
            'b': 0
        }, {
            'r': 64,
            'g': 255,
            'b': 0
        }, {
            'r': 0,
            'g': 255,
            'b': 0
        }, // Green
        {
            'r': 0,
            'g': 192,
            'b': 64
        }, {
            'r': 0,
            'g': 128,
            'b': 128
        }, {
            'r': 0,
            'g': 64,
            'b': 192
        }, {
            'r': 0,
            'g': 0,
            'b': 255
        }, // Blue
        {
            'r': 18,
            'g': 0,
            'b': 192
        }, {
            'r': 37,
            'g': 0,
            'b': 128
        }, {
            'r': 56,
            'g': 0,
            'b': 64
        }, {
            'r': 75,
            'g': 0,
            'b': 130
        }, // Indigo
        {
            'r': 92,
            'g': 0,
            'b': 161
        }, {
            'r': 109,
            'g': 0,
            'b': 192
        }, {
            'r': 126,
            'g': 0,
            'b': 223
        }, {
            'r': 143,
            'g': 0,
            'b': 255
        }, // Purple
        {
            'r': 171,
            'g': 0,
            'b': 192
        }, {
            'r': 199,
            'g': 0,
            'b': 128
        }, {
            'r': 227,
            'g': 0,
            'b': 64
        },
    ];
    this.colorsLength = this.colors.length - 1;
    this.speed = 1; // Speed of color change
}

module.exports = Rainbow;
Rainbow.prototype = new FFA();

// Gamemode Specific Functions

Rainbow.prototype.changeColor = function (node) {
    if (typeof node.rainbow == 'undefined') {
        node.rainbow = Math.floor(Math.random() * this.colors.length);
    }

    if (node.rainbow >= this.colorsLength) {
        node.rainbow = 0;
    }

    node.color = this.colors[node.rainbow];
    node.rainbow += this.speed;
};

// Override
Rainbow.prototype.onServerInit = function (gameServer) {
    var self = this;

    Entity.Food.prototype.onAdd = function () {
        self.changeColor(this);
        gameServer.currentFood++;
    };
    Entity.Virus.prototype.onAdd = function () {
        self.changeColor(this);
        gameServer.nodesVirus.push(this);

        // Lets Spawn our pretty spirals
        if(gameServer.config.virusSpirals)
            gameServer.spawnSpiral(this.position, this.color);

    };
    Entity.EjectedMass.prototype.onAdd = function () {
        self.changeColor(this);
        gameServer.nodesEjected.push(this);
    };
};

Rainbow.prototype.onChange = function () {
};

Rainbow.prototype.onTick = function (gameServer) {
    if(this.interfall < 0) {
        this.interfall = 3;
        var color, node;
        // Change color
        for (var i in gameServer.clients) {
            var client = gameServer.clients[i].playerTracker;
            for (var j = 0, len = client.cells.length; j < len; j++) {
                if(client.cells[j]) {
                    node = client.cells[j];
                    this.changeColor(node);
                }
            }
        }
    }
    this.interfall--;
};