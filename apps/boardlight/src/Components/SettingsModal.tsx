import { Modal, Switch, Text, useTheme } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { MdOutlineDarkMode, MdOutlineLightMode, MdCheck, MdClose } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { Row, Col } from 'reactstrap';
import styled from 'styled-components';
import { VERSION } from '..';
import { BlueboardAboutResponse, SDK_VERSION } from 'blueboard-client';
import useSettingsModalState from '../Hooks/useSettingsModalState';
import useThemePrefs from '../Hooks/useThemePrefs';
import { useBlueboardClient } from 'blueboard-client-react';
import Center from './Center';
import TableLoader from './TableLoader';

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

const SettingsModal = (): JSX.Element => {
    const isOpen = useSettingsModalState();
    const themeState = useThemePrefs();
    const dispatch = useDispatch();
    const theme = useTheme();
    const client = useBlueboardClient();
    const [loading, setLoading] = useState<boolean>(true);
    const [serverProps, setServerProps] = useState<BlueboardAboutResponse | null>(null);

    useEffect(() => {
        if (isOpen) {
            (async (): Promise<void> => {
                try {
                    const res = await client.account.about();
                    setLoading(false);
                    setServerProps(res);
                } catch (err) {
                    console.log(err);
                }
            })();
        } else {
            setTimeout(() => {
                setLoading(true);
                setServerProps(null);
            }, 300);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (
        <Modal
            closeButton={true}
            blur={true}
            aria-labelledby="modal-title"
            open={isOpen}
            onClose={() => {
                dispatch({ type: 'settingsModal/closeSettingsModal' });
            }}
            preventClose={true}
            width="650px"
            style={{ overflowY: 'hidden' }}>
            <Modal.Header style={{ border: 'none' }}>
                <Text id="modal-title" size={18}>
                    Beállítások
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Subheading color={theme.palette.accents_4}>téma</Subheading>
                <Row>
                    <Col md="6" className="mb-2">
                        <Row>
                            <Col xs="4">
                                <Text className="mt-1">Sötét mód</Text>
                            </Col>
                            <Col xs="8">
                                <Switch
                                    className="float-end"
                                    iconOff={<MdOutlineLightMode />}
                                    iconOn={<MdOutlineDarkMode />}
                                    size="large"
                                    color="gradient"
                                    checked={themeState.isDark}
                                    onChange={() => dispatch({ type: 'theme/toggle' })}
                                    disabled={!!themeState.isSynced}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col md="6">
                        <Row>
                            <Col xs="8">
                                <Text className="mt-1">Rendszertéma követése</Text>
                            </Col>
                            <Col xs="4">
                                <Switch
                                    className="float-end"
                                    iconOff={<MdClose />}
                                    iconOn={<MdCheck />}
                                    size="large"
                                    color="gradient"
                                    checked={themeState.isSynced}
                                    onChange={(e) =>
                                        dispatch({
                                            type: 'theme/setSynced',
                                            payload: e.target.checked,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Subheading color={theme.palette.accents_4}>az app névjegye</Subheading>
                <Row>
                    <Col sm={4}>Frontend</Col>
                    <Col>Boardlight v{VERSION}</Col>
                </Row>
                <Row>
                    <Col sm={4}>SDK</Col>
                    <Col>blueboard-client v{SDK_VERSION}</Col>
                </Row>
                <Row>
                    <Col sm={4}>Fejlesztők</Col>
                    <Col>Gyimesi Máté (minigyima), Ocskó Nándor (Xeretis)</Col>
                </Row>
                <Subheading color={theme.palette.accents_4}>a szerver névjegye</Subheading>
                {loading ? (
                    <Center>
                        <TableLoader />
                    </Center>
                ) : (
                    <>
                        <Row>
                            <Col sm={4}>Szerver</Col>
                            <Col>
                                {serverProps?.whoami} v{serverProps?.blueboard_version}
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={4}>SDK</Col>
                            <Col>
                                Laravel v{serverProps?.laravel_version}, PHP{' '}
                                {serverProps?.php_version}
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={4}>Fejlesztők</Col>
                            <Col>{serverProps?.contributors.join(', ')}</Col>
                        </Row>
                        <Row>
                            <Col sm={4}>Napi idézet</Col>
                            <Col>{serverProps?.motd}</Col>
                        </Row>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer style={{ overflow: 'visible', border: 'none' }} />
        </Modal>
    );
};

export default SettingsModal;
