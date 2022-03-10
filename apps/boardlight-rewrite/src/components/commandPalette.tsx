import { Book, ChevronRight, Home } from "tabler-icons-react";
import { SpotlightAction, SpotlightProvider } from "@mantine/spotlight";

import { useNavigate } from "react-router-dom";

export const CommandPalette = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const navigate = useNavigate();

    const actions: SpotlightAction[] = [
        {
            icon: <Home size={18} />,
            title: "Kezdőlap",
            description: "Ugrás a kezdőlapra",
            group: "Navigáció",
            keywords: "home",
            onTrigger: () => navigate("/home"),
        },
        {
            icon: <Book size={18} />,
            title: "Kréta",
            description: "Ugrás a kréta oldalra",
            group: "Navigáció",
            keywords: "kreta",
            onTrigger: () => navigate("/kreta"),
        },
    ];

    return (
        <SpotlightProvider
            searchIcon={<ChevronRight size={18} />}
            searchPlaceholder="Parancs..."
            actions={actions}
            highlightQuery={true}
            nothingFoundMessage="Úgy néz ki ez nem egy létező parancs..."
            shortcut="mod + k">
            {children}
        </SpotlightProvider>
    );
};
