import { Box, Loader } from "@mantine/core";
import React, { Suspense } from "react";

export const HomeStatsWrapper = (): JSX.Element => {
    const HomeStats = React.lazy(() => import("../homeStats"));

    return (
        <Suspense
            fallback={
                <Box
                    sx={{
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <Loader />
                </Box>
            }>
            <HomeStats />
        </Suspense>
    );
};
