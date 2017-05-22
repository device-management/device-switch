import { Device, MqttConfig, DeviceDescription } from '@device-management/device-base';
import { Gpio } from 'onoff';
import { Observable } from 'rx';

export namespace DeviceManager {
    export class PowerSwitch extends Device {

        private out: Gpio;

        constructor(
            mqttConfig: MqttConfig,
            deviceDescription: DeviceDescription,
            private powerSwitchConfig: PowerSwitchConfig) {
            super(mqttConfig, deviceDescription);
        }

        doStart(): Observable<any> {
            this.out = new Gpio(this.powerSwitchConfig.pin, "out");
            this.out.writeSync(this.deviceDescription.properties.isActive ? 0 : 1);
            return super.doStart().finally(() => {
                this.mqttClient.subscribe("devices/" + this.deviceDescription.deviceId + "/command");
            });
        };

        handleMessage(topic: string, message: any): void {
            console.log("Recived message from mqtt. Topic: " + topic + ", Message: " + message);
            if (topic == "devices/" + this.deviceDescription.deviceId + "/command") {
                var command = JSON.parse(message);
                if (command.properties.hasOwnProperty("isActive")) {
                    this.out.write(command.properties.isActive ? 0 : 1, (error, value) => {
                        if (error) {
                            console.log("Cannot change value on GPIO.");
                            console.log(error);
                        } else {
                            this.mqttClient.publish(
                                "devices/" + this.deviceDescription.deviceId + "/state",
                                JSON.stringify({
                                    deviceId: this.deviceDescription.deviceId,
                                    properties: {
                                        isActive: command.properties.isActive
                                    }
                                }),
                                {
                                    qos: 1,
                                    retain: true
                                });
                        }
                    });
                }
            }
        }
    }

    export interface PowerSwitchConfig {
        pin: number;
    }
}