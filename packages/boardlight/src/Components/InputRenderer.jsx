import * as React from 'react';
import { Row, Col, Input, Switch, Text } from '@nextui-org/react';

const InputRenderer = ({ inputs }) => {
	return (
		<div>
			<div className="dropdown-divider" />
			{inputs.map((value, key) => (
				<Row key={key}>
					<Col>
						{value.type === 'textbox' ? (
							<div>
								<Input fullWidth bordered underlined shadow={false} labelLeft={value.title} />
							</div>
						) : (
							<div className="mx-3">
								<Text span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
									{value.title}
								</Text>
								<Switch style={{ display: 'inline-block', verticalAlign: 'middle' }} className="mx-2" />
							</div>
						)}
					</Col>
				</Row>
			))}
		</div>
	);
};

export default InputRenderer;
