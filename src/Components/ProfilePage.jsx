import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Image,
  Modal,
  Form,
} from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { UpdateUserAction } from "../store/loginAction";
import { showSuccessAlert, showErrorAlert } from "../utils/showSuccessAlert";
import { useTranslation } from "react-i18next";
import { decrypt,encrypt } from "../utils/EncryptionAndDecreption";
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [UserId, setuserID] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [roleId, setroleId] = useState("");
  const [genderId, setGenderId] = useState("");
  const [Reset, setResert] = useState("");
  const { t, i18n } = useTranslation();
  const [error, setError] = useState("");


  useEffect(() => {
    const userInfo = decrypt(localStorage.getItem("userInfo"));
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setuserID(parsedUser.id);
        setUser(parsedUser);
        setFirstName(parsedUser.firstName);
        setLastName(parsedUser.lastName);
        setEmail(parsedUser.username);
        setGenderId(parsedUser.genderId);
        setRole(parsedUser.roleId == 1 ? "Admin" : "Users");
        setroleId(parsedUser.roleId);
      } catch (error) {
        console.error("Error parsing userInfo JSON", error);
      }
    }
  }, [Reset]);

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (
      !firstName ||
      !lastName ||
      !email ||
      !role ||
      !genderId ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill out all fields.");
      return;
    }
    if (
      !passwordValidation.length ||
      !passwordValidation.lowercase ||
      !passwordValidation.number ||
      !passwordValidation.specialChar ||
      !passwordValidation.uppercase
    ) {
      setError("Passwords Format Not Correct");
      return;
    }

    try {
      const response = await UpdateUserAction(
        firstName,
        lastName,
        email,
        genderId,
        email,
        password,
        roleId,
        UserId
      );
      if (response.id === -1) {
        setError("Operation failed!");
      } else {
        setResert(response);
        showSuccessAlert("Update successful");
        localStorage.setItem("userInfo", encrypt(JSON.stringify(response)));
        setShowModal(false);
      }
    } catch (error) {
      showErrorAlert("Operation failed: " + error.message);
    }
  };
  const checkPassword = (password) => {
    return {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    };
  };

  const passwordValidation = checkPassword(password);

  return (
    <>
      {user && (
        <section
          className="d-flex align-items-center justify-content-center "
          style={{
            backgroundColor: "#f4f5f7",
            marginTop: "40px",
            overflow: "scroll",
          }}
        >
          <Container fluid>
            <Row>
              <Col className="mx-auto d-flex align-items-center">
                <Card className="w-100" style={{ borderRadius: ".5rem" }}>
                  <Row className="g-0">
                    <Col
                      md="4"
                      className="bg-primary text-white text-center"
                      style={{
                        borderTopLeftRadius: ".5rem",
                        borderBottomLeftRadius: ".5rem",
                        height: "700px",
                      }}
                    >
                      <Image
                        src={
                          user.genderId == 2
                            ? "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                            : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                        }
                        alt="Avatar"
                        className="my-5"
                        style={{ width: "80px" }}
                        roundedCircle
                        fluid
                      />
                      <CardTitle>{t("welcome")}</CardTitle>
                      <CardTitle>
                        {user.firstName} {user.lastName}
                      </CardTitle>
                      <CardText>
                      {t("role")}:{
                         user.roleId == 1 ? t("admin") : t("user")
                        }
                      </CardText>
                      <Button
                        variant="outline-light"
                        className="mb-5"
                        onClick={() => setShowModal(true)}
                      >
                        {t("changeProfile")}
                      </Button>
                    </Col>
                    <Col md="8">
                      <CardBody className="p-4">
                        <Card.Title>{t("information")}</Card.Title>
                        <hr className="mt-0 mb-4" />
                        <Row className="pt-1">
                          <Col xs="6" className="mb-3">
                            <Card.Title>{t("firstName")}</Card.Title>
                            <CardText className="text-muted">
                              {user.firstName}
                            </CardText>
                          </Col>
                          <Col xs="6" className="mb-3">
                            <Card.Title>{t("lastName")}</Card.Title>
                            <CardText className="text-muted">
                              {user.lastName}
                            </CardText>
                          </Col>
                        </Row>
                        <hr className="mt-0 mb-4" />
                        <Row className="pt-1">
                          <Col xs="6" className="mb-3">
                            <Card.Title>{t("email")}</Card.Title>
                            <CardText className="text-muted">
                              {user.username}
                            </CardText>
                          </Col>
                          <Col xs="6" className="mb-3">
                            <Card.Title>{t("gender")}</Card.Title>
                            <CardText className="text-muted">
                              {user.genderId == 1 ? t("male") : t("female")}
                            </CardText>
                          </Col>
                        </Row>
                        <hr className="mt-0 mb-4" />
                        <Row className="pt-1">
                          <Col xs="6" className="mb-3">
                            <Card.Title>{t("role")}</Card.Title>
                            <CardText className="text-muted">
                              {user.roleId == 1 ? t("admin") : t("user")}
                            </CardText>
                          </Col>
                        </Row>
                        <div className="d-flex justify-content-start">
                          <a href="#!" className="me-3">
                            <FaFacebookF size="1.5em" />
                          </a>
                          <a href="#!" className="me-3">
                            <FaTwitter size="1.5em" />
                          </a>
                          <a href="#!">
                            <FaInstagram size="1.5em" />
                          </a>
                        </div>
                      </CardBody>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Container>

          {/* Modal for editing user profile */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{t("editProfile")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && (
                <div className="alert alert-danger">
                 {error}
                </div>
              )}
              <Form>
                <Form.Group controlId="formFirstName">
                  <Form.Label>{t("firstName")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t("firstName")}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formLastName">
                  <Form.Label>{t("lastName")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t("lastName")}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formEmail">
                  <Form.Label>{t("email")}</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder={t("email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formPassword">
                  <Form.Label>{t("password")}</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder={t("password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formConfirmPassword">
                  <Form.Label>{t("confirmPassword")}</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder={t("confirmPassword")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {password !== confirmPassword && (
                    <Form.Text className="text-danger">
                      {t("passwordMismatch")}
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Text className="text-muted">
                  {t("passwordValidation.length")}
                  <br />
                  {t("passwordValidation.lowercase")}
                  <br />
                  {t("passwordValidation.uppercase")}
                  <br />
                  {t("passwordValidation.number")}
                  <br />
                  {t("passwordValidation.specialChar")}
                </Form.Text>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                {t("close")}
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                {t("saveChanges")}
              </Button>
            </Modal.Footer>
          </Modal>
        </section>
      )}
    </>
  );
};

export default ProfilePage;
