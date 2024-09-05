import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import backgroundImage from "../images/HomBG.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const [searchString, setSearchString] = useState("");
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();
  const input = useRef()

  useEffect(() => {
    input.current.focus();
  }, []);
  const GoToBrowse = () => {
    navigate("/Browse", { state: { DatafroHome: searchString } });
  };
  const handleSearchSubmit = () => {
    if (searchString.length > 0) {
      GoToBrowse();
    }
  };
  const handleInputChange = (e) => {
    setSearchString(e.target.value);
  };
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 mt-4 test"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
      }}
    >
      <div className="col-10 col-md-6">
        <div
          className="search-container text-center"
          style={{ textAlign: isRTL ? "right" : "left" }}
        >
          <p className=" textGradient">
            {t("home-pagge-title")}

          </p>

          <div className="position-relative">
            <input
            ref={input}
              value={searchString}
              onChange={handleInputChange}
              type="text"
              className="form-control"
              placeholder={t("search_for_content")}
              style={{
                padding: isRTL ? "20px 40px 20px 20px" : "20px 20px 20px 40px",
                borderRadius: "15px",
                paddingRight: isRTL ? "40px" : "60px", 
              }}
            />
            <FontAwesomeIcon
              onClick={handleSearchSubmit}
              icon={faSearch}
              style={{
                color: "black",
                fontSize: "25px",
                position: "absolute",
                left: isRTL ? "15px" : "auto",
                right: isRTL ? "auto" : "15px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            />
          </div>
          <br />
          <br />
          <p
            style={{
              color: "#e1d6d6a6",
              marginTop: "10px",
              fontSize: "120%",
              lineHeight: "1.5",
              textAlign: "center",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
            }}
          >
            {t("discreption")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
