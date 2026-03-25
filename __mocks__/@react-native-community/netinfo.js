const listeners = []

const NetInfo = {
  addEventListener: jest.fn((callback) => {
    listeners.push(callback)
    callback({ isConnected: true })
    return () => {
      const index = listeners.indexOf(callback)
      if (index >= 0) listeners.splice(index, 1)
    }
  }),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
  __listeners: listeners,
}

module.exports = NetInfo
module.exports.default = NetInfo
