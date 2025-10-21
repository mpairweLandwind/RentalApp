import AreaBarChart from "./AreaBarChart"
import AreaProgressChart from "./AreaProgressChart"
import "./AreaCharts.scss";
import React from "react";

const AreaCharts = () => {
  return (
    <section className="content-area-charts">
      <AreaBarChart />
      <AreaProgressChart />
    </section>
  )
}

export default AreaCharts
