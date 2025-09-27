"use client";
import { useState } from "react";
import "@/components/scss/age27.scss";

const Age27 = () => {
  const [blown, setBlown] = useState(false);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="cake" onClick={() => setBlown(!blown)}>
        <div className="plate"></div>
        <div className="layer layer-bottom"></div>
        <div className="layer layer-middle"></div>
        <div className="layer layer-top"></div>
        <div className="icing"></div>
        <div className="drip drip1"></div>
        <div className="drip drip2"></div>
        <div className="drip drip3"></div>
        <div className="candle">
          {!blown && <div className="flame"></div>}
          {blown && <div className="smoke"></div>}
        </div>
      </div>
    </div>
  );
};

export default Age27;
