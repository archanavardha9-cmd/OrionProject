import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { adjacentFloorNumber, FLOOR_HEIGHT, floorName } from '../../data/floors'

const WALK_SPEED = 1.8
const EYE_HEIGHT = 1.7

const WalkthroughControls = forwardRef(function WalkthroughControls({
  floor = 0,
  onPositionChange = () => {},
  onApproachTransit = () => {},
  hoveredStoreRef = null,
  touchVector = null, // { x, y } from mobile controls
}, ref) {
  const { camera, gl } = useThree()

  const floorY = floor * FLOOR_HEIGHT

  // Internal movement state
  const posRef = useRef(new THREE.Vector3(0, floorY + EYE_HEIGHT, -11))
  const targetPosRef = useRef(null)

  const yawRef = useRef(Math.PI)
  const yawTargetRef = useRef(Math.PI)
  const pitchRef = useRef(0) // Look up/down clamped
  const pitchTargetRef = useRef(0)

  const keysRef = useRef({ w: false, a: false, s: false, d: false })
  const isDraggingRef = useRef(false)
  const lastMouseRef = useRef({ x: 0, y: 0 })
  const stepTimeRef = useRef(0)
  const positionReportTimerRef = useRef(0)
  const lastReportedPositionRef = useRef(new THREE.Vector3(0, floorY + EYE_HEIGHT, -11))
  const activeTransitRef = useRef('')

  // Expose controls methods to parent component
  useImperativeHandle(ref, () => ({
    moveToPoint: (point) => {
      targetPosRef.current = new THREE.Vector3(
        THREE.MathUtils.clamp(point.x, -2.5, 2.5),
        floorY + EYE_HEIGHT,
        THREE.MathUtils.clamp(point.z, -13, 13)
      )
    },
    teleportTo: (x, z, targetYaw = Math.PI) => {
      posRef.current.set(x, floorY + EYE_HEIGHT, z)
      yawRef.current = targetYaw
      yawTargetRef.current = targetYaw
      pitchRef.current = 0
      pitchTargetRef.current = 0
      targetPosRef.current = null
    },
    reset: () => {
      targetPosRef.current = new THREE.Vector3(0, floorY + EYE_HEIGHT, -11)
      yawTargetRef.current = Math.PI
      pitchTargetRef.current = 0
    },
    focusStore: (store) => {
      if (!store?.position) return
      const dx = store.position.x - posRef.current.x
      const dz = store.position.z - posRef.current.z
      yawTargetRef.current = Math.atan2(-dx, -dz)
      pitchTargetRef.current = 0
      targetPosRef.current = null
    },
  }), [floorY])

  // Keep camera at active floor level when floor changes
  useEffect(() => {
    posRef.current.y = floorY + EYE_HEIGHT
    camera.position.y = floorY + EYE_HEIGHT
    targetPosRef.current = null
  }, [floor, floorY, camera])

  // Desktop keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase()
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea, select, [contenteditable="true"]')) return
      if (document.activeElement !== gl.domElement) return
      if (key === 'escape') {
        keysRef.current = { w: false, a: false, s: false, d: false }
        if (document.pointerLockElement === gl.domElement) document.exitPointerLock()
        gl.domElement.blur()
        return
      }
      if (key === 'w' || key === 'arrowup') keysRef.current.w = true
      if (key === 's' || key === 'arrowdown') keysRef.current.s = true
      if (key === 'a' || key === 'arrowleft') keysRef.current.a = true
      if (key === 'd' || key === 'arrowright') keysRef.current.d = true
      targetPosRef.current = null // Cancel click-to-move when manual keys are pressed
    }

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase()
      if (key === 'w' || key === 'arrowup') keysRef.current.w = false
      if (key === 's' || key === 'arrowdown') keysRef.current.s = false
      if (key === 'a' || key === 'arrowleft') keysRef.current.a = false
      if (key === 'd' || key === 'arrowright') keysRef.current.d = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gl])

  // Desktop cursor position and touch dragging both provide a damped look-around.
  useEffect(() => {
    const dom = gl.domElement

    const onPointerDown = (e) => {
      if (e.pointerType === 'touch' || e.pointerType === 'pen') {
        isDraggingRef.current = true
        lastMouseRef.current = { x: e.clientX, y: e.clientY }
      }
      dom.focus({ preventScroll: true })
    }

    const onPointerMove = (e) => {
      if (e.pointerType === 'touch' || e.pointerType === 'pen') {
        if (!isDraggingRef.current) return
        const dx = e.clientX - lastMouseRef.current.x
        const dy = e.clientY - lastMouseRef.current.y
        lastMouseRef.current = { x: e.clientX, y: e.clientY }
        yawTargetRef.current = THREE.MathUtils.clamp(
          yawTargetRef.current - dx * 0.0014,
          Math.PI - 0.38,
          Math.PI + 0.38
        )
        pitchTargetRef.current = THREE.MathUtils.clamp(
          pitchTargetRef.current - dy * 0.0012,
          -0.28,
          0.28
        )
        return
      }

      if (hoveredStoreRef?.current) return
      const bounds = dom.getBoundingClientRect()
      if (!bounds.width || !bounds.height) return
      const cursorX = THREE.MathUtils.clamp(((e.clientX - bounds.left) / bounds.width) * 2 - 1, -1, 1)
      const cursorY = THREE.MathUtils.clamp(((e.clientY - bounds.top) / bounds.height) * 2 - 1, -1, 1)
      yawTargetRef.current = Math.PI + cursorX * 0.16
      pitchTargetRef.current = THREE.MathUtils.clamp(-cursorY * 0.11, -0.11, 0.11)
    }

    const onPointerUp = () => {
      isDraggingRef.current = false
    }

    const onPointerLeave = () => {
      isDraggingRef.current = false
      if (hoveredStoreRef) hoveredStoreRef.current = null
    }

    dom.tabIndex = 0
    dom.setAttribute('aria-label', 'Interactive 3D mall Explorer. Move the cursor or touch-drag to look around; use W A S D to walk.')
    dom.style.touchAction = 'pan-y'
    document.body.style.cursor = ''
    dom.addEventListener('pointerdown', onPointerDown)
    dom.addEventListener('pointermove', onPointerMove)
    dom.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    return () => {
      dom.removeEventListener('pointerdown', onPointerDown)
      dom.removeEventListener('pointermove', onPointerMove)
      dom.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [gl, hoveredStoreRef])

  // Animation frame loop: apply velocity, collisions, smooth target interpolation
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)
    let moved = false

    // 1. Check if user or preview is driving movement
    const keys = keysRef.current
    let moveForward = 0
    let moveStrafe = 0

    if (keys.w) moveForward += 1
    if (keys.s) moveForward -= 1
    if (keys.d) moveStrafe += 1
    if (keys.a) moveStrafe -= 1

    // Mobile touch joystick input
    if (touchVector && (touchVector.x !== 0 || touchVector.y !== 0)) {
      moveForward -= touchVector.y
      moveStrafe += touchVector.x
    }

    // 2. Interpolate towards target position (from store select or floor click)
    if (targetPosRef.current) {
      const dist = posRef.current.distanceTo(targetPosRef.current)
      if (dist > 0.15) {
        posRef.current.lerp(targetPosRef.current, 1 - Math.exp(-2.2 * dt))
        moved = true
      } else {
        targetPosRef.current = null
      }
    }

    if (!hoveredStoreRef?.current) {
      const yawDifference = Math.atan2(
        Math.sin(yawTargetRef.current - yawRef.current),
        Math.cos(yawTargetRef.current - yawRef.current)
      )
      const lookDamping = 1 - Math.exp(-4.2 * dt)
      yawRef.current += yawDifference * lookDamping
      pitchRef.current = THREE.MathUtils.lerp(pitchRef.current, pitchTargetRef.current, lookDamping)
    }

    // 3. Manual keyboard/touch movement
    if (moveForward !== 0 || moveStrafe !== 0) {
      moved = true
      const forwardDir = new THREE.Vector3(-Math.sin(yawRef.current), 0, -Math.cos(yawRef.current)).normalize()
      const rightDir = new THREE.Vector3(Math.cos(yawRef.current), 0, -Math.sin(yawRef.current)).normalize()

      const moveVec = new THREE.Vector3()
      moveVec.addScaledVector(forwardDir, moveForward)
      moveVec.addScaledVector(rightDir, moveStrafe)
      moveVec.normalize()

      const speed = WALK_SPEED * dt
      posRef.current.x += moveVec.x * speed
      posRef.current.z += moveVec.z * speed
    }

    // 4. Enforce Walkable Corridor Boundaries (No walking through glass/walls)
    posRef.current.x = THREE.MathUtils.clamp(posRef.current.x, -2.8, 2.8)
    posRef.current.z = THREE.MathUtils.clamp(posRef.current.z, -13.5, 13.5)

    // 5. Walking Head Bob (Subtle realistic eye-level sway)
    if (moved) {
      stepTimeRef.current += dt * 8.5
      const bob = Math.sin(stepTimeRef.current) * 0.012
      camera.position.y = floorY + EYE_HEIGHT + bob
    } else {
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, floorY + EYE_HEIGHT, 1 - Math.exp(-4 * dt))
    }

    // Apply X and Z position to camera
    camera.position.x = posRef.current.x
    camera.position.z = posRef.current.z

    // 6. Camera Look Direction (Euler from Pitch & Yaw)
    const euler = new THREE.Euler(pitchRef.current, yawRef.current, 0, 'YXZ')
    camera.quaternion.setFromEuler(euler)

    positionReportTimerRef.current += dt
    if (positionReportTimerRef.current >= 0.12 && posRef.current.distanceTo(lastReportedPositionRef.current) > 0.08) {
      positionReportTimerRef.current = 0
      lastReportedPositionRef.current.copy(posRef.current)
      onPositionChange([posRef.current.x, posRef.current.y, posRef.current.z])
    }

    // 7. Check Proximity to Transit (Escalators at z ~ 10.5, x ~ -1.6; Elevator at z ~ 10.5, x ~ 2.5)
    const distToEscalator = Math.hypot(posRef.current.x - (-1.6), posRef.current.z - 10.5)
    const distToElevator = Math.hypot(posRef.current.x - 2.5, posRef.current.z - 10.5)
    let transit = null

    if (distToEscalator < 2.2) {
      const targetFloor = adjacentFloorNumber(floor)
      transit = {
        type: 'escalator',
        label: `Take the escalator to ${floorName(targetFloor)}`,
        targetFloor,
      }
    } else if (distToElevator < 2.0) {
      const targetFloor = adjacentFloorNumber(floor)
      transit = {
        type: 'elevator',
        label: `Take the elevator to ${floorName(targetFloor)}`,
        targetFloor,
      }
    }

    const transitKey = transit ? `${transit.type}:${transit.targetFloor}` : ''
    if (activeTransitRef.current !== transitKey) {
      activeTransitRef.current = transitKey
      onApproachTransit(transit)
    }
  })

  return null
})

export default WalkthroughControls
