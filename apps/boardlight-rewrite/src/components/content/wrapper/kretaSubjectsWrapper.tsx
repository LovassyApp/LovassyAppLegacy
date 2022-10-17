import { Center, Loader, createStyles } from "@mantine/core";
import React, { Suspense } from "react";

import { useViewportSize } from "@mantine/hooks";

const useStyles = createStyles((theme, height: number) => ({
    fallbackContainer: {
        height: height - 92,
    },
}));

export const KretaSubjectsWrapper = (): JSX.Element => {
    const KretaSubjects = React.lazy(() => import("../kretaSubjects"));
    const { height } = useViewportSize();
    const { classes } = useStyles(height);

    return (
        <Suspense
            fallback={
                <Center className={classes.fallbackContainer}>
                    <Loader />
                </Center>
            }>
            <KretaSubjects />
        </Suspense>
    );
};
