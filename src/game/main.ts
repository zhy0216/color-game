import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
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
  scene: [Boot, Preloader, MainGame],
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
