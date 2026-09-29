import * as THREE from "three";
import SunCalc from "suncalc";

function celestialTime(date, time, offset) {
  return new Date(Date.parse(`${date}T${time}:00Z`) - offset * 3_600_000);
}
export function solarPosition(date, time, latitude, longitude, offset) {
  const position = SunCalc.getPosition(celestialTime(date, time, offset), latitude, longitude);
  // SunCalc 1.9 uses radians, measured westward from south.
  return {
    altitude: THREE.MathUtils.radToDeg(position.altitude),
    azimuth: (THREE.MathUtils.radToDeg(position.azimuth) + 180) % 360,
  };
}
export function lunarDirection(date, time, latitude, longitude, offset, orientation) {
  const { altitude, azimuth } = SunCalc.getMoonPosition(
      celestialTime(date, time, offset), latitude, longitude,
    ),
    bearing = azimuth + Math.PI - THREE.MathUtils.degToRad(orientation);
  return new THREE.Vector3(
    Math.sin(bearing) * Math.cos(altitude),
    Math.sin(altitude),
    -Math.cos(bearing) * Math.cos(altitude),
  );
}
