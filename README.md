# device-switch
Represents power switch software using ARM devices.

docker run \
-e "MQTT_ADDRESS=mqtt://192.168.0.49" \
-e "PIN=26" \
--privileged -d devicemanagment/device-switch
