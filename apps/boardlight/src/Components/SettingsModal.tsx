import { Modal, Switch, Text, useTheme } from '@nextui-org/react';
import React from 'react';
import { MdOutlineDarkMode, MdOutlineLightMode, MdCheck, MdClose } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { Row, Col } from 'reactstrap';
import styled from 'styled-components';
import useSettingsModalState from '../Hooks/useSettingsModalState';
import useThemePrefs from '../Hooks/useThemePrefs';

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

    return (
        <Modal
            closeButton={true}
            blur={true}
            aria-labelledby="modal-title"
            open={isOpen}
            onClose={() => dispatch({ type: 'settingsModal/closeSettingsModal' })}
            preventClose={true}
            width="650px">
            <Modal.Header style={{ border: 'none' }}>
                <Text id="modal-title" size={18}>
                    Beállítások
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Subheading color={theme.palette.accents_4}>téma</Subheading>
                <Row>
                    <Col>
                        <Row>
                            <Col sm="4">
                                <Text className="mt-1">Sötét mód</Text>
                            </Col>
                            <Col>
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
                    <Col>
                        <Row>
                            <Col sm="8">
                                <Text className="mt-1">Rendszertéma követése</Text>
                            </Col>
                            <Col>
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
            </Modal.Body>
            <Modal.Footer style={{ overflow: 'visible', border: 'none' }} />
        </Modal>
    );
};

export default SettingsModal;
