# device-switch
Represents power switch software using ARM devices.

```sh
docker run \
-e "MQTT_ADDRESS=mqtt://192.168.0.49" \
-e "DEVICE_ID=FAN01" \
-e "DEVICE_NAME=Fan controller" \
-e "DEVICE_TYPE=fan" \
-e "PIN=20" \
--privileged -d devicemanagment/device-switch
```

```sh
docker run \
-e "MQTT_ADDRESS=mqtt://192.168.0.49" \
-e "DEVICE_ID=CTRL01" \
-e "DEVICE_NAME=Lighting controller" \
-e "DEVICE_TYPE=lighting" \
-e "PIN=26" \
--privileged -d devicemanagment/device-switch
```

