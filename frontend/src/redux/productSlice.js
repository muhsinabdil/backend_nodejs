import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  loading: false, //! yüklerken kontol için galiba
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = productSlice.actions;

export default productSlice.reducer;
