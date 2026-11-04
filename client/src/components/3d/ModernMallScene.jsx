// ModernMallScene.jsx — Unified Orion Mall Walkthrough Component
// Forwards directly to MallWalkthrough to guarantee identical architectural walkthrough on all pages
import MallWalkthrough from './MallWalkthrough'

export default function ModernMallScene(props) {
  return <MallWalkthrough {...props} />
}
