import { Scene, Cameras } from 'phaser';

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  cursor: Phaser.GameObjects.Image;
  graphics: Phaser.GameObjects.Graphics;
  drawingArea: Phaser.GameObjects.Image;
  maskImage: Phaser.GameObjects.Image;
  isDrawing: boolean = false;
  completionCheckTimer: Phaser.Time.TimerEvent;
  drawingCompleted: boolean = false;
  totalDrawablePixels: number = 0;
  drawingTexture: Phaser.GameObjects.RenderTexture;

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
  
  // Simple rectangle bounds check for butterfly drawing area
  isInsideButterflyArea(x: number, y: number): boolean {
    // Get local coordinates relative to container
    const local = this.worldToLocal(x, y);
    
    // Define the butterfly drawing area bounds in local coordinates
    const bounds = {
      left: -200,   // Half width 
      right: 200,   // Half width
      top: -150,    // Half height
      bottom: 150   // Half height
    };
    
    // Check if point is inside the bounds
    return local.x >= bounds.left && local.x <= bounds.right && 
           local.y >= bounds.top && local.y <= bounds.bottom;
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

  // Method to calculate and track the butterfly coloring completion
  checkCompletionPercentage() {
    if (this.drawingCompleted) return;
    
    // Get the drawing coverage estimation directly from the graphics object
    // We'll use the bounding box area as our total pixel count
    const butterflyArea = 400 * 300; // Approximate total pixel area of the butterfly
    
    // Estimate the drawn area by using line segments and their thickness
    let drawnArea = 0;
    
    if (this.graphics.commandBuffer) {
      const lineCommands = this.graphics.commandBuffer.filter(cmd => {
        // Filter for drawing commands - this is an approximation
        // In Phaser's graphics, line drawing operations typically have these commands
        return cmd && typeof cmd === 'object' && 'lineStyle' in cmd;
      });
      
      // Each line stroke with thickness 50 covers approximately this much area
      const strokeWidth = 50;
      const averageStrokeLength = 30; // Approximate pixel length of a typical stroke
      
      // Calculate the area covered by all strokes
      drawnArea = lineCommands.length * strokeWidth * averageStrokeLength;
    }
    
    // Calculate the coverage percentage
    const totalDrawableArea = butterflyArea * 0.6; // Assuming 60% of the butterfly area is drawable
    let completionPercentage = Math.min(100, (drawnArea / totalDrawableArea) * 100);
    
    // If we have drawing commands but calculation shows 0%, show at least 1%
    if (completionPercentage === 0 && this.graphics.commandBuffer && this.graphics.commandBuffer.length > 0) {
      completionPercentage = 1;
    }
    
    console.log(`Drawing completion: ${completionPercentage.toFixed(2)}% (Estimated area: ${drawnArea}px²)`); 
    
    // When we reach 90%, log done
    if (completionPercentage >= 90 && !this.drawingCompleted) {
      console.log('done');
      this.drawingCompleted = true;
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
      // Only start drawing if inside the butterfly area
      if (this.isInsideButterflyArea(pointer.x, pointer.y)) {
        this.isDrawing = true;
        this.lastX = pointer.x;
        this.lastY = pointer.y;
      }
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
    const butterflyContainer = this.add.container(1410, 450);
    
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
    butterflyContainer.add([this.graphics, flyDrawing, flyOverlay]);
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


    
  }
}
