/*
    Jegy-kártya-izé
*/

import React from 'react';
import style from '../CSS/gradecard.module.css';
import styled from 'styled-components';
import { useTheme } from '@nextui-org/react';
import { BlueboardKretaGrade } from 'blueboard-client';

type Color =
    | 'red'
    | 'orange'
    | 'yellow'
    | 'strong-yellow'
    | 'green-yellow'
    | 'green'
    | 'lightblue'
    | 'blue'
    | 'purple'
    | 'pink'
    | 'gray';

const makeVar = (color: Color): string => {
    return `--${color}`;
};
const makeShadow = (color: Color): string => {
    return `--${color}-shadow`;
};

const makeTextColor = (color: Color): string => {
    return `--${color}-text-default`;
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
    background-color: var(${(props) => makeVar(props.color as Color)});
    box-shadow: 0 0 10px 3px var(${(props) => makeShadow(props.color as Color)});
    & p {
        position: relative;
        top: 50%;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
        color: var(${(props) => makeTextColor(props.color as Color)});
        font-size: 150%;
    }
`;

const renderGradeType = (gradeType: string): string => {
    switch (gradeType) {
        case 'Írásbeli témazáró dolgozat (dupla súllyal)':
            return 'Témazáró';
        case 'Írásbeli röpdolgozat':
            return 'Röpdolgozat';
        default:
            gradeType;
    }

    return gradeType;
};

const getColor = (grade: number): string => {
    // eslint-disable-next-line
    switch (grade) {
        case 5:
            return 'green';
        case 4:
            return 'green-yellow';
        case 3:
            return 'strong-yellow';
        case 2:
            return 'orange';
        case 1:
            return 'red';
        default:
            return 'blue';
    }
};

const convert = (num: number): string => {
    if (num === 0) {
        return '–';
    }
    return String(num);
};

const GradeCard = ({
    grade,
    enlarge,
}: {
    grade: BlueboardKretaGrade;
    enlarge: boolean;
}): JSX.Element => {
    const theme = useTheme();

    const shadow_light = '0 8px 30px rgba(0, 0, 0, 0.15)';
    const shadow_dark = '0 15px 22px -10px rgba(0, 0, 0, 0.1)';

    const Container = styled.div`
        background-color: ${theme.type === 'dark'
            ? theme.palette.accents_1
            : theme.palette.background};
        box-shadow: ${theme.type === 'dark' ? shadow_dark : shadow_light};
    `;

    return (
        <Container className={style.card}>
            <div className="row">
                <div className="col-2">
                    <GradeCircle color={getColor(grade.grade)}>
                        <p>{convert(grade.grade)}</p>
                    </GradeCircle>
                </div>
                <div className="col">
                    <p className={style.cardSubjectN}>
                        <b>{grade.name}</b>
                        <br />
                        <small>{enlarge ? renderGradeType(grade.type) : grade.type}</small>
                    </p>
                </div>
                <div className="col-4">
                    <p className={style.cardSubjectN}>{grade.teacher}</p>
                </div>
            </div>
        </Container>
    );
};

export default GradeCard;
