import { useGlobalContext } from "@/context/Session";
import { ScalarIssues } from "@/types/session";
import axios from "axios";
import React, { useEffect, useState } from "react";
import IssueCard from "./issueCard";

function AllReports({
  openIssue,
}: {
  openIssue: (data: ScalarIssues) => void;
}) {
  const { dataSession } = useGlobalContext();

  const [issues, setIssues] = useState<ScalarIssues[] | null>(null);

  useEffect(() => {
    const getAllReport = async () => {
      const all = await axios.post(
        "/api/report/all",
        {},
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      // console.log(all.data);

      if (all.data.success == true) {
        const reports: ScalarIssues[] = all.data.data;
        setIssues(reports);
      }
    };

    getAllReport();
  }, [dataSession?.token]);

  return (
    <>
      <div style={{ marginTop: "1em", marginBottom: "1em" }}>
        <h3 style={{ marginBottom: "1em", fontWeight: "400" }}>Reportes</h3>
        {issues?.length === 0 && <p>No hay reportes</p>}
        {issues &&
          issues.length > 0 &&
          issues.map((issue, index) => (
            <IssueCard
              key={index}
              issue={issue}
              openIssue={() => openIssue(issue)}
            />
          ))}
      </div>
    </>
  );
}

export default AllReports;
