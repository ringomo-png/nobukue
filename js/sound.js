// ==========================================
// 🎵 sound.js (メニューSE・会話音量アップ・エンディング対応版)
// ==========================================

window.Sound = {
    bgmPlayer: new Audio(),
    currentBgm: null,
    ctx: null, 
    unlocked: false,

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
            this.bgmPlayer.volume = 0.4; 

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
    },

    playSE: function(fileName, vol=1.0) {
        let se = new Audio("se/" + fileName);
        se.volume = vol;
        se.play().catch(e => console.log("SE再生エラー(" + fileName + "が見つからないわ！):", e));
    },

    hit: function() { this.playSE('hit.mp3', 1.0); },
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
        if (!this.ctx || !this.unlocked || this.ctx.state === 'suspended') return;
        try {
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.15, this.ctx.currentTime); 
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
