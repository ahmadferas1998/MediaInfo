import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { FaPlay, FaVideo, FaFileAlt } from "react-icons/fa";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { useTranslation } from "react-i18next";
import { Table } from "react-bootstrap";
const PdfViewer = ({ pdfUrl }) => {
  return (
    <div style={{ height: "750px" }}>
      <Worker
        workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
      >
        <Viewer fileUrl={pdfUrl} />
      </Worker>
    </div>
  );
};

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const TextDetails = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const icon = isRtl ? faArrowRight : faArrowLeft;
  const [highlightedPhrase, setHighlightedPhrase] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const [updateCanvas, setUpdateCanvas] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const location = useLocation();
  const { src } = location.state || {};
  const imageUrl = src;

  useEffect(() => {
    const handleErrors = (message, source, lineno, colno, error) => {
      console.error(
        `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}`,
        error
      );
      window.location.reload();
    };

    window.onerror = handleErrors;
    return () => {
      window.onerror = null;
    };
  }, []);
  useEffect(() => {
    if (
      updateCanvas &&
      selectedFileIndex !== null &&
      result &&
      result.pages &&
      result.pages.length > 0
    ) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const image = new Image();
      image.src =
        uploadedFiles[selectedFileIndex]?.preview ||
        URL.createObjectURL(uploadedFiles[selectedFileIndex]);

      image.onload = () => {
        canvas.width = image.width * zoomLevel;
        canvas.height = image.height * zoomLevel;

        ctx.save();
        ctx.setTransform(zoomLevel, 0, 0, zoomLevel, panOffset.x, panOffset.y);
        ctx.rotate(rotationAngle * (Math.PI / 180));
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        if (searchTerm.trim() !== "") {
          const searchTerms = searchTerm
            .split(/\s+/)
            .filter((term) => term.trim() !== "");

          const matchingWords = result.pages?.flatMap((page) =>
            page.words.filter((word) =>
              searchTerms.some((term) =>
                word.content.toLowerCase().includes(term.toLowerCase())
              )
            )
          );

          matchingWords.forEach((word) => {
            const polygon = word.polygon;
            if (polygon && polygon.length > 0) {
              const adjustedPolygon = polygon?.map((coordinate, index) =>
                index % 2 === 0
                  ? coordinate * zoomLevel
                  : coordinate * zoomLevel
              );

              ctx.beginPath();
              ctx.moveTo(adjustedPolygon[0], adjustedPolygon[1]);

              for (let i = 2; i < adjustedPolygon.length; i += 2) {
                ctx.lineTo(adjustedPolygon[i], adjustedPolygon[i + 1]);
              }

              ctx.closePath();
              ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
              ctx.fill();
              ctx.strokeStyle = "red";
              ctx.lineWidth = 2;
              ctx.strokeRect(
                adjustedPolygon[0],
                adjustedPolygon[1],
                adjustedPolygon[2] - adjustedPolygon[0],
                adjustedPolygon[5] - adjustedPolygon[1]
              );
            }
          });
        }

        ctx.restore();
      };
    }
  }, [
    selectedFileIndex,
    uploadedFiles,
    panOffset,
    zoomLevel,
    rotationAngle,
    result,
    updateCanvas,
    searchTerm,
  ]);

  const handleMouseDown = (event) => {
    setPanStart({ x: event.clientX, y: event.clientY });
    setIsPanning(true);
  };
  const handleMouseMove = (event) => {
    if (!isPanning) return;
    const offsetX = event.clientX - panStart.x;
    const offsetY = event.clientY - panStart.y;
    setPanOffset((prevOffset) => ({
      x: prevOffset.x + offsetX,
      y: prevOffset.y + offsetY,
    }));
    setPanStart({ x: event.clientX, y: event.clientY });
  };
  const handleMouseUp = () => {
    setIsPanning(false);
  };
  const decodeBase64String = (encodedString) => {
    try {
      const encodedStringWithoutTrailingCharacter = encodedString.substring(
        0,
        encodedString.length - 1
      );
      const decodedBytes = atob(encodedStringWithoutTrailingCharacter);
      const result = decodeURIComponent(decodedBytes).replace("file", "");
      return result;
    } catch (error) {
      console.error("Error decoding Base64 string:", error);
      return null;
    }
  };
  const analyzeDocument = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        decodeBase64String(imageUrl.metadata_storage_path),
        { responseType: "blob" }
      );
      const imageBlob = response.data;
      const mimeType = imageBlob.type || "image/jpeg";
      const file = new File([imageBlob], "image." + mimeType.split("/")[1], {
        type: mimeType,
      });

      const formData = new FormData();
      formData.append("file", file);

      const analyzeResponse = await axios.post(
        "https://squareonehandtotext.azurewebsites.net/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = analyzeResponse.data;
      setResult(result);
      setError(null);
      setUpdateCanvas(true);

      setUploadedFiles([{ preview: URL.createObjectURL(file), file }]);
      setSelectedFileIndex(0);
    } catch (error) {
      console.error("Error analyzing document:", error);
      setError("An error occurred during analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    analyzeDocument();
  }, []);
  const copyToClipboard = () => {
    if (result) {
      const analysisText = result.paragraphs
        ?.map((paragraph) => paragraph.content)
        .join("\n");
      navigator.clipboard
        .writeText(analysisText)
        .then(() => alert("Analysis result copied to clipboard"))
        .catch((error) => console.error("Error copying to clipboard:", error));
    }
  };

  const highlightText = (content) => {
    if (searchTerm.trim() === "") {
      return content;
    }
    const searchTerms = searchTerm
      .split(/\s+/)
      .filter((term) => term.trim() !== "");
    const regex = new RegExp(`(${searchTerms.join("|")})`, "gi");
    return content.replace(regex, '<span class="highlighted">$1</span>');
  };

  const zoomIn = () => {
    setZoomLevel((prevZoom) => prevZoom + 0.1);
  };
  const zoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 0.1));
  };
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  const [expanded, setExpanded] = React.useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const handleKeyphraseClick = (phrase) => {
    setHighlightedPhrase(phrase);
  };
  const getHighlightedContent = () => {
    if (!highlightedPhrase) return imageUrl.content;
    const regex = new RegExp(`(${highlightedPhrase})`, "gi");
    return imageUrl.content.replace(regex, '<span class="highlight">$1</span>');
  };
  const convertToText = (base64String) => {
    try {
      let decodedString = atob(base64String);
      return decodedString;
    } catch (error) {
      console.error("Error decoding Base64:", error.message);
      return null; // or handle the error in another way as needed
    }
  };
  return (
    <>
      {loading ? (
         <div className="loading-container">
         <div className="loader-and-text">
           <div className="loader"></div>
           <h1 className="loading-text">Please Wait ... </h1>
         </div>
       </div>
      ) : (
        <div className="container-fluid" style={{ marginTop: "39px" }}>
          <div className="row gobackicon">
            <div className="col-md-2 " onClick={handleGoBack}>
              <FontAwesomeIcon icon={icon} /> {t("return_to_browse")}
            </div>
            <div className="col-md-8" style={{ textAlign: "center" }}>
              {" "}
              {convertToText(imageUrl.metadata_storage_name)}
            </div>
            <div className="col-md-2"></div>
          </div>
          <div className="row">
            <div
              className="col-md-6 mt-4"
              style={{ height: "90vh", overflowY: "scroll", padding: "10px" }}
            >
              <div className="mb-3 row align-items-center">
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for words"
                    value={highlightedPhrase}
                    onChange={(e) => setHighlightedPhrase(e.target.value)}
                  />
                </div>
              </div>
              <p
                dangerouslySetInnerHTML={{ __html: getHighlightedContent() }}
              />
            </div>

            <div
              className="col-md-6 mt-4 "
              style={{ height: "750px", overflowY: "scroll" }}
            >
              <div className="row" style={{ marginBottom: "20px" }}>
                <div className="col-auto">
                  <a
                    className="application-icon"
                    download={decodeBase64String(
                      imageUrl.metadata_storage_path
                    )}
                  >
                    <FaFileAlt size={40} />
                    <span>Click Here To Download File</span>
                  </a>
                </div>
              </div>
              <Accordion
                expanded={expanded === "panel4"}
                onChange={handleChange("panel4")}
              >
                <AccordionSummary
                  aria-controls="panel3d-content"
                  id="panel3d-header"
                >
                  <Typography>keyphrases</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <div>
                      {imageUrl.keyphrases?.map((tag, index) => (
                        <button
                          key={index}
                          onClick={() => handleKeyphraseClick(tag)}
                          className="keyphrase-button"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                >
                  <Typography>Language</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <ul>
                      <li>{imageUrl?.language}</li>
                    </ul>
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
              >
                <AccordionSummary
                  aria-controls="panel2d-content"
                  id="panel2d-header"
                >
                  <Typography>ImageTags</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <ul>
                      {imageUrl.imageTags?.map((tag, index) => (
                        <li key={index}>{tag}</li>
                      ))}
                    </ul>
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel3"}
                onChange={handleChange("panel3")}
              >
                <AccordionSummary
                  aria-controls="panel3d-content"
                  id="panel3d-header"
                >
                  <Typography>people</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <ul>
                      {imageUrl.people?.map((tag, index) => (
                        <li key={index}>{tag}</li>
                      ))}
                    </ul>
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel5"}
                onChange={handleChange("panel5")}
              >
                <AccordionSummary
                  aria-controls="panel3d-content"
                  id="panel3d-header"
                >
                  <Typography>Location</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <ul>
                      {imageUrl.locations?.map((tag, index) => (
                        <li key={index}>{tag}</li>
                      ))}
                    </ul>
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel6"}
                onChange={handleChange("panel6")}
              >
                <AccordionSummary
                  aria-controls="panel3d-content"
                  id="panel3d-header"
                >
                  <Typography>Rganizations</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <ul>
                      {imageUrl.organizations?.map((tag, index) => (
                        <li key={index}>{tag}</li>
                      ))}
                    </ul>
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel7"}
                onChange={handleChange("panel7")}
              >
                <AccordionSummary
                  aria-controls="panel3d-content"
                  id="panel3d-header"
                >
                  <Typography>Orginal Text</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <p>
                      {imageUrl.merged_content &&
                        imageUrl.merged_content.replace(/[{}]/g, "")}
                    </p>
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel8"}
                onChange={handleChange("panel8")}
              >
                <AccordionSummary
                  aria-controls="panel3d-content"
                  id="panel3d-header"
                >
                  <Typography>Translated Text</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <p>
                      {imageUrl.translated_text &&
                        imageUrl.translated_text.replace(/[{}]/g, "")}
                    </p>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TextDetails;
