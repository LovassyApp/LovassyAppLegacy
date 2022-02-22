/*
	Hölgyeim és uraim:
	Most véresen őszintén:
		'EZ KURVA GUSZTUSTALAN'
			- minigyima
*/

import defImg from "../Assets/default.jpg";

// Image URL-ről képet importál Blobként
const importImage = async (imageUrl: string): Promise<BoardlightFile> => {
    const res = await fetch(imageUrl);
    // Custom header, képeknél a DB-ben tárolt fájl neve
    const name = res.headers.get("x-llgapp-filename") as string;
    const blob = await res.blob();

    return makeFile(blob, name);
};

export type BoardlightFile = File & {
    path: string;
    preview: string;
};

// Normál JS-es file objektum, preview-val
const makeFile = (blob: Blob, filename: string): BoardlightFile => {
    const file = new File([blob], filename, blob) as BoardlightFile;
    file.path = file.name;
    file.preview = URL.createObjectURL(file);
    return file;
};

// Webpack-ból importált alap kimentéses kép
const getDefImg = (): BoardlightFile => {
    const BASE64_MARKER = ";base64,";
    const parts = defImg.split(BASE64_MARKER);
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    const blob = new Blob([uInt8Array], {type: contentType});
    return makeFile(blob, "defImg.jpg");
};

// Base64-el egy képet a feltöltéshez
const getImageBase64 = (file: BoardlightFile): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export {getDefImg, getImageBase64, importImage};
