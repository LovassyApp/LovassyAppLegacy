import { FlatList, ScrollView, View } from "react-native";
import { Headline, List, useTheme } from "react-native-paper";

import { GradeItem } from "../components/content/gradeItem";
import { Ionicons } from "@expo/vector-icons";
import { LaCard } from "../components/content/laCard";
import React from "react";
import { ScreenContainer } from "../components/screenContainer";
import { useSelector } from "react-redux";

export const KretaScreen = () => {
  const dingus = {
    id: 49,
    created_at: "2022-01-19T14:29:43.000000Z",
    updated_at: "2022-01-19T15:19:11.000000Z",
    user_id: 1,
    lolo_id: 1,
    uid: "7258658,Ertekeles",
    date: "2021-09-05T22:00:00Z",
    subject: "Digitális kultúra",
    teacher: "Báder Anikó",
    name: "Játékprogram készítése - torpedó",
    type: "Házi feladat",
    grade: 5,
    gradeType: "Ertekeles",
    gradeText: "Jeles(5)",
    weight: 100,
  };

  const gradesData = useSelector((state) => state.kreta.gradesValue);
  const theme = useTheme();

  const [currentSubjectData, setCurrentSubjectData] = React.useState(null);
  const [showSubjects, setShowSubjects] = React.useState(true);

  const getSubjects = () => {
    return gradesData.map((item) => (
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
    return currentSubjectData.grades.map((item) => (
      <GradeItem key={item.id} data={item} minimal={true} />
    ));
  };

  return (
    <ScreenContainer scrollable={true}>
      <Headline>Kreta</Headline>
      {showSubjects ? (
        <LaCard title="Subjects">
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
