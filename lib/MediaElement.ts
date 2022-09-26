import isDom from "is-dom";
import lookup from "browser-media-mime-type";
import type { MediaElementOptParam } from "../types/types";

function simpleMediaElement(elementName: string, sources: string | Array<string>, opt: MediaElementOptParam = {}) {
    if (!Array.isArray(sources)) {
        sources = [ sources ];
    }

    const media = opt.element || document.createElement(elementName);

    if (opt.loop) {
        media.setAttribute("loop", "loop");
    }
    if (opt.muted) {
        media.setAttribute("muted", "muted");
    }
    if (opt.autoplay) {
        media.setAttribute("autoplay", "autoplay");
    }
    if (opt.controls) {
        media.setAttribute("controls", "controls");
    }
    if (opt.crossOrigin) {
        media.setAttribute("crossorigin", opt.crossOrigin);
    }
    if (opt.preload) {
        media.setAttribute("preload", opt.preload);
    }
    if (opt.poster) {
        media.setAttribute("poster", opt.poster);
    }
    if (opt.volume) {
        media.setAttribute("volume", opt.volume);
    }

    sources = sources.filter(Boolean);
    sources.forEach((source) => {
        return media.appendChild(createSourceElement(source as unknown as {
            src: string;
            type: string;
        }));
    });

    return media;
}

function createSourceElement(data: { src: string; type: string }): HTMLSourceElement {
    if (isDom(data)) {
        return data as never;
    }
    if (typeof data === "string") {
        data = { src: data } as unknown as {
            src: string;
            type: string;
        };
        if (data.src) {
            const ext = extension(data.src);
            if (ext) data.type = lookup(ext);
        }
    }

    const source = document.createElement("source");
    if (data.src) {
        source.setAttribute("src", data.src);
    }
    if (data.type) {
        source.setAttribute("type", data.type);
    }
    return source;
}

function extension(data: string): string | null {
    const extIdx = data.lastIndexOf(".");
    if (extIdx <= 0 || extIdx === data.length - 1) {
        return null;
    }
    return data.substring(extIdx + 1);
}

const audio = simpleMediaElement.bind(null, "audio");
const video = simpleMediaElement.bind(null, "video");

export default { audio, video };

