/**
 * Creates the stylesheet content to be injected inside the head
 * of the document
 */
export function createStyleSheet() {
  return `.dumper-dump {
  padding: 4px;
  border-radius: 4px;
  font-size: 13px;
  font-family: Menlo, Monaco, Consolas, monospace;
}
.dumper-dump .dumper-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 8px 6px 8px;
}
.dumper-dump .dumper-source {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 10px;
}
.dumper-dump pre, .dumper-dump code {
  font-family: Menlo, Monaco, Consolas, monospace;
}
.dumper-dump pre {
  line-height: 24px;
  font-size: 15px;
  overflow-x: scroll;
  position:relative;
  z-index:99999;
  padding: 10px 15px;
  border-radius: 4px;
  margin: 0;
}
.dumper-dump pre samp {
  position: relative;
}
.dumper-dump pre samp[hidden="true"] {
  display: none;
}
.dumper-dump .dumper-prototype-group {
  opacity: 0.5;
}
.dumper-dump .dumper-toggle span {
  display: inline-block;
  position: relative;
  top: 3px;
}
.dumper-dump .dumper-toggle[aria-expanded="true"] span {
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
