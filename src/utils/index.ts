import { ImageBlob } from "../types"


export const id = (uri: string) => {

    // const regex = /\/(\w+)$/
    // const match = regex.exec(uri);

    // if (match) {
    //     return match[1]
    // }

    const parts = uri.split('/');
    return parts[parts.length - 1];


}

export const did = (uri: string) => {

    if (uri) {
        const regex = /did:plc:\w+/;
        const match = uri.match(regex);

        if (match) {
            return match[0];
        } else {
            return ''; // Return null if no match is found
        }
    }
    return ''

}





export const createImageLink = (
    props: { image?: ImageBlob | string; did?: string } | { image: string }
) => {

    if (typeof props.image === 'object' && 'did' in props && 'ref' in props.image) {
        return `https://cdn.bsky.app/img/feed_thumbnail/plain/${props.did}/${props.image.ref?.$link}@jpeg`;
    }

    else if (typeof props.image === 'string') {
        return props.image
    }
}

