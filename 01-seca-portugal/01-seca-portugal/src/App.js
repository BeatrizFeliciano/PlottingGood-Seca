import "./styles.css";
import * as d3 from "d3";
import { Axis, Orient } from "d3-axis-for-react";
import useDimensions from "react-cool-dimensions";
import drought from "./snirh_clean.json";

const rios = 
  ['ARADE', 'AVE', 'CÁVADO/RIBEIRAS COSTEIRAS', 'DOURO', 'GUADIANA', 'LIMA', 'MIRA', 
  'MONDEGO', 'RIBEIRAS DO ALGARVE', 'RIBEIRAS DO OESTE', 'SADO', 'TEJO'];
const scaleLegend = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
// let bacias = [];
  
let data = [];
let elements = [];

let dadosRios = {};

rios.map((rio) => {
  dadosRios[rio] = [];
})

// drought.map((el) => {
//   if (el.medida === "percentagem" && el.tipo_de_infraestrutura === "bacia") {
//     elements.push(el);

//     if (!bacias.includes(el.nome_infraestrutura)){
//       bacias.push(el.nome_infraestrutura);
//     }
//   }
// })

drought.map((el) => {
  if (el.medida === "percentagem" && (el.nome_infraestrutura === "SADO")) {
    el.resumo_infraestrutura = parseFloat(el.resumo_infraestrutura);

    if (el.resumo_infraestrutura) {
      el.data = new Date(el.data);
      data.push(el);
    }
  }
});

drought.map((el) => {
  if (el.medida === "percentagem" && (rios.includes(el.nome_infraestrutura))) {
    el.resumo_infraestrutura = parseFloat(el.resumo_infraestrutura);

    if (el.resumo_infraestrutura) {
      el.data = new Date(el.data);
    
      dadosRios[el.nome_infraestrutura].push(el);
    }
  }
});

data.sort((a, b) => a.data - b.data);

// rios.map((rio) => {
//   dadosRios[rio].sort((a, b) => a.data - b.data);
// })

const height = 100;

export default function App() {
  const { observe, width } = useDimensions();
  const margin = { top: 30, right: 20, bottom: 30, left: 70 };

   var colors = d3.scaleLinear().domain([0, 50, 100])
   .range(["#877777", "yellow", "#61C972"])

  const x = d3
    .scaleBand()
    .domain(d3.range(data.length))
    .range([margin.left, width - margin.right])
    .padding(-0.1);

  const y = d3
    .scaleLinear()
    .domain([0, 1])
    .nice()
    .range([height - margin.bottom, margin.top]);

  return (
    <>
    <div className="App" ref={observe}>
      <div style={{ display: "flex"}}>
      <div className="UpHeader">
        <h1 className="Title">Nível de armazenamento de água nas bacias portuguesas</h1>
        <div className="Description">
          <text>Maioria das bacias portuguesas tende to apenas atingir cerca de </text>
          <text style={{fontWeight: "bold"}}>50%</text>
          <text> da sua </text>
          <text style={{fontWeight: "bold"}}>capacidade total de armazenamento de água</text>
        </div>
      </div>

      <div className="Legend">
        <div style={{ display: "flex"}}>
          {scaleLegend.map((color) => (
            <div
              style={{
                backgroundColor: colors(color),
                width: "10px",
                height: "10px"
              }}
            />
            ))}
        </div>

        <div style={{ display: "flex"}}>
          {scaleLegend.map((color) => (
            <div
              style={{
                width: "10px",
                height: "10px"
              }}
            >
              {color === 0 || color === 50 || color === 100 ? `${color}%` : ""}
            </div>
            ))}
        </div>

        </div>

      </div>

      {rios.map((rio) => {
        return (
          <div className="Bacia">
            <h4 className="Header">{rio}</h4>
            <svg className="Graph" viewBox={`0 0 ${width} ${height}`}>
              <g>
                {dadosRios[rio].map((d, i) => {  
                  return (
                    <g>
                      <rect
                        x={x(i)}
                        y={margin.top}
                        height={height - margin.bottom - margin.top}
                        width={x.bandwidth()}
                        fill={colors(d.resumo_infraestrutura)}
                      />
                      {dadosRios[rio][i+1] ?
                      <line
                        x1={x(i)} 
                        y1={y(d.resumo_infraestrutura/100)} 
                        x2={x(i+1)}
                        y2={y(dadosRios[rio][i+1].resumo_infraestrutura/100)} 
                        style={{stroke:"black", strokeWidth:0.5}}
                      />
                      :
                      null
                      }
                    </g>
                  );
                })}
              </g>
              <g transform={`translate(0,${height - margin.bottom})`}>
                <Axis
                  orient={Orient.bottom}
                  scale={x}
                  tickSizeInner={0}
                  tickFormat={(i) => data[i].data.getMonth() === 0 ? 1900 + data[i].data.getYear() : null}
                  tickSizeOuter={0}
                />
              </g>
              <g transform={`translate(${margin.left},0)`}>
                <Axis
                  orient={Orient.left}
                  tickSizeInner={0}
                  tickSizeOuter={0}
                  scale={y}
                  ticks={[2, "%"]}
                  domainPathProps={null}
                />
              </g>
            </svg>
          </div>
        )
      })}

    </div>
    <div className="Footnote">
      <text>
          Fonte: SNIRH (dados tratados pela DSSG)
      </text>
    </div>
    </>
  );
}
