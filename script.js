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

  const directions = [0, 120, 240].map((d) => (Math.PI / 180) * d);

  // Calculate resultant magnitudes for each trial
  function mag(arr) {
    return Math.sqrt(arr[0] ** 2 + arr[1] ** 2 + arr[2] ** 2);
  }

  const mags = [mag(v0), mag(v120), mag(v240)];

  // Complex vector sum
  let sumX = 0,
    sumY = 0;
  for (let i = 0; i < 3; i++) {
    sumX += mags[i] * Math.cos(directions[i]);
    sumY += mags[i] * Math.sin(directions[i]);
  }

  const resultantMag = Math.sqrt(sumX ** 2 + sumY ** 2);
  const resultantAngle = Math.atan2(sumY, sumX);

  const avgMag = (mags[0] + mags[1] + mags[2]) / 3;
  const corrMass = (m * resultantMag) / avgMag;
  const corrAngle = ((resultantAngle * 180) / Math.PI + 180) % 360;

  // Estimate residual vibration (simple scaled reduction)
  const residual = [v0, v120, v240].map((v) => [
    (v[0] / 10).toFixed(3),
    (v[1] / 10).toFixed(3),
    (v[2] / 10).toFixed(3),
  ]);

  const output = `
    <h2>Results</h2>
    <p><b>Correction Mass:</b> ${corrMass.toFixed(4)} kg</p>
    <p><b>Placement Angle:</b> ${corrAngle.toFixed(2)}°</p>
    <h3>Expected Residual Vibration:</h3>
    <p>Radial: ${residual[0][0]} mm/s</p>
    <p>Axial: ${residual[0][1]} mm/s</p>
    <p>Horizontal: ${residual[0][2]} mm/s</p>
  `;
  document.getElementById("output").innerHTML = output;
}
