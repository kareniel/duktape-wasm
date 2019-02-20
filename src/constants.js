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
  },
  ERROR: {
    0: 'Unknown or unspecified error',
    1: 'Unsupported command',
    2: 'Too many (e.g. too many breakpoints, cannot add new)',
    3: 'Not found (e.g. invalid breakpoint index)',
    4: 'Application error (e.g. AppRequest-related error)'
  },
  ENDIAN: {
    1: 'little endian',
    2: 'mixed endian',
    3: 'big endian'
  },
  BOOL: {
    0: false,
    1: true
  }
}

export const CLIENT_COMMANDS = {
  'basic-info': {
    code: 0x10,
    request: [],
    response: [
      'int version', 
      'str git_describe', 
      'str target_info', 
      'int endianness ENDIAN', 
      'int void_pointer_size'
    ]
  },
  'trigger-status': {
    code: 0x11
  },
  'pause': {
    code: 0x12
  },
  'resume': {
    code: 0x13,
  },
  'step-into': {
    code: 0x14,
  },
  'step-over': {
    code: 0x15,
  },
  'step-out': {
    code: 0x16,
  },
  'list-break': {
    code: 0x17,
    response: [
      'list <str filename, int line>'
    ]
  },
  'add-break': {
    code: 0x18,
    request: [
      'str filename',
      'int line'
    ],
    response: [ 'int index' ]
  },
  'del-break': {
    code: 0x19,
    request: [ 'int index' ]
  },
  'get-var': {
    code: 0x1a,
    request: [ 
      'int level',
      'str varname'
    ],
    response: [
      'int found BOOL',
      'tval value'
    ]
  },
  'put-var': {
    code: 0x1b,
    request: [ 
      'int level',
      'str varname',
      'tval value'
    ]
  },
  'get-callstack': {
    code: 0x1c,
    response: [
      'list <str filename, str fn, int line, int pc>'
    ]
  },
  'get-locals': {
    code: 0x1d,
    request: [
      'int level'
    ],
    response: [
      'list <str varname, tval value>'
    ]
  },
  'eval': {
    code: 0x1e,
    request: [
      'int level',
      'str expression'
    ],
    response: [
      'int success BOOL',
      'tval value'
    ]
  },
  'detach': {
    code: 0x1f
  },
  'dump-heap': {
    code: 0x20,
    response: [
      'dvalues'
    ]
  },
  'get-bytecode': {
    code: 0x21
    // TODO
  },
  'app-request': {
    code: 0x23
    // TODO
  },
  'get-heap-object-info': {
    code: 0x24
    // TODO
  },
  'get-object-property': {
    code: 0x24
    // TODO
  },
  'get-object-property-range': {
    code: 0x25
    // TODO
  }
}

export const ERROR_RESPONSE = {
  event: 'error',
  format: [
    'int code ERROR',
    'str message'
  ]
}

export const NOTIFICATIONS = {
  1: {
    type: 'status',
    format: [
      'int state STATE',
      'str filename',
      'str fn',
      'int line',
      'int pc'
    ]
  },
  5: {
    type: 'throw',
    format: [
      'int fatal THROW_FATAL',
      'str message',
      'str filename',
      'int line'
    ]
  },
  6: {
    type: 'detaching',
    format: [
      'int reason DETACH_REASON',
      'str message'
    ]
  }
}
