import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import  extractContent  from '../../utils/urlUtils.js';
import  CapitalizeChar  from '../../utils/capitalizeChar.js';
const convert = (base64String) => {
  return `data:image/jpeg;base64,${base64String}`;
};
const decodeBase64String = (encodedString) => {
  try {
    
    const fileNameWithoutExtension = removeFileExtension( decodeURIComponent(escape(atob(encodedString))));
    return fileNameWithoutExtension;
  } catch (error) {
    console.error("Error decoding Base64 string:", error);
    return null;
  }
};


const removeFileExtension = (fileName) => {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex !== -1) {
    return fileName.substring(0, lastDotIndex);
  }
  return fileName;
};


const ListLayout = ({ images }) => {
  const { t, i18n } = useTranslation();
  //#region Go To Analizer
  const navigate = useNavigate();
  const GoToAnalizer = (Imagesrc) => {
    navigate("/ImageTextExtractor", { state: { src: Imagesrc } });
  };
  const handleImageClick = (index, category, Url) => {
    if (category.split("/")[0] === "image") {
      navigate(`/image/${index}`);
    } else if (category.split("/")[0] === "video") {
      navigate("/Video", { state: { src: Url } });
    }
  };
  const GoToDocumentDetails = (Imagesrc) => {
    navigate("/DocumentDetails", { state: { src: Imagesrc } });
  };
  const GoToTextDetails = (Imagesrc) => {
    navigate("/TextDetails", { state: { src: Imagesrc } });
  };
  //#endregion

  return (
    <div className="row" >
      {images.map((image, index) => (
        <div key={index} className="col-12 col-sm-6 col-xs-2 col-md-3 mb-3">
          <article className="card2 col-12 ">
            <img
              className="card__background"
              src={convert(image.thumbnails)}
              alt="Photo of Cartagena's cathedral at the background and some colonial style houses"
              width="1920"
              height="2193"
            />
            <div className="card__content | flow">
              <div className="card__content--container | flow">
                <p className="card__title" style={{ color: "white" }}>
                  {extractContent(image.metadata_storage_path)}
                </p>
                <p style={{ color: "white" }}>
                  {image.metadata_content_type.split("/")[0] == "application"
                    ? "Pdf"
                    : CapitalizeChar(image.metadata_content_type.split("/")[0])}
                </p>
                <button
                  className="card__button"
                  onClick={() => {
                    if (image.metadata_content_type.split("/")[0] === "image") {
                      GoToAnalizer(image);
                    } else if (
                      image.metadata_content_type.split("/")[0] === "video"
                    ) {
                      handleImageClick(
                        image.metadata_storage_name,
                        image.metadata_content_type,
                        image
                      );
                    } else if (
                      image.metadata_content_type.split("/")[0] ===
                      "application"
                    ) {
                      GoToDocumentDetails(image);
                    } else if (
                      image.metadata_content_type.split("/")[0] === "text"
                    ) {
                      GoToTextDetails(image);
                    }
                  }}
                >
                  {t("view_details")}
                </button>
              </div>
            </div>
          </article>
        </div>
      ))}
    </div>
  );
};

export default ListLayout;
