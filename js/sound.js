// ==========================================
// 🎵 sound.js (バックグラウンド再生防止・安定版)
// ==========================================

window.Sound = {
    bgmPlayer: new Audio(),
    currentBgm: null,
    ctx: null, 
    unlocked: false,

    // 音量とミュート設定のプロパティ
    bgmVolume: 0.4,
    seVolume: 1.0,
    bgmMuted: false,
    seMuted: false,
    
    // 💥【NEW】裏画面にいった時にBGMが鳴っていたかを記憶するフラグ
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
        if (type === 'field') src = "bgm/field.mp3";
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
            
            // ミュートなら0、それ以外は設定音量にする
            this.bgmPlayer.volume = this.bgmMuted ? 0 : this.bgmVolume; 

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
        this._wasPlayingOnHide = false; // 止めた時はフラグもリセット
    },

    // BGM/SEの設定変更メソッド
    changeBgmVolume: function(val) {
        this.bgmVolume = parseFloat(val);
        if (!this.bgmMuted && this.bgmPlayer) this.bgmPlayer.volume = this.bgmVolume;
    },
    toggleBgmMute: function() {
        this.bgmMuted = !this.bgmMuted;
        if (this.bgmPlayer) this.bgmPlayer.volume = this.bgmMuted ? 0 : this.bgmVolume;
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
        if (this.seMuted) return; // ミュート時は再生しない
        let se = new Audio("se/" + fileName);
        se.volume = vol * this.seVolume; // マスター音量を掛け合わせる
        se.play().catch(e => console.log("SE再生エラー(" + fileName + "):", e));
    },

    // 効果音メソッド群（全部1.0でフラットに鳴らす安定版）
    hit: function() { this.playSE('hit.mp3', 1.0); },
    ougon: function() { this.playSE('ougon.mp3', 1.0); },
    majin: function() { this.playSE('majin.mp3', 1.0); },
    damage: function() { this.playSE('damage.mp3', 1.0); },
    defeat: function() { this.playSE('defeat.mp3', 1.0); },
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
        this.playSE('enc.mp3', 1.0);
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

// ユーザーのアクションでオーディオを初期化
window.addEventListener('mousedown', () => Sound.init());
window.addEventListener('touchstart', () => Sound.init(), {passive: true});
window.addEventListener('keydown', () => Sound.init());

// 💥【NEW】タブの切り替えや最小化を検知してBGMを一時停止・再開する処理
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 画面が隠れた時：もしBGMが鳴っていれば一時停止し、鳴っていたことを記憶する
        if (Sound.bgmPlayer && !Sound.bgmPlayer.paused && Sound.currentBgm) {
            Sound._wasPlayingOnHide = true;
            Sound.bgmPlayer.pause();
        } else {
            Sound._wasPlayingOnHide = false;
        }
    } else {
        // 画面が戻ってきた時：隠れる前に鳴っていたなら、再生を再開する
        if (Sound._wasPlayingOnHide && Sound.bgmPlayer && Sound.currentBgm) {
            let playPromise = Sound.bgmPlayer.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => { console.log("復帰時のBGM自動再生がブロックされました:", e); });
            }
        }
    }
});
