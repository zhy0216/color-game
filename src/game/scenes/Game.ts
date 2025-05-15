import { Scene } from 'phaser';
import {countBluePixelsInSnapshot} from "./../utils"

enum State {
  DONE="DONE"
}

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  cursor: Phaser.GameObjects.Image;
  graphics: Phaser.GameObjects.Graphics;
  maskImage: Phaser.GameObjects.Image;
  isDrawing: boolean = false;
  completionCheckTimer: Phaser.Time.TimerEvent;
  drawingCompleted: boolean = false;
  container: Phaser.GameObjects.Container

  constructor() {
    super('Game');
  }

  private lastX: number = 0;
  private lastY: number = 0;
  
  // Convert world coordinates to container-local coordinates
  worldToLocal(x: number, y: number): {x: number, y: number} {
    return {
      x: x - 1410,  // Container's x position
      y: y - 450    // Container's y position
    };
  }
  
  // Convert container-local coordinates to world coordinates
  localToWorld(x: number, y: number): {x: number, y: number} {
    return {
      x: x + 1410,  // Container's x position
      y: y + 450    // Container's y position
    };
  }
  
  /**
   * Draw function to handle brush painting
   */
  draw(x: number, y: number): void {
    // Only draw if point is inside butterfly area
    // Convert to local coordinates for drawing in the container
    const localCurrent = this.worldToLocal(x, y);
    const localLast = this.worldToLocal(this.lastX, this.lastY);
    
    this.graphics.lineStyle(50, 0x2776f4);
    this.graphics.beginPath();
    this.graphics.moveTo(localLast.x, localLast.y);
    this.graphics.lineTo(localCurrent.x, localCurrent.y);
    this.graphics.strokePath();
    // Store world coordinates for next draw call
    this.lastX = x;
    this.lastY = y;
    
    // Check completion after drawing
    this.checkCompletionPercentage();
  }

  /**
   * Calculates how many pixels in the graphics object have the blue color (0x2776f4)
   * @returns The number of blue pixels (actual count)
   */
  async calculateBluePixel() {
    const targetR = (0x2776f4 >> 16) & 0xFF; // 39
    const targetG = (0x2776f4 >> 8) & 0xFF;  // 118
    const targetB = 0x2776f4 & 0xFF;         // 244
    const width = 920;
    const height = 700;
    return new Promise<number>(r => this.renderer.snapshotArea(750, 100, width, height, (image) => {
      r(countBluePixelsInSnapshot(image as HTMLImageElement, targetR, targetG, targetB))
    }));
  }
  
  
  // Method to calculate and track the butterfly coloring completion
  async checkCompletionPercentage() {
    if (this.drawingCompleted) return;
    
    const totalDrawableArea = 376876;
    const drawed = await this.calculateBluePixel()
    // console.log("#### this.calculateBluePixel():", await this.calculateBluePixel())
    
    console.log(`Drawing completion: ${drawed} / (Area: ${totalDrawableArea.toFixed(0)}px²)`); 
    
    // When we reach 90%, log done
    if (Math.abs(drawed - totalDrawableArea) < 50 && !this.drawingCompleted) {
      console.log('done');
      this.drawingCompleted = true;
      this.game.events.emit(State.DONE);
    }
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
    // Create a container for our butterfly drawing elements
    this.container = this.add.container(1410, 450);
    
    // Create the base image (blank butterfly)
    const flyDrawing = this.add.image(0, 0, 'fly-drawing');
    
    // Create a masked graphics object for drawing
    this.graphics = this.add.graphics();
    
    // Create the butterfly outline for reference (not visible)
    const shape = this.add.image( 1410, 405, 'fly-done').setVisible(false);
    const mask = shape.createBitmapMask();
    // Add the overlay on top
    const flyOverlay = this.add.image(0, 0, 'fly-overlay');
    
    // Add all elements to the container
    this.container.add([this.graphics, flyDrawing, flyOverlay]);
    this.graphics.mask = mask;
    
    // Set depths to ensure proper layering
    this.graphics.setDepth(10);
    flyDrawing.setDepth(15);
    flyOverlay.setDepth(15);



    // const fly = this.add.spine(
    //   245,
    //   1010,
    //   "fly-data",
    //   "fly-atlas"
    // );

    // fly.animationState.setAnimation(0, "hudie_born_1", false);


    const max = this.add.spine(
      445,
      1010,
      "max-data",
      "max-atlas"
    );
    max.setScale(0.4)

    max.animationState.setAnimation(0, "idle normal", true);


    this.game.events.on(State.DONE, () => {
      paper.animationState.setAnimation(0, "paper_go", false);
    })

    
  }

  preload() {
    this.load.image('background-base', 'assets/Arts/Image/265.png');
    this.load.image('background-middle', 'assets/Arts/Image/269.png');
    this.load.image('background-foreground', 'assets/Arts/Image/274.png');
    
    // // Pond element - size: 1483x479, position: x:1233.5, y:-204.5
    this.load.image('pond', 'assets/Arts/Image/398.png');

    this.load.image('fly-overlay', 'assets/Arts/fly_overlay.png');
    this.load.image('fly-drawing', 'assets/Arts/Image/2208.png');
    this.load.image('fly-done', 'assets/Arts/Image/fly-done.png');

    this.load.image('blue-pen', 'assets/Arts/Image/blue-pen.png');
    



    this.load.spineJson("paper-data", "assets/spine_animations/paper.json");
    this.load.spineAtlas("paper-atlas", "assets/spine_animations/paper.atlas.txt");

    this.load.spineJson("fly-data", "assets/spine_animations/fly.json");
    this.load.spineAtlas("fly-atlas", "assets/spine_animations/fly.atlas.txt");

    this.load.spineBinary("max-data", "assets/spine_animations/max/people_Max_pal.skel.bytes");
    this.load.spineAtlas("max-atlas", "assets/spine_animations/max/people_Max_pal.atlas.txt");
  }
}
