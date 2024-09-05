import NavDropdown from "react-bootstrap/NavDropdown";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Row, Col, Image } from "react-bootstrap";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  faSearch,
  faCalendarDays,
  faList,
  faLanguage,
  faHashtag,
  faFilter,
  faBars,
  faMap,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import ListLayout from "./Ui/ListLayout.jsx";
import LoadingComponent from "./Ui/LoadingComponent.jsx";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { GetData, GetDataSearch } from "../ApiServices/Api.tsx";
import { format, fromUnixTime } from "date-fns";
import Maps from "./Ui/Maps.jsx";
import { useTranslation } from "react-i18next";
import CapitalizeChar from "../utils/capitalizeChar.js";
import FormatDate from "../utils/formatDate.js";
import FilterSidebar from "./Ui/FilterSidebar.jsx";
export default function Browse() {
  type categoryCounts = { [key: string]: number };
  //#region VARIABLE

  const location = useLocation();
  const { DatafroHome } = location.state || {};
  var DataToBrowse = DatafroHome;
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState("panel1");
  const [Loading, setLoading] = useState(true);
  const [newData, setNewData] = useState<any>(undefined);
  const [DataToSerch, setDataToSerch] = useState<any>();
  const [error, setError] = useState<Error | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : true);
  };
  const [filteredData, setFilteredData] = useState<categoryCounts>({});
  const [filteredLanguageData, setfilteredLanguageData] =
    useState<categoryCounts>({});
  const [filteredPeople, setfilteredPeople] = useState<categoryCounts>({});
  const [filteredImageTag, setfilteredImageTag] = useState<any>();
  const [showCol, setShowCol] = useState(false);
  const [colSize, setColSize] = useState("col-md-10");
  const [searchString, setSearchString] = useState("");
  const [Layout, setLayout] = useState("listView");
  const [ToDate, setToDate] = useState(null);
  const [FromDate, setFromDate] = useState();
  //#endregion VARIABLE
  //#region FUNCTION
  useEffect(() => {
    setLoading(false);
    const fetchData = async () => {
      if (DataToBrowse) {
        setSearchString(DataToBrowse);
        const a = expanded;
        try {
          const result: any = await GetDataSearch(DataToBrowse);
          if (result) {
            setNewData(result.value);
            setDataToSerch(result.value);
            CatFilter(result.value);
            CatFilterLanguage(result.value);
            FilterPeople(result.value);
            ImageTagFilter(result.value);
            setLoading(true);
          }
        } catch (error) {
          setError(error as Error);
        }
        setExpanded(expanded);
      } else {
        if (!searchString) {
          try {
            const result: any = await GetData();
            if (result) {
              setNewData(result.value);
              setDataToSerch(result.value);
              CatFilter(result.value);
              FilterPeople(result.value);
              CatFilterLanguage(result.value);
              ImageTagFilter(result.value);
              setLoading(true);
            }
          } catch (error) {
            setError(error as Error);
          }
        }
      }
    };

    fetchData();
  }, []);
  const CatFilter = (data) => {
    if (data && Array.isArray(data)) {
      const contentTypeCounts: categoryCounts = data.reduce(
        (acc: categoryCounts, item) => {
          const contentType = item.metadata_content_type.split("/")[0];
          acc[contentType] = acc[contentType] ? acc[contentType] + 1 : 1;
          return acc;
        },
        {} as categoryCounts
      );
      setFilteredData(contentTypeCounts);
    } else {
      setFilteredData({} as categoryCounts);
    }
  };
  const CatFilterLanguage = (data) => {
    if (data && Array.isArray(data)) {
      const contentTypeCounts = data.reduce((acc, item) => {
        const contentType = item.language;
        if (contentType) {
          acc[contentType] = acc[contentType] ? acc[contentType] + 1 : 1;
        }
        return acc;
      }, {});
      setfilteredLanguageData(contentTypeCounts);
    } else {
      setfilteredLanguageData({});
    }
  };
  const FilterPeople = (data) => {
    if (data && Array.isArray(data)) {
      const contentTypeCounts = data.reduce((acc, item) => {
        const contentType = item.FaceList;
        if (
          contentType &&
          Array.isArray(contentType) &&
          contentType.length > 0
        ) {
          contentType.forEach((name) => {
            if (name) {
              acc[name] = acc[name] ? acc[name] + 1 : 1;
            }
          });
        }
        return acc;
      }, {});
      setfilteredPeople(contentTypeCounts);
    } else {
      setfilteredPeople({});
    }
  };
  const handleCategoryClick = (Category) => {
    setSelectedCategory(Category);
    const originalData: any = DataToSerch;
    if (Category == "all") {
      setNewData(originalData);
      return;
    }

    if (newData && Array.isArray(originalData)) {
      const result: any =
        originalData?.filter(
          (item) => item.metadata_content_type.split("/")[0] === Category
        ) || [];
      setNewData(result);
    }
  };
  const ImageTagFilter = (data: any[]) => {
    if (data && Array.isArray(data)) {
      const uniqueTags = new Set<string>();

      data.forEach((item) => {
        if (Array.isArray(item.imageTags) && item.imageTags.length > 0) {
          uniqueTags.add(item.imageTags[0]);
        }
      });

      const t: any = Array.from(uniqueTags);
      setfilteredImageTag(t);
    } else {
      setfilteredImageTag({});
    }
  };
  const handleLanguageClick = (Category) => {
    setSelectedCategory(Category);
    const originalData = DataToSerch;
    if (Category == "all") {
      setNewData(originalData);
      return;
    }

    if (newData && Array.isArray(originalData)) {
      const result: any =
        originalData?.filter((item) => item.language === Category) || [];
      setNewData(result);
    }
  };
  const handlePeopleClick = (name) => {
    setSelectedCategory(name);
    const originalData = DataToSerch;
    if (name == "all") {
      setNewData(originalData);
      return;
    }

    if (newData && Array.isArray(originalData)) {
      const result: any = originalData?.filter((item) =>
        item.FaceList.includes(name)
      );
      setNewData(result);
    }
  };
  const handleImagTagClick = (Category: any) => {
    setSelectedCategory(Category);
    const originalData = DataToSerch;

    if (Category === "all") {
      setNewData(originalData);
      return;
    }

    if (originalData && Array.isArray(originalData)) {
      const result: any = originalData.filter((item) =>
        item.imageTags.includes(Category)
      );
      setNewData(result);
    }
  };
  const ChangeFromDate = (date) => {
    const dateObj = new Date(date);
    const ToDate: any = FormatDate(dateObj);
    setFromDate(ToDate);
  };
  const ChangeToDate = (date) => {
    const dateObj = new Date(date);
    const ToDate: any = FormatDate(dateObj);
    const fromDate: any = FromDate;
    const filteredData = DataToSerch.filter((item) => {
    const dateObj2 = new Date(item.metadata_storage_last_modified);
    const itemDate: any = FormatDate(dateObj2);
      return fromDate <= itemDate && itemDate <= ToDate;
    });

    setNewData(filteredData);
  };
  const handleSelect = (eventKey) => {
    setLayout(eventKey);
  };
  const handleFilterClick = () => {
    setShowCol(!showCol);
    setColSize(showCol ? "col-md-12" : "col-md-10");
  };
  const handleSearchSubmit = async (e) => {
    const a = expanded;

    setLoading(false);
    try {
      const result: any = await GetDataSearch(searchString);
      if (result) {
        setNewData(result.value);
        setDataToSerch(result.value);
        CatFilter(result.value);
        CatFilterLanguage(result.value);
        FilterPeople(result.value);
        ImageTagFilter(result.value);
        setLoading(true);
      }
    } catch (error) {
      setError(error as Error);
    }
    setExpanded(expanded);
  };
  const handleInputChange = (e) => {
    setSearchString(e.target.value);
  };
  //#endregion FUNCTION
  return (
    <>
      <Container fluid className="Container">
        <div className="row">
          {showCol ? (
         <FilterSidebar
         searchString={searchString}
         handleInputChange={handleInputChange}
         handleSearchSubmit={handleSearchSubmit}
         expanded={expanded}
         handleAccordionChange={handleAccordionChange}
         ChangeFromDate={ChangeFromDate}
         ChangeToDate={ChangeToDate}
         handleCategoryClick={handleCategoryClick}
         filteredData={filteredData}
         selectedCategory={selectedCategory}
         CapitalizeChar={CapitalizeChar}
         handleLanguageClick={handleLanguageClick}
         filteredLanguageData={filteredLanguageData}
         handleImagTagClick={handleImagTagClick}
         filteredImageTag={filteredImageTag}
         handlePeopleClick={handlePeopleClick}
         filteredPeople={filteredPeople}
     
      
       />
          ) : null}

          <div
            className={`col-sm-${showCol ? "10" : "12"}`}
            style={{ padding: "0px" }}
          >
            <div className="sticky-div">
              <FontAwesomeIcon
                className="custom-icon"
                icon={faFilter}
                onClick={handleFilterClick}
              />
              <div
                className="result-text"
                style={{ display: "flex", alignItems: "center" }}
              >
                <p style={{ color: "#082e4c", margin: "0 0 0 10px" }}>
                  {" "}
                  {t("result")}
                </p>
                <p style={{ color: "#082e4c", margin: "0 0 0 10px" }}>
                  {new Set(newData?.map((item) => item)).size}/
                  {new Set(DataToSerch?.map((item) => item)).size}
                </p>
                <p style={{ color: "#082e4c", margin: "0 0 0 10px" }}>
                  {" "}
                  {t("total")}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  gap: "10px",
                  marginRight: "10px",
                }}
              >
                <NavDropdown
                  className="layout"
                  title={<FontAwesomeIcon icon={faBars} />}
                  id="basic-nav-dropdown-2"
                  onSelect={handleSelect}
                >
                  <NavDropdown.Item eventKey="layout">
                    {" "}
                    {t("layout")}{" "}
                  </NavDropdown.Item>
                  <hr />

                  <NavDropdown.Item eventKey="Map">
                    <FontAwesomeIcon icon={faMap} /> {t("map_view")}
                  </NavDropdown.Item>

                  <NavDropdown.Item eventKey="listView">
                    <FontAwesomeIcon icon={faList} /> {t("list_view")}
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            </div>

            <div className="card-container">
              {newData && newData.length === 0 ? (
                <div style={{ textAlign: "center" }}>No Data Result</div>
              ) : Loading && newData !== undefined && newData !== null ? (
                Layout === "gridView" ? (
                  <ListLayout images={newData} />
                ) : Layout === "Map" ? (
                  <Maps Data2={newData} />
                ) : Layout === "listView" ? (
                  <ListLayout images={newData} />
                ) : (
                  <></>
                )
              ) : (
                <LoadingComponent />
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
