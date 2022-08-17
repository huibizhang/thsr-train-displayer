import React, { useEffect } from "react";

function AnalogClock() {
  let canvas;
  let ctx;
  let radius;

  useEffect(() => {
    init();
  }, []);

  function init() {
    canvas = document.getElementById("canvas");
    // console.log(canvas);

    ctx = canvas.getContext("2d");
    radius = canvas.height / 2;
    ctx.translate(radius, radius);
    // radius = radius * 0.9;
    setInterval(drawClock, 1000);
  }

  function drawClock() {
    drawFace(ctx, radius);
    drawTicks(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius);
  }

  function drawFace(ctx, radius) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  function drawNumbers(ctx, radius) {
    ctx.fillStyle = "black";
    var ang;
    var num;
    ctx.font = radius * 0.15 + "px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (num = 1; num < 13; num++) {
      ang = (num * Math.PI) / 6;
      ctx.rotate(ang);
      ctx.translate(0, -radius * 0.85);
      ctx.rotate(-ang);
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, radius * 0.85);
      ctx.rotate(-ang);
    }
  }

  function drawTicks(ctx, radius) {
    ctx.fillStyle = "black";
    var ang;
    var num;
    ctx.font = radius * 0.15 + "px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    for (num = 0; num < 60; num++) {
      ctx.beginPath();
      ctx.lineWidth = radius * 0.005;

      ang = (num * Math.PI) / 30;

      ctx.rotate(ang);
      ctx.moveTo(0, -radius * 0.97);
      ctx.lineTo(0, -radius * 0.95);
      ctx.stroke();
      ctx.rotate(-ang);
    }
  }

  function drawTime(ctx, radius) {
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();

    //hour
    hour = hour % 12;
    hour =
      (hour * Math.PI) / 6 +
      (minute * Math.PI) / (6 * 60) +
      (second * Math.PI) / (360 * 60);
    drawHand(ctx, hour, radius * 0.6, radius * 0.1);

    //minute
    minute = (minute * Math.PI) / 30 + (second * Math.PI) / (30 * 60);
    drawHand(ctx, minute, radius * 0.75, radius * 0.06);

    // second
    second = (second * Math.PI) / 30;
    drawHand(ctx, second, radius * 0.9, radius * 0.02);
  }

  function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, radius * 0.1);
    ctx.lineTo(-width / 3, radius * 0.1);
    ctx.lineTo(-width / 5, -length);
    ctx.lineTo(width / 5, -length);
    ctx.lineTo(width / 3, radius * 0.1);
    ctx.lineTo(0, radius * 0.1);
    ctx.fill();
    ctx.rotate(-pos);
  }

  return (
    <canvas
      id="canvas"
      width="400"
      height="400"
      className="h-36 w-36 flex-none"
    ></canvas>
  );
}

export default AnalogClock;
