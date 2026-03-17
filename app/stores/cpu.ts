
interface Register { 
  A: number, 
  B: number, 
  D: number, 
  X: number, 
  Y: number, 
  S: number, 
  U: number, 
  PC: number, 
  CC: number, 
  DP: number,
  TR: number
}

interface CpuState { 
  break: boolean, 
  halted: boolean, 
  wait: boolean, 
  mmu: boolean,
  load: number, 
  overrun: number,
  map_type: string, 
  registers: Register,
  mmuregs: number[],
  disasm: string
}

interface Module { 
  name: string, 
  start: number, 
  end: number,
  type: number,
  language: number,
  data_size: number,
  attr_rev: number,
  exec_offset: number 
}

interface Point {
  x: number, y: number
}

interface Cursor {
  pos: Point,
  on: boolean,
  rate: number
}

interface Color {
  fg: number,
  bg: number
}

interface Disk {
  id: number,
  name: string,
  motor_on: boolean
}

interface DiskFile {
  name: string
}

interface Memory {
  updated: boolean,
  map: number,
  virtual_address: number,
  address: number,
  data: number[]
}

interface Display {
  updated: boolean,
  content: string
  type: string
  size: Point,
  cursor: Cursor,
  color: Color
}

interface Source {
  file: string,
  module: string,
  content: string[],
  base_address: number,
  base: number,
  loaded: boolean
}

interface Breakpoint {
  address: number,
  enabled: boolean,
  temporary: boolean
}

interface Tracing {
  enable: boolean,
  start: number,
  end: number
}

var module_alias: { [modname: string]: string; } = {
    'shell':  'shell_21',
    'clock':  'clock_60hz',
    'clock2': 'clock2_soft'
};

export const useCpuStore = defineStore('cpu', () => {
    const radix           = ref(16)
    const cpu_state       = ref<CpuState | null>(null)
    const display         = ref<Display>({ updated: false, content: "", type: "", size: { x: 0, y: 0}, 
                                           cursor: { pos: { x: 0, y: 0 }, on: false, rate: 0 }, 
                                           color: { fg: 0, bg: 0 }, })
    const modules         = ref<Module[]>([])
    const floppy_disks    = ref<Disk[]>([])
    const current_module  = ref<Module | null>(null)
    const available_disks = ref<DiskFile[]>([])
    const selected_memory = ref<number | null>(null)
    const memory          = ref<Memory>({ updated: false, map: 0, virtual_address: 0, address: 0, data: []})
    const source_info     = ref<Source>({ file: "", module: "", content: [], base_address: 0, base: 0, loaded: false})
    const breakpoints     = ref<Breakpoint[]>([])
    const tracing_info    = ref<Tracing>({ enable: false, start: 0, end: 0 })
    const OS9_loaded      = ref<boolean>(false)

    const physical_memory_active = ref<boolean>(false)
    const current_map = ref<number>(0)

    const source_loaded   = computed(() => source_info.value.loaded)

    const socket      = ref<WebSocket | null>(null);
    const error       = ref<Event | null>(null);
    const isConnected = ref<boolean>(false);

    let reconnectAttempt     = 0;
    let maxReconnectAttempts = 10;
    let reconnectInterval    = 1000; // 1 second

    const connect = () => {
        const url: string = <string>(useRuntimeConfig().public.ws_url)
        socket.value = new WebSocket(url);

        socket.value.onopen = () => {
          isConnected.value = true;
          error.value = null;
          reconnectAttempt = 0;
          console.log('WebSocket connected');
        };

        socket.value.onmessage = (event) => {
          // console.log('Message received:');
          ProcessMessage(event.data)
        };

        socket.value.onclose = () => {
          isConnected.value = false;
          console.log('WebSocket closed');
          attemptReconnect();
        };

        socket.value.onerror = (err) => {
          error.value = err;
          console.error('WebSocket error:', err);
        };
    };

    const disconnect = () => {
      if (socket.value) {
        socket.value.close();
        socket.value = null; 
      }
    };

    const attemptReconnect = () => {
      if (reconnectAttempt < maxReconnectAttempts) {
        setTimeout(() => {
          console.log(`Attempting to reconnect (attempt ${reconnectAttempt + 1})`);
          connect();
          reconnectAttempt++;
          reconnectInterval *= 2; // Exponential backoff
        }, reconnectInterval);
      } else {
        console.log('Max reconnect attempts reached.');
      }
    }

    const setCurrentModule = () => {
      if (cpu_state.value && cpu_state.value.break) {
        const pc = cpu_state.value.registers.PC
        const module = modules.value.find((mod) => pc >= mod.start && pc < mod.end)
        if (module) {
            console.log(`current_module: ${module.name}`)
            current_module.value = module
        } else {
            console.log("current_module: None")
            current_module.value = null
        }
      }
    }

    const setCpuState = (reg: CpuState) => {
        cpu_state.value = reg
        OS9_loaded.value = reg.map_type === "RAM"
        if (OS9_loaded) {
            setCurrentModule()
        }
    };

    const sendCommand = (cmd: string, argv: object) => {
        if (socket.value && isConnected.value) {
            const msg = { command: cmd, argv: argv }
            // console.log(`msg: ${JSON.stringify(msg)}`)
            socket.value.send(JSON.stringify(msg));
        } else {
            console.error('WebSocket not connected');
        }
    }

    const ProcessMessage = (data: any) => {
      const msg = JSON.parse(data)
      for (const key of Object.keys(msg)) {
        if (key === "cpu_state") {
          setCpuState(msg["cpu_state"])
        }
        else if (key === "display") 
        {
          const obj = msg["display"]
          display.value = {
            updated: !display.value.updated,
            content: obj["display"],
            type: obj["type"],
            size: { x: obj["width"], y: obj["height"] },
            cursor: {
              pos: obj["cursor"]["pos"],
              on: obj["cursor"]["on"],
              rate: obj["cursor"]["rate"]
            },
            color: {
              fg: obj["color"]["fg"],
              bg: obj["color"]["bg"]
            }
          }
        }
        else if (key === "disks") 
        {
          // console.log(JSON.stringify(msg["disks"]))
          floppy_disks.value = msg["disks"]
        }
        else if (key == "breakpoints") 
        {
          console.log(JSON.stringify(msg["breakpoints"]))
          breakpoints.value = msg["breakpoints"]
        }
        else if (key == "source") 
        {
          const module_name = msg["source"]["module"]
          const module = modules.value.find((mod) => mod.name === module_name)
          if (module) {
              source_info.value.file = msg["source"]["file"]
              source_info.value.module = module_name
              source_info.value.content = msg["source"]["content"]
              source_info.value.base_address = module.start
              source_info.value.base = module.start
              source_info.value.loaded = true
          } else {
              console.log("Unknown source")
              source_info.value = { file: "", module: "", content: [], base_address: 0, base: 0, loaded: false }
          }
        }
        else if (key == "modules") 
        {
          modules.value = msg["modules"]
        }
        else if (key == "memory") 
        {
          memory.value.map = msg["memory"]["map"]
          memory.value.virtual_address = msg["memory"]["virtual_address"]
          memory.value.address = msg["memory"]["address"]
          memory.value.data = msg["memory"]["data"]
          memory.value.updated = !memory.value.updated
        }
        else if (key == "available_disks") 
        {
          available_disks.value = msg["available_disks"]
        }
        else if (key == "tracing")
        {
          console.log(msg)
          tracing_info.value.enable = msg["tracing"]["enable"]
          tracing_info.value.start = msg["tracing"]["start"]
          tracing_info.value.end = msg["tracing"]["end"]
        }
        else 
        {
          console.log(`Unknown message [${key}]`)
        }
      }
    }

    // Disk access methods

    const getAvailableDisks = () => {
      sendCommand('disks', { operation: 'get' })
    }

    const mountDisk = (drive: number, name: string) => {
      sendCommand('disks', { operation: 'mount', disk: { drive, name } })
    }

    const unmountDisk = (drive: number) => {
      sendCommand('disks', { operation: 'unmount', disk: { drive } })
    }

    const createDisk = (drive: number, name: string, dblside: boolean, nbtracks: number) => {
      sendCommand('disks', { operation: 'create', disk: { drive, name, dblside, nbtracks } })
    }

    // Source listing methods
    const getAlias = (fname: string) => {
        const modname = fname.toLowerCase()
        if (modname in module_alias) {
            return module_alias[modname]
        }
        return modname
    }

    const getModuleType = (module: string) => {
        const mod = modules.value.find((mod) => mod.name === module)
        if (mod) {
            if (mod.type == 13) 
                return ".mn"
            if (mod.type == 14)
                return ".dr"
            if (mod.type == 15)
                return ".dd"
        }
        return ""
    }

    const getSourceListing = (module_name: string) => {
      const filename = getAlias(module_name) + getModuleType(module_name) + ".lst"
      source_info.value.loaded = false
      // send request for module directory prior to get the listing
      sendCommand('modules', { operation: 'get' })
      sendCommand('source', { file: filename, module: module_name })
    }

    // CPU Control

    const reset = (cold: boolean) => {
      sendCommand('reset', { coldstart: cold })
    }

    const step = () => {
      sendCommand('step', {})
    }

    const stepover = () => {
      sendCommand('stepover', {})
    }

    // TODO: period should be a param
    // const run = (period: number) => {
    const run = () => {
      sendCommand('run', { period: 100 })
    }

    const cpubreak = () => {
      sendCommand('break', {})
    }

    const setRegister = ( reg: string, val: number ) => {
      sendCommand('register', { operation: 'set', reg: { name: reg, value: val } })
    }

    const getMemory = ( start: number, length: number ) => {
      sendCommand('memory', { operation: 'get', range: { start, length }})
    }

    const setMemory = ( address: number, value: number ) => {
      sendCommand('memory', { operation: 'set', data: { address, value }})
    }

    const getPhysMemory = ( map: number, start: number, length: number ) => {
      sendCommand('phys_memory', { operation: 'get', range: { map, start, length }})
    }

    const setPhysMemory = ( map: number, address: number, value: number ) => {
      sendCommand('phys_memory', { operation: 'set', data: { map, address, value }})
    }

    const getModules = () => {
      sendCommand('modules', { operation: 'get' })
    }

    const setSelectedMemory = (addr: number) => {
      selected_memory.value = addr
    }

    const addBreakpoint = (address: number, enable: boolean) => {
      sendCommand('breakpoints', { operation: "add", brkpt: { address, enable}})
    }

    const deleteBreakpoint = (address: number) => {
      sendCommand('breakpoints', { operation: "delete", brkpt: { address }})
    }

    const isBreakpoint = (address: number) => {
        return breakpoints.value.find((b) => !b.temporary && (b.address === address)) != undefined
    }

    const getTracing = () => {
      sendCommand('tracing', { operation: "get" } )
    }

    const setTracing = (enable: boolean, start: number, end: number) => {
      console.log(`setTracing(${enable}, ${start}, ${end})`)
      sendCommand('tracing', { operation: "set", trace: { enable, start, end } } )
    }

    // const 

    return {
        radix,
        isConnected,
        error,
        cpu_state,
        display,
        breakpoints,
        modules,
        current_module,
        source_info,
        source_loaded,
        memory,
        selected_memory,
        floppy_disks,
        available_disks,
        physical_memory_active,
        current_map,
        tracing_info,
        connect,
        sendCommand,
        disconnect,
        getAvailableDisks,
        mountDisk,
        unmountDisk,
        createDisk,
        reset,
        step,
        stepover,
        run,
        cpubreak,
        setRegister,
        getMemory,
        setMemory,
        getPhysMemory,
        setPhysMemory,
        setSelectedMemory,
        getModules,
        getSourceListing,
        addBreakpoint,
        deleteBreakpoint,
        isBreakpoint,
        getTracing,
        setTracing
    }
})