import { ScalarLoanApplication } from "@/types/session";
import React from "react";
import {
  VictoryChart,
  VictoryScatter,
  VictoryTheme,
  VictoryAxis,
  VictoryBar,
} from "victory";

function IncomeLoanScatterPlot({
  data,
}: {
  data: ScalarLoanApplication | null;
}) {
  if (!data) {
    return <p>Loading...</p>;
  }

  const { total_monthly_income, requested_amount } = data;

  const monthlyIncome = Number(total_monthly_income);
  const requestedAmount = Number(requested_amount);

  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        display: "grid",
        placeContent: "center",
      }}
    >
      <VictoryChart
        horizontal
        theme={VictoryTheme.material}
        width={500}
        height={200}
        domainPadding={{ x: 20, y: 40 }}
      >
        <VictoryBar
          data={[
            { x: "Ingresos Mensuales", y: monthlyIncome },
            { x: "Monto Solicitado", y: requestedAmount },
          ]}
          style={{ data: { fill: "#4caf50" } }}
        />
        <VictoryAxis dependentAxis />
        <VictoryAxis
          tickFormat={(tick) =>
            tick.toLocaleString("es-CO", { style: "currency", currency: "COP" })
          }
        />
      </VictoryChart>
    </div>
  );
}

export default IncomeLoanScatterPlot;
