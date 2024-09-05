import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Browse from "../Components/Browse.tsx";
import logo from "../images/logo.png";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import Home from "./Home.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthEurope } from "@fortawesome/free-solid-svg-icons";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import ImageTextExtractor from "../Components/AnalizeComponenets/ImageTextExtractor.jsx";
import Video from "../Components/AnalizeComponenets/Video.jsx";
import DocumentDetails from "./AnalizeComponenets/DocumentDetails.jsx";
import TextDetails from "./AnalizeComponenets/TextDetails.jsx";
import { useTranslation } from "react-i18next";
import Login from "./Login.jsx";
import Users from "./Users.jsx";
import Roles from "./Roles.jsx";
import { useSelector } from "react-redux";
import { loginAction } from "../store/loginSlice.js";
import { useDispatch } from "react-redux";
import ProfilePage from "./ProfilePage.jsx";
import {decrypt} from  '../utils/EncryptionAndDecreption.js'
function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Nav.Link as={Link} to={to} className={isActive ? "active" : ""}>
      {children}
    </Nav.Link>
  );
}

export default function NavBar() {
  const dispatch = useDispatch();
  const [Role, setRole] = useState("");
  const { t, i18n } = useTranslation();
  const content = useSelector((state) => state.content.content);

  useEffect(() => {
    if (content && content?.content?.role) {
      setRole(content?.content?.role);
    }

    if (localStorage.getItem("UserRole")) {
      setRole(decrypt(localStorage.getItem("UserRole")));
    }
  }, [content]);

  useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const SignOutHandle = () => {
    localStorage.clear();
    dispatch(
      loginAction.setContent({
        content: null,
      })
    );
    window.location.replace("/");
  };

  return (
    <>
      <Router>
        <div className="row">
          <Navbar expand="lg" className="bg fixed-top navbar">
            <Container className="nav-content" fluid>
              <Navbar.Brand as={Link} to="/">
                <img
                  src={logo}
                  className="d-inline-block align-top"
                  alt="React Bootstrap logo"
                />
              </Navbar.Brand>

              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav
                  className="ms-auto"
                  style={{
                    textAlign: document.body.dir === "rtl" ? "left" : "right",
                  }}
                >
                  {Role !== "" && (Role === "admin" || Role === "users") ? (
                    <>
                      <NavLink className="nav-link" to="/Home">
                        {t("home")}
                      </NavLink>
                      <span className="navbar-span d-none d-lg-block"></span>
                      
                      {Role === "admin" && (
                        <>
                          <NavLink to="/Users">{t("users")}</NavLink>
                          <span className="navbar-span d-none d-lg-block"></span>

                          <NavLink to="/Roles">{t("role")}</NavLink>
                          <span className="navbar-span d-none d-lg-block"></span>
                        </>
                      )}
                    

                      <NavLink to="/browse">{t("browse")}</NavLink>
                      <span className="navbar-span d-none d-lg-block"></span>

                      <NavLink to="/Profile">{t("Profile")}</NavLink>
                      <span className="navbar-span d-none d-lg-block"></span>
                      <button className="sign-up" onClick={SignOutHandle}>
                        <FontAwesomeIcon icon={faRightToBracket} />
                      </button>
                      <span className="navbar-span d-none d-lg-block"></span>
                      <NavDropdown
                        className="me-3"
                        title={<FontAwesomeIcon icon={faEarthEurope} />}
                        id="basic-nav-dropdown-2"
                      >
                        <NavDropdown.Item onClick={() => changeLanguage("en")}>
                          English
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={() => changeLanguage("ar")}>
                          العربية
                        </NavDropdown.Item>
                      </NavDropdown>
                    </>
                  ) : null}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Container style={{ marginTop: "56px" }}>
            <Routes>
              {Role !== "" && (Role === "admin" || Role === "users") ? (
                <>
                  {Role === "admin" && (
                    <>
                      <Route path="/Users" element={<Users />} />
                      <Route path="/Roles" element={<Roles />} />
                    </>
                  )}
                  <Route path="/Home" element={<Home />} />
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/Video/" element={<Video />} />
                  <Route
                    path="/ImageTextExtractor"
                    element={<ImageTextExtractor />}
                  />
                  <Route
                    path="/DocumentDetails"
                    element={<DocumentDetails />}
                  />
                  <Route path="/TextDetails" element={<TextDetails />} />
                  

                  <Route path="/Profile" element={<ProfilePage />} />
                </>
              ) : (
                <Route path="/" element={<Login />} />
              )}
            </Routes>
          </Container>
        </div>
      </Router>
    </>
  );
}

// "homepage": "http://localhost/KnowledgeMining",
