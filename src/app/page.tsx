"use client";
import Button from "@/components/Button";
import { Fireworks } from "@fireworks-js/react";
import { useEffect, useRef, useState } from "react";
export default function Home() {
  const [show, setShow] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // take year of birth and calculate age
  const yearOfBirth = 1998;
  const currentYear = new Date().getFullYear();
  const age = currentYear - yearOfBirth;

  // get the last digit of the age to determine the suffix
  const lastDigit = age % 10;
  let suffix = "";

  switch (lastDigit) {
    case 1:
      suffix = "st";
      break;
    case 2:
      suffix = "nd";
      break;
    case 3:
      suffix = "rd";
      break;
    default:
      suffix = "th";
  }

  useEffect(() => {
    // Autoplay the sound when the component is mounted
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, []);

  const showOnClick = () => {
    setShow(true);
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className="flex flex-col  gap-10 w-full h-screen items-center justify-around">
      {!show && <div></div>}
      {show && <Fireworks className="h-full w-full absolute" />}
      <div className="flex">
        {show && (
          <h1 className="text-4xl font-bold font-mono">
            Happy {age + suffix} Birthday Chris 🎉
          </h1>
        )}

        {!show && <Button onClick={showOnClick} />}
      </div>

      <audio ref={audioRef}>
        <source src="/song.mp3" type="audio/mpeg" />
      </audio>

      {show && (
        <div className="flex">
          <img src="/cat-kiss.gif" alt="cat" />
          <img src="/yippie.gif" alt="cat" />
        </div>
      )}
      <div className="text-white font-light">
        {new Date().getFullYear()} all rights reserved to Christiena Gamal
        Shehata
      </div>
    </div>
  );
}
