// ==========================================
// 🎵 sound.js (バックグラウンド再生防止・個別音量チューニング版)
// ==========================================

window.Sound = {
    bgmPlayer: new Audio(),
    currentBgm: null,
    ctx: null, 
    unlocked: false,

    // 音量とミュート設定のプロパティ
    bgmVolume: 0.05, // 全体BGM音量
    seVolume: 1.0,
    bgmMuted: false,
    seMuted: false,
    
    // 裏画面にいった時にBGMが鳴っていたかを記憶するフラグ
    _wasPlayingOnHide: false,

    init: function() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
        if (this.ctx && !this.unlocked) {
            let buf = this.ctx.createBuffer(1, 1, 22050);
            let src = this.ctx.createBufferSource();
            src.buffer = buf; src.connect(this.ctx.destination); src.start(0);
            this.unlocked = true;
        }
    },

    playBGM: function(type) {
        if (this.currentBgm === type) return;
        this.currentBgm = type;
        this.bgmPlayer.pause();
        this.bgmPlayer.currentTime = 0;

        let src = "";
        let trackVol = 1.0; // 💥 曲ごとの個別音量（基本は1.0）

        // 💥 マップ0（field）の時だけ、音量をさらに半分(0.5)に抑える！
        if (type === 'field') { 
            src = "bgm/field.mp3"; 
            trackVol = 0.01; 
        }
        else if (type === 'battle') src = "bgm/battle.mp3";
        else if (type === 'boss') src = "bgm/boss.mp3";
        else if (type === 'maou') src = "bgm/maou.mp3";
        else if (type === 'town1') src = "bgm/town1.mp3";
        else if (type === 'town2') src = "bgm/town2.mp3";
        else if (type === 'town3') src = "bgm/town3.mp3";
        else if (type === 'town4') src = "bgm/town4.mp3";
        else if (type === 'town5') src = "bgm/town5.mp3";
        else if (type === 'danjon') src = "bgm/danjon.mp3";
        else if (type === 'end') src = "bgm/end.mp3";

        if (src !== "") {
            this.bgmPlayer.src = src;
            this.bgmPlayer.loop = true;
            
            // 💥 全体音量(0.2) × 曲ごとの個別音量(fieldなら0.5) を掛け合わせる！
            this.bgmPlayer.volume = this.bgmMuted ? 0 : (this.bgmVolume * trackVol); 

            let playPromise = this.bgmPlayer.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    const resumeBGM = () => {
                        if (this.currentBgm === type) this.bgmPlayer.play().catch(()=>{});
                        window.removeEventListener('click', resumeBGM);
                        window.removeEventListener('touchstart', resumeBGM);
                    };
                    window.addEventListener('click', resumeBGM);
                    window.addEventListener('touchstart', resumeBGM);
                });
            }
        }
    },

    stopBGM: function() {
        this.bgmPlayer.pause();
        this.currentBgm = null;
        this._wasPlayingOnHide = false; 
    },

    // BGM/SEの設定変更メソッド
    changeBgmVolume: function(val) {
        this.bgmVolume = parseFloat(val);
        let trackVol = (this.currentBgm === 'field') ? 0.5 : 1.0; // 💥 設定変更時も個別音量を考慮
        if (!this.bgmMuted && this.bgmPlayer) this.bgmPlayer.volume = this.bgmVolume * trackVol;
    },
    toggleBgmMute: function() {
        this.bgmMuted = !this.bgmMuted;
        let trackVol = (this.currentBgm === 'field') ? 0.5 : 1.0; // 💥 ミュート解除時も考慮
        if (this.bgmPlayer) this.bgmPlayer.volume = this.bgmMuted ? 0 : (this.bgmVolume * trackVol);
        return this.bgmMuted;
    },
    changeSeVolume: function(val) {
        this.seVolume = parseFloat(val);
    },
    toggleSeMute: function() {
        this.seMuted = !this.seMuted;
        return this.seMuted;
    },

    playSE: function(fileName, vol=1.0) {
        if (this.seMuted) return; 
        let se = new Audio("se/" + fileName);
        se.volume = vol * this.seVolume; 
        se.play().catch(e => console.log("SE再生エラー(" + fileName + "):", e));
    },

    // あんたのチューニングをそのまま活かした効果音メソッド群！
    hit: function() { this.playSE('hit.mp3', 0.6); },
    ougon: function() { this.playSE('ougon.mp3', 1.0); },
    majin: function() { this.playSE('majin.mp3', 1.0); },
    damage: function() { this.playSE('damage.mp3', 0.6); },
    defeat: function() { this.playSE('defeat.mp3', 0.6); },
    decide: function() { this.playSE('cursor.mp3', 0.8); },
    cursor: function() { this.playSE('cursor.mp3', 0.8); },
    cursor2: function() { this.playSE('cursor2.mp3', 0.8); },
    cursor3: function() { this.playSE('cursor3.mp3', 0.8); },
    itemGet: function() { this.playSE('item.mp3', 1.0); },
    densetsu: function() { this.playSE('densetsu.mp3', 1.0); }, 
    magic: function() { this.playSE('magic.mp3', 1.0); },
    heal: function() { this.playSE('heal.mp3', 1.0); },
    
    enc: function() {
        this.stopBGM();
        this.playSE('enc.mp3', 0.1); // 💥 ビクッとするエンカウント音を極小に！
    },
    
    levelUp: function() {
        this.stopBGM();
        this.playSE('levelup.mp3', 1.0);
        setTimeout(() => { if (typeof playMapBGM === 'function') playMapBGM(); }, 3500); 
    },

    msgTick: function() {
        if (this.seMuted) return; 
        if (!this.ctx || !this.unlocked || this.ctx.state === 'suspended') return;
        try {
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, this.ctx.currentTime);
            let tickVol = 0.15 * this.seVolume;
            gain.gain.setValueAtTime(tickVol, this.ctx.currentTime); 
            gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.03);
            osc.connect(gain); gain.connect(this.ctx.destination);
            osc.start(); 
            osc.stop(this.ctx.currentTime + 0.03);
            
            osc.onended = () => {
                osc.disconnect();
                gain.disconnect();
            };
        } catch(e) {}
    }
};

window.addEventListener('mousedown', () => Sound.init());
window.addEventListener('touchstart', () => Sound.init(), {passive: true});
window.addEventListener('keydown', () => Sound.init());

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (Sound.bgmPlayer && !Sound.bgmPlayer.paused && Sound.currentBgm) {
            Sound._wasPlayingOnHide = true;
            Sound.bgmPlayer.pause();
        } else {
            Sound._wasPlayingOnHide = false;
        }
    } else {
        if (Sound._wasPlayingOnHide && Sound.bgmPlayer && Sound.currentBgm) {
            let playPromise = Sound.bgmPlayer.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => { console.log("復帰時のBGM自動再生がブロックされました:", e); });
            }
        }
    }
});
