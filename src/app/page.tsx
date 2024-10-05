"use client";
import { Fireworks } from "@fireworks-js/react";
export default function Home() {
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

  return (
    <div className="flex flex-col gap-10 w-full h-screen items-center justify-around">
      <div></div>
      <Fireworks className="h-full w-full absolute" draggable />
      <h1 className="text-4xl font-bold font-mono">
        Happy {age + suffix} Birthday Chris 🎉
      </h1>
      <div className="flex">
        <img src="/cat-kiss.gif" alt="cat" />
        <img src="/yippie.gif" alt="cat" />
      </div>
      <footer className="text-white -mb-7 font-light ">
        {new Date().getFullYear()} all rights reserved to Christiena Gamal
        Shehata
      </footer>
    </div>
  );
}
