import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./Signup.css";
import { Auth } from "aws-amplify";

export default function Signup() {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
    name: "",
    familyName: "",
    birthDate: "",
    phoneNumber: "",
    address: "",
    gender: "",
  });
  const history = useHistory();
  const [newUser, setNewUser] = useState(null);
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword &&
      fields.name.length > 0 &&
      fields.familyName.length > 0 &&
      fields.address.length > 0 &&
      fields.phoneNumber.length > 0 && /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(fields.phoneNumber)
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
  
    setIsLoading(true);
  
    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
        attributes: {
          name: fields.name,
          family_name: fields.familyName,
          address: fields.address,          // optional
          phone_number: fields.phoneNumber,
          birthdate: fields.birthDate,
          gender: fields.gender,   // optional - E.164 number convention
      }
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  async function handleConfirmationSubmit(event) {
    event.preventDefault();
  
    setIsLoading(true);
  
    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);
  
      userHasAuthenticated(true);
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
          <HelpBlock>Please check your email for the code.</HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>
      </form>
    );
  }

  function renderForm() {
    return (
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </FormGroup>
        <FormGroup controlId="name" bsSize="large">
          <ControlLabel>First Name</ControlLabel>
          <FormControl
            autoFocus
            type="text"
            value={fields.name}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="familyName" bsSize="large">
          <ControlLabel>Family Name</ControlLabel>
          <FormControl
            autoFocus
            type="text"
            value={fields.familyName}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="address" bsSize="large">
          <ControlLabel>Address</ControlLabel>
          <FormControl
            autoFocus
            type="text"
            value={fields.address}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="phoneNumber" bsSize="large">
          <ControlLabel>Phone</ControlLabel>
          <FormControl
            autoFocus
            type="text"
            placeholder="+64XXXXXXXX"
            value={fields.phoneNumber}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="birthDate" bsSize="large">
          <ControlLabel>Birthdate</ControlLabel>
          <FormControl
            autoFocus
            type="text"
            value={fields.birthDate}
            placeholder="DD/MM/YYYYY"
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="gender" bsSize="large">
          <ControlLabel>Gender</ControlLabel>
          <FormControl
            autoFocus
            type="text"
            value={fields.gender}
            onChange={handleFieldChange}
          />
        </FormGroup>


        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Signup
        </LoaderButton>
      </form>
    );
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}