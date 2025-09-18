"use client";
import Fireworks from "@fireworks-js/react";
import React, { useRef, useState } from "react";
import Button from "../Button";
import Image from "next/image";
import { getAgeSuffix } from "@/utils";

const Age26 = () => {
  const [show, setShow] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const age = 26;

  const showOnClick = () => {
    setShow(true);
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full h-lvh items-center justify-around p-5 text-center">
      {!show && <div></div>}
      {show && <Fireworks className="h-full w-full absolute" />}
      <div className="flex items-center justify-center w-full">
        {show && (
          <h1 className="text-6xl font-bold font-mono">
            Happy {age + getAgeSuffix(age)} Birthday Chris 🎉
          </h1>
        )}

        {!show && <Button onClick={showOnClick} />}
      </div>
      <audio ref={audioRef}>
        <source src="/song.mp3" type="audio/mpeg" />
      </audio>
      {show && (
        <div className="flex items-center justify-center flex-col-reverse sm:flex-row">
          <Image width={200} height={200} src="/cat-kiss.gif" alt="cat" />
          <Image width={200} height={200} src="/yippie.gif" alt="cat" />
          <Image
            width={200}
            height={200}
            src="/metalCat.gif"
            alt="cat"
            className="w-2/3"
          />
        </div>
      )}
    </div>
  );
};

export default Age26;
