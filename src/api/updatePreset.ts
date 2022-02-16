import { AxiosRequestConfig } from "axios";
import { axiosInstance } from "./axiosInstance";

export interface PresetParams {
    presetTitle: "",
    presetId: "",
    thumbnailImageFile: "",
    isPrivate: any,
    soundSamples: any,
    tags: any,
}

export async function updatePreset(params: PresetParams) {
  
  const formData = new FormData();
  
  formData.append("presetId", params.presetId);
  formData.append("thumbnailImgFile", params.thumbnailImageFile);
  formData.append("presetTitle", params.presetTitle);
  formData.append("tags", params.tags);
  formData.append("isPrivate", params.isPrivate);
  formData.append("soundSamples", params.soundSamples);
  
  const config: AxiosRequestConfig = {
    baseURL: "http://localhost:4000",
    //token input
    headers: {
      'Content-type': 'multipart/form-data',
    }
  };

  axiosInstance(config).put(`/preset/update/${params.presetId}`, formData)
    .then((res) => {

    })

}
