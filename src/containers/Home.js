import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";


export default function Home() {
  const [events, setEvents] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
  
      try {
        const events = await loadEvents();
        setEvents(events);
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [isAuthenticated]);
  
  function loadEvents() {
    return API.get("events","/events");
  }

  function renderEventsList(events) {
    return [{}].concat(events).map((event, i) =>
      i !== 0 ? (
        <LinkContainer key={event.eventId} to={`/events/${event.eventId}`}>
          <ListGroupItem header={event.title.trim().split("\n")[0]}>
            {"Created: " + new Date(event.createdAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/events/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Create a new note
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    );
  }

  function renderEvents() {
    return (
      <div className="notes">
        <PageHeader>Your events</PageHeader>
        <ListGroup>
          {!isLoading && renderEventsList(events)}
        </ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderEvents() : renderLander()}
    </div>
  );
}