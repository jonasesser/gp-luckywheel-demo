import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { LuckywheelServer } from './src/luckywheel';

const PLUGIN_NAME = 'gp-luckywheel';

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, async () => {
    LuckywheelServer.init();

    alt.log(`~lg~${PLUGIN_NAME} was Loaded`);
});
