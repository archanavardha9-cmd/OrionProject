// MallScene.jsx — Unified Orion Mall Walkthrough Component
// Forwards directly to MallWalkthrough to ensure complete architectural consistency
import MallWalkthrough from './MallWalkthrough'

export default function MallScene(props) {
  return <MallWalkthrough {...props} />
}
