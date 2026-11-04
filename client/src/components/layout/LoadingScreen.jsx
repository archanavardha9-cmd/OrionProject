export default function LoadingScreen({ label = 'Preparing the experience' }) {
  return (
    <div className="scene-loader" role="status" aria-label={label}>
      <span className="loader-orbit" />
      <span>{label}</span>
    </div>
  )
}
