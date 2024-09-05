import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Table } from "react-bootstrap";
import { faceApiForUrl, FaceId, PersoneDetails } from "../Ui/FaceApi.jsx";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import LoadingComponent from "../Ui/LoadingComponent.jsx";
import extractContent from "../../utils/urlUtils.js";
import HeadrContent from "../Ui/HeadrContent.jsx";
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";
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

const faceRectangleStyle = (item) => {
  return {
    position: "absolute",
    top: `${item.faceRectangle.top}px`,
    left: `${item.faceRectangle.left}px`,
    width: `${item.faceRectangle.width}px`,
    height: `${item.faceRectangle.height}px`,
    border: "2px solid #BA0B93",
    textAlign: "center",
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
  };
};

const ImageTextExtractor = () => {
  //#region VARIABLE
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const icon = isRtl ? faArrowRight : faArrowLeft;
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const [data, setData] = useState([]);
  const [Personaldata, setPersonaldata] = useState([]);
  const [outputImage, setOutputImage] = useState(null);
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
  const [expanded, setExpanded] = React.useState("panel4");
  const location = useLocation();
  const { src } = location.state || {};
  const imageUrl = src;
  const navigate = useNavigate();

  //#endregion VARIABLE
  //#region FUNCTION
  const setSearchTermFunction = (value) => {
    const isValid = /^[a-zA-Z0-9\s\u0600-\u06FF]*$/.test(value);

    if (isValid) {
      setSearchTerm(value);
    }
  };
  if (imageUrl == undefined) {
    navigate("/");
  }
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
        canvas.width = image.width;
        canvas.height = image.height;

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(zoomLevel, zoomLevel);
        ctx.rotate(rotationAngle * (Math.PI / 180));
        ctx.translate(
          -canvas.width / 2 + panOffset.x,
          -canvas.height / 2 + panOffset.y
        );
        ctx.drawImage(image, 0, 0);

        if (searchTerm.trim() !== "") {
          const searchTerms = searchTerm
            .split(/\s+/)
            .filter((term) => term.trim() !== "");

          const matchingWords = result.pages.flatMap((page) =>
            page.words.filter((word) =>
              searchTerms.some((term) =>
                word.content.toLowerCase().includes(term.toLowerCase())
              )
            )
          );

          matchingWords.forEach((word) => {
            const polygon = word.polygon;
            if (polygon && polygon.length > 0) {
              ctx.beginPath();
              ctx.moveTo(polygon[0].x, polygon[0].y);

              for (let i = 1; i < polygon.length; i++) {
                ctx.lineTo(polygon[i].x, polygon[i].y);
              }

              ctx.closePath();
              ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
              ctx.fill();
              ctx.strokeStyle = "red";
              ctx.lineWidth = 2;
              ctx.stroke();

              // Draw a rectangle around the word
              const xMin = Math.min(...polygon.map((point) => point.x));
              const yMin = Math.min(...polygon.map((point) => point.y));
              const xMax = Math.max(...polygon.map((point) => point.x));
              const yMax = Math.max(...polygon.map((point) => point.y));

              ctx.strokeRect(xMin, yMin, xMax - xMin, yMax - yMin);
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
  const analyzeDocument = async () => {
    try {
      setLoading(true);
      const response = await axios.get(imageUrl?.metadata_storage_path, {
        responseType: "blob",
      });
      const imageBlob = response.data;
      const mimeType = imageBlob.type || "image/jpeg";
      const file = new File([imageBlob], "image." + mimeType.split("/")[1], {
        type: mimeType,
      });
      const formData = new FormData();
      formData.append("file", file);
      const endpoint = "https://kmhandwritten.cognitiveservices.azure.com/";
      const key = "2a872218ce864e36a654e655a0f179c9";
      const formUrl = imageUrl?.metadata_storage_path;
      try {
        const client = new DocumentAnalysisClient(
          endpoint,
          new AzureKeyCredential(key)
        );
        const poller = await client.beginAnalyzeDocument(
          "prebuilt-read",
          formUrl
        );
        const result = await poller.pollUntilDone();
        setResult(result);
        setError(null);
        setUpdateCanvas(true);
        setUploadedFiles([{ preview: URL.createObjectURL(file), file }]);
        setSelectedFileIndex(0);
      } catch (err) {
        setError(err);
      }
    } catch (error) {
      console.error("Error analyzing document:", error);
      setError("This image can't be analyzed");
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
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const handleKeyphraseClick = (phrase) => {
    setSearchTerm(phrase);
  };
  const handleSubmit = async () => {
    setPersonaldata([]);
    try {
      const response = await faceApiForUrl.post(`/face/v1.0/detect`, {
        url: imageUrl?.metadata_storage_path,
      });
      setData(response.data);
      const faceid = response.data.map((m) => {
        fetchData(m["faceId"]);
      });

      setOutputImage(imageUrl?.metadata_storage_path);
      setShowModal(true);
    } catch (err) {
      window.alert("No Results Found");
    }
  };
  const fetchData = async (id) => {
    if (id) {
      try {
        const result = await FaceId(id);
        fetchPersonDetails(result[0]["candidates"][0]["personId"]);
      } catch (error) {
        console.error("Error calling FaceId API:", error);
      }
    }
  };
  const fetchPersonDetails = async (id) => {
    if (id) {
      try {
        const result = await PersoneDetails(id);
        setPersonaldata((prevData) => [...prevData, result]);
      } catch (error) {
        console.error("Error calling PersoneDetails API:", error);
      }
    }
  };
  //#endregion FUNCTION

  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <div className="container-fluid" style={{ marginTop: "39px" }}>
          <HeadrContent
            icon={icon}
            imageUrl={extractContent(imageUrl?.metadata_storage_path)}
          />

          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  className="border"
                  style={{ width: "100%", height: "71vh" }}
                ></canvas>
              </div>
              <div className="mb-3 d-flex flex-wrap">
                <button
                  className="btn btn-secondary mr-2 mb-2"
                  onClick={zoomIn}
                >
                  {t("zoom_in")}
                </button>
                <button
                  className="btn btn-secondary mr-2 mb-2"
                  onClick={zoomOut}
                >
                  {t("zoom_out")}
                </button>
                <button
                  className="btn btn-secondary mr-2 mb-2"
                  onClick={copyToClipboard}
                >
                  {t("copy_analysis")}
                </button>
                {imageUrl?.FaceList.length > 0 && (
                  <button
                    className="btn btn-secondary mr-2 mb-2"
                    onClick={() => handleSubmit()}
                  >
                    {t("people")}
                  </button>
                )}
              </div>
            </div>

            <div className="col-md-4 mt-4 " style={{ height: "90vh" }}>
              <div className="mb-3 row align-items-center">
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t("search_for_words")}
                    value={searchTerm}
                    onChange={(e) => setSearchTermFunction(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ maxHeight: "67vh", overflowY: "auto" }}>
                {loading ? (
                  <div> {t("loading")} </div>
                ) : error ? (
                  <div className="text-danger">{error}</div>
                ) : result ? (
                  <div
                    style={{
                      direction: imageUrl?.language == "ar" ? "rtl" : "ltr",
                      padding: "10px",
                    }}
                  >
                    {result.paragraphs?.map((paragraph, index) => (
                      <p
                        key={index}
                        dangerouslySetInnerHTML={{
                          __html: highlightText(paragraph.content),
                        }}
                      ></p>
                    ))}
                  </div>
                ) : (
                  <div> {t("no_analysis_result")} </div>
                )}
              </div>
            </div>

            <div
              className="col-md-4 mt-4 "
              style={{ height: "80vh", overflowY: "scroll" }}
            >
              {imageUrl?.keyphrases.length > 0 && (
                <Accordion
                  expanded={expanded === "panel4"}
                  onChange={handleChange("panel4")}
                >
                  <AccordionSummary
                    aria-controls="panel3d-content"
                    id="panel3d-header"
                  >
                    <Typography>{t("keyphrases")}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <div>
                        {imageUrl?.keyphrases?.map((tag, index) => (
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
              )}
              {imageUrl?.language.length > 0 && (
                <Accordion
                  expanded={expanded === "panel1"}
                  onChange={handleChange("panel1")}
                >
                  <AccordionSummary
                    aria-controls="panel1d-content"
                    id="panel1d-header"
                  >
                    <Typography>{t("language_label")}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <ul>
                        <li>{imageUrl?.language}</li>
                      </ul>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )}
              {imageUrl?.imageTags.length > 0 && (
                <Accordion
                  expanded={expanded === "panel2"}
                  onChange={handleChange("panel2")}
                >
                  <AccordionSummary
                    aria-controls="panel2d-content"
                    id="panel2d-header"
                  >
                    <Typography>{t("image_tag")}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <ul>
                        {imageUrl?.imageTags?.map((tag, index) => (
                          <li key={index}>{tag}</li>
                        ))}
                      </ul>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )}
              {imageUrl?.FaceList.length > 0 && (
                <Accordion
                  expanded={expanded === "panel3"}
                  onChange={handleChange("panel3")}
                >
                  <AccordionSummary
                    aria-controls="panel3d-content"
                    id="panel3d-header"
                  >
                    <Typography>{t("people")}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <ul>
                        {imageUrl?.FaceList?.map((tag, index) => (
                          <li key={index}>{tag}</li>
                        ))}
                      </ul>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )}
              {imageUrl?.locations.length > 0 && (
                <Accordion
                  expanded={expanded === "panel5"}
                  onChange={handleChange("panel5")}
                >
                  <AccordionSummary
                    aria-controls="panel3d-content"
                    id="panel3d-header"
                  >
                    <Typography>{t("location")}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <ul>
                        {imageUrl?.locations?.map((tag, index) => (
                          <li key={index}>{tag}</li>
                        ))}
                      </ul>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )}
              {imageUrl?.organizations.length > 0 && (
                <Accordion
                  expanded={expanded === "panel6"}
                  onChange={handleChange("panel6")}
                >
                  <AccordionSummary
                    aria-controls="panel3d-content"
                    id="panel3d-header"
                  >
                    <Typography>{t("organizations")}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <ul>
                        {imageUrl?.organizations?.map((tag, index) => (
                          <li key={index}>{tag}</li>
                        ))}
                      </ul>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )}
              {imageUrl?.merged_content != " " > 0 && (
                <Accordion
                  expanded={expanded === "panel7"}
                  onChange={handleChange("panel7")}
                >
                  <AccordionSummary
                    aria-controls="panel3d-content"
                    id="panel3d-header"
                  >
                    <Typography>{t("original_text")}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <p>
                        {imageUrl?.merged_content &&
                          imageUrl?.merged_content.replace(/[{}]/g, "")}
                      </p>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )}
              {imageUrl?.merged_content != " " > 0 && (
                <Accordion
                  expanded={expanded === "panel8"}
                  onChange={handleChange("panel8")}
                >
                  <AccordionSummary
                    aria-controls="panel3d-content"
                    id="panel3d-header"
                  >
                    <Typography>{t("translated_text")}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <p>
                        {imageUrl?.merged_content &&
                          imageUrl?.Arabic_Translation.replace(/[{}]/g, "")}
                      </p>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )}
              <Accordion
                expanded={expanded === "panel9"}
                onChange={handleChange("panel9")}
              >
                <AccordionSummary
                  aria-controls="panel3d-content"
                  id="panel3d-header"
                >
                  <Typography>{t("image_details")}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="table-responsive">
                          <Table striped bordered hover>
                            <thead>
                              <tr>
                                <th>{t("property")}</th>
                                <th>{t("value")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td> {t("content_type")} </td>
                                <td>
                                  {imageUrl?.metadata_storage_content_type}
                                </td>
                              </tr>
                              <tr>
                                <td>{t("size")} </td>
                                <td>{imageUrl?.metadata_storage_size}</td>
                              </tr>
                              <tr>
                                <td>{t("name")}</td>
                                <td>
                                  {extractContent(
                                    imageUrl?.metadata_storage_path
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td>{t("file_extension")}</td>
                                <td>
                                  {imageUrl?.metadata_storage_file_extension}
                                </td>
                              </tr>
                              <tr>
                                <td>{t("content_type_metadata")}</td>
                                <td>{imageUrl?.metadata_content_type}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>

          <div>
            <Modal show={showModal} onHide={handleClose} fullscreen>
              {/* closeButton */}
              <Modal.Header>
                <Modal.Title>{t("person_details")} </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row">
                  <div className="col-md-6">
                    {outputImage ? (
                      <div style={{ position: "relative" }}>
                        <img src={outputImage} alt="output" />
                        {data &&
                          data.map((item) => (
                            <div
                              key={item.faceId}
                              style={faceRectangleStyle(item)}
                            ></div>
                          ))}
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead>
                          <tr>
                            <th>{t("name")}</th>
                            <th>{t("Position")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Personaldata?.length > 0 ? (
                            Personaldata.map((item, index) => (
                              <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.userData}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="2" className="text-center">
                                No data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  <td>{t("close")}</td>
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageTextExtractor;
