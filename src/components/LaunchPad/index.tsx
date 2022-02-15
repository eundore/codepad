import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import AddLinkIcon from "@mui/icons-material/AddLink";
import BuildIcon from "@mui/icons-material/Build";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { useState, memo, useEffect } from "react";
import { Preset } from "./utils/types";
import OneShotButton from "./OneShotButton";
import LoopButton from "./LoopButton";
import EmptyButton from "./EmptyButton";
import Metronome from "./Metronome";
import { useAppSelector } from "../../modules/hooks";
import { getAudioArrayBuffer } from "../../api/getAudioArrayBuffer";
import { ButtonColors } from "../../utils/CommonStyle";

const LaunchPadStyles = makeStyles({
  //색깔, 폰트크기들 프로젝트 컬러로 변경해야함
  root: {
    margin: "10px",
    display: "flex",
    flexDirection: "column",
  },
  btnContainer: {
    display: "grid",
    justifyContent: "space-evenly",

    gridTemplateRows: "repeat(8, 52px)",
    gridTemplateColumns: "repeat(8, 52px)",
    gridGap: "7px",

    margin: "0px 15px",
  },
});

interface LaunchPadProps {
  presetData: Preset;
  sampleSoundMap: Map<string, string>; //<K=location, V=sampleSoundURL>
}

function RenderButtons({ presetData }: Pick<LaunchPadProps, "presetData">) {
  const classes = LaunchPadStyles();

  return (
    <div className={classes.btnContainer}>
      {presetData.soundSamples.map(
        (
          { soundSampleId, soundSampleURL, buttonType, soundType, location },
          idx
        ) => {
          switch (buttonType) {
            case "ONESHOT":
              return (
                <div key={soundSampleId + location}>
                  <OneShotButton
                    soundSampleURL={soundSampleURL}
                    buttonType={buttonType}
                    soundType={soundType}
                    location={location}
                  />
                </div>
              );

            case "LOOP":
              return (
                <div key={soundSampleId + location}>
                  <LoopButton
                    soundSampleURL={soundSampleURL}
                    buttonType={buttonType}
                    soundType={soundType}
                    location={location}
                  />
                </div>
              );

            default:
              return (
                <div key={soundSampleId + location}>
                  <EmptyButton />
                </div>
              );
          }
        }
      )}
    </div>
  );
}

//8x8 scale
export function LaunchPad({ presetData, sampleSoundMap }: LaunchPadProps) {
  const classes = LaunchPadStyles();
  const { nowBar, soundGroup } = useAppSelector(
    (state) => state.loopSoundGroupSlice
  );
  const [alreadyPlayedSoundSamples, setAlreadyPlayedSoundSamples] = useState(
    new Map()
  );

  const getBufferSource = async (url: string | undefined) => {
    if (url === undefined) return;
    const data: ArrayBuffer = await getAudioArrayBuffer(url);

    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(data);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = true;
    source.connect(audioContext.destination);
    source.start();
  };

  useEffect(() => {
    console.log(alreadyPlayedSoundSamples);
    soundGroup[nowBar].map((sound) => {
      if (alreadyPlayedSoundSamples.get(sound)) {
        console.log("이미 재생했어!");
      } else {
        getBufferSource(sampleSoundMap.get(sound));
        const newPlayedSet = alreadyPlayedSoundSamples;
        newPlayedSet.set(sound, true);
        setAlreadyPlayedSoundSamples(newPlayedSet);
      }
    });
  }, [nowBar]);

  return (
    <>
      <div className={classes.root}>
        <Metronome />

        <RenderButtons presetData={presetData} />
      </div>
    </>
  );
}

export default LaunchPad;
