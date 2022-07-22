import { boardsManager } from "./controller/boardsManager.js";
import {addEventOnBin} from "./model/cards.js";
import util from "./util/util.js";

async function init() {
  await boardsManager.loadBoards();
  util.wait(300).then(() => addEventOnBin());
}

await init();
