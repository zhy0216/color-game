import { Scene, Cameras } from 'phaser';

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  cursor: Phaser.GameObjects.Image;
  graphics: Phaser.GameObjects.Graphics;
  drawingArea: Phaser.GameObjects.Image;
  mask: Phaser.Display.Masks.BitmapMask;
  isDrawing: boolean = false;

  constructor() {
    super('Game');
  }

  private lastX: number = 0;
  private lastY: number = 0;
  private renderTexture: Phaser.GameObjects.RenderTexture;
  
  /**
   * Draw function to handle brush painting
   */
  draw(x: number, y: number): void {
    // this.graphics.clear();
    this.graphics.lineStyle(50, 0x2776f4);
    this.graphics.beginPath();
    this.graphics.moveTo(this.lastX, this.lastY);
    this.graphics.lineTo(x, y);
    this.graphics.strokePath();
    
    this.renderTexture.draw(this.graphics);
    
    this.lastX = x;
    this.lastY = y;
  }

  create() {
    // Hide default cursor
    this.input.setDefaultCursor('none');
    
    this.camera = this.cameras.main;
    this.camera.x = -200
    this.camera.width = 3000
    
    // Create graphics for drawing
    this.graphics = this.add.graphics();
    this.graphics.setDepth(10);
    
    // Add custom cursor that follows pointer
    this.cursor = this.add.image(0, 0, 'blue-pen');
    this.cursor.setOrigin(0, 0); // Set origin based on where the pen point is
    this.cursor.setScale(0.5); // Scale down the pen image if needed
    this.cursor.setRotation(5/4*Math.PI);
    
    // Make cursor follow the pointer
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.cursor.x = pointer.x;
      this.cursor.y = pointer.y;
      
      // Draw if mouse button is down
      if (this.isDrawing) {
        this.draw(pointer.x, pointer.y);
      }
    });
    
    // Handle mouse down
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.isDrawing = true;
      this.lastX = pointer.x;
      this.lastY = pointer.y;
    });
    
    // Handle mouse up
    this.input.on('pointerup', () => {
      this.isDrawing = false;
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

    
    // First, add the drawing area base image (the fly without coloring)
    const flyDrawing = this.add.image(1410, 450, 'fly-drawing');
    flyDrawing.setDepth(5);

    // this.add.image(1410, 405, 'fly-done').setDepth(20);;
    
    // Create a renderTexture that will be used for drawing
    // This needs to be the same size as your butterfly image
    this.renderTexture = this.add.renderTexture(1010, 150, 800, 600);
    this.renderTexture.setDepth(10);
    
    // Clear the texture to transparent
    this.renderTexture.clear();
    
    // Create mask with the butterfly outline
    const maskImage = this.make.image({
      x: 1410,
      y: 405,
      key: 'fly-done',
      add: false
    });
    
    // Apply the mask to the renderTexture
    const mask = maskImage.createBitmapMask();
    mask.invertAlpha = true; // Invert the mask so we draw only in transparent areas
    this.renderTexture.setMask(mask);
    
    // Show the butterfly overlay on top
    const flyOverlay = this.add.image(1410, 450, 'fly-overlay');
    flyOverlay.setDepth(15);



    // const fly = this.add.spine(
    //   245,
    //   1010,
    //   "fly-data",
    //   "fly-atlas"
    // );

    // fly.animationState.setAnimation(0, "hudie_born_1", false);


    
  }
}
