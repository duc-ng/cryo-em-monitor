const fg = require('fast-glob')
const path = require('path')
const config = require('./../config.json')
const fs = require('fs')
const Logger = require('./Logger')

class AutoDelete {
  constructor () {
    this.logger = new Logger()
    if (config.app.autodelete.isOn) {
      this.start()
      setInterval(() => {
        this.start()
      }, 1000 * 60 * 60 * 24)
    }
  }

  async start () {
    // get and sort directories
    const directory = path.join(process.env.ROOT_DATA, '*', '*')
    let dirs = await fg([directory], { onlyDirectories: true })
    dirs = dirs.sort((a, b) => {
      const aName = new Date(path.basename(a))
      const bName = new Date(path.basename(b))
      if (aName < bName) {
        return 1
      }
      if (aName > bName) {
        return -1
      }
      return 0
    })

    // remove
    const { maxFiles } = config.app.autodelete
    let loop = true
    while (loop) {
      const dirsDates = dirs.map((x) => path.basename(x))
      const uSet = new Set(dirsDates)
      if ([...uSet].length > maxFiles) {
        const dir = dirs.pop()
        fs.rmdirSync(dir, { recursive: true })
        this.logger.log('info', '(Autodelete) Removed: ' + dir)
      } else {
        loop = false
      }
    }
  };
}

module.exports = AutoDelete
