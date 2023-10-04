import * as alt from 'alt-client';

// alt.LocalObject or null
let luckyWheelObject = null;
// alt.Utils.EveryTick or null
let currentSpinTick = null;

export class LuckywheelClient {
    static init() {
        alt.on('worldObjectStreamIn', LuckywheelClient.onWorldObjectStreamIn);
        alt.on('worldObjectStreamOut', LuckywheelClient.onWorldObjectStreamOut);
        alt.on('streamSyncedMetaChange', LuckywheelClient.onStreamSyncedMetaChange);
    }

    static isItLuckyWheel(entity: alt.VirtualEntity) {
        // If its not virtual entity ignore it
        if (!(entity instanceof alt.VirtualEntity)) return false;

        // Initial stream synced meta we set on server
        if (entity.getStreamSyncedMeta('type') !== 'luckyWheel') return false;

        return true;
    }

    static startSpin(startSpinTime: number) {
        alt.log('Lucky wheel start spin time:', startSpinTime);

        currentSpinTick = new alt.Utils.EveryTick(() => {
            const currentSpinTime = alt.getNetTime() - startSpinTime;

            // Spin is already over
            if (currentSpinTime > 2000) {
                currentSpinTick.destroy();
                currentSpinTick = null;

                luckyWheelObject.rot = new alt.Vector3(0, 0, 0);
                return;
            }

            let currentNormalized = currentSpinTime / 2000;
            let degrees = currentNormalized * 360;

            luckyWheelObject.rot = new alt.Vector3(0, degrees, 0).toRadians();
        });
    }

    static onWorldObjectStreamIn(entity: alt.VirtualEntity) {
        if (!LuckywheelClient.isItLuckyWheel(entity)) return;

        alt.log('Lucky wheel stream in');

        // Make sure we don't have object already created
        alt.Utils.assert(luckyWheelObject == null);

        const rot = alt.Vector3.zero;
        luckyWheelObject = new alt.LocalObject('vw_prop_vw_luckywheel_02a', entity.pos, rot);

        const spinStartTime = entity.getStreamSyncedMeta('spinStartTime') as number;
        if (spinStartTime == null) return;
        LuckywheelClient.startSpin(spinStartTime);
    }

    static onWorldObjectStreamOut(entity: alt.VirtualEntity) {
        if (!LuckywheelClient.isItLuckyWheel(entity)) return;

        alt.log('Lucky wheel stream out');

        luckyWheelObject?.destroy();
        luckyWheelObject = null;
        currentSpinTick?.destroy();
        currentSpinTick = null;
    }

    static onStreamSyncedMetaChange(entity: alt.VirtualEntity, key: string, value: any) {
        if (!LuckywheelClient.isItLuckyWheel(entity)) return;

        // Make sure we have object created
        alt.Utils.assert(luckyWheelObject != null);

        alt.log('Lucky wheel change', { key: value });

        switch (key) {
            case 'spinStartTime':
                // Value was deleted
                if (value == null) return;

                LuckywheelClient.startSpin(value);
                break;
            case 'type':
                // ignoring it
                break;
            default:
                alt.logError('Lucky wheel unknown stream synced meta change key:', key);
        }
    }
}
