import { DeviceManager } from "./power-switch";

let mqttAddress = process.env.MQTT_ADDRESS;
let pinNumber = process.env.PIN ? parseInt(process.env.PIN) : 37;

let powerSwitch = new DeviceManager.PowerSwitch(
    {
        brokerAddress: mqttAddress
    },
    {
        deviceId: "CTRL01",
        properties: {
            name: "Lighting controller",
            type: "lighting",
            isOnline: true,
            isActive: false
        }
    }, 
    {
        pin: pinNumber
    }
);

console.log("MQTT address: " + mqttAddress);
console.log("Pin number: " + pinNumber);
console.log("Starting power switch...");

powerSwitch.start();