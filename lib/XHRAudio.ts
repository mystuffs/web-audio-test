import xhr, { type XhrInstance } from "xhr";
import xhrProgress from "xhr-progress";

const xhrAudio = (audioContext: BaseAudioContext, src: string, cb: CallableFunction, progress: CallableFunction, decoding: CallableFunction) => {
    const xhrObject: XhrInstance = xhr({
        uri: src,
        responseType: "arraybuffer"
    }, (err, resp, arrayBuf): void => {
        if (err) throw new Error(err as unknown as string);
        if (!resp.statusCode.toString().includes("2")) {
            throw new Error(`Status code: ${resp.statusCode}, requesting: ${src}`);
        }
        decode(arrayBuf);
    });
    
    xhrProgress(xhrObject).on("data", (amount: number, total: number): void => {
        progress(amount, total);
    });

    function decode(arrayBuf: ArrayBuffer): void {
        decoding();
        audioContext.decodeAudioData(arrayBuf, (decoded: CallableFunction | unknown) => {
            cb(null, decoded);
        }, () => {
            cb(new Error("Error decoding audio data"));
        });
    }
};

export default xhrAudio;
