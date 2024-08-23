/**
 * Creates the stylesheet content to be injected inside the head
 * of the document
 */
export function createStyleSheet() {
  return `pre samp {
  position: relative;
}
pre samp[hidden="true"] {
  display: none;
}
.dumper-prototype-group {
  opacity: 0.5;
}
.dumper-toggle span {
  display: inline-block;
}
.dumper-toggle[aria-expanded="true"] span {
  transform: rotate(90deg);
}`
}

/**
 * Returns the script tag contents to be injected inside the head
 * of the document
 */
export function createScript() {
  return `function expandGroup(group) {
  const trigger = group.querySelector('button')
  trigger.setAttribute('aria-expanded', 'true')

  const samp = group.querySelector('samp')
  samp.removeAttribute('hidden')
}

function collapseGroup(group) {
  const trigger = group.querySelector('button')
  trigger.removeAttribute('aria-expanded', 'true')

  const samp = group.querySelector('samp')
  samp.setAttribute('hidden', 'true')
}

function dumperActivate(dumpId) {
  document.querySelectorAll(\`#$\{dumpId} .dumper-toggle\`).forEach((trigger) => {
    trigger.addEventListener('click', function (event) {
      const target = event.currentTarget
      const parent = target.parentElement
      const isExpanded = !!target.getAttribute('aria-expanded')

      if (isExpanded) {
        collapseGroup(parent)
        if (event.metaKey) {
          parent.querySelectorAll('.dumper-group').forEach((c) => collapseGroup(c))
        }
      } else {
        expandGroup(parent)
        if (event.metaKey) {
          parent.querySelectorAll('.dumper-group').forEach((c) => expandGroup(c))
        }
      }
    })
  })
}`
}
