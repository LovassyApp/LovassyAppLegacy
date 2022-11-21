import { Link, Modal, Text, useTheme } from '@nextui-org/react';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import usePrivacyPolicyModalState from '../Hooks/usePrivacyPolicyModalState';

const Subheading = styled.h4`
    display: flex;
    align-items: flex-start;
    text-align: left;
    font-variant: small-caps;
    letter-spacing: 0.15em;
    color: ${(props) => props.color};

    &:after {
        content: '';
        flex-grow: 1;
        height: 1px;
        background: ${(props) => props.color};
        min-width: 20px;
        margin: auto;
    }

    &:after {
        margin-left: 20px;
    }
`;

const PrivacyPolicyModal = (): JSX.Element => {
    const isOpen = usePrivacyPolicyModalState();
    const dispatch = useDispatch();

    const theme = useTheme();

    return (
        <Modal
            closeButton={true}
            blur={true}
            aria-labelledby="modal-title"
            open={isOpen}
            onClose={() => dispatch({ type: 'privacyPolicyModal/closePrivacyPolicyModal' })}
            preventClose={true}
            width="650px">
            <Modal.Header style={{ border: 'none' }}>
                <Text id="modal-title" size={18}>
                    Adatvédelem
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Subheading color={theme.palette.accents_4}>adatvédelmi tájékoztató</Subheading>
                <p>
                    A LovassyApp egy alkalmazás, mely az érdemjegyeid segítségével jutalmazza a
                    tanulmányi munkádat. Az érdemjegyeid csak közvetlenül egy iskolai számítógép és
                    a mi szerverünk között közlekednek, ahol titkosított formában, csak az általad
                    kezelt titkosító kulcs segítségével olvashatóak. Az adatok minden esetben
                    titkosítva maradnak, egészen addig, amíg a saját eszközöd meg nem jeleníti őket.
                </p>
                <p>
                    A LovassyApp fejlesztői és üzemeltetői ezekhez az adatokhoz semmilyen módon nem
                    férnek hozzá. Az adatok az e-Kréta rendszer egy, az iskolavezetésnek szánt
                    kimutatásából származnak, melyhez közvetlen hozzáférése a rendszer
                    fejlesztőinek, karbantartóinak és üzemeltetőinek nincs. Ezáltal az érdemjegyek
                    megtekintésére valamint módosítására a rendszer rendszer fejlesztőinek,
                    karbantartóinak és üzemeltetőinek nincs lehetősége, valamint ezeket harmadik fél
                    számára nem továbbítjuk.
                </p>
                <p>
                    Ha az adataiddal kapcsolatban bármilyen kérdésed van (mint például azok
                    törlése), keress minket a{' '}
                    <Link color="primary" href="mailto:lovassyapp@gmail.com">
                        lovassyapp@gmail.com
                    </Link>{' '}
                    címen.
                </p>
                <p>A LovassyApp használatával jelzed, hogy ezt a tájékoztatót tudomásul vetted.</p>
                <Subheading color={theme.palette.accents_4}>cookie tájékoztató</Subheading>
                <p>
                    Mint a legtöbb alkalmazás, a LovassyApp webes változata (Boardlight) is használ
                    sütiket. Ezek csak és kizárólag az alkalmazás használatát segítik (például a
                    jelszó megjegyzése), semmi féle adatgyűjtési célzatuk nincs.
                </p>
                <p>Az alkalmazás használatával beleegyezel ezen sütik használatába.</p>
            </Modal.Body>
            <Modal.Footer style={{ overflow: 'visible', border: 'none' }} />
        </Modal>
    );
};

export default PrivacyPolicyModal;
