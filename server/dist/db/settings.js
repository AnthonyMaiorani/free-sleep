import _ from 'lodash';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import config from '../config.js';
const defaultData = {
    timeZone: null,
    temperatureFormat: 'fahrenheit',
    left: {
        awayMode: false,
    },
    right: {
        awayMode: false,
    },
    primePodDaily: {
        enabled: false,
        time: '14:00',
    }
};
const file = new JSONFile(`${config.dbFolder}settingsDB.json`);
const settingsDB = new Low(file, defaultData);
await settingsDB.read();
// Allows us to add default values to the settings if users have existing settingsDB.json data
settingsDB.data = _.merge({}, defaultData, settingsDB.data);
await settingsDB.write();
export default settingsDB;
