import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { useTranslation } from "react-i18next";
import { Table } from "react-bootstrap";
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";
import HeadrContent from "../Ui/HeadrContent.jsx";
import LoadingComponent from "../Ui/LoadingComponent.jsx";
import  extractContent  from '../../utils/urlUtils.js';
const PdfViewer = ({ pdfUrl }) => {
  return (
    <div style={{ height: "750px", overflow: "scroll" }}>
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

const DocumentDetails = () => {
  //#region VARIABLE
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const icon = isRtl ? faArrowRight : faArrowLeft;
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = React.useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { src } = location.state || {};
  const imageUrl = src;
  //#endregion VARIABLE

  //#region FUNCTION
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

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const handleKeyphraseClick = (phrase) => {
    setSearchTerm(phrase);
  };

  //#endregion FUNCTION
  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <div className="container-fluid" style={{ marginTop: "39px" }}>
           <HeadrContent icon={icon} imageUrl={extractContent(imageUrl?.metadata_storage_path)} />
          <div className="row">
            <div className="col-md-4 mt-4">
              <PdfViewer pdfUrl={imageUrl?.metadata_storage_path} />
            </div>
            <div className="col-md-4 mt-4 ">
              <div className="mb-3 row align-items-center">
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t("search_for_words")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div
                className="analysis-result"
                style={{ maxHeight: "80vh", overflowY: "auto" }}
              >
                {loading ? (
                  <div>Loading...</div>
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
                  <div>No analysis result</div>
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
              {imageUrl?.people.length > 0 && (
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
                        {imageUrl?.people?.map((tag, index) => (
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
              {/* {imageUrl?.merged_content != " " > 0 && (
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
              )} */}
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
                          imageUrl?.translated_text.replace(/[{}]/g, "")}
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
        </div>
      )}
    </>
  );
};
export default DocumentDetails;
