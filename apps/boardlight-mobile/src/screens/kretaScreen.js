import { Headline, List, useTheme } from "react-native-paper";

import { GradeItem } from "../components/content/gradeItem";
import { Ionicons } from "@expo/vector-icons";
import { LaCard } from "../components/content/laCard";
import React from "react";
import { ScreenContainer } from "../components/screenContainer";
import { View } from "react-native";
import { fetchGrades } from "../utils/api/apiUtils";
import { useBlueboardClient } from "blueboard-client-react";
import { useLoading } from "../hooks/useLoading";
import { useSelector } from "react-redux";

export const KretaScreen = () => {
  const [currentSubjectData, setCurrentSubjectData] = React.useState(null);
  const [showSubjects, setShowSubjects] = React.useState(true);

  const theme = useTheme();
  const loading = useLoading();

  const gradesData = useSelector((state) => state.kreta.gradesValue);

  const client = useBlueboardClient();

  const getSubjects = () => {
    return gradesData?.map((item) => (
      <List.Item
        key={item.subject}
        title={item.subject}
        style={{
          padding: 0,
          marginVertical: 5,
          borderRadius: theme.roundness,
        }}
        right={() => (
          <Ionicons name="chevron-forward-outline" size={24} color={theme.colors.text} />
        )}
        onPress={() => {
          setCurrentSubjectData(item);
          setShowSubjects(false);
        }}
      />
    ));
  };

  const getGrades = () => {
    return currentSubjectData?.grades.map((item) => (
      <GradeItem key={item.id} data={item} minimal={true} />
    ));
  };

  const tryAgain = async () => {
    loading(true);

    try {
      await fetchGrades(client);
    } catch (err) {
      console.log(err);
    }

    loading(false);
  };

  return (
    <ScreenContainer scrollable={true}>
      <Headline>Kreta</Headline>
      {showSubjects ? (
        <LaCard title="Subjects" error={gradesData === null} retry={() => tryAgain()}>
          <View style={{ paddingTop: 5 }}>{getSubjects()}</View>
        </LaCard>
      ) : (
        <LaCard
          title={currentSubjectData.subject}
          actionIcon="arrow-back"
          onPress={() => setShowSubjects(true)}>
          <View style={{ paddingTop: 5 }}>{getGrades()}</View>
        </LaCard>
      )}
    </ScreenContainer>
  );
};
