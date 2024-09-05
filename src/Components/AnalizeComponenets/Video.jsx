import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from "react-i18next";
import  extractContent  from '../../utils/urlUtils.js';
import HeadrContent from "../Ui/HeadrContent.jsx";


export default function Video() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar'; 
  const icon = isRtl ? faArrowRight : faArrowLeft;
  const location = useLocation();
  const navigate = useNavigate();
  const { src } = location.state || {};
  const imageUrl = src;
  if (imageUrl == undefined) {
    navigate("/");
  }
  const [accessToken, SetaccessToken] = useState();
  const [VideoId, SetVideoId] = useState();

  useEffect(() => {
    const convertUrl = imageUrl?.metadata_storage_path;
    const NewUrl = `${convertUrl}?comp=metadata`;
    const fetchMetadata = async () => {
      try {
        const response = await axios.get(NewUrl);

        SetVideoId(response.headers["x-ms-meta-videoid"]);
        fetchData(response.headers["x-ms-meta-videoid"]);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };

    fetchMetadata();
  }, []);

  const fetchData = async (VideoId) => {
    const myHeaders = new Headers();
    myHeaders.append(
      "Ocp-Apim-Subscription-Key",
      "fe395e76282441fe95b1923dde8ed85a"
    );

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `https://api.videoindexer.ai/Auth/trial/Accounts/f4b05be9-51c7-4981-ae72-5819f32deb7e/Videos/${VideoId}/AccessToken?allowEdit=true`,
        requestOptions
      );
      const result = await response.text();
      const token = result.replace(/"/g, "");
      SetaccessToken(token);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Container fluid className="Container">
      <HeadrContent icon={icon} imageUrl={extractContent(imageUrl?.metadata_storage_path)}/>
        <div
          className="row"
          style={{ marginBottom: "10px"}}
        ></div>
        <div className="row">
          <div className="col-md-6" style={{ height: "79vh" }}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.videoindexer.ai/embed/player/f4b05be9-51c7-4981-ae72-5819f32deb7e/${VideoId}/?accessToken=${accessToken}&locale=en&location=trial`}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
          <div className="col-md-6" style={{ height: "79vh" }}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.videoindexer.ai/embed/insights/f4b05be9-51c7-4981-ae72-5819f32deb7e/${VideoId}/?accessToken=${accessToken}&locale=en&location=trial`}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </Container>
    </>
  );
}
// src="https://www.videoindexer.ai/embed/player/00000000-0000-0000-0000-000000000000/070c057761/?&locale=en"
// src="https://www.videoindexer.ai/embed/insights/00000000-0000-0000-0000-000000000000/070c057761/?&locale=en"
