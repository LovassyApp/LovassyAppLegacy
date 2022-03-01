import { useDropzone } from 'react-dropzone';
import * as React from 'react';
import { Grid } from '@nextui-org/react';
import { BoardlightFile } from '../Helpers/ImageUtils';

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
} as React.CSSProperties;

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 120,
    height: 120,
    padding: 4,
    boxSizing: 'border-box',
} as React.CSSProperties;

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
} as React.CSSProperties;

const img = {
    display: 'block',
    width: 'auto',
    height: '100%',
} as React.CSSProperties;

const ImageDropzone = ({
    files,
    setFiles,
}: {
    files: BoardlightFile[];
    setFiles: any;
}): JSX.Element => {
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/png, image/jpeg',
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length !== 0) {
                setFiles(
                    acceptedFiles.map((file) =>
                        Object.assign(file, {
                            preview: URL.createObjectURL(file),
                        }),
                    ),
                );
            }
        },
    });

    const thumbs = files.map((file: BoardlightFile) => (
        <div style={thumb} key={file.name}>
            <div style={thumbInner}>
                <img src={file.preview} alt="" style={img} />
            </div>
        </div>
    ));

    React.useEffect(
        () => () => {
            // Make sure to revoke the data uris to avoid memory leaks
            files.forEach((file) => URL.revokeObjectURL(file.preview));
        },
        [files],
    );

    return (
        <section className="container">
            <Grid.Container gap={2} justify="center">
                <Grid md={10}>
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <p>
                            <b>Helyezd</b> ide képed
                        </p>
                    </div>
                </Grid>
                <Grid md={2}>
                    <aside style={thumbsContainer}>{thumbs}</aside>
                </Grid>
            </Grid.Container>
        </section>
    );
};

export default ImageDropzone;
