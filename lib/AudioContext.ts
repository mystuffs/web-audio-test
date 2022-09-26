const createAudioContext = (): AudioContext => {
    const context = new window.AudioContext();
    return context;
};

export default createAudioContext;
