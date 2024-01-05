import isEqual from 'lodash.isequal'
import redis from 'redis';
import { v4 as uuidv4 } from 'uuid'

const npm = {  redis, isEqual, uuidv4 };
Object.freeze(npm);

export default npm;