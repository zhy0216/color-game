import { Scene, Cameras } from 'phaser';

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;

  constructor() {
    super('Game');
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.x = -200
    this.camera.width = 3000

    // Add the background layers in correct order with proper positioning based on lesson_colors_psd.asset
    
    // Base background layer - x:63.5, y:0, size: 3137x1080
    const backgroundBase = this.add.image(1600, 540, 'background-base');
    backgroundBase.setScale(1)
    const middleBackground = this.add.image(1660, 270, 'background-middle');
    middleBackground.setScale(1)

    // // Foreground layer - x:65.5, y:-236, size: 3141x608
    const foreground = this.add.image(1540, 740, 'background-foreground');
    foreground.setScale(1);
    
    // // Add environment elements
    // // Pond element - size: 1483x479, position: x:1233.5, y:-204.5
    const pond = this.add.image(2800, 700, 'pond');
    pond.setScale(1);
    
    // // Add some lily pads to the pond
    // this.add.image(1350, 730, 'lily-pad').setScale(0.7);
    // this.add.image(1450, 750, 'lily-pad').setScale(0.6);
    
    // // Add trees and flowers
    // this.add.image(800, 500, 'apple-tree').setScale(0.9);
    // this.add.image(2200, 600, 'flower-pot').setScale(0.8);
    
    // // Add grass elements
    // this.add.image(1200, 820, 'grass-1').setScale(0.8);
    // this.add.image(1800, 830, 'grass-2').setScale(0.7);
    // this.add.image(2100, 810, 'grass-5').setScale(0.9);
    
    // // Add max character
    // const max = this.add.image(400, 600, 'max');
    // max.setScale(0.8);
    
    // // Add color palette
    // const colorPalette = this.add.image(1600, 900, 'color-palette');
    // colorPalette.setScale(0.8);
    
    // // Add initial drawing to color
    // const drawing = this.add.image(1600, 400, 'apple-drawing');
    // drawing.setScale(0.9);
    
    // // Add paintbrush
    // const paintbrush = this.add.image(1500, 800, 'paintbrush-1');
    // paintbrush.setScale(0.8);
  }
}
