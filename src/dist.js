(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var content = document.getElementById('content');
var game = undefined,
    bernie = undefined,
    background = undefined,
    starBackground = undefined,
    gameOver = undefined,
    trumpGroup = undefined,
    hillaryGroup = undefined,
    scoreText = undefined,
    voteGroup = undefined,
    starGroup = undefined;
var speed = 10;
var score = 0;
var items = [];
var paused = false;
var starMode = false;

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var BernieGame = function () {
    function BernieGame() {
        _classCallCheck(this, BernieGame);
    }

    _createClass(BernieGame, [{
        key: 'begin',
        value: function begin() {
            var _this = this;

            game = new Phaser.Game(content.clientWidth, 480, Phaser.AUTO, 'content', {
                preload: this.preload,
                create: function create() {
                    _this.create();
                },
                update: function update() {
                    _this.update();
                }
            });
        }
    }, {
        key: 'newSomething',
        value: function newSomething() {
            if (starMode) return this.spawn(voteGroup, 'vote');
            var toMake = getRandomIntInclusive(1, 10);
            if (toMake === 2 && !starMode) this.spawn(starGroup, 'star');else if (toMake === 3) this.spawn(trumpGroup, 'trump');else if (toMake === 4 || toMake === 5) this.spawn(hillaryGroup, 'hillary');else this.spawn(voteGroup, 'vote');
        }
    }, {
        key: 'spawn',
        value: function spawn(group, asset) {
            var item = group.create(game.world.width, getRandomIntInclusive(0, game.world.height - bernie.height), asset);
            if (asset == 'trump') item.scale.setTo(0.5, 0.5);else item.scale.setTo(0.3, 0.3);
            game.physics.arcade.enable([item]);
            item.body.allowGravity = false;
            item.body.bounce.setTo(1, 1);
            item.body.mass = -100;
            items.push(item);
            return item;
        }
    }, {
        key: 'preload',
        value: function preload() {
            game.load.image('background', 'assets/background_s.png');
            game.load.image('star_background', 'assets/star_background.png');
            game.load.image('bernie', 'assets/bernie.png');
            game.load.image('vote', 'assets/vote.png');
            game.load.image('star', 'assets/star.png');
            game.load.image('trump', 'assets/trump.png');
            game.load.image('gameover', 'assets/gameover.jpg');
            game.load.image('hillary', 'assets/hillary.png');
        }
    }, {
        key: 'create',
        value: function create() {
            var _this2 = this;

            game.physics.startSystem(Phaser.Physics.ARCADE);

            starBackground = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'star_background');
            background = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'background');
            gameOver = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'gameover');

            voteGroup = game.add.physicsGroup();
            starGroup = game.add.physicsGroup();
            trumpGroup = game.add.physicsGroup();
            hillaryGroup = game.add.physicsGroup();

            scoreText = game.add.text(10, 10, 'Votes: ' + score);

            bernie = game.add.sprite(game.world.width / 4, game.world.height, 'bernie');
            bernie.scale.setTo(0.5, 0.5);
            //bernie.y = game.world.height - bernie.height;
            bernie.anchor.setTo(0.5, 0.5);

            game.physics.arcade.enable([bernie]);
            bernie.body.collideWorldBounds = true;
            bernie.mass = 420; //Blaze it
            game.physics.arcade.gravity.y = bernie.y - bernie.height;

            var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.add(function () {
                bernie.body.velocity.y = -1 * bernie.height * 3;
            }, this);

            //Vote loop
            game.time.events.loop(Phaser.Timer.SECOND, function () {
                if (paused) return;
                _this2.newSomething();
            }, this);
        }
    }, {
        key: 'update',
        value: function update() {
            gameOver.visible = paused;
            if (paused) {
                game.add.sprite(getRandomIntInclusive(0, game.world.width), getRandomIntInclusive(0, game.world.height), 'trump');
                return;
            }

            starBackground.visible = starMode;

            if (starMode) {
                game.stage.backgroundColor = '#bf3a3a';
            } else {
                game.stage.backgroundColor = '#20c1e9';
            }

            scoreText.setText('Votes: ' + score);
            background.tilePosition.x -= speed;
            items.forEach(function (item) {
                item.body.velocity.x -= speed;
            });
            game.physics.arcade.collide(bernie, voteGroup, function (obj1, obj2) {
                obj2.kill();
                score++;
                if (starMode) score++;
                //Star mode doubles vote value
                scoreText.setText('Votes: ' + score);
            }, null, this);
            game.physics.arcade.collide(bernie, starGroup, function (obj1, obj2) {
                obj2.kill();
                if (starMode) return;
                starMode = true;
                speed = 20; // Double speed
                setTimeout(function () {
                    starMode = false;
                    speed = 10;
                }, 10000); // Star mode expires in 10 seconds
            }, null, this);
            game.physics.arcade.collide(bernie, trumpGroup, function (obj1, obj2) {
                bernie.kill();
                paused = true;
                alert('Game over! Refresh the page to play again.\nYou accumulated ' + score + ' total votes.');
                //Game over
            }, null, this);
            game.physics.arcade.collide(bernie, hillaryGroup, function (obj1, obj2) {
                obj2.kill();
                score -= 10;
            }, null, this);
        }
    }]);

    return BernieGame;
}();

exports.default = BernieGame;

},{}],2:[function(require,module,exports){
'use strict';

var _bernieGame = require('./bernie-game');

var _bernieGame2 = _interopRequireDefault(_bernieGame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

alert('\nPress SPACE to jump.\nCollect votes to gain points.\nStars make you faster, and give votes double value.\nHillary steals 10 votes from you.\nTrump defeats you on contact.\n');
var game = new _bernieGame2.default();
game.begin();

},{"./bernie-game":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGJlcm5pZS1nYW1lLmpzIiwic3JjXFxnYW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztBQ0FBLElBQUksVUFBVSxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBVjtBQUNKLElBQUksZ0JBQUo7SUFBVSxrQkFBVjtJQUFrQixzQkFBbEI7SUFBOEIsMEJBQTlCO0lBQThDLG9CQUE5QztJQUF3RCxzQkFBeEQ7SUFBb0Usd0JBQXBFO0lBQWtGLHFCQUFsRjtJQUE2RixxQkFBN0Y7SUFBd0cscUJBQXhHO0FBQ0EsSUFBSSxRQUFRLEVBQVI7QUFDSixJQUFJLFFBQVEsQ0FBUjtBQUNKLElBQUksUUFBUSxFQUFSO0FBQ0osSUFBSSxTQUFTLEtBQVQ7QUFDSixJQUFJLFdBQVcsS0FBWDs7OztBQUlKLFNBQVMscUJBQVQsQ0FBK0IsR0FBL0IsRUFBb0MsR0FBcEMsRUFBeUM7QUFDckMsV0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFLLE1BQUwsTUFBaUIsTUFBTSxHQUFOLEdBQVksQ0FBWixDQUFqQixDQUFYLEdBQThDLEdBQTlDLENBRDhCO0NBQXpDOztJQUlxQjs7Ozs7OztnQ0FDVDs7O0FBQ0osbUJBQU8sSUFBSSxPQUFPLElBQVAsQ0FBWSxRQUFRLFdBQVIsRUFBcUIsR0FBckMsRUFBMEMsT0FBTyxJQUFQLEVBQWEsU0FBdkQsRUFBa0U7QUFDckUseUJBQVMsS0FBSyxPQUFMO0FBQ1Qsd0JBQVEsa0JBQU07QUFDViwwQkFBSyxNQUFMLEdBRFU7aUJBQU47QUFHUix3QkFBUSxrQkFBTTtBQUNWLDBCQUFLLE1BQUwsR0FEVTtpQkFBTjthQUxMLENBQVAsQ0FESTs7Ozt1Q0FZTztBQUNYLGdCQUFJLFFBQUosRUFBYyxPQUFPLEtBQUssS0FBTCxDQUFXLFNBQVgsRUFBc0IsTUFBdEIsQ0FBUCxDQUFkO0FBQ0EsZ0JBQUksU0FBUyxzQkFBc0IsQ0FBdEIsRUFB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YyxRQUFkOztBQUgyRCx5QkFLM0QsQ0FBVSxPQUFWLGFBQTRCLEtBQTVCLEVBTDJEO2FBQWhCLEVBTTVDLElBTkgsRUFNUyxJQU5ULEVBcEJLO0FBMkJMLGlCQUFLLE9BQUwsQ0FBYSxNQUFiLENBQW9CLE9BQXBCLENBQTRCLE1BQTVCLEVBQW9DLFNBQXBDLEVBQStDLFVBQUMsSUFBRCxFQUFPLElBQVAsRUFBZ0I7QUFDM0QscUJBQUssSUFBTCxHQUQyRDtBQUUzRCxvQkFBSSxRQUFKLEVBQWMsT0FBZDtBQUNBLDJCQUFXLElBQVgsQ0FIMkQ7QUFJM0Qsd0JBQVEsRUFBUjtBQUoyRCwwQkFLM0QsQ0FBVyxZQUFNO0FBQ2IsK0JBQVcsS0FBWCxDQURhO0FBRWIsNEJBQVEsRUFBUixDQUZhO2lCQUFOLEVBR1IsS0FISDtBQUwyRCxhQUFoQixFQVM1QyxJQVRILEVBU1MsSUFUVCxFQTNCSztBQXFDTCxpQkFBSyxPQUFMLENBQWEsTUFBYixDQUFvQixPQUFwQixDQUE0QixNQUE1QixFQUFvQyxVQUFwQyxFQUFnRCxVQUFDLElBQUQsRUFBTyxJQUFQLEVBQWdCO0FBQzVELHVCQUFPLElBQVAsR0FENEQ7QUFFNUQseUJBQVMsSUFBVCxDQUY0RDtBQUc1RCx1RkFBcUUsdUJBQXJFOztBQUg0RCxhQUFoQixFQUs3QyxJQUxILEVBS1MsSUFMVCxFQXJDSztBQTJDTCxpQkFBSyxPQUFMLENBQWEsTUFBYixDQUFvQixPQUFwQixDQUE0QixNQUE1QixFQUFvQyxZQUFwQyxFQUFrRCxVQUFDLElBQUQsRUFBTyxJQUFQLEVBQWdCO0FBQzlELHFCQUFLLElBQUwsR0FEOEQ7QUFFOUQseUJBQVMsRUFBVCxDQUY4RDthQUFoQixFQUcvQyxJQUhILEVBR1MsSUFIVCxFQTNDSzs7OztXQWxGUTs7Ozs7Ozs7Ozs7Ozs7QUNackI7QUFPQSxJQUFJLE9BQU8sMEJBQVA7QUFDSixLQUFLLEtBQUwiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IGNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpO1xyXG5sZXQgZ2FtZSwgYmVybmllLCBiYWNrZ3JvdW5kLCBzdGFyQmFja2dyb3VuZCwgZ2FtZU92ZXIsIHRydW1wR3JvdXAsIGhpbGxhcnlHcm91cCwgc2NvcmVUZXh0LCB2b3RlR3JvdXAsIHN0YXJHcm91cDtcclxubGV0IHNwZWVkID0gMTA7XHJcbmxldCBzY29yZSA9IDA7XHJcbmxldCBpdGVtcyA9IFtdO1xyXG5sZXQgcGF1c2VkID0gZmFsc2U7XHJcbmxldCBzdGFyTW9kZSA9IGZhbHNlO1xyXG5cclxuLy8gUmV0dXJucyBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIChpbmNsdWRlZCkgYW5kIG1heCAoaW5jbHVkZWQpXHJcbi8vIFVzaW5nIE1hdGgucm91bmQoKSB3aWxsIGdpdmUgeW91IGEgbm9uLXVuaWZvcm0gZGlzdHJpYnV0aW9uIVxyXG5mdW5jdGlvbiBnZXRSYW5kb21JbnRJbmNsdXNpdmUobWluLCBtYXgpIHtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCZXJuaWVHYW1lIHtcclxuICAgIGJlZ2luKCkge1xyXG4gICAgICAgIGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoY29udGVudC5jbGllbnRXaWR0aCwgNDgwLCBQaGFzZXIuQVVUTywgJ2NvbnRlbnQnLCB7XHJcbiAgICAgICAgICAgIHByZWxvYWQ6IHRoaXMucHJlbG9hZCxcclxuICAgICAgICAgICAgY3JlYXRlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB1cGRhdGU6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBuZXdTb21ldGhpbmcoKSB7XHJcbiAgICAgICAgaWYgKHN0YXJNb2RlKSByZXR1cm4gdGhpcy5zcGF3bih2b3RlR3JvdXAsICd2b3RlJyk7XHJcbiAgICAgICAgbGV0IHRvTWFrZSA9IGdldFJhbmRvbUludEluY2x1c2l2ZSgxLCAxMCk7XHJcbiAgICAgICAgaWYgKHRvTWFrZSA9PT0gMiAmJiAhc3Rhck1vZGUpIHRoaXMuc3Bhd24oc3Rhckdyb3VwLCAnc3RhcicpO1xyXG4gICAgICAgIGVsc2UgaWYgKHRvTWFrZSA9PT0gMykgdGhpcy5zcGF3bih0cnVtcEdyb3VwLCAndHJ1bXAnKTtcclxuICAgICAgICBlbHNlIGlmICh0b01ha2UgPT09IDQgfHwgdG9NYWtlID09PSA1KSB0aGlzLnNwYXduKGhpbGxhcnlHcm91cCwgJ2hpbGxhcnknKTtcclxuICAgICAgICBlbHNlIHRoaXMuc3Bhd24odm90ZUdyb3VwLCAndm90ZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHNwYXduKGdyb3VwLCBhc3NldCkge1xyXG4gICAgICAgIHZhciBpdGVtID0gZ3JvdXAuY3JlYXRlKGdhbWUud29ybGQud2lkdGgsIGdldFJhbmRvbUludEluY2x1c2l2ZSgwLCBnYW1lLndvcmxkLmhlaWdodCAtIGJlcm5pZS5oZWlnaHQpLCBhc3NldCk7XHJcbiAgICAgICAgaWYgKGFzc2V0ID09ICd0cnVtcCcpXHJcbiAgICAgICAgICAgIGl0ZW0uc2NhbGUuc2V0VG8oMC41LCAwLjUpO1xyXG4gICAgICAgIGVsc2UgaXRlbS5zY2FsZS5zZXRUbygwLjMsIDAuMyk7XHJcbiAgICAgICAgZ2FtZS5waHlzaWNzLmFyY2FkZS5lbmFibGUoW2l0ZW1dKTtcclxuICAgICAgICBpdGVtLmJvZHkuYWxsb3dHcmF2aXR5ID0gZmFsc2U7XHJcbiAgICAgICAgaXRlbS5ib2R5LmJvdW5jZS5zZXRUbygxLCAxKTtcclxuICAgICAgICBpdGVtLmJvZHkubWFzcyA9IC0xMDA7XHJcbiAgICAgICAgaXRlbXMucHVzaChpdGVtKTtcclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH1cclxuXHJcbiAgICBwcmVsb2FkKCkge1xyXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZSgnYmFja2dyb3VuZCcsICdhc3NldHMvYmFja2dyb3VuZF9zLnBuZycpO1xyXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZSgnc3Rhcl9iYWNrZ3JvdW5kJywgJ2Fzc2V0cy9zdGFyX2JhY2tncm91bmQucG5nJyk7XHJcbiAgICAgICAgZ2FtZS5sb2FkLmltYWdlKCdiZXJuaWUnLCAnYXNzZXRzL2Jlcm5pZS5wbmcnKTtcclxuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UoJ3ZvdGUnLCAnYXNzZXRzL3ZvdGUucG5nJyk7XHJcbiAgICAgICAgZ2FtZS5sb2FkLmltYWdlKCdzdGFyJywgJ2Fzc2V0cy9zdGFyLnBuZycpO1xyXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZSgndHJ1bXAnLCAnYXNzZXRzL3RydW1wLnBuZycpO1xyXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZSgnZ2FtZW92ZXInLCAnYXNzZXRzL2dhbWVvdmVyLmpwZycpO1xyXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZSgnaGlsbGFyeScsICdhc3NldHMvaGlsbGFyeS5wbmcnKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGUoKSB7XHJcbiAgICAgICAgZ2FtZS5waHlzaWNzLnN0YXJ0U3lzdGVtKFBoYXNlci5QaHlzaWNzLkFSQ0FERSk7XHJcblxyXG4gICAgICAgIHN0YXJCYWNrZ3JvdW5kID0gZ2FtZS5hZGQudGlsZVNwcml0ZSgwLCAwLCBnYW1lLndvcmxkLndpZHRoLCBnYW1lLndvcmxkLmhlaWdodCwgJ3N0YXJfYmFja2dyb3VuZCcpO1xyXG4gICAgICAgIGJhY2tncm91bmQgPSBnYW1lLmFkZC50aWxlU3ByaXRlKDAsIDAsIGdhbWUud29ybGQud2lkdGgsIGdhbWUud29ybGQuaGVpZ2h0LCAnYmFja2dyb3VuZCcpO1xyXG4gICAgICAgIGdhbWVPdmVyID0gZ2FtZS5hZGQudGlsZVNwcml0ZSgwLCAwLCBnYW1lLndvcmxkLndpZHRoLCBnYW1lLndvcmxkLmhlaWdodCwgJ2dhbWVvdmVyJyk7XHJcblxyXG4gICAgICAgIHZvdGVHcm91cCA9IGdhbWUuYWRkLnBoeXNpY3NHcm91cCgpO1xyXG4gICAgICAgIHN0YXJHcm91cCA9IGdhbWUuYWRkLnBoeXNpY3NHcm91cCgpO1xyXG4gICAgICAgIHRydW1wR3JvdXAgPSBnYW1lLmFkZC5waHlzaWNzR3JvdXAoKTtcclxuICAgICAgICBoaWxsYXJ5R3JvdXAgPSBnYW1lLmFkZC5waHlzaWNzR3JvdXAoKTtcclxuXHJcbiAgICAgICAgc2NvcmVUZXh0ID0gZ2FtZS5hZGQudGV4dCgxMCwgMTAsIGBWb3RlczogJHtzY29yZX1gKTtcclxuXHJcbiAgICAgICAgYmVybmllID0gZ2FtZS5hZGQuc3ByaXRlKGdhbWUud29ybGQud2lkdGggLyA0LCBnYW1lLndvcmxkLmhlaWdodCwgJ2Jlcm5pZScpO1xyXG4gICAgICAgIGJlcm5pZS5zY2FsZS5zZXRUbygwLjUsIDAuNSk7XHJcbiAgICAgICAgLy9iZXJuaWUueSA9IGdhbWUud29ybGQuaGVpZ2h0IC0gYmVybmllLmhlaWdodDtcclxuICAgICAgICBiZXJuaWUuYW5jaG9yLnNldFRvKDAuNSwgMC41KTtcclxuXHJcbiAgICAgICAgZ2FtZS5waHlzaWNzLmFyY2FkZS5lbmFibGUoW2Jlcm5pZV0pO1xyXG4gICAgICAgIGJlcm5pZS5ib2R5LmNvbGxpZGVXb3JsZEJvdW5kcyA9IHRydWU7XHJcbiAgICAgICAgYmVybmllLm1hc3MgPSA0MjA7IC8vQmxhemUgaXRcclxuICAgICAgICBnYW1lLnBoeXNpY3MuYXJjYWRlLmdyYXZpdHkueSA9IGJlcm5pZS55IC0gYmVybmllLmhlaWdodDtcclxuXHJcbiAgICAgICAgbGV0IHNwYWNlS2V5ID0gZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLlNQQUNFQkFSKTtcclxuICAgICAgICBzcGFjZUtleS5vbkRvd24uYWRkKCgpID0+IHtcclxuICAgICAgICAgICAgYmVybmllLmJvZHkudmVsb2NpdHkueSA9IC0xICogYmVybmllLmhlaWdodCAqIDM7XHJcbiAgICAgICAgfSwgdGhpcyk7XHJcblxyXG4gICAgICAgIC8vVm90ZSBsb29wXHJcbiAgICAgICAgZ2FtZS50aW1lLmV2ZW50cy5sb29wKFBoYXNlci5UaW1lci5TRUNPTkQsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHBhdXNlZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLm5ld1NvbWV0aGluZygpO1xyXG4gICAgICAgIH0sIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSgpIHtcclxuICAgICAgICBnYW1lT3Zlci52aXNpYmxlID0gcGF1c2VkO1xyXG4gICAgICAgIGlmIChwYXVzZWQpIHtcclxuICAgICAgICAgICAgZ2FtZS5hZGQuc3ByaXRlKGdldFJhbmRvbUludEluY2x1c2l2ZSgwLCBnYW1lLndvcmxkLndpZHRoKSwgZ2V0UmFuZG9tSW50SW5jbHVzaXZlKDAsIGdhbWUud29ybGQuaGVpZ2h0KSwgJ3RydW1wJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXJCYWNrZ3JvdW5kLnZpc2libGUgPSBzdGFyTW9kZTtcclxuXHJcbiAgICAgICAgaWYgKHN0YXJNb2RlKSB7XHJcbiAgICAgICAgICAgIGdhbWUuc3RhZ2UuYmFja2dyb3VuZENvbG9yID0gJyNiZjNhM2EnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGdhbWUuc3RhZ2UuYmFja2dyb3VuZENvbG9yID0gJyMyMGMxZTknO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2NvcmVUZXh0LnNldFRleHQoYFZvdGVzOiAke3Njb3JlfWApO1xyXG4gICAgICAgIGJhY2tncm91bmQudGlsZVBvc2l0aW9uLnggLT0gc3BlZWQ7XHJcbiAgICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpdGVtLmJvZHkudmVsb2NpdHkueCAtPSBzcGVlZDtcclxuICAgICAgICB9KTtcclxuICAgICAgICBnYW1lLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUoYmVybmllLCB2b3RlR3JvdXAsIChvYmoxLCBvYmoyKSA9PiB7XHJcbiAgICAgICAgICAgIG9iajIua2lsbCgpO1xyXG4gICAgICAgICAgICBzY29yZSsrO1xyXG4gICAgICAgICAgICBpZiAoc3Rhck1vZGUpIHNjb3JlKys7XHJcbiAgICAgICAgICAgIC8vU3RhciBtb2RlIGRvdWJsZXMgdm90ZSB2YWx1ZVxyXG4gICAgICAgICAgICBzY29yZVRleHQuc2V0VGV4dChgVm90ZXM6ICR7c2NvcmV9YCk7XHJcbiAgICAgICAgfSwgbnVsbCwgdGhpcyk7XHJcbiAgICAgICAgZ2FtZS5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKGJlcm5pZSwgc3Rhckdyb3VwLCAob2JqMSwgb2JqMikgPT4ge1xyXG4gICAgICAgICAgICBvYmoyLmtpbGwoKTtcclxuICAgICAgICAgICAgaWYgKHN0YXJNb2RlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHN0YXJNb2RlID0gdHJ1ZTtcclxuICAgICAgICAgICAgc3BlZWQgPSAyMDsgLy8gRG91YmxlIHNwZWVkXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3Rhck1vZGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHNwZWVkID0gMTA7XHJcbiAgICAgICAgICAgIH0sIDEwMDAwKTsgLy8gU3RhciBtb2RlIGV4cGlyZXMgaW4gMTAgc2Vjb25kc1xyXG4gICAgICAgIH0sIG51bGwsIHRoaXMpO1xyXG4gICAgICAgIGdhbWUucGh5c2ljcy5hcmNhZGUuY29sbGlkZShiZXJuaWUsIHRydW1wR3JvdXAsIChvYmoxLCBvYmoyKSA9PiB7XHJcbiAgICAgICAgICAgIGJlcm5pZS5raWxsKCk7XHJcbiAgICAgICAgICAgIHBhdXNlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGFsZXJ0KGBHYW1lIG92ZXIhIFJlZnJlc2ggdGhlIHBhZ2UgdG8gcGxheSBhZ2Fpbi5cXG5Zb3UgYWNjdW11bGF0ZWQgJHtzY29yZX0gdG90YWwgdm90ZXMuYCk7XHJcbiAgICAgICAgICAgIC8vR2FtZSBvdmVyXHJcbiAgICAgICAgfSwgbnVsbCwgdGhpcyk7XHJcbiAgICAgICAgZ2FtZS5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKGJlcm5pZSwgaGlsbGFyeUdyb3VwLCAob2JqMSwgb2JqMikgPT4ge1xyXG4gICAgICAgICAgICBvYmoyLmtpbGwoKTtcclxuICAgICAgICAgICAgc2NvcmUgLT0gMTA7XHJcbiAgICAgICAgfSwgbnVsbCwgdGhpcyk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQmVybmllR2FtZSBmcm9tICcuL2Jlcm5pZS1nYW1lJztcclxuXHJcbmFsZXJ0KGBcclxuUHJlc3MgU1BBQ0UgdG8ganVtcC5cclxuQ29sbGVjdCB2b3RlcyB0byBnYWluIHBvaW50cy5cclxuU3RhcnMgbWFrZSB5b3UgZmFzdGVyLCBhbmQgZ2l2ZSB2b3RlcyBkb3VibGUgdmFsdWUuXHJcbkhpbGxhcnkgc3RlYWxzIDEwIHZvdGVzIGZyb20geW91LlxyXG5UcnVtcCBkZWZlYXRzIHlvdSBvbiBjb250YWN0LlxyXG5gKTtcclxubGV0IGdhbWUgPSBuZXcgQmVybmllR2FtZSgpO1xyXG5nYW1lLmJlZ2luKCk7Il19
