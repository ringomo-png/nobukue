// ==========================================
// 💾 game_data.js (ハッカー仕様・窃盗＆ヒント完全版)
// ==========================================

var itemMaster = {
    weapons: [
        { name: "きのぼう", type: "weapon", atk: 2, price: 10 },
        { name: "のれん", type: "weapon", atk: 4, price: 60 },
        { name: "どうののれん", type: "weapon", atk: 10, price: 180 },
        { name: "あいあん", type: "weapon", atk: 15, price: 560 },
        { name: "はがねののれん", type: "weapon", atk: 20, price: 1500 },
        { name: "ほのおののれん", type: "weapon", atk: 28, price: 9800 },
        { name: "黄金剣", type: "weapon", atk: 40, price: 0 } 
    ],
    armors: [
        { name: "かみのふく", type: "armor", def: 2, price: 20 },
        { name: "がいこつてぃ", type: "armor", def: 4, price: 70 },
        { name: "くさりのたいつ", type: "armor", def: 10, price: 300 },
        { name: "てつのすーつ", type: "armor", def: 16, price: 1000 },
        { name: "はがねのすーつ", type: "armor", def: 24, price: 3000 },
        { name: "まほうのすーつ", type: "armor", def: 24, price: 7800 },
        { name: "黄金スーツ", type: "armor", def: 28, price: 0 } 
    ],
    shields: [
        { name: "かわのねくたい", type: "shield", def: 4, price: 90 },
        { name: "てつのねくたい", type: "shield", def: 10, price: 800 },
        { name: "よつかいどうのねくたい", type: "shield", def: 20, price: 14800 }
    ],
    accessories: [
        { name: "よつかいどうの印", type: "accessory", def: 2, price: 20 }, 
        { name: "がんぐのおめん", type: "accessory", def: 2, price: 0 }, 
        { name: "黄金球", type: "accessory", atk: 0, def: 0, price: 10000 } 
    ],
    items: [
        { name: "しゃんてぃ", type: "heal", value: 45, price: 24 }, 
        { name: "家の鍵", type: "item", price: 0 },             
        { name: "武器庫の鍵", type: "item", price: 0 },           
        { name: "MFA", type: "item", price: 0 },                
        { name: "世界地図コード", type: "item", price: 0 },         
        { name: "よつかいどうの地図", type: "item", price: 0 },
        { name: "インド魔除け", type: "item", price: 300 }
    ]
};

var shops = {
    "shop_item": [ { type: "items", index: 0 } ],
    "shop_home": [ { type: "weapons", index: 0 }, { type: "weapons", index: 1 }, { type: "weapons", index: 2 }, { type: "armors", index: 0 }, { type: "armors", index: 1 }, { type: "shields", index: 0 }, { type: "accessories", index: 0 } ], 
    "shop_geo": [ { type: "weapons", index: 1 }, { type: "weapons", index: 2 }, { type: "weapons", index: 3 }, { type: "armors", index: 1 }, { type: "armors", index: 2 }, { type: "armors", index: 3 }, { type: "shields", index: 0 }, { type: "shields", index: 1 } ],
    "shop_sobaya": [ { type: "weapons", index: 2 }, { type: "weapons", index: 3 }, { type: "weapons", index: 4 }, { type: "armors", index: 0 }, { type: "armors", index: 1 }, { type: "armors", index: 2 } ],
    "shop_hankagai": [ { type: "weapons", index: 4 }, { type: "armors", index: 4 }, { type: "armors", index: 5 }, { type: "shields", index: 1 } ], 
    "shop_saigo": [ { type: "weapons", index: 5 }, { type: "armors", index: 4 }, { type: "shields", index: 2 } ],
    "shop_bunny": [ { type: "items", index: 0 }, { type: "items", index: 6 } ]
};

var playerStatus = {
    level: 1, exp: 0, hp: 15, maxHp: 15, mp: 0, maxMp: 0,
    str: 4, agi: 4, atk: 4, def: 2, gold: 100, bankGold: 0, // 

    inventory: [ { name: "しゃんてぃ", type: "heal", value: 45, count: 3 } ], 
    equipment: { weapon: null, armor: null, shield: null, accessory: null },
    spells: [],
   flags: { hasMFA: false, mfaVersion: 1, bossKey1: false, bossKey2: false, bossKey3: false, defeatedTanaka: false, defeatedRobber: false, defeatedMochida: false, defeatedGolem: false, gameClear: false, deathCount: 0 } 
};

var levelUpTable = [
    { level: 2, exp: 7, str: 5, agi: 4, hp: 22, mp: 0, spell: null },
    { level: 3, exp: 23, str: 7, agi: 6, hp: 24, mp: 5, spell: { name: "セルフパッチ", cost: 3, type: "heal", value: 30 } },
    { level: 4, exp: 47, str: 7, agi: 8, hp: 31, mp: 16, spell: { name: "火をふく", cost: 2, type: "attack", value: 12 } },
    { level: 5, exp: 110, str: 11, agi: 10, hp: 35, mp: 20, spell: null },
    { level: 6, exp: 220, str: 16, agi: 10, hp: 38, mp: 24, spell: null },
    { level: 7, exp: 450, str: 18, agi: 17, hp: 40, mp: 26, spell: { name: "スリープモード", cost: 2, type: "sleep", value: 0 } }, 
    { level: 8, exp: 800, str: 22, agi: 20, hp: 46, mp: 29, spell: null },
    { level: 9, exp: 1300, str: 25, agi: 22, hp: 50, mp: 36, spell: { name: "人工的ビブラート", cost: 3, type: "debuff_def", value: 0 } }, 
    { level: 10, exp: 2000, str: 27, agi: 24, hp: 54, mp: 40, spell: { name: "魔法封じ顔", cost: 3, type: "silence", value: 0 } },
    { level: 11, exp: 2900, str: 33, agi: 31, hp: 62, mp: 50, spell: null },
    { level: 12, exp: 4000, str: 40, agi: 36, hp: 63, mp: 58, spell: { name: "イカレ魔人", cost: 6, type: "majin", value: 0 } },
    { level: 13, exp: 5500, str: 48, agi: 43, hp: 70, mp: 64, spell: { name: "はっく&ひーる", cost: 7, type: "drain", value: 26 } },
    { level: 14, exp: 7500, str: 50, agi: 47, hp: 78, mp: 70, spell: null },
    { level: 15, exp: 10000, str: 53, agi: 52, hp: 86, mp: 72, spell: { name: "しゃんてぃα", cost: 6, type: "heal", value: 85 } },
    { level: 16, exp: 13000, str: 60, agi: 58, hp: 92, mp: 95, spell: null },
    { level: 17, exp: 17000, str: 68, agi: 64, hp: 100, mp: 100, spell: { name: "まぐま",  cost: 8, type: "attack", value: 65 } },
    { level: 18, exp: 21000, str: 74, agi: 71, hp: 115, mp: 108, spell: null },
    { level: 19, exp: 25000, str: 80, agi: 76, hp: 130, mp: 115, spell: { name: "大爆発", cost: 12, type: "explosion", value: 100 } },
    { level: 20, exp: 29000, str: 85, agi: 82, hp: 138, mp: 128, spell: null },
    { level: 21, exp: 33000, str: 91, agi: 88, hp: 149, mp: 135, spell: null },
    { level: 22, exp: 37000, str: 97, agi: 94, hp: 158, mp: 146, spell: null },
    { level: 23, exp: 41000, str: 103, agi: 99, hp: 165, mp: 153, spell: null },
    { level: 24, exp: 45000, str: 109, agi: 104, hp: 170, mp: 161, spell: null },
    { level: 25, exp: 49000, str: 115, agi: 109, hp: 174, mp: 161, spell: null },
    { level: 26, exp: 53000, str: 121, agi: 114, hp: 180, mp: 168, spell: null },
    { level: 27, exp: 57000, str: 127, agi: 118, hp: 189, mp: 175, spell: null },
    { level: 28, exp: 61000, str: 132, agi: 122, hp: 195, mp: 180, spell: null },
    { level: 29, exp: 65000, str: 136, agi: 126, hp: 200, mp: 190, spell: null },
    { level: 30, exp: 65535, str: 140, agi: 130, hp: 210, mp: 200, spell: null }
];

var enemiesMaster = [
    { id: "slime", img: "monster (21).PNG", name: "くろぱち", hp: 5, maxHp: 3, atk: 5, def: 3, agi: 1, exp: 1, gold: 2, spell: null },
    { id: "slime_beth", img: "monster (1).PNG", name: "みどりぱち", hp: 5, maxHp: 4, atk: 7, def: 3, agi: 2, exp: 2, gold: 4, spell: null },
    { id: "ghost", img: "monster (11).PNG", name: "えいてぃえむ", hp: 7, maxHp: 7, atk: 11, def: 8, agi: 7, exp: 3, gold: 4, spell: null },
    { id: "magician", img: "monster (2).PNG", name: "まじっく", hp: 12, maxHp: 12, atk: 11, def: 12, agi: 12, exp: 4, gold: 10, spell: {name:"ひのたま", type:"attack", value:8} },
    { id: "scorpion", img: "monster (22).PNG", name: "よろいぱち", hp: 20, maxHp: 20, atk: 18, def: 16, agi: 16, exp: 6, gold: 16, spell: null },
    { id: "kemono", img: "monster (16).PNG", name: "りーぜんと", hp: 25, maxHp: 25, atk: 25, def: 18, agi: 20, exp: 8, gold: 20, spell: null }, 
    { id: "yoroi_knight", img: "monster (14).PNG", name: "そるじゃー", hp: 29, maxHp: 29, atk: 38, def: 40, agi: 38, exp: 33, gold: 70, spell: {name:"せるふぱっち", type:"heal", value:30} },
    { id: "skeleton", img: "monster (6).PNG", name: "がいこつ", hp: 30, maxHp: 30, atk: 28, def: 22, agi: 17, exp: 11, gold: 30, spell: null },
    { id: "rikanto", img: "monster (15).PNG", name: "びーすと", hp: 39, maxHp: 39, atk: 40, def: 14, agi: 28, exp: 35, gold: 50, spell: null },
    { id: "magician2", img: "monster (17).PNG", name: "あかまじっく", hp: 25, maxHp: 25, atk: 25, def: 20, agi: 22, exp: 15, gold: 25, spell: {name:"火の玉", type:"attack", value:12} },
    
    { id: "goldman", img: "monster (19).PNG", name: "ごーるど", hp: 130, maxHp: 130, atk: 48, def: 15, agi: 12, exp: 120, gold: 500, spell: null },
    { id: "magician3", img: "monster (25).PNG", name: "あんこく", hp: 60, maxHp: 60, atk: 50, def: 40, agi: 40, exp: 180, gold: 60, spell: {name:"かえん", type:"attack", value:25} },
// 変更後（spellを追加！）
{ id: "rikanto2", img: "monster (13).PNG", name: "きんぐびーすと", hp: 70, maxHp: 70, atk: 72, def: 56, agi: 40, exp: 270, gold: 80, spell: {name:"じゅうおうのいかり", type:"attack", value:38} },

    { id: "metal_slime", img: "monster (24).PNG", name: "しろぱち", hp: 3, maxHp: 4, atk: 10, def: 250, agi: 255, exp: 800, gold: 6, spell: {name:"ひのたま", type:"attack", value:20} },
    { id: "golem", img: "monster (26).PNG", name: "すろっとまじん", hp: 90, maxHp: 90, atk: 60, def: 60, agi: 47, exp: 100, gold: 1700, spell: null },
    { id: "golem2", img: "monster (10).PNG", name: "いわまじん", hp: 85, maxHp: 85, atk: 140, def: 80, agi: 50, exp: 80, gold: 100, spell: null }, 
    { id: "shinigami_knight", img: "monster (20).PNG", name: "だーくそるじゃー", hp: 96, maxHp: 66, atk: 82, def: 42, agi: 44, exp: 384, gold: 110, spell: {name:"かえん", type:"attack", value:62} },
    { id: "dragon", img: "monster (5).PNG", name: "よつかいりゅう", hp: 65, maxHp: 65, atk: 88, def: 74, agi: 47, exp: 410, gold: 110, spell: {name:"ほのお", type:"attack", value:40} }, 
    { id: "dragon2", img: "monster (7).PNG", name: "あんこくりゅう", hp: 90, maxHp: 90, atk: 100, def: 100, agi: 60, exp: 600, gold: 150, spell: {name:"はげしいほのお", type:"attack", value:45} },
    { id: "ryuou", img: "monster (8).PNG", name: "第一", hp: 130, maxHp: 130, atk: 140, def: 200, agi: 47, exp: 0, gold: 0, spell: {name:"はげしいほのお", type:"attack", value:40} },
    { id: "ryuou_final", img: "monster (3).PNG", name: "魔王", hp: 200, maxHp: 200, atk: 140, def: 220, agi: 65, exp: 0, gold: 0, spell: {name:"しゃくねつ", type:"attack", value:60} },
    { id: "tanaka", img: "monster (9).PNG", name: "たなか", hp: 79, maxHp: 79, atk: 94, def: 92, agi: 53, exp: 130, gold: 300, spell: null }, 
    { id: "mimic", img: "monster (4).PNG", name: "でびっと", hp: 45, maxHp: 45, atk: 65, def: 50, agi: 45, exp: 60, gold: 450, spell: {name:"へんさいきげん", type:"death", value:0} },
    { id: "robber", img: "monster (12).PNG", name: "凶悪な強盗", hp: 60, maxHp: 60, atk: 35, def: 15, agi: 20, exp: 200, gold: 200, spell: null },
    { id: "mochida_boss", img: "monster (8).PNG", name: "もちだ", hp: 240, maxHp: 180, atk: 100, def: 110, agi: 55, exp: 500, gold: 0, spell: {name:"もっちーもちもち", type:"attack", value:60} },
    { id: "true_boss", img: "monster (3).PNG", name: "バックアップ", hp: 350, maxHp: 350, atk: 130, def: 150, agi: 90, exp: 0, gold: 0, spell: {name:"システム初期化", type:"attack", value:60} }
];

var warpZones = [
    { id: "w_jitaku", fromMap: "0", fromX: 32, fromY: 49, toMap: "1", toX: 19, toY: 37 },
    { id: "w_geo", fromMap: "0", fromX: 27, fromY: 28, toMap: "2", toX: 19, toY: 38 },
    { id: "w_geo_oku1", fromMap: "0", fromX: 7, fromY: 4, toMap: "3", toX: 4, toY: 9, saveReturn: true },
    { id: "w_geo_oku2", fromMap: "0", fromX: 54, fromY: 54, toMap: "14", toX: 4, toY: 9, saveReturn: true }, 
    { id: "w_geo_oku3", fromMap: "0", fromX: 113, fromY: 4, toMap: "15", toX: 4, toY: 9, saveReturn: true }, 
    { id: "w_hankagai", fromMap: "0", fromX: 105, fromY: 13, toMap: "4", toX: 14, toY: 29 },
    { id: "w_sobaya", fromMap: "0", fromX: 54, fromY: 23, toMap: "5", toX: 39, toY: 19 },
    { id: "w_saigonomachi", fromMap: "0", fromX: 81, fromY: 76, toMap: "6", toX: 29, toY: 14 },
    { id: "w_danjon_bougu", fromMap: "0", fromX: 11, fromY: 27, toMap: "7", toX: 0, toY: 1, saveReturn: true },
    { id: "w_rasuboss", fromMap: "0", fromX: 25, fromY: 54, toMap: "9", toX: 0, toY: 1, saveReturn: true },
    
    { id: "w_field_to_field3", fromMap: "0", fromX: 43, fromY: 26, toMap: "0", toX: 72, toY: 20 },
    { id: "w_field_to_field4", fromMap: "0", fromX: 72, fromY: 20, toMap: "0", toX: 43, toY: 26 },
    { id: "w_field_to_field1", fromMap: "0", fromX: 46, fromY: 19, toMap: "0", toX: 19, toY: 37 },
    { id: "w_field_to_field2", fromMap: "0", fromX: 19, fromY: 37, toMap: "0", toX: 46, toY: 19 },

    { id: "w_saigo_tika", fromMap: "6", fromX: 11, fromY: 8, toMap: "16", toX: 5, toY: 7, saveReturn: true }, 
    { id: "w_bougu_tika", fromMap: "7", fromX: 18, fromY: 2, toMap: "12", toX: 5, toY: 9, saveReturn: true },
    { id: "w_ken_tika", fromMap: "8", fromX: 11, fromY: 10, toMap: "13", toX: 5, toY: 9, saveReturn: true }, 
    
    { id: "w_rasu_boss_tika0", fromMap: "9", fromX: 0, fromY: 17, toMap: "11", toX: 5, toY: 7, saveReturn: true },
    { id: "w_rasu_boss_tika1", fromMap: "9", fromX: 1, fromY: 7, toMap: "10", toX: 5, toY: 7, saveReturn: true },
    { id: "w_rasu_boss_tika2", fromMap: "9", fromX: 4, fromY: 9, toMap: "10", toX: 5, toY: 7, saveReturn: true },
    { id: "w_rasu_boss_tika3", fromMap: "9", fromX: 6, fromY: 1, toMap: "10", toX: 5, toY: 7, saveReturn: true },
    { id: "w_rasu_boss_tika4", fromMap: "9", fromX: 11, fromY: 10, toMap: "10", toX: 5, toY: 7, saveReturn: true },
    { id: "w_rasu_boss_tika5", fromMap: "9", fromX: 16, fromY: 0, toMap: "10", toX: 5, toY: 7, saveReturn: true },
    { id: "w_rasu_boss_tika6", fromMap: "9", fromX: 17, fromY: 16, toMap: "10", toX: 5, toY: 7, saveReturn: true },

    { fromMap: "10", fromX: 5, fromY: 7, isDynamicReturn: true }, 
    { fromMap: "10", fromX: 5, fromY: 8, isDynamicReturn: true },
    { fromMap: "10", fromX: 5, fromY: 9, isDynamicReturn: true }, 
    { fromMap: "11", fromX: 5, fromY: 9, isDynamicReturn: true },
    { fromMap: "12", fromX: 5, fromY: 9, isDynamicReturn: true }, 
    { fromMap: "13", fromX: 5, fromY: 9, isDynamicReturn: true },
    { fromMap: "14", fromX: 4, fromY: 10, isDynamicReturn: true }, 
    { fromMap: "15", fromX: 4, fromY: 10, isDynamicReturn: true }, 
    { fromMap: "16", fromX: 5, fromY: 7, isDynamicReturn: true }, 
    { fromMap: "3",  fromX: 4, fromY: 10, isDynamicReturn: true },
    { fromMap: "7",  fromX: 5, fromY: 9, isDynamicReturn: true },
    { fromMap: "8",  fromX: 5, fromY: 9, isDynamicReturn: true },
    { fromMap: "9",  fromX: 0, fromY: 0, isDynamicReturn: true },

    { id: "w_out_jitaku", fromMap: "1", fromX: 19, fromY: 38, toMap: "0", toX: 32, toY: 50 },
    { id: "w_out_geo", fromMap: "2", fromX: 19, fromY: 39, toMap: "0", toX: 27, toY: 29 },
    { id: "w_out_hankagai", fromMap: "4", fromX: 14, fromY: 30, toMap: "0", toX: 105, toY: 14 },
    { id: "w_out_sobaya", fromMap: "5", fromX: 39, fromY: 20, toMap: "0", toX: 54, toY: 24 },
    { id: "w_out_saigonomachi", fromMap: "6", fromX: 29, fromY: 15, toMap: "0", toX: 81, toY: 77 },
    
    { id: "w_tanaka_town", fromMap: "0", fromX: 54, fromY: 97, toMap: "17", toX: 9, toY: 18 },
    { id: "w_out_tanaka_town", fromMap: "17", fromX: 9, fromY: 19, toMap: "0", toX: 54, toY: 98 }, 
    { id: "w_mochida_house", fromMap: "0", fromX: 38, fromY: 79, toMap: "18", toX: 14, toY: 12 }
];

var npcs = [
    { map: "1", x: 15, y: 16, imgId: 4, dir: 0, anim: 0, isStatic: true, innPrice: 10, message: "あら、おかえりなさい。<page>長旅で 疲れたでしょう？<page>10ゴールド だけど 泊まっていく？" },
    
    { 
        map: "1", x: 16, y: 5, imgId: 5, dir: 0, anim: 0, isStatic: true, isOyajiStart: true, 
        get message() { 
            return playerStatus.flags.gameClear 
            ? "親父「おぉ、のぶゆき！ よくぞ 四街道を 救ってくれた！<br>本当に ありがとう。<page>……なんじゃ、その顔は。<br>もう 次の冒険に 行ってしまうんじゃろ？<page>お前の ハッカー魂は 誰にも 止められんからな。<br>いつでも 応援しておるぞ！ 気をつけてな！」" 
            : "のぶゆきよ、よく帰ってきたな。<page>四街道は今、魔物だらけの<br>狂った街に なってしまった。<page>とりあえず 昔お前が働いていた<br>北西の『げぇお』に いってみてくれ。<page>あそこの店長なら<br>なにか わかるかもしれんな。<page>わしは これから 蕎麦屋の方へ<br>出稼ぎに行ってくる。あとは 頼んだぞ。"; 
        } 
    },

    { map: "1", x: 24, y: 19, imgId: 2, dir: 0, anim: 0, isStatic: true, shopId: "shop_home", message: "おう、のぶゆきか！<page>外は危ねえから 武器くらい持っていけよ！" }, 
    
    { map: "1", x: 20, y: 14, imgId: 3, dir: 0, anim: 0, message: "この四街道は とてつもなく 広いんだ。<page>まずは 東にある『ほこら』に 向かって、<br>「よつかいどうの地図」を<br>手に入れると いいぜ。<page>そういや、最近 この街の対岸に<br>巨大な データセンターが できたんだ。<page>街の連中が おかしくなったのも、<br>ちょうど その頃からだぜ……。" },

    { map: "1", x: 22, y: 8, noDraw: true, isDoor: true, requiredKey: "家の鍵", message: "とびらには カギが かかっている！" },
    { map: "1", x: 22, y: 6, noDraw: true, chestItem: { type: "gold", amount: 500 } }, 
    { map: "1", x: 23, y: 6, noDraw: true, chestItem: { type: "accessories", index: 1 } }, 
    
    { map: "2", x: 14, y: 15, imgId: 2, dir: 0, anim: 0, isStatic: true, shopId: "shop_geo", message: "いらっしゃい！ げぇおへようこそ！<page>……って、のぶゆき君じゃないか！<page>君がバイトを辞めてから、<br>店は 魔物だらけになっちゃってね。<page>仕方ないから ゲームの代わりに<br>武器を 売ってるんだよ。<page>そうそう、店の裏手に<br>昔の 常連の おやじさんが いるんだ。<page>アダルトコーナーの跡地で<br>なにか 探しているみたいだよ。" },
    { map: "2", x: 25, y: 15, imgId: 4, dir: 0, anim: 0, isStatic: true, innPrice: 20, message: "旅の おかたですね。<page>ごゆっくり どうぞ。<page>20ゴールド だけど 泊まっていく？" },
    { map: "2", x: 14, y: 24, imgId: 5, dir: 0, anim: 0, isStatic: true, message: "お金は ここでは あずかれないんじゃよ。<page>自分で しっかり 管理するんじゃな。<page>そういえば、ここから 東のトンネルを<br>抜けた先に 湖に囲まれた 『蕎麦屋』が<br>あるんじゃが……<page>最近、あの周辺を 凶悪な 強盗 が<br>うろついて おるらしい。<page>あそこの店長が 襲われでもしたら、<br>伝説のトンネルの 手がかりが<br>失われてしまうかもしれん。<page>急いで 様子を 見にいって やってくれんか？" },

    { map: "2", x: 25, y: 24, imgId: 1, dir: 0, anim: 0, isStatic: true, shopId: "shop_item", message: "いらっしゃいませ！<br>傷を癒す『しゃんてぃ』はいかがですか？<page>冒険の必需品ですよ！" }, 
    { map: "2", x: 19, y: 29, imgId: 3, dir: 0, anim: 0, message: "ここは 『げぇお』の村だ。<br>昔は でかいゲーム屋が あったらしいぜ。<page>この先は 魔物が ぐっと強くなるから、<br>しっかり 準備してから 行きなよ！" },
    { map: "2", x: 14, y: 11, imgId: 5, dir: 0, anim: 0, isGeouKey: true, message: "昔、ここのアダルトコーナーには たいへん お世話になったんじゃ……。<page>そういえば、そこに「家の鍵」が 落ちておったぞ。持っていくがよい。" },
    { map: "2", x: 28, y: 29, imgId: 2, dir: 0, anim: 0, message: "名前はもちだ。久しぶりだな、黒ちゃん。<br>もっちーもちもち……。<page>……ふぅ。<br>北西のほこらに お前が昔使った<br>ローカルパスが 落ちてたぜ。<page>あそこは 敵が強いから 気をつけろよ。<page>そういや お前、まだ『火』の魔法は<br>使えたっけか？ 準備してから行けよ。" },
    
    { map: "4", x: 6, y: 4, imgId: 2, dir: 0, anim: 0, isStatic: true, shopId: "shop_hankagai", message: "へっへっへ……<br>いい武器 揃ってるぜ！" },
    { map: "4", x: 13, y: 4, imgId: 4, dir: 0, anim: 0, isStatic: true, innPrice: 40, message: "ここは 繁華街の ホテルよ。<page>最近、インド人っぽい男が よく出入りしてるわね。<page>40ゴールド だけど 泊まっていく？" },
    { map: "4", x: 5, y: 23, imgId: 1, dir: 0, anim: 0, isStatic: true, shopId: "shop_bunny", message: "いらっしゃい！<br>しゃんてぃ と 怪しい魔除けが<br>おすすめ ヨ！" },

// 変更後
{ map: "4", x: 24, y: 16, imgId: 1, dir: 0, anim: 0, isStatic: true, isBank: true, message: "いらっしゃいませ！<br>よつかいどう銀行 繁華街支店へ ようこそ！<page>大切なお金、全滅しても安心な<br>当行が 責任をもって お預かりいたしますわ！" },

    { map: "4", x: 23, y: 7, noDraw: true, isDoor: true, requiredEquip: "がんぐのおめん", message: "『セキュリティーエラー！』<page>素顔のままでは 通れません。" },
    { map: "4", x: 23, y: 5, noDraw: true, isStepEvent: true, isEventBoss: true, bossId: "golem", message: "暗がりから いきなり 魔物が おそいかかってきた！" }, 
    { map: "4", x: 23, y: 3, noDraw: true, isBossKey2: true, message: "繁華街の 裏サーバーに アクセスした！<page>ボスのキーコード2 を MFAに ダウンロードした！" }, 
    { map: "4", x: 23, y: 22, imgId: 6, dir: 0, anim: 0, message: "砂漠を抜けて南にいくと 最後の街があるんだが、魔物的せいで 完全に孤立してしまっているんだ……。" },
    
    { map: "4", x: 21, y: 22, imgId: 5, dir: 0, anim: 0, message: "ボスの城にいくには「３つのキーコード」が<br>必要なんじゃ。<page>そのうちの １つは、代々 四街道に 伝わる<br>メッセージじゃよ。<page>『最後の街』にいる 娘さんが<br>知っているはずじゃ！" },
    { map: "4", x: 3, y: 17, imgId: 1, dir: 0, anim: 0, message: "この辺りは 財布をとられるから 注意してね。<page>そうそう、最近 怪しいインド人みたいな男が、奥の部屋に コソコソ入ったりしてるのよ。" },
    { map: "4", x: 10, y: 14, imgId: 2, dir: 0, anim: 0, message: "おい！<br>この台は俺のだからな！取るなよ！" },
    
    // 💥【ここに復活！】インド人の情報！
    { map: "4", x: 17, y: 16, imgId: 3, dir: 0, anim: 0, message: "はぁ……最近 全然パチンコが 当たらなくなったよ……<page>そういえば、最近 北東の洞窟 に<br>怪しいインド人が 入っていくのを<br>見たんだ……。<page>あいつ、絶対 なにか ヤバいものを<br>隠し持ってるぜ。" },

        // 💥 変更前
    // { map: "4", x: 11, y: 20, imgId: 1, dir: 0, anim: 0, message: "ここは 夜の街、繁華街よ。<br>羽目を 外しすぎないようにね。" },
    
    // 👇 変更後（座標を y:25 にして、世界観とヒントを追加！）
    { map: "4", x: 11, y: 25, imgId: 1, dir: 0, anim: 0, message: "ここは 夜の街、繁華街よ。<page>この街の 連中は、<br>ローカルな人以外の よそ者に 敏感なの。<page>でも、話しかければ<br>色々 教えてくれるはずよ。<br>どんどん 喋りかけてみてね。" },

    { map: "4", x: 24, y: 10, imgId: 2, dir: 0, anim: 0, message: "もちだ：おい 黒ちゃん……この奥の部屋、なんか すげぇあやしいぜ。<page>プンプン匂うぞ……強烈な スパイスと 血の匂いが 混ざってやがる……。" },
    
    // 💥 繁華街（マップ4）の窃盗スロット台×4（x:9〜12） / 完全版！
    { map: "4", x: 9, y: 13, noDraw: true, isStatic: true, get message() {
        if (playerStatus.flags.defeatedGolem) return "スロット魔人は 完全に 沈黙している……。<br>メダルが 散らばっている。";
        let hasMask = false;
        if (playerStatus.equipment.weapon && playerStatus.equipment.weapon.name === "がんぐのおめん") hasMask = true;
        if (playerStatus.equipment.armor && playerStatus.equipment.armor.name === "がんぐのおめん") hasMask = true;
        if (playerStatus.equipment.shield && playerStatus.equipment.shield.name === "がんぐのおめん") hasMask = true;
        if (playerStatus.equipment.accessory && playerStatus.equipment.accessory.name === "がんぐのおめん") hasMask = true;
        if (hasMask) {
            if (!playerStatus.flags.stolenFromSlot) {
                playerStatus.flags.stolenFromSlot = true; playerStatus.gold += 1000;
                if(typeof updateMiniStatus === 'function') updateMiniStatus();
                if(typeof Sound !== 'undefined' && Sound.itemGet) Sound.itemGet();
                return "スロットの 台に 客の 財布が<br>置かれている。<page>のぶゆき「財布で 場所取り なんて……<br>セキュリティレベルが<br>低すぎる 愚行だぜ」<page>のぶゆき は お面で 顔が<br>バレないのを いいことに<br>客の 財布を 盗み出した！<page>1000 G を てにいれた！";
            } else { return "スロットの 台には もう 何も ない。<br>これ以上は 足がつく……。"; }
        } else {
            return "スロットの 台に 客の 財布が<br>置かれている。<page>客が 財布で 場所取りを<br>しているようだ。";
        }
    }},
    { map: "4", x: 10, y: 13, noDraw: true, isStatic: true, get message() {
        if (playerStatus.flags.defeatedGolem) return "スロット魔人は 完全に 沈黙している……。<br>メダルが 散らばっている。";
        let hasMask = false;
        if (playerStatus.equipment.weapon && playerStatus.equipment.weapon.name === "がんぐのおめん") hasMask = true;
        if (playerStatus.equipment.armor && playerStatus.equipment.armor.name === "がんぐのおめん") hasMask = true;
        if (playerStatus.equipment.shield && playerStatus.equipment.shield.name === "がんぐのおめん") hasMask = true;
        if (playerStatus.equipment.accessory && playerStatus.equipment.accessory.name === "がんぐのおめん") hasMask = true;
        if (hasMask) {
            if (!playerStatus.flags.stolenFromSlot) {
                playerStatus.flags.stolenFromSlot = true; playerStatus.gold += 1000;
                if(typeof updateMiniStatus === 'function') updateMiniStatus();
                if(typeof Sound !== 'undefined' && Sound.itemGet) Sound.itemGet();
                return "スロットの 台に 客の 財布が<br>置かれている。<page>のぶゆき「財布で 場所取り なんて……<br>セキュリティレベルが<br>低すぎる 愚行だぜ」<page>のぶゆき は お面で 顔が<br>バレないのを いいことに<br>客の 財布を 盗み出した！<page>1000 G を てにいれた！";
            } else { return "スロットの 台には もう 何も ない。<br>これ以上は 足がつく……。"; }
        } else {
            return "スロットの 台に 客の 財布が<br>置かれている。<page>客が 財布で 場所取りを<br>しているようだ。";
        }
    }},
    { map: "4", x: 11, y: 13, noDraw: true, isStatic: true, get message() {
        if (playerStatus.flags.defeatedGolem) return "スロット魔人は 完全に 沈黙している……。<br>メダルが 散らばっている。";
        let hasMask = false;
        if (playerStatus.equipment.weapon && playerStatus.equipment.weapon.name === "がんぐのおめん") hasMask = true;
        if (playerStatus.equipment.armor && playerStatus.equipment.armor.name === "がんぐのおめん") hasMask = true;
        if (playerStatus.equipment.shield && playerStatus.equipment.shield.name === "がんぐのおめん") hasMask = true;
        if (playerStatus.equipment.accessory && playerStatus.equipment.accessory.name === "がんぐのおめん") hasMask = true;
        if (hasMask) {
            if (!playerStatus.flags.stolenFromSlot) {
                playerStatus.flags.stolenFromSlot = true; playerStatus.gold += 1000;
                if(typeof updateMiniStatus === 'function') updateMiniStatus();
                if(typeof Sound !== 'undefined' && Sound.itemGet) Sound.itemGet();
                return "スロットの 台に 客の 財布が<br>置かれている。<page>のぶゆき「財布で 場所取り なんて……<br>セキュリティレベルが<br>低すぎる 愚行だぜ」<page>のぶゆき は お面で 顔が<br>バレないのを いいことに<br>客の 財布を 盗み出した！<page>1000 G を てにいれた！";
            } else { return "スロットの 台には もう 何も ない。<br>これ以上は 足がつく……。"; }
        } else {
            return "スロットの 台に 客の 財布が<br>置かれている。<page>客が 財布で 場所取りを<br>しているようだ。";
        }
    }},
    { map: "4", x: 12, y: 13, noDraw: true, isStatic: true, get message() {
        if (playerStatus.flags.defeatedGolem) return "スロット魔人は 完全に 沈黙している……。<br>メダルが 散らばっている。";
        let hasMask = false;
        if (playerStatus.equipment.weapon && playerStatus.equipment.weapon.name === "がんぐのおめん") hasMask = true;
        if (playerStatus.equipment.armor && playerStatus.equipment.armor.name === "がんぐのおめん") hasMask = true;
        if (playerStatus.equipment.shield && playerStatus.equipment.shield.name === "がんぐのおめん") hasMask = true;
        if (playerStatus.equipment.accessory && playerStatus.equipment.accessory.name === "がんぐのおめん") hasMask = true;
        if (hasMask) {
            if (!playerStatus.flags.stolenFromSlot) {
                playerStatus.flags.stolenFromSlot = true; playerStatus.gold += 1000;
                if(typeof updateMiniStatus === 'function') updateMiniStatus();
                if(typeof Sound !== 'undefined' && Sound.itemGet) Sound.itemGet();
                return "スロットの 台に 客の 財布が<br>置かれている。<page>のぶゆき「財布で 場所取り なんて……<br>セキュリティレベルが<br>低すぎる 愚行だぜ」<page>のぶゆき は お面で 顔が<br>バレないのを いいことに<br>客の 財布を 盗み出した！<page>1000 G を てにいれた！";
            } else { return "スロットの 台には もう 何も ない。<br>これ以上は 足がつく……。"; }
        } else {
            return "スロットの 台に 客の 財布が<br>置かれている。<page>客が 財布で 場所取りを<br>しているようだ。";
        }
    }},

    { map: "5", x: 15, y: 22, imgId: 2, dir: 0, anim: 0, isStatic: true, shopId: "shop_sobaya", message: "蕎麦屋の 武器コーナーへ ようこそ！" },
    { map: "5", x: 7, y: 22, imgId: 1, dir: 0, anim: 0, isStatic: true, shopId: "shop_item", message: "いらっしゃいませー。<br>しゃんてぃ ありますよー。" },
    { map: "5", x: 14, y: 6, imgId: 6, dir: 0, anim: 0, message: "あのインド人みたいな男、さっき 一人でブツブツ言いながら 歩いてたぜ。やばい奴なんじゃねえか？" },
    { map: "5", x: 17, y: 6, imgId: 4, dir: 0, anim: 0, message: "この街の北東に 繫華街があるわ。<page>そこのカジノの奥には、顔を隠す『お面』がないと 入れないそうよ。" },
    { map: "5", x: 31, y: 30, imgId: 2, dir: 0, anim: 0, isStatic: true, isMochidaLassi: true, message: "もちだ：うっ…頭が…！ 最近、記憶が飛ぶんだ。<page>でも、お前が 魔王のせいで 困ってるんなら、俺も協力するぜ……！<page>ほら、俺特製の『バナナらっしー』だ。<br>これ飲んで がんばれよ！<br>もっちー…もちもち……。" },
    { map: "5", x: 34, y: 5, imgId: 5, dir: 0, anim: 0, isStatic: true, isOyajiPre: true, message: "ひぃぃ！ たすけてくれぇ！" },
    { map: "5", x: 34, y: 6, imgId: 3, dir: 3, anim: 0, isStatic: true, isRobberEvent: true, message: "強盗「へっへっへ、親父！ 金目のものを 出しな！」<page>親父「ひぃぃ！ ワシは ただの雇われ店長じゃ！ 金なんてないわい！」<page>強盗「あ？ なんだテメェは！ すっこんでろ！」" },
    
    { map: "5", x: 7, y: 6, imgId: 5, dir: 0, anim: 0, isStatic: true, isOyajiInn: true, innPrice: 50, message: "おお、のぶゆき！<br>さっきは 助けてくれて ありがとうな。<page>そういえば昔、ワシが 北西に<br>トンネルを 掘ったんじゃ。<page>その先には 伝説の武器が あるんじゃが……<br>まだ お前には 早いかもしれんな。<page>50ゴールド だけど 泊まっていくか？" },

    { map: "6", x: 18, y: 5, imgId: 4, dir: 0, anim: 0, isStatic: true, innPrice: 100, message: "ここは 最後の街の 宿屋です。<page>命を懸ける前に お休みになりますか？<page>100ゴールド だけど 泊まっていく？" },
    { map: "6", x: 25, y: 26, imgId: 2, dir: 0, anim: 0, isStatic: true, shopId: "shop_saigo", message: "よくぞ ここまで たどり着いた！<br>ウチの武器は 最高級だぜ！" },
    { map: "6", x: 8, y: 6, noDraw: true, isDoor: true, requiredKey: "武器庫の鍵", message: "とびらには カギが かかっている！" },
    { map: "6", x: 10, y: 28, noDraw: true, chestItem: { type: "items", index: 2 } }, 
      // 💥 文字数と行数を 完全に計算し尽くした 安全版！
    { map: "6", x: 26, y: 13, imgId: 5, dir: 0, anim: 0, message: "ここは 人類 最後の街 じゃ。<br>かつて この 四街道は、<br>もっと 活気に あふれていた……。<page>じゃが、魔王の サーバー侵食が<br>始まってから というもの、<br>人々は おかしくなってしまったんじゃ。<page>西の橋を 渡れば 魔王の城じゃ。<br>のぶゆきよ、お前の その<br>ハッキングスキルだけが 頼りじゃ！<page>どうか、この街を……<br>いや、世界を 救ってくれ！！" },

    { map: "6", x: 12, y: 19, imgId: 1, dir: 0, anim: 0, isStatic: true, shopId: "shop_item", message: "しゃんてぃ は いかがですか？" },

    // 👇 変更後（isStatic: true を追加し、安全な座標に完全固定！）
    { map: "6", x: 6, y: 14, imgId: 3, dir: 0, anim: 0, isStatic: true, message: "西には 魔王の城が あって危険だ。<page>橋を通ろうとすると、厳しい検問が あるらしいぞ。" },
    
    // 💥 y:16 だと狭いかもしれないから、y:17 にずらして固定したわ！
    { map: "6", x: 6, y: 16, imgId: 4, dir: 0, anim: 0, isStatic: true, message: "魔獣がでてから この街から<br>でれなくなってしまい 困っています……。<page>そういえば、この街には 代々<br>重要なキーコードを 受け継いでいる<br>娘さんが いるんですが……<page>最近、怪しい インド人みたいな男が<br>現れてから 姿を 見ていないんです。" },


    { map: "6", x: 10, y: 14, imgId: 6, dir: 0, anim: 0, message: "ターバンを巻いた男が、地下へ 女の人を 引きずっていくのを 見たぞ……！" },
    { map: "6", x: 27, y: 3, imgId: 3, dir: 0, anim: 0, message: "この奥は 秘密の通路だ。<br>誰にも 言うなよ？" },
    { map: "6", x: 6, y: 11, imgId: 4, dir: 0, anim: 0, message: "この街は 迷路みたいで 迷ってしまいましたわ……。" },
    
    { map: "6", x: 2, y: 26, imgId: 5, dir: 0, anim: 0, message: "四街道には 伝説の装備が<br>隠されておる。<page>一つは 南西の街、<br>もう一つは 北西のほこらじゃ。<page>いずれも 毒沼に おおわれているので、<br>渡るのは 至難の業じゃぞ。" },

    { map: "6", x: 25, y: 20, imgId: 3, dir: 0, anim: 0, message: "近くに 四街道ゴルフクラブが あるぞ。<page>かつて、Par4の2打目を 直接叩き込んだ<br>天才プレーヤーが いたんだ。<page>その時 使われた 伝説のボールは、<br>ものすごく 高く売れる みたいだぜ！" },

    { map: "3", x: 4, y: 4, noDraw: true, chestItem: { type: "items", index: 3 }, isMFA: true }, 
    { map: "14", x: 4, y: 4, noDraw: true, chestItem: { type: "items", index: 5 } }, 
    { map: "15", x: 4, y: 4, imgId: 2, dir: 0, anim: 0, isStatic: true, isMFAUpgrade: true, message: "おっ、黒ちゃん。<page>お前のMFA、俺が改造してやるよ！<br>これで一度行った街なら どこでも飛べるぜ！" },
    
    { map: "16", x: 7, y: 2, imgId: 1, dir: 0, anim: 0, isStatic: true, isBossKey3: true, message: "あの インド人みたいな男に 監禁されていたの……。<page>助けてくれて ありがとう。<br>お礼に キーコード3 を MFAに 書き込んであげる！" },

      // 💥 最後の街（マップ6）の隠し武器庫フラグ・もちだ！（究極完成版）
    { map: "6", x: 13, y: 11, imgId: 2, dir: 0, anim: 0, isStatic: true, message: "もちだ「おっ、黒ちゃん……。<br>よくぞ この 最後の街まで<br>たどり着いたな……。」<page>「実はな、この街には 俺の<br>隠し武器庫が あるんだぜ。<br>もっちーもちもち……。」<page>「カギが ないと 入れねぇけど……<br>絶対に 勝手に<br>入るんじゃねーぞ！」<page>「ここで 装備を 揃えるのも いいし、<br>伝説の武器を 探し出してから<br>魔王に 挑むのも アリだ。」<page>「すべては お前の 自由だ。<br>後悔のない 選択を<br>もっちーもちもち！」" },

    
    { map: "12", x: 5, y: 3, noDraw: true, chestItem: { type: "weapons", index: 6 } }, 
    
    { map: "10", x: 4, y: 3, noDraw: true, chestItem: { type: "items", index: 0 } }, 
    { map: "10", x: 5, y: 3, noDraw: true, chestItem: { type: "weapons", index: 5 } }, 
    { map: "11", x: 5, y: 5, imgId: 2, dir: 0, anim: 0, isStatic: true, isMochidaBoss: true, message: "もちだ「やあ黒ちゃん……。<br>いっしょに あそぼうよ……フフフ……。」" },
    { map: "0", x: 48, y: 85, noDraw: true, isStepEvent: true, isGoldBall: true, message: "なにかが 足元で 光っている……" },
    
    { map: "17", x: 5, y: 5, imgId: 3, dir: 0, anim: 0, isStatic: true, isTanakaEvent: true, message: "オイオイ、俺は田中だ。<page>って……お前、のぶゆき じゃねぇか！<page>あの時、俺の白バイを奪って 逃走しやがって……！<br>おかげで クビ寸前なんだよ！<page>罰金1000G 払うか、ここで ぶっ殺されるか 選べ！" },
    
    { map: "17", x: 5, y: 4, noDraw: true, chestItem: { type: "armors", index: 6 } },
    { map: "18", x: 14, y: 6, imgId: 2, dir: 0, anim: 0, isStatic: true, isMochidaHouseInn: true, message: "もちだ「ここまで 来たか……。<br>もっちーもちもち……。<page>わけあって 俺が 力になれるのも<br>ここまでだ。<page>この先の 魔物は かなり 強いぜ。<br>今日は ゆっくり 休んでいけよ。」" },
    
    { map: "7", x: 4, y: 9, noDraw: true, isRandomChest: true },
    { map: "7", x: 10, y: 9, noDraw: true, isRandomChest: true },
    { map: "7", x: 14, y: 5, noDraw: true, isRandomChest: true }
];
