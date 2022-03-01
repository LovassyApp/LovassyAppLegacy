import * as React from 'react';
import style from '../CSS/error.module.css';
import { useTheme } from '@nextui-org/react';
import Radium from 'radium';
import styled from 'styled-components';
import Center from '../Components/Center';

const Five0Three = (): JSX.Element => {
    const theme = useTheme();
    const bg = theme.type === 'dark' ? theme.palette.background : theme.palette.accents_1;
    // Au. Styled. Au.
    const Curve = styled.div`
        position: absolute;
        height: 125px;
        width: 100%;
        bottom: 0;
        text-align: center;
        &:before {
            content: '';
            display: block;
            position: absolute;
            border-radius: 100% 50%;
            width: 55%;
            height: 100%;
            transform: translate(85%, 60%);
            background: ${bg};
        }
        &:after {
            content: '';
            display: block;
            position: absolute;
            border-radius: 100% 50%;
            top: 0px;
            left: 0px;
            width: 55%;
            height: 100%;
            background: linear-gradient(
                111.19deg,
                rgb(170, 255, 236) -63.59%,
                rgb(255, 78, 205) -20.3%,
                rgb(0, 112, 243) 120.46%
            );
            transform: translate(-4%, 40%);
        }
    `;

    // Radium is van :)
    const radStyles = {
        container: {
            background: bg,
        } as React.CSSProperties,
    };

    return (
        <Radium.StyleRoot>
            <div className={style.bg} style={radStyles.container}>
                <section className={style.curveSection}>
                    <Curve />
                </section>
                <div className={style.heroText}>
                    <h1>503</h1>
                    <Center>
                        <h2 style={{ color: theme.palette.text }}>Hoppá!</h2>
                        <h4 style={{ color: theme.palette.text }}>
                            Úgy tűnik, az applikáció jelenleg nem elérhető. Kérlek próbáld újra
                            később. Amikor újra elérhető lesz, az oldal magától frissül.
                        </h4>
                    </Center>
                </div>
            </div>
        </Radium.StyleRoot>
    );
};
export default Five0Three;
