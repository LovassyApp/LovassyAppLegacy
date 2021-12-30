import * as React from 'react';
import { CardBody, CardTitle, Alert } from 'reactstrap';
import style from '../CSS/login.module.css';
import logo from '../Assets/white-logo.png';
import Carousel from '../Components/Carousel';
import { fadeInDown, slideInRight } from 'react-animations';
import Radium, { StyleRoot } from 'radium';

export default ({ children }) => {
	const localStyles = {
		entry: {
			animation: 'x 1s',
			animationName: Radium.keyframes(fadeInDown, 'entry'),
		},
		carouselEntry: {
			animation: 'x 1s',
			animationName: Radium.keyframes(slideInRight, 'entry'),
		},
	};
	return (
		<StyleRoot>
			<div className="loading-background">
				<div className={style.inputPage}>
					<div className={style.center}>
						<div className={style.inputCard} style={localStyles.entry}>
							<CardBody>
								<CardTitle>
									<center>
										<img src={logo} className={style.logo} alt="LovassyApp logo" />
									</center>
								</CardTitle>
								<br />

								<center>{children}</center>
							</CardBody>
						</div>
					</div>
				</div>
				<div className={style.asidePage} style={localStyles.carouselEntry}>
					<Carousel />
				</div>
			</div>
		</StyleRoot>
	);
};
