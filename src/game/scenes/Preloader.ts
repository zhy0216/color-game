import { Scene } from 'phaser';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    // Display the background image we loaded in Boot scene
    this.add.image(1600, 540, 'background').setScale(1);
  }

  create() {
    this.scene.start('Game');
  }

}
