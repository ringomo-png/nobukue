// ==========================================
// 📊 menu.js (オートセーブ内蔵＆全機能統合 完全版)
// ==========================================

// 💥【NEW】裏でこっそり保存する「サイレント・オートセーブ機能」
// 💥【NEW】裏でこっそり保存する「サイレント・オートセーブ機能」
window.autoSave = function() {
    if (typeof playerStatus === 'undefined' || !playerStatus) return;
    
    // 💥【ラスボス対策の安全装置】
    // 魔王を倒した後（エンディング中）は、オートセーブを一切ストップする！
    // もしここでリロードされても、魔王戦の直前からやり直せる（王道RPGの仕様）
    if (playerStatus.flags && playerStatus.flags.gameClear) {
        console.log("【システム】エンディング中のため、オートセーブを停止中……");
        return; 
    }

    let saveData = {
        playerStatus: playerStatus,
        player: player,
        currentMapKey: currentMapKey,
        returnStack: window.returnStack || [],
        worldReturn: window.worldReturn || null,
        soundSettings: {
            bgmVolume: (typeof Sound !== 'undefined') ? Sound.bgmVolume : 0.4,
            seVolume: (typeof Sound !== 'undefined') ? Sound.seVolume : 1.0,
            bgmMuted: (typeof Sound !== 'undefined') ? Sound.bgmMuted : false,
            seMuted: (typeof Sound !== 'undefined') ? Sound.seMuted : false
        }
    };
    let npcStates = [];
    if(typeof npcs !== 'undefined') { npcs.forEach((n, idx) => { npcStates.push({opened: n.opened, hidden: n.hidden}); }); }
    saveData.npcStates = npcStates;
    try {
        localStorage.setItem("nobuMonSave", JSON.stringify(saveData));
        console.log("【システム】オートセーブ完了！");
    } catch(e) {}
};

function calcPlayerStats() {
    if (typeof playerStatus === 'undefined' || !playerStatus.equipment) return { baseStr:0, baseDef:0, baseAgi:0, equipAtk:0, equipDef:0, equipAgi:0, totalAtk:0, totalDef:0, totalAgi:0 };
    let baseStr = playerStatus.str || 4; let baseAgi = playerStatus.agi || 4; let baseDef = Math.floor(baseAgi / 2); 
    let wAtk = (playerStatus.equipment.weapon && playerStatus.equipment.weapon.atk) ? playerStatus.equipment.weapon.atk : 0; 
    let aDef = (playerStatus.equipment.armor && playerStatus.equipment.armor.def) ? playerStatus.equipment.armor.def : 0; 
    let sDef = (playerStatus.equipment.shield && playerStatus.equipment.shield.def) ? playerStatus.equipment.shield.def : 0; 
    let accAtk = (playerStatus.equipment.accessory && playerStatus.equipment.accessory.atk) ? playerStatus.equipment.accessory.atk : 0; 
    let accDef = (playerStatus.equipment.accessory && playerStatus.equipment.accessory.def) ? playerStatus.equipment.accessory.def : 0; 
    let accAgi = (playerStatus.equipment.accessory && playerStatus.equipment.accessory.agi) ? playerStatus.equipment.accessory.agi : 0;
    
    playerStatus.atk = baseStr + wAtk + accAtk; 
    playerStatus.def = baseDef + aDef + sDef + accDef; 
    playerStatus.totalAgi = baseAgi + accAgi; 
    return { baseStr: baseStr, baseDef: baseDef, baseAgi: baseAgi, equipAtk: (wAtk + accAtk), equipDef: (aDef + sDef + accDef), equipAgi: accAgi, totalAtk: playerStatus.atk, totalDef: playerStatus.def, totalAgi: playerStatus.totalAgi };
}

function updateMiniStatus() {
    if (typeof playerStatus === 'undefined') return;
    const elLv = document.getElementById('mini-lv'); const elHp = document.getElementById('mini-hp'); const elMp = document.getElementById('mini-mp'); const elG = document.getElementById('mini-g');
    if (elLv) elLv.innerText = "LV: " + playerStatus.level; if (elHp) elHp.innerText = "HP: " + playerStatus.hp + "/" + playerStatus.maxHp; if (elMp) elMp.innerText = "MP: " + playerStatus.mp + "/" + playerStatus.maxMp; if (elG) elG.innerText  = "G : " + playerStatus.gold;
}

function openMenu() { 
    if (isMenuOpen || isBattle || window.isCutscene) return; 
    if (typeof Sound !== 'undefined' && Sound.decide) Sound.decide(); 
    isMenuOpen = true; document.getElementById('menu-screen').classList.remove('hidden'); const tabs = document.getElementById('menu-tabs'); if(tabs) tabs.style.display = 'flex'; calcPlayerStats(); updateMenuStats(); showStatus(); 
}
function closeMenu() { 
    if (typeof Sound !== 'undefined' && Sound.cursor2) Sound.cursor2(); 
    isMenuOpen = false; document.getElementById('menu-screen').classList.add('hidden'); 
    if (typeof window.autoSave === 'function') window.autoSave(); // 💥 メニューを閉じた時にオートセーブ！
}
function updateMenuStats() { const statsDiv = document.getElementById('menu-stats'); if (!statsDiv || typeof playerStatus === 'undefined') return; statsDiv.innerHTML = "のぶゆき　LV: " + playerStatus.level + "　おかね: " + playerStatus.gold + " Ｇ<br>ＨＰ: " + playerStatus.hp + " / " + playerStatus.maxHp + "　MP: " + playerStatus.mp + " / " + playerStatus.maxMp; }

function showStatus() {
    if (typeof Sound !== 'undefined' && Sound.cursor2) Sound.cursor2(); 
    const details = document.getElementById('menu-details'); if (!details || typeof playerStatus === 'undefined') return;
    let s = calcPlayerStats(); let nextExp = "MAX"; if (typeof levelUpTable !== 'undefined') { for (let i = 0; i < levelUpTable.length; i++) { if (levelUpTable[i].level === playerStatus.level + 1) { nextExp = levelUpTable[i].exp - playerStatus.exp; if (nextExp < 0) nextExp = 0; break; } } }
    let html = "<div style='line-height:1.7;'><span style='color:#aaffaa;'>【けいけんち】</span> " + playerStatus.exp + " <span style='font-size:13px;'>(次まで: " + nextExp + ")</span><br><hr style='border:none; border-top:1px dashed #555; margin:8px 0;'><span style='color:#aaaaff;'>【ちから】　</span> " + s.baseStr + "<br><span style='color:#aaaaff;'>【すばやさ】</span> " + s.baseAgi + "<br><span style='color:#aaaaff;'>【まもり】　</span> " + s.baseDef + "<br><hr style='border:none; border-top:1px dashed #555; margin:8px 0;'><span style='color:#ffaaaa;'>【こうげき力】</span> " + s.totalAtk + " <span style='font-size:13px; color:#888;'>(装備 +" + s.equipAtk + ")</span><br><span style='color:#ffaaaa;'>【しゅび力】　</span> " + s.totalDef + " <span style='font-size:13px; color:#888;'>(装備 +" + s.equipDef + ")</span><br><span style='color:#ffaaaa;'>【総合すばやさ】</span> " + s.totalAgi + " <span style='font-size:13px; color:#888;'>(装備 +" + s.equipAgi + ")</span><br></div>"; details.innerHTML = html;
}

function showHack() {
    if (typeof Sound !== 'undefined' && Sound.cursor2) Sound.cursor2(); 
    const details = document.getElementById('menu-details'); if (!details || typeof playerStatus === 'undefined') return;
    
    let healSpells = playerStatus.spells.filter(sp => sp.type === "heal");
    if (healSpells.length === 0) { details.innerHTML = "<div style='color:#888;'>つかえる はっく(魔法) は なにもない。</div>"; return; }
    
    let html = "<div style='color:#aaaaff; margin-bottom:5px;'>どれを じっこう する？</div>";
    html += "<ul style='list-style:none; padding:0; margin:0;'>";
    playerStatus.spells.forEach(function(spell, index) { 
        if (spell.type === "heal") { 
            html += "<li style='cursor:pointer; padding:10px 8px; border-bottom:1px dashed #555; background:#222; margin-bottom:4px; border-radius:4px;' onclick='useHackMenu(" + index + ")'>▶ " + spell.name + " (MP:" + spell.cost + ")</li>"; 
        } 
    }); 
    html += "</ul>"; details.innerHTML = html;
}

function useHackMenu(index) {
    if (typeof playerStatus === 'undefined') return; 
    const spell = playerStatus.spells[index];
    
    if (playerStatus.hp >= playerStatus.maxHp) { 
        if (typeof Sound !== 'undefined' && Sound.cursor2) Sound.cursor2();
        alert("HPは まんたんだ！"); return; 
    }
    if (playerStatus.mp < spell.cost) { 
        if (typeof Sound !== 'undefined' && Sound.cursor2) Sound.cursor2();
        alert("MPが たりない！"); return; 
    }

    playerStatus.mp -= spell.cost;
    playerStatus.hp += spell.value; 
    if (playerStatus.hp > playerStatus.maxHp) playerStatus.hp = playerStatus.maxHp;
    
    if (typeof Sound !== 'undefined' && Sound.heal) Sound.heal(); 
    
    const container = document.getElementById('game-container'); 
    if (container) {
        const flash = document.createElement('div'); 
        flash.style.position = 'absolute'; flash.style.inset = '0'; 
        flash.style.background = 'rgba(50, 255, 50, 0.4)'; 
        flash.style.zIndex = '999'; 
        flash.style.pointerEvents = 'none'; 
        flash.style.transition = 'opacity 0.4s ease-out'; 
        container.appendChild(flash); 
        
        setTimeout(() => { 
            flash.style.opacity = '0'; 
            setTimeout(() => { if(container.contains(flash)) container.removeChild(flash); }, 400);
        }, 50);
    }

    updateMiniStatus(); updateMenuStats(); showHack(); 
    showMessage("" + spell.name + " を じっこう した！<br>のぶゆき の HP が かいふくした！");
}

function showItems() {
    if (typeof Sound !== 'undefined' && Sound.cursor2) Sound.cursor2(); 
    const details = document.getElementById('menu-details'); if (!details || typeof playerStatus === 'undefined') return;
    let items = playerStatus.inventory.filter(i => i.type === "heal" || i.type === "item");
    if (items.length === 0) { details.innerHTML = "<div style='color:#888;'>つかえる どうぐ は なにもない。</div>"; return; }
    
    let html = "<div style='color:#aaaaff; margin-bottom:5px;'>どれを つかう？</div>";
    html += "<ul style='list-style:none; padding:0; margin:0;'>";
    playerStatus.inventory.forEach(function(item, index) { if (item.type === "heal" || item.type === "item") { let countText = item.count ? (" × " + item.count) : ""; html += "<li style='cursor:pointer; padding:10px 8px; border-bottom:1px dashed #555; background:#222; margin-bottom:4px; border-radius:4px;' onclick='useItemMenu(" + index + ")'>▶ " + item.name + countText + " (つかう)</li>"; } }); html += "</ul>"; details.innerHTML = html;
}

function useItemMenu(index) {
    if (typeof playerStatus === 'undefined') return; const item = playerStatus.inventory[index];
    if (item.name === "MFA") { alert("MFAは メニューの「MFA」タブから 起動してください！"); return; }
    if (item.name === "よつかいどうの地図" || item.name === "世界地図コード") {
        closeMenu();
        if(typeof showWorldMap === 'function') showWorldMap();
        return;
    }
    
    if (item.name === "インド魔除け") {
        if (typeof Sound !== 'undefined' && Sound.itemGet) Sound.itemGet(); 
        window.amuletSteps = 100; 
        if (item.count) { item.count--; if (item.count <= 0) playerStatus.inventory.splice(index, 1); } 
        else { playerStatus.inventory.splice(index, 1); }
        closeMenu();
        showMessage("のぶゆき は インド魔除け を つかった！<page>強烈な スパイスの 香りがする……。<br>フィールドで 100歩のあいだ<br>魔物が でなくなった！");
        return; 
    }
        
    if (item.type === "heal") {
        if (playerStatus.hp >= playerStatus.maxHp) { 
            if (typeof Sound !== 'undefined' && Sound.cursor2) Sound.cursor2();
            alert("HPは まんたんだ！"); return; 
        }
        playerStatus.hp += item.value; if (playerStatus.hp > playerStatus.maxHp) playerStatus.hp = playerStatus.maxHp;
        if (item.count) { item.count--; if (item.count <= 0) playerStatus.inventory.splice(index, 1); } else { playerStatus.inventory.splice(index, 1); }
        
        if (typeof Sound !== 'undefined' && Sound.heal) Sound.heal(); 
        
        const container = document.getElementById('game-container'); 
        if (container) {
            const flash = document.createElement('div'); 
            flash.style.position = 'absolute'; flash.style.inset = '0'; 
            flash.style.background = 'rgba(50, 255, 50, 0.4)'; 
            flash.style.zIndex = '999'; 
            flash.style.pointerEvents = 'none'; 
            flash.style.transition = 'opacity 0.4s ease-out'; 
            container.appendChild(flash); 
            setTimeout(() => { 
                flash.style.opacity = '0'; 
                setTimeout(() => { if(container.contains(flash)) container.removeChild(flash); }, 400); 
            }, 50);
        }

        updateMiniStatus(); updateMenuStats(); showItems(); showMessage(item.name + " を つかった！<br>のぶゆき の HP が かいふくした！");
    } else { 
        if (typeof Sound !== 'undefined' && Sound.cursor2) Sound.cursor2();
        alert(item.name + " は ここでは つかえない。"); 
    }
}

var currentEquipSlot = null;

function showEquip() {
    if (typeof Sound !== 'undefined' && Sound.cursor2) Sound.cursor2(); 
    const details = document.getElementById('menu-details'); if (!details || typeof playerStatus === 'undefined') return;
    const w = playerStatus.equipment.weapon; const a = playerStatus.equipment.armor; const s = playerStatus.equipment.shield; const acc = playerStatus.equipment.accessory;
    
    let html = "<div style='color:#aaffaa; font-size:15px; margin-bottom:10px;'>どれを そうび しますか？</div>";
    html += "<div style='background:#111; padding:8px; border-radius:4px;'>";
    html += "<div style='cursor:pointer; padding:10px 8px; border-bottom:1px dashed #555; background:#222; margin-bottom:4px;' onclick='showEquipList(\"weapon\")'>▶ ぶき: " + (w ? w.name : "なし") + "</div>";
    html += "<div style='cursor:pointer; padding:10px 8px; border-bottom:1px dashed #555; background:#222; margin-bottom:4px;' onclick='showEquipList(\"armor\")'>▶ よろい: " + (a ? a.name : "なし") + "</div>";
    html += "<div style='cursor:pointer; padding:10px 8px; border-bottom:1px dashed #555; background:#222; margin-bottom:4px;' onclick='showEquipList(\"shield\")'>▶ たて: " + (s ? s.name : "なし") + "</div>";
    html += "<div style='cursor:pointer; padding:10px 8px; background:#222;' onclick='showEquipList(\"accessory\")'>▶ アクセ: " + (acc ? acc.name : "なし") + "</div>";
    html += "</div>";
    details.innerHTML = html;
}

function showEquipList(slot) {
    if (typeof Sound !== 'undefined' && Sound.cursor2) Sound.cursor2(); 
    const details = document.getElementById('menu-details'); currentEquipSlot = slot;
    let slotName = slot === "weapon" ? "ぶき" : slot === "armor" ? "よろい" : slot === "shield" ? "たて" : "アクセサリ";
    
    let html = "<div style='color:#ffaaaa; margin-bottom:5px;'>【" + slotName + "】をえらぶ</div>";
    html += "<ul style='list-style:none; padding:0; margin:0;'>";
    let hasEquip = false;

    let currentEquip = playerStatus.equipment[slot];
    let cAtk = currentEquip && currentEquip.atk ? currentEquip.atk : 0;
    let cDef = currentEquip && currentEquip.def ? currentEquip.def : 0;
    let cAgi = currentEquip && currentEquip.agi ? currentEquip.agi : 0;

    playerStatus.inventory.forEach(function(item, index) { 
        if (item.type === slot) { 
            hasEquip = true; 
            let nAtk = item.atk ? item.atk : 0;
            let nDef = item.def ? item.def : 0;
            let nAgi = item.agi ? item.agi : 0;
            
            let diffText = "";
            if (nAtk !== 0 || cAtk !== 0) {
                let d = nAtk - cAtk; let color = d > 0 ? "#aaffaa" : (d < 0 ? "#ffaaaa" : "#888"); let sign = d > 0 ? "+" : (d === 0 ? "±" : "");
                diffText += "攻<span style='color:"+color+";'>" + sign + d + "</span> ";
            }
            if (nDef !== 0 || cDef !== 0) {
                let d = nDef - cDef; let color = d > 0 ? "#aaffaa" : (d < 0 ? "#ffaaaa" : "#888"); let sign = d > 0 ? "+" : (d === 0 ? "±" : "");
                diffText += "守<span style='color:"+color+";'>" + sign + d + "</span> ";
            }
            if (nAgi !== 0 || cAgi !== 0) {
                let d = nAgi - cAgi; let color = d > 0 ? "#aaffaa" : (d < 0 ? "#ffaaaa" : "#888"); let sign = d > 0 ? "+" : (d === 0 ? "±" : "");
                diffText += "速<span style='color:"+color+";'>" + sign + d + "</span> ";
            }
            
            html += "<li style='cursor:pointer; padding:10px 8px; border-bottom:1px dashed #555; background:#222; margin-bottom:4px; border-radius:4px;' onclick='equipItem(" + index + ")'>▶ " + item.name + " <span style='font-size:12px; color:#aaa;'>(" + diffText.trim() + ")</span></li>"; 
        } 
    });
    html += "</ul>"; 
    if (!hasEquip) { html += "<div style='color:#888; margin-bottom:10px;'>そうびできる ものを もっていない。</div>"; }
    
    html += "<div style='display:flex; gap:10px; margin-top:15px;'>";
    html += "<div style='flex:1; text-align:center; cursor:pointer; background:#800; padding:8px; border-radius:4px; border:1px solid #faa;' onclick='unequipItem(\"" + slot + "\")'>はずす</div>";
    html += "<div style='flex:1; text-align:center; cursor:pointer; background:#555; padding:8px; border-radius:4px; border:1px solid #fff;' onclick='showEquip()'>もどる</div>";
    html += "</div>";
    details.innerHTML = html;
}

function equipItem(inventoryIndex) { 
    if (typeof Sound !== 'undefined' && Sound.cursor3) Sound.cursor3(); 
    const item = playerStatus.inventory[inventoryIndex]; const slot = item.type; if (playerStatus.equipment[slot]) { playerStatus.inventory.push(playerStatus.equipment[slot]); } playerStatus.equipment[slot] = item; playerStatus.inventory.splice(inventoryIndex, 1); calcPlayerStats(); updateMiniStatus(); updateMenuStats(); showEquip(); 
}
function unequipItem(slot) { 
    if (typeof Sound !== 'undefined' && Sound.cursor3) Sound.cursor3(); 
    const item = playerStatus.equipment[slot]; if (item) { playerStatus.inventory.push(item); playerStatus.equipment[slot] = null; calcPlayerStats(); updateMiniStatus(); updateMenuStats(); showEquip(); } 
}

function showMFA() {
    if (typeof Sound !== 'undefined' && Sound.cursor2) Sound.cursor2(); 
    const details = document.getElementById('menu-details');
    if (!playerStatus.flags.hasMFA) { details.innerHTML = "<div style='color:#ffaaaa;'>MFAの アプリが インストール されていません。<br>どこかの宝箱から 見つけましょう。</div>"; return; }
    
    if (currentMapKey !== "0") { 
        details.innerHTML = "<div style='color:#ffaaaa;'>電波が 届かないようだ……。<br>MFAは 外(フィールド)でしか 使えない！</div>"; 
        return; 
    }

    let html = "<div style='color:#aaaaff; font-size:14px; margin-bottom:10px;'>どこへ フライアウェイ しますか？</div><ul style='list-style:none; padding:0; margin:0;'>";
    
    html += "<li style='cursor:pointer; padding:12px; border-bottom:1px dashed #555; background:#222; margin-bottom:5px; border-radius:4px;' onclick='executeMFA(\"1\", 19, 37)'>▶ よつかいどう (自宅)</li>";
    
    if (playerStatus.flags.mfaVersion >= 2) {
        if (playerStatus.flags.visited_2) html += "<li style='cursor:pointer; padding:12px; border-bottom:1px dashed #555; background:#222; margin-bottom:5px; border-radius:4px;' onclick='executeMFA(\"2\", 19, 39)'>▶ ゲオ周辺</li>";
        if (playerStatus.flags.visited_5) html += "<li style='cursor:pointer; padding:12px; border-bottom:1px dashed #555; background:#222; margin-bottom:5px; border-radius:4px;' onclick='executeMFA(\"5\", 39, 20)'>▶ 蕎麦屋</li>";
        if (playerStatus.flags.visited_4) html += "<li style='cursor:pointer; padding:12px; border-bottom:1px dashed #555; background:#222; margin-bottom:5px; border-radius:4px;' onclick='executeMFA(\"4\", 14, 29)'>▶ 繁華街</li>";
        if (playerStatus.flags.visited_6) html += "<li style='cursor:pointer; padding:12px; border-bottom:1px dashed #555; background:#222; margin-bottom:5px; border-radius:4px;' onclick='executeMFA(\"6\", 29, 15)'>▶ 最後の街</li>";
        if (playerStatus.flags.visited_17) html += "<li style='cursor:pointer; padding:12px; border-bottom:1px dashed #555; background:#222; margin-bottom:5px; border-radius:4px;' onclick='executeMFA(\"17\", 9, 18)'>▶ 南西の街</li>";
        if (playerStatus.flags.visited_18) html += "<li style='cursor:pointer; padding:12px; border-bottom:1px dashed #555; background:#222; margin-bottom:5px; border-radius:4px;' onclick='executeMFA(\"18\", 14, 12)'>▶ もちだの家</li>";
    }
   
    html += "</ul>"; details.innerHTML = html;
}

function executeMFA(mapId, x, y) { 
    if (typeof Sound !== 'undefined' && Sound.decide) Sound.decide();
    closeMenu(); showMessage("のぶゆき は MFAを 起動した！"); 
    setTimeout(() => { 
        const container = document.getElementById('game-container'); const fade = document.createElement('div'); fade.style.position = 'absolute'; fade.style.inset = '0'; fade.style.background = '#fff'; fade.style.opacity = '0'; fade.style.transition = 'opacity 0.5s'; fade.style.zIndex = '99'; container.appendChild(fade); 
        setTimeout(() => { fade.style.opacity = '1'; }, 50); 
        setTimeout(() => { 
            window.returnStack = []; window.worldReturn = null;
            if(typeof loadMap === 'function') loadMap(mapId); player.x = x; player.y = y; if(typeof draw === 'function') draw(); fade.style.opacity = '0'; setTimeout(() => { if(container.contains(fade)) container.removeChild(fade); }, 500); 
            
            // 💥【NEW】MFAワープ後にもオートセーブ！
            if (typeof window.autoSave === 'function') window.autoSave();
            
        }, 800); 
    }, 1000); 
}

function showMap() {
    if (typeof Sound !== 'undefined' && Sound.cursor2) Sound.cursor2(); 
    let hasMap = false;
    for(let i=0; i<playerStatus.inventory.length; i++) {
        if(playerStatus.inventory[i].name === "よつかいどうの地図" || playerStatus.inventory[i].name === "世界地図コード") hasMap = true;
    }
    if (!hasMap) { alert("地図を 持っていない！"); return; }
    
    closeMenu();
    if(typeof showWorldMap === 'function') showWorldMap();
}

function showSettings() {
    if (typeof Sound !== 'undefined' && Sound.cursor2) Sound.cursor2(); 
    const details = document.getElementById('menu-details');
    
    let bgmBtnColor = (typeof Sound !== 'undefined' && Sound.bgmMuted) ? "#800" : "#282";
    let bgmBtnText = (typeof Sound !== 'undefined' && Sound.bgmMuted) ? "OFF" : "ON";
    let seBtnColor = (typeof Sound !== 'undefined' && Sound.seMuted) ? "#800" : "#282";
    let seBtnText = (typeof Sound !== 'undefined' && Sound.seMuted) ? "OFF" : "ON";
    let curBgmVol = (typeof Sound !== 'undefined') ? Sound.bgmVolume : 0.4;
    let curSeVol = (typeof Sound !== 'undefined') ? Sound.seVolume : 1.0;

    let html = "<div style='color:#aaffaa; margin-bottom:15px; font-size:18px; text-align:center;'>【サウンド設定】</div>";
    
    html += "<div style='background:#111; padding:10px; border-radius:4px; margin-bottom:15px;'>";
    html += "<div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;'>";
    html += "<span>BGM音量</span>";
    html += "<span id='bgm-toggle-btn' style='cursor:pointer; background:" + bgmBtnColor + "; padding:4px 12px; border-radius:4px; border:1px solid #fff;' onclick='toggleBgmMuteMenu()'>" + bgmBtnText + "</span>";
    html += "</div>";
    html += "<input type='range' id='bgm-slider' min='0' max='1' step='0.05' value='" + curBgmVol + "' style='width:100%;' onchange='changeBgmVolMenu(this.value)' oninput='changeBgmVolMenu(this.value)'>";
    html += "</div>";

    html += "<div style='background:#111; padding:10px; border-radius:4px; margin-bottom:20px;'>";
    html += "<div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;'>";
    html += "<span>SE(効果音)</span>";
    html += "<span id='se-toggle-btn' style='cursor:pointer; background:" + seBtnColor + "; padding:4px 12px; border-radius:4px; border:1px solid #fff;' onclick='toggleSeMuteMenu()'>" + seBtnText + "</span>";
    html += "</div>";
    html += "<input type='range' id='se-slider' min='0' max='1' step='0.05' value='" + curSeVol + "' style='width:100%;' onchange='changeSeVolMenu(this.value)' oninput='changeSeVolMenu(this.value)'>";
    html += "</div>";

    html += "<hr style='border:none; border-top:1px dashed #555; margin:15px 0;'>";

    html += "<div style='color:#aaffaa; margin-bottom:10px;'>【システム設定】</div>";
    html += "<div style='margin-bottom:20px;'>敵の出現率: <select id='encRate' onchange='changeEncRate(this.value)' style='background:#222; color:#fff; padding:5px; font-size:16px;'>";
    let rates = [0.00, 0.03, 0.10, 0.20]; let rateLabels = ["出ない (0%)", "普通 (3%)", "多い (10%)", "地獄 (20%)"];
    for(let i=0; i<rates.length; i++) { let sel = (window.encounterRate === rates[i]) ? "selected" : ""; html += "<option value='" + rates[i] + "' " + sel + ">" + rateLabels[i] + "</option>"; }
    html += "</select></div>";
    
    html += "<div style='margin-bottom:10px;'>主人公のレベルを強制変更:</div>";
    html += "<div><input type='number' id='cheatLevel' value='"+playerStatus.level+"' min='1' max='30' style='width:60px; background:#222; color:#fff; padding:5px; font-size:16px;'> ";
    html += "<button type='button' onclick='applyCheatLevel(event)' ontouchstart='applyCheatLevel(event)' style='background:#800; color:#fff; border:1px solid #faa; padding:5px 15px; cursor:pointer;'>変更して確認</button></div>";
    html += "<div style='font-size:12px; color:#888; margin-top:5px;'>(※変更後、自動的に「つよさ」画面に移動します)</div>";
    
    details.innerHTML = html;
}

function changeEncRate(val) { window.encounterRate = parseFloat(val); alert("敵の出現率を変更しました！"); }

function applyCheatLevel(e) { 
    if(e) e.preventDefault(); 
    if (typeof Sound !== 'undefined' && Sound.decide) Sound.decide();
    const lvInput = document.getElementById('cheatLevel'); let lv = parseInt(lvInput.value); if (lv < 1) lv = 1; if (lv > 30) lv = 30; 
    let targetData = levelUpTable.find(t => t.level === lv); 
    if (!targetData && lv === 1) { 
        playerStatus.level = 1; playerStatus.exp = 0; playerStatus.maxHp = 15; playerStatus.maxMp = 0; playerStatus.str = 4; playerStatus.agi = 4; playerStatus.spells = []; 
    } else if (targetData) { 
        playerStatus.level = targetData.level; playerStatus.exp = targetData.exp; playerStatus.maxHp = targetData.hp; playerStatus.maxMp = targetData.mp; playerStatus.str = targetData.str; playerStatus.agi = targetData.agi; playerStatus.spells = []; 
        for (let i = 0; i < levelUpTable.length; i++) { if (levelUpTable[i].level <= lv && levelUpTable[i].spell) { playerStatus.spells.push(levelUpTable[i].spell); } } 
    } 
    playerStatus.hp = playerStatus.maxHp; playerStatus.mp = playerStatus.maxMp; 
    calcPlayerStats(); updateMiniStatus(); updateMenuStats(); showStatus();
}

function scrollList(elementId, amount) {
    const el = document.getElementById(elementId);
    if (el) { el.scrollTop += amount; if (typeof Sound !== 'undefined' && Sound.cursor2) Sound.cursor2(); }
}

// ==================================
// ショップシステム
// ==================================
var currentShopId = null;

function openShop(shopId) {
    if (typeof shops === 'undefined' || !shops[shopId]) return;
    if (typeof Sound !== 'undefined' && Sound.decide) Sound.decide();
    currentShopId = shopId; isMenuOpen = true; document.getElementById('menu-screen').classList.remove('hidden');
    const tabs = document.getElementById('menu-tabs'); if(tabs) tabs.style.display = 'none';
    
    const statsDiv = document.getElementById('menu-stats'); 
    statsDiv.innerHTML = "<div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;'><span style='color:#aaffaa;'>【おみせ】</span><span style='cursor:pointer; background:#800; padding:4px 10px; border-radius:4px; border:1px solid #ffaaaa; font-size:14px;' onclick='closeShop()'>✖ やめる</span></div>おかね: <span style='color:#ffffaa;' id='shop-gold-display'>" + playerStatus.gold + " G</span>";
    
    const details = document.getElementById('menu-details'); 
    let html = "<div style='color:#aaaaff; margin-bottom:20px; text-align:center; font-size:18px;'>いらっしゃいませ！<br>なにを しますか？</div>";
    html += "<div style='display:flex; flex-direction:column; gap:15px; align-items:center;'>";
    html += "<div style='cursor:pointer; background:#228; padding:15px 40px; border-radius:4px; border:1px solid #aaaaff; width:60%; text-align:center; font-size:18px;' onclick='showBuyList()'>かう</div>";
    html += "<div style='cursor:pointer; background:#282; padding:15px 40px; border-radius:4px; border:1px solid #afa; width:60%; text-align:center; font-size:18px;' onclick='showSellList()'>うる</div>";
    html += "</div>";
    details.innerHTML = html;
}

function showBuyList() {
    if (typeof Sound !== 'undefined' && Sound.decide) Sound.decide();
    const details = document.getElementById('menu-details'); 
    let html = "<div style='display:flex; justify-content:space-between; margin-bottom:5px;'><span style='color:#aaaaff;'>どれを かうかね？</span><div><span onclick='scrollList(\"shop-scroll\", -100)' style='background:#444; padding:5px 15px; margin-right:5px; border-radius:4px;'>▲</span><span onclick='scrollList(\"shop-scroll\", 100)' style='background:#444; padding:5px 15px; border-radius:4px;'>▼</span></div></div>";
    html += "<ul id='shop-scroll' style='list-style:none; padding:0; margin:0; max-height: 50vh; overflow-y: auto;'>";
    
    shops[currentShopId].forEach((entry, index) => { 
        const itemData = itemMaster[entry.type][entry.index]; 
        
        let diffText = "";
        if (["weapon", "armor", "shield", "accessory"].includes(itemData.type)) {
            let currentEquip = playerStatus.equipment[itemData.type];
            let cAtk = currentEquip && currentEquip.atk ? currentEquip.atk : 0;
            let cDef = currentEquip && currentEquip.def ? currentEquip.def : 0;
            let nAtk = itemData.atk || 0; let nDef = itemData.def || 0;
            
            if (nAtk > 0 || cAtk > 0) {
                let d = nAtk - cAtk; let color = d > 0 ? "#aaffaa" : (d < 0 ? "#ffaaaa" : "#888"); let sign = d > 0 ? "+" : (d === 0 ? "±" : "");
                diffText += `<span style='color:${color}; font-size:12px; margin-left:8px;'>(攻${sign}${d})</span>`;
            }
            if (nDef > 0 || cDef > 0) {
                let d = nDef - cDef; let color = d > 0 ? "#aaffaa" : (d < 0 ? "#ffaaaa" : "#888"); let sign = d > 0 ? "+" : (d === 0 ? "±" : "");
                diffText += `<span style='color:${color}; font-size:12px; margin-left:8px;'>(守${sign}${d})</span>`;
            }
        }

        let nameColor = (playerStatus.gold >= itemData.price) ? "#fff" : "#777";
        let priceColor = (playerStatus.gold >= itemData.price) ? "#ffffaa" : "#888";

        html += "<li style='cursor:pointer; padding:12px 8px; border-bottom:1px dashed #555; background:#222; margin-bottom:4px; border-radius:4px; display:flex; justify-content:space-between;' onclick='confirmBuyItem(" + index + ")'><span style='color:" + nameColor + ";'>▶ " + itemData.name + diffText + "</span> <span style='color:" + priceColor + ";'>" + itemData.price + " G</span></li>"; 
    });
    html += "</ul>"; 
    html += "<div style='text-align:center; margin-top:15px;'><span style='cursor:pointer; background:#555; padding:8px 30px; border-radius:4px; border:1px solid #fff;' onclick='openShop(currentShopId)'>もどる</span></div>";
    details.innerHTML = html;
}

window.shopItemIndex = null;
window.shopBuyQuantity = 1;
window.shopMaxAllowed = 1;

window.confirmBuyItem = function(index) {
    if (typeof Sound !== 'undefined' && Sound.decide) Sound.decide();
    window.shopItemIndex = index;
    const entry = shops[currentShopId][index]; 
    const itemData = itemMaster[entry.type][entry.index];
    
    let currentCount = 0;
    let existingItem = playerStatus.inventory.find(i => i.name === itemData.name);
    
    if (itemData.type === "heal" || itemData.type === "item") {
        currentCount = existingItem ? (existingItem.count || 1) : 0;
    } else {
        currentCount = playerStatus.inventory.filter(i => i.name === itemData.name).length;
    }
    
    let maxCanHold = 7 - currentCount;
    const details = document.getElementById('menu-details');
    
    if (maxCanHold <= 0) {
        let html = "<div style='color:#ffaaaa; text-align:center; margin-top:20px; font-size:18px;'>これいじょう 【" + itemData.name + "】 は<br>もてないようだ！ (最大7個)</div>";
        html += "<div style='text-align:center; margin-top:20px;'><span style='cursor:pointer; background:#555; padding:8px 30px; border-radius:4px; border:1px solid #fff;' onclick='showBuyList()'>もどる</span></div>";
        details.innerHTML = html;
        return;
    }
    
    let maxAffordable = Math.floor(playerStatus.gold / itemData.price);
    
    if (maxAffordable <= 0) {
        window.shopMaxAllowed = 0; 
        window.shopBuyQuantity = 0; 
    } else {
        window.shopMaxAllowed = Math.min(maxCanHold, maxAffordable);
        window.shopBuyQuantity = 1;
    }
    
    renderConfirmBuyItem();
};

window.changeBuyQuantity = function(amt) {
    if (window.shopMaxAllowed <= 0) return; 
    if (typeof Sound !== 'undefined' && Sound.cursor2) Sound.cursor2();
    window.shopBuyQuantity += amt;
    if(window.shopBuyQuantity < 1) window.shopBuyQuantity = 1;
    if(window.shopBuyQuantity > window.shopMaxAllowed) window.shopBuyQuantity = window.shopMaxAllowed;
    renderConfirmBuyItem();
};

window.renderConfirmBuyItem = function() {
    const entry = shops[currentShopId][window.shopItemIndex]; 
    const itemData = itemMaster[entry.type][entry.index];
    const details = document.getElementById('menu-details');
    
    let totalPrice = itemData.price * window.shopBuyQuantity;
    
    let html = "<div style='color:#aaaaff; margin-bottom:10px;'>【" + itemData.name + "】</div>";
    html += "ねだん: <span style='color:#ffffaa;'>" + itemData.price + " G</span><br><br>";
    
    if (["weapon", "armor", "shield", "accessory"].includes(itemData.type)) {
        let currentEquip = playerStatus.equipment[itemData.type];
        let cAtk = currentEquip && currentEquip.atk ? currentEquip.atk : 0;
        let cDef = currentEquip && currentEquip.def ? currentEquip.def : 0;
        let cAgi = currentEquip && currentEquip.agi ? currentEquip.agi : 0;
        
        let nAtk = itemData.atk ? itemData.atk : 0;
        let nDef = itemData.def ? itemData.def : 0;
        let nAgi = itemData.agi ? itemData.agi : 0;
        
        html += "<div style='background:#111; padding:10px; border-radius:4px; margin-bottom:15px;'>";
        if (nAtk > 0 || cAtk > 0) {
            let diff = nAtk - cAtk; let color = diff > 0 ? "#aaffaa" : (diff < 0 ? "#ffaaaa" : "#ffffff"); let sign = diff > 0 ? "+" : "";
            html += "こうげき力: " + cAtk + " ➔ <span style='color:" + color + ";'>" + nAtk + " (" + sign + diff + ")</span><br>";
        }
        if (nDef > 0 || cDef > 0) {
            let diff = nDef - cDef; let color = diff > 0 ? "#aaffaa" : (diff < 0 ? "#ffaaaa" : "#ffffff"); let sign = diff > 0 ? "+" : "";
            html += "しゅび力: " + cDef + " ➔ <span style='color:" + color + ";'>" + nDef + " (" + sign + diff + ")</span><br>";
        }
        if (nAgi > 0 || cAgi > 0) {
            let diff = nAgi - cAgi; let color = diff > 0 ? "#aaffaa" : (diff < 0 ? "#ffaaaa" : "#ffffff"); let sign = diff > 0 ? "+" : "";
            html += "すばやさ: " + cAgi + " ➔ <span style='color:" + color + ";'>" + nAgi + " (" + sign + diff + ")</span><br>";
        }
        html += "</div>";
    } else if (itemData.type === "heal") {
        html += "<div style='color:#aaffaa; margin-bottom:15px;'>HPを " + itemData.value + " かいふくするぞ。</div>";
    } else {
        html += "<div style='color:#aaffaa; margin-bottom:15px;'>どうぐ だ。</div>";
    }
    
    if (window.shopMaxAllowed <= 0) {
        html += "<div style='color:#ffaaaa; text-align:center; font-size:16px; margin-bottom:15px; padding:10px; border:1px solid #ffaaaa; border-radius:4px;'>これを かう おかねが<br>たりないようだね。</div>";
        html += "<div style='text-align:center;'><span style='cursor:pointer; background:#555; padding:8px 30px; border-radius:4px; border:1px solid #fff;' onclick='showBuyList()'>もどる</span></div>";
        details.innerHTML = html;
        return;
    }

    html += "<div style='display:flex; justify-content:space-between; align-items:center; background:#111; padding:10px; border-radius:4px; margin-bottom:15px;'>";
    html += "<span>いくつ かう？</span>";
    if (window.shopMaxAllowed > 1) {
        html += "<div style='display:flex; align-items:center; gap:15px;'>";
        html += "<span onclick='changeBuyQuantity(-1)' style='background:#444; padding:5px 15px; border-radius:4px; cursor:pointer; font-weight:bold; font-size:18px;'>-</span>";
        html += "<span style='font-size:20px; color:#fff; width:30px; text-align:center;'>" + window.shopBuyQuantity + "</span>";
        html += "<span onclick='changeBuyQuantity(1)' style='background:#444; padding:5px 15px; border-radius:4px; cursor:pointer; font-weight:bold; font-size:18px;'>+</span>";
        html += "</div>";
    } else {
        html += "<span style='font-size:20px; color:#fff; padding-right:15px;'>1</span>";
    }
    html += "</div>";

    html += "<div style='text-align:center; font-size:18px; margin-bottom:15px;'>ごうけい: <span style='color:#ffffaa;'>" + totalPrice + " G</span></div>";

    html += "<div style='display:flex; gap:10px; justify-content:center;'>";
    html += "<div style='cursor:pointer; background:#228; padding:10px 30px; border-radius:4px; border:1px solid #aaaaff;' onclick='buyItem()'>はい</div>";
    html += "<div style='cursor:pointer; background:#800; padding:10px 30px; border-radius:4px; border:1px solid #ffaaaa;' onclick='showBuyList()'>いいえ</div>";
    html += "</div>";
    
    details.innerHTML = html;
};

window.buyItem = function() { 
    const entry = shops[currentShopId][window.shopItemIndex]; 
    const itemData = itemMaster[entry.type][entry.index]; 
    let qty = window.shopBuyQuantity;
    let totalPrice = itemData.price * qty;

    if (playerStatus.gold >= totalPrice) { 
        if (typeof Sound !== 'undefined' && Sound.itemGet) Sound.itemGet(); 
        playerStatus.gold -= totalPrice; 
        
        if (itemData.type === "heal" || itemData.type === "item") {
            let existingItem = playerStatus.inventory.find(i => i.name === itemData.name);
            if (existingItem) {
                existingItem.count = (existingItem.count || 1) + qty;
            } else {
                let newItem = JSON.parse(JSON.stringify(itemData));
                newItem.count = qty;
                playerStatus.inventory.push(newItem);
            }
        } else {
            for(let i=0; i<qty; i++){
                let newItem = JSON.parse(JSON.stringify(itemData));
                playerStatus.inventory.push(newItem); 
            }
        }
        
        updateMiniStatus(); 
        const goldDisp = document.getElementById('shop-gold-display');
        if(goldDisp) goldDisp.innerText = playerStatus.gold + " G";
        
        if (qty === 1 && ["weapon", "armor", "shield", "accessory"].includes(itemData.type)) {
            const details = document.getElementById('menu-details'); 
            let html = "<div style='color:#aaffaa; margin-bottom:15px; font-size:18px; text-align:center;'>" + itemData.name + " を かった！<br>さっそく そうび していくかね？</div>";
            html += "<div style='display:flex; gap:10px; justify-content:center;'>";
            html += "<div style='cursor:pointer; background:#228; padding:10px 30px; border-radius:4px; border:1px solid #aaaaff;' onclick='equipJustBought(\"" + itemData.type + "\")'>はい</div>";
            html += "<div style='cursor:pointer; background:#800; padding:10px 30px; border-radius:4px; border:1px solid #ffaaaa;' onclick='showBuyList()'>いいえ</div>";
            html += "</div>";
            details.innerHTML = html;
        } else {
            showBuyList(); 
            let msg = itemData.name + " を ";
            if(qty > 1) msg += qty + "こ ";
            msg += "かった！";
            setTimeout(() => alert(msg), 100); 
        }
    } else { 
        if (typeof Sound !== 'undefined' && Sound.cursor2) Sound.cursor2();
        alert("おかねが たりないようだね。"); 
    } 
};

window.equipJustBought = function(slot) {
    if (typeof Sound !== 'undefined' && Sound.cursor3) Sound.cursor3(); 
    let itemIndex = playerStatus.inventory.length - 1;
    const item = playerStatus.inventory[itemIndex]; 
    
    if (playerStatus.equipment[slot]) { playerStatus.inventory.push(playerStatus.equipment[slot]); } 
    playerStatus.equipment[slot] = item; 
    playerStatus.inventory.splice(itemIndex, 1); 
    
    calcPlayerStats(); updateMiniStatus(); updateMenuStats(); 
    showBuyList();
    setTimeout(() => alert(item.name + " を そうびした！"), 100); 
};

function showSellList() {
    if (typeof Sound !== 'undefined' && Sound.decide) Sound.decide();
    const details = document.getElementById('menu-details');
    const goldDisp = document.getElementById('shop-gold-display');
    if(goldDisp) goldDisp.innerText = playerStatus.gold + " G";

    let html = "<div style='display:flex; justify-content:space-between; margin-bottom:5px;'><span style='color:#aaaaff;'>どれを うるかね？</span><div><span onclick='scrollList(\"sell-scroll\", -100)' style='background:#444; padding:5px 15px; margin-right:5px; border-radius:4px;'>▲</span><span onclick='scrollList(\"sell-scroll\", 100)' style='background:#444; padding:5px 15px; border-radius:4px;'>▼</span></div></div>";
    html += "<ul id='sell-scroll' style='list-style:none; padding:0; margin:0; max-height: 50vh; overflow-y: auto;'>";

    let hasSellable = false;
    playerStatus.inventory.forEach((item, index) => {
        let sellPrice = Math.floor((item.price || 0) / 2); 
        if (sellPrice > 0) {
            hasSellable = true;
            let countText = item.count ? (" ×" + item.count) : "";
            html += "<li style='cursor:pointer; padding:12px 8px; border-bottom:1px dashed #555; background:#222; margin-bottom:4px; border-radius:4px; display:flex; justify-content:space-between;' onclick='confirmSellItem(" + index + ")'><span>▶ " + item.name + countText + "</span> <span style='color:#ffffaa;'>" + sellPrice + " G</span></li>";
        }
    });

    if (!hasSellable) { html += "<li style='padding:12px 8px; color:#888; text-align:center;'>うれる ものが ないようだ。</li>"; }

    html += "</ul>";
    html += "<div style='text-align:center; margin-top:15px;'><span style='cursor:pointer; background:#555; padding:8px 30px; border-radius:4px; border:1px solid #fff;' onclick='openShop(currentShopId)'>もどる</span></div>";
    details.innerHTML = html;
}

function confirmSellItem(index) {
    if (typeof Sound !== 'undefined' && Sound.decide) Sound.decide();
    const item = playerStatus.inventory[index];
    let sellPrice = Math.floor((item.price || 0) / 2);

    const details = document.getElementById('menu-details');
    let html = "<div style='color:#aaaaff; margin-bottom:15px; text-align:center; font-size:18px;'>【" + item.name + "】</div>";
    html += "<div style='text-align:center; margin-bottom:25px;'>それなら <span style='color:#ffffaa; font-size:20px;'>" + sellPrice + " G</span> で<br>ひきとろう。 いいかね？</div>";

    html += "<div style='display:flex; gap:10px; justify-content:center;'>";
    html += "<div style='cursor:pointer; background:#228; padding:10px 30px; border-radius:4px; border:1px solid #aaaaff;' onclick='sellItem(" + index + ")'>はい</div>";
    html += "<div style='cursor:pointer; background:#800; padding:10px 30px; border-radius:4px; border:1px solid #ffaaaa;' onclick='showSellList()'>いいえ</div>";
    html += "</div>";
    details.innerHTML = html;
}

function sellItem(index) {
    const item = playerStatus.inventory[index];
    let sellPrice = Math.floor((item.price || 0) / 2);

    if (typeof Sound !== 'undefined' && Sound.itemGet) Sound.itemGet(); 
    playerStatus.gold += sellPrice;

    if (item.count && item.count > 1) {
        item.count--;
    } else {
        playerStatus.inventory.splice(index, 1);
    }

    updateMiniStatus();
    showSellList();
    
    setTimeout(() => alert(item.name + " を うった！\n" + sellPrice + " G を てにいれた！"), 100);
}

function closeShop() { 
    if (typeof Sound !== 'undefined' && Sound.cursor2) Sound.cursor2();
    currentShopId = null; closeMenu(); const tabs = document.getElementById('menu-tabs'); if(tabs) tabs.style.display = 'flex'; 
    if (typeof window.autoSave === 'function') window.autoSave(); // 💥 ショップを閉じた時もオートセーブ！
}

var currentInnPrice = 0;
function openInn(price) {
    if (typeof Sound !== 'undefined' && Sound.decide) Sound.decide();
    currentInnPrice = price; isMenuOpen = true; document.getElementById('menu-screen').classList.remove('hidden');
    const tabs = document.getElementById('menu-tabs'); if(tabs) tabs.style.display = 'none';
    const statsDiv = document.getElementById('menu-stats'); statsDiv.innerHTML = "<div style='color:#aaffaa; margin-bottom:8px;'>【やどや】</div>おかね: <span style='color:#ffffaa;'>" + playerStatus.gold + " G</span>";
    const details = document.getElementById('menu-details');
    let html = "<div style='display:flex; gap:10px; justify-content:center; margin-top:30px;'><div style='cursor:pointer; background:#228; padding:15px 30px; border-radius:4px; border:1px solid #aaaaff; font-size:20px;' onclick='executeInn()'>はい</div><div style='cursor:pointer; background:#800; padding:15px 30px; border-radius:4px; border:1px solid #ffaaaa; font-size:20px;' onclick='closeShop()'>いいえ</div></div>"; details.innerHTML = html;
}

function executeInn() {
    if (playerStatus.gold >= currentInnPrice) {
        if (typeof Sound !== 'undefined' && Sound.itemGet) Sound.itemGet(); 
        playerStatus.gold -= currentInnPrice; closeShop(); 
        if(typeof window.isCutscene !== 'undefined') window.isCutscene = true;
        const container = document.getElementById('game-container'); const fade = document.createElement('div'); fade.style.position = 'absolute'; fade.style.inset = '0'; fade.style.background = '#000'; fade.style.opacity = '0'; fade.style.transition = 'opacity 1.0s'; fade.style.zIndex = '99'; container.appendChild(fade);
        setTimeout(() => { fade.style.opacity = '1'; }, 50);
        setTimeout(() => {
            playerStatus.hp = playerStatus.maxHp; playerStatus.mp = playerStatus.maxMp;
            if(typeof updateMiniStatus === 'function') updateMiniStatus(); fade.style.opacity = '0'; setTimeout(() => { if(container.contains(fade)) container.removeChild(fade); }, 1000);
            setTimeout(() => { 
                if(typeof window.isCutscene !== 'undefined') window.isCutscene = false; 
                if (currentMapKey === "6") { showMessage("おはよう！<page>……あれっ？ なぜか のぶゆきの パンツが<br>ビリビリに 引き裂かれている！？"); } else { showMessage("おはよう！<page>HP と MP が まんたんに なった！"); }
                
                // 💥【NEW】宿屋で回復した直後にもオートセーブ！
                if (typeof window.autoSave === 'function') window.autoSave(); 
            }, 500);
        }, 2000);
    } else { 
        if (typeof Sound !== 'undefined' && Sound.cursor2) Sound.cursor2();
        alert("おかねが たりないようだね。"); 
    }
}

function saveGameData() {
    if (typeof Sound !== 'undefined' && Sound.decide) Sound.decide();
    if (!confirm("これまでの ぼうけんのきろく を\nセーブしますか？")) return; 

    let saveData = {
        playerStatus: playerStatus,
        player: player,
        currentMapKey: currentMapKey,
        returnStack: window.returnStack || [],
        worldReturn: window.worldReturn || null,
        soundSettings: {
            bgmVolume: (typeof Sound !== 'undefined') ? Sound.bgmVolume : 0.4,
            seVolume: (typeof Sound !== 'undefined') ? Sound.seVolume : 1.0,
            bgmMuted: (typeof Sound !== 'undefined') ? Sound.bgmMuted : false,
            seMuted: (typeof Sound !== 'undefined') ? Sound.seMuted : false
        }
    };
    let npcStates = [];
    if(typeof npcs !== 'undefined') { npcs.forEach((n, idx) => { npcStates.push({opened: n.opened, hidden: n.hidden}); }); }
    saveData.npcStates = npcStates;
    localStorage.setItem("nobuMonSave", JSON.stringify(saveData));
    alert("冒険の書に 記録しました！");
}

function loadGameData() {
    let dataStr = localStorage.getItem("nobuMonSave");
    if (!dataStr) return false;
    try {
        let data = JSON.parse(dataStr);
        playerStatus = data.playerStatus; player = data.player; currentMapKey = data.currentMapKey;
        window.returnStack = data.returnStack; window.worldReturn = data.worldReturn;
        
        if (data.soundSettings && typeof Sound !== 'undefined') {
            Sound.bgmVolume = data.soundSettings.bgmVolume;
            Sound.seVolume = data.soundSettings.seVolume;
            Sound.bgmMuted = data.soundSettings.bgmMuted;
            Sound.seMuted = data.soundSettings.seMuted;
            if (Sound.bgmPlayer) Sound.bgmPlayer.volume = Sound.bgmMuted ? 0 : Sound.bgmVolume;
        }

        if (data.npcStates && typeof npcs !== 'undefined') {
            data.npcStates.forEach((state, idx) => { if (npcs[idx]) { npcs[idx].opened = state.opened; npcs[idx].hidden = state.hidden; } });
        }
        return true;
    } catch(e) { console.error(e); return false; }
}

window.toggleBgmMuteMenu = function() {
    if(typeof Sound !== 'undefined') {
        let isMuted = Sound.toggleBgmMute();
        if(!isMuted) Sound.decide();
        const btn = document.getElementById('bgm-toggle-btn');
        if(btn) {
            btn.innerText = isMuted ? "OFF" : "ON";
            btn.style.background = isMuted ? "#800" : "#282";
        }
    }
};
window.changeBgmVolMenu = function(val) {
    if(typeof Sound !== 'undefined') {
        Sound.changeBgmVolume(val);
        if(Sound.bgmMuted && val > 0) window.toggleBgmMuteMenu(); 
    }
};
window.toggleSeMuteMenu = function() {
    if(typeof Sound !== 'undefined') {
        let isMuted = Sound.toggleSeMute();
        if(!isMuted) Sound.decide(); 
        const btn = document.getElementById('se-toggle-btn');
        if(btn) {
            btn.innerText = isMuted ? "OFF" : "ON";
            btn.style.background = isMuted ? "#800" : "#282";
        }
    }
};
window.changeSeVolMenu = function(val) {
    if(typeof Sound !== 'undefined') {
        Sound.changeSeVolume(val);
        if(Sound.seMuted && val > 0) window.toggleSeMuteMenu();
        if (!Sound.seMuted) Sound.decide();
    }
};

window.updateMiniStatus = updateMiniStatus; window.openMenu = openMenu; window.closeMenu = closeMenu; window.updateMenuStats = updateMenuStats; window.showStatus = showStatus; window.showItems = showItems; window.showEquip = showEquip; window.showEquipList = showEquipList; window.useItemMenu = useItemMenu; window.equipItem = equipItem; window.unequipItem = unequipItem; window.calcPlayerStats = calcPlayerStats; 
window.openShop = openShop; window.showBuyList = showBuyList; window.confirmBuyItem = confirmBuyItem; window.buyItem = buyItem; window.equipJustBought = equipJustBought; window.showSellList = showSellList; window.confirmSellItem = confirmSellItem; window.sellItem = sellItem; window.closeShop = closeShop; 
window.showMFA = showMFA; window.executeMFA = executeMFA; window.showMap = showMap; window.openInn = openInn; window.executeInn = executeInn; window.showSettings = showSettings; window.applyCheatLevel = applyCheatLevel; window.scrollList = scrollList; window.changeEncRate = changeEncRate; window.showHack = showHack; window.useHackMenu = useHackMenu; window.saveGameData = saveGameData; window.loadGameData = loadGameData;

// ==========================================
// 🏦 よつかいどう銀行 システム
// ==========================================

window.openBank = function() {
    if (typeof Sound !== 'undefined' && Sound.decide) Sound.decide();
    isMenuOpen = true; 
    document.getElementById('menu-screen').classList.remove('hidden');
    const tabs = document.getElementById('menu-tabs'); if(tabs) tabs.style.display = 'none';
    
    if (typeof playerStatus.bankGold === 'undefined') playerStatus.bankGold = 0;

    const statsDiv = document.getElementById('menu-stats'); 
    statsDiv.innerHTML = "<div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;'><span style='color:#aaffaa;'>【よつかいどう銀行】</span><span style='cursor:pointer; background:#800; padding:4px 10px; border-radius:4px; border:1px solid #ffaaaa; font-size:14px;' onclick='closeShop()'>✖ やめる</span></div>てもち: <span style='color:#ffffaa;'>" + playerStatus.gold + " G</span><br>あずかり: <span style='color:#aaffaa;'>" + playerStatus.bankGold + " G</span>";
    
    const details = document.getElementById('menu-details'); 
    let html = "<div style='color:#aaaaff; margin-bottom:20px; text-align:center; font-size:18px;'>いらっしゃいませ！<br>ごようけん を おえらびください。</div>";
    html += "<div style='display:flex; flex-direction:column; gap:15px; align-items:center;'>";
    html += "<div style='cursor:pointer; background:#228; padding:15px 40px; border-radius:4px; border:1px solid #aaaaff; width:60%; text-align:center; font-size:18px;' onclick='showBankTransaction(\"deposit\")'>あずける</div>";
    html += "<div style='cursor:pointer; background:#282; padding:15px 40px; border-radius:4px; border:1px solid #afa; width:60%; text-align:center; font-size:18px;' onclick='showBankTransaction(\"withdraw\")'>ひきだす</div>";
    html += "</div>";
    details.innerHTML = html;
}

window.bankAmount = 0;
window.bankMode = "deposit";

window.showBankTransaction = function(mode) {
    if (typeof Sound !== 'undefined' && Sound.decide) Sound.decide();
    window.bankMode = mode;
    window.bankAmount = 0;
    renderBankTransaction();
}

window.changeBankAmount = function(amt) {
    if (typeof Sound !== 'undefined' && Sound.cursor2) Sound.cursor2();
    window.bankAmount += amt;
    let max = (window.bankMode === "deposit") ? playerStatus.gold : playerStatus.bankGold;
    if (window.bankAmount < 0) window.bankAmount = 0;
    if (window.bankAmount > max) window.bankAmount = max;
    renderBankTransaction();
}

window.renderBankTransaction = function() {
    const details = document.getElementById('menu-details');
    let isDep = (window.bankMode === "deposit");
    let title = isDep ? "いくら あずけますか？" : "いくら ひきだしますか？";
    let max = isDep ? playerStatus.gold : playerStatus.bankGold;

    let html = "<div style='color:#aaaaff; margin-bottom:15px; text-align:center; font-size:18px;'>" + title + "</div>";
    
    html += "<div style='display:flex; flex-direction:column; gap:10px; background:#111; padding:15px; border-radius:4px; margin-bottom:20px;'>";
    html += "<div style='text-align:center; font-size:24px; color:#ffffaa; margin-bottom:10px;'>" + window.bankAmount + " G</div>";
    
    html += "<div style='display:flex; justify-content:space-between; gap:5px;'>";
    html += "<span onclick='changeBankAmount(-1000)' style='background:#444; padding:8px 0; width:24%; text-align:center; border-radius:4px; cursor:pointer;'>-1000</span>";
    html += "<span onclick='changeBankAmount(-100)' style='background:#444; padding:8px 0; width:24%; text-align:center; border-radius:4px; cursor:pointer;'>-100</span>";
    html += "<span onclick='changeBankAmount(100)' style='background:#444; padding:8px 0; width:24%; text-align:center; border-radius:4px; cursor:pointer;'>+100</span>";
    html += "<span onclick='changeBankAmount(1000)' style='background:#444; padding:8px 0; width:24%; text-align:center; border-radius:4px; cursor:pointer;'>+1000</span>";
    html += "</div>";
    
    html += "<div style='text-align:center; margin-top:10px;'>";
    html += "<span onclick='changeBankAmount(" + max + ")' style='background:#662; padding:8px 20px; border-radius:4px; cursor:pointer; font-size:14px; border:1px solid #aa4;'>ぜんぶ (" + max + "G)</span>";
    html += "</div>";
    html += "</div>";

    html += "<div style='display:flex; gap:10px; justify-content:center;'>";
    html += "<div style='cursor:pointer; background:#228; padding:10px 30px; border-radius:4px; border:1px solid #aaaaff;' onclick='executeBankTransaction()'>けってい</div>";
    html += "<div style='cursor:pointer; background:#800; padding:10px 30px; border-radius:4px; border:1px solid #ffaaaa;' onclick='openBank()'>もどる</div>";
    html += "</div>";
    details.innerHTML = html;
}

window.executeBankTransaction = function() {
    if (window.bankAmount <= 0) {
        if (typeof Sound !== 'undefined' && Sound.cursor2) Sound.cursor2();
        return;
    }
    if (typeof Sound !== 'undefined' && Sound.itemGet) Sound.itemGet();

    if (window.bankMode === "deposit") {
        playerStatus.gold -= window.bankAmount;
        playerStatus.bankGold += window.bankAmount;
        setTimeout(() => alert(window.bankAmount + " G を あずけました！"), 100);
    } else {
        playerStatus.bankGold -= window.bankAmount;
        playerStatus.gold += window.bankAmount;
        setTimeout(() => alert(window.bankAmount + " G を ひきだしました！"), 100);
    }
    if(typeof updateMiniStatus === 'function') updateMiniStatus();
    
    // 💥【NEW】銀行でお金を出し入れした直後にもオートセーブ！
    if(typeof window.autoSave === 'function') window.autoSave(); 
    
    openBank();
}
