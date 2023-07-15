import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import os from 'node:os';
import http from 'node:http';
import util from 'node:util';
import crypto from 'node:crypto';
import timers from 'node:timers';
import {fileURLToPath} from 'url';

const node = { fs, path, vm, os, http, util, crypto, timers };
const __filename = fileURLToPath(import.meta.url)
node.dirname = path.dirname(__filename)
node.alias = node.path.join(node.dirname, '..')

Object.freeze(node);
export default node;