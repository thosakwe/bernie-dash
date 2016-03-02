import Key = Phaser.Key;
import Keyboard = Phaser.Keyboard;

export class BernieGame {
    game:Phaser.Game;
    background:Phaser.TileSprite;
    bernie:Phaser.Sprite;
    bernieSpeed = 5;

    constructor() {
        let host = document.getElementById('content');
        this.game = new Phaser.Game(host.clientWidth, 480, Phaser.AUTO, 'content', {
            preload: this.preload,
            create: this.create,
            update: this.update
        });
    }

    preload() {
        this.game.load.image('background', 'src/assets/background_s.png');
        this.game.load.image('bernie', 'src/assets/bernie.png');
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 50;
        this.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'background');
        this.bernie = this.game.add.sprite(50, this.game.world.height - 50, 'bernie');
        this.bernie.anchor.setTo(-0.5, 1);
        this.bernie.scale.setTo(0.7, 0.7);
        this.game.physics.enable(this.bernie, Phaser.Physics.ARCADE);
        this.bernie.body.collideWorldBounds = true;
        this.bernie.body.gravity.y = 50;

        this.game.input.keyboard.onDownCallback = (e) => {
            if (e.keyCode == Phaser.Keyboard.SPACEBAR && this.bernie.body.velocity.y == 0) {
                this.bernie.body.gravity.y -= 0.5;
                this.bernie.body.velocity.y -= this.bernie.height;
            }
        };
    }

    foo:number = 0;

    update() {
        this.bernieSpeed = this.bernieSpeed || 2;
        this.background.tilePosition.x -= this.bernieSpeed;
    }
}