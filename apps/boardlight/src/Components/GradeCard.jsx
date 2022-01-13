/* 
    Jegy-kártya-izé
*/

import React from 'react';
import style from '../CSS/gradecard.module.css';
import styled from 'styled-components';
import { useTheme } from '@nextui-org/react';

const makeVar = (color) => {
	return '--' + color;
};
const makeShadow = (color) => {
	return '--' + color + '-shadow';
};

const makeTextColor = (color) => {
	return '--' + color + '-text-default';
};

// AU
// CSS és a kör története
const GradeCircle = styled.div`
	position: relative;
	left: -5%;
	height: 50px;
	width: 50px;
	border-radius: 50px;
	text-align: center;
	background-color: var(${(props) => makeVar(props.color)});
	box-shadow: 0 0 10px 3px var(${(props) => makeShadow(props.color)});
	& p {
		position: relative;
		top: 50%;
		-ms-transform: translateY(-50%);
		transform: translateY(-50%);
		color: var(${(props) => makeTextColor(props.color)});
		font-size: 150%;
	}
`;

const GradeCard = () => {
	const theme = useTheme();

	const shadow_light = '0 8px 30px rgba(0, 0, 0, 0.15)';
	const shadow_dark = '0 15px 22px -10px rgba(0, 0, 0, 0.1)';

	const Container = styled.div`
		background-color: ${theme.type == 'dark' ? theme.palette.accents_1 : theme.palette.background};
		box-shadow: ${theme.type == 'dark' ? shadow_dark : shadow_light};
	`;

	return (
		<Container className={style.card}>
			<div className="row">
				<div className="col-2">
					<GradeCircle color="orange">
						<p>5</p>
					</GradeCircle>
				</div>
				<div className="col">
					<p className={style.cardSubjectN}>
						<b>fizika</b>
					</p>
				</div>
				<div className="col">
					<p className={style.cardSubjectN}>EVEM dolgozat</p>
				</div>
			</div>
		</Container>
	);
};

export default GradeCard;
