// Mock expo/src/winter modules that use import.meta or external modules
// that aren't available in the Jest environment
jest.mock('expo/src/winter/ImportMetaRegistry', () => ({
  ImportMetaRegistry: class ImportMetaRegistry {
    get(_key) {
      return undefined
    }
  },
}))

jest.mock('expo/src/winter/runtime.native', () => {})

jest.mock('@ungap/structured-clone', () => ({
  default: (val) => JSON.parse(JSON.stringify(val)),
}))
