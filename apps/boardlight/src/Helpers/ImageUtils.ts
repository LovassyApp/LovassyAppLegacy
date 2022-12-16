/* eslint-disable prefer-destructuring */
/*
	Hölgyeim és uraim:
	Most véresen őszintén:
		'EZ KURVA GUSZTUSTALAN'
			- minigyima
*/

import defImg from '../Assets/default.jpg';

console.log(defImg);

// Image URL-ről képet importál Blobként
const importImage = async (imageUrl: string): Promise<BoardlightFile> => {
    const res = await fetch(imageUrl);
    // Custom header, képeknél a DB-ben tárolt fájl neve
    const name = res.headers.get('x-llgapp-filename') as string;
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
const getDefImg = async (): Promise<BoardlightFile> => {
    return await importImage(defImg);
};

// Base64-el egy képet a feltöltéshez
const getImageBase64 = (file: BoardlightFile): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export { getDefImg, getImageBase64, importImage };
