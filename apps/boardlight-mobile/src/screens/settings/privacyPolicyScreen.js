import { Headline, Paragraph, Text, Title } from "react-native-paper";
import { ScrollView, StyleSheet, View } from "react-native";

import { LaButton } from "../../components/content/customized/laButton";
import React from "react";
import { ScreenContainer } from "../../components/screenContainer";
import Autolink from "react-native-autolink";

export const PrivacyPolicyScreen = ({ navigation }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 10,
    },
    paragraph: {
      marginTop: 10,
    },
  });

  return (
    <ScreenContainer scrollable={true}>
      <Headline>Adatvédelmi tájékoztató</Headline>
      <View style={styles.container}>
        <Paragraph style={styles.paragraph}>
          A LovassyApp egy alkalmazás, mely az érdemjegyeid segítségével jutalmazza a tanulmányi
          munkádat. Az érdemjegyeid csak közvetlenül egy iskolai számítógép és a mi szerverünk
          között közlekednek, ahol titkosított formában, csak az általad kezelt titkosító kulcs
          segítségével olvashatóak. Az adatok minden esetben titkosítva maradnak, egészen addig,
          amíg a saját eszközöd meg nem jeleníti őket.
        </Paragraph>
        <Paragraph style={styles.paragraph}>
          A LovassyApp fejlesztői és üzemeltetői ezekhez az adatokhoz semmilyen módon nem férnek
          hozzá. Az adatok az e-Kréta rendszer egy, az iskolavezetésnek szánt kimutatásából
          származnak, melyhez közvetlen hozzáférése a rendszer fejlesztőinek, karbantartóinak és
          üzemeltetőinek nincs. Ezáltal az érdemjegyek megtekintésére valamint módosítására a
          rendszer rendszer fejlesztőinek, karbantartóinak és üzemeltetőinek nincs lehetősége,
          valamint ezeket harmadik fél számára nem továbbítjuk.
        </Paragraph>
        <Paragraph style={styles.paragraph}>
          Ha az adataiddal kapcsolatban bármilyen kérdésed van (mint például azok törlése), keress
          minket a <Autolink email={true} text="mailto:lovassyapp@gmail.com" /> címen.
        </Paragraph>
        <Paragraph style={styles.paragraph}>
          A LovassyApp használatával jelzed, hogy ezt a tájékoztatót tudomásul vetted.
        </Paragraph>
      </View>
      <LaButton dense={true} customStyle={{ margin: 10 }} onPress={() => navigation.goBack()}>
        Vissza
      </LaButton>
    </ScreenContainer>
  );
};
