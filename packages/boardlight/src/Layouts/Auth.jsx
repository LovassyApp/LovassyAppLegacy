import { useTheme } from '@nextui-org/react';
import * as React from 'react';
import TopNav from '../Components/TopNav';
//import Footer from '../Components/Footer';
import style from '../CSS/auth.layout.module.css';
import Radium, { StyleRoot } from 'radium';

const AuthLayout = (props) => {
	const theme = useTheme();
	const styles = {
		container: {
			background: theme.type == 'dark' ? theme.palette.background : theme.palette.accents_1,
			color: theme.palette.text,
		},
	};
	return (
		<StyleRoot>
			<div className="layoutBase" style={{ height: '100%' }}>
				<div className="container-fluid" style={{ width: '95%' }}>
					<div>
						<div className="pt-2" />
						<TopNav />
					</div>
					{/*<Footer />*/}
				</div>
				<div className={style.wrapper}>
					<div className={style.content} style={styles.container}>
						{props.children}
					</div>
				</div>
			</div>
		</StyleRoot>
	);
};
export default AuthLayout;
