declare module '@react-native-community/netinfo' {
  export interface NetInfoState {
    isConnected: boolean | null
  }

  type NetInfoChangeHandler = (state: NetInfoState) => void

  const NetInfo: {
    addEventListener(listener: NetInfoChangeHandler): () => void
    fetch(): Promise<NetInfoState>
  }

  export default NetInfo
}
