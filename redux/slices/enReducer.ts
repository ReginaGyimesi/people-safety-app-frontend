import { API_BASE_URL } from "@env";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../routes/routes";

// Fetch English data by post code.
export const fetchEnglishData = createAsyncThunk(
  "fetchEnglishData",
  async ({ po }: { po: string | null | undefined }, thunkAPI) => {
    try {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.crimeByPo}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          po: po,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        return thunkAPI.rejectWithValue({ error: json });
      }
      return json;
    } catch (e) {
      return thunkAPI.rejectWithValue({ error: e });
    }
  }
);

export const fetchNeighbouringEn = createAsyncThunk(
  "fetchNeighbouringEn",
  async ({ po }: { po: string | null | undefined }, thunkAPI) => {
    try {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.enNeighbours}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          po: po,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        return thunkAPI.rejectWithValue({ error: json });
      }
      return json;
    } catch (e) {
      return thunkAPI.rejectWithValue({ error: e });
    }
  }
);

const initialState: { data: any; neighbours: any; loading: boolean } = {
  data: null,
  neighbours: null,
  loading: false,
};

const enReducer = createSlice({
  name: "en",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchEnglishData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchEnglishData.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchEnglishData.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(fetchNeighbouringEn.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchNeighbouringEn.fulfilled, (state, action) => {
      state.loading = false;
      state.neighbours = action.payload;
    });
    builder.addCase(fetchNeighbouringEn.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default enReducer.reducer;
