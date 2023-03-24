import { API_BASE_URL } from "@env";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { ScrollView } from "react-native-gesture-handler";
import GoBackButton from "../components/common/GoBackButton";
import Loading from "../components/common/Loading";
import { ScotContext } from "../context/provider";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchAllScottishData } from "../redux/slices/scotReducer";
import { API_ENDPOINTS } from "../routes/routes";
import { sizes } from "../styles";
import { baseColors } from "../styles/colors";
import { useTheme } from "../theme/ThemeProvider";

const screenWidth = Dimensions.get("window").width;

export default function StatsScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const scotData = useAppSelector((s) => s.scotData);
  const enData = useAppSelector((s) => s.enData);
  const [labelsScot, setLabelsScot] = useState<any>([
    scotData && scotData.data && scotData.data![0].area_name,
  ]);
  const [valuesScot, setValuesScot] = useState<any>([
    scotData && scotData.data && scotData.data![0].total_crime,
  ]);

  const [labelsEn, setLabelsEn] = useState<any>([
    enData && enData.data && enData.data![0].lsoa_name,
  ]);
  const [valuesEn, setValuesEn] = useState<any>([
    enData && enData.data && enData.data![0].total_crime,
  ]);

  const isScot = React.useContext(ScotContext);

  const getData = () => {
    if (isScot) {
      scotData.neighbours[0].neighbour.map(
        async (n: any) =>
          await fetch(`${API_BASE_URL}${API_ENDPOINTS.crimeByLa}`, {
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
              setLabelsScot((l: any) => [...l, data[0]?.area_name]);
              setValuesScot((v: any) => [...v, data[0]?.total_crime]);

              return data;
            })
            .catch((err) => {
              console.log(err.message);
            })
      );
    }
    if (!isScot) {
      if (enData.neighbours) {
        enData.neighbours[0].neighbour.map(
          async (n: any) =>
            await fetch(`${API_BASE_URL}en-crime-by-lsoa-name`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: n,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.length == 0) return;
                setLabelsEn((l: any) => [...l, data[0]?.lsoa_name]);
                setValuesEn((v: any) => [...v, data[0]?.total_crime]);

                return data;
              })
              .catch((err) => {
                console.log(err.message);
              })
        );
      }
    }
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

  useEffect(() => {
    getData();
    dispatch(fetchAllScottishData({ la: scotData.data![0].area_name }));
  }, []);

  console.log(valuesEn, labelsEn);

  if (
    valuesScot.length < 0 ||
    labelsScot.length < 0 ||
    valuesEn.length < 0 ||
    labelsEn.length < 0 ||
    (isScot && !scotData.allScots)
  )
    return <Loading />;

  return (
    <View>
      <GoBackButton />
      <ScrollView
        style={{ ...styles.container, backgroundColor: colors.background }}
        testID="stats-screen"
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
        {scotData.allScots && isScot && (
          <View>
            <Text
              style={{
                ...styles.subtitle,
                color: colors.text,
                marginTop: 50,
              }}
            >
              Total crimes overtime in{" "}
              {isScot ? scotData.data![0].area_name : enData.data![0].lsoa_name}
            </Text>
            <Text style={{ ...styles.body, color: colors.secondaryText }}>
              Scroll to see how crime trends are visualised in{" "}
              {isScot ? scotData.data![0].area_name : enData.data![0].lsoa_name}
              .
            </Text>
            <ScrollView
              style={{
                marginTop: 20,
                backgroundColor: colors.secondaryBackground,
                borderRadius: 15,
                overflow: "scroll",
              }}
              horizontal
              testID="crimes-over-time"
            >
              <LineChart
                data={{
                  labels: scotData.allScots[0]!.ref_period.slice(
                    13,
                    scotData.allScots[0].length
                  ),
                  datasets: [
                    {
                      data: scotData.allScots[0]!.total_crime.slice(
                        13,
                        scotData.allScots[0].length
                      ),
                      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                      strokeWidth: 2, // optional
                    },
                  ],
                }}
                style={{ marginLeft: -20 }}
                width={screenWidth}
                height={280}
                chartConfig={chartConfig}
                verticalLabelRotation={-70}
                fromZero
              />
            </ScrollView>
          </View>
        )}
        <View
          style={{
            borderTopColor: "#d3d3d3",
            borderTopWidth: 2,
            marginTop: 25,
            width: "10%",
            alignSelf: "center",
          }}

        />
        <Text
          style={{
            ...styles.subtitle,
            color: colors.text,
            marginTop: 25,
          }}
        >
          Most commonly committed crimes in{" "}
          {isScot ? scotData.data![0].area_name : enData.data![0].lsoa_name}
        </Text>
        <Text style={{ ...styles.body, color: colors.secondaryText }}>
          Scroll to see more regularly committed crimes in{" "}
          {isScot ? scotData.data![0].area_name : enData.data![0].lsoa_name}.
        </Text>
        <ScrollView
          style={{
            marginTop: 20,
            backgroundColor: colors.secondaryBackground,
            borderRadius: 15,
            overflow: "scroll",
          }}
          horizontal
          testID="stats-most-common"
        >
          <BarChart
            data={{
              labels: isScot
                ? scotData.data![0].crime_type
                : enData.data![0].crime_type,
              datasets: [
                isScot
                  ? {
                      data: scotData.data![0].n,
                      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                      strokeWidth: 2, // optional
                    }
                  : {
                      data: enData.data![0].n,
                      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                      strokeWidth: 2, // optional
                    },
              ],
            }}
            width={600}
            height={280}
            showValuesOnTopOfBars={true}
            yAxisSuffix={""}
            yAxisLabel={""}
            chartConfig={chartConfig}
            verticalLabelRotation={-70}
            style={{ marginLeft: -20 }}
            fromZero
          />
        </ScrollView>
        <View
          style={{
            borderTopColor: "#d3d3d3",
            borderTopWidth: 2,
            marginTop: 25,
            width: "10%",
            alignSelf: "center",
          }}
        />
        <Text
          style={{
            ...styles.subtitle,
            color: colors.text,
            marginTop: 25,
          }}
        >
          Total crimes surrounding{" "}
          {isScot ? scotData.data![0].area_name : enData.data![0].lsoa_name}
        </Text>
        <Text style={{ ...styles.body, color: colors.secondaryText }}>
          Scroll to see total crimes neighbouring{" "}
          {isScot ? scotData.data![0].area_name : enData.data![0].lsoa_name}.
        </Text>
        <ScrollView
          style={{
            marginTop: 10,
            backgroundColor: colors.secondaryBackground,
            borderRadius: 15,
            marginBottom: 60,
          }}
          horizontal
          testID="stats-neighbours"
        >
          <BarChart
            data={{
              labels: isScot ? labelsScot : labelsEn,
              datasets: [
                {
                  data: isScot ? valuesScot : valuesEn,
                },
              ],
            }}
            width={screenWidth}
            height={280}
            chartConfig={chartConfig}
            showValuesOnTopOfBars={true}
            yLabelsOffset={20}
            yAxisSuffix={""}
            yAxisLabel={""}
            verticalLabelRotation={-70}
            style={{ marginLeft: -5 }}
            fromZero
          />
        </ScrollView>
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
  body: {
    fontSize: sizes.S14,
    fontWeight: "400",
    marginTop: 5,
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
