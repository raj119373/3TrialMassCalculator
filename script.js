function calculate() {
  const m = parseFloat(document.getElementById("trialMass").value);

  const v0 = [
    parseFloat(document.getElementById("r0").value),
    parseFloat(document.getElementById("a0").value),
    parseFloat(document.getElementById("h0").value),
  ];
  const v120 = [
    parseFloat(document.getElementById("r120").value),
    parseFloat(document.getElementById("a120").value),
    parseFloat(document.getElementById("h120").value),
  ];
  const v240 = [
    parseFloat(document.getElementById("r240").value),
    parseFloat(document.getElementById("a240").value),
    parseFloat(document.getElementById("h240").value),
  ];

  const angles = [0, 120, 240].map(d => d * Math.PI / 180);

  // Magnitude of each trial vibration
  const mags = [v0, v120, v240].map(v => Math.sqrt(v[0]**2 + v[1]**2 + v[2]**2));

  // Vector sum
  let sumX = 0, sumY = 0;
  for(let i=0; i<3; i++){
    sumX += mags[i]*Math.cos(angles[i]);
    sumY += mags[i]*Math.sin(angles[i]);
  }

  const resultantMag = Math.sqrt(sumX**2 + sumY**2);
  const resultantAngle = Math.atan2(sumY, sumX);
  const avgMag = (mags[0]+mags[1]+mags[2])/3;
  const corrMass = (m*resultantMag)/avgMag;
  const corrAngle = ((resultantAngle*180/Math.PI)+180)%360;

  // Display results
  document.getElementById("output").innerHTML = `
    <h2>Results</h2>
    <p><b>Correction Mass:</b> ${corrMass.toFixed(4)} kg</p>
    <p><b>Placement Angle:</b> ${corrAngle.toFixed(2)}°</p>
  `;

  // Draw vector diagram
  const canvas = document.getElementById("vectorCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const centerX = canvas.width/2;
  const centerY = canvas.height/2;

  function drawVector(mag, angle, color){
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + mag*20*Math.cos(angle), centerY - mag*20*Math.sin(angle));
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // Draw trial vectors (blue)
  for(let i=0;i<3;i++) drawVector(mags[i], angles[i], 'blue');
  // Resultant vector (red)
  drawVector(resultantMag, resultantAngle, 'red');
  // Correction vector (green)
  drawVector(corrMass, corrAngle*Math.PI/180, 'green');

  // Residual vibration chart
  const ctxChart = document.getElementById("vibrationChart").getContext("2d");
  if(window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctxChart, {
    type: 'bar',
    data: {
      labels: ['Radial','Axial','Horizontal'],
      datasets:[{
        label:'Expected Residual Vibration',
        data:[v0[0]/10,v0[1]/10,v0[2]/10],
        backgroundColor:['#0078d7','#ff9900','#28a745']
      }]
    },
    options: {
      responsive:true,
      plugins:{legend:{display:false}},
      scales:{y:{beginAtZero:true}}
    }
  });
}
