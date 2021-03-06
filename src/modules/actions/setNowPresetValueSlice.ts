import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  LaunchPadScale,
  Preset,
  SoundSample,
} from "../../components/LaunchPad/utils/types";
import { PrivacyType } from "../../utils/CommonValue";

export interface SoundSampleWithFile extends SoundSample {
  soundFile?: File;
}

interface PresetThumbnail {
  thumbnailImgURL: string;
  thumbnailImgFile?: File;
}

export interface NowPresetValueState {
  userId: string; // Preset myPresetPage에서는 undefined, userPresetPage에서는 "작성자의"userId를 가지고있게함
  presetTitle: string; //Preset
  presetId: string; //Preset
  areaSize: LaunchPadScale; //Preset
  soundSamples: Array<SoundSampleWithFile>; //Preset
  thumbnailImg: PresetThumbnail;
  PrivacyOption: PrivacyType;
  tags: Array<string>;
}

const initialState: NowPresetValueState = {
  userId: "",
  presetTitle: "",
  presetId: "",
  areaSize: 64,
  soundSamples: [],
  thumbnailImg: {
    thumbnailImgURL: "",
    thumbnailImgFile: undefined,
  },
  PrivacyOption: "PUBLIC",
  tags: [],
};

export const setNowPresetValueSlice = createSlice({
  name: "setNowPresetValue",
  initialState,
  reducers: {
    setValueFromPreset: (state, action: PayloadAction<Preset>) => {
      state.presetTitle = action.payload!.presetTitle || "";
      state.userId = action.payload!.userId || "ErrorUserId";
      state.presetId = action.payload.presetId || "unsaved";
      state.areaSize = action.payload.areaSize || LaunchPadScale.DEFAULT;

      const canSaveFileForm = action.payload.soundSamples.map((soundSample) => {
        return {
          ...soundSample,
          soundFile: undefined,
        };
      });

      state.soundSamples = canSaveFileForm;
    },

    setValueFromImage: (state, action: PayloadAction<any>) => {
      state.thumbnailImg = {
        thumbnailImgURL: action.payload.thumbnailURL,
        thumbnailImgFile: undefined,
      };
    },
    setValueFromPrivacyOption: (state, action: PayloadAction<any>) => {
      state.PrivacyOption = action.payload.isPrivate ? "PRIVATE" : "PUBLIC";
    },
    setValueFromTags: (
      state,
      action: PayloadAction<Pick<NowPresetValueState, "tags">>
    ) => {
      state.tags = action.payload.tags;
    },
    setValueFromUserId: (
      state,
      action: PayloadAction<Pick<NowPresetValueState, "userId">>
    ) => {
      state.userId = action.payload.userId;
    },
  },
});

export const { actions } = setNowPresetValueSlice;

export default setNowPresetValueSlice.reducer;
