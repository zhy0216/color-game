import { Scene, Cameras } from 'phaser';

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  cursor: Phaser.GameObjects.Image;

  constructor() {
    super('Game');
  }

  create() {
    // Hide default cursor
    this.input.setDefaultCursor('none');
    
    this.camera = this.cameras.main;
    this.camera.x = -200
    this.camera.width = 3000
    
    // Add custom cursor that follows pointer
    this.cursor = this.add.image(0, 0, 'blue-pen');
    this.cursor.setOrigin(0, 1); // Set origin based on where the pen point is
    this.cursor.setScale(0.5); // Scale down the pen image if needed
    this.cursor.setRotation(90 * (Math.PI / 360)); // Rotate 270 degrees (convert to radians)
    
    // Make cursor follow the pointer
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.cursor.x = pointer.x;
      this.cursor.y = pointer.y;
    });
    
    // Ensure cursor is always on top
    this.cursor.setDepth(1000);

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

    const paper = this.add.spine(
      245,
      1010,
      "paper-data",
      "paper-atlas"
    );

    paper.animationState.setAnimation(0, "paper_come", false);

    
    this.add.image(1410, 450, 'fly-drawing');
    this.add.image(1410, 450, 'fly-overlay');



    // const fly = this.add.spine(
    //   245,
    //   1010,
    //   "fly-data",
    //   "fly-atlas"
    // );

    // fly.animationState.setAnimation(0, "hudie_born_1", false);


    
  }
}
