import React from "react";

const Sound = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="flex flex-col gap-10 font-bold text-5xl items-center justify-center">
      <h1>Press Me</h1>
      <button className="btn-class-name z-[1]" onClick={onClick}>
        <span className="back"></span>
        <span className="front"></span>
      </button>
    </div>
  );
};

export default Sound;
