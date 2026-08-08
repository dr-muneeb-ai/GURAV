import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex items-center gap-4 mb-5">

      <h2
        className="text-3xl sm:text-4xl tracking-wide"
        style={{ fontFamily: "'Prata', serif" }}
      >
        <span className="text-[#b9572c] mr-3"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {text1}
        </span>

        <span className="text-[#ffffff] font-semibold"style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {text2}
        </span>
      </h2>

    </div>
  );
};

export default Title;
