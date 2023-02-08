import { API_BASE_URL } from "@env";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { ScrollView } from "react-native-gesture-handler";
import GoBackButton from "../components/common/GoBackButton";
import Loading from "../components/common/Loading";
import { useAppSelector } from "../redux/hooks";
import { API_ENDPOINTS } from "../routes/routes";
import { sizes } from "../styles";
import { baseColors } from "../styles/colors";
import { useTheme } from "../theme/ThemeProvider";

const screenWidth = Dimensions.get("window").width;

export default function StatsScreen() {
  const { colors } = useTheme();
  const scotData = useAppSelector((s) => s.scotData);
  const [labels, setLabels] = useState<any>([scotData.data![0].area_name]);
  const [values, setValues] = useState<any>([scotData.data![0].total_crime]);

  const getData = () => {
    scotData.neighbours[0].neighbour.map(
      async (n: any) =>
        await fetch(`${API_BASE_URL}/${API_ENDPOINTS.crimeByLa}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            la: n,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.length == 0) return;
            setLabels((l: any) => [...l, data[0]?.area_name]);
            setValues((v: any) => [...v, data[0]?.total_crime]);

            return data;
          })
          .catch((err) => {
            console.log(err.message);
          })
    );
  };

  const chartConfig = {
    backgroundGradientFrom: colors.background,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: colors.background,
    backgroundGradientToOpacity: 0.5,

    fillShadowGradientOpacity: 1,
    color: (opacity = 1) => baseColors.primary,
    labelColor: (opacity = 1) => colors.secondaryText,
    strokeWidth: 2,

    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForVerticalLabels: {
      fontWeight: "bold",
      fontSize: sizes.XXS10,
      marginLeft: 20,
      paddingBottom: 40,
      zIndex: 99,
    },
  };
  const data = {
    labels: labels,
    datasets: [
      {
        data: values,
      },
    ],
  };

  useEffect(() => {
    getData();
  }, []);

  if (values.length < 0 || labels.length < 0) return <Loading />;

  return (
    <View>
      <GoBackButton />
      <ScrollView
        style={{ ...styles.container, backgroundColor: colors.background }}
      >
        <View style={{ ...styles.flex }}>
          <Text
            style={{
              ...styles.heading,
              color: colors.text,
            }}
          >
            Stats
          </Text>
        </View>
        <Text
          style={{
            ...styles.subtitle,
            color: colors.text,
            marginTop: 50,
          }}
        >
          Most commonly committed crimes in {scotData.data![0].area_name}
        </Text>
        <View
          style={{
            marginTop: 10,
            backgroundColor: colors.secondaryBackground,
            borderRadius: 15,
            overflow: "hidden",
          }}
        >
          <LineChart
            data={{
              labels: scotData.data![0].crime_type,
              datasets: [
                {
                  data: scotData.data![0].n,
                  color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                  strokeWidth: 2, // optional
                },
              ],
            }}
            width={screenWidth - 30}
            height={280}
            chartConfig={chartConfig}
            verticalLabelRotation={-60}
          />
        </View>
        <Text
          style={{
            ...styles.subtitle,
            color: colors.text,
            marginTop: 50,
          }}
        >
          Total crimes surrounding {scotData.data![0].area_name}
        </Text>
        <View
          style={{
            marginTop: 10,
            backgroundColor: colors.secondaryBackground,
            borderRadius: 15,
            marginBottom: 60,
          }}
        >
          <BarChart
            data={data}
            width={screenWidth - 30}
            height={280}
            chartConfig={chartConfig}
            showValuesOnTopOfBars={true}
            yLabelsOffset={20}
            withHorizontalLabels={false}
            yAxisSuffix={""}
            yAxisLabel={""}
            style={{ paddingRight: 10 }}
            verticalLabelRotation={-70}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 34,
    height: "100%",
    position: "relative",
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: sizes.XL24,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: sizes.M16,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
