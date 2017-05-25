import { DeviceManager } from "./power-switch";

let mqttAddress = process.env.MQTT_ADDRESS;
let pinNumber = process.env.PIN ? parseInt(process.env.PIN) : 37;
let deviceId = process.env.DEVICE_ID ? process.env.DEVICE_ID : "CTRL01";
let deviceName = process.env.DEVICE_NAME ? process.env.DEVICE_NAME : "Lighting controller";
let deviceType = process.env.DEVICE_TYPE ? process.env.DEVICE_TYPE : "lighting";

let powerSwitch = new DeviceManager.PowerSwitch(
    {
        brokerAddress: mqttAddress
    },
    {
        deviceId: deviceId,
        properties: {
            name: deviceName,
            type: deviceType,
            isOnline: true,
            isActive: false
        }
    }, 
    {
        pin: pinNumber
    }
);

console.log("MQTT address: " + mqttAddress);
console.log("Device ID: " + deviceId);
console.log("Device type: " + deviceType);
console.log("Pin number: " + pinNumber);
console.log("Starting power switch...");

powerSwitch.start();