const GAUGE_MAX = 329

function setGaugePercent($node: HTMLDivElement, percent: number) {
  const $gaugeCircle = $node.querySelector('.gauge__cirlce-arc')!
  const $gaugePercent = $node.querySelector('.gauge__percent') as HTMLDivElement
  
  const value = GAUGE_MAX * (percent / 100) 

  $gaugeCircle.setAttribute('stroke-dasharray', `${value} ${GAUGE_MAX}`)
  $gaugePercent.innerText = percent.toString()
}

function saveState(state: object) {
  localStorage.setItem('todayAppState', JSON.stringify(state))
}

function getStoredStateOrDefault<T extends object>(defaultState: T): T {
  const stateAsStr = localStorage.getItem('todayAppState')
  if (stateAsStr) {
    return JSON.parse(stateAsStr)
  } else {
    return defaultState
  }
}

function createDiv(styles: string[] = [], content: HTMLElement[] | string = ""): HTMLElement {
    const div = document.createElement('div')
    for (const style of styles)
        div.classList.add(style)
    if (typeof (content) === 'string') {
        div.innerText = content
    } else {
        for (const child of content) {
            div.appendChild(child)
        }
    }
    return div
}