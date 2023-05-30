import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

function ValoracionEstrellas({ valoracion }) {
  return (
    <div>
      {Array(5)
        .fill()
        .map((_, index) =>
          valoracion >= index + 1 ? (
            <AiFillStar
              style={{ color: "orange" }}
              key={index}
            />
          ) : (
            <AiOutlineStar
              style={{ color: "orange" }}
              key={index}
            />
          )
        )}
    </div>
  );
}

export default ValoracionEstrellas;
