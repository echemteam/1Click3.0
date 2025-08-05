import { createSlice } from "@reduxjs/toolkit";

const productSearchSlice = createSlice({
  name: "productSearch",
  initialState : {
    searchText: "",
    breadcrumbCatalogId: "",
  },
  reducers: {
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    setBreadcrumbCatalogId: (state, action) =>{
      state.breadcrumbCatalogId = action.payload;
    }
  },
});

export const { setSearchText, setBreadcrumbCatalogId } = productSearchSlice.actions;

export default productSearchSlice.reducer;
