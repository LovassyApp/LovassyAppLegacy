import * as React from "react";
import { Row, Col, Input, Switch, Text } from "@nextui-org/react";
import { BlueboardProductInput } from "blueboard-client";

const InputRenderer = ({
    inputs,
    callback,
    inputState,
    errors,
}: {
    inputs: BlueboardProductInput[];
    callback?(input: string, value: string | boolean): void;
    inputState?: { [key: string]: string | boolean };
    errors?: { [key: string]: string[] };
}): JSX.Element => {
    const onChange = (input: string, value: string | boolean): void => {
        if (callback !== undefined) {
            callback(input, value);
        }
    };

    const renderedInputs = inputs.sort((a, b) => {
        return a.type === "boolean" && b.type !== "boolean" ? 1 : 0;
    });

    const getErrors = (inputName: string): string => {
        const err = errors ?? ({} as { [key: string]: string[] });

        const error = err[`inputs.${inputName}`] ?? [];
        let str = "";
        error.forEach((el: string) => {
            str = `${str + el}\n`;
        });

        return str;
    };

    const state = inputState ?? {};

    return (
        <div>
            <div className="dropdown-divider" />
            {renderedInputs.map((value, key) => (
                // eslint-disable-next-line react/no-array-index-key
                <Row className="mt-3" key={key}>
                    <Col>
                        {value.type === "textbox" ? (
                            <div>
                                <Input
                                    fullWidth={true}
                                    bordered={true}
                                    onChange={(e) => onChange(value.name, e.target.value)}
                                    underlined={true}
                                    shadow={false}
                                    labelLeft={value.title}
                                    value={state[value.name] as string}
                                    color={getErrors(value.name) === "" ? "primary" : "error"}
                                    status={getErrors(value.name) === "" ? "default" : "error"}
                                    helperColor={getErrors(value.name) === "" ? "default" : "error"}
                                    helperText={getErrors(value.name)}
                                />
                            </div>
                        ) : (
                            <div className="mt-2">
                                <div className="mx-3">
                                    <Text
                                        span={true}
                                        style={{
                                            display: "inline-block",
                                            fontSize: "14px",
                                            verticalAlign: "middle",
                                            color: "rgb(153, 153, 153)",
                                        }}>
                                        {value.title}
                                    </Text>
                                    <Switch
                                        onChange={(e) => onChange(value.name, e.target.checked)}
                                        style={{ display: "inline-block", verticalAlign: "middle" }}
                                        initialChecked={state[value.name] as boolean}
                                        className="mx-2"
                                    />
                                </div>
                            </div>
                        )}
                    </Col>
                </Row>
            ))}
        </div>
    );
};

export default InputRenderer;
