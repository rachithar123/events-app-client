import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Events.css";
import { s3Upload } from "../libs/awsLib";

export default function Events() {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [event, setEvent] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateAndTime, setDateAndTime] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadEvent() {
      console.log("########### - ID: "+ id);
      return API.get("events", `/events/${id}`);
    }

    async function onLoad() {
      try {
        const event = await loadEvent();
        console.log(event);
        const { title, description, dateAndTime, address, attachment } = event;
        console.log("KDDFKDFJKFJK"+title);

        if (attachment) {
          event.attachmentURL = await Storage.get(attachment);
        }
        setTitle(title);
        setDescription(description);
        setDateAndTime(dateAndTime);
        setAddress(address);
        setEvent(event);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm() {
    return  description.length > 0 && 
            title.length > 0 &&
            dateAndTime.length > 0 &&
            address.length > 0 ;
  }
  
  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  
  function handleFileChange(event) {
    file.current = event.target.files[0];
  }
  
function saveEvent(event) {
  return API.put("events", `/events/${id}`, {
    body: event
  });
}

async function handleSubmit(event) {
  let attachment;

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
    if (file.current) {
      attachment = await s3Upload(file.current);
    }

    await saveEvent({
      title, description, dateAndTime, address, 
      attachment: attachment || event.attachment
    });
    history.push("/");
  } catch (e) {
    onError(e);
    setIsLoading(false);
  }
}
  
  function deleteEvent() {
    return API.del("events", `/events/${id}`);
  }
  
  async function handleDelete(event) {
    event.preventDefault();
  
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );
  
    if (!confirmed) {
      return;
    }
  
    setIsDeleting(true);
  
    try {
      await deleteEvent();
      history.push("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }
  
  return (
    <div className="Notes">
      {event && (
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="content">
            <ControlLabel>Event Title</ControlLabel>
            <FormControl
              value={title}
              componentClass="textarea"
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
          <FormGroup controlId="content">
            <ControlLabel>Event Location</ControlLabel>
            <FormControl
              value={address}
              componentClass="textarea"
              onChange={e => setAddress(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="content">
            <ControlLabel>Date and Time</ControlLabel>
            <FormControl
              value={dateAndTime}
              componentClass="textarea"
              onChange={e => setDateAndTime(e.target.value)}
            />
          </FormGroup>
          {event.attachment && (
            <FormGroup>
              <ControlLabel>Attachment</ControlLabel>
              <FormControl.Static>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={event.attachmentURL}
                >
                  {formatFilename(event.attachment)}
                </a>
              </FormControl.Static>
            </FormGroup>
          )}
          <FormGroup controlId="file">
            {!event.attachment && <ControlLabel>Attachment</ControlLabel>}
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
            Save
          </LoaderButton>
          <LoaderButton
            block
            bsSize="large"
            bsStyle="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </form>
      )}
    </div>
  );
}