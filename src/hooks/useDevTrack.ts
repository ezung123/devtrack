import { useContext } from 'react'
import { DevTrackContext, type DevTrackContextType } from '../context/DevTrackContext'

export function useDevTrack(): DevTrackContextType {
  const context = useContext(DevTrackContext)
  if (!context) {
    throw new Error('useDevTrack must be used within a DevTrackProvider')
  }
  return context
}
