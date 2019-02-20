export const ENUMS = {
  STATE: {
    0: 'running',
    1: 'paused, debug client must resume'
  },
  DETACH_REASON: {
    0: 'normal detach',
    1: 'detaching due to stream error'
  },
  THROW_FATAL: {
    0: 'caught',
    1: 'fatal (uncaught)'
  }
}

export const NOTIFICATIONS = {
  1: {
    event: 'notification:status',
    format: [
      'int state STATE',
      'str filename',
      'str funcname',
      'int linenumber',
      'int pc'
    ]
  },
  5: {
    event: 'notification:throw',
    format: [
      'int fatal THROW_FATAL',
      'str message',
      'str filename',
      'int line'
    ]
  },
  6: {
    event: 'notification:detaching',
    format: [
      'int reason DETACH_REASON',
      'str message'
    ]
  }
}
