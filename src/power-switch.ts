import { Device, MqttConfig, DeviceDescription } from '@device-management/device-base';
import { Gpio } from 'onoff';
import { Observable } from 'rx';

export namespace DeviceManager {
    export class PowerSwitch extends Device {

        private out: Gpio;

        doStart(): Observable<any> {
            this.out = new Gpio(this.device.configuration.pin, "out");
            this.out.writeSync(this.device.state.isActive ? 0 : 1);
            let start = super.doStart();
            start.subscribe(() => { }, () => { }, () => {
                let topic = "devices/" + this.device.id + "/command";
                console.log("Subscribing topic: " + topic);
                this.mqttClient.subscribe(topic);
            });
            return start;
        };

        getMessageHandler(): (topic: string, message: string) => void {
            let self = this;
            return (topic, message) => {
                console.log("Recived message from mqtt. Topic: " + topic + ", Message: " + message);
                if (topic == "devices/" + self.device.id + "/command") {
                    var command = JSON.parse(message);
                    if (command.state.hasOwnProperty("isActive")) {
                        self.out.write(command.state.isActive ? 0 : 1, (error, value) => {
                            if (error) {
                                console.log("Cannot change value on GPIO.");
                                console.log(error);
                            } else {
                                self.mqttClient.publish(
                                    "devices/" + self.device.id + "/state",
                                    JSON.stringify({
                                        deviceId: self.device.id,
                                        properties: {
                                            isActive: command.state.isActive
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
}