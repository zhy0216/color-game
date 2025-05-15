import { Scene } from 'phaser';

export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('background-base', 'assets/Arts/Image/265.png');
    this.load.image('background-middle', 'assets/Arts/Image/269.png');
    this.load.image('background-foreground', 'assets/Arts/Image/274.png');
    
    // // Pond element - size: 1483x479, position: x:1233.5, y:-204.5
    this.load.image('pond', 'assets/Arts/Image/398.png');

    this.load.image('fly-overlay', 'assets/Arts/fly_overlay.png');
    this.load.image('fly-drawing', 'assets/Arts/Image/2208.png');
    this.load.image('blue-pen', 'assets/Arts/Image/blue-pen.png');



    this.load.spineJson("paper-data", "assets/spine_animations/paper.json");
    this.load.spineAtlas("paper-atlas", "assets/spine_animations/paper.atlas.txt");

    this.load.spineJson("fly-data", "assets/spine_animations/fly.json");
    this.load.spineAtlas("fly-atlas", "assets/spine_animations/fly.atlas.txt");
    // this.load.image('lily-pad', 'assets/Arts/Image/图层 174 拷贝荷叶.png');
    
    // // Environment elements - proper paths and correct asset values
    // this.load.image('grass-1', 'assets/Arts/Image/图层 402草-1.png');
    // this.load.image('grass-2', 'assets/Arts/Image/图层 403草-1.png');
    // this.load.image('grass-3', 'assets/Arts/Image/图层 404草-1.png');
    // this.load.image('grass-4', 'assets/Arts/Image/图层 804草-1.png'); // size: 72x69, position: x:849, y:-36.5
    // this.load.image('grass-5', 'assets/Arts/Image/图层 805草-1.png'); // size: 79x219, position: x:837.5, y:38.5
    // this.load.image('grass-6', 'assets/Arts/Image/图层 807草-1.png');
    
    // // Trees and plants
    // this.load.image('apple-tree', 'assets/Arts/Image/图层 852苹果树.png');
    // this.load.image('apple-tree-small', 'assets/Arts/Image/图层 309苹果树.png');
    // this.load.image('flower-pot', 'assets/Arts/Image/图层 840花盆.png');
    // this.load.image('flower-pot-small', 'assets/Arts/Image/图层 749花盆-小图.png');
    // this.load.image('flower-pot-tiny', 'assets/Arts/Image/图层 1595 拷贝花盆-小图.png');
    
    // // Color subjects (objects to color)
    // this.load.image('apple-drawing', 'assets/Arts/Image/图层 2209苹果画.png');
    // this.load.image('flower-drawing', 'assets/Arts/Image/图层 2210黄花画.png');
    // this.load.image('frog-drawing', 'assets/Arts/Image/图层 2211青蛙画.png');
    // this.load.image('butterfly-drawing', 'assets/Arts/Image/图层 2208蝴蝶画.png');
    
    // // Color palette and tools
    // this.load.image('color-palette', 'assets/Arts/Image/图层 2312调色盘.png');
    // this.load.image('paintbrush-1', 'assets/Arts/Image/组 17画笔.png');
    // this.load.image('paintbrush-2', 'assets/Arts/Image/组 18画笔.png');
    // this.load.image('paintbrush-3', 'assets/Arts/Image/组 18 拷贝画笔.png');
    // this.load.image('paintbrush-4', 'assets/Arts/Image/组 18 拷贝 2画笔.png');
    // this.load.image('paintbrush-5', 'assets/Arts/Image/组 18 拷贝 3画笔.png');
    // this.load.image('pencil', 'assets/Arts/Image/铅笔 拷贝 5画笔.png');
    
    // // Character
    // this.load.image('max', 'assets/Arts/Image/调色盘 拷贝 4max.png');
    
    // // These environment props are already loaded with the proper paths above
    // // We're leaving the basket element which wasn't loaded before
    // this.load.image('basket', 'assets/Arts/Image/篮子 拷贝果篮.png');
    
    // // Flowers
    // this.load.image('flower-1', 'assets/Arts/Image/图层 1073花 拷贝 26.png');
    // this.load.image('flower-2', 'assets/Arts/Image/图层 1074花 拷贝 26.png');
    // this.load.image('flower-3', 'assets/Arts/Image/图层 1099花 拷贝 26.png');
    // this.load.image('flower-4', 'assets/Arts/Image/图层 1100花 拷贝 26.png');
    
    // // Progress bar elements
    // this.load.image('progress-bar-outline', 'assets/Arts/Image/图层 1638进度条.png');
    // this.load.image('progress-bar-fill', 'assets/Arts/Image/图层 1641进度条.png');
    // this.load.image('progress-bar-frame', 'assets/Arts/Image/图层 312 拷贝 2进度条.png');
  }

  create() {
    this.scene.start('Preloader');
  }
}
