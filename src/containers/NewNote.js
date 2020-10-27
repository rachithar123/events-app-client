import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import "react-datepicker/dist/react-datepicker.css";
import config from "../config";
import "./NewNote.css";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";

export default function NewNote() {
  const file = useRef(null);
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateAndTime, setDateAndTime] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return description.length > 0;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }
  async function handleSubmit(event) {
    event.preventDefault();
  
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }
  
    setIsLoading(true);
  
    try {
      const attachment = file.current ? await s3Upload(file.current) : null;
  
      await createNote({ title, description, dateAndTime, location, attachment});
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  function createNote(event) {
    return API.post("events", "/events", {
      body: event
    });
  }

  return (
    <div className="NewNote">
      <div><h3>Create Event</h3><br/></div>
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="title" bsSize="large">
          <ControlLabel>Event Title</ControlLabel>
          <FormControl
            autoFocus
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)} 
          />
        </FormGroup>
        <FormGroup controlId="content">
          <ControlLabel>Event Description</ControlLabel>
          <FormControl
            value={description}
            componentClass="textarea"
            onChange={e => setDescription(e.target.value)}
          />
        </FormGroup>
        {/* <FormGroup controlId="content">
          <ControlLabel>Event Description</ControlLabel>
          <DatePicker 
                showTimeSelect  
                selected={dateAndTime}
                value={dateAndTime} 
                onChange={e => setDateAndTime(e.target.value)} 
        /> */}

        <FormGroup controlId="dataAndTime" bsSize="large">
          <ControlLabel>Date and Time</ControlLabel>
          <FormControl
            autoFocus
            type="text"
            value={dateAndTime}
            placeholder="DD/MM/YYYYY HH:MM"
            onChange={e => setDateAndTime(e.target.value)} 
          />
        </FormGroup>
        <FormGroup controlId="location" bsSize="large">
          <ControlLabel>Event Location</ControlLabel>
          <FormControl
            autoFocus
            type="text"
            value={location}
            placeholder="Event location or Online event link"
            onChange={e => setLocation(e.target.value)} 
          />
        </FormGroup>
        <FormGroup controlId="file">
          <ControlLabel>Event Picture</ControlLabel>
          <FormControl onChange={handleFileChange} type="file" />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </form>
    </div>
  );
}