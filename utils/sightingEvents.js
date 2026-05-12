import {eventEmitter} from 'node:events'
import { createAlert } from './createAlert'
import { EventEmitter } from 'node:stream'

export const sightingEvents = new EventEmitter()

sightingEvents.on('sighting-added', createAlert)