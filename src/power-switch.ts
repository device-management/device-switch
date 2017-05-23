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
            let start = super.doStart();
            start.subscribe(() => { }, () => { }, () => {
                let topic = "devices/" + this.deviceDescription.deviceId + "/command";
                console.log("Subscribing topic: " + topic);
                this.mqttClient.subscribe(topic);
            });
            return start;
        };

        getMessageHandler(): (topic: string, message: string) => void {
            let self = this;
            return (topic, message) => {
                console.log("Recived message from mqtt. Topic: " + topic + ", Message: " + message);
                if (topic == "devices/" + self.deviceDescription.deviceId + "/command") {
                    var command = JSON.parse(message);
                    if (command.properties.hasOwnProperty("isActive")) {
                        self.out.write(command.properties.isActive ? 0 : 1, (error, value) => {
                            if (error) {
                                console.log("Cannot change value on GPIO.");
                                console.log(error);
                            } else {
                                self.mqttClient.publish(
                                    "devices/" + self.deviceDescription.deviceId + "/state",
                                    JSON.stringify({
                                        deviceId: self.deviceDescription.deviceId,
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
    }

    export interface PowerSwitchConfig {
        pin: number;
    }
}