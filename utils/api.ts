import { API_BASE_URL } from "@env";
import { API_ENDPOINTS } from "../routes/routes";
import {
  FetchEnglishProps,
  FetchPointInLaProps,
  FetchScottishProps,
} from "./types";

// Fetch Scottish data by local authority.
export const fetchScottishData = async ({
  la,
  setData,
  setLoading,
}: FetchScottishProps) => {
  setLoading(true);
  await fetch(`${API_BASE_URL}/${API_ENDPOINTS.crimeByLa}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      la: la,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("fetching scot data...");
      setData(data);
      setLoading(false);
      return data;
    })
    .catch((err) => {
      console.log(err.message);
      setLoading(false);
    });
};

// Fetch English data by postcode.
export const fetchEnglishData = async ({
  po,
  setData,
  setLoading,
}: FetchEnglishProps) => {
  setLoading(true);
  await fetch(`${API_BASE_URL}/${API_ENDPOINTS.crimeByPo}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      po: po,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("fetching en data...");
      setData(data);
      setLoading(false);
    })
    .catch((err) => {
      console.log(err.message);
      setLoading(false);
    });
};

// Find point in local authority shape.
export const fetchPointInLa = async ({
  lat,
  lon,
  setData,
}: FetchPointInLaProps) => {
  await fetch(`${API_BASE_URL}/${API_ENDPOINTS.crimeByPo}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      lat: lat,
      lon: lon,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("fetching la point...");
      setData(data);
    })
    .catch((err) => {
      console.log(err.message);
    });
};
