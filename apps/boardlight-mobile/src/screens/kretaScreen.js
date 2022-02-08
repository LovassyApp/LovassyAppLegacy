import { Headline, List, useTheme } from "react-native-paper";
import { LayoutAnimation, Platform, UIManager, View } from "react-native";

import { GradeItem } from "../components/content/gradeItem";
import { Ionicons } from "@expo/vector-icons";
import { LaCard } from "../components/content/laCard";
import React from "react";
import { ScreenContainer } from "../components/screenContainer";
import { fadeInDown } from "react-animations";
import { fetchGrades } from "../utils/api/apiUtils";
import { useBlueboardClient } from "blueboard-client-react";
import { useLoading } from "../hooks/useLoading";
import { useSelector } from "react-redux";

// if (Platform.OS === "android") {
//   if (UIManager.setLayoutAnimationEnabledExperimental) {
//     UIManager.setLayoutAnimationEnabledExperimental(true);
//   }
// }

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
          // LayoutAnimation.configureNext(
          //   LayoutAnimation.create(
          //     1000,
          //     LayoutAnimation.Types.linear,
          //     LayoutAnimation.Properties.scaleXY,
          //   ),
          // );
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

  const calculateAverage = () => {
    var res = 0;

    for (const grade of currentSubjectData.grades) {
      res += grade.grade;
    }

    return Number(res / currentSubjectData.grades.length).toFixed(2);
  };

  return (
    <ScreenContainer scrollable={true}>
      <Headline>Kreta</Headline>
      {/* <LaCard
        title={showSubjects ? "Subjects" : `${currentSubjectData.subject} - ${calculateAverage()}`}
        error={gradesData === null}
        retry={() => tryAgain()}
        actionIcon={showSubjects ? null : "arrow-back"}
        onPress={
          showSubjects
            ? null
            : () => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.create(
                    1000,
                    LayoutAnimation.Types.linear,
                    LayoutAnimation.Properties.scaleXY,
                  ),
                );
                setShowSubjects(true);
              }
        }>
        <View style={{ paddingTop: 5 }}>{showSubjects ? getSubjects() : getGrades()}</View>
      </LaCard> */}
      {showSubjects ? (
        <LaCard title="Subjects" error={gradesData === null} retry={() => tryAgain()}>
          <View style={{ paddingTop: 5 }}>{getSubjects()}</View>
        </LaCard>
      ) : (
        <LaCard
          title={`${currentSubjectData.subject} - ${calculateAverage()}`}
          actionIcon="arrow-back"
          onPress={() => setShowSubjects(true)}>
          <View style={{ paddingTop: 5 }}>{getGrades()}</View>
        </LaCard>
      )}
    </ScreenContainer>
  );
};
