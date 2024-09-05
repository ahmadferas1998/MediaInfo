import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
export default function HeadrContent({icon,imageUrl}){
    const navigate = useNavigate();
    
  const handleGoBack = () => {
    navigate("/browse/");
  };
    const { t, i18n } = useTranslation();
    return (
        <div className="row gobackicon">
        <div className="col-md-2 " onClick={handleGoBack}>
          <FontAwesomeIcon icon={icon} /> {t("return_to_browse")}
        </div>
        <div className="col-md-8" style={{ textAlign: "center" }}>
          {imageUrl}
        </div>
        <div className="col-md-2"></div>
      </div>
    )
}