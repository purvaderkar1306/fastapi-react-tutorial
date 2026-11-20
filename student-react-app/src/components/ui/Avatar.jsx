import { hueFromString, initials } from '../../utils/student.js'

/** Coloured circle with initials. The colour is always the same for the same name. */
export default function Avatar({ name, large = false }) {
  return (
    <span className={`avatar ${large ? 'avatar-lg' : ''}`} style={{ '--hue': hueFromString(name) }}>
      {initials(name)}
    </span>
  )
}
