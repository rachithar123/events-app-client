import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";


export default function Home() {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
        try {
          const allEvents = await loadAllEvents();
          setAllEvents(allEvents);
        } catch (e) {
          onError(e);
        }
        setIsLoading(false);
 
    }
  
    onLoad();
  }, [isAuthenticated]);

  function loadAllEvents() {
    return API.get("events","/allevents");
  }

  function renderAllEventsList(events) {
    return [{}].concat(events).map((event, i) =>
      i !== 0 ? (
        <LinkContainer key={event.eventsId} to={`/events/${event.eventsId}`}>
          <ListGroupItem header={event.title.trim().split("\n")[0]}>
            {"Created: " + new Date(event.createdAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : ( isAuthenticated ? (
        <LinkContainer key="new" to="/events/new">
        <ListGroupItem>
          <h4>
            <b>{"\uFF0B"}</b> create a new note
          </h4>
        </ListGroupItem>
      </LinkContainer>
      ):(
        <LinkContainer key="new" to="/login">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Login to create a new note
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
      )
    );
  }


  function renderLander() {
    return (
      <div className="notes">
        <PageHeader>Events</PageHeader>
        <ListGroup>
          {!isLoading && renderAllEventsList(allEvents)}
        </ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {renderLander()}
    </div>
  );
}