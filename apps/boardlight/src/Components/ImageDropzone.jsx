import { useDropzone } from 'react-dropzone';
import * as React from 'react';
import { Grid } from '@nextui-org/react';

const thumbsContainer = {
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	marginTop: 16,
};

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
};

const thumbInner = {
	display: 'flex',
	minWidth: 0,
	overflow: 'hidden',
};

const img = {
	display: 'block',
	width: 'auto',
	height: '100%',
};

const ImageDropzone = ({ files, setFiles }) => {
	const { getRootProps, getInputProps } = useDropzone({
		accept: 'image/png, image/jpeg',
		onDrop: (acceptedFiles) => {
			if (acceptedFiles.length != 0) {
				setFiles(
					acceptedFiles.map((file) =>
						Object.assign(file, {
							preview: URL.createObjectURL(file),
						})
					)
				);
			}
		},
	});

	const thumbs = files.map((file) => (
		<div style={thumb} key={file.name}>
			<div style={thumbInner}>
				<img src={file.preview} style={img} />
			</div>
		</div>
	));

	React.useEffect(
		() => () => {
			// Make sure to revoke the data uris to avoid memory leaks
			files.forEach((file) => URL.revokeObjectURL(file.preview));
		},
		[files]
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
