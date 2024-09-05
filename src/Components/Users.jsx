import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { Modal, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import {
  GetAllUsers,
  SignUpAction,
  UpdateUserAction,
  DeleteUser,
} from "../store/loginAction.js";
import { useTranslation } from "react-i18next";
import { showSuccessAlert,showErrorAlert,showDeleteConfirmation } from '../utils/showSuccessAlert';
export default function Users() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [genderId, setGenderId] = useState("");
  const [gender, setgender] = useState("");
  const [roles, setRoles] = useState([]);
  const [genders, setGenders] = useState([]);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [genderIdError, setGenderIdError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { t } = useTranslation();

  const fetchUsers = async () => {
    try {
      const response = await GetAllUsers();
      if (Array.isArray(response)) {
        const mappedData = response.map((user) => ({
          id: user.id,
          Email: user.username,
          Password: user.password,
          RoleNameEn: user.roleNameEn,
          RoleNameAr: user.roleNameAr,
          firstName: user.firstName,
          lastName: user.lastName,
          genderId: user.genderId ,
          gender: user.genderId == 1 ?"Mail":"Fmail",
          creationDate: user.creationDate,
          roleID: user.roleID,
        }));
        setRows(mappedData);
        setError(null);
      } else {
        setError("Unexpected response format");
      }
    } catch (error) {
      setError("Failed to fetch users: " + error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setRoles([
      { id: 1, name: "Admin" },
      { id: 2, name: "User" },
    ]);

    setGenders([
      { id: 1, name: "Male" },
      { id: 2, name: "Female" },
    ]);
  }, []);

  const handleUpdate = async (user) => {
    setEmail(user.Email);
    setPassword(user.Password);
    setRole(user.roleID);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setGenderId(user.genderId);
    setSelectedUserId(user.id);
    setEditMode(true);
    setShowModal(true);
  };

  const AddNewUser = () => {
    setEmail("");
    setPassword("");
    setRole("");
    setFirstName("");
    setLastName("");
    setGenderId("");
    setSelectedUserId(null);
    setEditMode(false);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (id) {
      try {
        await DeleteUser(id);
        setError("Delete successful");
        setShowModal(false);
        await fetchUsers();
      } catch (error) {
        setError("Delete failed: " + error.message);
      }
    }
  };

  const handleDeleteClick = (id) => {
    showDeleteConfirmation(() => handleDelete(id));
  };

  const validateForm = () => {
    let isValid = true;

    setEmailError("");
    setPasswordError("");
    setRoleError("");
    setFirstNameError("");
    setLastNameError("");
    setGenderIdError("");

    if (!email) {
      setEmailError(t("email_required"));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t("invalid_email"));
      isValid = false;
    }

    if (!password) {
      setPasswordError(t("password_required"));
      isValid = false;
    }

    if (!role) {
      setRoleError(t("role_required"));
      isValid = false;
    }

    if (!firstName) {
      setFirstNameError(t("first_name_required"));
      isValid = false;
    }

    if (!lastName) {
      setLastNameError(t("last_name_required"));
      isValid = false;
    }

    if (!genderId) {
      setGenderIdError(t("gender_required"));
      isValid = false;
    }
    if (
      !passwordValidation.length ||
      !passwordValidation.lowercase ||
      !passwordValidation.number ||
      !passwordValidation.specialChar ||
      !passwordValidation.uppercase
    ) {
      setError("Password Format Not Correct");
      isValid = false;
    }
    return isValid;
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

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        if (editMode) {
          const result =await UpdateUserAction(
            firstName,
            lastName,
            email,
            genderId,
            email,
            password,
            role,
            selectedUserId
          );
          if(!result  || result.id==-1){
            showErrorAlert('faild');
          }
          else{
            showSuccessAlert('Update successful');
            setShowModal(false);
          }
         
        } else {
          const response = await SignUpAction(
            firstName,
            lastName,
            email,
            genderId,
            email,
            password,
            role
          );
          if (response.id === -1) {
            setError("Username Already Exists");
            return;
          } else {
            localStorage.setItem('userInfo', JSON.stringify(response));
            showSuccessAlert('Add successful');
            setEmail("");
            setPassword("");
            setRole("");
            setFirstName("");
            setLastName("");
            setGenderId("");
            setShowModal(false);
          }
        }
        await fetchUsers();
      } catch (error) {
        setError("Operation failed: " + error.message);
      }
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 ,headerAlign: 'center', align: 'center'},
    { field: "Email", headerName: t("email"), flex: 1 ,headerAlign: 'center', align: 'center'},
    { field: "Password", headerName: t("password"), flex: 1  ,headerAlign: 'center', align: 'center'},
    { field: "firstName", headerName: t("first_name"), flex: 1  ,headerAlign: 'center', align: 'center'},
    { field: "lastName", headerName: t("last_name"), flex: 1  ,headerAlign: 'center', align: 'center'},
    { field: "RoleNameEn", headerName: t("roleNameEn"), flex: 1  ,headerAlign: 'center', align: 'center'},
    { field: "RoleNameAr", headerName: t("roleNameAr"), flex: 1  ,headerAlign: 'center', align: 'center'},
    { field: "gender", headerName: t("gender"), flex: 1  ,headerAlign: 'center', align: 'center'},

    {
      field: "action",
      headerName: t("Action"),
      flex: 1,headerAlign: 'center', align: 'center',
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginRight: 16 }}
            onClick={() => handleUpdate(params.row)}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        padding: "1rem",
        paddingTop: "5rem",
      }}
    >
      <div className="row">
        <div className="UsersCard">{t("users")}</div>
      </div>
      <div className="row" style={{ justifyContent: "flex-end" }}>
        <Button
          style={{
            width: "200px",
            margin: "20px",
            textAlign: "center",
          }}
          variant="contained"
          color="primary"
          size="large"
          onClick={AddNewUser}
        >
          {t("add_user")}
        </Button>
      </div>

      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
      />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>{t(editMode ? "edit_user" : "add_user")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEmail">
              <Form.Label>{t("email")}</Form.Label>
              <Form.Control
                type="email"
                placeholder={t("enter_email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!emailError}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>{t("password")}</Form.Label>
              <Form.Control
                type="password"
                placeholder={t("enter_password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!passwordError}
                required
              />
            </Form.Group>
            <Form.Group controlId="formFirstName">
              <Form.Label>{t("firstName")}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t("firstName")}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                isInvalid={!!firstNameError}
                required
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>{t("lastName")}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t("lastName")}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                isInvalid={!!lastNameError}
                required
              />
            </Form.Group>
            <Form.Group controlId="formRole">
              <Form.Label>{t("role")}</Form.Label>
              <Form.Control
                as="select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                isInvalid={!!roleError}
              >
                <option value="">{t("select_role")}</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formGenderId">
              <Form.Label>{t("gender")}</Form.Label>
              <Form.Control
                as="select"
                value={genderId}
                onChange={(e) => setGenderId(e.target.value)}
                isInvalid={!!genderIdError}
              >
                <option value="">{t("gender")}</option>
                {genders.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
          <div className="row p-1 m-1" style={{color:"red"}}>{error}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t("close")}
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {t(editMode ? "update" : "saveChanges")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
