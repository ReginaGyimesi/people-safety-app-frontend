import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { API_BASE_URL } from "@env";
import { API_ENDPOINTS } from "./routes/routes";

export default function App() {
  const [crimes, setCrimes] = useState<any>([]);

  useEffect(() => {
    const fetchCrimes = async () => {
      try {
        const req = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.allCrimesScot}`
        );
        const res = await req.json();
        setCrimes(res);
      } catch (e) {
        console.log(e);
      }
    };
    fetchCrimes();
  }, []);

  if (!crimes) return <ActivityIndicator />;
  return (
    <View style={styles.container}>
      {crimes
        ?.filter(
          (c: any) =>
            c.crime_or_offence == "all-crimes" && c.ref_period == "2020/2021"
        )
        ?.map((c: any, i: number) => (
          <Text key={i} style={styles.item}>
            {c.area_name} - {c.value}
          </Text>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  item: {
    fontSize: 16,
    marginTop: 5,
  },
});
