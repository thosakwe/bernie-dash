import BernieGame from './bernie-game';

alert(`
Press SPACE to jump.
Collect votes to gain points.
Stars make you faster, and give votes double value.
Hillary steals 10 votes from you.
Trump defeats you on contact.
`);
let game = new BernieGame();
game.begin();