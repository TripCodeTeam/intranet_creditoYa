import React from "react";

function UserEvents({ params }: { params: { id: string } }) {
  return (
    <>
      <p>{params.id}</p>
    </>
  );
}

export default UserEvents;
