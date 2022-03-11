/* // The only reason this exist is so I can use redux hooks

const AppLogic = () => {
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_300Light,
        Poppins_100Thin,
    });

    console.log(BLUEBOARD_URL, BLUEBOARD_SOKETI_HOST, BLUEBOARD_SOKETI_KEY);

    const [isReady, setIsReady] = useState(false); // Used with login only, might want to change that in the future

    const token = useSelector((state) => state.token.value);
    const theme = useSelector((state) => state.theme.value);

    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            try {
                if (token !== null) {
                    await fetchControl(token);
                } else {
                    const email = await secureLoadData('email');
                    const password = await secureLoadData('password');

                    if (email !== null && password !== null) {
                        const res = await login(email, password);

                        if (res.data.token !== null) {
                            try {
                                const savedTheme = await loadData('settings_theme');

                                if (savedTheme !== null) {
                                    dispatch(setTheme(savedTheme === 'dark' ? darkTheme : lightTheme));
                                } else {
                                    throw new Error('No saved theme');
                                }
                            } catch (err) {
                                dispatch(setTheme(Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme));
                            }

                            await fetchControl(res.data.token);

                            try {
                                await fetchLolo(res.data.token, true);
                            } catch (err) {
                                console.log(err);
                            }

                            setRenewal(res.data.token);
                            dispatch(setToken(res.data.token));
                        }
                    }
                }
            } catch (err) {
                console.log(err);
            }

            setIsReady(true);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!isReady || !fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <>
            <StatusBar style={theme === lightTheme ? 'dark' : 'light'} />
            <BlueboardProvider token={token}>
                <PaperProvider theme={theme}>
                    <NavigationDecider />
                </PaperProvider>
            </BlueboardProvider>
        </>
    );
};
 */
