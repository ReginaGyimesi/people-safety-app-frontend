import { API_BASE_URL } from "@env";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../routes/routes";

// Fetch Scottish data by local authority.
export const fetchScottishData = createAsyncThunk(
  "fetchScottishData",
  async ({ la }: { la: string | null | undefined }, thunkAPI) => {
    try {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.crimeByLa}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          la: la,
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

export const fetchNeighbouringScot = createAsyncThunk(
  "fetchNeighbouringScot",
  async ({ la }: { la: string | null | undefined }, thunkAPI) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.scotNeighbours}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            la: la,
          }),
        }
      );

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

const scotReducer = createSlice({
  name: "scot",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchScottishData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchScottishData.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchScottishData.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(fetchNeighbouringScot.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchNeighbouringScot.fulfilled, (state, action) => {
      state.loading = false;
      state.neighbours = action.payload;
    });
    builder.addCase(fetchNeighbouringScot.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default scotReducer.reducer;
