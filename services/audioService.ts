export class AudioHandler {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private dataArray: Uint8Array | null = null;
  private stream: MediaStream | null = null;
  
  private spinTimeout: NodeJS.Timeout | null = null;
  private chimeInterval: NodeJS.Timeout | null = null;

  private ensureContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  async initMicrophone(): Promise<boolean> {
    try {
      this.ensureContext();
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.analyser = this.audioContext!.createAnalyser();
      this.microphone = this.audioContext!.createMediaStreamSource(this.stream);
      this.microphone.connect(this.analyser);
      this.analyser.fftSize = 256;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      return true;
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      return false;
    }
  }

  playPop() {
    this.ensureContext();
    if (!this.audioContext) return;
    const t = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    // Crisp balloon pop
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);
    
    gain.gain.setValueAtTime(1, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    osc.start(t);
    osc.stop(t + 0.1);
  }

  private playTick() {
    this.ensureContext();
    if (!this.audioContext) return;
    const t = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    // Mechanical click sound
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.05);
    
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    osc.start(t);
    osc.stop(t + 0.05);
  }

  startWheelSpin(durationMs: number = 3500) {
    this.ensureContext();
    let elapsed = 0;
    let delay = 30; // Start fast
    const t0 = Date.now();
    
    const click = () => {
        this.playTick();
        elapsed = Date.now() - t0;
        
        // Slow down quadratically as it approaches durationMs
        const progress = elapsed / durationMs; 
        delay = 30 + (progress * progress * 400);
        
        if (elapsed < durationMs) {
            this.spinTimeout = setTimeout(click, delay);
        }
    };
    
    if (this.spinTimeout) clearTimeout(this.spinTimeout);
    click();
  }
  
  stopWheelSpin() {
    if (this.spinTimeout) clearTimeout(this.spinTimeout);
  }

  startMagicChime() {
    this.ensureContext();
    if (this.chimeInterval) clearInterval(this.chimeInterval);
    
    this.chimeInterval = setInterval(() => {
        if (!this.audioContext) return;
        if (Math.random() > 0.4) return; // Prevent overlapping bloat
        
        const t = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        // Random high pitched magical sparkle
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1500 + Math.random() * 2000, t);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.start(t);
        osc.stop(t + 0.15);
    }, 50); // Checks every 50ms whether to spawn a sparkle
  }

  stopMagicChime() {
      if (this.chimeInterval) clearInterval(this.chimeInterval);
  }

  isBlowing(threshold: number = 40): boolean {
    if (!this.analyser || !this.dataArray) return false;
    this.analyser.getByteFrequencyData(this.dataArray as any);
    
    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }
    const average = sum / this.dataArray.length;
    return average > threshold;
  }

  stop() {
    this.stopWheelSpin();
    this.stopMagicChime();
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
  }
}