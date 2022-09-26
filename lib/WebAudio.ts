class WebAudioAnalyser {
    public analyser!: AnalyserNode;
    
    public stereo?: boolean;
    
    public audible?: boolean;
    
    public wavedata?: Uint8Array | null;
    
    public freqdata?: null;
    
    public splitter?: ChannelSplitterNode | null;
    
    public merger?: ChannelMergerNode | null;
    
    public source?: MediaElementAudioSourceNode | MediaStreamAudioSourceNode | (WebAudioAnalyser & AudioNode);
    
    public output?: ChannelMergerNode;

    public constructor(
        audio: MediaElementAudioSourceNode | MediaStreamAudioSourceNode | MediaStream | WebAudioAnalyser,
        ctx: AudioContext,
        opts = {},
    ) {
        if (!ctx) {
            ctx = new AudioContext();
        }
        if (!(audio instanceof WebAudioAnalyser)) {
            return new WebAudioAnalyser(audio, ctx, opts);
        }
        if (!(ctx instanceof AudioContext)) {
            throw new Error("AudioContext param must be an instance of AudioContext");
        }
        if (!(audio instanceof AudioNode)) {
            audio = (audio instanceof Audio || audio instanceof HTMLAudioElement)
                ? ctx.createMediaElementSource(audio)
                : ctx.createMediaStreamSource(audio as unknown as MediaStream);
        }
        this.analyser = ctx.createAnalyser();
        this.stereo = !!opts.stereo;
        this.audible = !!opts.audible;
        this.wavedata = null;
        this.freqdata = null;
        this.splitter = null;
        this.merger   = null;
        this.source   = audio;

        if (!this.stereo) {
            this.output = this.source;
            this.source.connect(this.analyser);
            if (this.audible) {
                this.analyser.connect(ctx.destination);
            }
        } else {
            this.analyser = [this.analyser];
            this.analyser.push(ctx.createAnalyser());
      
            this.splitter = ctx.createChannelSplitter(2);
            this.merger   = ctx.createChannelMerger(2);
            this.output   = this.merger;
      
            this.source.connect(this.splitter);
      
            for (let i = 0; i < 2; i += 1) {
                this.splitter.connect(this.analyser[i], i, 0);
                this.analyser[i].connect(this.merger, 0, i);
            }
      
            if (this.audible) {
                this.merger.connect(ctx.destination);
            }
        }
    }
    
    public waveform(output: Uint8Array, channel: number): Uint8Array {
        if (!output) output = this.wavedata || (
            this.wavedata = new Uint8Array((this.analyser).frequencyBinCount)
        );
        const analyser = this.analyser;

        (analyser as AnalyserNode).getByteTimeDomainData(output);      
        return output;
    }

    public frequencies(output: Uint8Array, channel: number): Uint8Array {
        if (!output) output = this.wavedata || (
            this.wavedata = new Uint8Array((this.analyser).frequencyBinCount)
        );
        const analyser = this.analyser;

        (analyser as AnalyserNode).getByteFrequencyData(output);      
        return output;
    }
}

