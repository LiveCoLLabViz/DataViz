import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  versions: [],
  isPanelOpen: false,
  loading: false,
};

const versionSlice = createSlice({
  name: 'version',
  initialState,
  reducers: {
    setVersions(state, action) {
      state.versions = action.payload;
      //
    },
    //setversions replaces the entire versions array with the new array provided in the action payload
    addVersion(state, action) {
      state.versions.unshift(action.payload);
      //unshift adds the new version to the beginning of the array, so the latest version is always at the top
    },
    openVersionPanel(state) {
      state.isPanelOpen = true;
    },
    closeVersionPanel(state) {
      state.isPanelOpen = false;
    },
    setVersionLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const {
  setVersions,
  addVersion,
  openVersionPanel,
  closeVersionPanel,
  setVersionLoading,
} = versionSlice.actions;
export default versionSlice.reducer;
