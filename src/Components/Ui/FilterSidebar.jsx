import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faCalendarDays,
  faList,
  faLanguage,
  faHashtag,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { motion } from "framer-motion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";
const FilterSidebar = ({
  searchString,
  handleInputChange,
  handleSearchSubmit,
  expanded,
  handleAccordionChange,
  ChangeFromDate,
  ChangeToDate,
  handleCategoryClick,
  filteredData,
  selectedCategory,
  CapitalizeChar,
  handleLanguageClick,
  filteredLanguageData,
  handleImagTagClick,
  filteredImageTag,
  handlePeopleClick,
  filteredPeople,
}
) => {
    const { t, i18n } = useTranslation();
  return (
    <div className="col-sm-2 left-side ">
      <div className="row" style={{ marginTop: "10px" }}>
        <div
          className="ui category search item"
          style={{ position: "relative" }}
        >
          <input
            color="#0d3e5b"
            className="prompt"
            type="text"
            placeholder={t("search_for_content")}
            name="searchTerm"
            value={searchString}
            onChange={handleInputChange}
            style={{ paddingRight: "3.5rem" }}
          />
          <button
            className="search-btn"
            type="submit"
            style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
            onClick={handleSearchSubmit}
          >
            <FontAwesomeIcon icon={faSearch} style={{ color: "#333" }} />
          </button>
        </div>
      </div>

      <div className="row">
        <Accordion
          className="Accordion"
          expanded={expanded === "panel1"}
          onChange={handleAccordionChange("panel1")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <div className="filter-panel">
              <FontAwesomeIcon icon={faCalendarDays} /> {t("date")}
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  onChange={ChangeFromDate}
                  label={i18n.language == "en-US" || i18n.language == "en" ? t("from") : ""}
                />
              </DemoContainer>
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  onChange={ChangeToDate}
                  label={i18n.language == "en-US" || i18n.language == "en"  ? t("to") : ""}
                />
              </DemoContainer>
            </LocalizationProvider>
          </AccordionDetails>
        </Accordion>

        <Accordion
          className="Accordion"
          expanded={expanded === "panel2"}
          onChange={handleAccordionChange("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <div className="filter-panel">
              <FontAwesomeIcon icon={faList} /> {t("category")}
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="row">
              <div
                className="col-md-8 CardFilter"
                onClick={() => handleCategoryClick("all")}
                style={{
                  cursor: "pointer",
                  margin: "10px",
                }}
              >
                <span className="white-text"> {t("all")}</span>
                {/* <span className="Count">
                          {new Set(DataToSerch?.map((item) => item)).size}
                        </span> */}
              </div>
            </div>
            {Object.keys(filteredData).map((category, index) => (
              <div className="row" key={index}>
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "#24abdf",
                  }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="col-md-8 CardFilter"
                  onClick={() => handleCategoryClick(category)}
                  style={{
                    cursor: "pointer",
                    margin: "10px",
                    backgroundColor:
                      selectedCategory === category ? "#24abdf" : "#0d3e5b",
                  }}
                >
                  <span className="white-text">{CapitalizeChar(category)}</span>
                  <span className="Count">{filteredData[category]}</span>
                </motion.div>
              </div>
            ))}
          </AccordionDetails>
        </Accordion>

        <Accordion
          className="Accordion"
          expanded={expanded === "panel3"}
          onChange={handleAccordionChange("panel3")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <div className="filter-panel">
              <FontAwesomeIcon icon={faLanguage} /> {t("language_label")}
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="row">
              <div
                className="col-md-8 CardFilter"
                onClick={() => handleLanguageClick("all")}
                style={{
                  cursor: "pointer",
                  margin: "10px",
                }}
              >
                <span className="white-text"> {t("all")}</span>
              </div>
            </div>
            {Object.keys(filteredLanguageData).map((category, index) => (
              <div className="row" key={index}>
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "#24abdf",
                  }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="col-md-8 CardFilter"
                  onClick={() => handleLanguageClick(category)}
                  style={{
                    cursor: "pointer",
                    margin: "10px",
                    backgroundColor:
                      selectedCategory === category ? "#24abdf" : "#0d3e5b",
                  }}
                >
                  <span className="white-text">{CapitalizeChar(category)}</span>
                  <span className="Count">
                    {filteredLanguageData[category]}
                  </span>
                </motion.div>
              </div>
            ))}
          </AccordionDetails>
        </Accordion>

        <Accordion
          className="Accordion"
          expanded={expanded === "panel4"}
          onChange={handleAccordionChange("panel4")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4-content"
            id="panel4-header"
          >
            <div className="filter-panel">
              <FontAwesomeIcon icon={faHashtag} /> {t("image_tag")}
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="row">
              <div
                className="col-md-8 CardFilter"
                onClick={() => handleImagTagClick("all")}
                style={{
                  cursor: "pointer",
                  margin: "10px",
                }}
              >
                <span className="white-text"> {t("all")}</span>
              </div>
            </div>
            {filteredImageTag?.map((category, index) => (
              <div className="row" key={index}>
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "#24abdf",
                  }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="col-md-8 CardFilter"
                  onClick={() => handleImagTagClick(category)}
                  style={{
                    cursor: "pointer",
                    margin: "10px",
                    backgroundColor:
                      selectedCategory === category ? "#24abdf" : "#0d3e5b",
                  }}
                >
                  <span className="white-text">{CapitalizeChar(category)}</span>
                </motion.div>
              </div>
            ))}
          </AccordionDetails>
        </Accordion>

        <Accordion
          className="Accordion"
          expanded={expanded === "panel5"}
          onChange={handleAccordionChange("panel5")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <div className="filter-panel">
              <FontAwesomeIcon icon={faUsers} /> {t("people")}
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="row">
              <div
                className="col-md-8 CardFilter"
                onClick={() => handlePeopleClick("all")}
                style={{
                  cursor: "pointer",
                  margin: "10px",
                }}
              >
                <span className="white-text"> {t("all")}</span>
              </div>
            </div>
            {Object.keys(filteredPeople).map((name, index) => (
              <div className="row" key={index}>
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "#24abdf",
                  }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="col-md-8 CardFilter"
                  onClick={() => handlePeopleClick(name)}
                  style={{
                    cursor: "pointer",
                    margin: "10px",
                    backgroundColor:
                      selectedCategory === name ? "#24abdf" : "#0d3e5b",
                  }}
                >
                  <span className="white-text">
                    {CapitalizeChar(name).replace(",", "")}
                  </span>
                </motion.div>
              </div>
            ))}
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};
export default FilterSidebar;
