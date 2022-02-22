import {useTheme} from "@nextui-org/react";
import * as React from "react";
import TopNav from "../Components/TopNav";
// import Footer from '../Components/Footer';
import style from "../CSS/auth.layout.module.css";
import SettingsModal from "../Components/SettingsModal";
import Radium from "radium";

const AuthLayout = ({children}: {children: React.ReactNode}): JSX.Element => {
    const theme = useTheme();
    const styles = {
        container: {
            background: theme.type === "dark" ? theme.palette.background : theme.palette.accents_1,
            color: theme.palette.text,
        },
    };
    return (
        <Radium.StyleRoot>
            <div className="layoutBase" style={{height: "100%"}}>
                <SettingsModal />
                <div className="container-fluid" style={{width: "95%"}}>
                    <div>
                        <div className="pt-2" />
                        <TopNav />
                    </div>
                    {/* <Footer />*/}
                </div>
                <div className={style.wrapper}>
                    <div className={style.content} style={styles.container}>
                        {children}
                    </div>
                </div>
            </div>
        </Radium.StyleRoot>
    );
};
export default AuthLayout;
