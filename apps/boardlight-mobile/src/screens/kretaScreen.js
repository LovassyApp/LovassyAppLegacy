import { GradeItem } from "../components/content/gradeItem";
import { Headline } from "react-native-paper";
import React from "react";
import { ScreenContainer } from "../components/screenContainer";

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

  return (
    <ScreenContainer>
      <Headline>Kreta</Headline>
      <GradeItem data={dingus} />
    </ScreenContainer>
  );
};
