import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';

// There can only be one lucky wheel on the server
const maxEntitiesInStream = 1;

const luckyWheelGroup = new alt.VirtualEntityGroup(maxEntitiesInStream);

const pos = new alt.Vector3(1111.052, 229.8579, -50.4);
const streamingDistance = 100;

// Initial stream synced meta
const initialData = {
    // Most likely in your gamemode you will create different types of virtual entities
    type: 'luckyWheel',
};

const entity = new alt.VirtualEntity(luckyWheelGroup, pos, streamingDistance, initialData);

export class LuckywheelServer {
    static init() {
        // Spinning wheel every 5 seconds
        alt.setInterval(async () => {
            entity.setStreamSyncedMeta('spinStartTime', alt.getNetTime());
            await alt.Utils.wait(2000);
            entity.deleteStreamSyncedMeta('spinStartTime');
        }, 5_000);

        // We can also set dimension if needed
        // entity.dimension = 123

        // Or hide entity from all players
        // entity.visible = false
    }
}
