export function interpolateNumber(start, end, amount) {
  return start + (end - start) * amount;
}

export function smoothstep(start, end, value) {
  const amount = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return amount * amount * (3 - 2 * amount);
}

export function hexToRgb(hex) {
  return [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16),
  ];
}

export function rgbToHex(channels) {
  const encode = value => Math.round(Math.max(0, Math.min(255, value)))
    .toString(16)
    .padStart(2, '0');
  return `#${channels.map(encode).join('')}`;
}

export function mixHexColors(start, end, amount) {
  const endChannels = hexToRgb(end);
  return rgbToHex(hexToRgb(start).map((channel, index) =>
    interpolateNumber(channel, endChannels[index], amount)));
}
