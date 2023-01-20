import { Dispatch, RefObject } from "react";

// api
export type FetchScottishProps = {
  la: any;
  setData: Dispatch<any>;
  setLoading: Dispatch<any>;
};

export type FetchEnglishProps = {
  po: any;
  setData: Dispatch<any>;
  setLoading: Dispatch<any>;
};

export type FetchPointInLaProps = {
  lat: number;
  lon: number;
  setData: Dispatch<any>;
};

// components
export type MapProps = {
  mapRef: RefObject<any>;
  coords: any;
  goToMyLocation: () => void;
  setMyLocation: Dispatch<any>;
  address: any;
  enData: any;
  data: any;
};
