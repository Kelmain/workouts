/**
 * TDD tests for equipment-service.
 * Tests drive the implementation of:
 *   - getEquipment(uid): fetches equipment array from users/{uid}
 *   - updateEquipment(uid, equipment[]): writes equipment array to users/{uid}
 */

jest.mock('@react-native-firebase/firestore', () => {
  const mockGet = jest.fn()
  const mockUpdate = jest.fn()
  const mockDoc = jest.fn(() => ({ get: mockGet, update: mockUpdate }))
  const mockCollection = jest.fn(() => ({ doc: mockDoc }))
  const mockFirestore = { collection: mockCollection }

  return {
    __esModule: true,
    default: jest.fn(() => mockFirestore),
  }
})

import firestore from '@react-native-firebase/firestore'
import { getEquipment, updateEquipment } from '../equipment-service'

function getFirestoreMocks() {
  const fs = (firestore as unknown as jest.Mock)()
  const collection = fs.collection('users')
  const doc = collection.doc('uid-1')
  return {
    mockGet: doc.get as jest.Mock,
    mockUpdate: doc.update as jest.Mock,
    mockDoc: collection.doc as jest.Mock,
  }
}

describe('getEquipment', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns the equipment array from the user document', async () => {
    const { mockGet } = getFirestoreMocks()
    mockGet.mockResolvedValue({
      exists: true,
      data: () => ({ equipment: ['Kettlebells', 'Pull-up bar'] }),
    })

    const result = await getEquipment('uid-1')

    expect(result).toEqual(['Kettlebells', 'Pull-up bar'])
  })

  it('returns empty array when equipment field is missing', async () => {
    const { mockGet } = getFirestoreMocks()
    mockGet.mockResolvedValue({
      exists: true,
      data: () => ({}),
    })

    const result = await getEquipment('uid-1')

    expect(result).toEqual([])
  })

  it('returns empty array when document does not exist', async () => {
    const { mockGet } = getFirestoreMocks()
    mockGet.mockResolvedValue({ exists: false, data: () => null })

    const result = await getEquipment('uid-1')

    expect(result).toEqual([])
  })

  it('queries the users collection using the provided uid', async () => {
    const { mockGet, mockDoc } = getFirestoreMocks()
    mockGet.mockResolvedValue({ exists: false, data: () => null })

    await getEquipment('user-abc')

    const allCalls = mockDoc.mock.calls
    expect(allCalls.some((call: string[]) => call[0] === 'user-abc')).toBe(true)
  })
})

describe('updateEquipment', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('writes the equipment array to users/{uid}', async () => {
    const { mockUpdate } = getFirestoreMocks()
    mockUpdate.mockResolvedValue(undefined)

    await updateEquipment('uid-1', ['Kettlebells', 'Bands'])

    expect(mockUpdate).toHaveBeenCalledWith({ equipment: ['Kettlebells', 'Bands'] })
  })

  it('can write an empty equipment array', async () => {
    const { mockUpdate } = getFirestoreMocks()
    mockUpdate.mockResolvedValue(undefined)

    await updateEquipment('uid-1', [])

    expect(mockUpdate).toHaveBeenCalledWith({ equipment: [] })
  })

  it('uses the correct uid when writing', async () => {
    const { mockUpdate, mockDoc } = getFirestoreMocks()
    mockUpdate.mockResolvedValue(undefined)

    await updateEquipment('uid-xyz', ['Body only'])

    const allCalls = mockDoc.mock.calls
    expect(allCalls.some((call: string[]) => call[0] === 'uid-xyz')).toBe(true)
  })

  it('propagates errors from Firestore', async () => {
    const { mockUpdate } = getFirestoreMocks()
    mockUpdate.mockRejectedValue(new Error('Firestore write failed'))

    await expect(updateEquipment('uid-1', ['Kettlebells'])).rejects.toThrow('Firestore write failed')
  })
})
