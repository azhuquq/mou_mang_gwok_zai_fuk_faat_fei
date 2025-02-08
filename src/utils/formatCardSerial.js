export default function formatCardSerial(serial) {
  return serial.replace(/:/g, '').toUpperCase();
}