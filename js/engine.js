// ==========================================
// 🧠 engine.js (時限爆弾撤去・安定メッセージ処理版)
// ==========================================

document.addEventListener('dblclick', function(e) { e.preventDefault(); }, { passive: false });
let lastTouchEnd = 0; document.addEventListener('touchend', function(e) { const now = (new Date()).getTime(); if (now - lastTouchEnd <= 300) { e.preventDefault(); } lastTouchEnd = now; }, { passive: false });
window.onerror = function(msg, url, line) { const msgBox = document.getElementById('msg-text'); if (msgBox) { msgBox.innerHTML = '<span style="color:#ff5555; font-size:16px;">エラー！<br>' + msg + '<br>行: ' + line + '</span>'; } return false; };

const canvas = document.getElementById('map-canvas'); const ctx = canvas ? canvas.getContext('2d') : null;
const TILE = 32; const VIEW_W = 15; const VIEW_H = 11; const TILED_FLIP_MASK = 0x0FFFFFFF;
const unWalkMain = [2, 3]; const unWalkMachi = [2, 3, 7, 10, 12, 14, 17, 18]; 

var currentMapKey = "0"; var currentMapData = null; var MAP_W = 0; var MAP_H = 0;
var player = { x: 32, y: 49, dir: 0, anim: 0 };
var fadeAlpha = 0; var worldReturn = null; 
var returnStack = []; 
var walkTimer = 0; var frameCount = 0; var lastWarpId = ""; 
window.encounterRate = 0.03; 
window.amuletSteps = 0; 
var messageTimer = null; var bMsgTimer = null; 
var isMenuOpen = false; var isGameStarted = false; 
var isBattle = false; var battleBlock = false; var currentEnemy = null;
var isCutscene = false; 
var keys = { up: false, down: false, left: false, right: false, action: false, cancel: false };

let loadedImages = 0; var isTitleReady = false;
const charaFiles = ["0.nobuyuki.tiled.png", "1.bunny.tiled.png", "2.mochi.tiled.png", "3.man.tiled.png", "4.girl.tiled.png", "5.oyaji.tiled.png", "6.man2.tiled.png"];
const totalImages = 2 + charaFiles.length; 

function checkReady() { 
    loadedImages++; 
    if (loadedImages >= totalImages && !isTitleReady) { 
        isTitleReady = true; showTitleScreen(); 
    } 
}
function catchError(e) { checkReady(); } 
setTimeout(function() { if (!isTitleReady) { isTitleReady = true; showTitleScreen(); } }, 3000);

const imgMain = new Image(); imgMain.onload = checkReady; imgMain.onerror = catchError; imgMain.src = 'img/main.tiled.png'; 
const imgMachi = new Image(); imgMachi.onload = checkReady; imgMachi.onerror = catchError; imgMachi.src = 'img/machi.tiled.png';
const charaImages = {}; charaFiles.forEach(function(file, index) { charaImages[index] = new Image(); charaImages[index].onload = checkReady; charaImages[index].onerror = catchError; charaImages[index].src = 'img/' + file; });

function showTitleScreen() {
    const ts = document.getElementById('title-text');
    if (ts) ts.style.display = 'block'; 
    const tbtn = document.getElementById('title-buttons');
    if (tbtn) { tbtn.classList.remove('hidden'); tbtn.style.display = 'flex'; }
}

window.startGame = function(isLoad) {
    if (typeof Sound !== 'undefined' && Sound.decide) Sound.decide();
    if (isLoad) {
        if (typeof loadGameData === 'function' && !loadGameData()) {
            alert("セーブデータが ありません！");
            return;
        }
        document.getElementById('title-screen').classList.add('hidden');
        if (!isGameStarted) { isGameStarted = true; startGameLoop(); }
    } else {
        currentMapKey = "1"; player.x = 16; player.y = 7; player.dir = 3;
        document.getElementById('title-screen').classList.add('hidden');
        if (!isGameStarted) { isGameStarted = true; startGameLoop(); }
        
        setTimeout(() => {
            if(typeof npcs !== 'undefined'){
                let oyaji = npcs.find(n => n.map === "1" && n.x === 16 && n.y === 5);
                if(oyaji) showMessage(oyaji.message);
            }
        }, 500);
    }
};

function loadMap(mapKey) { 
    if (typeof TileMaps === 'undefined' || !TileMaps[mapKey]) return; 
    currentMapKey = mapKey; currentMapData = TileMaps[mapKey]; 
    MAP_W = currentMapData.width; MAP_H = currentMapData.height; 
    if (["1", "2", "4", "5", "6", "17","18"].includes(mapKey)) { playerStatus.flags["visited_" + mapKey] = true; }
    if (typeof playMapBGM === 'function') playMapBGM(); 
}

function getTilesAt(x, y) {
    let res = [0];
    if (!currentMapData || !currentMapData.layers) return res;
    if (x < 0 || x >= MAP_W || y < 0 || y >= MAP_H) return res;
    currentMapData.layers.forEach(function(layer) {
        if (layer.type === "tilelayer") {
            const cleanId = (layer.data[y * MAP_W + x]) & TILED_FLIP_MASK;
            if (cleanId > 0) res.push(cleanId);
        }
    });
    return res;
}

function draw() {
    if (!ctx || !currentMapData || !currentMapData.layers) return;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const cameraX = player.x - Math.floor(VIEW_W / 2); const cameraY = player.y - Math.floor(VIEW_H / 2);
    const activeImg = (currentMapKey === "0") ? imgMain : imgMachi; const cols = Math.floor(activeImg.width / TILE) || 1; 

    for (let y = 0; y < VIEW_H; y++) {
        for (let x = 0; x < VIEW_W; x++) {
            const mapX = cameraX + x; const mapY = cameraY + y; let isDark = false;
            if (["7", "8", "9", "10", "11", "12"].includes(currentMapKey)) { const dx = x - Math.floor(VIEW_W / 2); const dy = y - Math.floor(VIEW_H / 2); if (dx * dx + dy * dy > 20) isDark = true; }
            if (isDark) { ctx.fillStyle = '#000'; ctx.fillRect(x * TILE, y * TILE, TILE, TILE); continue; }
            if (mapX >= 0 && mapX < MAP_W && mapY >= 0 && mapY < MAP_H) {
                currentMapData.layers.forEach(function(layer) {
                    if (layer.type === "tilelayer") {
                        const cleanId = (layer.data[mapY * MAP_W + mapX]) & TILED_FLIP_MASK;
                        if (cleanId > 0) { const drawId = cleanId - 1; const sx = (drawId % cols) * TILE; const sy = Math.floor(drawId / cols) * TILE; if (activeImg.complete && activeImg.naturalWidth > 0) { ctx.drawImage(activeImg, sx, sy, TILE, TILE, x * TILE, y * TILE, TILE, TILE); } }
                    }
                });
            } else { if (currentMapKey === "0" && activeImg.complete && activeImg.naturalWidth > 0) { const sx = (1 % cols) * TILE; const sy = Math.floor(1 / cols) * TILE; ctx.drawImage(activeImg, sx, sy, TILE, TILE, x * TILE, y * TILE, TILE, TILE); } else { ctx.fillStyle = '#000'; ctx.fillRect(x * TILE, y * TILE, TILE, TILE); } }
        }
    }

    if (typeof npcs !== 'undefined') {
        for (let i = 0; i < npcs.length; i++) {
            const npc = npcs[i];
            if (npc.isTanakaEvent && playerStatus.flags.defeatedTanaka) continue; 
            if (npc.isRobberEvent && playerStatus.flags.defeatedRobber) continue; 
            if (npc.isMochidaBoss && playerStatus.flags.defeatedMochida) continue; 
            if (npc.isOyajiPre && playerStatus.flags.defeatedRobber) continue;
            if (npc.isOyajiInn && !playerStatus.flags.defeatedRobber) continue;
            if (npc.isEventBoss && playerStatus.flags.defeatedGolem) continue; 

            if (npc.map === currentMapKey && !npc.hidden && !npc.noDraw) {
                const screenX = npc.x - cameraX; const screenY = npc.y - cameraY;
                if (screenX >= 0 && screenX < VIEW_W && screenY >= 0 && screenY < VIEW_H) {
                    const drawImg = charaImages[npc.imgId] || charaImages[0]; const nsx = npc.anim * TILE; const nsy = npc.dir * TILE;
                    if (drawImg.complete && drawImg.naturalWidth > 0) { ctx.drawImage(drawImg, nsx, nsy, TILE, TILE, screenX * TILE, screenY * TILE, TILE, TILE); }
                }
            }
        }
    }
    const px = Math.floor(VIEW_W / 2) * TILE; const py = Math.floor(VIEW_H / 2) * TILE; const psx = player.anim * TILE; const psy = player.dir * TILE;
    if (charaImages[0] && charaImages[0].complete && charaImages[0].naturalWidth > 0) { ctx.drawImage(charaImages[0], psx, psy, TILE, TILE, px, py, TILE, TILE); }
    if (fadeAlpha > 0) { ctx.globalAlpha = fadeAlpha; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.globalAlpha = 1.0; }
}

var msgPages = []; var currentMsgPage = 0; var isWaitingForPage = false; var battleLevelUpWait = false; 
var isMessageActive = false; var pendingAction = null;    

function showMessage(text) { 
    if (text === undefined || text === null) text = "";
    msgPages = String(text).split("<page>"); currentMsgPage = 0; isWaitingForPage = false; isMessageActive = true; playMsgPage(false); 
    const box = document.getElementById('message-box'); if(box){ box.classList.add('active'); box.style.transform = 'translateY(0)'; }
}
function showBattleMsg(text) { 
    if (text === undefined || text === null) text = "";
    msgPages = String(text).split("<page>"); currentMsgPage = 0; isWaitingForPage = false; isMessageActive = true; playMsgPage(true); 
}

function playMsgPage(isBattleMode) {
    const box = document.getElementById('msg-text'); if (!box) return; box.innerHTML = ""; 
    if (messageTimer) { clearInterval(messageTimer); messageTimer = null; } 
    if (bMsgTimer) { clearInterval(bMsgTimer); bMsgTimer = null; } 
    
    let text = msgPages[currentMsgPage] ? String(msgPages[currentMsgPage]) : ""; let i = 0; let currentHTML = "";
    let timer = setInterval(function() {
        if (i >= text.length) {
            clearInterval(timer);
            if (isBattleMode) bMsgTimer = null; else messageTimer = null; 
            
            // 💥【超重要修正】
            // 画面を勝手に閉じる時限爆弾タイマー（autoCloseMsgTimer）を完全に排除！
            // プレイヤーが必ずTAP（またはキー入力）して次に進む、超安全な設計に統一したわ！
            box.innerHTML += "<span class='blink-arrow'>▼</span>"; 
            isWaitingForPage = true; 
            return;
        }
        if (text[i] === '<') { 
            const closeIdx = text.indexOf('>', i); 
            if (closeIdx !== -1) { currentHTML += text.substring(i, closeIdx + 1); i = closeIdx + 1; } 
            else { currentHTML += text[i]; i++; } 
        } else { 
            currentHTML += text[i]; 
            if (text[i] !== ' ' && text[i] !== '　' && typeof Sound !== 'undefined' && Sound.msgTick) Sound.msgTick();
            i++; 
        }
        box.innerHTML = currentHTML;
    }, isBattleMode ? 25 : 35);
    if (isBattleMode) bMsgTimer = timer; else messageTimer = timer;
}

function hasItem(itemName) { for (let i = 0; i < playerStatus.inventory.length; i++) { if (playerStatus.inventory[i].name === itemName) return true; } return false; }

function tryAction() {
    let tx = player.x; let ty = player.y;
    if (player.dir === 0) ty += 1; else if (player.dir === 1) tx -= 1; else if (player.dir === 2) tx += 1; else if (player.dir === 3) ty -= 1;
    if (interactWithTile(tx, ty)) return;
    
    let tx2 = tx; let ty2 = ty;
    if (player.dir === 0) ty2 += 1; else if (player.dir === 1) tx2 -= 1; else if (player.dir === 2) tx2 += 1; else if (player.dir === 3) ty2 -= 1;
    if (interactWithTile(tx2, ty2)) return; 
    
    showMessage("目の前 を しらべた！<br>しかし なにも なかった。");
}

function interactWithTile(targetX, targetY) {
    if (typeof npcs !== 'undefined') {
        for (let i = 0; i < npcs.length; i++) {
            const npc = npcs[i];
            
            if (npc.isOyajiPre && playerStatus.flags.defeatedRobber) continue;
            if (npc.isOyajiInn && !playerStatus.flags.defeatedRobber) continue;

            if (npc.map === currentMapKey && npc.x === targetX && npc.y === targetY && !npc.hidden) {
                if (!npc.noDraw) { if (player.dir === 0) npc.dir = 3; else if (player.dir === 1) npc.dir = 2; else if (player.dir === 2) npc.dir = 1; else if (player.dir === 3) npc.dir = 0; draw(); }
                
                if (npc.isOyajiStart) {
                    showMessage(npc.message);
                    if (playerStatus.flags.gameClear) {
                        pendingAction = () => {
                            if (typeof playFinalMovie === 'function') playFinalMovie();
                        };
                    }
                    return true;
                }

                if (npc.isOyajiPre) {
                    if (!playerStatus.flags.defeatedRobber) { showMessage(npc.message); } return true;
                }

                if (npc.isOyajiInn) {
                    if (!playerStatus.flags.bossKey1) {
                        if (!playerStatus.flags.hasMFA) {
                            showMessage("親父「おお、のぶゆき！<br>さっきは 助けてくれて ありがとうな。<page>あのままだったら、ワシ、<br>ネギと一緒に 刻まれるところじゃったわい！<page>お礼に ボスのキーコード1を<br>渡したいんじゃが……<page>お前、MFAを持っておらんのか。<page>MFAを手に入れたら<br>また 後で来なさい。」");
                        } else {
                            playerStatus.flags.bossKey1 = true;
                            if (typeof Sound !== 'undefined' && Sound.itemGet) Sound.itemGet();
                            showMessage("親父「おお、のぶゆき！<br>さっきは 助けてくれて ありがとうな。<page>あのままだったら、ワシ、<br>ネギと一緒に 刻まれるところじゃったわい！<page>お礼に ワシが隠し持っていた ボスのキーコード1を<br>お前のMFAに 書き込んでおいたぞ！<page>それと、ここは<br>ワシが仕切ってる 秘密の宿屋じゃ。<page>お前なら 通常価格の 50G で<br>泊めてやるぞ！<page>どうじゃ？ 泊まっていくか？」");
                            pendingAction = () => { if(typeof openInn === 'function') openInn(npc.innPrice); };
                        }

                    } else {
                        pendingAction = () => { if(typeof openInn === 'function') openInn(npc.innPrice); }; 
                        showMessage(npc.message);
                    }
                    return true;
                }

                if (npc.shopId) { pendingAction = () => { if(typeof openShop === 'function') openShop(npc.shopId); }; showMessage(npc.message || "いらっしゃい！"); return true; }
                if (npc.innPrice) { pendingAction = () => { if(typeof openInn === 'function') openInn(npc.innPrice); }; showMessage(npc.message); return true; }

                if (npc.isBank) { 
                    pendingAction = () => { if(typeof openBank === 'function') openBank(); }; 
                    showMessage(npc.message); 
                    return true; 
                }

                if (npc.isDoor) { if (npc.requiredEquip) { if (playerStatus.equipment.accessory && playerStatus.equipment.accessory.name === npc.requiredEquip) { npc.hidden = true; showMessage("セキュリティを 解除しました！<br>とびらが ひらいた！"); draw(); return true; } else { showMessage(npc.message); return true; }                } else if (npc.requiredKey) { 
                    if (hasItem(npc.requiredKey)) { 
                        npc.hidden = true; 
                        if (typeof Sound !== 'undefined' && Sound.magic) Sound.magic(); 
                        showMessage(npc.requiredKey + " を つかった！<br>とびらが ひらいた！"); 
                        draw(); 
                        return true; 
                    } else { 
                        if (npc.requiredKey === "家の鍵") {
                            showMessage("おかしいな、ゲオに 落としてきたかな……？<page>カギが かかっている。");
                        } else {
                            showMessage(npc.message); 
                        }
                        return true; 
                    } 
                }
}
                
                if (npc.isRandomChest) {
                    if (!npc.opened) {
                        npc.opened = true;
                        let rand = Math.random(); 
                        
                        if (rand < 0.333) {
                            const itemData = itemMaster.items[0]; 
                            playerStatus.inventory.push(JSON.parse(JSON.stringify(itemData)));
                            if (typeof Sound !== 'undefined' && Sound.itemGet) Sound.itemGet();
                            showMessage("たからばこ を あけた！<page>なんと しゃんてぃ を てにいれた！");
                        } else if (rand < 0.666) {
                            playerStatus.gold += 1000;
                            if (typeof updateMiniStatus === 'function') updateMiniStatus();
                            if (typeof Sound !== 'undefined' && Sound.itemGet) Sound.itemGet();
                            showMessage("たからばこ を あけた！<page>やった！ 1000 ゴールド を てにいれた！");
                        } else {
                            showMessage("たからばこ を あけた！<page>しかし なかみは でびっと だった！");
                            pendingAction = () => { setTimeout(() => startBattle("mimic"), 500); };
                        }
                    } else {
                        showMessage("たからばこ は からっぽ だ。");
                    }
                    return true;
                }

                if (npc.chestItem && npc.chestItem.type === "gold") { if (!npc.opened) { npc.opened = true; playerStatus.gold += npc.chestItem.amount; if(typeof updateMiniStatus === 'function') updateMiniStatus(); if (typeof Sound !== 'undefined' && Sound.itemGet) Sound.itemGet(); showMessage("たからばこ を あけた！<page>" + npc.chestItem.amount + " ゴールド を てにいれた！"); } else { showMessage("たからばこ は からっぽ だ。"); } return true; }

                if (npc.chestItem) { 
                    if (!npc.opened) { 
                        npc.opened = true; 
                        const itemData = itemMaster[npc.chestItem.type][npc.chestItem.index]; 
                        playerStatus.inventory.push(JSON.parse(JSON.stringify(itemData))); 
                        
                        if (itemData.name === "黄金剣" || itemData.name === "黄金スーツ") {
                            if (typeof Sound !== 'undefined' && Sound.densetsu) Sound.densetsu(); 
                        } else {
                            if (typeof Sound !== 'undefined' && Sound.itemGet) Sound.itemGet(); 
                        }

                        if (npc.isMFA) {
                            playerStatus.flags.hasMFA = true; 
                            showMessage("たからばこ を あけた！<page>" + itemData.name + " を てにいれた！<page>MFA……どうやら『もっちー・フライ・アウェイ』の 略らしい。<page>このアイテムを持っていれば、外（フィールド）で メニューの「MFA」を使うことで、一瞬で 自宅へ ワープできるぞ！");
                        } else {
                            showMessage("たからばこ を あけた！<page>" + itemData.name + " を てにいれた！"); 
                        }
                    } else { 
                        showMessage("たからばこ は からっぽ だ。"); 
                    } 
                    return true; 
                }
                                 if (npc.isMFAUpgrade) { 
                    if (!npc.opened) { 
                        npc.opened = true; playerStatus.flags.mfaVersion = 2; 
                        if (typeof Sound !== 'undefined' && Sound.itemGet) Sound.itemGet(); 
                        showMessage(npc.message); 
                    } else { 
                        showMessage("もちだ「これで どこでも いける もちね！」"); 
                    } 
                    return true; 
                }

                if (npc.isGeouKey) { if (!npc.opened) { npc.opened = true; playerStatus.inventory.push({ name: "家の鍵", type: "item", price: 0 }); if (typeof Sound !== 'undefined' && Sound.itemGet) Sound.itemGet(); showMessage(npc.message + "<page>家の鍵 を てにいれた！"); } else { showMessage("昔、ここのアダルトコーナーには たいへん お世話になったんじゃ……。"); } return true; }

                if (npc.isRobberEvent) { if (!playerStatus.flags.defeatedRobber) { showMessage(npc.message); pendingAction = () => { setTimeout(() => startBattle("robber"), 500); }; } return true; }
                
                if (npc.isBossKey2) { if (!playerStatus.flags.hasMFA) { showMessage("裏サーバーの 端末がある。<page>しかし MFAがないため アクセスできない！"); } else if (!npc.opened) { npc.opened = true; playerStatus.flags.bossKey2 = true; if (typeof Sound !== 'undefined' && Sound.itemGet) Sound.itemGet(); showMessage(npc.message); } else { showMessage("サーバーの データは すでに ダウンロード済みだ。"); } return true; }

                if (npc.isBossKey3) { 
                    if (!playerStatus.flags.hasMFA) { 
                        showMessage("あの インド人みたいな男に<br>監禁されていたの……。<page>助けてくれて ありがとう。<br>お礼をしたいけど、あなた MFAを<br>持っていないのね……。<page>MFAを手に入れたら<br>また 後で来なさい。"); 
                    } else if (!npc.opened) { 
                        npc.opened = true; playerStatus.flags.bossKey3 = true; if (typeof Sound !== 'undefined' && Sound.itemGet) Sound.itemGet(); showMessage(npc.message); 
                    } else { 
                        showMessage("無事に 逃げ出せそうよ。ありがとう！<page>そうだ、魔王を 倒すつもりなら、<br>南西の街にある『黄金スーツ』が<br>絶対に 必要よ。<page>でも 気をつけて。<br>最近、あやしい男が その街に<br>住み着いている らしいわ……。"); 
                    } 
                    return true; 
                }

                if (npc.isMochidaBoss) { if (!playerStatus.flags.defeatedMochida) { showMessage(npc.message); pendingAction = () => { setTimeout(() => startBattle("mochida_boss"), 500); }; } return true; }
                
                if (npc.isTanakaEvent) { if (!playerStatus.flags.defeatedTanaka) { showMessage(npc.message); pendingAction = () => { if(confirm("罰金(1000G)を払いますか？ キャンセルで戦闘！")) { if(playerStatus.gold >= 1000) { playerStatus.gold -= 1000; updateMiniStatus(); showMessage("まいどあり！ 次からは 気をつけな！"); draw(); } else { showMessage("金がねえなら 痛い目みてもらうぜ！"); setTimeout(() => startBattle("tanaka"), 1000); } } else { setTimeout(() => startBattle("tanaka"), 500); } }; } return true; }
                if (npc.isTrueBoss) { showMessage(npc.message); pendingAction = () => { setTimeout(() => startBattle("true_boss"), 500); }; return true; }
                
                if (npc.isMochidaLassi) { 
                    showMessage(npc.message); 
                    pendingAction = () => { 
                        if (typeof Sound !== 'undefined' && Sound.heal) Sound.heal(); 
                        playerStatus.mp = playerStatus.maxMp; 
                        if(typeof updateMiniStatus === 'function') updateMiniStatus(); 
                        
                        const container = document.getElementById('game-container'); 
                        if (container) {
                            const flash = document.createElement('div'); 
                            flash.style.position = 'absolute'; flash.style.inset = '0'; 
                            flash.style.background = 'rgba(50, 255, 50, 0.4)'; 
                            flash.style.zIndex = '999'; flash.style.pointerEvents = 'none'; 
                            flash.style.transition = 'opacity 0.4s ease-out'; 
                            container.appendChild(flash); 
                            setTimeout(() => { flash.style.opacity = '0'; setTimeout(() => { if(container.contains(flash)) container.removeChild(flash); }, 400); }, 50);
                        }
                        
                        setTimeout(() => { 
                            showMessage("のぶゆき は バナナらっしー を 飲んだ！<page>あまくて おいしい！<br>のぶゆき の MP が まんたんに なった！"); 
                        }, 100); 
                    }; 
                    return true; 
                }

                if (npc.isMochidaHouseInn) {
                    showMessage(npc.message);
                    pendingAction = () => {
                        const container = document.getElementById('game-container');
                        const fade = document.createElement('div');
                        fade.style.position = 'absolute'; fade.style.inset = '0'; fade.style.background = '#000';
                        fade.style.zIndex = '999'; fade.style.opacity = '0'; fade.style.transition = 'opacity 1s';
                        container.appendChild(fade);
                        
                        setTimeout(() => fade.style.opacity = '1', 50); 
                        
                        setTimeout(() => {
                            if (typeof Sound !== 'undefined' && Sound.heal) Sound.heal();
                            playerStatus.hp = playerStatus.maxHp;
                            playerStatus.mp = playerStatus.maxMp;
                            if(typeof updateMiniStatus === 'function') updateMiniStatus();
                            fade.style.opacity = '0'; 
                            
                            setTimeout(() => {
                                if (container.contains(fade)) container.removeChild(fade);
                                showMessage("翌朝……。<page>もちだ「おはよう。<br>特製の バナナらっしー だ。<br>飲んでいきな。」<page>のぶゆき は バナナらっしー を 飲んだ！<br>あまくて おいしい！<page>のぶゆき の HP と MP が<br>まんたんに なった！");
                            }, 1000);
                        }, 2000);
                    };
                    return true;
                }
                
                showMessage(npc.message); return true;
            }
        }
    }
    return false;
}

function flashPoison() { const container = document.getElementById('game-container'); const f = document.createElement('div'); f.style.position = 'absolute'; f.style.inset = '0'; f.style.background = 'rgba(255,0,0,0.5)'; f.style.zIndex = '55'; container.appendChild(f); setTimeout(() => { if(container.contains(f)) container.removeChild(f); }, 150); }

function tryMove(dx, dy) {
    let targetDir = player.dir;
    if (dy === 1) targetDir = 0; else if (dx === -1) targetDir = 1; else if (dx === 1) targetDir = 2; else if (dy === -1) targetDir = 3; 
    
    if (player.dir !== targetDir) { player.dir = targetDir; draw(); }
    player.anim = (player.anim === 0) ? 1 : 0;
    
    const nextX = player.x + dx; const nextY = player.y + dy;

    if (typeof npcs !== 'undefined') {
        for (let i = 0; i < npcs.length; i++) {
            const npc = npcs[i];
            if (npc.isTanakaEvent && playerStatus.flags.defeatedTanaka) continue; 
            if (npc.isRobberEvent && playerStatus.flags.defeatedRobber) continue; 
            if (npc.isMochidaBoss && playerStatus.flags.defeatedMochida) continue; 
            if (npc.isOyajiPre && playerStatus.flags.defeatedRobber) continue;
            if (npc.isOyajiInn && !playerStatus.flags.defeatedRobber) continue;
            if (npc.isEventBoss && playerStatus.flags.defeatedGolem) continue; 

            if (npc.map === currentMapKey && npc.x === nextX && npc.y === nextY && !npc.hidden && !npc.isStepEvent) return; 
        } 
    }
    
    if (currentMapKey === "0" && nextX === 35 && nextY === 76) { 
        if (!playerStatus.flags.bridgeUnlocked) {
            if (!playerStatus.flags.bossKey1 || !playerStatus.flags.bossKey2 || !playerStatus.flags.bossKey3) { 
                showMessage("MFAキーコードが 不足しています。(キーコード1,2,3が必要)<page>通行する 資格が ありません。"); return; 
            } else {
                if (typeof Sound !== 'undefined' && Sound.magic) Sound.magic(); 
                showMessage("セキュリティゲート に アクセス中……<page>キーコード1…… 認証完了。<br>キーコード2…… 認証完了。<br>キーコード3…… 認証完了。<page>MFA フル・アクセス 承認。<br>魔王城への ルートを 解放します！");
                playerStatus.flags.bridgeUnlocked = true;
                return; 
            }
        }
    }

    if (nextX < 0 || nextX >= MAP_W || nextY < 0 || nextY >= MAP_H) { 
        if (currentMapKey !== "0") { 
            let rx = 19, ry = 37; 
            if (worldReturn) { rx = worldReturn.x; ry = worldReturn.y; }
            else if (currentMapKey === "1") { rx = 32; ry = 50; } 
            else if (currentMapKey === "2") { rx = 27; ry = 29; } 
            else if (currentMapKey === "4") { rx = 105; ry = 14; } 
            else if (currentMapKey === "5") { rx = 54; ry = 24; } 
            else if (currentMapKey === "6") { rx = 81; ry = 77; } 
            else if (currentMapKey === "17") { rx = 54; ry = 97; } 
            else if (currentMapKey === "18") { rx = 38; ry = 80; }
            showMessage("外に出た！"); loadMap("0"); player.x = rx; player.y = ry; fadeAlpha = 1.0; draw(); 
        } 
        return; 
    }

    
    const nextTiles = getTilesAt(nextX, nextY); const topTile = nextTiles[nextTiles.length - 1]; const activeUnwalkable = (currentMapKey === "0") ? unWalkMain : unWalkMachi;

    if (!activeUnwalkable.includes(topTile)) {
        player.x = nextX; player.y = nextY; let warped = false;
        
        if (typeof npcs !== 'undefined') { 
            for (let i = 0; i < npcs.length; i++) { 
                const stepNpc = npcs[i]; 

                if (stepNpc.map === currentMapKey && stepNpc.x === player.x && stepNpc.y === player.y) {
                    if (stepNpc.isStepEvent) {
                        if (stepNpc.isEventBoss) {
                            if (!playerStatus.flags.defeatedGolem) {
                                showMessage(stepNpc.message);
                                pendingAction = () => { setTimeout(() => startBattle(stepNpc.bossId), 500); };
                            }
                        } else if (stepNpc.isGoldBall) {
                            if (!stepNpc.opened) {
                                stepNpc.opened = true;
                                playerStatus.inventory.push({ name: "黄金球", type: "accessory", atk: 0, def: 0, price: 10000 });
                                if (typeof Sound !== 'undefined' && Sound.itemGet) Sound.itemGet();
                                showMessage(stepNpc.message + "<page>なんと 黄金球 を てにいれた！");
                            }
                        } else {
                            showMessage(stepNpc.message);
                        }
                    }
                }
            } 
        }

        if (typeof warpZones !== 'undefined') {
            for (let i = 0; i < warpZones.length; i++) {
                const w = warpZones[i];
                if (w.fromMap === currentMapKey && w.fromX === player.x && w.fromY === player.y) {
                    if (w.isWorldReturn) { 
                        if (worldReturn) { loadMap(worldReturn.map); player.x = worldReturn.x; player.y = worldReturn.y; }
                        else { loadMap("0"); player.x = 19; player.y = 37; } 
                        fadeAlpha = 1.0; 
                    } 
                    else if (w.isDynamicReturn) { 
                        if (returnStack.length > 0) { let ret = returnStack.pop(); loadMap(ret.map); player.x = ret.x; player.y = ret.y; }
                        else { loadMap("0"); player.x = 19; player.y = 37; } 
                        fadeAlpha = 1.0; 
                    } 
                    else { 
                        lastWarpId = w.id || "unknown"; 
                        if (currentMapKey === "0") worldReturn = { map: "0", x: player.x, y: player.y }; 
                        if (w.saveReturn) returnStack.push({ map: currentMapKey, x: player.x, y: player.y }); 
                        loadMap(w.toMap); player.x = w.toX; player.y = w.toY; fadeAlpha = 1.0; 
                    }
                    warped = true; break;
                }
            }
        }
        
        if (!warped && currentMapKey === "13" && player.x === 5 && player.y === 9) {
            loadMap("12"); player.x = 5; player.y = 5; fadeAlpha = 1.0; warped = true;
        }

        draw();
        
        if (!warped && window.amuletSteps > 0) {
            window.amuletSteps--;
            if (window.amuletSteps === 0) {
                showMessage("インド魔除け の スパイスの香りが<br>きえてしまった……。(効果切れ)");
            }
        }

        const encounterMaps = ["0", "3", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];

        if (!warped && encounterMaps.includes(currentMapKey)) { 
            let encRate = (currentMapKey === "0") ? window.encounterRate : 0.04;
            
            if (currentMapKey === "0" && window.amuletSteps > 0) {
                encRate = 0;
            }
            
            if (encRate > 0 && Math.random() < encRate) { 
                if(typeof startBattle === 'function') startBattle(); 
                return; 
            }
        }

        if (!warped) {
            let hasGoldenSuit = (playerStatus.equipment.armor && playerStatus.equipment.armor.name === "黄金スーツ");
            
            if (currentMapKey === "0" && topTile === 4) { 
                if (!hasGoldenSuit) {
                    playerStatus.hp -= 2; if (playerStatus.hp <= 0) playerStatus.hp = 1; flashPoison(); 
                }
            }
            
            if (hasGoldenSuit && playerStatus.hp > 0 && playerStatus.hp < playerStatus.maxHp) {
                playerStatus.hp += 1; if (playerStatus.hp > playerStatus.maxHp) playerStatus.hp = playerStatus.maxHp;
            }
            
            if(typeof updateMiniStatus === 'function') updateMiniStatus(); 
        }

        if (!warped && !isMessageActive) { const boxText = document.getElementById('msg-text'); if (boxText) boxText.innerHTML = "現在地: MAP " + currentMapKey + " (X:" + player.x + " Y:" + player.y + ")"; }
    }
}

function startGameLoop() {
    loadMap(currentMapKey); 
    if(typeof calcPlayerStats === 'function') calcPlayerStats(); 
    if(typeof updateMiniStatus === 'function') updateMiniStatus(); 
    draw();
    
    if(currentMapKey === "0" || window.returnStack.length > 0) {
        showMessage("全システム オンライン。<br>広大な よつかいどう を歩き回れ！");
    }

    setInterval(function() {
        if (isMenuOpen || isBattle || isCutscene) return; 
        if (fadeAlpha > 0) { fadeAlpha -= 0.05; if (fadeAlpha < 0) fadeAlpha = 0; draw(); }
        frameCount++;
        
        if (frameCount % 20 === 0) { 
            let needsDraw = false;
            if (typeof npcs !== 'undefined') {
                for (let i = 0; i < npcs.length; i++) {
                    const npc = npcs[i]; if (npc.map !== currentMapKey || npc.hidden) continue;
                    npc.anim = (npc.anim === 0) ? 1 : 0; needsDraw = true;
                    if (Math.random() < 0.02 && !npc.isStatic && !npc.noDraw && !npc.isStepEvent) {
                        const d = Math.floor(Math.random() * 4); npc.dir = d; let nx = npc.x, ny = npc.y;
                        if (d === 0) ny++; else if (d === 1) nx--; else if (d === 2) nx++; else if (d === 3) ny--;
                        const tiles = getTilesAt(nx, ny); const top = tiles[tiles.length - 1]; const unwalk = (currentMapKey === "0") ? unWalkMain : unWalkMachi; let hit = unwalk.includes(top); if (nx === player.x && ny === player.y) hit = true;
                        for (let j = 0; j < npcs.length; j++) { const other = npcs[j]; if (other !== npc && other.map === currentMapKey && other.x === nx && other.y === ny && !other.hidden) hit = true; }
                        if (!hit && nx >= 0 && nx < MAP_W && ny >= 0 && ny < MAP_H) { npc.x = nx; npc.y = ny; }
                    }
                }
            }
            if (needsDraw) draw();
        }
        if (walkTimer > 0) { walkTimer--; return; }
        
        let speed = 10; 
        let walkDx = 0, walkDy = 0; 
        if (keys.up) walkDy = -1; else if (keys.down) walkDy = 1; else if (keys.left) walkDx = -1; else if (keys.right) walkDx = 1;
        
        if (walkDx !== 0 || walkDy !== 0) { tryMove(walkDx, walkDy); walkTimer = speed; }
    }, 16); 
}

window.addEventListener('keydown', function(e) { if (isCutscene) return; if (e.key === 'ArrowUp') keys.up = true; if (e.key === 'ArrowDown') keys.down = true; if (e.key === 'ArrowLeft') keys.left = true; if (e.key === 'ArrowRight') keys.right = true; if (e.key === 'z' || e.key === 'Z' || e.key === ' ' || e.key === 'Enter') { if (!keys.action && !isMessageActive) tryAction(); keys.action = true; } }); window.addEventListener('keyup', function(e) { if (e.key === 'ArrowUp') keys.up = false; if (e.key === 'ArrowDown') keys.down = false; if (e.key === 'ArrowLeft') keys.left = false; if (e.key === 'ArrowRight') keys.right = false; if (e.key === 'z' || e.key === 'Z' || e.key === ' ' || e.key === 'Enter') keys.action = false; });
const dpad = document.getElementById('d-pad'); if (dpad) { let activeTouchId = null; let isTouchDevice = false; const resetKeys = function() { keys.up = keys.down = keys.left = keys.right = false; document.querySelectorAll('.d-btn').forEach(function(b) { b.classList.remove('active'); }); }; const handleMove = function(clientX, clientY) { if(isCutscene) return; resetKeys(); const rect = dpad.getBoundingClientRect(); const centerX = rect.left + rect.width / 2; const centerY = rect.top + rect.height / 2; const dx = clientX - centerX; const dy = clientY - centerY; if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return; if (Math.abs(dx) > Math.abs(dy)) { if (dx > 0) { keys.right = true; document.getElementById('btn-right').classList.add('active'); } else { keys.left = true; document.getElementById('btn-left').classList.add('active'); } } else { if (dy > 0) { keys.down = true; document.getElementById('btn-down').classList.add('active'); } else { keys.up = true; document.getElementById('btn-up').classList.add('active'); } } }; dpad.addEventListener('touchstart', function(e) { e.preventDefault(); isTouchDevice = true; const touch = e.changedTouches[0]; activeTouchId = touch.identifier; handleMove(touch.clientX, touch.clientY); }, {passive: false}); dpad.addEventListener('touchmove', function(e) { e.preventDefault(); for (let i = 0; i < e.touches.length; i++) { if (e.touches[i].identifier === activeTouchId) { handleMove(e.touches[i].clientX, e.touches[i].clientY); break; } } }, {passive: false}); const endTouch = function(e) { e.preventDefault(); for (let i = 0; i < e.changedTouches.length; i++) { if (e.changedTouches[i].identifier === activeTouchId) { activeTouchId = null; resetKeys(); break; } } }; dpad.addEventListener('touchend', endTouch); dpad.addEventListener('touchcancel', endTouch); let isDragging = false; dpad.addEventListener('mousedown', function(e) { if (isTouchDevice) return; isDragging = true; handleMove(e.clientX, e.clientY); }); window.addEventListener('mousemove', function(e) { if (isTouchDevice || !isDragging) return; handleMove(e.clientX, e.clientY); }); window.addEventListener('mouseup', function() { if (isTouchDevice || !isDragging) return; isDragging = false; resetKeys(); }); }

const msgBox = document.getElementById('message-box'); 
if (msgBox) { 
    const tapMessage = function(e) { 
        e.preventDefault(); 
        if (isCutscene) return; 
        
        // 💥 メッセージの送り処理（完全にプレイヤー主導！）
        if (isBattle) {
            if (bMsgTimer) return; 
            if (isWaitingForPage) { 
                isWaitingForPage = false; 
                if (currentMsgPage >= msgPages.length - 1 && battleLevelUpWait) { 
                    battleLevelUpWait = false; if(typeof endBattle === 'function') endBattle(); return; 
                } 
                currentMsgPage++; playMsgPage(true); return; 
            }
            return;
        }

        if (isMessageActive) {
            if (messageTimer) return; 
            if (isWaitingForPage) {
                if (currentMsgPage < msgPages.length - 1) {
                    isWaitingForPage = false; currentMsgPage++; playMsgPage(false); 
                } else {
                    isWaitingForPage = false; isMessageActive = false; 
                    msgBox.classList.remove('active'); msgBox.style.transform = 'translateY(0)'; 
                    const boxText = document.getElementById('msg-text'); 
                    if (boxText) boxText.innerHTML = "現在地: MAP " + currentMapKey + " (X:" + player.x + " Y:" + player.y + ")"; 
                    if (pendingAction) { let action = pendingAction; pendingAction = null; action(); }
                }
            }
            return;
        }
        tryAction(); 
    }; 
    msgBox.addEventListener('touchstart', tapMessage, {passive: false}); msgBox.addEventListener('mousedown', tapMessage); 
}

document.addEventListener('touchmove', function(e) { if (!isMenuOpen && !isMessageActive) { e.preventDefault(); } }, { passive: false });
window.loadMap = loadMap; window.draw = draw; window.showMessage = showMessage; window.showBattleMsg = showBattleMsg;

window.playMapBGM = function() {
    if (typeof Sound === 'undefined' || isBattle) return;
    if (currentMapKey === "0") Sound.playBGM('field');
    else if (currentMapKey === "1" || currentMapKey === "2" || currentMapKey === "18") Sound.playBGM('town1'); 
    else if (currentMapKey === "4") Sound.playBGM('town2'); 
    else if (currentMapKey === "5") Sound.playBGM('town3'); 
    else if (currentMapKey === "6") Sound.playBGM('town4'); 
    else if (currentMapKey === "17") Sound.playBGM('town5'); 
    else if (["3", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"].includes(currentMapKey)) Sound.playBGM('danjon');
    else Sound.stopBGM(); 
};

window.showWorldMap = function() {
    const mapData = TileMaps["0"]; 
    if (!mapData) { alert("地図データが 壊れているようです。"); return; }
    const container = document.getElementById('game-container');
    const mapOverlay = document.createElement('div');
    mapOverlay.id = 'minimap-overlay';
    mapOverlay.style.position = 'absolute'; mapOverlay.style.inset = '0';
    mapOverlay.style.background = 'rgba(0,0,0,0.95)'; mapOverlay.style.zIndex = '100';
    mapOverlay.style.display = 'flex'; mapOverlay.style.flexDirection = 'column';
    mapOverlay.style.alignItems = 'center'; mapOverlay.style.justifyContent = 'center';
    mapOverlay.innerHTML = "<div style='color:#aaffaa; margin-bottom:10px; font-size:18px;'>【よつかいどう 全体マップ】</div>";

    const canvas = document.createElement('canvas');
    let scale = mapData.width > 100 ? 2 : 4; 
    canvas.width = mapData.width * scale; canvas.height = mapData.height * scale;
    canvas.style.border = "2px solid #fff"; canvas.style.imageRendering = "pixelated";
    const ctx = canvas.getContext('2d');
    const activeUnwalk = unWalkMain;

    for (let y = 0; y < mapData.height; y++) {
        for (let x = 0; x < mapData.width; x++) {
            let top = 1;
            mapData.layers.forEach(layer => {
                if (layer.type === "tilelayer") {
                    const cleanId = (layer.data[y * mapData.width + x]) & TILED_FLIP_MASK;
                    if (cleanId > 0) top = cleanId;
                }
            });
            if (activeUnwalk.includes(top)) { ctx.fillStyle = '#0033aa'; } 
            else if (top === 4) { ctx.fillStyle = '#aa00aa'; } 
            else if (top === 5 || top === 6 || top === 9) { ctx.fillStyle = '#aaaa00'; } 
            else { ctx.fillStyle = '#00aa00'; } 
            ctx.fillRect(x * scale, y * scale, scale, scale);
        }
    }

    let isVisible = true;
    let blinkTimer = setInterval(() => {
        if (!document.getElementById('minimap-overlay')) { clearInterval(blinkTimer); return; }
        if (currentMapKey === "0") {
            ctx.fillStyle = isVisible ? '#ff0000' : '#ffffff';
            ctx.fillRect(player.x * scale - Math.floor(scale/2), player.y * scale - Math.floor(scale/2), scale * 2, scale * 2);
            isVisible = !isVisible;
        }
    }, 500);

    mapOverlay.appendChild(canvas);
    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = "とじる"; closeBtn.style.marginTop = "15px"; closeBtn.style.padding = "8px 20px";
    closeBtn.style.background = "#555"; closeBtn.style.border = "1px solid #fff";
    closeBtn.style.cursor = "pointer"; closeBtn.style.borderRadius = "4px";
    closeBtn.onclick = () => { clearInterval(blinkTimer); container.removeChild(mapOverlay); };
    mapOverlay.appendChild(closeBtn); container.appendChild(mapOverlay);
};
