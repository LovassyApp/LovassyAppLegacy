import React from 'react';
import style from '../CSS/header.module.css';

const HeaderCard = ({ title, children }) => {
	return (
		<>
			<div className={style.headerImg}>
				<div className={style.headerImgFilter}>
					<h1>{title}</h1>
				</div>
			</div>
			<br />
			{children}
		</>
	);
};

export default HeaderCard;
