// ==========================================
// ⚔️ battle.js (シンプルで最強な処理連動版)
// ==========================================

function triggerEncounterEffect(callback) {
    if(typeof Sound !== 'undefined' && Sound.enc) Sound.enc(); 
    walkTimer = 999; const container = document.getElementById('game-container'); const fade = document.createElement('div'); fade.style.position = 'absolute'; fade.style.top = 0; fade.style.left = 0; fade.style.width = '100%'; fade.style.height = '100%'; fade.style.background = '#000'; fade.style.opacity = '0'; fade.style.transition = 'opacity 0.6s ease'; fade.style.zIndex = 55; container.appendChild(fade); setTimeout(() => { fade.style.opacity = '1'; }, 50); setTimeout(() => { try { callback(); } catch (e) { console.error(e); endBattle(); showMessage("システムエラーを検知！戦闘を強制キャンセルしたわ！"); } fade.style.opacity = '0'; setTimeout(() => { if (container.contains(fade)) container.removeChild(fade); }, 600); }, 1200);
}

function startBattle(bossId = null) {
    isBattle = true; 
    triggerEncounterEffect(function() {
        battleBlock = false;
        if (messageTimer) { clearInterval(messageTimer); messageTimer = null; }
        if (bMsgTimer) { clearInterval(bMsgTimer); bMsgTimer = null; }
        const menuBtn = document.getElementById('menu-btn'); if (menuBtn) menuBtn.classList.add('invisible');
        const dpadContainer = document.getElementById('d-pad-container'); if (dpadContainer) dpadContainer.classList.add('invisible');

        const t = {
            tier1: ["slime", "slime_beth", "ghost"],
            tier2: ["magician", "scorpion", "kemono"],
            tier3: ["skeleton", "kemono", "magician2"],
            tier4: ["rikanto", "goldman", "yoroi_knight"],
            tier5: ["goldman", "rikanto2", "magician3", "metal_slime"],
            tier6: ["shinigami_knight", "dragon", "dragon2", "metal_slime"]
        };

        let encounterList = t.tier1; 
        let px = player.x; let py = player.y;

        if (currentMapKey === "0") {
            if ((px >= 40 && px <= 66 && py >= 40 && py <= 61) ||
                (px >= 30 && px <= 39 && py >= 30 && py <= 59) ||
                (px >= 22 && px <= 29 && py >= 30 && py <= 51)) { encounterList = t.tier1; } 
            else if (px >= 0 && px <= 39 && py >= 0 && py <= 29) { encounterList = t.tier2; }
            else if ((px >= 0 && px <= 20 && py >= 30 && py <= 61) || (px >= 40 && px <= 76 && py >= 3 && py <= 39)) { encounterList = t.tier3; }
            else if (px >= 77 && px <= 114 && py >= 3 && py <= 46) { encounterList = t.tier4; }
            else if ((px >= 67 && px <= 101 && py >= 47 && py <= 118) || (px >= 35 && px <= 66 && py >= 62 && py <= 118)) { encounterList = t.tier5; }
            else if ((px >= 21 && px <= 29 && py >= 53 && py <= 61) || (px >= 0 && px <= 34 && py >= 62 && py <= 82)) { encounterList = t.tier6; }
        } 
        else if (currentMapKey === "3") { encounterList = t.tier3; } 
        else if (currentMapKey === "7" || currentMapKey === "8" || currentMapKey === "9") { encounterList = t.tier6; } 
        else if (currentMapKey === "10" || currentMapKey === "11" || currentMapKey === "12") { encounterList = t.tier5; } 

        let baseEnemy = null;
        if (typeof enemiesMaster !== 'undefined') {
            if (bossId) { baseEnemy = enemiesMaster.find(e => e.id === bossId); }
            else { const randomEnemyId = encounterList[Math.floor(Math.random() * encounterList.length)]; baseEnemy = enemiesMaster.find(e => e.id === randomEnemyId) || enemiesMaster[0]; }
        }
        if (!baseEnemy) { baseEnemy = { id: "slime", img: "monster (21).PNG", name: "すらいむ", hp: 3, maxHp: 3, atk: 5, def: 3, agi: 1, exp: 1, gold: 2, spell: null }; }
        currentEnemy = JSON.parse(JSON.stringify(baseEnemy));

        const enemyArea = document.getElementById('battle-enemy-area');
        if (enemyArea) {
            enemyArea.classList.remove('hidden'); const es = document.getElementById('enemy-img');
            if (es) {
                es.classList.remove('enemy-defeat'); es.style.opacity = '1';
                es.style.position = 'relative'; es.style.top = '40px';
                es.onerror = function() { this.onerror = null; this.src = "img/moster.1.png"; };
                es.src = "img/" + (currentEnemy.img || (currentEnemy.id + ".PNG"));
            }
        }

        const cmdArea = document.getElementById('battle-command'); if (cmdArea) { cmdArea.classList.remove('hidden'); cmdArea.classList.remove('invisible'); }
        if(typeof updateMiniStatus === 'function') updateMiniStatus();

        if (typeof Sound !== 'undefined' && Sound.playBGM) {
            if (currentEnemy.id === "true_boss" || currentEnemy.id === "ryuou_final") { 
                Sound.playBGM('maou'); 
            } 
            else if (currentEnemy.id === "mochida_boss" || currentEnemy.id === "golem" || currentEnemy.id === "tanaka" || currentEnemy.id === "robber") { 
                Sound.playBGM('boss'); 
            } 
            else { 
                Sound.playBGM('battle'); 
            }
        }

        showBattleMsg(currentEnemy.name + " が あらわれた！<page>コマンドを えらべ！");
    });
}

function processTurn(actionType, actionData) {
    if (battleBlock) return; battleBlock = true; const cmdArea = document.getElementById('battle-command'); if (cmdArea) { cmdArea.classList.add('invisible'); }

    if (actionType === 'run') {
        if (currentEnemy.id === "golem" || currentEnemy.id === "ryuou" || currentEnemy.id === "ryuou_final" || currentEnemy.id === "tanaka" || currentEnemy.id === "robber" || currentEnemy.id === "mochida_boss" || currentEnemy.id === "true_boss") {
            showBattleMsg("のぶゆき は にげだした！<page>しかし まわりこまれてしまった！"); setTimeout(enemyTurn, 1500); return;
        }
        const runChance = (playerStatus.agi >= currentEnemy.agi) ? 0.75 : 0.5; if (Math.random() < runChance) { showBattleMsg("のぶゆき は にげだした！"); setTimeout(endBattle, 1500); return; } else { showBattleMsg("のぶゆき は にげだした！<page>しかし まわりこまれてしまった！"); setTimeout(enemyTurn, 1500); return; }
    }

    if (actionType === 'item') {
        playerAction(actionType, actionData, function() { if (currentEnemy.hp > 0) setTimeout(enemyTurn, 1500); else setTimeout(winBattle, 1500); });
        return; 
    }

    let pRandom = 169 + Math.floor(Math.random() * 88); let pAgi = Math.floor(playerStatus.agi * pRandom / 256);
    let eRandom = 129 + Math.floor(Math.random() * 128); let eAgi = Math.floor(currentEnemy.agi * eRandom / 256);

    if (pAgi > eAgi) { 
        playerAction(actionType, actionData, function() { if (currentEnemy.hp > 0) setTimeout(enemyTurn, 1500); else setTimeout(winBattle, 1500); }); 
    }
    else { 
        enemyTurn(function() { if (playerStatus.hp > 0) setTimeout(function() { playerAction(actionType, actionData, function() { if (currentEnemy.hp <= 0) setTimeout(winBattle, 1500); else endPlayerTurn(); }); }, 1500); else endPlayerTurn(); }); 
    }
}

function playerAction(type, data, next) {
    if (type === 'attack') {
        showBattleMsg("のぶゆき の こうげき！");
        setTimeout(function() {
            let isOugon = (playerStatus.equipment.weapon && playerStatus.equipment.weapon.name === "黄金剣");
            if (isOugon) {
                if(typeof Sound !== 'undefined' && Sound.ougon) Sound.ougon();
            } else {
                if(typeof Sound !== 'undefined' && Sound.hit) Sound.hit();
            }
            
            let baseDmg = Math.floor(playerStatus.atk / 2) - Math.floor(currentEnemy.def / 4);
            let dmg = baseDmg + Math.floor(Math.random() * (baseDmg / 4 + 1));
            if (dmg < 1) dmg = 1;

            if (Math.random() < 0.05) {
                dmg = playerStatus.atk; showBattleMsg("かいしんの いちげき！<br>" + currentEnemy.name + " に " + dmg + " の ダメージ！");
            } else {
                showBattleMsg(currentEnemy.name + " に " + dmg + " の ダメージ！");
            }
            currentEnemy.hp -= dmg; shakeEnemy(); next();
        }, 800);
    }
    else if (type === 'magic') {
        playerStatus.mp -= data.cost; updateMiniStatus();
        showBattleMsg("のぶゆき は " + data.name + " を じっこうした！");
        if(typeof Sound !== 'undefined' && Sound.magic) Sound.magic(); 

        setTimeout(function() {
            if (data.type === 'heal') {
                let heal = data.value + Math.floor(Math.random() * 5);
                playerStatus.hp += heal; if (playerStatus.hp > playerStatus.maxHp) playerStatus.hp = playerStatus.maxHp;
                updateMiniStatus(); showBattleMsg("のぶゆき の HPが " + heal + " かいふくした！");
                if(typeof Sound !== 'undefined' && Sound.heal) Sound.heal(); next();
            } else if (data.type === 'attack') {
                let dmg = data.value + Math.floor(Math.random() * 5);
                currentEnemy.hp -= dmg; shakeEnemy(); showBattleMsg(currentEnemy.name + " に " + dmg + " の ダメージ！");
                if(typeof Sound !== 'undefined' && Sound.hit) Sound.hit(); next();
            } else if (data.type === 'sleep') {
                if (Math.random() < 0.60) {
                    const turnTable = [2, 2, 2, 2, 3, 3, 3, 3, 3, 4];
                    currentEnemy.sleepTurns = turnTable[Math.floor(Math.random() * turnTable.length)]; 
                    showBattleMsg(currentEnemy.name + " を スリープモードに した！");
                } else { showBattleMsg(currentEnemy.name + " には きかなかった！"); }
                next();
            } else if (data.type === 'debuff_def') {
                if (currentEnemy.def <= 0) { showBattleMsg(currentEnemy.name + " の しゅびりょく は これ以上 さがらない！");
                } else { currentEnemy.def = Math.floor(currentEnemy.def / 2); showBattleMsg(currentEnemy.name + " の しゅびりょくが 半分になった！"); }
                next();
            } else if (data.type === 'silence') {
                if (currentEnemy.spell) { currentEnemy.spell = null; showBattleMsg(currentEnemy.name + " の プログラム（じゅもん）を ふうじこめた！");
                } else { showBattleMsg("しかし なにも おきなかった！"); }
                next();
                     } else if (data.type === 'majin') {
                // 💥 確率はドラクエ仕様（37.5%）、ダメージは攻撃力そのまま（防御無視）
                if (Math.random() < 0.375) { 
                    let dmg = playerStatus.atk; 
                    if(dmg < 1) dmg = 1;

                    currentEnemy.hp -= dmg; shakeEnemy();
                    // 文章はプロデューサーのオリジナル版をキープ！
                    showBattleMsg("イカレた まじん が あらわれた！<br>" + currentEnemy.name + " に " + dmg + " の ダメージ！");
                    if(typeof Sound !== 'undefined' && Sound.majin) Sound.majin();
                } else { 
                    // 外れた時のシュールなテキストもキープ！
                    showBattleMsg("しかし イカレ魔人 は どっかに いってしまった！"); 
                }
                next();

            } else if (data.type === 'drain') {
                let dmg = data.value + Math.floor(Math.random() * 10);
                let heal = Math.floor(dmg / 2); if (heal < 1) heal = 1;

                currentEnemy.hp -= dmg; shakeEnemy();
                playerStatus.hp += heal; if(playerStatus.hp > playerStatus.maxHp) playerStatus.hp = playerStatus.maxHp;
                updateMiniStatus(); 
                showBattleMsg(currentEnemy.name + " に " + dmg + " の ダメージ！<br>のぶゆき は " + heal + " のHPを かいふくした！");
                if(typeof Sound !== 'undefined' && Sound.hit) Sound.hit(); next();
            } else if (data.type === 'explosion') {
                let dmg = data.value + Math.floor(Math.random() * 30);
                currentEnemy.hp -= dmg; shakeEnemy(); playerStatus.hp = 1; 
                updateMiniStatus(); showBattleMsg("のぶゆき は すべてを ささげて 大爆発した！<br>" + currentEnemy.name + " に " + dmg + " の ダメージ！");
                if(typeof Sound !== 'undefined' && Sound.hit) Sound.hit(); next();
            }
        }, 1200);
    }
    else if (type === 'item') {
        showBattleMsg("のぶゆき は " + data.name + " を つかった！");
        setTimeout(function() {
            let heal = data.value; playerStatus.hp += heal; if (playerStatus.hp > playerStatus.maxHp) playerStatus.hp = playerStatus.maxHp;
            updateMiniStatus(); showBattleMsg("のぶゆき の HPが " + heal + " かいふくした！");
            if(typeof Sound !== 'undefined' && Sound.heal) Sound.heal(); next();
        }, 800);
    }
}

function enemyTurn(next) {
    if (currentEnemy.hp <= 0) { if (next) next(); return; }
    
    if (currentEnemy.sleepTurns && currentEnemy.sleepTurns > 0) {
        currentEnemy.sleepTurns--; showBattleMsg(currentEnemy.name + " は スリープモードで ねむっている……。");
        setTimeout(function() {
            if (currentEnemy.sleepTurns <= 0) {
                showBattleMsg(currentEnemy.name + " は スリープモードから ふっきした！");
                setTimeout(function() { if (next) next(); else endPlayerTurn(); }, 1500);
            } else { if (next) next(); else endPlayerTurn(); }
        }, 1200);
        return; 
    }

    if (currentEnemy.id === "metal_slime" && Math.random() < 0.30) {
        showBattleMsg(currentEnemy.name + " は にげだした！");
        if(typeof Sound !== 'undefined' && Sound.cursor) Sound.cursor(); setTimeout(endBattle, 1500); return; 
    }

    if (Math.random() < 0.15) {
        const idleMsgs = [ " ようすを うかがっている……。", " ぼーっとしている……。", " みがまえている！" ];
        const msg = idleMsgs[Math.floor(Math.random() * idleMsgs.length)];
        showBattleMsg(currentEnemy.name + " は" + msg); setTimeout(function() { if (next) next(); else endPlayerTurn(); }, 1500); return;
    }

    let action = "attack"; if (currentEnemy.spell && currentEnemy.mp !== 0 && Math.random() < 0.3) action = "magic";

    if (action === "attack") {
        showBattleMsg(currentEnemy.name + " の こうげき！");
        setTimeout(function() {
            let baseDmg = Math.floor(currentEnemy.atk / 2) - Math.floor(playerStatus.def / 4);
            let dmg = baseDmg + Math.floor(Math.random() * (baseDmg / 4 + 1));
            if (dmg < 1) { if (Math.random() < 0.5) dmg = 1; else dmg = 0; }

            playerStatus.hp -= dmg; if (playerStatus.hp < 0) playerStatus.hp = 0;
            updateMiniStatus();
            if (dmg > 0 && typeof Sound !== 'undefined' && Sound.damage) Sound.damage();
            document.getElementById('view-area').classList.add('screen-shake');
            setTimeout(() => { document.getElementById('view-area').classList.remove('screen-shake'); }, 300);

            showBattleMsg("のぶゆき に " + dmg + " の ダメージ！");
            if (playerStatus.hp <= 0) { setTimeout(loseBattle, 1500); return; }
            if (next) next(); else endPlayerTurn();
        }, 800);
    }
    else {
        showBattleMsg(currentEnemy.name + " は " + currentEnemy.spell.name + " を となえた！");
        if(typeof Sound !== 'undefined' && Sound.magic) Sound.magic();

        setTimeout(function() {
                        if (currentEnemy.spell.type === 'heal') {
                let heal = currentEnemy.spell.value + Math.floor(Math.random() * 5);
                currentEnemy.hp += heal; if (currentEnemy.hp > currentEnemy.maxHp) currentEnemy.hp = currentEnemy.maxHp;
                showBattleMsg(currentEnemy.name + " の HPが " + heal + " かいふくした！");
            
            } else if (currentEnemy.spell.type === 'death') {
                if (Math.random() < 0.10) { 
                    playerStatus.hp = 0;
                    updateMiniStatus();
                    document.getElementById('view-area').classList.add('screen-shake');
                    if (typeof Sound !== 'undefined' && Sound.damage) Sound.damage();
                    showBattleMsg("へんさいきげん が やってきた！<page>のぶゆき の ざんだか は 0 になった！<br>のぶゆき は しんでしまった！");
                } else {
                    showBattleMsg("へんさいきげん を かろうじて まぬがれた！<br>しかし なにも おきなかった！");
                }

            // 💥【NEW】ここに「さいれん（デバフ解除）」の処理を追加！
                        // 💥【NEW】元の防御力と比べて、下がっていたら戻すスマートな処理！
            } else if (currentEnemy.spell.type === 'cure_debuff') {
                let orig = enemiesMaster.find(e => e.id === currentEnemy.id);
                // 敵の元データが存在し、かつ今の防御力(def)が元(orig.def)より下がっていれば
                if (orig && currentEnemy.def < orig.def) {
                    currentEnemy.def = orig.def; // 元の防御力にリセット！
                    showBattleMsg("けたたましい さいれん が なりひびく！<br>" + currentEnemy.name + " の しゅびりょく が もとに もどった！");
                } else {
                    // 下がっていない時に使ってきた場合は無駄撃ち
                    showBattleMsg("けたたましい さいれん が なりひびく！<br>しかし なにも おきなかった！");
                }


            } else {
                // 通常の固定ダメージ魔法（ふらっしゅ等）の処理
                let dmg = currentEnemy.spell.value + Math.floor(Math.random() * 5);
                if (playerStatus.equipment.armor && (playerStatus.equipment.armor.name === "まほうのすーつ" || playerStatus.equipment.armor.name === "黄金スーツ")) {
                    dmg = Math.floor(dmg * 0.75);
                }
                playerStatus.hp -= dmg; if (playerStatus.hp < 0) playerStatus.hp = 0;
                updateMiniStatus();
                if (dmg > 0 && typeof Sound !== 'undefined' && Sound.damage) Sound.damage();
                document.getElementById('view-area').classList.add('screen-shake');
                setTimeout(() => { document.getElementById('view-area').classList.remove('screen-shake'); }, 300);
                showBattleMsg("のぶゆき に " + dmg + " の ダメージ！");
            }

            if (playerStatus.hp <= 0) { setTimeout(loseBattle, 1500); return; }
            if (next) next(); else endPlayerTurn();
        }, 1200);
    }
}

function shakeEnemy() { 
    const es = document.getElementById('enemy-img'); 
    if(es) { 
        es.style.transform = 'translateX(10px)'; 
        setTimeout(()=>{ es.style.transform = 'translateX(-10px)'; setTimeout(()=>{ es.style.transform = 'translateX(10px)'; setTimeout(()=>{ es.style.transform = 'translateX(0)'; }, 50); }, 50); }, 50); 
    } 
}

function endPlayerTurn() { battleBlock = false; const cmdArea = document.getElementById('battle-command'); if (cmdArea) { cmdArea.classList.remove('invisible'); } }

// 💥【NEW】勝利時の超スマート化！
function winBattle() {
    if(typeof Sound !== 'undefined' && Sound.defeat) Sound.defeat();
    const es = document.getElementById('enemy-img'); if (es) es.classList.add('enemy-defeat');

    let isBoss = false;

    if (currentEnemy.id === "tanaka") {
        isBoss = true;
        playerStatus.flags.defeatedTanaka = true;
        showBattleMsg("たなか を ぶっとばした！<page>たなか「ぐあぁっ！ ま、まさか……<br>この俺が……ただのプログラマーに……！」<page>たなか「おぼえてろよ、のぶゆき……！<br>俺の 白バイのローンは……まだ……！」<page>たなか は 泡を吹いて 気絶した！");
    } else if (currentEnemy.id === "robber") {
        isBoss = true;
        playerStatus.flags.defeatedRobber = true;
        showBattleMsg("ごうとう を やっつけた！<page>強盗「ぐはぁっ！ て、てめぇ……<br>ただの ぷろぐらまーじゃ ねぇのかよ……！」<page>強盗「おぼえてろよ！<br>今日のところは 勘弁してやらぁ！」<page>強盗は 逃げ出した！<page>親父「ひぃぃ！ 助かったわい……！<br>のぶゆき、ワシは 先に カウンターに 戻っとるぞ！」<page>親父が 宿屋のカウンターのほうへ 走っていった。");
    } else if (currentEnemy.id === "golem") {
        isBoss = true;
        playerStatus.flags.defeatedGolem = true;
        showBattleMsg("すろっとまじん を たおした！<page>すろっとまじん「ギャオオオン！！<br>バ、バカな……！ 俺様が 四街道の<br>養分どもから 巻き上げた コインが……！！」<page>すろっとまじん「た、頼む！ 命だけは！<br>ご主人様から 預かっている<br>キーコードを 教えるから 助けてー！！」<page>すろっとまじん は 命乞いをしながら<br>大量のメダルを ばらまいて<br>爆発して 消え去った！");
          } else if (currentEnemy.id === "mochida_boss") {
        isBoss = true;
        playerStatus.flags.defeatedMochida = true;
        window.nextBossToFight = "ryuou_final"; 
        // 💥【NEW】極限まで無駄を削ぎ落とした、最高のサイバー・テキスト！
        showBattleMsg("もちだ を たおした！<page>" +
                      "もちだ「ハァ……黒ちゃん。<br>俺のシステム（脳）、<br>完全に ハックされてたみたいだ……」<page>" +
                      "もちだ「俺は もう 動けねえ。<br>だが、一緒に飲んだ らっしーは<br>正真正銘の リアル だぜ……」<page>" +
                      "もちだ「バグなんて ない……<br>ただ……最高に……甘い……」<page>" +
                      "もちだ は 静かに 目を閉じ<br>その場に 倒れ込んだ！<page>" +
                      "どこからともなく 邪悪な声が 響き渡る！<page>" +
                      "謎の声「ふん……もちだ は 使えないわね。<br>くもひとつ ないわ……」");


    } else if (currentEnemy.id === "ryuou_final" || currentEnemy.id === "true_boss") {
        isBoss = true;
        playerStatus.flags.gameClear = true; 
        window.justCleared = true; 
        showBattleMsg(currentEnemy.name + " を たおした！<page>魔王「グアアアアアッ！！<br>バカな……この私が……！<br>ただの プログラマーごときに……！！」<page>魔王「ガアアアァァァァァッ！！」<page>消えゆく 魔王の ノイズの 向こう側に、<br>四街道を さまよっていた あの『幻影』が 重なって 見えた。<page>幻影は、のぶゆき に 向かって 小さく うなずき……<br>そのまま 光の 中へと 溶けていった。<page>魔王の ウイルス侵食から サーバーを 守るため、<br>ずっと 裏で 戦い続けていたのは……。<page>四街道の メインサーバーは 浄化され、<br>街に 平和が 戻った……！！");
    } else {
        showBattleMsg(currentEnemy.name + " を たおした！");
    }

    const bossList = ["tanaka", "golem", "mochida_boss", "robber", "ryuou_final", "true_boss"];
    if (bossList.includes(currentEnemy.id)) {
        if (window.FirebaseHub) window.FirebaseHub.incrementBossDefeat(currentEnemy.id);
    }

    if (isBoss) {
        // 💥 ボスの時は、会話をタップで読み終えた瞬間に経験値画面へ進む！
        pendingAction = () => { window.proceedToExp(); };
    } else {
        // 💥 雑魚敵の時は、少し待ってから「自動的に」経験値画面へ進む！（タップ不要）
        setTimeout(() => {
            if (isBattle) window.proceedToExp();
        }, 1000);
    }
}

// 💥【NEW】経験値も完全に連携！
window.proceedToExp = function() {
    let getExp = currentEnemy.exp * 3;
    let getGold = Math.floor(currentEnemy.gold * 4.5); 
    
    playerStatus.exp += getExp; 
    playerStatus.gold += getGold;
    
    let leveledUp = false; let nextLevelData = null;
    let oldMaxHp, oldMaxMp, oldStr, oldAgi;

    if (typeof levelUpTable !== 'undefined') { nextLevelData = levelUpTable.find(d => d.level === playerStatus.level + 1); }
    
    if (nextLevelData && playerStatus.exp >= nextLevelData.exp) { 
        leveledUp = true; 
        oldMaxHp = playerStatus.maxHp; oldMaxMp = playerStatus.maxMp;
        oldStr = playerStatus.str; oldAgi = playerStatus.agi;

        playerStatus.level = nextLevelData.level; 
        playerStatus.maxHp = nextLevelData.hp; playerStatus.maxMp = nextLevelData.mp; 
        playerStatus.str = nextLevelData.str; playerStatus.agi = nextLevelData.agi; 
        
        playerStatus.hp += (nextLevelData.hp - oldMaxHp); 
        playerStatus.mp += (nextLevelData.mp - oldMaxMp);
    }

    if (leveledUp) { 
        setTimeout(function() {
            if(typeof Sound !== 'undefined' && Sound.levelUp) Sound.levelUp();
            let diffHp = playerStatus.maxHp - oldMaxHp; let diffMp = playerStatus.maxMp - oldMaxMp;
            let diffStr = playerStatus.str - oldStr; let diffAgi = playerStatus.agi - oldAgi;

            let upMsg = getExp + " EX と " + getGold + " G を てにいれた！";
            upMsg += "<page>のぶゆき は レベル " + playerStatus.level + " に あがった！";
            upMsg += "<page>最大HP が " + diffHp + " あがった！<br>最大MP が " + diffMp + " あがった！";
            upMsg += "<page>ちから が " + diffStr + " あがった！<br>すばやさ が " + diffAgi + " あがった！";
            
            if (nextLevelData && nextLevelData.spell) { 
                playerStatus.spells.push(nextLevelData.spell); 
                upMsg += "<page>のぶゆき は 「" + nextLevelData.spell.name + "」 の プログラム を おぼえた！"; 
            } 
            
            // 💥 レベルアップした時だけは、プレイヤーがステータスを確認してタップするのを待つ！
            pendingAction = () => {
                if (window.justCleared) { window.justCleared = false; if(typeof window.startEndingCutscene === 'function') window.startEndingCutscene(); }
                else { if(typeof window.endBattle === 'function') window.endBattle(); }
            };
            showBattleMsg(upMsg); 
            if(typeof updateMiniStatus === 'function') updateMiniStatus(); 
        }, 500); 
    } else { 
        // 💥 レベルアップしない時（MAX含む）は、タップしなくても自動で閉じる！
        let msg = getExp + " EX と " + getGold + " G を てにいれた！";
        
        // 早く閉じたい人向けにタップで閉じる処理もセットしておく
        pendingAction = () => {
            if (window.justCleared) { window.justCleared = false; if(typeof window.startEndingCutscene === 'function') window.startEndingCutscene(); }
            else { if(typeof window.endBattle === 'function') window.endBattle(); }
        };
        showBattleMsg(msg);
        if(typeof updateMiniStatus === 'function') updateMiniStatus(); 
        
        // 💥 何もしなくても、文字が出てから1.5秒後にスマートに閉じてマップに戻る！
        setTimeout(() => {
            if (isBattle && pendingAction) {
                let action = pendingAction;
                pendingAction = null;
                action();
            }
        }, 1500); 
    }
};

window.startEndingCutscene = function() {
    if (typeof Sound !== 'undefined' && Sound.stopBGM) Sound.stopBGM();
    
    if(typeof loadMap === 'function') loadMap("1"); 
    player.x = 16; 
    player.y = 7; 
    player.dir = 3; 
    
    if(typeof updateMiniStatus === 'function') updateMiniStatus(); 
    fadeAlpha = 1.0; 
    if(typeof draw === 'function') draw(); 
    
    if(typeof window.endBattle === 'function') window.endBattle(); 
    if (typeof playMapBGM === 'function') playMapBGM(); 
    
        setTimeout(() => {
        // 💥【NEW】1行の文字数を極限まで減らして、絶対に3行以内に収まるように再構築！
        showMessage("親父「おぉ、のぶゆき！<br>よくぞ 四街道を<br>救ってくれた！<page>本当に ありがとう。<br>……なんじゃ、その顔は。<page>もう 次の冒険に<br>行ってしまうんじゃろ？<page>お前の ハッカー魂は<br>誰にも 止められんからな。<page>いつでも 応援しておるぞ！<br>気をつけてな！」");
        pendingAction = () => { if(typeof showEndRoll === 'function') showEndRoll(); };
    }, 1000);

};

window.returnToWorld = null;

function loseBattle() { 
    showBattleMsg("のぶゆき は ちからつきた……。"); 
    setTimeout(function() { 
        
        if (typeof playerStatus.flags.deathCount === 'undefined') playerStatus.flags.deathCount = 0;
        playerStatus.flags.deathCount++;

        const bossList = ["tanaka", "golem", "mochida_boss", "robber", "ryuou_final", "true_boss", "golem2"];
        if (bossList.includes(currentEnemy.id)) {
            if (window.FirebaseHub) window.FirebaseHub.incrementBossKill(currentEnemy.id);
        }

        if (currentEnemy.id === "ryuou_final" || currentEnemy.id === "true_boss") {
            playerStatus.flags.defeatedMochida = false;
        }

        if(typeof window.endBattle === 'function') window.endBattle(); 
        
        playerStatus.gold = Math.floor(playerStatus.gold * 0.75);
        
        window.returnStack = []; 
        window.worldReturn = null;
        
        if(typeof loadMap === 'function') loadMap("1"); 
        player.x = 16; 
        player.y = 7; 
        player.dir = 3; 
        
        playerStatus.hp = playerStatus.maxHp; 
        if(typeof updateMiniStatus === 'function') updateMiniStatus(); 
        fadeAlpha = 1.0; 
        if(typeof draw === 'function') draw(); 
        
        setTimeout(function() {
            showMessage("親父「のぶゆきよ、<br>情けない姿を さらしおって……。<page>倒れていた お前を 運ぶのに<br>手間取ったわい。<page>治療費と 運搬代として<br>所持金の 4分の1 を<br>もらっておいたぞ。<page>次は しっかり やるんじゃな！」");
        }, 500);
        
    }, 2500); 
}

function endBattle() {
    if (!isBattle) return;
    isBattle = false; battleBlock = false;
    
    if (typeof isMessageActive !== 'undefined') isMessageActive = false;
    const msgBox = document.getElementById('message-box');
    if (msgBox) { msgBox.classList.remove('active'); msgBox.style.transform = 'translateY(0)'; }

    if (bMsgTimer) { clearInterval(bMsgTimer); bMsgTimer = null; }
    if (messageTimer) { clearInterval(messageTimer); messageTimer = null; }
    const enemyArea = document.getElementById('battle-enemy-area'); if (enemyArea) enemyArea.classList.add('hidden');
    const cmdArea = document.getElementById('battle-command'); if (cmdArea) { cmdArea.classList.add('hidden'); cmdArea.classList.remove('invisible'); }
    const dpadContainer = document.getElementById('d-pad-container'); if (dpadContainer) dpadContainer.classList.remove('invisible');
    const menuBtn = document.getElementById('menu-btn'); if (menuBtn) menuBtn.classList.remove('invisible');
    
    //const msgText = document.getElementById('msg-text'); 
    //if (msgText && typeof currentMapKey !== 'undefined') msgText.innerHTML = "現在地: MAP " + currentMapKey + " (X:" + player.x + " Y:" + player.y + ")";

    walkTimer = 10; keys.up = keys.down = keys.left = keys.right = keys.action = false;

    if (window.nextBossToFight) {
        let next = window.nextBossToFight;
        window.nextBossToFight = null;
        setTimeout(() => { startBattle(next); }, 100);
        return;
    }

    if (typeof playMapBGM === 'function') playMapBGM();
}

function cmdAttack() { if(typeof Sound !== 'undefined' && Sound.decide) Sound.decide(); processTurn('attack', null); }
function cmdMagic() {
    if(typeof Sound !== 'undefined' && Sound.decide) Sound.decide();
    if (playerStatus.spells.length === 0) { alert("じゅもん を おぼえていない！"); return; }
    let html = "<div style='color:#aaaaff; margin-bottom:5px;'>どれを となえる？</div><ul style='list-style:none; padding:0; margin:0;'>";
    playerStatus.spells.forEach((sp, idx) => { html += "<li style='cursor:pointer; padding:5px; border-bottom:1px dashed #555;' onclick='if(typeof Sound !== \"undefined\" && Sound.decide) Sound.decide(); execMagic(" + idx + ")'>" + sp.name + " (MP:" + sp.cost + ")</li>"; });
    html += "<li style='cursor:pointer; padding:5px; color:#ffaaaa;' onclick='cancelSubCommand()'>やめる</li></ul>";
    showSubWindow(html);
}
function execMagic(idx) { const sp = playerStatus.spells[idx]; if (playerStatus.mp < sp.cost) { alert("MPが たりない！"); return; } cancelSubCommand(); processTurn('magic', sp); }
function cmdItem() {
    if(typeof Sound !== 'undefined' && Sound.decide) Sound.decide();
    let items = playerStatus.inventory.filter(i => i.type === "heal"); if (items.length === 0) { alert("つかえる どうぐ が ない！"); return; }
    let html = "<div style='color:#aaaaff; margin-bottom:5px;'>どれを つかう？</div><ul style='list-style:none; padding:0; margin:0;'>";
    playerStatus.inventory.forEach((item, idx) => { if (item.type === "heal") { let ct = item.count ? (" x"+item.count) : ""; html += "<li style='cursor:pointer; padding:5px; border-bottom:1px dashed #555;' onclick='if(typeof Sound !== \"undefined\" && Sound.decide) Sound.decide(); execItem(" + idx + ")'>" + item.name + ct + "</li>"; } });
    html += "<li style='cursor:pointer; padding:5px; color:#ffaaaa;' onclick='cancelSubCommand()'>やめる</li></ul>";
    showSubWindow(html);
}
function execItem(idx) { const it = playerStatus.inventory[idx]; if (it.count) { it.count--; if (it.count <= 0) playerStatus.inventory.splice(idx, 1); } else { playerStatus.inventory.splice(idx, 1); } cancelSubCommand(); processTurn('item', it); }
function cmdRun() { if(typeof Sound !== 'undefined' && Sound.decide) Sound.decide(); processTurn('run', null); }

function showSubWindow(html) { const sub = document.getElementById('battle-sub-window'); if (sub) { sub.innerHTML = html; sub.classList.remove('hidden'); document.getElementById('battle-command').classList.add('invisible'); } }
function cancelSubCommand() { if(typeof Sound !== 'undefined' && Sound.decide) Sound.decide(); const sub = document.getElementById('battle-sub-window'); if (sub) sub.classList.add('hidden'); document.getElementById('battle-command').classList.remove('invisible'); }

window.startBattle = startBattle; window.endBattle = endBattle; window.cmdAttack = cmdAttack; window.cmdMagic = cmdMagic; window.cmdItem = cmdItem; window.cmdRun = cmdRun; window.execMagic = execMagic; window.execItem = execItem; window.cancelSubCommand = cancelSubCommand;
