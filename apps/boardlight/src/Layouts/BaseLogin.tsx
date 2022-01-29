import * as React from 'react';
import { CardBody, CardTitle } from 'reactstrap';
import style from '../CSS/login.module.css';
import logo from '../Assets/white-logo.png';
import Carousel from '../Components/Carousel';
import { fadeInDown, slideInRight } from 'react-animations';
import Radium from 'radium';
import Center from '../Components/Center';

const BaseLogin = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const localStyles = {
        entry: {
            animation: 'x 1s',
            animationName: Radium.keyframes(fadeInDown, 'entry'),
        } as React.CSSProperties,
        carouselEntry: {
            animation: 'x 1s',
            animationName: Radium.keyframes(slideInRight, 'entry'),
        } as React.CSSProperties,
    };
    return (
        <Radium.StyleRoot>
            <div className="loading-background">
                <div className={style.inputPage}>
                    <div className={style.center}>
                        <div className={style.inputCard} style={localStyles.entry}>
                            <CardBody>
                                <CardTitle>
                                    <Center>
                                        <img src={logo} className={style.logo} alt="LovassyApp logo" />
                                    </Center>
                                </CardTitle>
                                <br />
                                <Center>{children}</Center>
                            </CardBody>
                        </div>
                    </div>
                </div>
                <div className={style.asidePage} style={localStyles.carouselEntry}>
                    <Carousel />
                </div>
            </div>
        </Radium.StyleRoot>
    );
};

export default BaseLogin;
