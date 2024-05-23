import { ScalarLoanApplication } from "@/types/session";
import React from "react";
import { VictoryChart, VictoryBar, VictoryTheme, VictoryLabel } from "victory";
import styles from "./personalCondition.module.css";

function activesAssets({ data }: { data: ScalarLoanApplication | null }) {
  if (!data) {
    return <p>Loading...</p>;
  }

  const { total_assets, total_liabilities, patrimony } = data;

  const totalAssets = Number(total_assets) || 0;
  const totalLiabilities = Number(total_liabilities) || 0;
  const totalPatrimony = Number(patrimony) || 0;

  const formatCurrency = (value: number) =>
    value.toLocaleString("es-CO", { style: "currency", currency: "COP" });

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
        theme={VictoryTheme.material}
        domainPadding={{ x: 20, y: 50 }}
        width={400}
        height={300}
        horizontal
      >
        <VictoryBar
          data={[
            { x: "Activos", y: totalAssets },
            { x: "Pasivos", y: totalLiabilities },
            { x: "Patrimonio", y: totalPatrimony },
          ]}
          style={{
            data: {
              fill: ({ datum }) =>
                datum.x === "Activos"
                  ? "green"
                  : datum.x === "Pasivos"
                  ? "red"
                  : "blue",
            },
          }}
          labels={({ datum }) => formatCurrency(datum.y)}
          labelComponent={<VictoryLabel dx={0} dy={5} />}
        />
      </VictoryChart>
    </div>
  );
}

export default activesAssets;
