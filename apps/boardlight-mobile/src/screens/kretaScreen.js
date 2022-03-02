import { Avatar, Headline, List, Text, Title, useTheme } from "react-native-paper";
import { StyleSheet, View } from "react-native";

import BottomSheet from "../components/bottomSheet";
import { GradeItem } from "../components/content/gradeItem";
import { Ionicons } from "@expo/vector-icons";
import { LaCard } from "../components/content/laCard";
import React from "react";
import { RestrictedWrapper } from "../components/restrictedWrapper";
import { ScreenContainer } from "../components/screenContainer";
import { fetchGrades } from "../utils/api/apiUtils";
import { useBlueboardClient } from "blueboard-client-react";
import { useLoading } from "../hooks/useLoading";
import { usePermissions } from "../hooks/controlHooks";
import { useSelector } from "react-redux";

export const KretaScreen = () => {
  const [currentSubjectData, setCurrentSubjectData] = React.useState(null);
  const [showSubjects, setShowSubjects] = React.useState(true);
  const [currentGrade, setCurrentGrade] = React.useState(null);
  const bottomSheetRef = React.useRef(null);

  const theme = useTheme();
  const loading = useLoading();
  const permissions = usePermissions();

  const gradesData = useSelector((state) => state.kreta.gradesValue);

  const client = useBlueboardClient();

  const styles = StyleSheet.create({
    sheetContainer: {
      flex: 1,
      padding: 20,
    },
    dataContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    title: {
      paddingTop: 8,
    },
    subTitle: {
      paddingBottom: 8,
    },
    subjectItem: {
      padding: 0,
      marginVertical: 5,
      borderRadius: theme.roundness,
    },
    noPremContainer: {
      justifyContent: "center",
      flex: 1,
    },
    space: {
      height: 50,
    },
  });

  const colors = {
    1: "#f44336",
    // orange:
    2: "#ff9800",
    // yellow
    3: "#ffeb3b",
    // light green
    4: "#8bc34a",
    // dark green
    5: "#4caf50",
  };

  const getSubjects = () => {
    return gradesData?.map((item) => (
      <List.Item
        key={item.subject}
        title={item.subject}
        style={styles.subjectItem}
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
      <GradeItem key={item.id} data={item} minimal={true} onPress={() => openSheet(item)} />
    ));
  };

  const openSheet = (grade) => {
    setCurrentGrade(grade);
    bottomSheetRef.current.show();
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
    <ScreenContainer scrollable={permissions.includes("General.grades")}>
      <Headline>Kréta</Headline>
      <RestrictedWrapper
        permission="General.grades"
        fallback={
          <View style={styles.noPremContainer}>
            <Text style={{ textAlign: "center" }}>Nincs hozzáférésed ehhez az oldalhoz</Text>
          </View>
        }>
        {showSubjects ? (
          <LaCard title="Tantárgyak" error={gradesData === null} retry={() => tryAgain()}>
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
        <View style={styles.space} />

        <BottomSheet
          backgroundColor={theme.colors.backdrop}
          sheetBackgroundColor={theme.dark ? "#1e1e1e" : theme.colors.surface}
          radius={theme.roundness}
          ref={bottomSheetRef}
          height={220}>
          <View style={styles.sheetContainer}>
            <View style={styles.dataContainer}>
              <View style={{ width: "80%" }}>
                <Title style={styles.title} numberOfLines={1}>
                  {currentGrade?.type}
                </Title>
                <Text style={styles.subTitle} numberOfLines={1}>
                  {currentGrade?.name}
                </Text>
              </View>
              <Avatar.Text
                style={{ backgroundColor: colors[currentGrade?.grade], margin: 8 }}
                size={56}
                color="#000000"
                label={currentGrade?.grade}
              />
            </View>
            <View style={{ ...styles.dataContainer, paddingTop: 4 }}>
              <Text>Tantárgy:</Text>
              <Text>{currentGrade?.subject}</Text>
            </View>
            <View style={styles.dataContainer}>
              <Text>Tanár:</Text>
              <Text>{currentGrade?.teacher}</Text>
            </View>
            <View style={styles.dataContainer}>
              <Text>Dátum:</Text>
              <Text>
                {
                  // Budget inline formatting let's go
                  currentGrade?.date
                    .replace("-", ". ")
                    .replace("-", ". ")
                    .replace("T", ". ")
                    .replace("Z", "")
                }
              </Text>
            </View>
            <View style={styles.dataContainer}>
              <Text>Súly:</Text>
              <Text>{currentGrade?.weight}%</Text>
            </View>
          </View>
        </BottomSheet>
      </RestrictedWrapper>
    </ScreenContainer>
  );
};
