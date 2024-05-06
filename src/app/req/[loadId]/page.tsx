import React from "react";

function RequestPreview({ params }: { params: { loadId: string } }) {
  return (
    <>
      <p>{params.loadId}</p>
    </>
  );
}

export default RequestPreview;
