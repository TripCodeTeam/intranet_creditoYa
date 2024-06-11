import React from "react";

function EventsContainer({ params }: { params: { clientId: string } }) {
  return (
    <>
      <p>{params.clientId}</p>
    </>
  );
}

export default EventsContainer;
