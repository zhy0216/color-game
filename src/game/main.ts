import { Game as MainGame } from './scenes/Game';
import { AUTO, Game } from 'phaser';
import * as spine from "@esotericsoftware/spine-phaser"


//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 2500,
  height: 960,
  zoom: 0.4,
  parent: 'game-container',
  backgroundColor: '#028af8',
  scene: [MainGame],
  autoFocus: true,
  plugins: {
    scene: [
        { key: "spine.SpinePlugin", plugin: spine.SpinePlugin, mapping: "spine" }
    ]
  }
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
