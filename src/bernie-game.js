let content = document.getElementById('content');
let game, bernie, background, starBackground, gameOver, trumpGroup, hillaryGroup, scoreText, voteGroup, starGroup;
let speed = 10;
let score = 0;
let items = [];
let paused = false;
let starMode = false;

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class BernieGame {
    begin() {
        game = new Phaser.Game(content.clientWidth, 480, Phaser.AUTO, 'content', {
            preload: this.preload,
            create: () => {
                this.create();
            },
            update: () => {
                this.update();
            }
        });
    }

    newSomething() {
        if (starMode) return this.spawn(voteGroup, 'vote');
        let toMake = getRandomIntInclusive(1, 10);
        if (toMake === 2 && !starMode) this.spawn(starGroup, 'star');
        else if (toMake === 3) this.spawn(trumpGroup, 'trump');
        else if (toMake === 4 || toMake === 5) this.spawn(hillaryGroup, 'hillary');
        else this.spawn(voteGroup, 'vote');
    }

    spawn(group, asset) {
        var item = group.create(game.world.width, getRandomIntInclusive(0, game.world.height - bernie.height), asset);
        if (asset == 'trump')
            item.scale.setTo(0.5, 0.5);
        else item.scale.setTo(0.3, 0.3);
        game.physics.arcade.enable([item]);
        item.body.allowGravity = false;
        item.body.bounce.setTo(1, 1);
        item.body.mass = -100;
        items.push(item);
        return item;
    }

    preload() {
        game.load.image('background', 'assets/background_s.png');
        game.load.image('star_background', 'assets/star_background.png');
        game.load.image('bernie', 'assets/bernie.png');
        game.load.image('vote', 'assets/vote.png');
        game.load.image('star', 'assets/star.png');
        game.load.image('trump', 'assets/trump.png');
        game.load.image('gameover', 'assets/gameover.jpg');
        game.load.image('hillary', 'assets/hillary.png');
    }

    create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        starBackground = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'star_background');
        background = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'background');
        gameOver = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'gameover');

        voteGroup = game.add.physicsGroup();
        starGroup = game.add.physicsGroup();
        trumpGroup = game.add.physicsGroup();
        hillaryGroup = game.add.physicsGroup();

        scoreText = game.add.text(10, 10, `Votes: ${score}`);

        bernie = game.add.sprite(game.world.width / 4, game.world.height, 'bernie');
        bernie.scale.setTo(0.5, 0.5);
        //bernie.y = game.world.height - bernie.height;
        bernie.anchor.setTo(0.5, 0.5);

        game.physics.arcade.enable([bernie]);
        bernie.body.collideWorldBounds = true;
        bernie.mass = 420; //Blaze it
        game.physics.arcade.gravity.y = bernie.y - bernie.height;

        let spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(() => {
            bernie.body.velocity.y = -1 * bernie.height * 3;
        }, this);

        //Vote loop
        game.time.events.loop(Phaser.Timer.SECOND, () => {
            if (paused) return;
            this.newSomething();
        }, this);
    }

    update() {
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

        scoreText.setText(`Votes: ${score}`);
        background.tilePosition.x -= speed;
        items.forEach((item) => {
            item.body.velocity.x -= speed;
        });
        game.physics.arcade.collide(bernie, voteGroup, (obj1, obj2) => {
            obj2.kill();
            score++;
            if (starMode) score++;
            //Star mode doubles vote value
            scoreText.setText(`Votes: ${score}`);
        }, null, this);
        game.physics.arcade.collide(bernie, starGroup, (obj1, obj2) => {
            obj2.kill();
            if (starMode) return;
            starMode = true;
            speed = 20; // Double speed
            setTimeout(() => {
                starMode = false;
                speed = 10;
            }, 10000); // Star mode expires in 10 seconds
        }, null, this);
        game.physics.arcade.collide(bernie, trumpGroup, (obj1, obj2) => {
            bernie.kill();
            paused = true;
            alert(`Game over! Refresh the page to play again.\nYou accumulated ${score} total votes.`);
            //Game over
        }, null, this);
        game.physics.arcade.collide(bernie, hillaryGroup, (obj1, obj2) => {
            obj2.kill();
            score -= 10;
        }, null, this);
    }
}