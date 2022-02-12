import * as React from 'react';
import { Row, Col, Input, Switch, Text } from '@nextui-org/react';
import { BlueboardProductInput } from 'blueboard-client';

const InputRenderer = ({
    inputs,
    callback,
    inputState,
}: {
    inputs: BlueboardProductInput[];
    callback?: (input: string, value: string | boolean) => void;
    inputState?: { [key: string]: string };
    errors?: { [key: string]: string };
}) => {
    const onChange = (input: string, value: string | boolean) => {
        if (callback !== undefined) {
            callback(input, value);
        }
    };

    const state = inputState ?? {};

    return (
        <div>
            <div className="dropdown-divider" />
            {inputs.map((value, key) => (
                <Row key={key}>
                    <Col>
                        {value.type === 'textbox' ? (
                            <div>
                                <Input
                                    fullWidth
                                    bordered
                                    onChange={(e) => onChange(value.name, e.target.value)}
                                    underlined
                                    shadow={false}
                                    className="mb-2 mt-1"
                                    labelLeft={value.title}
                                    value={state[value.name]}
                                />
                            </div>
                        ) : (
                            <div className="mx-3">
                                <Text
                                    span
                                    style={{
                                        display: 'inline-block',
                                        fontSize: '14px',
                                        verticalAlign: 'middle',
                                        color: 'rgb(153, 153, 153)',
                                    }}
                                >
                                    {value.title}
                                </Text>
                                <Switch
                                    onChange={(e) => onChange(value.name, e.target.checked)}
                                    style={{ display: 'inline-block', verticalAlign: 'middle' }}
                                    className="mx-2"
                                />
                            </div>
                        )}
                    </Col>
                </Row>
            ))}
        </div>
    );
};

export default InputRenderer;
