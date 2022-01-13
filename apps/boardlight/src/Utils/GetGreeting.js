const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
        return 'Jó reggelt, ';
    } else if (hour < 18) {
        return 'Szép napot, ';
    } else {
        return 'Szép estét, ';
    }
};

export default getGreeting;
