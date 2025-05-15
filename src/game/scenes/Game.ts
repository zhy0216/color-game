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
  private prevX: number = 0;
  private prevY: number = 0;
  
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
    
    // Store previous coordinates for area calculation
    this.prevX = this.lastX;
    this.prevY = this.lastY;
    
    // Store world coordinates for next draw call
    this.lastX = x;
    this.lastY = y;
    
    // Check completion after drawing
    this.checkCompletionPercentage();
  }

  // Track the total area drawn so far
  private totalDrawnArea: number = 0;
  
  // Method to calculate and track the butterfly coloring completion
  checkCompletionPercentage() {
    if (this.drawingCompleted) return;
    
    // Get the total butterfly area in square pixels
    const butterflyWidth = 400;  // Approximate width of drawable butterfly area
    const butterflyHeight = 300; // Approximate height of drawable butterfly area
    const totalDrawableArea = butterflyWidth * butterflyHeight * 0.6; // Only ~60% of the area is actually drawable
    
    // Instead of analyzing the graphics object directly (which is complex),
    // we'll accumulate drawing area as the user draws
    
    // In the most recent drawing operation, estimate the area covered by the stroke
    // Each time we draw a line, we can approximate its area as length * width
    // This calculation happens every time we call checkCompletionPercentage()
    // after drawing a stroke
    
    // The approximate area of the most recently drawn line
    const strokeWidth = 50; // Our line thickness
    
    // Estimate the length of the most recent stroke
    // We know the start and end points of the line from lastX/Y and current points
    const dx = this.lastX - this.prevX;
    const dy = this.lastY - this.prevY;
    const lineLength = Math.sqrt(dx * dx + dy * dy);
    
    // Area of this stroke
    const strokeArea = lineLength * strokeWidth;
    
    // Add this to our running total
    this.totalDrawnArea += strokeArea;
    
    // Calculate percentage of butterfly that's colored
    let completionPercentage = Math.min(100, (this.totalDrawnArea / totalDrawableArea) * 100);
    
    console.log(`Drawing completion: ${completionPercentage.toFixed(2)}% (Area: ${this.totalDrawnArea.toFixed(0)}px²)`); 
    
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
        
        // Initialize both last and prev coordinates to the same point
        // This ensures the first stroke has zero length (no area added yet)
        this.prevX = pointer.x;
        this.prevY = pointer.y;
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
