import { Scene } from 'phaser';
import {countBluePixelsInSnapshot, delay} from "./../utils"
import { SpineGameObject } from '@esotericsoftware/spine-phaser';

enum State {
  STARTED="STARTED",
  START_DRAW="START_DRAW",
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
  paper: SpineGameObject
  max: SpineGameObject

  constructor() {
    super('Game');
  }

  private lastX: number = 0;
  private lastY: number = 0;
  
  worldToLocal(x: number, y: number): {x: number, y: number} {
    return {
      x: x - 1410, 
      y: y - 450   
    };
  }
  
  localToWorld(x: number, y: number): {x: number, y: number} {
    return {
      x: x + 1410,  
      y: y + 450 
    };
  }
  
  draw(x: number, y: number): void {
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

  async setupStartedGame() {

  }

  async setupStartDrawGame() {

    this.paper = this.add.spine(
      245,
      1010,
      "paper-data",
      "paper-atlas"
    );

    this.paper.animationState.setAnimation(0, "paper_come", false);
    
    await delay(1000)

    this.max.animationState.setAnimation(0, "idle_smile_pallete", true);

    this.cursor = this.add.image(0, 0, 'blue-pen');
    this.cursor.setOrigin(0, 0); 
    this.cursor.setScale(0.5);
    this.cursor.setRotation(-1/4 * Math.PI);
    
    this.cursor.setDepth(999);

    // Create a container for our butterfly drawing elements
    this.container = this.add.container(1410, 450);
    const flyDrawing = this.add.image(0, 0, 'fly-drawing');
    this.graphics = this.add.graphics();
    const shape = this.add.image( 1410, 405, 'fly-done').setVisible(false);
    const mask = shape.createBitmapMask();
    const flyOverlay = this.add.image(0, 0, 'fly-overlay');
    this.container.add([this.graphics, flyDrawing, flyOverlay]);
    this.graphics.mask = mask;
    // Set depths to ensure proper layering
    this.graphics.setDepth(10);
    flyDrawing.setDepth(15);
    flyOverlay.setDepth(15);

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.cursor.x = pointer.x;
      this.cursor.y = pointer.y;
      
      if (this.isDrawing) {
        this.draw(pointer.x, pointer.y);
      }
    });
    
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        this.isDrawing = true;
        this.lastX = pointer.x;
        this.lastY = pointer.y;
    });
    
    this.input.on('pointerup', () => {
      this.isDrawing = false;
    });
      
  }

  async setupDoneGame() {
    this.paper.animationState.setAnimation(0, "paper_go", false);
    this.container.destroy()
    this.flyDoneAnimation()
    this.sound.play("0069");
    this.cursor.destroy()
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
    
    if ((totalDrawableArea - drawed  < 50 || totalDrawableArea < drawed) && !this.drawingCompleted) {
      console.log('done');
      this.drawingCompleted = true;
      delay(200).then(() => this.game.events.emit(State.DONE))
    }
  }
  
  create() {
    this.input.setDefaultCursor('none');
    
    this.camera = this.cameras.main;
    this.camera.x = -200
    this.camera.width = 3000
    
    const backgroundBase = this.add.image(1600, 540, 'background-base');
    backgroundBase.setScale(1)
    const middleBackground = this.add.image(1660, 270, 'background-middle');
    middleBackground.setScale(1)

    const foreground = this.add.image(1540, 740, 'background-foreground');
    foreground.setScale(1);
    const pond = this.add.image(2800, 700, 'pond');
    pond.setScale(1);

    this.max = this.add.spine(
      445,
      1010,
      "max-data",
      "max-atlas"
    );
    this.max.setScale(0.4)

    this.max.animationState.setAnimation(0, "idle_smile_pallete", true);
    this.max.depth = 1000

    this.game.events.on(State.START_DRAW, () => {
      this.setupStartDrawGame()
    })

    this.game.events.on(State.DONE, () => {
      this.setupDoneGame()
    })

    this.sound.play("Scene1", {
      loop: true
    });
    const initSound = this.sound.add("0001");
    const letsDraw = this.sound.add("0033")
    initSound.on("complete", () => {
      this.max.animationState.setAnimation(0, "idle_speak_pallete", false);
      letsDraw.on("complete", () => this.sound.play("0034"));
      letsDraw.play()
      this.game.events.emit(State.START_DRAW)
    })
    initSound.play();
  }

  flyDoneAnimation() {
    const fly = this.add.spine(
      245,
      1010,
      "fly-data",
      "fly-atlas"
    );
    fly.animationState.setAnimation(0, "correct_hudie_1", false);
    fly.animationState.setAnimation(1, "correct_hudie_2", false);
    fly.animationState.setAnimation(2, "correct_hudie_3", false);
    fly.animationState.setAnimation(3, "hudie_end", false);

  }

  preload() {
    this.load.image('background-base', 'assets/Arts/Image/265.png');
    this.load.image('background-middle', 'assets/Arts/Image/269.png');
    this.load.image('background-foreground', 'assets/Arts/Image/274.png');
    
    this.load.image('pond', 'assets/Arts/Image/398.png');

    this.load.image('fly-overlay', 'assets/Arts/fly_overlay.png');
    this.load.image('fly-drawing', 'assets/Arts/Image/2208.png');
    this.load.image('fly-done', 'assets/Arts/Image/fly-done.png');

    this.load.image('blue-pen', 'assets/Arts/Image/blue-pen.png');
    

    this.load.spineJson("paper-data", "assets/spine_animations/paper.json");
    this.load.spineAtlas("paper-atlas", "assets/spine_animations/paper.atlas.txt");

    this.load.spineJson("fly-data", "assets/spine_animations/fly.json");
    this.load.spineAtlas("fly-atlas", "assets/spine_animations/fly.atlas.txt");


    this.load.spineJson("tree-data", "assets/spine_animations/tree.json");
    this.load.spineAtlas("tree-atlas", "assets/spine_animations/tree.atlas.txt");


    this.load.spineBinary("max-data", "assets/spine_animations/max/people_Max_pal.skel.bytes");
    this.load.spineAtlas("max-atlas", "assets/spine_animations/max/people_Max_pal.atlas.txt");
    this.load.audio("Scene1", "assets/Sounds/BGM/mp3/Scene1.mp3");

    this.load.audio("0001", "assets/Sounds/VO/0001.wav");
    this.load.audio("0002", "assets/Sounds/VO/0002.wav");
    this.load.audio("0033", "assets/Sounds/VO/0033.wav");
    this.load.audio("0034", "assets/Sounds/VO/0034.wav");
    this.load.audio("0069", "assets/Sounds/VO/0069.wav");
  }
}
