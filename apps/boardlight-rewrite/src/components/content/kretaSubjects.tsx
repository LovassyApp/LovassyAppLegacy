import { Box, Group } from "@mantine/core";

import { RootState } from "../../store/store";
import { SubjectCard } from "./subjectCard";
import { useSelector } from "react-redux";

const KretaSubjects = (): JSX.Element => {
    const gradeData = useSelector((state: RootState) => state.kreta.gradeData);

    const getSubjectCards = (): JSX.Element[] => {
        return gradeData.map((data) => <SubjectCard data={data} key={data.subject} />);
    };

    return <Group>{getSubjectCards()}</Group>;
};

export default KretaSubjects;
